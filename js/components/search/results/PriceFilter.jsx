import React from 'react';
require('../../../../css/garms.css');
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Tooltip from '@material-ui/core/Tooltip';
import TextField from "material-ui/TextField";


class PriceFilter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filterValue: '',
            loading: this.props.loading
        };
        this.onEnterPress = this.onEnterPress.bind(this);
        this.showHideSlider = this.showHideSlider.bind(this);
        this.changeFilterValue = this.changeFilterValue.bind(this);
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

    onEnterPress = (e) => {
        if(e.keyCode === 13 && e.shiftKey === false) {
            e.preventDefault();

            this.props.updateRange(this.state.filterValue, () => {
                this.props.showPriceFilter(false);
            });
        }
    };

    changeFilterValue(e) {
        this.setState({
            filterValue: e.target.value
        })
    }

    showHideSlider() {
        if (this.props.priceFilterShown === true) {
            this.props.showPriceFilter(false);
        } else {
            this.props.showPriceFilter(true);
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
                            marginBottom: '5px',
                            fontSize: '0.8rem'
                        }}
                    >
                        <Tooltip title="Set Maximum Price">
                            <span
                                id="output"
                                onClick={() => {this.showHideSlider()}}
                            >
                                £{range < 500 ? range : <span style={{fontSize: '1rem', lineHeight: '0.8'}}>∞</span>}
                            </span>
                        </Tooltip>
                        {this.props.priceFilterShown === true && (
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
                                    £{this.state.filterValue < 500 ? this.state.filterValue : <span style={{fontSize: '2rem', lineHeight: '1'}}>∞</span>}
                                </h2>

                                <TextField
                                    autoFocus="autofocus"
                                    className="price-filter-input"
                                    id="range"
                                    hintText={this.state.filterValue}
                                    value={this.state.filterValue}
                                    name="searchString"
                                    onChange={this.changeFilterValue.bind(this)}
                                    onKeyDown={this.onEnterPress}
                                    underlineFocusStyle={{
                                        borderBottom: '2px solid rgb(0, 0, 0)'
                                    }}
                                    underlineDisabledStyle={{
                                        borderBottom: '0px solid rgb(0, 0, 0)'
                                    }}
                                    style={{
                                        textAlign: 'center'
                                    }}
                                />

                                {/*<input*/}
                                {/*    id="range"*/}
                                {/*    type="range"*/}
                                {/*    value={range}*/}
                                {/*    min="0"*/}
                                {/*    max="500"*/}
                                {/*    step="1"*/}
                                {/*    onChange={this.updateRange}*/}
                                {/*    style={{*/}
                                {/*        position: 'relative',*/}
                                {/*        margin: 'auto',*/}
                                {/*        cursor: 'pointer'*/}
                                {/*    }}*/}
                                {/*/>*/}
                                <div
                                    style={{
                                        width: '100%'
                                    }}
                                >
                                    <div
                                        onClick={() => {
                                            this.props.updateRange(this.state.filterValue, () => {
                                                this.props.showPriceFilter(false);
                                            });
                                        }}
                                        style={{
                                            display: 'inline-block',
                                            width: '90px',
                                            cursor: 'pointer',
                                            height: '30px',
                                            marginTop: '30px',
                                            color: '#FFFFFF',
                                            backgroundColor: '#000000',
                                            borderRadius: '3px',
                                            paddingTop: '5px'
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
