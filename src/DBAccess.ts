import { KEYWORD_TYPES } from "./constants";
import IEI from 'indexeddb-export-import';
import { json2csvAsync, csv2jsonAsync } from "json-2-csv";
import { DB_TABLES } from "./constants";

const VERSION = 2;
const DB_NAME = "TransactionApp"

const ASSETS_TABLE = "ASSETS"
const EXCHANGES_TABLE = "EXCHANGES"
const PAYMENTS_TABLE = "PAYMENTS"
const TRANSACTIONS_TABLE = "TRANSACTIONS"

const ERROR_DB_READY = "Accessing DB before it's ready";

//Should be the same as the ones in ReportView.tsx
const MonthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

class DBAccess {
    private _isReady = false;
    private _idb: IDBDatabase | null = null

    constructor() {
        const request = window.indexedDB.open(DB_NAME, VERSION);
        request.onerror = (e) => {
            //TODO
        }
        request.onsuccess = (e) => {
            console.log('opened indexedDB')
            this._idb = request.result;
            this._isReady = true;
            this._handleReadyCallbacks()
        }
        request.onupgradeneeded = (e: IDBVersionChangeEvent) => {
            //this calls on first created and when version upgrades
            //could do initialisations here.
            const idb = request.result;
            idb.createObjectStore(ASSETS_TABLE, { keyPath: "name" })

            idb.createObjectStore(EXCHANGES_TABLE, { keyPath: 'name' })

            idb.createObjectStore(PAYMENTS_TABLE, { keyPath: "name" })

            const transactionsObjectStore = idb.createObjectStore(TRANSACTIONS_TABLE, { keyPath: "id", autoIncrement: true })
            transactionsObjectStore.createIndex("date", "date")
            transactionsObjectStore.createIndex("from", "from")
            transactionsObjectStore.createIndex('to', 'to')
            transactionsObjectStore.createIndex('exchange', 'exchange')
            transactionsObjectStore.createIndex('payment', 'payment')
            transactionsObjectStore.createIndex('dual', ['payment', 'exchange'])

        }
    }

    private _readyCallbacks: (() => void)[] = []

    notifyWhenReady(cb: () => void) {
        if (this._isReady) {
            cb();
        } else {
            this._readyCallbacks.push(cb);
        }
    }

    //should only be called when db open request
    private _handleReadyCallbacks() {

        this._readyCallbacks.forEach((e) => e())
        this._readyCallbacks.length = 0;
    }

    getList(type: KEYWORD_TYPES): Promise<{ name: string }[]> {
        if (!this._idb)
            throw (new Error(ERROR_DB_READY))

        let tableName = null
        switch (type) {
            case KEYWORD_TYPES.ASSETS:
                tableName = ASSETS_TABLE
                break;
            case KEYWORD_TYPES.EXCHANGES:
                tableName = EXCHANGES_TABLE
                break;
            case KEYWORD_TYPES.PAYMENTS:
                tableName = PAYMENTS_TABLE
                break;
            default:
                throw new Error("invalid type in getList")
        }

        const t = this._idb.transaction([tableName], 'readonly')
        const r = t.objectStore(tableName).getAll()

        return new Promise((resolve, reject) => {
            r.onerror = (e) => {
                console.error("error getAssetsList", e)
                reject(e)
            }
            r.onsuccess = (e) => {
                const list = r.result;
                resolve(list)
            }
        });

    }


    addKeyword(keywordName: string, type: KEYWORD_TYPES): Promise<boolean> {
        if (!this._idb)
            throw (new Error(ERROR_DB_READY))
        console.log("DBAccess::addKeyword")
        let tableName = null
        switch (type) {
            case KEYWORD_TYPES.ASSETS:
                tableName = ASSETS_TABLE
                break;
            case KEYWORD_TYPES.EXCHANGES:
                tableName = EXCHANGES_TABLE
                break;
            case KEYWORD_TYPES.PAYMENTS:
                tableName = PAYMENTS_TABLE
                break;
            default:
                throw new Error(`unknown keyword type in addKeyword: ${type}`)
        }
        const t = this._idb.transaction([tableName], 'readwrite');
        const r = t.objectStore(tableName).add({ name: keywordName });
        return new Promise((rs, rj) => {
            r.onerror = (e) => {
                console.error('could not add keyword:', e)
                rj(e)
            }
            r.onsuccess = (e) => {
                console.log('added keyword')
                this._cachedDBJSON = null;//invalidate cached DB json as it has changed
                rs(true)
            }
        });


    }

