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
import DealFilters from "../search/results/DealFilters";


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
            nothingFound: false
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
            this.applyDealFilter();
        }
    }

    showBrandPicker(show) {
        this.setState({
            brandPickerShown: show
        });
        if (show === false) {
            this.applyDealFilter();
        }
    }

    showShopPicker(show) {
        this.setState({
            shopPickerShown: show
        });
        if (show === false) {
            this.applyDealFilter();
        }
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
                    this.applyDealFilter();
                }
            });
        }
    }

    applyDealFilter() {
        this.setState({
            outfits: [],
            nothingFound: false
        });
        fetch(`${window.location.origin}/api/recommend_deals`, {
            method: 'post',
            body: JSON.stringify({
                'sex': this.state.sex,
                'cats': this.state.cats,
                'shops': this.state.shops,
                'brands': this.state.brands
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
                this.setState({
                    outfits: data.prod_suggestions
                })
            }
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
                            -{Math.round((prodSuggestion.price - prodSuggestion.saleprice) / prodSuggestion.price * 100)}%
                        </div>
                    )}
                    <div
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
                    <div><b>{prodSuggestion.brand}</b></div>
                    <div
                        style={{
                            lineHeight: '1',
                            fontSize: '0.8rem',
                            marginBottom: '2px'
                        }}
                    >
                        From {prodSuggestion.shop}
                    </div>
                </Paper>
            )
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
                        />
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
