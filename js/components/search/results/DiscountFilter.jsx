// DiscountFilter.jsx
import React from 'react';
require('../../../../css/garms.css');
import Tooltip from '@material-ui/core/Tooltip';

class DiscountFilter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            discountRateInput: null,
            discountLevels: [
                0.2,
                0.4,
                0.6,
                0.8
            ]
        }
    }

    render() {
        const discountButtons = this.state.discountLevels.map(discountLevel => {
            return (
                <div
                    style={{
                        borderWidth: discountLevel === this.props.discountRate ? '3px' : '1px',
                        borderRadius: '3px',
                        borderStyle: 'solid',
                        width: '250px',
                        marginLeft: 'calc(50vw - 125px)',
                        marginBottom: '10px',
                        cursor: 'pointer'
                    }}
                    onClick={() => {
                        this.props.setDiscountRate(discountLevel);
                        this.props.showDiscountPicker(false)
                    }}
                    key={`${discountLevel * 100}`}
                >
                    more than {discountLevel * 100}% off
                </div>
            )
        });
        return (
            <div>
                <Tooltip title="Change discount filter">
                    <div
                        style={{
                            position: 'relative',
                            marginLeft: '5px',
                            borderRadius: '5px',
                            border: '2px rgba(1,1,1,0) solid',
                            paddingLeft: '5px',
                            paddingRight: '5px',
                            cursor: 'pointer',
                            fontSize: '0.7rem',
                            marginTop: '15px',
                            backgroundColor: 'rgba(255, 255, 255, 0.7)',
                            boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px'
                        }}
                        onClick={() => {
                            this.props.showDiscountPicker(true)
                        }}
                    >
                        <div className="brand-picker-bubble-plus" />
                        > {this.props.discountRate * 100}% OFF
                    </div>
                </Tooltip>

                {this.props.discountPickerShown === true && (
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
                        {discountButtons}
                    </div>
                )}
            </div>
        )
    }
}

export default DiscountFilter;
