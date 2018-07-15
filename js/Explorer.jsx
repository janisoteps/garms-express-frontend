import React from "react";
require('../css/garms.css');
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
require('../css/ball-atom.css');
import ExplorerFilters from './ExplorerFilters';

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

//Component to search for products when exploring tags
class Explorer extends React.Component  {

    constructor(props) {
        super(props);
        this.state = {
            isAuth: this.props.isAuth,
            sex: this.props.sex,
            mainCatTop: undefined,
            mainCatSub: undefined,
            catProducts: [],
            loading: false,
            showFilters: false
        };

        this.loadProducts = this.loadProducts.bind(this);
        this.setHigherCat = this.setHigherCat.bind(this);
        // this.fetchData = this.fetchData.bind(this);
        this.resetCats = this.resetCats.bind(this);
        this.openFilters = this.openFilters.bind(this);
    }

    componentDidMount(){
        this.loadProducts();
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
    };

    // Removes main top cat, which renders top categories
    resetCats = () => {
        this.setState({
            mainCatTop: undefined,
            mainCatSub: undefined,
            catProducts: higherCats,
            showFilters: false
        });
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

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

        return(
            <MuiThemeProvider>
                <div className="explorer-container">
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

                    {(this.state.catProducts.length > 0 && this.state.showFilters === false) && (
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
                        />
                    )}

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
            </MuiThemeProvider>
        )
    }
}

export default Explorer;



