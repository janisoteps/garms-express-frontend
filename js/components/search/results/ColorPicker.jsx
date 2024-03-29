import React from 'react';
import { SwatchesPicker } from 'react-color';
import {isMobile} from 'react-device-detect';
import Tooltip from '@material-ui/core/Tooltip';


class ColorPicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showColorPicker: false,
            pickerIndex: null
        };
        this.handleChangeComplete = this.handleChangeComplete.bind(this);
        this.searchSimilarImages = this.searchSimilarImages.bind(this);
    }

    searchSimilarImages(imgHash, color1){
        this.props.searchSimilarImages(imgHash, color1);
    }

    handleChangeComplete = (color) => {
        this.props.setColor({
            // 'index': this.state.pickerIndex,
            'color_rgb': [color.rgb['r'] + 1, color.rgb['g'] + 1, color.rgb['b'] +1]}
        );
        this.setState({
            showColorPicker: false,
            pickerIndex: null
        }, () => {
            this.searchSimilarImages(
                this.props.results[0]['image_data']['img_hash'],
                [color.rgb['r'] + 1, color.rgb['g'] + 1, color.rgb['b'] + 1]
            );
        });
    };


    render() {
        const ColorWidgets = () => {
            const color = this.props.selectedColor;
            let rgbSum = color.length > 0 ? eval(color.join('+')) : 500;
            var pickerBgUrl;
            if (rgbSum > 400) {
                pickerBgUrl = 'url("data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9JzIwMCcgd2lkdGg9JzIwMCcgIGZpbGw9IiMwMDAwMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHZlcnNpb249IjEuMSIgeD0iMHB4IiB5PSIwcHgiIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAxMDAgMTAwOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PHBhdGggZD0iTTk0LjksMTcuNmMtMC44LTUuNy00LTguNi02LjYtMTAuNWMtMi45LTIuMS02LjYtMi42LTkuOS0xLjNjLTMuNSwxLjMtNiwzLjktOC42LDYuNWMtMywzLjItNi4yLDYuMi05LjMsOS4zICBjLTMuMS0yLTQuOC0xLjgtNy4zLDAuNmMtMS41LDEuNS0zLDIuOS00LjQsNC40Yy0xLjUsMS42LTEuNyw0LjItMC4yLDUuOGMwLjcsMC44LDEuNywxLjMsMi43LDJjLTEuMSwwLjktMS42LDEuMy0yLDEuNyAgQzM4LDQ3LjQsMjYuNiw1OC44LDE1LjIsNzAuMWMtMi42LDIuNi00LjcsNS40LTUuNyw5LjFjLTAuNSwyLTEuNywzLjktMi44LDUuNmMtMC4yLDAuMy0wLjQsMC41LTAuNiwwLjhjLTEuNywyLjMtMS42LDUuNCwwLjQsNy40ICBjMC4xLDAuMSwwLjIsMC4yLDAuMiwwLjJjMiwyLDUsMi4xLDcuMywwLjVjMCwwLDAsMCwwLjEsMGMxLjctMS4yLDMuMy0yLjgsNS4yLTMuMWM0LjItMC45LDcuNS0zLDEwLjQtNkM0MS4zLDczLjQsNTIuNiw2Miw2NCw1MC43ICBjMC41LTAuNSwxLTAuOSwxLjgtMS43YzAuNSwwLjcsMC44LDEuMywxLjMsMS44YzIuMiwyLjMsNC42LDIuMiw2LjksMGMxLjItMS4yLDIuNC0yLjQsMy42LTMuNmMyLjktMi45LDMuNy00LjMsMS4xLTcuOCAgYzIuNC0yLjQsNC44LTQuNyw3LjItNy4xYzMuMy0zLjQsNy4yLTYuMyw4LjctMTEuMUM5NSwyMCw5NS4xLDE4LjgsOTQuOSwxNy42eiBNNjEuNiw0Ny4yQzQ5LjksNTguOSwzOC4yLDcwLjYsMjYuNSw4Mi4yICBjLTIuMiwyLjItNC43LDMuNi03LjcsNC40Yy0yLjMsMC42LTQuMywyLjItNi40LDMuM2MtMC4yLDAuMS0wLjQsMC4zLTAuNiwwLjRjLTAuNiwwLjUtMS41LDAuNC0yLTAuMWMwLDAsMCwwLDAsMCAgYy0wLjUtMC42LTAuNi0xLjQtMC4xLTJjMC43LTAuOSwxLjQtMS44LDItMi43YzAuOC0xLjMsMS41LTIuOCwxLjgtNC4zYzAuNi0yLjksMS45LTUuMywzLjktNy4zYzEyLjEtMTIuMSwyNC4yLTI0LjIsMzYuMS0zNi4xICBjMi45LDIuOCw1LjcsNS43LDguNyw4LjdDNjIuMiw0Ni41LDYxLjksNDYuOSw2MS42LDQ3LjJ6Ij48L3BhdGg+PC9zdmc+")';
            } else {
                pickerBgUrl = 'url("data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9JzIwMCcgd2lkdGg9JzIwMCcgIGZpbGw9IiNmZmZmZmYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHZlcnNpb249IjEuMSIgeD0iMHB4IiB5PSIwcHgiIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAxMDAgMTAwOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PHBhdGggZD0iTTk0LjksMTcuNmMtMC44LTUuNy00LTguNi02LjYtMTAuNWMtMi45LTIuMS02LjYtMi42LTkuOS0xLjNjLTMuNSwxLjMtNiwzLjktOC42LDYuNWMtMywzLjItNi4yLDYuMi05LjMsOS4zICBjLTMuMS0yLTQuOC0xLjgtNy4zLDAuNmMtMS41LDEuNS0zLDIuOS00LjQsNC40Yy0xLjUsMS42LTEuNyw0LjItMC4yLDUuOGMwLjcsMC44LDEuNywxLjMsMi43LDJjLTEuMSwwLjktMS42LDEuMy0yLDEuNyAgQzM4LDQ3LjQsMjYuNiw1OC44LDE1LjIsNzAuMWMtMi42LDIuNi00LjcsNS40LTUuNyw5LjFjLTAuNSwyLTEuNywzLjktMi44LDUuNmMtMC4yLDAuMy0wLjQsMC41LTAuNiwwLjhjLTEuNywyLjMtMS42LDUuNCwwLjQsNy40ICBjMC4xLDAuMSwwLjIsMC4yLDAuMiwwLjJjMiwyLDUsMi4xLDcuMywwLjVjMCwwLDAsMCwwLjEsMGMxLjctMS4yLDMuMy0yLjgsNS4yLTMuMWM0LjItMC45LDcuNS0zLDEwLjQtNkM0MS4zLDczLjQsNTIuNiw2Miw2NCw1MC43ICBjMC41LTAuNSwxLTAuOSwxLjgtMS43YzAuNSwwLjcsMC44LDEuMywxLjMsMS44YzIuMiwyLjMsNC42LDIuMiw2LjksMGMxLjItMS4yLDIuNC0yLjQsMy42LTMuNmMyLjktMi45LDMuNy00LjMsMS4xLTcuOCAgYzIuNC0yLjQsNC44LTQuNyw3LjItNy4xYzMuMy0zLjQsNy4yLTYuMyw4LjctMTEuMUM5NSwyMCw5NS4xLDE4LjgsOTQuOSwxNy42eiBNNjEuNiw0Ny4yQzQ5LjksNTguOSwzOC4yLDcwLjYsMjYuNSw4Mi4yICBjLTIuMiwyLjItNC43LDMuNi03LjcsNC40Yy0yLjMsMC42LTQuMywyLjItNi40LDMuM2MtMC4yLDAuMS0wLjQsMC4zLTAuNiwwLjRjLTAuNiwwLjUtMS41LDAuNC0yLTAuMWMwLDAsMCwwLDAsMCAgYy0wLjUtMC42LTAuNi0xLjQtMC4xLTJjMC43LTAuOSwxLjQtMS44LDItMi43YzAuOC0xLjMsMS41LTIuOCwxLjgtNC4zYzAuNi0yLjksMS45LTUuMywzLjktNy4zYzEyLjEtMTIuMSwyNC4yLTI0LjIsMzYuMS0zNi4xICBjMi45LDIuOCw1LjcsNS43LDguNyw4LjdDNjIuMiw0Ni41LDYxLjksNDYuOSw2MS42LDQ3LjJ6Ij48L3BhdGg+PC9zdmc+")';
            }
            let colorWidgetStyle = {
                backgroundColor: color.length > 0 ? 'rgba(' + color[0] + ', ' + color[1] + ', ' + color[2] + ', 1)' : 'rgba(1,1,1,0)',
                backgroundImage: pickerBgUrl,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundSize:  '28px',
                width: '34px',
                height: '34px',
                borderRadius: '17px',
                display: 'inline-block',
                boxShadow: '1px 1px 3px 0 rgba(0, 0, 0, 0.4)',
                cursor: 'pointer'
            };

            return(
                <div>
                    <Tooltip title="Change Searched Color">
                        <div
                            style={colorWidgetStyle}
                            onClick={() => {
                                this.setState({
                                    showColorPicker: true
                                })
                            }}
                        />
                    </Tooltip>
                </div>
            )
        };

        let NewColorPicker = () => {
            if (this.state.showColorPicker) {

                let SWPicker = () => {
                    if (isMobile) {
                        return (
                            <SwatchesPicker
                                onChange={ this.handleChangeComplete }
                                width={'100%'}
                                height={'calc(100vh - 350px)'}
                            />
                        )
                    } else {
                        return (
                            <SwatchesPicker
                                onChange={ this.handleChangeComplete }
                                width={'100%'}
                                height={'calc(((1100 / 100vw) * 250)px)'}
                            />
                        )
                    }
                };

                return(
                    <div style={{
                        position: 'fixed',
                        top: '50px',
                        left: '0',
                        width: '100vw',
                        height: 'calc(100vh - 50px)',
                        zIndex: '10',
                        backgroundColor: '#FFFFFF',
                        opacity: '0.95',
                        paddingTop: '85px',
                        textAlign: 'center'
                    }}>
                        <div
                            style={{
                                maxWidth: '966px',
                                margin: '0 auto'
                            }}
                        >
                            <div
                                className="pick-color-cancel"
                                onClick={() => {
                                    this.setState({
                                        showColorPicker: false,
                                        pickerIndex: null
                                    });
                                }}
                            />
                        </div>
                        <h2>Pick another color</h2>
                        <br></br>
                        <br></br>
                        <SWPicker/>
                    </div>
                )
            } else {
                return (
                    <div style={{height: '0px'}} />
                )
            }
        };

        let colorPickerStyle = {
            marginLeft: '5px',
            height: '60px',
            display: 'inline-block',
            width: '60px'
        };
        return (
            <div>
                <NewColorPicker />
                <div style={colorPickerStyle}>
                    <ColorWidgets />
                </div>
            </div>
        )
    }
}

export default ColorPicker;
