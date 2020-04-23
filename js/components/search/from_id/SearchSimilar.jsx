// SearchFromId.jsx
import React from "react";
require('../../../../css/garms.css');
require('../../../../css/ball-atom.css');
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import ResultsFromSearch from '../results/ResultsFromSearch';
import ResultFilters from './../results/ResultFilters';
import LoadingScreen from "../../loading/LoadingScreen";
import ReactGA from "react-ga";
import InfiniteSpinner from "../../loading/InfiniteSpinner";


//Component to search for products using text input
class SearchSimilar extends React.Component  {

    constructor(props) {
        super(props);
        this.state = {
            isAuth: this.props.isAuth,
            sex: this.props.sex,
            searchSex: null,
            email: this.props.email,
            results: [],
            selectedColor: [],
            searchTags: [],
            posTags: [],
            negTags: [],
            noResult: false,
            imgHash: null,
            rangeVal: 500,
            filterBrands: [],
            brandPickerShown: false,
            tagPickerShown: false,
            addOutfitShown: false,
            loadingContent: null,
            priceFilterShown: false,
            initialLoad: false,
            loadedProdIds: [],
            infiniteLoading: false,
            infiniteCount: 0,
            infiniteLoadingComplete: false,
        };

        this.searchSimilar = this.searchSimilar.bind(this);
        this.showCatPicker = this.showCatPicker.bind(this);
        this.setTags = this.setTags.bind(this);
        this.updateRange = this.updateRange.bind(this);
        this.showBrandPicker = this.showBrandPicker.bind(this);
        this.addBrandFilter = this.addBrandFilter.bind(this);
        this.showTagPicker = this.showTagPicker.bind(this);
        this.addTagFilter = this.addTagFilter.bind(this);
        this.changeOutfitShown = this.changeOutfitShown.bind(this);
        this.showPriceFilter = this.showPriceFilter.bind(this);
        this.reactInDevMode = this.reactInDevMode.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
    }

    componentDidMount() {
        this._ismounted = true;
        window.addEventListener('scroll', this.handleScroll, { passive: true });
        ReactGA.pageview(window.location.pathname + window.location.search);
        const queryString = window.location.search;
        if(queryString.length > 0) {
            const imgHash = window.location.search.split('id=')[1].split('&')[0];
            const sexString = window.location.search.split('sex=')[1].split('&')[0];
            const searchColorStr = window.location.search.split('clr=')[1]
                ? window.location.search.split('clr=')[1].split('&')[0] : null;
            const searchCatString = window.location.search.split('cats=')[1]
                ? window.location.search.split('cats=')[1].split('&')[0] : null;

            const decodedSearchColorStr = searchColorStr ? decodeURIComponent(searchColorStr) : null;
            const searchColorArr = decodedSearchColorStr ? decodedSearchColorStr.split(',').map(colorStr => {
                return parseInt(colorStr)
            }) : [];
            const decodedSearchCatArr = decodeURIComponent(searchCatString).split(',');
            this.setState({
                imgHash: imgHash,
                loading: true,
                searchSex: sexString,
                selectedColor: searchColorArr,
                searchTags: decodedSearchCatArr
            }, () => {
                ReactGA.event({
                    category: "Search Similar",
                    action: 'initial search',
                    label: imgHash,
                });
                this.searchSimilarImages(imgHash, searchColorArr);
            });
        } else {
            this.setState({
                noResult: true
            })
        }
    }

    componentDidUpdate(prevProps){
        if(prevProps.firstLogin !== this.props.firstLogin){
            this.setState({
                firstLogin: this.props.firstLogin
            });
        }
    }

    componentWillUnmount() {
        this._ismounted = false;
        window.removeEventListener('scroll', this.handleScroll);
    }

    reactInDevMode(){
        return '_self' in React.createElement('div');
    }

    handleScroll(event) {
        const docHeight = document.body.scrollHeight;
        const scrollDistance = window.pageYOffset + document.body.clientHeight;

        if (scrollDistance > (docHeight - docHeight * (0.7 ** (this.state.infiniteCount + 1)))) {
            if(
                this.state.infiniteLoading === false
                && this.state.infiniteLoadingComplete === false
                && this.state.loading === false
            ) {
                if (this.state.infiniteCount < 10) {
                    this.setState({
                        infiniteLoading: true
                    });
                    this.searchSimilar();
                } else {
                    this.setState({
                        infiniteLoadingComplete: true,
                        infiniteLoading: false
                    });
                }
            }
        }
    }