    addTransaction(date: string, from: string, fromAmount: number, to: string, toAmount: number, exchange: string, payment: string): Promise<boolean> {
        if (!this._idb) {
            throw (new Error(ERROR_DB_READY))
        }
        console.log("DBAccess::addTransaction")
        let obj = {
            date, from, fromAmount, to, toAmount, exchange, payment
        }
        const t = this._idb.transaction([TRANSACTIONS_TABLE], 'readwrite')
        const r = t.objectStore(TRANSACTIONS_TABLE).add(obj);
        return new Promise((rs, rj) => {
            r.onerror = (e) => {
                console.error("could not add transaction")
                rj(e)
            }
            r.onsuccess = (e) => {
                console.log("added transaction")
                this._cachedDBJSON = null;//invalidate cached DB json as it has changed
                rs(true)

            }
        });

    }

    //if a criteria is any, no need to check
    needCheckForCriteria(criteria: string) {
        return criteria.toLowerCase() !== 'any'
    }

    cursorFitsPayment(transactionCursor: IDBCursorWithValue, payment: string): boolean {
        return transactionCursor.value.payment === payment;
    }
    cursorFitsExchange(tCursor: IDBCursorWithValue, exchange: string): boolean {
        return tCursor.value.exchange === exchange;
    }
    /*
        year: 2000, 2021, 2022
        4 character representation of year
    */
    cursorFitsYear(tCursor: IDBCursorWithValue, year: string): boolean {
        const strDate: string = tCursor.value.date;
        const d = new Date(strDate)
        return d.getFullYear() === Number(year);
    }
    //month in string, full January to December, as listedin report view
    cursorFitsMonth(tCursor: IDBCursorWithValue, month: string): boolean {
        const d = new Date(tCursor.value.date)
        const iMonth = d.getMonth();//from 0~11, corresponding to Jan to Dec
        const strMonth = MonthNames[iMonth]
        return strMonth === month
    }


    getTransactions(exchange: string, payment: string, month: string, year: string): Promise<any[]> {
        if (!this._idb)
            throw new Error(ERROR_DB_READY)

        console.log("DBAccess::getTransactions")

        const t = this._idb.transaction([TRANSACTIONS_TABLE], 'readonly')
        const os = t.objectStore(TRANSACTIONS_TABLE)

        return new Promise(((rs, rj) => {

            const r = os.openCursor();
            const filteredList: any[] = []
            const shouldCheckPayment = this.needCheckForCriteria(payment)
            const shouldCheckExchange = this.needCheckForCriteria(exchange)
            const shouldCheckYear = this.needCheckForCriteria(year)
            const shouldCheckMonth = this.needCheckForCriteria(month)
            r.onsuccess = (e) => {
                const c = r.result;
                if (c) {
                    let fitExchange = true
                    let fitPayment = true
                    let fitYear = true
                    let fitMonth = true
                    if (shouldCheckExchange) {
                        fitExchange = this.cursorFitsExchange(c, exchange)
                    }
                    if (shouldCheckPayment) {
                        fitPayment = this.cursorFitsPayment(c, payment)
                    }
                    if (shouldCheckYear) {
                        fitYear = this.cursorFitsYear(c, year)
                    }
                    if (shouldCheckMonth) {
                        fitMonth = this.cursorFitsMonth(c, month)
                    }
                    if (fitExchange && fitPayment && fitYear && fitMonth)
                        filteredList.push(c.value)
                    c.continue();
                } else {
                    //EOL of cursor
                    console.log('getTransactions:', filteredList)
                    rs(filteredList);
                }
            }
            r.onerror = (e) => {
                console.error("unable to getTransactions")
                rj(e);
            }
        }));

    }

    getLatestTransactions(amount: number): Promise<any[]> {
        if (!this._idb)
            throw new Error(ERROR_DB_READY)
        if (amount <= 0)
            throw new Error("Invalid amount of transactions to get")

        const t = this._idb.transaction([TRANSACTIONS_TABLE], 'readonly')
        const os = t.objectStore(TRANSACTIONS_TABLE)
        return new Promise((rs, rj) => {
            const req = os.openCursor(null, 'prev')
            let cnt = 0
            const arr: any[] = []
            req.onsuccess = (e) => {
                const c = req.result
                if (c && cnt < amount) {
                    arr.push(c.value)
                    cnt++;
                    c.continue()
                } else {
                    rs(arr)
                }
            }
            req.onerror = (e) => {
                rj(e)
            }

        });
    }

