// TagCloud.jsx
import React from 'react';
require('../../../css/garms.css');


class TagCloud extends React.Component {
    constructor(props) {
        super(props);
        this.removeTag = this.removeTag.bind(this);
    }

    removeTag(tag, type) {
        this.props.setTags(tag, type, 'remove');
    }

    render() {
        let posTags = this.props.posTags.map(tag => {
            return (
                <div
                    className="pos-tags-tile"
                    key={tag}
                    onClick={() => {this.removeTag(tag, 'positive')}}
                >
                    {/*<div className="explorer-brand-remove"/>*/}
                    <div className="explorer-brand-tile-title">
                        {tag}
                    </div>
                </div>
            )
        });
        let negTags = this.props.negTags.map(tag => {
            return (
                <div
                    className="neg-tags-tile"
                    key={tag}
                    onClick={() => {this.removeTag(tag, 'negative');}}
                >
                    {/*<div className="explorer-brand-remove"/>*/}
                    <div className="explorer-brand-tile-title">
                        {tag}
                    </div>
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
