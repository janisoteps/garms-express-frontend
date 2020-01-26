// DealFilters.jsx
import React from 'react';
require('../../../../css/garms.css');
import TagCloud from './TagCloud';
import BrandFilter from './BrandFilter';
import ShopFilter from './ShopFilter';

class DealFilters extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {

        return (
            <div
                style={{
                    position: 'fixed',
                    top: '50px'
                }}
            >
                <TagCloud
                    posTags={this.props.posTags}
                    negTags={this.props.negTags}
                    setTags={(tag, type, flag) => {this.props.setTags(tag, type, flag)}}
                    addTagFilter={(posTag, negTag, showPicker) => {this.props.addTagFilter(posTag, negTag, showPicker)}}
                    showTagPicker={(show) => {this.props.showTagPicker(show)}}
                    tagPickerShown={this.props.tagPickerShown}
                />
                <BrandFilter
                    filterBrands={this.props.filterBrands}
                    brandPickerShown={this.props.brandPickerShown}
                    showBrandPicker={(show) => {this.props.showBrandPicker(show)}}
                    addBrandFilter={(brand, showPicker) => {this.props.addBrandFilter(brand, showPicker)}}
                />
                <ShopFilter
                    filterShops={this.props.filterShops}
                    shopPickerShown={this.props.shopPickerShown}
                    showShopPicker={(show) => {this.props.showShopPicker(show)}}
                    addShopFilter={(shop, showPicker) => {this.props.addShopFilter(shop, showPicker)}}
                />
            </div>
        )
    }
}

export default DealFilters;
