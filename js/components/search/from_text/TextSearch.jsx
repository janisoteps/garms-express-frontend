// TextSearch.jsx
import React from "react";
require('../../../../css/garms.css');
require('../../../../css/ball-atom.css');
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import ResultsFromSearch from '../results/ResultsFromSearch';
import SearchFromImageIntro from '../../intro/SearchFromImageIntro';
import ResultFilters from "../results/result_filters/ResultFilters";
import LoadingScreen from "../../loading/LoadingScreen";
import InfiniteSpinner from "../../loading/InfiniteSpinner";
import FallBackInput from "./FallBackInput";
import ReactGA from 'react-ga';
import {Route} from "react-router-dom";


//Component to search for products using text input
class TextSearch extends React.Component  {
    constructor(props) {
        super(props);

        this.state = {
            isAuth: this.props.isAuth,
            sex: this.props.sex,
            email: this.props.email,
            pwd: '',
            files: [],
            results: [],
            colors: {},
            mainColor: '',
            mainColorNr: 1,
            cats: [],
            mainCat: '',
            selectedColor: [],
            posTags: [],
            negTags: [],
            searchString: '',
            noResult: false,
            sexPickerWidth: '48px',
            catsOn: false,
            mainSuggestion: null,
            moreSuggestions: [],
            noShop: [],
            firstLogin: this.props.firstLogin,
            rangeVal: 500,
            filterBrands: [],
            brandPickerShown: false,
            tagPickerShown: false,
            addOutfitShown: false,
            loadingContent: null,
            priceFilterShown: false,
            discountPickerShown: false,
            discountRate: 0,
            loadedProdIds: [],
            infiniteCount: 0,
            infiniteLoading: false,
            infiniteLoadingComplete: false,
            searchSimilarInfinite: false,
            initialLoadComplete: false,
            pullDownRefreshing: false
        };

        this.textImageSearch = this.textImageSearch.bind(this);
        this.handleTextInputChange = this.handleTextInputChange.bind(this);
        this.onEnterPress = this.onEnterPress.bind(this);
        this.setTags = this.setTags.bind(this);
        this.squexpandMenu = this.squexpandMenu.bind(this);
        this.updateRange = this.updateRange.bind(this);
        this.showBrandPicker = this.showBrandPicker.bind(this);
        this.addBrandFilter = this.addBrandFilter.bind(this);
        this.showTagPicker = this.showTagPicker.bind(this);
        this.addTagFilter = this.addTagFilter.bind(this);
        this.changeSex = this.changeSex.bind(this);
        this.changeOutfitShown = this.changeOutfitShown.bind(this);
        this.showPriceFilter = this.showPriceFilter.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.infiniteTextSearch = this.infiniteTextSearch.bind(this);
        this.reactInDevMode = this.reactInDevMode.bind(this);
        this.textColorSearch = this.textColorSearch.bind(this);
        this.textSearch = this.textSearch.bind(this);
        this.setRoute = this.setRoute.bind(this);
    }

