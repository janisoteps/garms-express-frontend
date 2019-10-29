// RecommendRandom.jsx
import React from "react";
require('../../../css/garms.css');
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper';
import {Route} from 'react-router-dom';
import Tooltip from '@material-ui/core/Tooltip';


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
            const suggestionArr = lookDict.prod_suggestions;

            return suggestionArr.map(prodSuggestionArr => {
                const prodSuggestion = prodSuggestionArr[0];
                const key = prodSuggestion.prod_id;
                const priceStyle = prodSuggestion.sale ? {
                    textDecoration: 'line-through'
                } : {
                    textDecoration: 'none'
                };
                // console.log(prodSuggestion);
                const imgHash = prodSuggestion.image_hash[0];

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

                        <Route render={({history}) => (
                            <Tooltip title="Open Product Details Page">
                                <img
                                    className="product-image" src={prodSuggestion.image_urls[0]}
                                    style={{
                                        marginBottom: '20px',
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => {
                                        history.push(`/outfit-page?id=${prodSuggestion.prod_id}`)
                                    }}
                                />
                            </Tooltip>
                        )}/>

                        {(this.state.isAuth === "true") ? (
                            <div className="add-to-favorites-wardrobe" onClick={() => { this.showAddOutfit(imgHash) }} />
                        ) : (
                            <Route render={({history}) => (
                                <Tooltip title="Add To Favorites" >
                                    <div
                                        className="add-to-favorites-wardrobe"
                                        onClick={() => {
                                            history.push(`/register-from-result?id=${imgHash}`)
                                        }}
                                    />
                                </Tooltip>
                            )}/>
                        )}

                        <Route render={({history}) => (
                            <Tooltip title="Search Similar Items" >
                                <div
                                    className="search-similar-recommend"
                                    onClick={() => {
                                        history.push(`/search-from-id?id=${imgHash}`)
                                    }}
                                />
                            </Tooltip>
                        )}/>

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
                    <div>
                        <br />
                        <div className="la-ball-atom la-3x">
                            <div />
                            <div />
                            <div />
                            <div />
                        </div>
                    </div>
                    )}
            </div>
        );

        return (
            <div>
                <MuiThemeProvider>
                    <div>
                        {tilesOrLoading}
                    </div>
                </MuiThemeProvider>
            </div>
        )
    }
}

export default RecommendRandom;


