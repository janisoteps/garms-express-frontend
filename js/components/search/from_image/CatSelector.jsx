import React from "react";
import TagPicker from "./TagPicker";
require('../../../../css/garms.css');

class CatSelector extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const catTiles = this.props.imgCats.map(imgCat => {
            return (
                <div
                    key={`${imgCat}-${Math.random()}`}
                    style={{
                        display: 'inline-block',
                        margin: '5px',
                        padding: '5px',
                        border: this.props.posTags.includes(imgCat) ? '2px solid #000' : '',
                        borderRadius: '3px',
                        cursor: 'pointer',
                        backgroundColor: '#ece8ee'
                    }}
                    onClick={() => {
                        this.props.setPosTags(imgCat)
                    }}
                >
                    {imgCat}
                </div>
            )
        })

        return (
            <div
                style={{
                    width: '100%',
                    position: 'fixed',
                    bottom: this.props.showIosNav === true ? '80px' : '0',
                    backgroundColor: '#FFFFFF',
                    paddingTop: '5px'
                }}
            >
                <div>
                    {catTiles}
                    <div
                        style={{
                            display: 'inline-block',
                            margin: '5px',
                            padding: '5px',
                            borderRadius: '3px',
                            cursor: 'pointer',
                            backgroundColor: '#ece8ee'
                        }}
                        onClick={() => {
                            this.props.showHideTagPicker(true)
                        }}
                    >
                        other...
                    </div>
                </div>
                {this.props.posTags.length === 0 ? (
                    <div
                        style={{
                            width: '100%',
                            padding: '10px'
                        }}
                    >
                        SELECT TAGS
                    </div>
                ):(
                    <div
                        className="image-search-continue"
                        style={{
                            width: '100%',
                            padding: '10px',
                            cursor: 'pointer',
                            maxWidth: '300px',
                            margin: '0 auto'
                        }}
                        onClick={() => {this.props.completeCatChoosing(this.props.posTags)}}
                    >
                        <div
                            style={{
                                backgroundColor: '#b2cca2'
                            }}
                        >
                            CONTINUE
                        </div>
                    </div>
                )}

                {this.props.tagPickerShown === true && (
                    <TagPicker
                        addOwnCat={(cat) => {
                            this.props.addOwnCat(cat);
                        }}
                    />
                )}
            </div>
        )
    }
}

export default CatSelector;
