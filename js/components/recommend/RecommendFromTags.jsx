// RecommendFromTags.jsx
import React from "react";
require('../../../css/garms.css');
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper';


class RecommendFromTags extends React.Component  {
    constructor(props) {
        super(props);
        this.state = {
            email: this.props.email,
            sex: this.props.sex,
            lookFilter: this.props.lookFilter,
            outfits: []
        };

        this.showAddOutfit = this.showAddOutfit.bind(this);
    }

    componentDidMount() {
        fetch(`${window.location.origin}/api/recommend_tags`, {
            method: 'post',
            body: JSON.stringify({'email': this.state.email, 'sex': this.state.sex}),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(function(response) {
            return response.json();
        }).then(data => {
            // console.log(data);
            this.setState({
                outfits: data
            })
        })
    }

    showAddOutfit(imgHash) {
        this.props.showAddOutfit(imgHash);
    }

    render() {
        const outfitTiles = this.state.outfits.map(lookDict => {
            const lookName = lookDict.look_name;
            const suggestionArr = lookDict.prod_suggestions;

            return suggestionArr.map(prodSuggestionArr => {
                const prodSuggestion = prodSuggestionArr[0];
                const key = prodSuggestion.prod_hash;
                const priceStyle = prodSuggestion.sale ? {
                    textDecoration: 'line-through'
                } : {
                    textDecoration: 'none'
                };
                const imgHash = prodSuggestion.img_hashes[0];

                if (this.props.lookFilter === null || this.props.lookFilter === lookName) {
                    return (
                        <Paper zDepth={1} className="recommend-product-tile" key={key}>
                            <h6>Recommended in {lookName.toUpperCase()}</h6>
                            <div
                                className="product-name"
                                style={{
                                    marginRight: '5px',
                                    marginLeft: '5px'
                                }}
                            >
                                <h5>{prodSuggestion.name}</h5>
                            </div>
                            <div style={priceStyle}>
                                <h6>{prodSuggestion.currency}{prodSuggestion.price}</h6>
                            </div>
                            {(prodSuggestion.sale) && (
                                <div style={{color: '#d6181e'}}>
                                    <h6>{prodSuggestion.currency}{prodSuggestion.saleprice}</h6>
                                </div>
                            )}
                            <img
                                className="product-image" src={prodSuggestion.img_url}
                                style={{
                                    marginBottom: '20px'
                                }}
                            />
                            <div className="add-to-favorites-wardrobe" onClick={() => { this.showAddOutfit(imgHash) }} />
                            <br />
                            <h4>{prodSuggestion.brand}</h4>
                            <p>From {prodSuggestion.shop}</p>
                        </Paper>
                    )
                }
            })
        });
        const tilesOrLoading = (
            <div>
                {(this.state.outfits.length > 0) ? (
                    <div>
                        <br />
                        <br />
                        <hr />
                        <br />
                        <h1>Recommended</h1>
                        <br />
                        {outfitTiles}
                    </div>
                ) : (
                    <h4>Loading...</h4>
                )}
            </div>
        );

        return (
            <div>
                <MuiThemeProvider>
                    <div>
                        {(this.state.outfits.length > 0) && (
                            tilesOrLoading
                        )}
                    </div>
                </MuiThemeProvider>
            </div>
        )
    }
}

export default RecommendFromTags;