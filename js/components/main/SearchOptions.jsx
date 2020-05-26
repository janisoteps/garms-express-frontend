import React from "react";
import TextSearchBox from "../search/from_text/TextSearchBox";
import {isMobile} from "react-device-detect";
import {Route} from "react-router-dom";
import ReactGA from "react-ga";
import {SwatchesPicker} from "react-color";


class SearchOptions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sex: this.props.sex,
            showColorPicker: false,
            selectedColor: null
        };

        this.showColorPicker = this.showColorPicker.bind(this);
        this.textSearchBox = React.createRef();
    }

    handleColorChange = (color) => {
        console.log('Picker RGB array: ', [color.rgb['r'], color.rgb['g'], color.rgb['b']]);
        this.setState({
            selectedColor: [color.rgb['r'], color.rgb['g'], color.rgb['b']]
        })
        this.textSearchBox.current.focusOnInput();
    };

    showColorPicker = () => {
        this.setState({
            showColorPicker: true
        })
    };

    render() {
        const SelectedColorBubble = () => {
            return (
                <div
                    style={{
                        position: 'absolute',
                        width: '100%',
                        top: 0,
                        textAlign: 'center',
                        zIndex: '11',
                        marginTop: '-10px'
                    }}
                >
                    {this.state.selectedColor !== null && (
                        <div
                            style={{
                                width: '200px',
                                height: '20px',
                                backgroundColor: `rgba(${this.state.selectedColor[0]}, ${this.state.selectedColor[1]}, ${this.state.selectedColor[2]}, 1)`,
                                marginLeft: 'calc(50vw - 100px)',
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
            if (isMobile) {
                return (
                    <div
                        style={{
                            position: 'absolute',
                            height: '500px',
                            width: '100%',
                            // backgroundColor: 'white',
                            top: '250px',
                            zIndex: '10',
                            left: '0',
                            textAlign: 'center'
                        }}
                    >
                        <SWPicker/>
                        {this.state.selectedColor !== null && (
                            <SelectedColorBubble />
                        )}
                    </div>
                )
            } else {
                return (
                    <div
                        style={{
                            position: 'absolute',
                            height: '300px',
                            width: '100%',
                            // backgroundColor: 'white',
                            top: '150px',
                            zIndex: '10',
                            left: '0',
                            textAlign: 'center'
                        }}
                    >
                        <SWPicker/>
                        {this.state.selectedColor !== null && (
                            <SelectedColorBubble />
                        )}
                    </div>
                )
            }

        }

        return (
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 2fr)',
                    gridTemplateRows: isMobile ? 'repeat(3, 1fr)' : '1fr',
                    gridColumnGap: '0px',
                    gridRowGap: '0px'
                }}
            >
                <div
                    style={{
                        gridArea: '1 / 1 / 2 / 2',
                        // paddingRight: isMobile ? '0px' : '50px',
                        boxShadow: isMobile ? '0px 2px 5px -5px #333' : '2px 0 5px -5px #333'
                    }}
                >
                    <Route render={({ history }) => (
                        <div
                            className="search-choice-button-image"
                            onClick={() => {
                                ReactGA.event({
                                    category: "Home Page",
                                    action: 'navigate',
                                    label: 'search from image'
                                });
                                history.push('/image-search');
                            }}>
                            <div className="search-choice-title">
                                <div className="image-search-icon"></div>
                                <div className="search-choice-text">Search By Photo</div>
                            </div>
                        </div>
                    )} />
                </div>
                <div
                    style={{
                        gridArea: isMobile ? '2 / 1 / 3 / 2' : '1 / 2 / 2 / 3',
                        textAlign: isMobile ? 'center' : 'center',
                        // paddingLeft: isMobile ? '0px' : '10%',
                        boxShadow: isMobile ? '0px 2px 5px -5px #333' : '2px 0 5px -5px #333'
                    }}
                >
                    <Route render={({ history }) => (
                        <TextSearchBox
                            history={history}
                            sex={this.state.sex}
                            showColorPicker={() => {this.showColorPicker()}}
                            selectedColor={this.state.selectedColor}
                            ref={this.textSearchBox}
                        />
                    )} />
                    {this.state.showColorPicker === true && (
                        <ColorPicker />
                    )}
                </div>
                <div
                    style={{
                        gridArea: isMobile ? '3 / 1 / 4 / 2' : '1 / 3 / 2 / 4',
                        textAlign: isMobile ? 'center' : 'center',
                        paddingLeft: isMobile ? '0px' : '0px'
                    }}
                >
                    <Route render={({ history }) => (
                        <div
                            style={{
                                width: '100%',
                                textAlign: 'center',
                                paddingTop: isMobile ? '30px' : '30px',
                                fontSize: '1.3rem',
                                cursor: 'pointer'
                            }}
                            className="search-choice-deals"
                            onClick={() => {
                                ReactGA.event({
                                    category: "Home Page",
                                    action: 'navigate',
                                    label: 'search deals'
                                });
                                history.push('/deals');
                            }}
                        >
                            <div
                                className="search-choice-deals-icon"
                            />
                            <div
                                style={{
                                    height: '44px',
                                    display: 'inline-block',
                                    marginRight: '10px'
                                }}
                            >
                                Deal Finder
                            </div>
                        </div>
                    )} />
                </div>
            </div>
        )
    }
}

export default SearchOptions;
