// Explorer.jsx
import React from "react";
require('../css/garms.css');
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
require('../css/ball-atom.css');
import ExplorerFilters from './ExplorerFilters';
import ProductResults from './ProductResults';
import CatPicker from './CatPicker';

const higherCats = [
    'accessories',
    'bikini',
    'casual',
    'classy',
    'cosmetics',
    'dress',
    'embellishments',
    'foot wear',
    'head wear',
    'jewellery',
    'knitted',
    'material',
    'outer wear',
    'pattern',
    'suit',
    'sports',
    'summer',
    'theme',
    'top',
    'trouser',
    'underwear'
];

const categories = {
    'accessories': [
        'backpack',
        'bag',
        'belt',
        'clutch',
        'notebook',
        'scarf',
        'scrunchie',
        'wallet',
        'watch'
    ],
    'head wear': [
        'bandana',
        'beret',
        'glasses',
        'hat',
        'scarf',
        'sunglasses'
    ],
    'theme': [
        'babydoll',
        'glamorous',
        'party',
        'petite',
        'skinny',
        'tall',
        'wedding',
    ],
    'bikini': [
        'top',
        'bottom',
        'floral',
        'lace',
        'plunge',
        'swim',
        'swimsuit'
    ],
    'suit': [
        'blazer',
        'jacket',
        'suit',
        'tie',
        'trousers',
        'waistcoat'
    ],
    'classy': [
        'blouse',
        'jumpsuit',
        'jersey'
    ],
    'dress': [
        'bodycon',
        'cami',
        'corset',
        'dress',
        'embellished',
        'embroider',
        'floral',
        'jersey',
        'kimono',
        'long',
        'maternity',
        'maxi',
        'midi',
        'mini',
        'pencil',
        'plunge',
        'sequin',
        'skirt',
        'tunic'
    ],
    'foot wear': [
        'boots',
        'espadrilles',
        'flats',
        'heels',
        'leather',
        'loafers',
        'mule',
        'sandal',
        'shoe',
        'slippers',
        'socks',
        'trainer'
    ],
    'underwear': [
        'body',
        'bottom',
        'bra',
        'brief',
        'embroider',
        'knicker',
        'maternity',
        'nightwear',
        'pant',
        'plunge',
        'pyjama',
        'thong'
    ],
    'jewellery': [
        'bracelet',
        'earrings',
        'gold',
        'necklace',
        'pearl',
        'ring'
    ],
    'top': [
        'cami',
        'crop',
        'floral',
        'frill',
        'kimono',
        'maternity',
        'plunge',
        'shirt',
        'tee',
        't-shirt',
        'top',
        'tunic'
    ],
    'knitted': [
        'cardigan',
        'knit',
        'jumper',
        'sweater',
        'scarf',
        'hat'
    ],
    'trouser': [
        'chino',
        'dungaree',
        'floral',
        'highwaist',
        'jean',
        'jegging',
        'jogger',
        'legging',
        'mom',
        'shorts',
        'trouser'
    ],
    'outer wear': [
        'coat',
        'parka'
    ],
    'cosmetics': [
        'concealer',
        'contour',
        'eyeliner',
        'highlight',
        'kit',
        'liner',
        'lipstick',
        'mask',
        'mascara',
        'primer'
    ],
    'pattern': [
        'denim',
        'floral',
        'knit',
        'knitted',
        'mesh',
        'polka',
        'print',
        'stripe'
    ],
    'material': [
        'fur',
        'gold',
        'leather',
        'metallic',
        'pearl',
        'satin',
        'velvet'
    ],
    'embellishments': [
        'embellished',
        'embroider',
        'frill',
        'floral',
        'glitter',
        'gold',
        'lace',
        'mesh',
        'print',
        'ruffle',
        'sequin',
        'quilted',
        'tassel'
    ],
    'casual': [
        'hoodie',
        'jumper',
        'pants',
        'playsuit',
        'pyjama',
        'sweatshirt',
        'tee',
        't-shirt',
        'tracksuit',
        'vest'
    ],
    'summer': [
        'mini',
        'playsuit',
        'sandal',
        'shorts',
        'tee',
        'vest'
    ],
    'sports': [
        'bra',
        'sweat',
        'tracksuit',
        'trainer'
    ]
};

//Component to search for products when exploring posTags
class Explorer extends React.Component  {

