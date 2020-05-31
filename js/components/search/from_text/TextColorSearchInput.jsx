import React from "react";
import TextField from "material-ui/TextField";
import {isMobile} from "react-device-detect";
import {SwatchesPicker} from "react-color";

class TextColorSearchInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchString: '',
            selectedColor: null,
            sex: this.props.sex
        };
        this.doTextSearch = this.doTextSearch.bind(this);
        this.focusOnInput = this.focusOnInput.bind(this);
        this.textInput = React.createRef();
    }

    componentDidMount() {
        this.focusOnInput();
    }

    handleColorChange = (color) => {
        this.setState({
            selectedColor: [color.rgb['r'], color.rgb['g'], color.rgb['b']]
        }, () => {
            this.focusOnInput();
        });
    };

    handleTextInputChange(event) {
        const value =  event.target.value;
        const name = event.target.name;
        this.setState({
            [name]: value
        });
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
        const searchStringURI = encodeURIComponent(this.state.searchString.toLowerCase());
        const colorString = this.state.selectedColor ? encodeURIComponent(this.state.selectedColor) : '';
        this.props.history.push(`/textsearch?search=${searchStringURI}&sex=${this.state.sex}&clr=${colorString}`);
    }

    render() {
        const SelectedColorBubble = () => {
            return (
                <div
                    style={{
                        position: 'relative',
                        width: '100%',
                        top: '50px',
                        textAlign: 'center',
                        zIndex: '11'
                    }}
                >
                    {this.props.selectedColor !== null && (
                        <div
                            style={{
                                width: '200px',
                                height: '20px',
                                backgroundColor: `rgba(${this.state.selectedColor[0]}, ${this.state.selectedColor[1]}, ${this.state.selectedColor[2]}, 1)`,
                                marginLeft: 'calc(50% - 100px)',
                                borderWidth: '5px',
                                border: 'solid white',
                                borderRadius: '10px'
                            }}
                        >
                        </div>
                    )}
                </div>
            )
        }

        const SWPicker = () => {
            if (isMobile) {
                return (
                    <SwatchesPicker
                        onChange={ this.handleColorChange }
                        width={'100%'}
                        height={'calc(100vh - 250px)'}
                    />
                )
            } else {
                return (
                    <SwatchesPicker
                        onChange={ this.handleColorChange }
                        width={'100%'}
                        height={'calc(((1100 / 100vw) * 250)px)'}
                    />
                )
            }
        };

        const ColorPicker = () => {
            const windowWidth = window.innerWidth;
            const padding = Math.floor(((windowWidth - 16) % 50) / 2);

            if (isMobile) {
                return (
                    <div
                        style={{
                            position: 'absolute',
                            height: '500px',
                            width: '100%',
                            top: '250px',
                            zIndex: '10',
                            left: '0',
                            textAlign: 'center',
                            paddingRight: `${padding}`,
                            paddingLeft: `${padding}`
                        }}
                    >
                        <SWPicker/>
                    </div>
                )
            } else {
                return (
                    <div
                        style={{
                            position: 'absolute',
                            height: '300px',
                            width: '100%',
                            top: '250px',
                            zIndex: '10',
                            left: '0',
                            textAlign: 'center',
                            paddingRight: `${padding}`,
                            paddingLeft: `${padding}`
                        }}
                    >
                        <SWPicker/>
                    </div>
                )
            }

        }

        return (
            <div
                style={{
                    textAlign: 'center',
                    paddingTop: '70px'
                }}
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
                    ref={(input) => { this.textInput = input; }}
                />
                <div className="text-search-button" onClick={() => {this.doTextSearch()}}>
                    <div className="search-icon" />
                </div>

                <ColorPicker />

                {this.state.selectedColor !== null && (
                    <SelectedColorBubble />
                )}
            </div>
        )
    }
}

export default TextColorSearchInput;
