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
        this._ismounted = true;
        // console.log(this.props.lookFilter);
        fetch(`${window.location.origin}/api/recommend_tags`, {
            method: 'post',
            body: JSON.stringify({
                'email': this.state.email,
                'sex': this.state.sex,
                'req_looks': this.props.lookFilter
            }),
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

    componentDidUpdate(prevProps){
        if (this._ismounted) {
            if(prevProps.lookFilter !== this.props.lookFilter){
                this.setState({
                    lookFilter: this.props.lookFilter,
                    outfits: []
                }, () => {
                    window.scrollTo({
                        top: 0,
                        behavior: "smooth"
                    });
                });
                fetch(`${window.location.origin}/api/recommend_tags`, {
                    method: 'post',
                    body: JSON.stringify({
                        'email': this.state.email,
                        'sex': this.state.sex,
                        'req_looks': this.props.lookFilter
                    }),
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
        }
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

    updateImgProtocol(imgUrl) {
        if (imgUrl.split('https').length > 1) {
            return imgUrl
        } else {
            return imgUrl.replace('http', 'https')
        }
    }

    render() {
        const outfitTiles = this.state.outfits.map(lookDict => {
            const lookName = lookDict.look_name;
            const suggestionArr = lookDict.prod_suggestions;

            return suggestionArr.map(prodSuggestionArr => {
                const prodSuggestion = prodSuggestionArr[0];
                const key = prodSuggestion.prod_id;
                const priceStyle = prodSuggestion.sale ? {
                    textDecoration: 'line-through',
                    display: 'inline-block'
                } : {
                    textDecoration: 'none'
                };
                const imgHash = prodSuggestion.image_hash[0];

                if (this.props.lookFilter === null || this.props.lookFilter === lookName) {
                    return (
                        <Paper zDepth={1} className="recommend-product-tile" key={key}>
                            {lookName !== 'all' && (<div>
                                    Recommended in {lookName.toUpperCase()}
                            </div>)}

                            <Route render={({history}) => (
                                <img
                                    className="product-image" src={this.updateImgProtocol(prodSuggestion.image_urls[0])}
                                    style={{
                                        marginBottom: '20px',
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => {
                                        history.push(`/outfit-page?id=${prodSuggestion.prod_id}&sex=${prodSuggestion.sex}`)
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
                                    display: 'inline-block',
                                    marginLeft: '5px    '
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
                }
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
