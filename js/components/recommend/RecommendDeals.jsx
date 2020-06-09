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
import DealFilters from "../search/results/result_filters/DealFilters";
import ReactGA from "react-ga";
import InfiniteSpinner from "../loading/InfiniteSpinner";


class RecommendDeals extends React.Component  {
    constructor(props) {
        super(props);
        this.state = {
            email: this.props.email,
            sex: this.props.sex ? this.props.sex : 'women',
            cats: [],
            shops: [],
            brands: [],
            outfits: [],
            imgHash: null,
            changeSex: false,
            posTags: [],
            negTags: [],
            loading: false,
            brandPickerShown: false,
            shopPickerShown: false,
            tagPickerShown: false,
            addOutfitShown: false,
            filterBrands: [],
            filterShops: [],
            nothingFound: false,
            loadedProdIds: [],
            infiniteCount: 0,
            infiniteLoading: false,
            infiniteLoadingComplete: false,
            discountRate: 0.4,
            discountPickerShown: false,
            pullDownRefreshing: false
        };

        this.showAddOutfit = this.showAddOutfit.bind(this);
        this.updateImgProtocol = this.updateImgProtocol.bind(this);
        this.setTags = this.setTags.bind(this);
        this.addTagFilter = this.addTagFilter.bind(this);
        this.showTagPicker = this.showTagPicker.bind(this);
        this.showBrandPicker = this.showBrandPicker.bind(this);
        this.showShopPicker = this.showShopPicker.bind(this);
        this.addBrandFilter = this.addBrandFilter.bind(this);
        this.addShopFilter = this.addShopFilter.bind(this);
        this.applyDealFilter = this.applyDealFilter.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.getRecommendations = this.getRecommendations.bind(this);
        this.showDiscountPicker = this.showDiscountPicker.bind(this);
        this.setDiscountRate = this.setDiscountRate.bind(this);
        this.addOutfitComplete = this.addOutfitComplete.bind(this);
        this.changeOutfitShown = this.changeOutfitShown.bind(this);
    }

