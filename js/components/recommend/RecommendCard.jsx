// RecommendCard.jsx
import React from "react";
import {Route} from "react-router-dom";
import ReactGA from "react-ga";
import Tooltip from "@material-ui/core/Tooltip";
require('../../../css/garms.css');

class RecommendCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
        this.updateImgProtocol = this.updateImgProtocol.bind(this);
    }

    updateImgProtocol(imgUrl) {
        if (imgUrl.split('https').length > 1) {
            return imgUrl
        } else {
            return imgUrl.replace('http', 'https')
        }
    }

    render() {
        const prodSuggestion = this.props.prodData;
        const key = prodSuggestion.prod_id;
        const priceStyle = prodSuggestion.sale ? {
            textDecoration: 'line-through',
            fontWeight: 'bold',
            display: 'inline-block'
        } : {
            textDecoration: 'none',
            fontWeight: 'bold',
        };
        const imgHash = prodSuggestion.image_hash[0];

        return (
            <div
                className="recommend-product-tile"
                key={key}
            >
                {this.props.lookName !== 'all' && (<div>
                    Recommended in {this.props.lookName.toUpperCase()}
                </div>)}

                <Route render={({history}) => (
                    <div
                        style={{
                            width: '100%',
                            paddingBottom: '130%',
                            position: 'relative',
                            overflowY: 'hidden'
                        }}
                    >
                        <img
                            className="product-image" src={this.updateImgProtocol(prodSuggestion.image_urls[0])}
                            style={{
                                cursor: 'pointer',
                                backgroundColor: '#e9dcc9',
                                position: 'absolute',
                                top: '0',
                                left: '0',
                                width: '100%',
                                height: 'auto'
                            }}
                            onClick={() => {
                                ReactGA.event({
                                    category: "Recommend From Tags",
                                    action: 'open outfit',
                                    label: prodSuggestion.prod_id
                                });
                                history.push(`/outfit-page?id=${prodSuggestion.prod_id}&sex=${prodSuggestion.sex}`)
                            }}
                        />
                    </div>
                )}/>

                {(this.props.isAuth === "true") ? (
                    <Tooltip title="Add To Favorites" >
                        <div className="add-to-favorites-wardrobe" onClick={() => {
                            ReactGA.event({
                                category: this.props.gaCat,
                                action: 'add outfit',
                                label: imgHash
                            });
                            this.props.showAddOutfit(imgHash);
                        }} />
                    </Tooltip>
                ) : (
                    <Route render={({history}) => (
                        <Tooltip title="Add To Favorites" >
                            <div
                                className="add-to-favorites-wardrobe"
                                onClick={() => {
                                    ReactGA.event({
                                        category: this.props.gaCat,
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
                                    category: "Recommend From Tags",
                                    action: 'search similar',
                                    label: imgHash
                                });
                                // history.push(`/search-from-id?id=${imgHash}`);
                                history.push(`search-similar?id=${imgHash}&sex=${prodSuggestion.sex}`)
                            }}
                        />
                    </Tooltip>
                )}/>

                <div
                    style={{
                        height: '90px',
                        position: 'relative'
                    }}
                >
                    <div
                        style={{
                            margin: '0',
                            position: 'absolute',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            width: '100%',
                            textAlign: 'center'
                        }}
                    >
                        <div
                            className="product-name"
                            style={{
                                marginRight: '1px',
                                marginLeft: '1px',
                                fontSize: '0.8rem',
                                lineHeight: '1'
                            }}
                        >
                            <b
                                style={{
                                    fontWeight: 'normal',
                                    fontSize: '1.1rem'
                                }}
                            >
                                {prodSuggestion.brand}
                            </b>
                            <p
                                style={{
                                    marginBottom: '1px',
                                    marginTop: '5px'
                                }}
                            >{prodSuggestion.name}</p>
                        </div>
                        <div style={priceStyle}>
                            £{prodSuggestion.price}
                        </div>
                        {(prodSuggestion.sale) && (
                            <div style={{
                                color: '#d6181e',
                                display: 'inline-block',
                                marginLeft: '5px',
                                fontWeight: 'bold'
                            }}>
                                £{prodSuggestion.saleprice}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )
    }
}

export default RecommendCard;
