import React from 'react';
// import Slider from '@material-ui/core/Slider';
require('../../../../css/garms.css');
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Tooltip from '@material-ui/core/Tooltip';


class PriceFilter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sliderValue: 0,
            showSlider: false,
            loading: this.props.loading
        };
        this.updateRange = this.updateRange.bind(this);
        this.showHideSlider = this.showHideSlider.bind(this);
    }

    componentDidUpdate(prevProps) {
        if(prevProps.loading !== this.props.loading){
            if (this.props.loading === true) {
                this.setState({
                    showSlider: false
                })
            }
        }
    }

    updateRange(e) {
        this.props.updateRange(e.target.value);
    }

    showHideSlider() {
        if (this.state.showSlider === true) {
            this.setState({
                showSlider: false
            })
        } else {
            this.setState({
                showSlider: true
            })
        }
    }

    render () {
        const range = this.props.range;

        return (
            <MuiThemeProvider>
                <div
                    style={{
                        display: 'inline-block'
                    }}
                >
                    <div
                        style={{
                            padding: '0',
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: '5px'
                        }}
                    >
                        <Tooltip title="Set Maximum Price">
                            <span
                                id="output"
                                onClick={() => {this.showHideSlider()}}
                            >
                                £{range < 500 ? range : <span style={{fontSize: '1.5rem', lineHeight: '1'}}>∞</span>}
                            </span>
                        </Tooltip>
                        {this.state.showSlider === true && (
                            <div style={{
                                position: 'fixed',
                                top: '50px',
                                left: '0',
                                height: 'calc(100vh - 50px)',
                                width: '100vw',
                                backgroundColor: '#FFFFFF',
                                zIndex: '30',
                                textAlign: 'center',
                                paddingTop: '10vh'
                            }}>
                                <h2>
                                    £{range < 500 ? range : <span style={{fontSize: '2rem', lineHeight: '1'}}>∞</span>}
                                </h2>
                                <input
                                    id="range"
                                    type="range"
                                    value={range}
                                    min="0"
                                    max="500"
                                    step="1"
                                    onChange={this.updateRange}
                                    style={{
                                        position: 'relative',
                                        margin: 'auto',
                                        cursor: 'pointer'
                                    }}
                                />
                                <div
                                    style={{
                                        width: '100%'
                                    }}
                                >
                                    <div
                                        onClick={() => {
                                            this.setState({
                                                showSlider: false
                                            })
                                        }}
                                        style={{
                                            display: 'inline-block',
                                            width: '90px',
                                            cursor: 'pointer',
                                            height: '30px',
                                            marginTop: '30px',
                                            color: '#FFFFFF',
                                            backgroundColor: '#000000',
                                            borderRadius: '3px'
                                        }}
                                    >
                                        OK
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </MuiThemeProvider>
        )
    }
}

export default PriceFilter;
