export enum KEYWORD_TYPES {
    ASSETS = "ASSETS",
    EXCHANGES = "EXCHANGES",
    PAYMENTS = "PAYMENTS"
}
export enum PAGE {
    OVERVIEW, ADD_TRANSACTION, LABELS, SETTINGS
}
export enum DB_TABLES {
    TRANSACTIONS = "Transactions",
    ASSETS = "Assets",
    EXCHANGES = "Exchanges",
    PAYMENTS = "Payments"
}

export const TRANSACTION_FIELDS = ["id", "date", "exchange", "payment", "from", "fromAmount", "to", "toAmount"]
export const NON_TRANSACTION_FIELDS = ["name"]

export const ERROR_MESSAGES = {
    INCOMPAT_TRANSACTION_CSV: `Incompatible Transaction CSV Headers\nExpecting ${TRANSACTION_FIELDS} fields.`,
    INCOMPAT_NON_TRANSACTION_CSV: `Incompatible CSV Headers\nExpecting ${NON_TRANSACTION_FIELDS} fields.`
}