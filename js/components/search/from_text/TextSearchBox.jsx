// ResultCard.jsx
import React from "react";
import TextField from "material-ui/TextField";

class TextSearchBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchString: ''
        };

        this.handleTextInputChange = this.handleTextInputChange.bind(this);
        this.doTextSearch = this.doTextSearch.bind(this);
    }

    handleTextInputChange(event) {
        const value =  event.target.value;
        const name = event.target.name;
        this.setState({
            [name]: value
        });
    }

    onEnterPress = (e) => {
        if(e.keyCode === 13 && e.shiftKey === false) {
            e.preventDefault();
            this.doTextSearch();
        }
    };

    doTextSearch() {
        const searchStringURI = encodeURIComponent(this.state.searchString.toLowerCase());
        this.props.history.push(`/textsearch?search=${searchStringURI}&sex=${this.props.sex}`);
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
                    value={this.state.searchString.toUpperCase()}
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
                    onChange={this.handleTextInputChange.bind(this)}
                    onKeyDown={this.onEnterPress}
                    underlineFocusStyle={{
                        borderBottom: '2px solid rgb(0, 0, 0)'
                    }}
                    underlineDisabledStyle={{
                        borderBottom: '0px solid rgb(0, 0, 0)'
                    }}
                    autoComplete="off"
                />
                <div className="text-search-button" onClick={() => {this.doTextSearch()}}>
                    <div className="search-icon" />
                    {/*<div className="search-text"> search</div>*/}
                </div>
            </div>
        )
    }
}

export default TextSearchBox;
