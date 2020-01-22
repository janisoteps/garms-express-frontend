// SearchFromId.jsx
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
import ResultFilters from './../results/ResultFilters';
import LoadingScreen from "../../loading/LoadingScreen";


//Component to search for products using text input
class SearchFromId extends React.Component  {

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
            searchString: null,
            noResult: false,
            sexPickerWidth: '48px',
            catsOn: false,
            mainSuggestion: null,
            moreSuggestions: [],
            noShop: [],
            firstLogin: this.props.firstLogin,
            imgHash: null,
            rangeVal: 500,
            filterBrands: [],
            brandPickerShown: false,
            tagPickerShown: false,
            addOutfitShown: false,
            loadingContent: null,
            priceFilterShown: false,
            initialLoad: false
        };

        this.searchSimilarImages = this.searchSimilarImages.bind(this);
        this.textImageSearch = this.textImageSearch.bind(this);
        this.handleTextInputChange = this.handleTextInputChange.bind(this);
        this.onEnterPress = this.onEnterPress.bind(this);
        this.showCatPicker = this.showCatPicker.bind(this);
        this.setMainCats = this.setMainCats.bind(this);
        this.setTags = this.setTags.bind(this);
        this.squexpandMenu = this.squexpandMenu.bind(this);
        this.updateRange = this.updateRange.bind(this);
        this.showBrandPicker = this.showBrandPicker.bind(this);
        this.addBrandFilter = this.addBrandFilter.bind(this);
        this.showTagPicker = this.showTagPicker.bind(this);
        this.addTagFilter = this.addTagFilter.bind(this);
        this.changeOutfitShown = this.changeOutfitShown.bind(this);
        this.showPriceFilter = this.showPriceFilter.bind(this);
    }

    componentDidMount() {
        const queryString = window.location.search;
        if(queryString.length > 0) {
            const imgHash = window.location.search.split('id=')[1];
            this.setState({
                imgHash: imgHash
            });

            fetch(`${window.location.origin}/api/get_image`, {
                method: 'post',
                body: JSON.stringify({'img_hash': imgHash}),
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                }
            }).then(function(response) {
                return response.json();
            }).then(data => {
                const img_data = data[0];
                let posTags = img_data.all_cats;
                if(posTags.includes('dress') && posTags.includes('dresses')) {
                    posTags = posTags.filter(item => {return item !== 'dresses'});
                }
                this.setState({
                    posTags: posTags,
                    sex: img_data.sex,
                    selectedColor: img_data.color_1,
                    initialLoad: true
                });
                this.searchSimilarImages(this.state.imgHash, img_data.color_1)
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

    //Handle text input change
    handleTextInputChange(event) {
        let value =  event.target.value;
        let name = event.target.name;
        this.setState({
            [name]: value
        });

        if (value.substr(-1) === ' ') {
            let inputText = value.replace(/^\s+|\s+$/g, '');

            fetch(window.location.origin + '/api/sequences', {
                method: 'post',
                body: JSON.stringify({input_text: inputText}),
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                }
            }).then((response) => { return response.json(); })
                .then((data) => {
                    this.setState({
                        mainSuggestion: data.main_pred,
                        moreSuggestions: data.sim_pred
                    });
                });
        }
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

                let posTags = this.state.posTags;
                let negTags = this.state.negTags;
                // if (this.state.initialLoad === true) {
                //     posTags = null
                // }
                let sex = this.state.sex;
                let noShop = this.state.noShop;
                let filterBrands = this.state.filterBrands;
                let color_1 = colorRgb1 ? colorRgb1 : this.state.selectedColor;
                // let color_2 = colorRgb2 ? colorRgb2 : this.state.selectedColors[1];
                let maxPrice = this.state.rangeVal < 500 ? this.state.rangeVal : 1000000;

                fetch(window.location.origin + '/api/search_similar', {
                    method: 'post',
                    body: JSON.stringify({
                        img_hash: imgHash,
                        tags_positive: posTags,
                        tags_negative: negTags,
                        color_1: color_1,
                        // color_2: color_2,
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
                    this.setState({
                        results: data.res,
                        loading: false,
                        // prodImgShown: prodImgShown
                    });
                    window.scrollTo({
                        top: 0,
                        behavior: "smooth"
                    });
                    window.scrollTo(0, 0);
                });
            });
        });
    }

    // Set main color and category state based on selection from modal
    setColorPosTags(selection){
        if(selection['cat']) {
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
    }

    // Send request to server based on input string and set the response in state
    textImageSearch(input){
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
                            let results =  data.res;
                            let prodImgShown = Object.assign(
                                {}, ...results.map(product => ({[product['prod_serial'][0]['prod_hash']]: {
                                        'img_shown': Math.floor(Math.random() * (product['prod_serial'][0]['img_urls'].length)),
                                        'img_count': product['prod_serial'][0]['img_urls'].length
                                    }}))
                            );
                            this.setState({
                                results: data.res,
                                loading: false,
                                prodImgShown: prodImgShown,
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

    setMainCats(mainCat, mainCat2){
        this.setState({
            mainCat: mainCat,
            mainCat2: mainCat2
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
                                <RaisedButton className="ok-button" label="OK" onClick={() => { window.location.reload(); }} />
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
                        hintText={this.state.searchString ? this.state.searchString : "Purple denim jeans or..."}
                        floatingLabelText="What's your outfit idea?"
                        floatingLabelStyle={{
                            color: 'black'
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
                    />
                    <div className="text-search-button" onClick={this.textImageSearch}>
                        <div className="search-icon" />
                        {/*<div className="search-text"> search</div>*/}
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
                        this.state.results.length > 0 && (
                            <div style={{textAlign: 'center', width: '100%'}}>
                                <ResultsFromSearch
                                    isAuth={this.state.isAuth}
                                    mainCat={this.state.mainCat}
                                    email={this.state.email}
                                    searchSimilarImages={(
                                        img_hash,
                                        color_1
                                    ) => { this.searchSimilarImages(
                                        img_hash,
                                        color_1
                                    ) }}
                                    results={this.state.results}
                                    setTags={(tag, type, flag) => {this.setTags(tag, type, flag)}}
                                    setColorPosTags={(selection) => {this.setColorPosTags(selection)}}
                                    selectedColor={this.state.selectedColor}
                                    firstLogin={this.props.firstLogin}
                                    changeOutfitShown={(isShown) => {this.changeOutfitShown(isShown)}}
                                />
                            </div>
                        )
                    }

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
                                this.searchSimilarImages(imgHash, color1)
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

export default SearchFromId;
