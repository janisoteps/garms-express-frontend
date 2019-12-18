// RecommendFromTags.jsx
import React from "react";
require('../../../css/garms.css');
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper';
import {Route} from 'react-router-dom';
import Tooltip from '@material-ui/core/Tooltip';


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
        this.shuffle = this.shuffle.bind(this);
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
            this.setState({
                outfits: data
            })
        })
    }

    showAddOutfit(imgHash) {
        this.props.showAddOutfit(imgHash);
    }

    shuffle(a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    render() {
        const outfitTiles = this.shuffle(this.state.outfits).map(lookDict => {
            const lookName = lookDict.look_name;
            const suggestionArr = lookDict.prod_suggestions;

            return suggestionArr.map(prodSuggestionArr => {
                const prodSuggestion = prodSuggestionArr[0];
                const key = prodSuggestion.prod_id;
                const priceStyle = prodSuggestion.sale ? {
                    textDecoration: 'line-through'
                } : {
                    textDecoration: 'none'
                };
                const imgHash = prodSuggestion.image_hash[0];

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
                                <h6>£{prodSuggestion.price}</h6>
                            </div>
                            {(prodSuggestion.sale) && (
                                <div style={{color: '#d6181e'}}>
                                    <h6>£{prodSuggestion.saleprice}</h6>
                                </div>
                            )}

                            <Route render={({history}) => (
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
                            )}/>

                            <Tooltip title="Add To Favorites" >
                                <div className="add-to-favorites-wardrobe" onClick={() => { this.showAddOutfit(imgHash) }} />
                            </Tooltip>
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
                    <div
                        style={{
                            paddingTop: '100px'
                        }}
                    >
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

export default RecommendFromTags;
