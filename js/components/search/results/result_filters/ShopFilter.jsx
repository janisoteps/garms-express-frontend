// ShopFilter.jsx
import React from 'react';
require('../../../../../css/garms.css');
import TextField from 'material-ui/TextField';
import Tooltip from '@material-ui/core/Tooltip';

const allShops = [
    'ASOS',
    'Boohoo',
    'Farfetch',
    'Free People',
    'Never Fully Dressed',
    'New Look',
    'Noisy May',
    'Reformation',
    'Top Man',
    'Top Shop',
    'Zalando',
    'Zara'
];

class ShopFilter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchString: '',
            suggestedTags: null
        };
        // this.removeTag = this.removeTag.bind(this);
        // this.getUniqueArr = this.getUniqueArr.bind(this);
        this.onEnterPress = this.onEnterPress.bind(this);
        this.handleTextInputChange = this.handleTextInputChange.bind(this);
    }

    onEnterPress = (e) => {
        if(e.keyCode === 13 && e.shiftKey === false) {
            e.preventDefault();
            this.setState({
                searchString: ''
            });
            this.props.addShopFilter(this.state.searchString, false);
        }
    };

    //Handle text input change
    handleTextInputChange(event) {
        let value =  event.target.value;
        let name = event.target.name;
        this.setState({
            [name]: value
        });
    }

    render() {
        const shopList = this.props.filterShops.map(filterShop => {
            return (
                <div key={`${filterShop}-${Math.random()}`}>
                    <div>
                        <div>
                            {filterShop}
                        </div>
                    </div>
                </div>
            )
        });

        const pickerShopList = this.props.filterShops.map(filterShop => {
            return (
                <div key={`${filterShop}-${Math.random()}`}>
                    <Tooltip title="Remove shop">
                        <div
                            style={{
                                borderRadius: '5px',
                                border: '1px rgba(1,1,1,0.8) solid',
                                cursor: 'pointer',
                                width: '80vw',
                                maxWidth: '300px',
                                margin: '0 auto',
                                marginBottom: '3px'
                            }}
                            onClick={() => {this.props.addShopFilter(filterShop, true)}}
                        >
                            {filterShop}
                            <div className="brand-picker-bubble-minus" />
                        </div>
                    </Tooltip>
                </div>
            )
        });

        const PickerSuggestions = () => {
            const suggestShops = allShops.filter(shop => {
                return shop.toLowerCase().indexOf(this.state.searchString) !== -1
            });
            const shopTiles = suggestShops.map(suggestShop => {
                return (
                    <div
                        key={`${suggestShop}-${Math.random()}`}
                        style={{
                            cursor: 'pointer'
                        }}
                        onClick={() => {
                            this.setState({
                                searchString: ''
                            }, () => {
                                this.props.addShopFilter(suggestShop, true);
                            });
                        }}
                    >
                        {suggestShop}
                    </div>
                )
            });

            return (
                <div>
                    {shopTiles}
                </div>
            )
        };

        return (
            <div>
                <Tooltip title="Change shop filter">
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
                            this.props.showShopPicker(true)
                        }}
                    >
                        <div className="brand-picker-bubble-plus" />
                        {this.props.filterShops.length === 0 ? (
                            <div style={{
                                whiteSpace: 'nowrap',
                                fontSize: '0.7rem'
                            }}>
                                ALL SHOPS
                            </div>
                        ) : (
                            shopList
                        )}
                    </div>
                </Tooltip>
                {this.props.shopPickerShown === true && (
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
                        {this.props.filterShops.length > 0 && (
                            pickerShopList
                        )}
                        <TextField
                            autoFocus="autofocus"
                            className="text-search-input"
                            hintText={"Shop..."}
                            value={this.state.searchString}
                            floatingLabelText="Add shop"
                            floatingLabelStyle={{
                                color: 'black'
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
                        />
                        <div
                            onClick={() => {
                                if (this.state.searchString === '') {
                                    this.props.showShopPicker(false)
                                } else {
                                    this.props.addShopFilter(this.state.searchString, false)
                                }
                            }}
                            style={{
                                display: 'inline-block',
                                width: '90px',
                                cursor: 'pointer',
                                height: '30px',
                                marginLeft: '20px',
                                color: '#FFFFFF',
                                backgroundColor: '#000000',
                                borderRadius: '3px'
                            }}
                        >
                            OK
                        </div>

                        <div style={{
                            marginTop: '30px'
                        }}>
                            {this.state.searchString !== '' && (<PickerSuggestions />)}
                        </div>
                    </div>
                )}
            </div>
        )
    }
}

export default ShopFilter;
