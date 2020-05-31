// TextSearchBox.jsx
import React from "react";
import TextField from "material-ui/TextField";

class TextSearchBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchString: ''
        };
        this.doTextSearch = this.doTextSearch.bind(this);
        this.focusOnInput = this.focusOnInput.bind(this);
    }

    focusOnInput() {
        this.textInput.focus();
    }

    onEnterPress = (e) => {
        if(e.keyCode === 13 && e.shiftKey === false) {
            e.preventDefault();
            this.doTextSearch();
        }
    };

    doTextSearch() {
        const searchStringURI = encodeURIComponent(this.props.searchString.toLowerCase());
        const colorString = this.props.selectedColor ? encodeURIComponent(this.props.selectedColor) : '';
        this.props.history.push(`/textsearch?search=${searchStringURI}&sex=${this.props.sex}&clr=${colorString}`);
    }

    render() {
        return (
            <div
                // className="inner-text-search-box"
            >
                <TextField
                    // autoFocus="autofocus"
                    className="text-search-input"
                    // hintText={this.state.searchString ? this.state.searchString : "Purple denim jeans or..."}
                    value={this.props.searchString.toUpperCase()}
                    inputStyle={{
                        fontWeight: '900',
                        fontSize: '1.2rem'
                    }}
                    floatingLabelText="What are you looking for?"
                    floatingLabelStyle={{
                        color: 'black',
                        fontSize: '1.2rem',
                        fontWeight: '400',
                    }}
                    name="searchString"
                    onChange={this.props.handleTextInputChange.bind(this)}
                    onKeyDown={this.onEnterPress}
                    underlineFocusStyle={{
                        borderBottom: '2px solid rgb(0, 0, 0)'
                    }}
                    underlineDisabledStyle={{
                        borderBottom: '0px solid rgb(0, 0, 0)'
                    }}
                    autoComplete="off"
                    onFocus={() => {
                        // if (this.props.colorPickerShown === false) {
                        //     this.props.showColorPicker(true);
                        // }
                        this.props.history.push(`/textcolorinput`);
                    }}
                    // onBlur={() => {
                    //     this.props.showColorPicker(false);
                    // }}
                    ref={(input) => { this.textInput = input; }}
                />
                <div className="text-search-button" onClick={() => {this.doTextSearch()}}>
                    <div className="search-icon" />
                </div>
            </div>
        )
    }
}

export default TextSearchBox;