    searchSimilar(){
        console.log('searchSimilar')
        this.setState({
            loading: this.state.infiniteLoading === false
        });
        ReactGA.event({
            category: "Search Similar",
            action: 'search similar',
            label: this.state.imgHash
        });
        fetch(`${window.location.origin}/api/get_random_loading_content`, {
            method: 'get',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(function(response) {
            return response.json();
        }).then(data => {
            this.setState({
                loadingContent: data
            }, () => {
                if(this.state.infiniteLoading === false) {
                    window.scrollTo({
                        top: 0
                    });
                    window.scrollTo(0, 0);
                }
                fetch(window.location.origin + '/api/search_similar_infinite', {
                    method: 'post',
                    body: JSON.stringify({
                        img_hash: this.state.imgHash,
                        tags_positive: this.state.posTags,
                        tags_negative: this.state.negTags,
                        color_1: this.state.selectedColor,
                        sex: this.state.searchSex,
                        no_shop: null,
                        max_price: this.state.rangeVal < 500 ? this.state.rangeVal : 1000000,
                        brands: this.state.filterBrands,
                        prev_prod_ids: this.state.loadedProdIds,
                        initial_req: false
                    }),
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    }
                }).then(function(response) {
                    return response.json();
                }).then(data => {
                    if (this._ismounted) {
                        const loadedProdIds = data.res.map(resDict => {
                            return resDict.prod_serial.prod_id
                        });
                        console.log(`loadedProdIds len: ${loadedProdIds.length}`)
                        if (loadedProdIds.length > 0) {
                            const img_data = data.res[0].image_data;
                            let posTags = img_data.all_cats;
                            if(posTags.includes('dress') && posTags.includes('dresses')) {
                                posTags = posTags.filter(item => {return item !== 'dresses'});
                            }
                            this.setState({
                                results: this.state.infiniteLoading === true ? this.state.results.concat(data.res) : data.res,
                                loading: false,
                                loadedProdIds: this.state.infiniteLoading === true
                                    ? this.state.loadedProdIds.concat(loadedProdIds) : loadedProdIds,
                                infiniteCount: this.state.infiniteLoading === true ? this.state.infiniteCount + 1 : 0,
                                infiniteLoading: false,
                                posTags: this.state.posTags.length > 0 ? this.state.posTags : posTags
                            });
                        } else {
                            this.setState({
                                infiniteLoadingComplete: true,
                                infiniteLoading: false,
                            })
                        }
                    }
                });
            });
        });
    }

    searchSimilarImages(imgHash, colorRgb){
        console.log('searchSimilarImages')
        this.setState({
            loading: true
        });
        ReactGA.event({
            category: "Search Similar",
            action: 'search similar',
            label: imgHash
        });
        fetch(`${window.location.origin}/api/get_random_loading_content`, {
            method: 'get',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(function(response) {
            return response.json();
        }).then(data => {
            this.setState({
                loadingContent: data
            }, () => {

                fetch(window.location.origin + '/api/search_similar_infinite', {
                    method: 'post',
                    body: JSON.stringify({
                        img_hash: imgHash,
                        tags_positive: this.state.searchTags,
                        tags_negative: [],
                        color_1: colorRgb,
                        sex: this.state.searchSex,
                        no_shop: null,
                        max_price: this.state.rangeVal < 500 ? this.state.rangeVal : 1000000,
                        brands: this.state.filterBrands,
                        prev_prod_ids: this.state.loadedProdIds,
                        initial_req: true
                    }),
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    }
                }).then(function(response) {
                    return response.json();
                }).then(data => {
                    if (this._ismounted) {
                        // const img_data = data.res[0].image_data;
                        // let posTags = img_data.all_cats;
                        // if(posTags.includes('dress') && posTags.includes('dresses')) {
                        //     posTags = posTags.filter(item => {return item !== 'dresses'});
                        // }
                        const loadedProdIds = data.res.map(resDict => {
                            return resDict.prod_serial.prod_id
                        });
                        console.log(`loadedProdIds len: ${loadedProdIds.length}`)
                        if (loadedProdIds.length > 0) {
                            this.setState({
                                results: data.res,
                                loading: false,
                                loadedProdIds: loadedProdIds,
                                infiniteCount: 0,
                                infiniteLoading: false,
                                infiniteLoadingComplete: false,
                                posTags: data.cats,
                                selectedColor: data.color
                            }, () => {
                                window.scrollTo({
                                    top: 0
                                });
                                window.scrollTo(0, 0);
                            });
                        } else {
                            this.setState({
                                infiniteLoadingComplete: true,
                                infiniteLoading: false,
                            })
                        }
                    }
                });
            });
        });
    }

    // Set main color and category state based on selection from modal
    setColorPosTags(selection){
        if(selection['cat']) {
            ReactGA.event({
                category: "Tag Filter",
                action: 'positive',
                label: selection['cat'],
            });
            let selectedCat = selection['cat'];
            let tags = this.state.posTags;
            if (tags.includes(selectedCat)){
                let filteredTags = tags.filter(function(e) { return e !== selectedCat });
                this.setState({
                    posTags: filteredTags
                });
            } else {
                tags = tags.concat(selectedCat);
                this.setState({
                    posTags: tags
                });
            }
        } else {
            ReactGA.event({
                category: "Color Filter",
                action: 'apply',
                label: `${selection['color_rgb']}`,
            });
            let colorRgb = selection['color_rgb'];
            this.setState({
                selectedColor: colorRgb
            });
        }
    }

    setTags(tag, type, flag){
        let posTags = this.state.posTags;
        let negTags = this.state.negTags;
        if (flag === 'remove') {
            if (type === 'positive') {
                posTags = posTags.filter(function(e) { return e !== tag });
                this.setState({
                    posTags: posTags
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
                        posTags: posTags
                    });
                }
            } else if (type === 'negative') {
                if (posTags.includes(tag)) {
                    posTags = posTags.filter(function(e) { return e !== tag });
                    this.setState({
                        posTags: posTags
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
        this.setState({
            loadedProdIds: []
        }, () => {
            this.searchSimilar()
        })
    }

    showCatPicker(){
        if(this.state.catsOn === false){
            this.setState({
                catsOn: true
            });
        } else {
            this.setState({
                catsOn: false
            });
        }
    }

    updateRange(val, callback) {
        this.setState({
            rangeVal: val
        }, () => {
            callback();
        });
    }

    showBrandPicker(show) {
        this.setState({
            brandPickerShown: show
        });
        if (show === false) {
            this.setState({
                loadedProdIds: []
            }, () => {
                this.searchSimilar()
            })
        }
    }

    addBrandFilter(brand, showPicker) {
        ReactGA.event({
            category: "Brand Filter",
            action: 'apply',
            label: brand
        });
        let currentFilterBrands = this.state.filterBrands;
        if (currentFilterBrands.indexOf(brand) !== -1) {
            const newFilterBrands = currentFilterBrands.filter(checkedBrand => {
                return checkedBrand !== brand
            });
            this.setState({
                filterBrands: newFilterBrands,
                brandPickerShown: showPicker
            });
        } else {
            currentFilterBrands.push(brand);
            this.setState({
                filterBrands: currentFilterBrands,
                brandPickerShown: showPicker
            }, () => {
                if (showPicker === false) {
                    this.setState({
                        loadedProdIds: []
                    }, () => {
                        this.searchSimilar()
                    })
                }
            });
        }
    }

    showTagPicker(show) {
        this.setState({
            tagPickerShown: show
        });
        if (show === false) {
            this.setState({
                loadedProdIds: []
            }, () => {
                this.searchSimilar()
            })
        }
    }

    addTagFilter(posTag, negTag, showPicker) {
        if(posTag) {
            ReactGA.event({
                category: "Tag Filter",
                action: 'positive',
                label: posTag
            });
            let currentFilterTags = this.state.posTags;
            if (currentFilterTags.indexOf(posTag) !== -1) {
                const newFilterBrandTags = currentFilterTags.filter(checkedTag => {
                    return checkedTag !== posTag
                });
                this.setState({
                    posTags: newFilterBrandTags,
                    tagPickerShown: showPicker
                });
            } else {
                currentFilterTags.push(posTag);
                this.setState({
                    posTags: currentFilterTags,
                    tagPickerShown: showPicker
                }, () => {
                    if (showPicker === false) {
                        this.setState({
                            loadedProdIds: []
                        }, () => {
                            this.searchSimilar()
                        })
                    }
                });
            }
        } else {
            ReactGA.event({
                category: "Tag Filter",
                action: 'negative',
                label: negTag,
            });
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
                        this.setState({
                            loadedProdIds: []
                        }, () => {
                            this.searchSimilar()
                        })
                    }
                });
            }
        }
    }

    changeOutfitShown(isShown){
        this.setState({
            addOutfitShown: isShown
        })
    }

    showPriceFilter(show) {
        this.setState({
            priceFilterShown: show
        });
        if (show === false) {
            ReactGA.event({
                category: "Price Filter",
                action: 'apply',
                value: this.state.rangeVal
            });
            this.setState({
                loadedProdIds: []
            }, () => {
                this.searchSimilar()
            })
        }
    }

    // ------------------------ MAIN RENDER FUNCTION ----------------------------
    render () {
        // Render a spinner if loading state is true
        let Spinner = () => {
            return(
                <div>
                    {(this.state.loading === true) && (
                        <LoadingScreen
                            loadingContent={this.state.loadingContent}
                        />
                    )}
                </div>
            )
        };

        let NoResults = () => {
            return(
                <div>
                    {(this.state.noResult === true) && (
                        <div className="overlay">
                            <Paper zDepth={1} className="error-modal">
                                <h3>Couldn't find anything, try a different search</h3>
                                <RaisedButton className="ok-button" label="OK" onClick={() => { window.location.reload(); }} />
                            </Paper>
                        </div>
                    )}
                </div>
            )
        };

        return(
            <MuiThemeProvider>
                <div>
                    {this.state.results.length > 0 && (
                        <div style={{textAlign: 'center', width: '100%'}}>
                            <ResultsFromSearch
                                sex={this.state.sex}
                                isAuth={this.state.isAuth}
                                mainCat={this.state.mainCat}
                                email={this.state.email}
                                searchSimilarImages={(
                                    img_hash,
                                    color_1
                                ) => {
                                    if (this.reactInDevMode()) {
                                        console.log('DEV MODE')
                                        // this.searchSimilarImages(img_hash, color_1);
                                        this.setState({
                                            loadedProdIds: [],
                                            imgHash: img_hash,
                                            results: []
                                        }, () => {
                                            this.props.history.push(`/search-similar?id=${img_hash}&sex=${this.props.sex}&clr=${encodeURIComponent(color_1)}&cats=${encodeURIComponent(this.state.searchTags)}`);
                                            this.searchSimilarImages(img_hash, color_1);
                                        })
                                    } else {
                                        this.setState({
                                            loadedProdIds: [],
                                            imgHash: img_hash
                                        }, () => {
                                            this.props.history.push(`/search-similar?id=${img_hash}&sex=${this.props.sex}&clr=${encodeURIComponent(color_1)}&cats=${encodeURIComponent(this.state.searchTags)}`);
                                        })
                                    }
                                }}
                                results={this.state.results}
                                setTags={(tag, type, flag) => {this.setTags(tag, type, flag)}}
                                setColorPosTags={(selection) => {this.setColorPosTags(selection)}}
                                selectedColor={this.state.selectedColor}
                                firstLogin={this.props.firstLogin}
                                changeOutfitShown={(isShown) => {this.changeOutfitShown(isShown)}}
                                addBrandFilter={(brand, showPicker) => {this.addBrandFilter(brand, showPicker)}}
                            />
                        </div>
                    )}

                    <NoResults />

                    {this.state.addOutfitShown === false && (
                        <ResultFilters
                            range={this.state.rangeVal}
                            updateRange={(val, callback) => {this.updateRange(val, callback)}}
                            loading={this.state.loading}
                            posTags={this.state.posTags}
                            negTags={this.state.negTags}
                            setTags={(tag, type, flag) => {this.setTags(tag, type, flag)}}
                            addTagFilter={(posTag, negTag, showPicker) => {this.addTagFilter(posTag, negTag, showPicker)}}
                            showTagPicker={(show) => {this.showTagPicker(show)}}
                            tagPickerShown={this.state.tagPickerShown}
                            setColor={(selection) => {this.setColorPosTags(selection)}}
                            selectedColor={this.state.selectedColor}
                            searchSimilarImages={(imgHash, color1) => {
                                if (this.reactInDevMode()) {
                                    // this.props.history.push(`/search-similar?id=${imgHash}&sex=${this.props.sex}&clr=${encodeURIComponent(color1)}`);
                                    this.props.history.push(`/search-similar?id=${imgHash}&sex=${this.props.sex}
                                            &clr=${encodeURIComponent(color1)}&cats=${encodeURIComponent(this.state.searchTags)}`);
                                    // this.searchSimilarImages(imgHash, color1);
                                    this.setState({
                                        loadedProdIds: [],
                                        results: []
                                    }, () => {
                                        this.searchSimilar()
                                    })
                                } else {
                                    // this.props.history.push(`/search-similar?id=${imgHash}&sex=${this.props.sex}&clr=${encodeURIComponent(color1)}`);
                                    this.props.history.push(`/search-similar?id=${imgHash}&sex=${this.props.sex}
                                            &clr=${encodeURIComponent(color1)}&cats=${encodeURIComponent(this.state.searchTags)}`);
                                }
                            }}
                            results={this.state.results}
                            filterBrands={this.state.filterBrands}
                            brandPickerShown={this.state.brandPickerShown}
                            showBrandPicker={(show) => {this.showBrandPicker(show)}}
                            addBrandFilter={(brand, showPicker) => {this.addBrandFilter(brand, showPicker)}}
                            showPriceFilter={(show) => {this.showPriceFilter(show)}}
                            priceFilterShown={this.state.priceFilterShown}
                        />
                    )}

                    {this.state.infiniteLoading && !this.state.infiniteLoadingComplete && (
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

                    <Spinner />
                </div>
            </MuiThemeProvider>
        )
    }
}

export default SearchSimilar;
