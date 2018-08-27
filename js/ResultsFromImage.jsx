// ProductResults.jsxx
import React from "react";
require('../css/garms.css');
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper';

const categories = {
    'accessories': [
        'backpack',
        'bag',
        'belt',
        'clutch',
        'notebook',
        'pack',
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
        'embroidered',
        'floral',
        'highwaist',
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
        'trapeze',
        'tunic'
    ],
    'foot wear': [
        'boots',
        'espadrilles',
        'flats',
        'floral',
        'heels',
        'leather',
        'loafers',
        'mule',
        'office',
        'plimsolls',
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
        'embroidered',
        'knicker',
        'lingerie',
        'maternity',
        'nightwear',
        'pack',
        'pant',
        'plunge',
        'pyjama',
        'thong',
        'trunks'
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
        'knitted'
    ],
    'trousers': [
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
        'tregging',
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
        'embroidered',
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
        'tregging',
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
    'trousers',
    'underwear'
];

class ResultsFromImage extends React.Component  {
    constructor(props) {
        super(props);
        this.state = {
            pickerExpanded: 0,
            faveDrawerExpanded: 0,
            email: this.props.email,
            faveDrawerWidth: '64px',
            catPickerExpanded: 0,
            posNegButtonExpanded: 0,
            posNegButtonTag: ''
        };
        this.expandDrawer = this.expandDrawer.bind(this);
        this.searchSimilarImages = this.searchSimilarImages.bind(this);
        this.addToFavs = this.addToFavs.bind(this);
        this.setTags = this.setTags.bind(this);
        this.setColorPosTags = this.setColorPosTags.bind(this);
    }

    setTags(tag, type, flag){
        this.setState({
            posNegButtonExpanded: 0,
            posNegButtonTag: ''
        });
        this.props.setTags(tag, type, flag);
    }

    setColorPosTags(selection){
        this.props.setColorPosTags(selection);
    }

    searchSimilarImages(imgHash, color_1, color_2){
        this.setState({
            pickerExpanded: 0
        });
        this.props.searchSimilarImages(imgHash, color_1, color_2);
    }

    // Expands color picker drawer
    expandDrawer = (id, pickerId) => {
        console.log(id, ' vs ', pickerId);
        if (id === pickerId){
            this.setState({
                pickerExpanded: 0
            });
        } else {
            this.setState({
                pickerExpanded: id
            });
        }
    };

    expandCatDrawer = (id, pickerId) => {
        console.log(id, ' vs ', pickerId);
        if (id === pickerId){
            this.setState({
                catPickerExpanded: 0
            });
        } else {
            this.setState({
                catPickerExpanded: id
            });
        }
    };

    addToFavs = (img_hash, id) => {
        let email = this.state.email;
        console.log('Add faves email: ', email);
        console.log('Add faves hash: ', img_hash);
        fetch(window.location.origin + '/api/addfav', {
            method: 'post',
            body: JSON.stringify({email: email, img_hash: img_hash}),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(function(response) { return response.json(); })
            .then(data => {
                console.log(data);

                this.setState({
                    faveDrawerExpanded: id
                });

                setTimeout(() =>{
                    this.setState({
                        faveDrawerExpanded: 0
                    });
                }, 2000);
            });
    };

    render () {
        let key = '';
        let tiles = this.props.results.map(product => {
            // console.log('Product data passed to result list: ', product[0]);
            let productInfo = product['prod_serial'][0];
            let imageData = product['image_data'];
            // console.log('Image data: ', imageData);
            let prod_hash = productInfo.prod_hash;
            let brand = productInfo.brand;
            let img_cat_sc_txt = productInfo.img_cats_sc_txt[productInfo.img_cats_sc_txt.length - 1];
            let img_urls = productInfo.img_urls;
            let name = productInfo.name;
            let description = productInfo.description;
            let currency = productInfo.currency;
            let price = productInfo.price.toFixed(2);
            let prod_id = productInfo.id;
            let sale = productInfo.sale;
            let saleprice = productInfo.saleprice.toFixed(2);
            let shop = productInfo.shop;
            key = prod_hash + Math.floor(Math.random() * 1000);
            let image0 = imageData[0];
            let fst_img_hash = image0['img_hash'];
            let fst_img_color = image0['color_1'];
            // this.props.results[0]['image_data'][0]['img_hash']
            let catArray = [];
            let catCheckArray = [];
            higherCats.map(hCat => {
                let lCats = categories[hCat];
                let nameArray = name.toLowerCase().split(' ');
                nameArray.map(word => {
                    if (lCats.includes(word)){
                        let pushObj = {
                            'cat': word,
                            'hCat': hCat
                        };
                        if (!catCheckArray.includes(word)){
                            catCheckArray.push(word);
                            catArray.push(pushObj);
                        }
                    }
                });
            });

            var faveDrawerWidth;

            if (this.state.faveDrawerExpanded === prod_id){
                faveDrawerWidth = '244px';
            } else {
                faveDrawerWidth = '64px';
            }

            let faveDrawerStyle = {
                height: '64px',
                transition: 'width 300ms ease-in-out',
                width: faveDrawerWidth,
                borderRadius: '32px',
                backgroundColor: '#FFFFFF',
                marginTop: '-55px',
                right: '225px',
                position: 'absolute',
                textAlign: 'left',
                overflow: 'hidden',
                lineHeight: '64px',
                verticalAlign: 'middle',
                fontSize: '1.5rem',
                paddingLeft: '10px',
                paddingTop: '2px'
            };

            let singleCatStyle = {
                // width: '50px',
                height: '50px',
                borderRadius: '25px',
                backgroundColor: '#f5e8ff',
                margin: '7px',
                display: 'inline-block',
                cursor: 'pointer',
                verticalAlign: 'middle',
                textAlign: 'center',
                paddingTop: '10px',
                paddingRight: '5px',
                paddingLeft: '5px'
            };

            var catPickerDrawerHeight, catPickerDrawerWidth;

            if (this.state.catPickerExpanded === prod_id){
                catPickerDrawerHeight = '600px';
                catPickerDrawerWidth = '130px';
            } else {
                catPickerDrawerHeight = '63px';
                catPickerDrawerWidth = '63px';
            }

            let catPickerDrawerStyle = {
                transition: 'width 300ms ease-in-out',
                maxHeight: catPickerDrawerHeight,
                maxWidth: catPickerDrawerWidth,
                borderRadius: '32px',
                backgroundColor: '#FFFFFF',
                bottom: '8px',
                right: '155px',
                position: 'absolute',
                textAlign: 'left',
                overflow: 'hidden',
                paddingBottom: '64px'
            };

            let ImageCarousel = () => {
                let img_url = img_urls[this.props.prodImgShown[prod_hash]['img_shown']];

                return (
                    <div>
                        <img className="product-image" src={img_url} />
                    </div>
                )
            };

            let ColorPicker = () => {
                let image = imageData[0];
                let color_1 = image['color_1'];
                let color_2 = image['color_2'];
                let color_3 = image['color_3'];
                let color_1_hex = image['color_1_hex'];
                let color_2_hex = image['color_2_hex'];
                let color_3_hex = image['color_3_hex'];
                let img_hash = image['img_hash'];

                // Dynamic CSS for image color choice modal
                if(color_1_hex.length > 0){
                    var colorStyle1 = {
                        width: '50px',
                        height: '50px',
                        borderRadius: '25px',
                        backgroundColor: color_1_hex,
                        margin: '7px',
                        marginRight: '0px',
                        display: 'inline-block',
                        cursor: 'pointer'
                    };
                    var colorStyle2 = {
                        width: '50px',
                        height: '50px',
                        borderRadius: '25px',
                        backgroundColor: color_2_hex,
                        margin: '7px',
                        marginRight: '0px',
                        display: 'inline-block',
                        cursor: 'pointer'
                    };
                    var colorStyle3 = {
                        width: '50px',
                        height: '50px',
                        borderRadius: '25px',
                        backgroundColor: color_3_hex,
                        margin: '7px',
                        marginRight: '0px',
                        display: 'inline-block',
                        cursor: 'pointer'
                    };
                }
                let rgbSum = eval(image['color_1'].join('+'));

                var pickerBgUrl;

                if (rgbSum > 400) {
                    pickerBgUrl = 'url("data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9JzIwMCcgd2lkdGg9JzIwMCcgIGZpbGw9IiMwMDAwMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHZlcnNpb249IjEuMSIgeD0iMHB4IiB5PSIwcHgiIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAxMDAgMTAwOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PHBhdGggZD0iTTk0LjksMTcuNmMtMC44LTUuNy00LTguNi02LjYtMTAuNWMtMi45LTIuMS02LjYtMi42LTkuOS0xLjNjLTMuNSwxLjMtNiwzLjktOC42LDYuNWMtMywzLjItNi4yLDYuMi05LjMsOS4zICBjLTMuMS0yLTQuOC0xLjgtNy4zLDAuNmMtMS41LDEuNS0zLDIuOS00LjQsNC40Yy0xLjUsMS42LTEuNyw0LjItMC4yLDUuOGMwLjcsMC44LDEuNywxLjMsMi43LDJjLTEuMSwwLjktMS42LDEuMy0yLDEuNyAgQzM4LDQ3LjQsMjYuNiw1OC44LDE1LjIsNzAuMWMtMi42LDIuNi00LjcsNS40LTUuNyw5LjFjLTAuNSwyLTEuNywzLjktMi44LDUuNmMtMC4yLDAuMy0wLjQsMC41LTAuNiwwLjhjLTEuNywyLjMtMS42LDUuNCwwLjQsNy40ICBjMC4xLDAuMSwwLjIsMC4yLDAuMiwwLjJjMiwyLDUsMi4xLDcuMywwLjVjMCwwLDAsMCwwLjEsMGMxLjctMS4yLDMuMy0yLjgsNS4yLTMuMWM0LjItMC45LDcuNS0zLDEwLjQtNkM0MS4zLDczLjQsNTIuNiw2Miw2NCw1MC43ICBjMC41LTAuNSwxLTAuOSwxLjgtMS43YzAuNSwwLjcsMC44LDEuMywxLjMsMS44YzIuMiwyLjMsNC42LDIuMiw2LjksMGMxLjItMS4yLDIuNC0yLjQsMy42LTMuNmMyLjktMi45LDMuNy00LjMsMS4xLTcuOCAgYzIuNC0yLjQsNC44LTQuNyw3LjItNy4xYzMuMy0zLjQsNy4yLTYuMyw4LjctMTEuMUM5NSwyMCw5NS4xLDE4LjgsOTQuOSwxNy42eiBNNjEuNiw0Ny4yQzQ5LjksNTguOSwzOC4yLDcwLjYsMjYuNSw4Mi4yICBjLTIuMiwyLjItNC43LDMuNi03LjcsNC40Yy0yLjMsMC42LTQuMywyLjItNi40LDMuM2MtMC4yLDAuMS0wLjQsMC4zLTAuNiwwLjRjLTAuNiwwLjUtMS41LDAuNC0yLTAuMWMwLDAsMCwwLDAsMCAgYy0wLjUtMC42LTAuNi0xLjQtMC4xLTJjMC43LTAuOSwxLjQtMS44LDItMi43YzAuOC0xLjMsMS41LTIuOCwxLjgtNC4zYzAuNi0yLjksMS45LTUuMywzLjktNy4zYzEyLjEtMTIuMSwyNC4yLTI0LjIsMzYuMS0zNi4xICBjMi45LDIuOCw1LjcsNS43LDguNyw4LjdDNjIuMiw0Ni41LDYxLjksNDYuOSw2MS42LDQ3LjJ6Ij48L3BhdGg+PC9zdmc+")';
                } else {
                    pickerBgUrl = 'url("data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9JzIwMCcgd2lkdGg9JzIwMCcgIGZpbGw9IiNmZmZmZmYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHZlcnNpb249IjEuMSIgeD0iMHB4IiB5PSIwcHgiIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAxMDAgMTAwOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PHBhdGggZD0iTTk0LjksMTcuNmMtMC44LTUuNy00LTguNi02LjYtMTAuNWMtMi45LTIuMS02LjYtMi42LTkuOS0xLjNjLTMuNSwxLjMtNiwzLjktOC42LDYuNWMtMywzLjItNi4yLDYuMi05LjMsOS4zICBjLTMuMS0yLTQuOC0xLjgtNy4zLDAuNmMtMS41LDEuNS0zLDIuOS00LjQsNC40Yy0xLjUsMS42LTEuNyw0LjItMC4yLDUuOGMwLjcsMC44LDEuNywxLjMsMi43LDJjLTEuMSwwLjktMS42LDEuMy0yLDEuNyAgQzM4LDQ3LjQsMjYuNiw1OC44LDE1LjIsNzAuMWMtMi42LDIuNi00LjcsNS40LTUuNyw5LjFjLTAuNSwyLTEuNywzLjktMi44LDUuNmMtMC4yLDAuMy0wLjQsMC41LTAuNiwwLjhjLTEuNywyLjMtMS42LDUuNCwwLjQsNy40ICBjMC4xLDAuMSwwLjIsMC4yLDAuMiwwLjJjMiwyLDUsMi4xLDcuMywwLjVjMCwwLDAsMCwwLjEsMGMxLjctMS4yLDMuMy0yLjgsNS4yLTMuMWM0LjItMC45LDcuNS0zLDEwLjQtNkM0MS4zLDczLjQsNTIuNiw2Miw2NCw1MC43ICBjMC41LTAuNSwxLTAuOSwxLjgtMS43YzAuNSwwLjcsMC44LDEuMywxLjMsMS44YzIuMiwyLjMsNC42LDIuMiw2LjksMGMxLjItMS4yLDIuNC0yLjQsMy42LTMuNmMyLjktMi45LDMuNy00LjMsMS4xLTcuOCAgYzIuNC0yLjQsNC44LTQuNyw3LjItNy4xYzMuMy0zLjQsNy4yLTYuMyw4LjctMTEuMUM5NSwyMCw5NS4xLDE4LjgsOTQuOSwxNy42eiBNNjEuNiw0Ny4yQzQ5LjksNTguOSwzOC4yLDcwLjYsMjYuNSw4Mi4yICBjLTIuMiwyLjItNC43LDMuNi03LjcsNC40Yy0yLjMsMC42LTQuMywyLjItNi40LDMuM2MtMC4yLDAuMS0wLjQsMC4zLTAuNiwwLjRjLTAuNiwwLjUtMS41LDAuNC0yLTAuMWMwLDAsMCwwLDAsMCAgYy0wLjUtMC42LTAuNi0xLjQtMC4xLTJjMC43LTAuOSwxLjQtMS44LDItMi43YzAuOC0xLjMsMS41LTIuOCwxLjgtNC4zYzAuNi0yLjksMS45LTUuMywzLjktNy4zYzEyLjEtMTIuMSwyNC4yLTI0LjIsMzYuMS0zNi4xICBjMi45LDIuOCw1LjcsNS43LDguNyw4LjdDNjIuMiw0Ni41LDYxLjksNDYuOSw2MS42LDQ3LjJ6Ij48L3BhdGg+PC9zdmc+")';
                }

                let pickerStyle = {
                    width: '64px',
                    height: '64px',
                    backgroundColor: color_1_hex,
                    backgroundImage: pickerBgUrl,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    backgroundSize: '48px 48px',
                    borderRadius: '32px',
                    position: 'absolute',
                    marginTop: '-55px',
                    right: '82px',
                    cursor: 'pointer'
                };

                var pickerDrawerHeight;

                if (this.state.pickerExpanded === img_hash){
                    pickerDrawerHeight = '250px';
                } else {
                    pickerDrawerHeight = '64px';
                }

                let pickerDrawerStyle = {
                    width: '64px',
                    transition: 'width 300ms ease-in-out',
                    height: pickerDrawerHeight,
                    borderRadius: '32px',
                    backgroundColor: '#FFFFFF',
                    bottom: '10px',
                    right: '82px',
                    position: 'absolute',
                    textAlign: 'left',
                    overflow: 'hidden'
                };

                return (
                    <div>
                        <div style={pickerDrawerStyle}>
                            <div
                                style={colorStyle1}
                                onClick={() => {
                                    this.setColorPosTags({'color_rgb': color_1, 'cat':''});
                                    this.searchSimilarImages(img_hash, color_1, color_1);
                                }} />
                            <div
                                style={colorStyle2}
                                onClick={() => {
                                    this.setColorPosTags({'color_rgb': color_2, 'cat':''});
                                    this.searchSimilarImages(img_hash, color_2, color_2);
                                }} />
                            <div
                                style={colorStyle3}
                                onClick={() => {
                                    this.setColorPosTags({'color_rgb': color_3, 'cat':''});
                                    this.searchSimilarImages(img_hash, color_3, color_3);
                                }} />
                        </div>
                        <div style={pickerStyle} onClick={() => { this.expandDrawer(img_hash, this.state.pickerExpanded); }} />
                    </div>
                )
            };


            let TagPicker = (img_hash) => {
                let tagItems = catArray.map((tagObj, index) => {
                    let addTag = tagObj['cat'];
                    let key = img_hash + addTag;

                    return (
                        <div
                            key={key}
                            style={singleCatStyle}
                            onClick={() => { this.setState({posNegButtonTag: addTag, catPickerExpanded: 0}) }}
                        >
                            {addTag}
                        </div>
                    )
                });
                return (
                    <div>
                        <div style={catPickerDrawerStyle}>
                            {tagItems}
                        </div>
                        <div className="cat-picker-bubble" onClick={() => { this.expandCatDrawer(prod_id, this.state.catPickerExpanded); }}>
                            <div className="cat-picker-bubble-plus"/>
                            <div className="cat-picker-bubble-minus"/>
                        </div>
                    </div>
                )
            };

            return (
                <Paper zDepth={1} className="product-tile" key={key}>
                    <div className="product-name">{name}</div>
                    <div className="product-brand"><p>{brand} from {shop}</p></div>
                    <ImageCarousel />
                    <div className={sale ? 'product-price-sale' : 'product-price'}>{sale ? currency+saleprice+', was '+currency+price : currency+price}</div>
                    <div className="prod-description">{description}</div>
                    <div className="search-similar" onClick={() => {
                        this.setColorPosTags({'color_rgb': fst_img_color, 'cat':''});
                        this.searchSimilarImages(fst_img_hash, fst_img_color, this.props.selectedColors[1]);
                    }} />
                    <ColorPicker />
                    <TagPicker/>
                    <div style={faveDrawerStyle} >Added to faves</div>
                    <div className="add-to-favorites" onClick={() => { this.addToFavs(fst_img_hash, prod_id); }} />
                </Paper>
            );
        });

        let PosNegButton = () => {
            if (this.state.posNegButtonTag.length > 0) {
                let posNegButtonStyle = {
                    position: 'fixed',
                    width: '100vw',
                    height: 'calc(100vh - 50px)',
                    top: '50px',
                    left: '0'
                };
                let posButtonStyle = {
                    width: '100vw',
                    height: 'calc((100vh - 50px) / 2)',
                    backgroundColor: 'rgba(38, 79, 39, 0.7)',
                    textAlign: 'center',
                    color: '#FFFFFF',
                    fontSize: '2.5rem',
                    paddingTop: 'calc(((100vh - 50px) / 4) - 20px)',
                    cursor: 'pointer'
                };
                let negButtonStyle = {
                    width: '100vw',
                    height: 'calc((100vh - 50px) / 2)',
                    backgroundColor: 'rgba(79, 38, 38, 0.7)',
                    textAlign: 'center',
                    color: '#FFFFFF',
                    fontSize: '2.5rem',
                    paddingTop: 'calc(((100vh - 50px) / 4) - 20px)',
                    cursor: 'pointer'
                };
                return (
                    <div style={posNegButtonStyle}>
                        <div
                            style={posButtonStyle}
                            onClick={() => {this.setTags(this.state.posNegButtonTag, 'positive', 'add')}}
                        >
                            <h1>more {this.state.posNegButtonTag}</h1>
                        </div>
                        <div
                            style={negButtonStyle}
                            onClick={() => {this.setTags(this.state.posNegButtonTag, 'negative', 'add')}}
                        >
                            <h1>less {this.state.posNegButtonTag}</h1>
                        </div>
                    </div>
                )
            } else {
                return (
                    <div style={{height: '0px'}} />
                )
            }
        };

        console.log('Product shown dictionary: ', this.props.prodImgShown);
        return (
            <MuiThemeProvider>
                <div>
                    <div className="result-pane">
                        {tiles}
                    </div>
                    <PosNegButton />
                </div>
            </MuiThemeProvider>
        );
    }
}

export default ResultsFromImage;
