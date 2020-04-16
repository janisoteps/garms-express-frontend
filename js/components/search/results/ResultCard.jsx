// ResultCard.jsx
import React from "react";
import Paper from 'material-ui/Paper';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {Route} from "react-router-dom";
import Tooltip from "@material-ui/core/Tooltip";
import ReactGA from "react-ga";


class ResultCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isAuth: this.props.isAuth,
            showExplore: false,
            device: this.props.device,
            imageLoaded: false,
            showTagList: false
        };

        this.updateImgProtocol = this.updateImgProtocol.bind(this);
        this.buyNow = this.buyNow.bind(this);
        this.expandDrawer = this.expandDrawer.bind(this);
        this.setColorPosTags = this.setColorPosTags.bind(this);
        this.searchSimilarImages = this.searchSimilarImages.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.getUniqueArr = this.getUniqueArr.bind(this);
    }

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    handleScroll() {
        if (this.state.showExplore === true) {
            this.setState({
                showExplore: false
            })
        }
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

    getUniqueArr(value, index, self) {
        return self.indexOf(value) === index;
    }

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
        const name = imageData.name;
        const prod_url = productInfo.prod_url;
        const currency = '£';
        const price = productInfo.price.toFixed(2);
        const sale = productInfo.sale;
        const saleprice = productInfo.saleprice;
        const fst_img_hash = imageData.img_hash;
        const fst_img_color = imageData.color_1;

        const ImageCarousel = () => {
            return (
                <div
                    style={{
                        width: '100%'
                    }}
                >
                    <Route render={({history}) => (
                        <div
                            style={{
                                width: '100%',
                                paddingBottom: '125%',
                                position: 'relative',
                                overflowY: 'hidden'
                            }}
                        >
                            <img
                                className="product-image"
                                src={this.updateImgProtocol(img_url)}
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
                                        category: "Result Card Action",
                                        action: 'open outfit',
                                        label: prod_hash
                                    });
                                    history.push(`/outfit-page?id=${prod_hash}&sex=${productInfo.sex}`)
                                }}
                            />
                        </div>
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
                                ReactGA.event({
                                    category: "Result Card Action",
                                    action: 'search similar color',
                                    label: `img_hash: ${img_hash}, color: ${color_1}`
                                });
                                this.setColorPosTags({'color_rgb': color_1, 'cat':''});
                                this.searchSimilarImages(img_hash, color_1);
                            }} />
                        <div
                            style={colorStyle2}
                            onClick={() => {
                                ReactGA.event({
                                    category: "Result Card Action",
                                    action: 'search similar color',
                                    label: `img_hash: ${img_hash}, color: ${color_2}`
                                });
                                this.setColorPosTags({'color_rgb': color_2, 'cat':''});
                                this.searchSimilarImages(img_hash, color_2);
                            }} />
                        <div
                            style={colorStyle3}
                            onClick={() => {
                                ReactGA.event({
                                    category: "Result Card Action",
                                    action: 'search similar color',
                                    label: `img_hash: ${img_hash}, color: ${color_3}`
                                });
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
            let exploreOptsStyle = {
                position: this.state.device === 'desktop' ? 'absolute' : 'fixed',
                height: '55px',
                width: '215px',
                zIndex: '10',
                backgroundColor: this.state.device === 'mobile' ? '#FFFFFF' : 'rgba(255,255,255,0.7)',
                paddingTop: '5px'
            };
            if (this.state.device === 'desktop') {
                exploreOptsStyle['bottom'] = '0';
                exploreOptsStyle['right'] = '0';
                exploreOptsStyle['borderRadius'] = '27px 0px 0px 0px';
            } else {
                const bottom = document.getElementById(prod_hash).getBoundingClientRect().bottom;
                exploreOptsStyle['top'] = `${bottom - 35}px`;
                exploreOptsStyle['left'] = 'calc((100vw - 215px) / 2)';
                exploreOptsStyle['boxShadow'] = '0px 0px 5px 0 rgba(0, 0, 0, 0.6)';
                exploreOptsStyle['borderRadius'] = '27px';
            }

            return (
                <div
                    style={exploreOptsStyle}
                >

                    <Tooltip title="Search Similar Items" >
                        <div
                            className="search-similar-mobile"
                            onClick={() => {
                                ReactGA.event({
                                    category: "Result Card Action",
                                    action: 'search similar',
                                    label: fst_img_hash
                                });
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
                            <div className="add-to-favorites-mobile" onClick={() => {
                                ReactGA.event({
                                    category: "Result Card Action",
                                    action: 'add outfit',
                                    label: fst_img_hash
                                });
                                this.props.showLookList(fst_img_hash);
                            }} />
                        </Tooltip>
                    ) : (
                        <Route render={({history}) => (
                            <Tooltip title="Add To Favorites" >
                                <div
                                    className="add-to-favorites-mobile"
                                    onClick={() => {
                                        ReactGA.event({
                                            category: "Result Card Action",
                                            action: 'add outfit',
                                            label: fst_img_hash
                                        });
                                        history.push(`/register-from-result?id=${fst_img_hash}`);
                                    }}
                                />
                            </Tooltip>
                        )}/>
                    )}
                    <Tooltip title="Buy Now" >
                        <div className="buy-now-mobile" onClick={() => {
                            ReactGA.event({
                                category: "Result Card Action",
                                action: 'buy now',
                                label: prod_url
                            });
                            this.buyNow(prod_url);
                        }}/>
                    </Tooltip>
                </div>
            )
        };

        const CardTagList = () => {
            const prodTagList = productInfo['all_cats'].filter(this.getUniqueArr).map(cat => {
                return (
                    <div
                        className="results-card-cat-tag"
                        key={cat}
                        onClick={() => {
                            ReactGA.event({
                                category: "Result Card Action",
                                action: 'set tag',
                                label: cat
                            });
                            this.props.setPosNegButtonTag(cat);
                        }}
                    >
                        {cat}
                    </div>
                )
            });
            return (
                <div
                    style={{
                        position: 'relative',
                        top: '0',
                        marginBottom: '5px',
                        textAlign: 'left',
                        overflow: 'hidden',
                        height: '19px'
                    }}
                >
                    <div
                        className="results-card-brand-tag"
                        onClick={() => {
                            ReactGA.event({
                                category: "Result Card Action",
                                action: 'set brand',
                                label: brand
                            });
                            this.props.addBrandFilter(brand, false);
                        }}
                    >
                        {brand}
                    </div>
                    {prodTagList}
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
                        margin: this.state.device === 'mobile' ? '3px' : '6px',
                        width: '46vw',
                        maxWidth: '350px',
                        paddingBottom: '2px',
                        display: 'inline-block',
                        position: 'relative',
                        verticalAlign: 'top',
                        fontSize: '0.9rem'
                    }}
                >
                    <div
                        style={{
                            display: 'inline-block',
                            position: 'relative',
                            width: '100%'
                        }}
                    >
                        <ImageCarousel />
                        {(this.state.showExplore || this.state.device === 'desktop') && (
                            <ExploreOptions />
                        )}
                        {this.state.device === 'mobile' && (
                            <Tooltip title="Explore Options" >
                                <div
                                    className="explore-options"
                                    id={prod_hash}
                                    onClick={() => {
                                        this.setState({
                                            showExplore: true
                                        })
                                    }}
                                />
                            </Tooltip>
                        )}
                    </div>
                    {this.state.showTagList && (
                        <CardTagList />
                    )}

                    <div
                        className="product-name"
                        style={{
                            fontSize: '0.8rem',
                            lineHeight: '1',
                            marginTop: '2px'
                        }}
                    >
                        <b
                            className="results-card-brand-tag"
                            style={{
                                display: 'inline-block'
                            }}
                            onClick={() => {
                                ReactGA.event({
                                    category: "Result Card Action",
                                    action: 'set brand',
                                    label: brand
                                });
                                this.props.addBrandFilter(brand, false);
                            }}
                        >
                            {brand}
                        </b>
                        <p
                            style={{
                                marginBottom: '1px',
                                marginTop: '1px'
                            }}
                        >
                            {name}
                        </p>
                    </div>
                    <div className={sale ? 'product-price-sale' : 'product-price'}>
                        {sale ? `${currency}${saleprice}, was ${currency}${price}` : `${currency}${price}`}
                    </div>

                </Paper>
            </ MuiThemeProvider>
        )
    }
}

export default ResultCard;
