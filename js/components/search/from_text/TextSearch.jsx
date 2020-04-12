// TextSearch.jsx
import React from "react";
require('../../../../css/garms.css');
require('../../../../css/ball-atom.css');
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import ResultsFromSearch from '../results/ResultsFromSearch';
import SearchFromImageIntro from '../../intro/SearchFromImageIntro';
import FlatButton from 'material-ui/FlatButton';
import Loyalty from 'material-ui/svg-icons/action/loyalty';
import ResultFilters from "../results/ResultFilters";
import LoadingScreen from "../../loading/LoadingScreen";
import InfiniteSpinner from "../../loading/InfiniteSpinner";
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
            loadedProdIds: null,
            infiniteCount: 0,
            infiniteLoading: false,
            infiniteLoadingComplete: false,
            searchSimilarInfinite: false
        };

        this.searchSimilarImages = this.searchSimilarImages.bind(this);
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
            const searchId = window.location.search.split('id=')[1]
                ? window.location.search.split('id=')[1].split('&')[0] : null;
            const searchColorStr = window.location.search.split('clr=')[1]
                ? window.location.search.split('clr=')[1].split('&')[0] : null;

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

                    if (searchId !== null) {
                        const decodedSearchColorStr = decodeURIComponent(searchColorStr);
                        const searchColorInts = decodedSearchColorStr.split(',').map(colorStr => {return parseInt(colorStr)});
                        this.setState({
                            posTags: parsedSearchString.split(' '),
                            selectedColor: searchColorInts
                        }, () => {
                            this.searchSimilarImages(searchId, searchColorInts);
                        });
                    } else {
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
                                        return resDict.prod_serial.prod_id
                                    });
                                    this.setState({
                                        loadedProdIds: loadedProdIds
                                    });
                                }
                            });
                    }
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
                if (this.state.infiniteCount < 10) {
                    this.setState({
                        infiniteLoading: true
                    });
                    if (this.state.searchSimilarInfinite) {
                        this.searchSimilarImagesInfinite(
                            this.state.results[0]['image_data']['img_hash'],
                            this.state.selectedColor
                        );
                    } else {
                        this.infiniteTextSearch();
                    }
                } else {
                    this.setState({
                        infiniteLoadingComplete: true
                    });
                }
            }
        }
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

    searchSimilarImages(imgHash, colorRgb1){
        this.setState({
            loading: true
        });
        ReactGA.event({
            category: "Text Search",
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
                this.setState({
                    loading: true
                });

                const posTags = this.state.posTags;
                const negTags = this.state.negTags;
                const sex = this.state.sex;
                const noShop = this.state.noShop;
                const filterBrands = this.state.filterBrands;
                let color_1 = colorRgb1 ? colorRgb1 : this.state.selectedColor;
                if (color_1.length === 0) {
                    color_1 = this.state.results[0]['image_data']['color_1'];
                }
                let maxPrice = this.state.rangeVal < 500 ? this.state.rangeVal : 1000000;

                fetch(window.location.origin + '/api/search_similar', {
                    method: 'post',
                    body: JSON.stringify({
                        img_hash: imgHash,
                        tags_positive: posTags,
                        tags_negative: negTags,
                        color_1: color_1,
                        sex: sex,
                        no_shop: noShop,
                        max_price: maxPrice,
                        brands: filterBrands
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
                        if (loadedProdIds.length > 0) {
                            this.setState({
                                results: data.res,
                                loading: false,
                                infiniteLoading: false,
                                searchSimilarInfinite: true,
                                loadedProdIds: loadedProdIds,
                                infiniteCount: 0
                            });
                            window.scrollTo({
                                top: 0,
                                behavior: "smooth"
                            });
                            window.scrollTo(0, 0);
                        } else {
                            this.setState({
                                infiniteLoadingComplete: true
                            })
                        }
                    }
                });
            });
        });
    }

    searchSimilarImagesInfinite(imgHash, colorRgb1){
        ReactGA.event({
            category: "Text Search",
            action: 'search similar',
            label: imgHash
        });

        const posTags = this.state.posTags;
        const negTags = this.state.negTags;
        const sex = this.state.sex;
        const noShop = this.state.noShop;
        const filterBrands = this.state.filterBrands;
        let color_1 = colorRgb1 ? colorRgb1 : this.state.selectedColor;
        if (color_1.length === 0) {
            color_1 = this.state.results[0]['image_data']['color_1'];
        }
        let maxPrice = this.state.rangeVal < 500 ? this.state.rangeVal : 1000000;

        fetch(window.location.origin + '/api/search_similar_infinite', {
            method: 'post',
            body: JSON.stringify({
                img_hash: imgHash,
                tags_positive: posTags,
                tags_negative: negTags,
                color_1: color_1,
                sex: sex,
                no_shop: noShop,
                max_price: maxPrice,
                brands: filterBrands,
                prev_prod_ids: this.state.loadedProdIds
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
                if (this.state.searchSimilarInfinite) {
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
                } else {
                    if (loadedProdIds.length > 0) {
                        this.setState({
                            results: data.res,
                            loading: false,
                            infiniteLoading: false,
                            searchSimilarInfinite: true,
                            loadedProdIds: loadedProdIds,
                            infiniteCount: this.state.infiniteCount + 1
                        });
                        window.scrollTo({
                            top: 0,
                            behavior: "smooth"
                        });
                        window.scrollTo(0, 0);
                    } else {
                        this.setState({
                            infiniteLoadingComplete: true
                        })
                    }
                }
            }
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
        this.searchSimilarImages(
            this.state.results[0]['image_data']['img_hash'],
            this.state.selectedColor
        )
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
        const searchStr = window.location.search.split('search=')[1].split('&')[0];
        const sexString = window.location.search.split('sex=')[1];
        const parsedSearchString = decodeURIComponent(searchStr);
        const sex = this.state.sex ? this.state.sex : sexString;

        ReactGA.event({
            category: "Text Search",
            action: 'infinite scroll',
            label: parsedSearchString,
        });

        fetch(window.location.origin + '/api/text_search_infinite', {
            method: 'post',
            body: JSON.stringify({
                sex: sex,
                search_string: parsedSearchString,
                prev_prod_ids: this.state.loadedProdIds
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
            this.searchSimilarImages(
                this.state.results[0]['image_data']['img_hash'],
                this.state.selectedColor
            );
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
                    this.searchSimilarImages(
                        this.state.results[0]['image_data']['img_hash'],
                        this.state.selectedColor
                    );
                }
            });
        }
    }

    showTagPicker(show) {
        this.setState({
            tagPickerShown: show
        });
        if (show === false) {
            this.searchSimilarImages(
                this.state.results[0]['image_data']['img_hash'],
                this.state.selectedColor
            );
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
                    tagPickerShown: showPicker
                }, () => {
                    if (showPicker === false) {
                        this.searchSimilarImages(
                            this.state.results[0]['image_data']['img_hash'],
                            this.state.selectedColor
                        );
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
                        this.searchSimilarImages(
                            this.state.results[0]['image_data']['img_hash'],
                            this.state.selectedColor
                        );
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
            this.searchSimilarImages(
                this.state.results[0]['image_data']['img_hash'],
                this.state.selectedColor
            );
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

        let Suggestions = () => {
            let key = Math.floor(Math.random() * 1000 + Math.random() * 10);
            let moreSuggestions = this.state.moreSuggestions ? this.state.moreSuggestions.map(suggestion => {
                let key = Math.floor(Math.random() * 1000 + Math.random() * 10);
                return <div
                    key={key}
                    style={{
                        fontSize: "1.05rem",
                        display: "inline-block",
                        width: "100%",
                        cursor: "pointer",
                        textAlign: "left",
                        marginBottom: "5px"
                    }}
                    onClick={() => {
                        this.setState({searchString: suggestion.replace(/^\s+|\s+$/g, '')});
                        this.textImageSearch(suggestion.replace(/^\s+|\s+$/g, ''));
                    }}
                >{suggestion} ...</div>
            }) : <div />;
            return (
                <div style={{
                    width: "400px",
                    maxWidth: "100vw",
                    textAlign: "center",
                    marginLeft: "calc(50vw - 158px)",
                    cursor: "pointer"
                }}>
                    <div
                        key={key}
                        style={{
                            fontSize: "1.35rem",
                            display: "inline-block",
                            width: "100%",
                            cursor: "pointer",
                            textAlign: "left",
                            marginBottom: "5px"
                        }}
                        onClick={() => {
                            this.setState({searchString: this.state.mainSuggestion.replace(/^\s+|\s+$/g, '')});
                            this.textImageSearch(this.state.mainSuggestion);
                        }}
                    >
                        {this.state.mainSuggestion} ...
                    </div>
                    {moreSuggestions}
                </div>
            )
        };

        let SearchBox = (
                <div className="text-search-box">
                    <div className="inner-text-search-box">
                        <TextField
                            autoFocus="autofocus"
                            className="text-search-input"
                            // hintText={this.state.searchString ? this.state.searchString : "Purple denim jeans or..."}
                            value={this.state.searchString.toUpperCase()}
                            inputStyle={{
                                fontWeight: '900',
                                fontSize: '1.2rem'
                            }}
                            floatingLabelText="What are you looking for?"
                            floatingLabelStyle={{
                                color: 'black',
                                fontSize: '1.2rem',
                                fontWeight: '400',
                            }}
                            name="searchString"
                            onChange={this.handleTextInputChange.bind(this)}
                            onKeyDown={this.onEnterPress}
                            underlineFocusStyle={{
                                borderBottom: '2px solid rgb(0, 0, 0)'
                            }}
                            underlineDisabledStyle={{
                                borderBottom: '0px solid rgb(0, 0, 0)'
                            }}
                            autoComplete="off"
                        />
                        <div className="text-search-button" onClick={() => {this.textImageSearch(this.state.searchString)}}>
                            <div className="search-icon" />
                        </div>
                    </div>
                    {this.state.mainSuggestion && <Suggestions />}
                </div>
        );

        let searchForm = this.state.sex ? (
            <div>
                {SearchBox}
            </div>
        ) : (
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
        );

        return(
            <MuiThemeProvider>
                <div>
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
                                        if (this.reactInDevMode()) {
                                            this.searchSimilarImages(img_hash, color_1);
                                        } else {
                                            const searchStr = window.location.search.split('search=')[1].split('&')[0];
                                            const sexString = window.location.search.split('sex=')[1].split('&')[0];
                                            this.props.history.push(`/textsearch?search=${searchStr}&sex=${sexString}&id=${img_hash}&clr=${encodeURIComponent(color_1)}`);
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
                                        searchSimilarImages={(imgHash, color1) => {
                                            if (this.reactInDevMode()) {
                                                this.searchSimilarImages(imgHash, color1);
                                            } else {
                                                const searchStr = window.location.search.split('search=')[1].split('&')[0];
                                                const sexString = window.location.search.split('sex=')[1].split('&')[0];
                                                this.props.history.push(`/textsearch?search=${searchStr}&sex=${sexString}&id=${imgHash}&clr=${encodeURIComponent(color1)}`);
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
                            </div>
                        ) : (
                            searchForm
                        )
                    }

                    <NoResults />

                    {
                        (this.state.results.length > 0)
                        && (this.state.firstLogin === '1')
                        && (<SearchFromImageIntro
                            completeFirstLogin={() => {this.props.completeFirstLogin()}}
                        />)
                    }

                    <Spinner />

                </div>
            </MuiThemeProvider>
        )
    }
}

export default TextSearch;