    constructor(props) {
        super(props);
        this.state = {
            isAuth: this.props.isAuth,
            email: this.props.email,
            sex: this.props.sex,
            mainCatTop: undefined,
            mainCatSub: undefined,
            catProducts: [],
            loading: false,
            showFilters: false,
            showResults: false,
            results: [],
            sexPickerWidth: '56px',
            catsOn: false
        };

        this.loadProducts = this.loadProducts.bind(this);
        this.setHigherCat = this.setHigherCat.bind(this);
        this.setMainCatsAndSearchSimilar = this.setMainCatsAndSearchSimilar.bind(this);
        this.resetCats = this.resetCats.bind(this);
        this.openFilters = this.openFilters.bind(this);
        this.similarImageSearch = this.similarImageSearch.bind(this);
        this.changeSex = this.changeSex.bind(this);
        this.expandSexSelector = this.expandSexSelector.bind(this);
        this.showCatPicker = this.showCatPicker.bind(this);
        this.setMainCats = this.setMainCats.bind(this);
    }

    componentDidMount(){
        this.loadProducts();
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    // Loads products based on category in argument
    // If no category is passed loads the top categories
    loadProducts = (textCategory) => {
        // console.log('Prod load cat state: ', this.state.mainCatTop);
        // console.log('Prod load cat arg: ', textCategory);
        // let sex = this.props.sex;

        if(textCategory !== undefined) {
            this.setState({
                catProducts: categories[textCategory]
            });
        } else {
            this.setState({
                catProducts: higherCats
            });
        }
    };

    // Sets top category, allows rendering of subcats
    setHigherCat = (cat) => {
        // console.log('New higher cat: ', cat);
        let textCategory = '';
        try {
            textCategory = hCatReverseDict[cat];
        } catch (e) {
            textCategory = cat;
        }

        if (textCategory === undefined){
            textCategory = cat;
        }
        // console.log('Higher cat set to: ', textCategory);

        this.setState({
            mainCatTop: textCategory,
            // loading: true
        });

        this.loadProducts(textCategory);
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    // Once categories are selected, open a filter choice pane
    openFilters = (cat) => {
        this.setState({
            mainCatSub: cat,
            showFilters: true
        });
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    // Removes main top cat, which renders top categories
    resetCats = () => {
        this.setState({
            mainCatTop: undefined,
            mainCatSub: undefined,
            catProducts: higherCats,
            showFilters: false,
            showResults: false,
        });
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    // Do the search based on chosen parameters
    explorerSearch = (mainCatTop, mainCatSub, sex, colorSelected, shops, brands, maxPrice, color) => {
        this.setState({
            loading: true,
            showFilters: false,
            showResults: true
        });
        fetch(window.location.origin + '/api/explorer_search', {
            method: 'post',
            body: JSON.stringify({
                mainCatTop: mainCatTop,
                mainCatSub: mainCatSub,
                sex: sex,
                colorSelected: colorSelected,
                shops: shops,
                brands: brands,
                maxPrice: maxPrice,
                color: color
            }),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
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
        });
    };

    setMainCatsAndSearchSimilar(mainCat1, mainCat2, nr1_cat_ai, nr1_cat_sc, img_cat_sc_txt, color_1, siamese_64, prod_id){
        // console.log('Similar image search launched, prod id: ', prod_id);
        this.setState({
            loading: true
        });

        let mainColor = color_1.toString().replace(/\s+/g, '');
        // let mainColor = this.state.mainColor;
        let siam_64 = siamese_64.toString().replace(/\s+/g, '');

        let searchString = window.location.origin + '/api/search?nr1_cat_ai=' + this.state.mainCatSub
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

    // Sends similar product search request to server if user clicks on magnifying glass button
    // Updates results state with the response
    similarImageSearch(nr1_cat_ai, nr1_cat_sc, img_cat_sc_txt, color_1, siamese_64, prod_id){

        // console.log('Similar image search launched, prod id: ', prod_id);
        this.setState({
            loading: true
        });

        let mainColor = color_1.toString().replace(/\s+/g, '');
        // let mainColor = this.state.mainColor;
        let siam_64 = siamese_64.toString().replace(/\s+/g, '');

        let searchString = window.location.origin + '/api/search?nr1_cat_ai=' + this.state.mainCatSub
            + '&main_cat=' + this.state.mainCatSub
            + '&main_cat2=' + this.state.mainCatTop
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
        // this.expandSexSelector();
    }

    expandSexSelector(){
        let currentWidth = this.state.sexPickerWidth;

        console.log('Expanding sex selector ', currentWidth);
        if(currentWidth === '56px'){
            this.setState({
                sexPickerWidth: '270px'
            });
        } else {
            this.setState({
                sexPickerWidth: '56px'
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
            mainCatSub: mainCat,
            mainCatTop: mainCat2
        });
    }

    // ---------------------- MAIN RENDER ------------------------
    render(){
        let catTiles = this.state.catProducts.map((cat, i) => {
            let topCat = this.state.mainCatTop;
            let imgName;
            if(topCat !== undefined){
                imgName = topCat + cat;
            } else {
                imgName = cat;
            }
            let imgUrl = '/images/' + imgName.replace(/ +/g, "") +  '.jpg';
            // console.log('Img URL: ', imgUrl);
            let tileStyle = {
                width: '22vw',
                minWidth: '200px',
                height: 'calc(21vw * 1.66)',
                minHeight: '300px',
                background: 'url(' + imgUrl + ') no-repeat center center / auto 100%',
                backgroundSize: 'auto 100%',
                display: 'inline-block',
                position: 'relative',
                textAlign: 'center',
                margin: '1.5vw',
                cursor: 'pointer'
            };

            try {
                if (cat.length > 0 && topCat === undefined) {
                    return (
                        <div
                            key={i}
                            style={tileStyle}
                            className="explorer-cat-tile"
                            onClick={() => {this.setHigherCat(cat);}}
                        >
                            <div className="explorer-cat-tile-name">{cat}</div>
                        </div>
                    )
                } else if (cat.length > 0 && topCat !== undefined) {
                    return (
                        <div
                            key={i}
                            style={tileStyle}
                            className="explorer-cat-tile"
                            onClick={() => {this.openFilters(cat);}}
                        >
                            <div className="explorer-cat-tile-name">{cat}</div>
                        </div>
                    )
                }
            } catch (e) {
                console.log(e);
            }
        });

        let SexSelector = () => {
            let sexPickerStyle = {
                position: 'fixed',
                right: '0',
                top: '70px',
                overflow: 'hidden',
                transition: 'width 300ms ease-in-out',
                width: this.state.sexPickerWidth,
                height: '56px',
                backgroundColor: '#FFFFFF',
                borderRadius: '28px 0px 0px 28px',
                boxShadow: '1px 1px 3px 0 rgba(0, 0, 0, 0.4)',
                paddingRight: '56px'
            };

            let selectorHiderStyle = {
                position: 'fixed',
                right: '0',
                top: '70px',
                overflow: 'hidden',
                transition: 'width 300ms ease-in-out',
                width: '56px',
                height: '56px',
                backgroundColor: '#FFFFFF',
                borderRadius: '28px 0px 0px 28px'
            };

            let sexOptionStyle1 = {
                display: 'inline-block',
                lineHeight: '33px',
                height: '56px',
                verticalAlign: 'middle',
                borderRadius: '28px',
                cursor: 'pointer',
                padding: this.state.sex !== 'women' ? '10px' : '5px',
                borderWidth: this.state.sex === 'women' && '5px',
                borderColor: this.state.sex === 'women' && '#7f649c',
                borderStyle: this.state.sex === 'women' && 'solid'
            };

            let sexOptionStyle2 = {
                display: 'inline-block',
                lineHeight: '33px',
                height: '56px',
                verticalAlign: 'middle',
                borderRadius: '28px',
                cursor: 'pointer',
                padding: this.state.sex !== 'men' ? '10px' : '5px',
                borderWidth: this.state.sex === 'men' && '5px',
                borderColor: this.state.sex === 'men' && '#7f649c',
                borderStyle: this.state.sex === 'men' && 'solid'
            };

            let sexOptionStyle3 = {
                display: 'inline-block',
                lineHeight: '33px',
                height: '56px',
                verticalAlign: 'middle',
                borderRadius: '28px',
                cursor: 'pointer',
                padding: this.state.sex !== '' ? '10px' : '5px',
                borderWidth: this.state.sex === '' && '5px',
                borderColor: this.state.sex === '' && '#7f649c',
                borderStyle: this.state.sex === '' && 'solid'
            };

            console.log('Image search sex: ', this.state.sex);

            return(
                <div>
                    <div style={sexPickerStyle}>
                        <div style={sexOptionStyle1} onClick={() => {this.changeSex('women')}}>women</div>
                        <div style={sexOptionStyle2} onClick={() => {this.changeSex('men')}}>men</div>
                        <div style={sexOptionStyle3} onClick={() => {this.changeSex('')}}>both</div>
                    </div>
                    <div style={selectorHiderStyle}></div>
                    <div className="sex-selector" onClick={this.expandSexSelector}></div>
                </div>
            )
        };

        let CatSelector = () => {
            console.log('Clicked cat selector');
            return(
                <div className="cat-selector" onClick={this.showCatPicker}></div>
            )
        };

        return(
            <MuiThemeProvider>
                <div className="explorer-container">

                    {(this.state.showResults === false) && (
                        <div className="explore-title-pane">
                            <div className="explore-title-tile">
                                {(this.state.mainCatTop !== undefined) ? (
                                    <h2>{this.state.mainCatTop}   {this.state.mainCatSub}</h2>
                                ):(
                                    <h2>All Categories</h2>
                                )}
                            </div>
                            <div
                                className="explore-title-tile"
                                onClick={this.resetCats}
                            >
                                {(this.state.mainCatTop !== undefined) ? (
                                    <h2>Back...</h2>
                                ):(
                                    <h2>Refresh... </h2>
                                )}
                            </div>
                        </div>
                    )}

                    {(this.state.catProducts.length > 0 && this.state.showFilters === false && this.state.showResults === false) && (
                        catTiles
                    )}
                    {(this.state.catProducts === 0) && (
                        <h2>Loading...</h2>
                    )}
                    {(this.state.showFilters === true) && (
                        <ExplorerFilters
                            mainCatTop={this.state.mainCatTop}
                            mainCatSub={this.state.mainCatSub}
                            sex={this.props.sex}
                            explorerSearch={(mainCatTop, mainCatSub, sex, colorSelected, shops, brands, maxPrice, color) =>
                            {this.explorerSearch(mainCatTop, mainCatSub, sex, colorSelected, shops, brands, maxPrice, color);}}
                        />
                    )}

                    {(this.state.results.length > 0) && (
                        <ProductResults
                            mainCat={this.state.mainCatSub}
                            setMainCatsAndSearchSimilar={(mainCat1, mainCat2, nr1_cat_ai, nr1_cat_sc, img_cat_sc_txt, color_1, siamese_64, prod_id) => {this.setMainCatsAndSearchSimilar(mainCat1, mainCat2, nr1_cat_ai, nr1_cat_sc, img_cat_sc_txt, color_1, siamese_64, prod_id) }}
                            email={this.state.email}
                            simImgSearch={(nr1_cat_ai, nr1_cat_sc, img_cat_sc_txt, color_1, siamese_64, id) => { this.similarImageSearch(nr1_cat_ai, nr1_cat_sc, img_cat_sc_txt, color_1, siamese_64, id) }}
                            results={this.state.results}
                        />
                    )}

                    {(this.state.showResults === true) && (
                        <div>
                            <SexSelector />
                            <CatSelector />
                        </div>
                    )}

                    {(this.state.catsOn === true) && (
                        <CatPicker
                            showCatPicker={this.showCatPicker}
                            setMainCats={(mainCat, mainCat2) => {this.setMainCats(mainCat, mainCat2);}}
                            mainCat={this.state.mainCatSub}
                            mainCat2={this.state.mainCatTop}
                        />
                    )}

                    {(this.state.showResults === true && this.state.results.length === 0) && (
                        <div className="explorer-no-results">
                            <h3>Didn't find anything :(</h3>
                            <h4>Try a different search</h4>
                            <div
                                className="explorer-no-results-button"
                                onClick={this.resetCats}
                            >
                                Explore More
                            </div>
                        </div>
                    )}

                    {(this.state.loading === true) && (
                        <div className="explorer-loader-background">
                            <div className="overlay">
                                <div className="la-ball-atom la-3x">
                                    <div />
                                    <div />
                                    <div />
                                    <div />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </MuiThemeProvider>
        )
    }
}

export default Explorer;



