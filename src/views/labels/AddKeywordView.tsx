import React, { CSSProperties } from "react";
import { KEYWORD_TYPES } from "../../constants";
import { dbAccess } from '../../DBAccess'

interface Props {
    selectedType: KEYWORD_TYPES
    addedKeywordCallback: () => void
}
const viewStyle: CSSProperties = {
    marginBottom: '8px'
}
const buttonStyle: CSSProperties = {
    marginLeft: '8px'
}
class AddKeywordView extends React.Component<Props> {

    addName: React.RefObject<HTMLInputElement>;

    constructor(p: Props) {
        super(p)
        this.addName = React.createRef<HTMLInputElement>()
    }

    onClickAdd = (e: React.FormEvent<HTMLFormElement>) => {
        console.log('trying to add name:', this.addName.current?.value, ' of type:', this.props.selectedType)
        //TODO: some validation on value before adding and updating list
        e.preventDefault();//otherwise it navigates page...
        const name = this.addName.current?.value;
        if (name) {
            dbAccess.addKeyword(name, this.props.selectedType).then(
                () => {//resolve
                    //clear text box
                    if (this.addName.current)
                        this.addName.current.value = ""
                    //update list
                    this.props.addedKeywordCallback()
                },
                (e) => {//reject

                });
        }
    }
    render(): React.ReactNode {
        return <div id="addKeyword" style={viewStyle}>
            <form onSubmit={this.onClickAdd}>
                <label>Name : </label>
                <input ref={this.addName} type="text" />
                <input type="submit" value={"Add " + this.props.selectedType} style={buttonStyle} />
            </form>

        </div>
    }
}

export default AddKeywordView;