    componentDidMount() {
        ReactGA.pageview(window.location.pathname + window.location.search);
        this._ismounted = true;
        window.addEventListener('scroll', this.handleScroll, { passive: true });

        fetch(`${window.location.origin}/api/recommend_deals`, {
            method: 'post',
            body: JSON.stringify({
                'sex': this.state.sex,
                'cats': [],
                'shops': [],
                'brands': [],
                'prev_prod_ids': this.state.loadedProdIds,
                'min_discount_rate': this.state.discountRate
            }),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(function(response) {
            return response.json();
        }).then(data => {
            const loadedProdIds = data.prod_suggestions.map(resDict => {
                return resDict.prod_id
            });
            this.setState({
                outfits: data.prod_suggestions,
                loadedProdIds: this.state.loadedProdIds.concat(loadedProdIds)
            });
        })
    }

    componentWillUnmount() {
        this._ismounted = false;
        window.removeEventListener('scroll', this.handleScroll);
    }

    handleScroll(event) {
        const docHeight = document.body.scrollHeight;
        const scrollDistance = window.pageYOffset + document.body.clientHeight;

        if (scrollDistance > (docHeight - docHeight * (0.7 ** (this.state.infiniteCount + 1)))) {
            if(this.state.infiniteLoading === false) {
                this.setState({
                    infiniteLoading: true
                });
                this.getRecommendations();
            }
        }

        if (window.scrollY < -20) {
            this.handleNegativeScroll();
        }
        if (window.scrollY < -130) {
            if (this.state.outfits.length > 0) {
                this.refreshSite();
            }
        }
        if (window.scrollY >= 0) {
            this.setState({
                pullDownRefreshing: false
            });
        }
    }

    handleNegativeScroll() {
        if (this.state.pullDownRefreshing === false) {
            this.setState({
                pullDownRefreshing: true
            });
        }
    }

    refreshSite() {
        window.location.reload();
    }

    getRecommendations() {
        fetch(`${window.location.origin}/api/recommend_deals`, {
            method: 'post',
            body: JSON.stringify({
                'sex': this.state.sex,
                'cats': this.state.cats,
                'shops': this.state.shops,
                'brands': this.state.brands,
                'prev_prod_ids': this.state.loadedProdIds,
                'min_discount_rate': this.state.discountRate
            }),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(function(response) {
            return response.json();
        }).then(data => {
            if (data.prod_suggestions.length > 0) {
                const loadedProdIds = data.prod_suggestions.map(resDict => {
                    return resDict.prod_id
                });
                this.setState({
                    outfits: this.state.outfits.concat(data.prod_suggestions),
                    infiniteCount: this.state.infiniteCount + 1,
                    loadedProdIds: this.state.loadedProdIds.concat(loadedProdIds),
                    infiniteLoading: false
                });
            } else {
                this.setState({
                    infiniteLoadingComplete: true
                });
            }
        });
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

    setTags(tag, type, flag){
        let posTags = this.state.posTags;
        let negTags = this.state.negTags;
        if (flag === 'remove') {
            if (type === 'positive') {
                posTags = posTags.filter(function(e) { return e !== tag });
                this.setState({
                    posTags: posTags,
                    cats: posTags
                });
            } else if (type === 'negative') {
                negTags = negTags.filter(function(e) { return e !== tag });
                this.setState({
                    negTags: negTags
                });
            }
        } else if (flag === 'add') {
            if (type === 'positive') {
                if (negTags.includes(tag)) {
                    negTags = negTags.filter(function(e) { return e !== tag });
                    this.setState({
                        negTags: negTags
                    });
                }
                if (!posTags.includes(tag)) {
                    posTags.push(tag);
                    this.setState({
                        posTags: posTags,
                        cats: posTags
                    });
                }
            } else if (type === 'negative') {
                if (posTags.includes(tag)) {
                    posTags = posTags.filter(function(e) { return e !== tag });
                    this.setState({
                        posTags: posTags,
                        cats: posTags
                    });
                }
                if (!negTags.includes(tag)) {
                    negTags.push(tag);
                    this.setState({
                        negTags: negTags
                    });
                }
            }
        }
    }

    addTagFilter(posTag, negTag, showPicker) {
        if(posTag) {
            let currentFilterTags = this.state.posTags;
            if (currentFilterTags.indexOf(posTag) !== -1) {
                const newFilterBrandTags = currentFilterTags.filter(checkedTag => {
                    return checkedTag !== posTag
                });
                this.setState({
                    posTags: newFilterBrandTags,
                    cats: newFilterBrandTags,
                    tagPickerShown: showPicker
                });
            } else {
                currentFilterTags.push(posTag);
                this.setState({
                    posTags: currentFilterTags,
                    cats: currentFilterTags,
                    tagPickerShown: showPicker
                }, () => {
                    if (showPicker === false) {
                        ReactGA.event({
                            category: "Deal Filter",
                            action: 'tag',
                            label: posTag
                        });
                        this.applyDealFilter();
                    }
                });
            }
        } else {
            let currentFilterTags = this.state.negTags;
            if (currentFilterTags.indexOf(negTag) !== -1) {
                const newFilterBrandTags = currentFilterTags.filter(checkedTag => {
                    return checkedTag !== negTag
                });
                this.setState({
                    negTags: newFilterBrandTags,
                    tagPickerShown: showPicker
                });
            } else {
                currentFilterTags.push(negTag);
                this.setState({
                    negTags: currentFilterTags,
                    tagPickerShown: showPicker
                }, () => {
                    if (showPicker === false) {
                        ReactGA.event({
                            category: "Deal Filter",
                            action: 'tag',
                            label: negTag
                        });
                        this.applyDealFilter();
                    }
                });
            }
        }
    }

    showTagPicker(show) {
        this.setState({
            tagPickerShown: show
        });
        if (show === false) {
            ReactGA.event({
                category: "Deal Filter",
                action: 'tag'
            });
            this.applyDealFilter();
        }
    }

    showBrandPicker(show) {
        this.setState({
            brandPickerShown: show
        });
        if (show === false) {
            ReactGA.event({
                category: "Deal Filter",
                action: 'brand'
            });
            this.applyDealFilter();
        }
    }

    showShopPicker(show) {
        this.setState({
            shopPickerShown: show
        });
        if (show === false) {
            ReactGA.event({
                category: "Deal Filter",
                action: 'shop'
            });
            this.applyDealFilter();
        }
    }

    showDiscountPicker(show) {
        this.setState({
            discountPickerShown: show
        });
        if (show === false) {
            ReactGA.event({
                category: "Deal Filter",
                action: 'discount rate'
            });
            this.applyDealFilter();
        }
    }

    setDiscountRate(rate) {
        this.setState({
            discountRate: rate
        })
    }

    addBrandFilter(brand, showPicker) {
        let currentFilterBrands = this.state.filterBrands;
        if (currentFilterBrands.indexOf(brand) !== -1) {
            const newFilterBrands = currentFilterBrands.filter(checkedBrand => {
                return checkedBrand !== brand
            });
            this.setState({
                filterBrands: newFilterBrands,
                brands: newFilterBrands,
                brandPickerShown: showPicker
            });
        } else {
            currentFilterBrands.push(brand);
            this.setState({
                filterBrands: currentFilterBrands,
                brands: currentFilterBrands,
                brandPickerShown: showPicker
            }, () => {
                if (showPicker === false) {
                    ReactGA.event({
                        category: "Deal Filter",
                        action: 'brand',
                        label: brand
                    });
                    this.applyDealFilter();
                }
            });
        }
    }

    addShopFilter(shop, showPicker) {
        let currentFilterShops = this.state.filterShops;
        if (currentFilterShops.indexOf(shop) !== -1) {
            const newFilterShops = currentFilterShops.filter(checkedShop => {
                return checkedShop !== shop
            });
            this.setState({
                filterShops: newFilterShops,
                shops: newFilterShops,
                shopPickerShown: showPicker
            });
        } else {
            currentFilterShops.push(shop);
            this.setState({
                filterShops: currentFilterShops,
                shops: currentFilterShops,
                shopPickerShown: showPicker
            }, () => {
                if (showPicker === false) {
                    ReactGA.event({
                        category: "Deal Filter",
                        action: 'shop',
                        label: shop
                    });
                    this.applyDealFilter();
                }
            });
        }
    }

    applyDealFilter() {
        this.setState({
            outfits: [],
            nothingFound: false,
            loadedProdIds: [],
            infiniteLoadingComplete: false
        }, () => {
            fetch(`${window.location.origin}/api/recommend_deals`, {
                method: 'post',
                body: JSON.stringify({
                    'sex': this.state.sex,
                    'cats': this.state.cats,
                    'shops': this.state.shops,
                    'brands': this.state.brands,
                    'prev_prod_ids': this.state.loadedProdIds,
                    'min_discount_rate': this.state.discountRate
                }),
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                }
            }).then(function(response) {
                return response.json();
            }).then(data => {
                if (data.prod_suggestions.length === 0) {
                    this.setState({
                        nothingFound: true
                    })
                } else {
                    const loadedProdIds = data.prod_suggestions.map(resDict => {
                        return resDict.prod_id
                    });
                    this.setState({
                        outfits: data.prod_suggestions,
                        infiniteCount: 0,
                        loadedProdIds: this.state.loadedProdIds.concat(loadedProdIds),
                        infiniteLoading: false
                    })
                }
            });
        });
    }

    addOutfitComplete = () => {
        this.setState({
            imgHash: null
        });
        this.changeOutfitShown(false);
    };

    changeOutfitShown(isShown){
        this.setState({
            addOutfitShown: isShown
        })
    }

    // ===========================================  MAIN RENDER FUNCTION  ==============================================
    render() {
        const outfitTiles = this.state.outfits.map(prodSuggestion => {
            const key = prodSuggestion.prod_id;
            const priceStyle = prodSuggestion.sale ? {
                textDecoration: 'line-through',
                display: 'inline-block'
            } : {
                textDecoration: 'none'
            };
            if (prodSuggestion.image_hash) {
                const imgHash = prodSuggestion.image_hash[0];

                return (
                    <Paper zDepth={1} className="recommend-product-tile" key={key}>
                        {(prodSuggestion.sale) && (
                            <div style={{
                                color: '#d6181e',
                                display: 'inline-block',
                                marginLeft: '5px',
                                fontSize: '1.2rem'
                            }}>
                                <b>-{Math.round((prodSuggestion.price - prodSuggestion.saleprice) / prodSuggestion.price * 100)}%</b>
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
                                    ReactGA.event({
                                        category: "Deal Recommender Action",
                                        action: 'open outfit',
                                        label: prodSuggestion.prod_id,
                                    });
                                    history.push(`/outfit-page?id=${prodSuggestion.prod_id}&sex=${prodSuggestion.sex}`);
                                }}
                            />
                        )}/>

                        {(this.props.isAuth === "true") ? (
                            <Tooltip title="Add To Favorites" >
                                <div className="add-to-favorites-wardrobe" onClick={() => {
                                    ReactGA.event({
                                        category: "Recommend Deals",
                                        action: 'add outfit',
                                        label: imgHash,
                                    });
                                    this.showAddOutfit(imgHash);
                                }} />
                            </Tooltip>
                        ) : (
                            <Route render={({history}) => (
                                <Tooltip title="Add To Favorites" >
                                    <div
                                        className="add-to-favorites-wardrobe"
                                        onClick={() => {
                                            ReactGA.event({
                                                category: "Recommend Deals",
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
                                            category: "Deal Recommender Action",
                                            action: 'search similar',
                                            label: imgHash,
                                        });
                                        // history.push(`/search-from-id?id=${imgHash}`);
                                        history.push(`search-similar?id=${imgHash}&sex=${prodSuggestion.sex}&disc=${Math.floor(this.state.discountRate * 100)}`);
                                    }}
                                />
                            </Tooltip>
                        )}/>

                        <div
                            style={{
                                marginRight: '1px',
                                marginLeft: '1px',
                                fontSize: '0.8rem',
                                lineHeight: '1'
                            }}
                        >
                            <b
                                onClick={() => {
                                    ReactGA.event({
                                        category: "Result Card Action",
                                        action: 'set brand',
                                        label: prodSuggestion.brand
                                    });
                                    this.addBrandFilter(prodSuggestion.brand, false);
                                }}
                            >
                                {prodSuggestion.brand}
                            </b>
                            <p
                                style={{
                                    marginBottom: '1px',
                                    marginTop: '1px'
                                }}
                            >
                                {prodSuggestion.name}
                            </p>
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
                    </Paper>
                )
            }
        });

        const tilesOrLoading = (
            <div>
                {(this.state.outfits.length > 0) ? (
                    <div>
                        <br />
                        <br />
                        {outfitTiles}
                    </div>
                ) : (
                    this.state.nothingFound ? (
                        <div
                            style={{
                                width: '100%',
                                paddingTop: '80px',
                                textAlign: 'center'
                            }}
                        >
                            <h5>Nothing found. Try different filters.</h5>
                        </div>
                    ) : (
                        <div
                            style={{
                                paddingTop: '100px',
                                textAlign: 'center'
                            }}
                        >
                            <svg
                                version="1.0"
                                width="128px"
                                height="128px"
                                viewBox="0 0 128 128"
                                smiling="fake"
                            >
                                <g transform="rotate(-233.647 64 64)">
                                    <path
                                        d="M64 0L40.08 21.9a10.98 10.98 0 0 0-5.05 8.75C34.37 44.85 64 60.63 64 60.63V0z"
                                        fill="#ffb118"
                                    />
                                    <path
                                        d="M128 64l-21.88-23.9a10.97 10.97 0 0 0-8.75-5.05C83.17 34.4 67.4 64 67.4 64H128z"
                                        fill="#80c141"
                                    />
                                    <path
                                        d="M63.7 69.73a110.97 110.97 0 0 1-5.04-20.54c-1.16-8.7.68-14.17.68-14.17h38.03s-4.3-.86-14.47 10.1c-3.06 3.3-19.2 24.58-19.2 24.58z"
                                        fill="#cadc28"
                                    />
                                    <path
                                        d="M64 128l23.9-21.88a10.97 10.97 0 0 0 5.05-8.75C93.6 83.17 64 67.4 64 67.4V128z"
                                        fill="#cf171f"
                                    />
                                    <path
                                        d="M58.27 63.7a110.97 110.97 0 0 1 20.54-5.04c8.7-1.16 14.17.68 14.17.68v38.03s.86-4.3-10.1-14.47c-3.3-3.06-24.58-19.2-24.58-19.2z"
                                        fill="#ec1b21"
                                    />
                                    <path
                                        d="M0 64l21.88 23.9a10.97 10.97 0 0 0 8.75 5.05C44.83 93.6 60.6 64 60.6 64H0z"
                                        fill="#018ed5"
                                    />
                                    <path
                                        d="M64.3 58.27a110.97 110.97 0 0 1 5.04 20.54c1.16 8.7-.68 14.17-.68 14.17H30.63s4.3.86 14.47-10.1c3.06-3.3 19.2-24.58 19.2-24.58z"
                                        fill="#00bbf2"
                                    />
                                    <path
                                        d="M69.73 64.34a111.02 111.02 0 0 1-20.55 5.05c-8.7 1.14-14.15-.7-14.15-.7V30.65s-.86 4.3 10.1 14.5c3.3 3.05 24.6 19.2 24.6 19.2z"
                                        fill="#f8f400"
                                    />
                                    <circle cx="64" cy="64" r="2.03"/>
                                    <animateTransform
                                        attributeName="transform"
                                        type="rotate"
                                        from="0 64 64"
                                        to="-360 64 64"
                                        dur="1s"
                                        repeatCount="indefinite"
                                    />
                                </g>
                            </svg>
                        </div>
                    )
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
                            textAlign: 'center',
                            filter: `opacity(${this.state.pullDownRefreshing === false ? 1 : 0.2})`
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
                                    sex={this.state.sex}
                                    imgHash={this.state.imgHash}
                                    email={this.props.email}
                                    addOutfitComplete={() => {this.addOutfitComplete()}}
                                />
                            </div>
                        )}

                        {tilesOrLoading}
                        <DealFilters
                            loading={this.state.loading}
                            posTags={this.state.posTags}
                            negTags={this.state.negTags}
                            setTags={(tag, type, flag) => {this.setTags(tag, type, flag)}}
                            addTagFilter={(posTag, negTag, showPicker) => {this.addTagFilter(posTag, negTag, showPicker)}}
                            showTagPicker={(show) => {this.showTagPicker(show)}}
                            tagPickerShown={this.state.tagPickerShown}
                            searchSimilarImages={(imgHash, color1) => {
                                this.searchSimilarImages(imgHash, color1)
                            }}
                            results={this.state.outfits}
                            filterBrands={this.state.filterBrands}
                            brandPickerShown={this.state.brandPickerShown}
                            showBrandPicker={(show) => {this.showBrandPicker(show)}}
                            addBrandFilter={(brand, showPicker) => {this.addBrandFilter(brand, showPicker)}}
                            filterShops={this.state.filterShops}
                            shopPickerShown={this.state.shopPickerShown}
                            showShopPicker={(show) => {this.showShopPicker(show)}}
                            addShopFilter={(shop, showPicker) => {this.addShopFilter(shop, showPicker)}}
                            discountRate={this.state.discountRate}
                            showDiscountPicker={(show) => {this.showDiscountPicker(show)}}
                            discountPickerShown={this.state.discountPickerShown}
                            setDiscountRate={(rate) => {this.setDiscountRate(rate)}}
                        />
                        {this.state.changeSex && (
                            <ChangeSex/>
                        )}

                        {this.state.infiniteLoading
                        && !this.state.infiniteLoadingComplete
                        && this.state.outfits.length > 0
                        && (
                            <div
                                style={{
                                    marginBottom: '100px',
                                    marginTop: '100px',
                                    paddingBottom: '50px'
                                }}
                            >
                                <br />
                                <InfiniteSpinner />
                                <br />
                            </div>
                        )}
                        {this.state.infiniteLoadingComplete && (
                            <div
                                style={{
                                    width: '100%',
                                    textAlign: 'center'
                                }}
                            >
                                <br />
                                <br />
                                <div className="infinite-spinner-done">

                                </div><h4>All Results Loaded</h4>
                                <br />
                                <br />
                            </div>
                        )}
                    </div>
                </MuiThemeProvider>
            </div>
        )
    }
}

export default RecommendDeals;
