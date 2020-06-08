import React from "react";
require('../../../../css/garms.css');

class ColorSelector extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const colorTile = (colorDict) => {
            const inverseRgb = colorDict.rgb.map(color => {
                return 255 - color
            })
            const selectedColorHex = this.props.selectedColor ? this.props.selectedColor.hex : null;
            return (
                <div
                    style={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: colorDict.hex,
                        borderRadius: '3px',
                        border: selectedColorHex === colorDict.hex ? `3px solid rgba(${inverseRgb[0]}, ${inverseRgb[1]}, ${inverseRgb[2]}, 1)` : '',
                    }}
                >

                </div>
            )
        }

        const colorTiles = this.props.imgColors.map(imgColor => {
            return(
                <div
                    key={`${imgColor.hex}-${Math.random()}`}
                    style={{
                        width: '50px',
                        height: '50px',
                        display: 'inline-block',
                        margin: '1px',
                        cursor: 'pointer',
                        paddingBottom: '5px'
                    }}
                    onClick={() => {
                        this.props.setSelectedColor(imgColor);
                    }}
                >
                    {colorTile(imgColor)}
                </div>
            )
        })

        return (
            <div
                style={{
                    width: '100%',
                    position: 'fixed',
                    bottom: this.props.showIosNav === true ? '85px' : '0',
                    backgroundColor: '#FFFFFF',
                    paddingTop: '5px'
                }}
            >
                {colorTiles}
                {this.props.selectedColor === null ? (
                    <div
                        style={{
                            width: '100%',
                            padding: '10px'
                        }}
                    >
                        SELECT COLOUR
                    </div>
                ):(
                    <div
                        className="image-search-continue"
                        style={{
                            width: '100%',
                            padding: '10px',
                            cursor: 'pointer',
                            maxWidth: '300px',
                            margin: '0 auto'
                        }}
                        onClick={() => {this.props.completeColorChoosing()}}
                    >
                        {this.props.imgFeaturesLoading === true ? (
                            <div>
                                Loading...
                            </div>
                        ):(
                            <div
                                style={{
                                    backgroundColor: '#b2cca2'
                                }}
                            >
                                CONTINUE
                            </div>
                        )}
                    </div>
                )}
            </div>
        )
    }
}

export default ColorSelector;
