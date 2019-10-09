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
                        padding: '5',
                        display: 'flex',
                        alignItems: 'center',
                        position: 'fixed',
                        top: '50px',
                        cursor: 'pointer'
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
                        <input
                            id="range"
                            type="range"
                            value={range}
                            min="0"
                            max="500"
                            step="1"
                            onChange={this.updateRange}
                            style={{
                                position: 'fixed',
                                left: '90px'
                            }}
                        />
                    )}
                </div>
            </MuiThemeProvider>
        )
    }
}

export default PriceFilter;
