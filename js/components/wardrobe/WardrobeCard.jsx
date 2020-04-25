import React from "react";
import ReactGA from "react-ga";
import Tooltip from "@material-ui/core/Tooltip";
import {Route} from "react-router-dom";
import Paper from "material-ui/Paper";
require('../../../css/garms.css');


class WardrobeCard extends React.Component {
    constructor(props) {
        super(props);
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
        const outfitDict = this.props.outfitData;
        const key = `${outfitDict.prod_id}-${outfitDict.outfit_date}`;
        const priceStyle = outfitDict.info.sale ? {
            textDecoration: 'line-through',
            display: 'inline-block',
            fontSize: '0.9rem'
        } : {
            textDecoration: 'none',
            fontSize: '0.9rem'
        };

        return (
            <Paper zDepth={1} className="profile-product-tile" key={key}>
                <div
                    className="product-name"
                    style={{
                        marginLeft: '1px',
                        marginRight: '1px',
                        fontSize: '1rem',
                        lineHeight: '1'
                    }}
                >
                    {outfitDict.look_name.toUpperCase()}
                </div>

                <Route render={({history}) => (
                    <img
                        className="product-image" src={this.updateImgProtocol(outfitDict.info.imgUrl)}
                        style={{
                            marginBottom: '10px',
                            cursor: 'pointer'
                        }}
                        onClick={() => {
                            history.push(`/outfit-page?id=${outfitDict.prod_id}&sex=${this.props.sex}`)
                        }}
                    />
                )}/>

                <Route render={({history}) => (
                    <div
                        className="product-name"
                        style={{
                            marginTop: '3px',
                            fontSize: '0.8rem',
                            lineHeight: '1',
                            maxHeight: '36px',
                            overflowY: 'hidden'
                        }}
                        onClick={() => {
                            history.push(`/outfit-page?id=${outfitDict.prod_id}`)
                        }}
                    >
                        <b>{outfitDict.info.brand}</b>
                        <p
                            style={{
                                marginBottom: '3px'
                            }}
                        >{outfitDict.info.name}</p>
                    </div>
                )}
                />
                <div style={priceStyle}>£{outfitDict.info.price}</div>
                {(outfitDict.info.sale) && (
                    <div
                        style={{
                            color: '#d6181e',
                            display: 'inline-block',
                            marginLeft: '5px',
                            fontSize: '1rem',
                            lineHeight: '1'
                        }}
                    >
                        £{outfitDict.info.salePrice}
                    </div>
                )}

                <Route render={({history}) => (
                    <Tooltip title="Search Similar Items" >
                        <div
                            className="search-similar-wardrobe"
                            onClick={() => {
                                // history.push(`/search-from-id?id=${outfitDict.info.imgHash}`)
                                history.push(`search-similar?id=${outfitDict.info.imgHash}&sex=${this.props.sex}`)
                            }}
                        />
                    </Tooltip>
                )}/>
                <Tooltip title="Delete From Favorites" >
                    <div
                        className="product-delete-wardrobe"
                        onClick={() => {
                            this.props.removeOutfit(outfitDict.look_name, outfitDict.prod_id, outfitDict.outfit_date)
                        }}
                    />
                </Tooltip>
                <Tooltip title="Buy Now" >
                    <a
                        href={outfitDict.info.url}
                        target="_blank"
                        onClick={() => {
                            ReactGA.event({
                                category: "Wardrobe",
                                action: 'buy now',
                                label: outfitDict.info.url,
                            });
                        }}
                    >
                        <div
                            className="product-buy-wardrobe"
                        />
                    </a>
                </Tooltip>
            </Paper>
        )
    }
}

export default WardrobeCard;
