import React from "react";
require('../../../../css/garms.css');

class CatSelector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedCats: []
        };
    }

    render() {
        const catTiles = this.props.imgCats.map(imgCat => {
            return (
                <div
                    key={imgCat}
                    style={{
                        display: 'inline-block',
                        margin: '5px',
                        padding: '5px',
                        border: this.state.selectedCats.includes(imgCat) ? '3px solid #000' : '',
                        borderRadius: '3px',
                        cursor: 'pointer'
                    }}
                    onClick={() => {
                        if (this.state.selectedCats.includes(imgCat)) {
                            this.setState({
                                selectedCats: this.state.selectedCats.filter(cat => {
                                    return cat !== imgCat
                                })
                            })
                        } else {
                            this.setState({
                                selectedCats: this.state.selectedCats.concat([imgCat])
                            })
                        }
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
                    bottom: '0',
                    backgroundColor: '#FFFFFF',
                    paddingTop: '5px'
                }}
            >
                <div>
                    {catTiles}
                </div>
                {this.state.selectedCats.length === 0 ? (
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
                        onClick={() => {this.props.completeCatChoosing(this.state.selectedCats)}}
                    >
                        CONTINUE
                    </div>
                )}
            </div>
        )
    }
}

export default CatSelector;