    private _cachedDBJSON: any = null
    downloadCSVFor(table: DB_TABLES) {
        if (!this._idb)
            throw new Error(ERROR_DB_READY)

        let targetObjectStoreName: string;
        switch (table) {
            case DB_TABLES.ASSETS:
                targetObjectStoreName = ASSETS_TABLE
                break;
            case DB_TABLES.EXCHANGES:
                targetObjectStoreName = EXCHANGES_TABLE
                break;
            case DB_TABLES.PAYMENTS:
                targetObjectStoreName = PAYMENTS_TABLE
                break;
            case DB_TABLES.TRANSACTIONS:
                targetObjectStoreName = TRANSACTIONS_TABLE
                break;
            default:
                throw new Error(`Unknown DB_TABLES : ${table}`)
        }

        if (!this._cachedDBJSON) {
            this.getDBJSON().then((json) => {
                const obj = JSON.parse(json)
                this._cachedDBJSON = obj

                const targetJSObj: object[] = obj[targetObjectStoreName]
                this._convertObjToCSV(targetJSObj).then((str) => {
                    const now = new Date();
                    const offset = now.getTimezoneOffset();
                    const date = new Date(now.getTime() - offset * 60 * 1000);
                    const dateTimeString = date.toISOString().replace(/[^0-9]/g, '').substr(0, 14);
                    this.downloadFile(`TApp_${targetObjectStoreName}_${dateTimeString}.csv`, str, 'text/csv')
                })
            })
        } else {
            const obj = this._cachedDBJSON
            const targetJSObj: object[] = obj[targetObjectStoreName]
            this._convertObjToCSV(targetJSObj).then((str) => {
                const now = new Date();
                const offset = now.getTimezoneOffset();
                const date = new Date(now.getTime() - offset * 60 * 1000);
                const dateTimeString = date.toISOString().replace(/[^0-9]/g, '').substr(0, 14);
                this.downloadFile(`TApp_${targetObjectStoreName}_${dateTimeString}.csv`, str, 'text/csv')
            })
        }

    }
    private _convertObjToCSV(jsObject: object[]): Promise<string> {
        return json2csvAsync(jsObject)
    }

    convertCSVToJSON = (csv: string): Promise<any[]> => {
        return csv2jsonAsync(csv)
    }


    importCSV = (type: DB_TABLES, csv: string): Promise<void> => {
        if (!this._idb)
            throw new Error(ERROR_DB_READY)
        let targetObjectStoreName = null
        switch (type) {
            case DB_TABLES.ASSETS:
                targetObjectStoreName = ASSETS_TABLE
                break;
            case DB_TABLES.EXCHANGES:
                targetObjectStoreName = EXCHANGES_TABLE
                break;
            case DB_TABLES.PAYMENTS:
                targetObjectStoreName = PAYMENTS_TABLE
                break;
            case DB_TABLES.TRANSACTIONS:
                targetObjectStoreName = TRANSACTIONS_TABLE
                break;
            default:
                throw new Error(`Unknown table type : ${type}`)
        }
        const t = this._idb.transaction([targetObjectStoreName], 'readwrite')
        const os = t.objectStore(targetObjectStoreName)
        return new Promise((rs, rj) => {
            this.convertCSVToJSON(csv).then((arr) => {
                os.clear()
                arr.forEach(e => os.add(e))
                t.oncomplete = () => {
                    rs()
                }
                t.onerror = (e) => {
                    rj(e)
                }
            })

        })

    }

    private getDBJSON(): Promise<string> {
        if (!this._idb)
            throw new Error(ERROR_DB_READY)

        return new Promise((rs, rj) => {
            IEI.exportToJsonString(this._idb, (err: string, json: string) => {
                if (err) {
                    console.error('error exportToJsonString:', err)
                    rj(err)
                    return
                }
                rs(json);
            })
        });

    }
    private downloadFile(fileName: string, fileString: string, fileType: string) {
        var a = document.createElement("a");
        var file = new Blob([fileString], { type: fileType });
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
    }

    clearTable(table: string): Promise<boolean> {
        if (!this._idb)
            throw new Error(ERROR_DB_READY)

        let targetObjectStoreName = null
        switch (table) {
            case DB_TABLES.ASSETS:
                targetObjectStoreName = ASSETS_TABLE
                break;
            case DB_TABLES.EXCHANGES:
                targetObjectStoreName = EXCHANGES_TABLE
                break;
            case DB_TABLES.PAYMENTS:
                targetObjectStoreName = PAYMENTS_TABLE
                break;
            case DB_TABLES.TRANSACTIONS:
                targetObjectStoreName = TRANSACTIONS_TABLE
                break;
            default:
                throw new Error(`Unknown table type : ${table}`)
        }
        const t = this._idb.transaction([targetObjectStoreName], 'readwrite')
        const os = t.objectStore(targetObjectStoreName)
        return new Promise((rs, rj) => {
            const req = os.clear()
            req.onsuccess = () => {
                console.log('cleared table :', table)
                rs(true)
            }
            req.onerror = (e) => {
                console.error('unable to clear table : ', table)
                rj(e)
            }
        });
    }

    deleteTransaction(transactionID: number): Promise<void> {
        if (!this._idb)
            throw new Error(ERROR_DB_READY)
        const t = this._idb.transaction([TRANSACTIONS_TABLE], 'readwrite')
        const os = t.objectStore(TRANSACTIONS_TABLE)
        return new Promise((rs, rj) => {
            const req = os.delete(transactionID)
            req.onsuccess = () => {
                rs()
            }
            req.onerror = (e) => {
                rj(e)
            }
        });
    }

}


const dbAccess = new DBAccess()


export { dbAccess };