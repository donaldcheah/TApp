import React, { CSSProperties } from 'react';

import AddKeywordView from './labels/AddKeywordView';

import AssetsView from './labels/AssetsView';
import ExchangesView from './labels/ExchangesView';
import PaymentsView from './labels/PaymentsView';

import { dbAccess } from '../DBAccess';

import { KEYWORD_TYPES } from '../constants'

interface Props { }
interface States {
    selectedType: KEYWORD_TYPES,
    assetsList: string[],
    exchangesList: string[],
    paymentsList: string[]
}

const viewStyle: CSSProperties = {
    border: '1px solid',
    borderRadius: '8px',
    marginTop: '8px',
    padding: '8px'
}
const entryRowStyle: CSSProperties = {
    marginBottom: '8px',
}

class KeywordsView extends React.Component<Props, States> {
    constructor(p: Props) {
        super(p)
        this.state = {
            selectedType: KEYWORD_TYPES.ASSETS,
            assetsList: [],
            exchangesList: [],
            paymentsList: []
        }
    }

    //uses updater function in setState as all 3 fetches depend on each other
    //otherwise causes race condition as setState is async.
    fetchAssetsList = () => {
        dbAccess.getList(KEYWORD_TYPES.ASSETS).then(
            (list) => {
                this.setState(
                    (s) => {
                        return {
                            ...s,
                            assetsList: list.map((e) => e.name)
                        }
                    }
                )
            },
            (e) => {
                console.log('error getting list:', e)
            }
        )
    }
    fetchExchangesList = () => {
        dbAccess.getList(KEYWORD_TYPES.EXCHANGES).then(
            (list) => {
                this.setState(
                    (s) => {
                        return {
                            ...s,
                            exchangesList: list.map((e) => e.name)
                        }
                    }
                )
            },
            (e) => {
                console.log('error getting list:', e)
            }
        )
    }
    fetchPaymentsList = () => {
        dbAccess.getList(KEYWORD_TYPES.PAYMENTS).then(
            (list) => {
                this.setState(
                    (s) => {
                        return {
                            ...s,
                            paymentsList: list.map((e) => e.name)
                        }
                    }
                )
            },
            (e) => {
                console.log('error getting list:', e)
            }
        )
    }

    componentDidMount(): void {
        this.fetchPaymentsList()
        this.fetchAssetsList()
        this.fetchExchangesList()
    }

    updateCurrentList(): void {
        switch (this.state.selectedType) {
            case KEYWORD_TYPES.ASSETS:
                this.fetchAssetsList()
                break;
            case KEYWORD_TYPES.EXCHANGES:
                this.fetchExchangesList()
                break;
            case KEYWORD_TYPES.PAYMENTS:
                this.fetchPaymentsList()
                break;
        }
    }

    onKeywordTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOptionID = e.target.selectedOptions[0].id
        let targetType = KEYWORD_TYPES.ASSETS
        switch (selectedOptionID) {
            case KEYWORD_TYPES.ASSETS:
                targetType = KEYWORD_TYPES.ASSETS;
                break;
            case KEYWORD_TYPES.EXCHANGES:
                targetType = KEYWORD_TYPES.EXCHANGES;
                break;
            case KEYWORD_TYPES.PAYMENTS:
                targetType = KEYWORD_TYPES.PAYMENTS;
                break;
        }
        this.setState({ ...this.state, selectedType: targetType })
    }

    renderListByType = (type: KEYWORD_TYPES) => {
        switch (type) {
            case KEYWORD_TYPES.ASSETS:
                return <AssetsView list={this.state.assetsList} />
            case KEYWORD_TYPES.EXCHANGES:
                return <ExchangesView list={this.state.exchangesList} />
            case KEYWORD_TYPES.PAYMENTS:
                return <PaymentsView list={this.state.paymentsList} />
            default:
                /** Unknown type? Something wrong */
                console.error("Unknown type:", type);
                return <div>ERROR! Unknown type {type}</div>
        }
    }

    onAddedKeyword = () => {
        this.updateCurrentList()
    }

    render(): React.ReactNode {
        return <div id="keywords" style={viewStyle}>
            {/* <p>in keywords view</p> */}
            <div id="keywords.type" style={entryRowStyle}>
                <label>Keyword Type : </label>
                <select onChange={this.onKeywordTypeChange}>
                    <option id={KEYWORD_TYPES.ASSETS} >Assets</option>
                    <option id={KEYWORD_TYPES.EXCHANGES}>Exchanges</option>
                    <option id={KEYWORD_TYPES.PAYMENTS}>Payments</option>
                </select>
            </div>
            <AddKeywordView selectedType={this.state.selectedType} addedKeywordCallback={this.onAddedKeyword} />
            {this.renderListByType(this.state.selectedType)}

        </div>
    }
}

export default KeywordsView;