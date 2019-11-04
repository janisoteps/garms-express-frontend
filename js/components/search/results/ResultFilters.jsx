// ResultFilters.jsx
import React from 'react';
require('../../../../css/garms.css');
import PriceFilter from './PriceFilter';
import TagCloud from './TagCloud';
import ColorPicker from './ColorPicker';
import BrandFilter from './BrandFilter';

class ResultFilters extends React.Component {
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
                <PriceFilter
                    range={this.props.rangeVal}
                    updateRange={this.props.updateRange}
                    loading={this.props.loading}
                />
                <ColorPicker
                    setColor={(selection) => {this.props.setColor(selection)}}
                    selectedColors={this.props.selectedColors}
                    searchSimilarImages={(imgHash, color1, color2) => {
                        this.props.searchSimilarImages(imgHash, color1, color2)
                    }}
                    results={this.props.results}
                />
                <TagCloud
                    posTags={this.props.posTags}
                    negTags={this.props.negTags}
                    setTags={(tag, type, flag) => {this.props.setTags(tag, type, flag)}}
                />
                <BrandFilter
                    filterBrands={this.props.filterBrands}
                    brandPickerShown={this.props.brandPickerShown}
                    showBrandPicker={(show) => {this.props.showBrandPicker(show)}}
                    addBrandFilter={(brand) => {this.props.addBrandFilter(brand)}}
                />
            </div>
        )
    }
}

export default ResultFilters;
