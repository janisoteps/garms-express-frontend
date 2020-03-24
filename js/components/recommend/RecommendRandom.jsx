// RecommendRandom.jsx
import React from "react";
require('../../../css/garms.css');
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper';
import {Route} from 'react-router-dom';
import Tooltip from '@material-ui/core/Tooltip';
import ReactGA from "react-ga";


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

    updateImgProtocol(imgUrl) {
        if (imgUrl.split('https').length > 1) {
            return imgUrl
        } else {
            return imgUrl.replace('http', 'https')
        }
    }

    render() {
        const outfitTiles = this.state.outfits.map(lookDict => {
            const suggestionArr = lookDict.prod_suggestions;

            return suggestionArr.map(prodSuggestionArr => {
                const prodSuggestion = prodSuggestionArr[0];
                const key = prodSuggestion.prod_id;
                const priceStyle = prodSuggestion.sale ? {
                    textDecoration: 'line-through',
                    display: 'inline-block',
                    marginRight: '5px'
                } : {
                    textDecoration: 'none'
                };
                // console.log(prodSuggestion);
                const imgHash = prodSuggestion.image_hash[0];

                return (
                    <Paper zDepth={1} className="recommend-product-tile" key={key}>
                        <Route render={({history}) => (
                            <Tooltip title="Open Product Details Page">
                                <img
                                    className="product-image" src={this.updateImgProtocol(prodSuggestion.image_urls[0])}
                                    style={{
                                        marginBottom: '20px',
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => {
                                        ReactGA.event({
                                            category: "Recommend From Random",
                                            action: 'open outfit',
                                            label: prodSuggestion.prod_id
                                        });
                                        history.push(`/outfit-page?id=${prodSuggestion.prod_id}&sex=${prodSuggestion.sex}`);
                                    }}
                                />
                            </Tooltip>
                        )}/>

                        {(this.state.isAuth === "true") ? (
                            <div className="add-to-favorites-wardrobe" onClick={() => {
                                ReactGA.event({
                                    category: "Recommend From Random",
                                    action: 'add outfit',
                                    label: imgHash
                                });
                                this.showAddOutfit(imgHash);
                            }} />
                        ) : (
                            <Route render={({history}) => (
                                <Tooltip title="Add To Favorites" >
                                    <div
                                        className="add-to-favorites-wardrobe"
                                        onClick={() => {
                                            ReactGA.event({
                                                category: "Recommend From Random",
                                                action: 'add outfit',
                                                label: imgHash
                                            });
                                            history.push(`/register-from-result?id=${imgHash}`);
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
                                        ReactGA.event({
                                            category: "Recommend From Random",
                                            action: 'search similar',
                                            label: imgHash
                                        });
                                        history.push(`/search-from-id?id=${imgHash}`);
                                    }}
                                />
                            </Tooltip>
                        )}/>
                        <br />

                        <div
                            className="product-name"
                            style={{
                                marginRight: '1px',
                                marginLeft: '1px',
                                fontSize: '0.8rem',
                                lineHeight: '1'
                            }}
                        >
                            <b>{prodSuggestion.name}</b>
                        </div>
                        <div style={priceStyle}>
                            £{prodSuggestion.price}
                        </div>
                        {(prodSuggestion.sale) && (
                            <div style={{
                                color: '#d6181e',
                                display: 'inline-block'
                            }}>
                                £{prodSuggestion.saleprice}
                            </div>
                        )}

                        <div
                            style={{
                                lineHeight: '1'
                            }}
                        >
                            <b>{prodSuggestion.brand}</b>
                        </div>
                        From {prodSuggestion.shop}
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
                    <div
                        style={{
                            paddingTop: '100px'
                        }}
                    >
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


