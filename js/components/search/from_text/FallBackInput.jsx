import React from "react";
import TextField from "material-ui/TextField";
import FlatButton from "material-ui/FlatButton";
import Loyalty from "material-ui/svg-icons/action/loyalty";

class FallBackInput extends React.Component {
    constructor(props) {
        super(props);
    }

    render () {
        let SearchBox = (
            <div className="text-search-box">
                <div className="inner-text-search-box">
                    <TextField
                        autoFocus="autofocus"
                        className="text-search-input"
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
                        onKeyDown={this.props.onEnterPress}
                        underlineFocusStyle={{
                            borderBottom: '2px solid rgb(0, 0, 0)'
                        }}
                        underlineDisabledStyle={{
                            borderBottom: '0px solid rgb(0, 0, 0)'
                        }}
                        autoComplete="off"
                    />
                    <div className="text-search-button" onClick={() => {this.props.textImageSearch(this.props.searchString)}}>
                        <div className="search-icon" />
                    </div>
                </div>
            </div>
        );

        return (
            <div>
                {this.props.sex ? (
                    <div>
                        {SearchBox}
                    </div>
                ) : (
                    <div style={{
                        width: '300px',
                        marginLeft: 'calc(50vw - 150px)',
                        textAlign: 'center',
                        marginTop: '100px'
                    }}>
                        <FlatButton
                            label="HER"
                            onClick={() => {this.props.changeSex('women')}}
                            icon={<Loyalty/>}
                            style={{
                                width: '100%'
                            }}
                            labelStyle={{
                                fontSize: '1.3rem'
                            }}
                        />
                        <FlatButton
                            label="HIM"
                            onClick={() => {this.props.changeSex('men')}}
                            icon={<Loyalty/>}
                            style={{
                                width: '100%',
                                marginTop: '30px'
                            }}
                            labelStyle={{
                                fontSize: '1.3rem'
                            }}
                        />
                        <FlatButton
                            label="THEM"
                            onClick={() => {this.props.changeSex('both')}}
                            icon={<Loyalty/>}
                            labelStyle={{
                                fontSize: '1.3rem'
                            }}
                            style={{
                                width: '100%',
                                marginTop: '30px'
                            }}
                        />
                    </div>
                )}
            </div>
        )
    }
}

export default FallBackInput;
