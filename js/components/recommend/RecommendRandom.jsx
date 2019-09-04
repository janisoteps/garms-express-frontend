// RecommendRandom.jsx
import React from "react";
require('../../../css/garms.css');
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper';
import {Route} from 'react-router-dom';


class RecommendRandom extends React.Component  {
    constructor(props) {
        super(props);
        this.state = {
            sex: this.props.sex,
            outfits: []
        };

        this.showAddOutfit = this.showAddOutfit.bind(this);
    }

    componentDidMount() {
        console.log(`sex: ${this.state.sex}`);
        fetch(`${window.location.origin}/api/recommend_random`, {
            method: 'post',
            body: JSON.stringify({'sex': this.state.sex}),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(function(response) {
            return response.json();
        }).then(data => {
            console.log(data);
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

                return (
                    <Paper zDepth={1} className="recommend-product-tile" key={key}>
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
                        
                        {(this.state.isAuth === "true") ? (
                            <div className="add-to-favorites-wardrobe" onClick={() => { this.showAddOutfit(imgHash) }} />
                        ) : (
                            <Route render={({history}) => (
                                <div
                                    className="add-to-favorites-wardrobe"
                                    onClick={() => {
                                        history.push(`/register-from-result?id=${imgHash}`)
                                    }}
                                />
                            )}/>
                        )}
                        <br />
                        <h4>{prodSuggestion.brand}</h4>
                        <p>From {prodSuggestion.shop}</p>
                    </Paper>
                )
            })
        });
        const tilesOrLoading = (
            <div>
                {(this.state.outfits.length > 0) ? (
                    <div>
                        <br />
                        <br />
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

export default RecommendRandom;