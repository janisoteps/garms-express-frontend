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
                <TagCloud
                    posTags={this.props.posTags}
                    negTags={this.props.negTags}
                    setTags={(tag, type, flag) => {this.props.setTags(tag, type, flag)}}
                    addTagFilter={(tag, showPicker) => {this.props.addTagFilter(tag, showPicker)}}
                    showTagPicker={(show) => {this.props.showTagPicker(show)}}
                    tagPickerShown={this.props.tagPickerShown}
                />
                <BrandFilter
                    filterBrands={this.props.filterBrands}
                    brandPickerShown={this.props.brandPickerShown}
                    showBrandPicker={(show) => {this.props.showBrandPicker(show)}}
                    addBrandFilter={(brand, showPicker) => {this.props.addBrandFilter(brand, showPicker)}}
                />
                <PriceFilter
                    range={this.props.range}
                    updateRange={this.props.updateRange}
                    loading={this.props.loading}
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
