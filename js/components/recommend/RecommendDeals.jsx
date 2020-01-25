// RecommendDeals.jsx
import React from "react";
require('../../../css/garms.css');
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper';
import {Route} from 'react-router-dom';
import Tooltip from '@material-ui/core/Tooltip';
import AddOutfit from "../wardrobe/AddOutfit";
import FlatButton from "material-ui/FlatButton";
import Loyalty from "material-ui/svg-icons/action/loyalty";


class RecommendDeals extends React.Component  {
    constructor(props) {
        super(props);
        this.state = {
            email: this.props.email,
            sex: this.props.sex ? this.props.sex : 'women',
            outfits: [],
            imgHash: null,
            changeSex: false
        };

        this.showAddOutfit = this.showAddOutfit.bind(this);
        this.updateImgProtocol = this.updateImgProtocol.bind(this);
    }

    componentDidMount() {
        this._ismounted = true;
        // console.log(this.props.lookFilter);
        fetch(`${window.location.origin}/api/recommend_deals`, {
            method: 'post',
            body: JSON.stringify({
                'sex': this.state.sex,
                'cats': [],
                'shops': [],
                'brands': []
            }),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(function(response) {
            return response.json();
        }).then(data => {
            this.setState({
                outfits: data.prod_suggestions
            })
        })
    }

    showAddOutfit = (imgHash) => {
        this.setState({
            imgHash: imgHash
        })
    };

    updateImgProtocol(imgUrl) {
        if (imgUrl.split('https').length > 1) {
            return imgUrl
        } else {
            return imgUrl.replace('http', 'https')
        }
    }

    changeSex(sex){
        this.props.changeSex(sex);
        this.setState({
            sex: sex
        });
    }

    render() {

        const outfitTiles = this.state.outfits.map(prodSuggestion => {
            const key = prodSuggestion.prod_id;
            const priceStyle = prodSuggestion.sale ? {
                textDecoration: 'line-through',
                display: 'inline-block'
            } : {
                textDecoration: 'none'
            };
            const imgHash = prodSuggestion.image_hash[0];

            return (
                <Paper zDepth={1} className="recommend-product-tile" key={key}>
                    {(prodSuggestion.sale) && (
                        <div style={{
                            color: '#d6181e',
                            display: 'inline-block',
                            marginLeft: '5px',
                            fontSize: '1.5rem'
                        }}>
                            -{Math.round((prodSuggestion.price - prodSuggestion.saleprice) / prodSuggestion.price * 100)}%
                        </div>
                    )}
                    <div
                        className="product-name"
                        style={{
                            marginRight: '5px',
                            marginLeft: '5px'
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
                            marginLeft: '5px'
                        }}>
                            £{prodSuggestion.saleprice}
                        </div>
                    )}


                    <Route render={({history}) => (
                        <img
                            className="product-image" src={this.updateImgProtocol(prodSuggestion.image_urls[0])}
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
                    <h6>{prodSuggestion.brand}</h6>
                    From {prodSuggestion.shop}
                </Paper>
            )
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

        const ChangeSex = () => {

            return (
                <div style={{
                    width: '300px',
                    marginLeft: 'calc(50vw - 150px)',
                    textAlign: 'center',
                    marginTop: '100px'
                }}>
                    <FlatButton
                        label="HER"
                        onClick={() => {this.changeSex('women')}}
                        icon={<Loyalty/>}
                        style={{
                            width: '100%'
                        }}
                        labelStyle={{
                            fontSize: '1.3rem'
                        }}
                    />
                    <FlatButton
                        label="HIM"
                        onClick={() => {this.changeSex('men')}}
                        icon={<Loyalty/>}
                        style={{
                            width: '100%',
                            marginTop: '30px'
                        }}
                        labelStyle={{
                            fontSize: '1.3rem'
                        }}
                    />
                    <FlatButton
                        label="THEM"
                        onClick={() => {this.changeSex('both')}}
                        icon={<Loyalty/>}
                        labelStyle={{
                            fontSize: '1.3rem'
                        }}
                        style={{
                            width: '100%',
                            marginTop: '30px'
                        }}
                    />
                </div>
            )
        };

        return (
            <div>
                <MuiThemeProvider>
                    <div
                        style={{
                            textAlign: 'center'
                        }}
                    >
                        {(this.state.imgHash !== null) && (
                            <div
                                style={{
                                    width: '100vw',
                                    backgroundColor: 'white',
                                    height: 'calc(100vh)',
                                    top: '0px',
                                    position: 'relative'
                                }}
                            >
                                <AddOutfit
                                    imgHash={this.state.imgHash}
                                    email={this.props.email}
                                    addOutfitComplete={this.addOutfitComplete}
                                />
                            </div>
                        )}

                        {tilesOrLoading}

                        {this.state.changeSex && (
                            <ChangeSex/>
                        )}
                    </div>
                </MuiThemeProvider>
            </div>
        )
    }
}

export default RecommendDeals;
