// ResultCard.jsx
import React from "react";
import Paper from 'material-ui/Paper';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {Route} from "react-router-dom";
import Tooltip from "@material-ui/core/Tooltip";


class ResultCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isAuth: this.props.isAuth,
            showExplore: false
        };

        this.updateImgProtocol = this.updateImgProtocol.bind(this);
        this.buyNow = this.buyNow.bind(this);
        this.expandDrawer = this.expandDrawer.bind(this);
        this. setColorPosTags = this.setColorPosTags.bind(this);
        this.searchSimilarImages = this.searchSimilarImages.bind(this);
    }

    expandDrawer = (id, pickerId) => {
        // console.log(id, ' vs ', pickerId);
        if (id === pickerId){
            this.setState({
                pickerExpanded: 0
            });
        } else {
            this.setState({
                pickerExpanded: id
            });
        }
    };

    updateImgProtocol(imgUrl) {
        if (imgUrl.split('https').length > 1) {
            return imgUrl
        } else {
            return imgUrl.replace('http', 'https')
        }
    }

    buyNow = (prodUrl) => {
        const win = window.open(prodUrl, '_blank');
        win.focus();
    };

    setColorPosTags(selection){
        this.props.setColorPosTags(selection);
        this.setState({
            showExplore: false
        })
    }

    searchSimilarImages(imgHash, color_1){
        this.props.searchSimilarImages(imgHash, color_1);
    };

    // ================================ MAIN RENDER FUNCTION ====================================
    render() {
        const productData = this.props.productData;
        const productInfo = productData['prod_serial'];
        const imageData = productData['image_data'];
        const prod_hash = productInfo.prod_id;
        const key = prod_hash + Math.floor(Math.random() * 1000);
        const shop = productInfo.shop;
        const brand = productInfo.brand;
        const img_url = imageData.img_url;
        const name = productInfo.name;
        const prod_url = productInfo.prod_url;
        const currency = '£';
        const price = productInfo.price.toFixed(2);
        const sale = productInfo.sale;
        const saleprice = productInfo.saleprice;
        const fst_img_hash = imageData.img_hash;
        const fst_img_color = imageData.color_1;

        const ImageCarousel = () => {
            return (
                <div>
                    <Route render={({history}) => (
                        <img
                            className="product-image"
                            src={this.updateImgProtocol(img_url)}
                            style={{
                                cursor: 'pointer'
                            }}
                            onClick={() => {
                                history.push(`/outfit-page?id=${prod_hash}`)
                            }}
                        />
                    )}/>
                </div>
            )
        };

        const ColorPicker = () => {
            let image = imageData;
            let color_1 = image['color_1'];
            let color_2 = image['color_2'];
            let color_3 = image['color_3'];
            let color_1_hex = image['color_1_hex'];
            let color_2_hex = image['color_2_hex'];
            let color_3_hex = image['color_3_hex'];
            let img_hash = image['img_hash'];

            // Dynamic CSS for image color choice modal
            if(color_1_hex.length > 0){
                var colorStyle1 = {
                    width: '42px',
                    height: '42px',
                    borderRadius: '21px',
                    backgroundColor: color_1_hex,
                    margin: '2px',
                    marginRight: '0px',
                    display: 'inline-block',
                    cursor: 'pointer'
                };
                var colorStyle2 = {
                    width: '42px',
                    height: '42px',
                    borderRadius: '21px',
                    backgroundColor: color_2_hex,
                    margin: '2px',
                    marginRight: '0px',
                    display: 'inline-block',
                    cursor: 'pointer'
                };
                var colorStyle3 = {
                    width: '42px',
                    height: '42px',
                    borderRadius: '21px',
                    backgroundColor: color_3_hex,
                    margin: '2px',
                    marginRight: '0px',
                    display: 'inline-block',
                    cursor: 'pointer'
                };
            }
            let rgbSum = eval(image['color_1'].join('+'));
            var pickerBgUrl;

            if (rgbSum > 400) {
                pickerBgUrl = 'url("data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9JzIwMCcgd2lkdGg9JzIwMCcgIGZpbGw9IiMw'
                    + 'MDAwMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3Jn'
                    + 'LzE5OTkveGxpbmsiIHZlcnNpb249IjEuMSIgeD0iMHB4IiB5PSIwcHgiIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiBzdHlsZT0i'
                    + 'ZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAxMDAgMTAwOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PHBhdGggZD0iTTk0Ljks'
                    + 'MTcuNmMtMC44LTUuNy00LTguNi02LjYtMTAuNWMtMi45LTIuMS02LjYtMi42LTkuOS0xLjNjLTMuNSwxLjMtNiwzLjktOC42L'
                    + 'DYuNWMtMywzLjItNi4yLDYuMi05LjMsOS4zICBjLTMuMS0yLTQuOC0xLjgtNy4zLDAuNmMtMS41LDEuNS0zLDIuOS00LjQsN'
                    + 'C40Yy0xLjUsMS42LTEuNyw0LjItMC4yLDUuOGMwLjcsMC44LDEuNywxLjMsMi43LDJjLTEuMSwwLjktMS42LDEuMy0yLDEuN'
                    + 'yAgQzM4LDQ3LjQsMjYuNiw1OC44LDE1LjIsNzAuMWMtMi42LDIuNi00LjcsNS40LTUuNyw5LjFjLTAuNSwyLTEuNywzLjktM'
                    + 'i44LDUuNmMtMC4yLDAuMy0wLjQsMC41LTAuNiwwLjhjLTEuNywyLjMtMS42LDUuNCwwLjQsNy40ICBjMC4xLDAuMSwwLjIsM'
                    + 'C4yLDAuMiwwLjJjMiwyLDUsMi4xLDcuMywwLjVjMCwwLDAsMCwwLjEsMGMxLjctMS4yLDMuMy0yLjgsNS4yLTMuMWM0LjItM'
                    + 'C45LDcuNS0zLDEwLjQtNkM0MS4zLDczLjQsNTIuNiw2Miw2NCw1MC43ICBjMC41LTAuNSwxLTAuOSwxLjgtMS43YzAuNSwwL'
                    + 'jcsMC44LDEuMywxLjMsMS44YzIuMiwyLjMsNC42LDIuMiw2LjksMGMxLjItMS4yLDIuNC0yLjQsMy42LTMuNmMyLjktMi45L'
                    + 'DMuNy00LjMsMS4xLTcuOCAgYzIuNC0yLjQsNC44LTQuNyw3LjItNy4xYzMuMy0zLjQsNy4yLTYuMyw4LjctMTEuMUM5NSwyM'
                    + 'Cw5NS4xLDE4LjgsOTQuOSwxNy42eiBNNjEuNiw0Ny4yQzQ5LjksNTguOSwzOC4yLDcwLjYsMjYuNSw4Mi4yICBjLTIuMiwyL'
                    + 'jItNC43LDMuNi03LjcsNC40Yy0yLjMsMC42LTQuMywyLjItNi40LDMuM2MtMC4yLDAuMS0wLjQsMC4zLTAuNiwwLjRjLTAuN'
                    + 'iwwLjUtMS41LDAuNC0yLTAuMWMwLDAsMCwwLDAsMCAgYy0wLjUtMC42LTAuNi0xLjQtMC4xLTJjMC43LTAuOSwxLjQtMS44L'
                    + 'DItMi43YzAuOC0xLjMsMS41LTIuOCwxLjgtNC4zYzAuNi0yLjksMS45LTUuMywzLjktNy4zYzEyLjEtMTIuMSwyNC4yLTI0L'
                    + 'jIsMzYuMS0zNi4xICBjMi45LDIuOCw1LjcsNS43LDguNyw4LjdDNjIuMiw0Ni41LDYxLjksNDYuOSw2MS42LDQ3LjJ6Ij48L'
                    + '3BhdGg+PC9zdmc+")';
            } else {
                pickerBgUrl = 'url("data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9JzIwMCcgd2lkdGg9JzIwMCcgIGZpbGw9IiNmZ'
                    + 'mZmZmYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnL'
                    + 'zE5OTkveGxpbmsiIHZlcnNpb249IjEuMSIgeD0iMHB4IiB5PSIwcHgiIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiBzdHlsZT0iZ'
                    + 'W5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAxMDAgMTAwOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PHBhdGggZD0iTTk0LjksM'
                    + 'TcuNmMtMC44LTUuNy00LTguNi02LjYtMTAuNWMtMi45LTIuMS02LjYtMi42LTkuOS0xLjNjLTMuNSwxLjMtNiwzLjktOC42L'
                    + 'DYuNWMtMywzLjItNi4yLDYuMi05LjMsOS4zICBjLTMuMS0yLTQuOC0xLjgtNy4zLDAuNmMtMS41LDEuNS0zLDIuOS00LjQsN'
                    + 'C40Yy0xLjUsMS42LTEuNyw0LjItMC4yLDUuOGMwLjcsMC44LDEuNywxLjMsMi43LDJjLTEuMSwwLjktMS42LDEuMy0yLDEuN'
                    + 'yAgQzM4LDQ3LjQsMjYuNiw1OC44LDE1LjIsNzAuMWMtMi42LDIuNi00LjcsNS40LTUuNyw5LjFjLTAuNSwyLTEuNywzLjktM'
                    + 'i44LDUuNmMtMC4yLDAuMy0wLjQsMC41LTAuNiwwLjhjLTEuNywyLjMtMS42LDUuNCwwLjQsNy40ICBjMC4xLDAuMSwwLjIsM'
                    + 'C4yLDAuMiwwLjJjMiwyLDUsMi4xLDcuMywwLjVjMCwwLDAsMCwwLjEsMGMxLjctMS4yLDMuMy0yLjgsNS4yLTMuMWM0LjItM'
                    + 'C45LDcuNS0zLDEwLjQtNkM0MS4zLDczLjQsNTIuNiw2Miw2NCw1MC43ICBjMC41LTAuNSwxLTAuOSwxLjgtMS43YzAuNSwwL'
                    + 'jcsMC44LDEuMywxLjMsMS44YzIuMiwyLjMsNC42LDIuMiw2LjksMGMxLjItMS4yLDIuNC0yLjQsMy42LTMuNmMyLjktMi45L'
                    + 'DMuNy00LjMsMS4xLTcuOCAgYzIuNC0yLjQsNC44LTQuNyw3LjItNy4xYzMuMy0zLjQsNy4yLTYuMyw4LjctMTEuMUM5NSwyM'
                    + 'Cw5NS4xLDE4LjgsOTQuOSwxNy42eiBNNjEuNiw0Ny4yQzQ5LjksNTguOSwzOC4yLDcwLjYsMjYuNSw4Mi4yICBjLTIuMiwyL'
                    + 'jItNC43LDMuNi03LjcsNC40Yy0yLjMsMC42LTQuMywyLjItNi40LDMuM2MtMC4yLDAuMS0wLjQsMC4zLTAuNiwwLjRjLTAuN'
                    + 'iwwLjUtMS41LDAuNC0yLTAuMWMwLDAsMCwwLDAsMCAgYy0wLjUtMC42LTAuNi0xLjQtMC4xLTJjMC43LTAuOSwxLjQtMS44L'
                    + 'DItMi43YzAuOC0xLjMsMS41LTIuOCwxLjgtNC4zYzAuNi0yLjksMS45LTUuMywzLjktNy4zYzEyLjEtMTIuMSwyNC4yLTI0L'
                    + 'jIsMzYuMS0zNi4xICBjMi45LDIuOCw1LjcsNS43LDguNyw4LjdDNjIuMiw0Ni41LDYxLjksNDYuOSw2MS42LDQ3LjJ6Ij48L'
                    + '3BhdGg+PC9zdmc+")';
            }

            let pickerStyle = {
                width: '46px',
                height: '46px',
                backgroundColor: color_1_hex,
                backgroundImage: pickerBgUrl,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundSize: '36px 36px',
                borderRadius: '23px',
                position: 'absolute',
                right: '113px',
                cursor: 'pointer'
            };

            var pickerDrawerHeight;

            if (this.state.pickerExpanded === img_hash){
                pickerDrawerHeight = '190px';
            } else {
                pickerDrawerHeight = '44px';
            }

            let pickerDrawerStyle = {
                width: '46px',
                transition: 'width 300ms ease-in-out',
                height: pickerDrawerHeight,
                borderRadius: '23px',
                backgroundColor: '#FFFFFF',
                bottom: '5px',
                right: '113px',
                position: 'absolute',
                textAlign: 'left',
                overflow: 'hidden'
            };

            return (
                <div>
                    <div style={pickerDrawerStyle}>
                        <div
                            style={colorStyle1}
                            onClick={() => {
                                this.setColorPosTags({'color_rgb': color_1, 'cat':''});
                                this.searchSimilarImages(img_hash, color_1);
                            }} />
                        <div
                            style={colorStyle2}
                            onClick={() => {
                                this.setColorPosTags({'color_rgb': color_2, 'cat':''});
                                this.searchSimilarImages(img_hash, color_2);
                            }} />
                        <div
                            style={colorStyle3}
                            onClick={() => {
                                this.setColorPosTags({'color_rgb': color_3, 'cat':''});
                                this.searchSimilarImages(img_hash, color_3);
                            }} />
                    </div>
                    <Tooltip title="Search By Color">
                        <div
                            style={pickerStyle}
                            onClick={() => {this.expandDrawer(img_hash, this.state.pickerExpanded);}}
                        />
                    </Tooltip>
                </div>
            )
        };

        const ExploreOptions = () => {

            return (
                <div
                    style={{
                        position: 'fixed',
                        bottom: '0',
                        left: '0',
                        height: '55px',
                        width: '100vw',
                        zIndex: '10',
                        backgroundColor: '#FFFFFF',
                        paddingTop: '5px'
                    }}
                >
                    <Tooltip title="Search Similar Items" >
                        <div
                            className="search-similar-mobile"
                            onClick={() => {
                                this.setColorPosTags({'color_rgb': fst_img_color, 'cat':''});
                                this.searchSimilarImages(fst_img_hash, fst_img_color);
                            }}
                        />
                    </Tooltip>
                    <Tooltip title="Search By Color" >
                        <ColorPicker />
                    </Tooltip>
                    {/*<TagPicker/>*/}
                    {(this.state.isAuth === "true") ? (
                        <Tooltip title="Add To Favorites" >
                            <div className="add-to-favorites-mobile" onClick={() => { this.props.showLookList(fst_img_hash) }} />
                        </Tooltip>
                    ) : (
                        <Route render={({history}) => (
                            <Tooltip title="Add To Favorites" >
                                <div
                                    className="add-to-favorites-mobile"
                                    onClick={() => {
                                        history.push(`/register-from-result?id=${fst_img_hash}`)
                                    }}
                                />
                            </Tooltip>
                        )}/>
                    )}
                    <Tooltip title="Buy Now" >
                        <div className="buy-now-mobile" onClick={() => {this.buyNow(prod_url)}}/>
                    </Tooltip>
                </div>
            )
        };

        return (
            <MuiThemeProvider>
                <Paper
                    zDepth={1}
                    key={key}
                    style={{
                        textAlign: 'center',
                        margin: '3px',
                        width: '46vw',
                        maxWidth: '350px',
                        paddingTop: '3px',
                        paddingBottom: '2px',
                        display: 'inline-block',
                        position: 'relative',
                        verticalAlign: 'top',
                        fontSize: '0.9rem'
                    }}
                >
                    <div
                        className="product-name"
                        style={{
                            fontSize: '0.8rem',
                            lineHeight: '1'
                        }}
                    >
                        <b>{name}</b>
                    </div>
                    <div className={sale ? 'product-price-sale' : 'product-price'}>
                        {sale ? `${currency}${saleprice}, was ${currency}${price}` : `${currency}${price}`}
                    </div>
                    <ImageCarousel />
                    <div
                        style={{
                            lineHeight: '1',
                            fontSize: '0.8rem'
                        }}
                    >
                        <b>{brand}</b>
                    </div>
                    From {shop}
                    <Tooltip title="Explore Options" >
                        <div className="explore-options" onClick={() => {
                            this.setState({
                                showExplore: true
                            })
                        }}/>
                    </Tooltip>
                    {this.state.showExplore && (
                        <ExploreOptions />
                    )}
                </Paper>
            </ MuiThemeProvider>
        )
    }
}

export default ResultCard;
