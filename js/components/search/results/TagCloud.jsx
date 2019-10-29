// TagCloud.jsx
import React from 'react';
require('../../../../css/garms.css');
import Tooltip from '@material-ui/core/Tooltip';


class TagCloud extends React.Component {
    constructor(props) {
        super(props);
        this.removeTag = this.removeTag.bind(this);
        this.getUniqueArr = this.getUniqueArr.bind(this);
    }

    removeTag(tag, type) {
        this.props.setTags(tag, type, 'remove');
    }

    getUniqueArr(value, index, self) {
        return self.indexOf(value) === index;
    }

    render() {
        let posTags = this.props.posTags.filter(this.getUniqueArr).map(tag => {
            return (
                <div key={tag}>
                    <Tooltip title="Remove Positive Tag">
                        <div
                            className="pos-tags-tile"
                            onClick={() => {this.removeTag(tag, 'positive')}}
                        >
                            {/*<div className="explorer-brand-remove"/>*/}
                            <div className="explorer-brand-tile-title">
                                {tag}
                            </div>
                        </div>
                    </Tooltip>
                </div>
            )
        });
        let negTags = this.props.negTags.map(tag => {
            return (
                <div key={tag}>
                    <Tooltip title="Remove Negative Tag">
                        <div
                            className="neg-tags-tile"
                            onClick={() => {this.removeTag(tag, 'negative');}}
                        >
                            {/*<div className="explorer-brand-remove"/>*/}
                            <div className="explorer-brand-tile-title">
                                {tag}
                            </div>
                        </div>
                    </Tooltip>
                </div>
            )
        });
        return (
            <div style={{position: 'fixed', top: '258', left: '0', maxWidth: '100px', margin: '5px'}}>
                {(this.props.posTags.length > 0 || this.props.negTags.length > 0) ? (
                    <div>
                        {posTags}
                        {negTags}
                    </div>
                ) : (
                    <div style={{height: '0'}}/>
                )}
            </div>
        )
    }
}

export default TagCloud;
