// ResultFilters.jsx
import React from 'react';
require('../../../../../css/garms.css');
import PriceFilter from './PriceFilter';
import TagCloud from './TagCloud';
import ColorPicker from '../ColorPicker';
import BrandFilter from './BrandFilter';
import DiscountFilter from "./DiscountFilter";

class ResultFilters extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {

        return (
            <div
                style={{
                    position: 'fixed',
                    top: '50px',
                    zIndex: '10'
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
                <DiscountFilter
                    showDiscountPicker={(show) => {this.props.showDiscountPicker(show)}}
                    discountPickerShown={this.props.discountPickerShown}
                    setDiscountRate={(rate) => {this.props.setDiscountRate(rate)}}
                    discountRate={this.props.discountRate}
                />
                <PriceFilter
                    range={this.props.range}
                    updateRange={(val, callback) => this.props.updateRange(val, callback)}
                    loading={this.props.loading}
                    showPriceFilter={(show) => {this.props.showPriceFilter(show)}}
                    priceFilterShown={this.props.priceFilterShown}
                />
                <ColorPicker
                    setColor={(selection) => {this.props.setColor(selection)}}
                    selectedColor={this.props.selectedColor}
                    searchSimilarImages={(imgHash, color1) => {
                        this.props.searchSimilarImages(imgHash, color1)
                    }}
                    results={this.props.results}
                />
            </div>
        )
    }
}

export default ResultFilters;