    componentDidMount() {
        if(this.reactInDevMode()) {
            console.log('DEV MODE');
        }
        ReactGA.pageview(window.location.pathname + window.location.search);
        window.addEventListener('scroll', this.handleScroll, { passive: true });
        this._ismounted = true;

        const queryString = window.location.search;
        if(queryString.length > 0) {
            const searchStr = window.location.search.split('search=')[1].split('&')[0];
            const sexString = window.location.search.split('sex=')[1].split('&')[0];
            const parsedSearchString = decodeURIComponent(searchStr);
            const searchColorStr = window.location.search.split('clr=')[1]
                ? window.location.search.split('clr=')[1].split('&')[0] : null;
            const brandString = window.location.search.split('brands=')[1]
                ? window.location.search.split('brands=')[1].split('&')[0] : null;
            const priceString = window.location.search.split('price=')[1]
                ? window.location.search.split('price=')[1].split('&')[0] : null;
            const discountString = window.location.search.split('disc=')[1]
                ? window.location.search.split('disc=')[1].split('&')[0] : null;

            this.setState({
                loading: true
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
                    this.setState({
                        loading: true,
                        mainSuggestion: null,
                        moreSuggestions: []
                    });

                    const decodedSearchColorStr = searchColorStr ? decodeURIComponent(searchColorStr): null;
                    const searchColorInts = decodedSearchColorStr
                        ? decodedSearchColorStr.split(',').map(colorStr => {return parseInt(colorStr)}) : null;
                    const decodedBrandArr = brandString ? decodeURIComponent(brandString).split(',') : [];
                    const decodedPrice = priceString ? parseInt(decodeURIComponent(priceString)) : 500;
                    const decodedDiscountRate = discountString ? parseFloat(decodeURIComponent(discountString)) / 100 : 0;
                    this.setState({
                        posTags: parsedSearchString.split(' '),
                        selectedColor: searchColorInts ? searchColorInts : [],
                        filterBrands: decodedBrandArr,
                        rangeVal: decodedPrice,
                        discountRate: decodedDiscountRate,
                        sex: sexString
                    }, () => {
                        this.textColorSearch(this.state.posTags, this.state.selectedColor, sexString);
                    });
                });
            });
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
            if(this.state.infiniteLoading === false) {
                if (this.state.infiniteCount < 10 && this.state.initialLoadComplete === true) {
                    this.setState({
                        infiniteLoading: true
                    }, () => {
                        this.infiniteTextSearch();
                    });
                } else {
                    this.setState({
                        infiniteLoadingComplete: true
                    });
                }
            }
        }

        if (window.scrollY < -20) {
            this.handleNegativeScroll();
        }
        if (window.scrollY < -130) {
            if (this.state.results.length > 0) {
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
        this.props.iOSNavHide(() => {
            window.location.reload();
        });
    }

    //Handle text input change
    handleTextInputChange(event) {
        let value =  event.target.value;
        let name = event.target.name;
        this.setState({
            [name]: value
        });
    }

    squexpandMenu(flag){
        if (flag === 'squeeze'){
            for(var i=0; i<100; i++){
                let height = 'calc(100vh - 50px - ((100vh - 50px) / 100 * ' + (i + 1) + '))';
                this.setState({
                    sideMenuHeight: height
                })
            }
            this.setState({
                menuOpen: false
            });
        } else {
            for(var k=0; k<100; k++){
                let height = 'calc(100vh - 50px - ((100vh - 50px) * 100 / ' + (k + 1) + '))';

                this.setState({
                    sideMenuHeight: height
                })
            }
            this.setState({
                sideMenuHeight: null,
                menuOpen: true
            })
        }
    }

    onEnterPress = (e) => {
        if(e.keyCode === 13 && e.shiftKey === false) {
            e.preventDefault();
            this.textImageSearch();
        }
    };

    textSearch(parsedSearchString, sexString) {
        ReactGA.event({
            category: "Text Search",
            action: 'text search',
            label: parsedSearchString,
        });
        if(parsedSearchString.length === 0){
            this.setState({
                loading: false,
                noResult: true
            });
            return
        }
        const inputArray = parsedSearchString.split(' ');
        const searchString = inputArray.join('+');
        const sex = this.state.sex ? this.state.sex : sexString;

        fetch(window.location.origin + '/api/text_search?search_string=' + searchString + '&sex=' + sex, {
            method: 'get'
        }).then(function(response) { return response.json(); })
            .then(data => {
                if (typeof data.res === "undefined") {
                    this.setState({
                        results: [],
                        loading: false,
                        noResult: true
                    });
                } else {
                    this.setState({
                        results: data.res,
                        loading: false,
                        posTags: data.tags
                    });
                    if (data.res.length === 0) {
                        this.setState({
                            noResult: true
                        });
                    }
                    const loadedProdIds = data.res.map(resDict => {
                        return resDict.image_data.prod_id
                    });
                    this.setState({
                        loadedProdIds: loadedProdIds
                    });
                }
            });
    }

    textColorSearch(searchWords, searchColor, sexString) {
        const sex = sexString ? sexString : this.state.sex;
        const filterBrands = this.state.filterBrands;
        const maxPrice = this.state.rangeVal < 500 ? this.state.rangeVal : 1000000;
        const posTags = searchWords.length > 0 ? searchWords : this.state.posTags;

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
        window.scrollTo(0, 0);

        fetch(window.location.origin + '/api/text_color_search', {
            method: 'post',
            body: JSON.stringify({
                search_words: posTags,
                color: searchColor,
                sex: sex,
                prev_prod_ids: this.state.loadedProdIds,
                max_price: maxPrice,
                brands: filterBrands,
                discount_rate: this.state.discountRate
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
                    return resDict.image_data.prod_id
                });
                this.setState({
                    results: data.res,
                    loading: false,
                    loadedProdIds: loadedProdIds,
                    infiniteLoadingComplete: false,
                    initialLoadComplete: true
                });
            }
        });
    }

    // Send request to server based on input string and set the response in state
    textImageSearch(input){
        this.setState({
            loading: true
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
                this.setState({
                    loading: true,
                    mainSuggestion: null,
                    moreSuggestions: []
                });
                let inputString = input ? input : this.state.searchString;
                ReactGA.event({
                    category: "Text Search",
                    action: 'text search',
                    label: inputString,
                });
                if(inputString.length === 0){
                    this.setState({
                        loading: false,
                        noResult: true
                    });
                    return
                }
                let inputArray = inputString.split(' ');
                let searchString = inputArray.join('+');

                fetch(window.location.origin + '/api/text_search?search_string=' + searchString + '&sex=' + this.state.sex, {
                    method: 'get'
                }).then(function(response) { return response.json(); })
                    .then(data => {
                        if (typeof data.res === "undefined") {
                            this.setState({
                                results: [],
                                loading: false,
                                noResult: true
                            });
                        } else {
                            this.setState({
                                results: data.res,
                                loading: false,
                                posTags: data.tags
                            });
                            if (data.res.length === 0) {
                                this.setState({
                                    noResult: true
                                });
                            }
                        }
                    });
            });
        });
    }

    infiniteTextSearch() {
        const sexString = window.location.search.split('sex=')[1];
        const sex = this.state.sex ? this.state.sex : sexString;
        const filterBrands = this.state.filterBrands;
        const maxPrice = this.state.rangeVal < 500 ? this.state.rangeVal : 1000000;
        const searchWords = this.state.posTags;
        const searchColor = this.state.selectedColor;

        if (searchWords.length > 0) {
            ReactGA.event({
                category: "Text Search",
                action: 'infinite scroll',
                label: searchWords.join(' '),
            });

            fetch(window.location.origin + '/api/text_color_search', {
                method: 'post',
                body: JSON.stringify({
                    search_words: searchWords,
                    color: searchColor,
                    sex: sex,
                    prev_prod_ids: this.state.loadedProdIds,
                    max_price: maxPrice,
                    brands: filterBrands,
                    discount_rate: this.state.discountRate
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
                        return resDict.image_data.prod_id
                    });
                    if (loadedProdIds.length > 0) {
                        this.setState({
                            loadedProdIds: this.state.loadedProdIds.concat(loadedProdIds),
                            results: this.state.results.concat(data.res),
                            infiniteCount: this.state.infiniteCount + 1,
                            infiniteLoading: false
                        });
                    } else {
                        this.setState({
                            infiniteLoadingComplete: true
                        })
                    }
                }
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
                loading: true,
                infiniteCount: 0,
                loadedProdIds: []
            }, () => {
                const searchStr = encodeURIComponent(this.state.posTags.join(' '))
                const brandStr = encodeURIComponent(this.state.filterBrands.join(','));
                if (this.reactInDevMode()) {
                    this.setRoute({
                        type: 'textsearch',
                        searchStr: searchStr,
                        brandStr: brandStr,
                        color: this.state.selectedColor
                    });
                    this.textColorSearch(this.state.posTags, this.state.selectedColor, this.state.sex);
                } else {
                    this.setRoute({
                        type: 'textsearch',
                        searchStr: searchStr,
                        brandStr: brandStr,
                        color: this.state.selectedColor
                    });
                }
            })
        }
    }

    addBrandFilter(brand, showPicker) {
        ReactGA.event({
            category: "Brand Filter",
            action: 'apply',
            label: brand,
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
                        loading: true,
                        infiniteCount: 0,
                        loadedProdIds: []
                    }, () => {
                        const searchStr = encodeURIComponent(this.state.posTags.join(' '))
                        const brandStr = encodeURIComponent(this.state.filterBrands.join(','));
                        if (this.reactInDevMode()) {
                            this.setRoute({
                                type: 'textsearch',
                                searchStr: searchStr,
                                brandStr: brandStr,
                                color: this.state.selectedColor
                            });
                            this.textColorSearch(this.state.posTags, this.state.selectedColor, this.state.sex);
                        } else {
                            this.setRoute({
                                type: 'textsearch',
                                searchStr: searchStr,
                                brandStr: brandStr,
                                color: this.state.selectedColor
                            });
                        }
                    })
                }
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
        const searchStr = encodeURIComponent(this.state.posTags.join(' '));
        const brandStr = encodeURIComponent(this.state.filterBrands.join(','));
        this.setState({
            infiniteCount: 0,
            loadedProdIds: []
        });
        if (this.reactInDevMode()) {
            this.setRoute({
                type: 'textsearch',
                searchStr: searchStr,
                brandStr: brandStr,
                color: this.state.selectedColor
            });
            this.textColorSearch(this.state.posTags, this.state.selectedColor, this.state.sex);
        } else {
            this.setRoute({
                type: 'textsearch',
                searchStr: searchStr,
                brandStr: brandStr,
                color: this.state.selectedColor
            });
        }
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
            this.setState({
                mainCat: selectedCat
            });
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

    showTagPicker(show) {
        this.setState({
            tagPickerShown: show
        });
        if (show === false) {
            this.setState({
                loading: true,
                infiniteCount: 0,
                loadedProdIds: []
            }, () => {
                const searchStr = encodeURIComponent(this.state.posTags.join(' '));
                const brandStr = encodeURIComponent(this.state.filterBrands.join(','));
                if (this.reactInDevMode()) {
                    this.setRoute({
                        type: 'textsearch',
                        searchStr: searchStr,
                        brandStr: brandStr,
                        color: this.state.selectedColor
                    });
                    this.textColorSearch(this.state.posTags, this.state.selectedColor, this.state.sex);
                } else {
                    this.setRoute({
                        type: 'textsearch',
                        searchStr: searchStr,
                        brandStr: brandStr,
                        color: this.state.selectedColor
                    });
                }
            });
        }
    }

    addTagFilter(posTag, negTag, showPicker) {
        if(posTag) {
            ReactGA.event({
                category: "Tag Filter",
                action: 'positive',
                label: posTag,
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
                    tagPickerShown: showPicker,
                    infiniteCount: 0
                }, () => {
                    if (showPicker === false) {
                        this.setState({
                            loading: true,
                            loadedProdIds: []
                        }, () => {
                            const searchStr = encodeURIComponent(currentFilterTags.join(' '));
                            const brandStr = encodeURIComponent(this.state.filterBrands.join(','));
                            if (this.reactInDevMode()) {
                                this.setRoute({
                                    type: 'textsearch',
                                    searchStr: searchStr,
                                    brandStr: brandStr,
                                    color: this.state.selectedColor
                                });
                                this.textColorSearch(this.state.posTags, this.state.selectedColor, this.state.sex);
                            } else {
                                this.setRoute({
                                    type: 'textsearch',
                                    searchStr: searchStr,
                                    brandStr: brandStr,
                                    color: this.state.selectedColor
                                });
                            }
                        });
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
                            loading: true,
                            loadedProdIds: []
                        }, () => {
                            const searchStr = encodeURIComponent(this.state.posTags.join(' '))
                            const brandStr = encodeURIComponent(this.state.filterBrands.join(','));
                            if (this.reactInDevMode()) {
                                this.setRoute({
                                    type: 'textsearch',
                                    searchStr: searchStr,
                                    brandStr: brandStr,
                                    color: this.state.selectedColor
                                });
                                this.textColorSearch(this.state.posTags, this.state.selectedColor, this.state.sex);
                            } else {
                                this.setRoute({
                                    type: 'textsearch',
                                    searchStr: searchStr,
                                    brandStr: brandStr,
                                    color: this.state.selectedColor
                                });
                            }
                        });
                    }
                });
            }
        }
    }

    changeSex(sex){
        this.props.changeSex(sex);
        this.setState({
            sex: sex
        });
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
                loading: true,
                infiniteCount: 0,
                loadedProdIds: []
            }, () => {
                const searchStr = window.location.search.split('search=')[1].split('&')[0];
                const brandStr = encodeURIComponent(this.state.filterBrands.join(','));
                if (this.reactInDevMode()) {
                    this.setRoute({
                        type: 'textsearch',
                        searchStr: searchStr,
                        brandStr: brandStr,
                        color: this.state.selectedColor
                    });
                    this.textColorSearch(this.state.posTags, this.state.selectedColor, this.state.sex);
                } else {
                    this.setRoute({
                        type: 'textsearch',
                        searchStr: searchStr,
                        brandStr: brandStr,
                        color: this.state.selectedColor
                    });
                }
            });
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
            this.setState({
                infiniteLoadingComplete: false,
                infiniteLoading: false,
                loading: true,
                loadedProdIds: []
            }, () => {
                const searchStr = window.location.search.split('search=')[1].split('&')[0];
                const brandStr = encodeURIComponent(this.state.filterBrands.join(','));
                this.setRoute({
                    type: 'textsearch',
                    searchStr: searchStr,
                    brandStr: brandStr,
                    color: this.state.selectedColor
                });
                if (this.reactInDevMode()) {
                    this.textColorSearch(this.state.posTags, this.state.selectedColor, this.state.sex);
                }
            });
        }
    }

    setDiscountRate(rate) {
        this.setState({
            discountRate: rate
        });
    }

    setRoute(opts) {
        if (opts.type === 'textsearch') {
            const searchStr = 'searchStr' in opts ? opts.searchStr : window.location.search.split('search=')[1].split('&')[0];
            const brandStr = 'brandStr' in opts ? opts.brandStr : encodeURIComponent(this.state.filterBrands.join(','));
            const sexString = 'sexString' in opts ? opts.sexString : this.state.sex;
            const color = 'color' in opts ? encodeURIComponent(opts.color) : encodeURIComponent(this.state.selectedColor);
            const discount = Math.floor(this.state.discountRate * 100);
            const maxPrice = this.state.rangeVal;
            this.props.history.push(`/textsearch?search=${searchStr}&sex=${sexString}&clr=${color}&price=${maxPrice}&brands=${brandStr}&disc=${discount}`);
        }
        if (opts.type === 'similar') {
            const imgHash = opts.imgHash;
            const color = encodeURIComponent(opts.color);
            const posTags = encodeURIComponent(this.state.posTags);
            const discount = Math.floor(this.state.discountRate * 100);
            this.props.history.push(`/search-similar?id=${imgHash}&sex=${this.props.sex}&clr=${color}&cats=${posTags}&disc=${discount}`);
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
                                <Route render={({ history }) => (
                                    <RaisedButton className="ok-button" label="OK" onClick={() => {
                                        history.push('/textsearch');
                                        this.setState({
                                            noResult: false
                                        })
                                    }} />
                                )} />
                            </Paper>
                        </div>
                    )}
                </div>
            )
        };

        return(
            <MuiThemeProvider>
                <div
                    style={{
                        filter: `opacity(${this.state.pullDownRefreshing === false ? 1 : 0.2})`
                    }}
                >
                    {
                        this.state.results.length > 0 ? (
                            <div style={{width: '100%'}}>
                                <ResultsFromSearch
                                    sex={this.state.sex}
                                    isAuth={this.state.isAuth}
                                    mainCat={this.state.mainCat}
                                    email={this.state.email}
                                    searchSimilarImages={(
                                        img_hash,
                                        color_1
                                    ) => {
                                        this.setRoute({
                                            type: 'similar',
                                            imgHash: img_hash,
                                            color: color_1
                                        })
                                    }}
                                    results={this.state.results}
                                    setTags={(tag, type, flag) => {this.setTags(tag, type, flag)}}
                                    setColorPosTags={(selection) => {this.setColorPosTags(selection)}}
                                    selectedColor={this.state.selectedColor}
                                    firstLogin={this.props.firstLogin}
                                    changeOutfitShown={(isShown) => {this.changeOutfitShown(isShown)}}
                                    addBrandFilter={(brand, showPicker) => {this.addBrandFilter(brand, showPicker)}}
                                />

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
                                        searchSimilarImages={(imgHash, color) => {
                                            this.setState({
                                                loading: true
                                            }, () => {
                                                const sexString = window.location.search.split('sex=')[1].split('&')[0];
                                                const searchStr = window.location.search.split('search=')[1].split('&')[0];
                                                this.setRoute({
                                                    type: 'textsearch',
                                                    searchStr: searchStr,
                                                    sexString: sexString,
                                                    color: color
                                                });
                                                if (this.reactInDevMode()) {
                                                    this.textColorSearch(this.state.posTags, color, sexString);
                                                }
                                            });
                                        }}
                                        results={this.state.results}
                                        filterBrands={this.state.filterBrands}
                                        brandPickerShown={this.state.brandPickerShown}
                                        showBrandPicker={(show) => {this.showBrandPicker(show)}}
                                        addBrandFilter={(brand, showPicker) => {this.addBrandFilter(brand, showPicker)}}
                                        showPriceFilter={(show) => {this.showPriceFilter(show)}}
                                        priceFilterShown={this.state.priceFilterShown}
                                        showDiscountPicker={(show) => {this.showDiscountPicker(show)}}
                                        discountPickerShown={this.state.discountPickerShown}
                                        setDiscountRate={(rate) => {this.setDiscountRate(rate)}}
                                        discountRate={this.state.discountRate}
                                    />
                                )}
                            </div>
                        ) : (
                            <FallBackInput
                                searchString={this.state.searchString}
                                handleTextInputChange={() => {this.handleTextInputChange()}}
                                onEnterPress={() => {this.onEnterPress()}}
                                textImageSearch={(searchStr) => {this.textImageSearch(searchStr)}}
                                changeSex={(sex) => {this.changeSex(sex)}}
                                sex={this.props.sex}
                            />
                        )
                    }

                    <NoResults />

                    {
                        (this.state.results.length > 0)
                        && (this.state.firstLogin === '1')
                        && (
                            <SearchFromImageIntro
                                completeFirstLogin={() => {this.props.completeFirstLogin()}}
                            />
                        )
                    }

                    <Spinner />
                </div>
            </MuiThemeProvider>
        )
    }
}

export default TextSearch;
