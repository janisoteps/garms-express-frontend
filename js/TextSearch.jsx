// TextSearch.jsx
import React from "react";
require('../css/garms.css');
require('../css/ball-atom.css');
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
// import ProductResults from './ProductResults';
// import CatPicker from './CatPicker';
import SexSelector from './SexSelector';


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
            mainCat2: '',
            searchString: null,
            noResult: false,
            sexPickerWidth: '48px',
            catsOn: false,
            mainSuggestion: null,
            moreSuggestions: []
        };

        this.similarImageSearch = this.similarImageSearch.bind(this);
        this.textImageSearch = this.textImageSearch.bind(this);
        this.handleTextInputChange = this.handleTextInputChange.bind(this);
        this.onEnterPress = this.onEnterPress.bind(this);
        this.changeSex = this.changeSex.bind(this);
        this.changeSex = this.changeSex.bind(this);
        this.expandSexSelector = this.expandSexSelector.bind(this);
        this.showCatPicker = this.showCatPicker.bind(this);
        this.setMainCats = this.setMainCats.bind(this);
        this.setMainCatsAndSearchSimilar = this.setMainCatsAndSearchSimilar.bind(this);
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
                    console.log(data);
                    this.setState({
                        mainSuggestion: data.main_pred,
                        moreSuggestions: data.sim_pred
                    });
                });
        }
    }

    onEnterPress = (e) => {
        if(e.keyCode === 13 && e.shiftKey === false) {
            e.preventDefault();
            this.textImageSearch();
        }
    };

    // Sends similar product search request to server if user clicks on magnifying glass button
    // Updates results state with the response
    similarImageSearch(nr1_cat_ai, nr1_cat_sc, img_cat_sc_txt, color_1, siamese_64, prod_id){

        console.log('Similar image search launched');
        this.setState({
            loading: true
        });

        // let mainColor = color_1.toString().replace(/\s+/g, '');
        // let mainColor = this.state.mainColor;
        let siam_64 = siamese_64.toString().replace(/\s+/g, '');

        let mainCat = this.state.mainCat;
        if(mainCat.length === 0 || typeof mainCat === "undefined"){
            mainCat = img_cat_sc_txt;
        }

        console.log('Main cat: ', mainCat, ' , Img cat sc txt: ', img_cat_sc_txt);

        let searchString = window.location.origin + '/api/search?nr1_cat_ai=' + nr1_cat_ai
            + '&main_cat=' + mainCat
            + '&main_cat2=' + this.state.mainCat2
            + '&nr1_cat_sc=' + nr1_cat_sc
            + '&color_1=[' + color_1
            + ']&pca_256=[' + siam_64
            + ']&sex=' + this.state.sex
            + '&id=' + prod_id;

        // console.log('search string: ', searchString);

        fetch(searchString, {
            method: 'get',
        }).then(function(response) {
            return response.json();
        }).then(data => {
            console.log(data);
            this.setState({
                results: data.res,
                loading: false
            });
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
            window.scrollTo(0, 0);
        });
    }

    // Send request to server based on input string and set the response in state
    textImageSearch(input){
        this.setState({
            loading: true,
            mainSuggestion: null,
            moreSuggestions: []
        });
        let inputString = input ? input : this.state.searchString.replace(/^\s+|\s+$/g, '');
        if(inputString.length === 0){
            this.setState({
                loading: false,
                noResult: true
            });
            return
        }
        // console.log(inputString);
        let inputArray = inputString.split(' ');
        // console.log(inputArray);
        let searchString = inputArray.join('+');
        // inputArray.forEach(word => searchString += '+' + word);

        console.log('String search with: ', searchString);
        fetch(window.location.origin + '/api/text?string=' + searchString + '&sex=' + this.state.sex, {
            method: 'get'
        }).then(function(response) { return response.json(); })
            .then(data => {
                console.log('Response: ', data);
                if (typeof data.res === "undefined") {
                    this.setState({
                        results: [],
                        loading: false,
                        noResult: true
                    });
                } else {
                    this.setState({
                        results: data.res,
                        mainCat: data.mainCat,
                        loading: false
                    });
                }
            });
    }

    setMainCatsAndSearchSimilar(mainCat1, mainCat2, nr1_cat_ai, nr1_cat_sc, img_cat_sc_txt, color_1, siamese_64, prod_id){
        // console.log('Similar image search launched, prod id: ', prod_id);
        this.setState({
            loading: true
        });

        let mainColor = color_1.toString().replace(/\s+/g, '');
        // let mainColor = this.state.mainColor;
        let siam_64 = siamese_64.toString().replace(/\s+/g, '');

        let searchString = window.location.origin + '/api/search?nr1_cat_ai=' + nr1_cat_ai
            + '&main_cat=' + mainCat1
            + '&main_cat2=' + mainCat2
            + '&nr1_cat_sc=' + nr1_cat_sc
            + '&color_1=[' + mainColor
            + ']&pca_256=[' + siam_64
            + ']&sex=' + this.state.sex
            + '&id=' + prod_id;

        console.log('search string: ', searchString);

        fetch(searchString, {
            method: 'get',
        }).then(function(response) {
            return response.json();
        }).then(data => {
            console.log(data);
            this.setState({
                results: data.res,
                loading: false
            });
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
            window.scrollTo(0, 0);
        });
    }

    changeSex(sex){
        this.props.changeSex(sex);
        this.setState({
            sex: sex
        });
    }

    expandSexSelector(){
        let currentWidth = this.state.sexPickerWidth;

        console.log('Expanding sex selector ', currentWidth);
        if(currentWidth === '48px'){
            this.setState({
                sexPickerWidth: '270px'
            });
        } else {
            this.setState({
                sexPickerWidth: '48px'
            });
        }
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
                            floatingLabelText="What's your outfit idea?"
                            name="searchString"
                            onChange={this.handleTextInputChange.bind(this)}
                            onKeyDown={this.onEnterPress}
                        />
                        <div className="text-search-button" onClick={this.textImageSearch}>
                            <div className="search-icon" />
                            {/*<div className="search-text"> search</div>*/}
                        </div>
                    </div>
                    {this.state.mainSuggestion && <Suggestions />}
                </div>
        );

        return(
            <MuiThemeProvider>
                <div>
                    <Spinner />
                    <NoResults />

                    {
                        this.state.results.length > 0 ? (
                            <div style={{textAlign: 'center', width: '100%'}}>
                            {/*<ProductResults*/}
                                {/*mainCat={this.state.mainCat}*/}
                                {/*setMainCatsAndSearchSimilar={(mainCat1, mainCat2, nr1_cat_ai, nr1_cat_sc, img_cat_sc_txt, color_1, siamese_64, prod_id) => {this.setMainCatsAndSearchSimilar(mainCat1, mainCat2, nr1_cat_ai, nr1_cat_sc, img_cat_sc_txt, color_1, siamese_64, prod_id) }}*/}
                                {/*email={this.state.email}*/}
                                {/*simImgSearch={(nr1_cat_ai, nr1_cat_sc, img_cat_sc_txt, color_1, siamese_64, id) => { this.similarImageSearch(nr1_cat_ai, nr1_cat_sc, img_cat_sc_txt, color_1, siamese_64, id) }}*/}
                                {/*results={this.state.results}*/}
                            {/*/>*/}
                                <h1>Under Construction :)</h1>
                            </div>
                        ) : (
                            SearchBox
                        )
                    }

                    <SexSelector
                        sex={this.state.sex}
                        sexPickerWidth={this.state.sexPickerWidth}
                        changeSex={(sex) => {this.changeSex(sex)}}
                        expandSexSelector={() => {this.expandSexSelector()}}
                    />

                    {/*<CatSelector />*/}

                    {/*{(this.state.catsOn === true) && (*/}
                        {/*<CatPicker*/}
                            {/*showCatPicker={this.showCatPicker}*/}
                            {/*setMainCats={(mainCat, mainCat2) => {this.setMainCats(mainCat, mainCat2);}}*/}
                            {/*mainCat={this.state.mainCat}*/}
                            {/*mainCat2={this.state.mainCat2}*/}
                        {/*/>*/}
                    {/*)}*/}
                </div>
            </MuiThemeProvider>
        )
    }
}

export default TextSearch;
