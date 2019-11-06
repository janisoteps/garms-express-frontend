// TextSearch.jsx
import React from "react";
require('../../../../css/garms.css');
require('../../../../css/ball-atom.css');
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import ResultsFromSearch from '../results/ResultsFromSearch';
// import TagCloud from '../results/TagCloud';
// import ColorPicker from '../results/ColorPicker';
import SearchFromImageIntro from '../../intro/SearchFromImageIntro';
import FlatButton from 'material-ui/FlatButton';
import Loyalty from 'material-ui/svg-icons/action/loyalty';
// import PriceFilter from './../results/PriceFilter';
import ResultFilters from "../results/ResultFilters";


//Component to search for products using text input
class TextSearch extends React.Component  {

    constructor(props) {
        super(props);
        // console.log('constructor sex: ', this.props.sex);

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
            selectedColors: [],
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
            tagPickerShown: false
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

    // searchSimilarImages(imgHash, colorRgb1, colorRgb2){
    //     this.setState({
    //         loading: true
    //     });
    //     let posTags = this.state.posTags.toString().replace(/\s+/g, '');
    //     let negTags = this.state.negTags.toString().replace(/\s+/g, '');
    //     let sex = this.state.sex;
    //     let noShop = this.state.noShop.toString().replace(/\s+/g, '');
    //     let filterBrands = this.state.filterBrands.toString().replace(/\s+/g, '');
    //     let color_1 = colorRgb1.toString().replace(/\s+/g, '');
    //     let color_2 = colorRgb2.toString().replace(/\s+/g, '');
    //     let maxPrice = this.state.rangeVal < 500 ? this.state.rangeVal : 1000000;
    //     let searchString = window.location.origin + '/api/search_similar?'
    //         + 'img_hash=' + imgHash
    //         + '&tags_positive=' + posTags
    //         + '&tags_negative=' + negTags
    //         + '&color_1=' + color_1
    //         + '&color_2=' + color_2
    //         + '&sex=' + sex
    //         + '&no_shop=' + noShop
    //         + '&max_price=' + maxPrice
    //         + '&brands=' + filterBrands;
    //     // console.log('Search string: ', searchString);
    //     fetch(searchString, {
    //         method: 'get',
    //     }).then(function(response) {
    //         return response.json();
    //     }).then(data => {
    //         this.setState({
    //             results: data.res,
    //             loading: false,
    //             // prodImgShown: prodImgShown
    //         });
    //         window.scrollTo({
    //             top: 0,
    //             behavior: "smooth"
    //         });
    //         window.scrollTo(0, 0);
    //     });
    // }

    searchSimilarImages(imgHash, colorRgb1, colorRgb2){
        this.setState({
            loading: true
        });

        let posTags = this.state.posTags;
        let negTags = this.state.negTags;
        let sex = this.state.sex;
        let noShop = this.state.noShop;
        let filterBrands = this.state.filterBrands;
        let color_1 = colorRgb1 ? colorRgb1 : this.state.results[0]['image_data']['color_1'];
        let color_2 = colorRgb2 ? colorRgb2 : this.state.results[0]['image_data']['color_2'];
        let maxPrice = this.state.rangeVal < 500 ? this.state.rangeVal : 1000000;

        fetch(window.location.origin + '/api/search_similar', {
            method: 'post',
            body: JSON.stringify({
                img_hash: imgHash,
                tags_positive: posTags,
                tags_negative: negTags,
                color_1: color_1,
                color_2: color_2,
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
                loading: false
            }, () => {
                if(this.state.selectedColors.length === 0 && this.state.results.length > 0) {
                    this.setState({
                        selectedColors: [
                            this.state.results[0]['image_data']['color_1'],
                            this.state.results[0]['image_data']['color_2']
                        ]
                    })
                }
            });
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
            window.scrollTo(0, 0);
        });
    }

    // Set main color and category state based on selection from modal
    setColorPosTags(selection){
        // console.log(selection)
        if(selection['cat']) {
            let selectedCat = selection['cat'];
            // console.log('Cat selections: ', selectedCat);
            let tags = this.state.posTags;
            if (tags.includes(selectedCat)){
                let filteredTags = tags.filter(function(e) { return e !== selectedCat });
                this.setState({
                    posTags: filteredTags
                });
            } else {
                tags = tags.concat(selectedCat);
                // console.log('New posTags: ', tags);
                this.setState({
                    posTags: tags
                });
            }
            this.setState({
                mainCat: selectedCat
            });
        } else {
            // let colorNr = selection['color_nr'];
            let colorRgb = selection['color_rgb'];
            let selectedColors = this.state.selectedColors;
            selectedColors.unshift(colorRgb);
            if (selectedColors.length > 2) {
                selectedColors.pop();
            } else if (selectedColors.length === 1) {
                selectedColors.unshift(colorRgb);
            }
            this.setState({
                selectedColors: selectedColors
            });
        }
    }

    setTags(tag, type, flag){
        let posTags = this.state.posTags;
        let negTags = this.state.negTags;
        // console.log(flag + ' ' + type + ' tag with value ' + tag);
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

        // console.log('String search with: ', searchString);
        fetch(window.location.origin + '/api/text_search?search_string=' + searchString + '&sex=' + this.state.sex, {
            method: 'get'
        }).then(function(response) { return response.json(); })
            .then(data => {
                // console.log('Response: ', data);
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
                        // prodImgShown: prodImgShown,
                        posTags: data.tags
                    });
                    if (data.res.length === 0) {
                        this.setState({
                            noResult: true
                        });
                    }
                }
            });
    }

    // //Submits login request to server and sets state/cookies if successful
    // handleLoginSubmit(event) {
    //     event.preventDefault();
    //     let email = this.state.email;
    //     let pwd = this.state.pwd;
    //     fetch(window.location.origin + '/api/login', {
    //         method: 'post',
    //         body: JSON.stringify({email: email, pwd: pwd}),
    //         headers: {
    //             Accept: 'application/json',
    //             'Content-Type': 'application/json',
    //         }
    //     }).then(function(response) { return response.json(); })
    //         .then(function(data) {
    //             // console.log(data);
    //             if (data === "OK") {
    //                 this.setState({
    //                     isAuth: true
    //                 });
    //             }
    //         });
    // }

    // setMainCatsAndSearchSimilar(mainCat1, mainCat2, nr1_cat_ai, nr1_cat_sc, img_cat_sc_txt, color_1, siamese_64, prod_id){
    //     // console.log('Similar image search launched, prod id: ', prod_id);
    //     this.setState({
    //         loading: true
    //     });
    //
    //     let mainColor = color_1.toString().replace(/\s+/g, '');
    //     // let mainColor = this.state.mainColor;
    //     let siam_64 = siamese_64.toString().replace(/\s+/g, '');
    //
    //     let searchString = window.location.origin + '/api/search?nr1_cat_ai=' + nr1_cat_ai
    //         + '&main_cat=' + mainCat1
    //         + '&main_cat2=' + mainCat2
    //         + '&nr1_cat_sc=' + nr1_cat_sc
    //         + '&color_1=[' + mainColor
    //         + ']&pca_256=[' + siam_64
    //         + ']&sex=' + this.state.sex
    //         + '&id=' + prod_id;
    //
    //     // console.log('search string: ', searchString);
    //
    //     fetch(searchString, {
    //         method: 'get',
    //     }).then(function(response) {
    //         return response.json();
    //     }).then(data => {
    //         // console.log(data);
    //         this.setState({
    //             results: data.res,
    //             loading: false
    //         });
    //         window.scrollTo({
    //             top: 0,
    //             behavior: "smooth"
    //         });
    //         window.scrollTo(0, 0);
    //     });
    // }

    // changeSex(sex){
    //     this.props.changeSex(sex);
    //     this.setState({
    //         sex: sex
    //     });
    // }
    //
    // expandSexSelector(){
    //     let currentWidth = this.state.sexPickerWidth;
    //
    //     // console.log('Expanding sex selector ', currentWidth);
    //     if(currentWidth === '48px'){
    //         this.setState({
    //             sexPickerWidth: '270px'
    //         });
    //     } else {
    //         this.setState({
    //             sexPickerWidth: '48px'
    //         });
    //     }
    // }

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

    updateRange(val) {
        this.setState({
            rangeVal: val
        });
    }

    showBrandPicker(show) {
        this.setState({
            brandPickerShown: show
        });
        if (show === false) {
            this.searchSimilarImages(
                this.state.results[0]['image_data']['img_hash'],
                this.state.selectedColors[0],
                this.state.selectedColors[1]
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
                        this.state.selectedColors[0],
                        this.state.selectedColors[1]
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
                this.state.selectedColors[0],
                this.state.selectedColors[1]
            );
        }
    }

    addTagFilter(tag, showPicker) {
        let currentFilterTags = this.state.posTags;
        if (currentFilterTags.indexOf(tag) !== -1) {
            const newFilterBrandTags = currentFilterTags.filter(checkedTag => {
                return checkedTag !== tag
            });
            this.setState({
                posTags: newFilterBrandTags,
                tagPickerShown: showPicker
            });
        } else {
            currentFilterTags.push(tag);
            this.setState({
                posTags: currentFilterTags,
                tagPickerShown: showPicker
            }, () => {
                if (showPicker === false) {
                    this.searchSimilarImages(
                        this.state.results[0]['image_data']['img_hash'],
                        this.state.selectedColors[0],
                        this.state.selectedColors[1]
                    );
                }
            });
        }
    }

    // ------------------------ MAIN RENDER FUNCTION ----------------------------
    render () {
        // Render a spinner if loading state is true
        let Spinner = () => {
            return(
                <div>
                    {(this.state.loading === true) && (
                        <div className="overlay">
                            <div className="la-ball-atom la-3x">
                                <div />
                                <div />
                                <div />
                                <div />
                            </div>
                        </div>
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
                            value={this.state.searchString.toUpperCase()}
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
                        this.state.results.length > 0 ? (
                            <div style={{width: '100%'}}>
                                <ResultsFromSearch
                                    isAuth={this.state.isAuth}
                                    mainCat={this.state.mainCat}
                                    email={this.state.email}
                                    searchSimilarImages={(
                                        img_hash,
                                        color_1,
                                        color_2
                                    ) => { this.searchSimilarImages(
                                        img_hash,
                                        color_1,
                                        color_2
                                    ) }}
                                    results={this.state.results}
                                    setTags={(tag, type, flag) => {this.setTags(tag, type, flag)}}
                                    setColorPosTags={(selection) => {this.setColorPosTags(selection)}}
                                    selectedColors={this.state.selectedColors}
                                    firstLogin={this.props.firstLogin}
                                />

                                <ResultFilters
                                    range={this.state.rangeVal}
                                    updateRange={this.updateRange}
                                    loading={this.state.loading}
                                    posTags={this.state.posTags}
                                    negTags={this.state.negTags}
                                    setTags={(tag, type, flag) => {this.setTags(tag, type, flag)}}
                                    addTagFilter={(tag, showPicker) => {this.addTagFilter(tag, showPicker)}}
                                    showTagPicker={(show) => {this.showTagPicker(show)}}
                                    tagPickerShown={this.state.tagPickerShown}
                                    setColor={(selection) => {this.setColorPosTags(selection)}}
                                    selectedColors={this.state.selectedColors}
                                    searchSimilarImages={(imgHash, color1, color2) => {
                                        this.searchSimilarImages(imgHash, color1, color2)
                                    }}
                                    results={this.state.results}
                                    filterBrands={this.state.filterBrands}
                                    brandPickerShown={this.state.brandPickerShown}
                                    showBrandPicker={(show) => {this.showBrandPicker(show)}}
                                    addBrandFilter={(brand, showPicker) => {this.addBrandFilter(brand, showPicker)}}
                                />
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
