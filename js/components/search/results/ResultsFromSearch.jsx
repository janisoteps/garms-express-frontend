// ResultsFromImage.jsx
import React from "react";
require('../../../../css/garms.css');
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper';
import { withStyles } from '@material-ui/core/styles';
import AddOutfit from '../../wardrobe/AddOutfit';
import {Route} from 'react-router-dom';
import Tooltip from '@material-ui/core/Tooltip';


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

const styles = (theme) => ({
    button: {
        margin: theme.spacing.unit,
        color: "#cacaca",
        borderColor: "#cacaca"
    }
});

class ResultsFromSearch extends React.Component  {
    constructor(props) {
        super(props);
        this.state = {
            isAuth: this.props.isAuth,
            pickerExpanded: 0,
            faveDrawerExpanded: 0,
            email: this.props.email,
            faveDrawerWidth: '64px',
            catPickerExpanded: 0,
            posNegButtonExpanded: 0,
            posNegButtonTag: '',
            firstLogin: this.props.firstLogin,
            addOutfitInput: null
        };
        this.expandDrawer = this.expandDrawer.bind(this);
        this.searchSimilarImages = this.searchSimilarImages.bind(this);
        this.addToFavs = this.addToFavs.bind(this);
        this.setTags = this.setTags.bind(this);
        this.setColorPosTags = this.setColorPosTags.bind(this);
        this.showLookList = this.showLookList.bind(this);
        this.addOutfitComplete = this.addOutfitComplete.bind(this);
        this.buyNow = this.buyNow.bind(this);
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

    searchSimilarImages(imgHash, color_1){
        this.setState({
            pickerExpanded: 0
        });
        this.props.searchSimilarImages(imgHash, color_1);
    };

    // Expands color picker drawer
    expandDrawer = (id, pickerId) => {
        // console.log(id, ' vs ', pickerId);
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
        // console.log(id, ' vs ', pickerId);
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

    showLookList = (img_hash) => {
        this.setState({
            addOutfitInput: img_hash
        })
    };

    addToFavs = (img_hash, id) => {
        let email = this.state.email;
        // console.log('Add faves email: ', email);
        // console.log('Add faves hash: ', img_hash);
        fetch(window.location.origin + '/api/addfav', {
            method: 'post',
            body: JSON.stringify({email: email, img_hash: img_hash}),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(function(response) { return response.json(); })
            .then(data => {
                // console.log(data);

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

    addOutfitComplete = () => {
        this.setState({
            addOutfitInput: null
        })
    };

    buyNow = (prodUrl) => {
        const win = window.open(prodUrl, '_blank');
        win.focus();
    };

    //################################## MAIN RENDER FUNCTION ##################################
    render () {
        let key = '';
        // console.log(this.props.results);
        let tiles = this.props.results.map(product => {
            // console.log(product);
            // console.log('Product data passed to result list: ', product[0]);
            let productInfo = product['prod_serial'];
            let imageData = product['image_data'];
            // console.log('Image data: ', imageData);
            let prod_hash = productInfo.prod_id;
            let brand = productInfo.brand;
            // let img_cat_sc_txt = productInfo.img_cats_sc_txt[productInfo.img_cats_sc_txt.length - 1];
            let img_urls = productInfo.image_urls;
            let img_url = imageData.img_url;
            let name = productInfo.name;
            let description = productInfo.description;
            // let currency = productInfo.currency;
            const currency = '£';
            let price = productInfo.price.toFixed(2);
            let prod_id = productInfo.id;
            let prod_url = productInfo.prod_url;
            let sale = productInfo.sale;
            let saleprice = productInfo.saleprice;
            let shop = productInfo.shop;
            key = prod_hash + Math.floor(Math.random() * 1000);
            // let image0 = imageData[0];
            let fst_img_hash = imageData.img_hash;
            let fst_img_color = imageData.color_1;
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
                catPickerDrawerWidth = '';
            } else {
                catPickerDrawerHeight = '52px';
                catPickerDrawerWidth = '52px';
            }

            let catPickerDrawerStyle = {
                transition: 'width 300ms ease-in-out',
                maxHeight: catPickerDrawerHeight,
                maxWidth: catPickerDrawerWidth,
                borderRadius: '26px',
                backgroundColor: '#FFFFFF',
                bottom: '11px',
                right: '135px',
                position: 'absolute',
                textAlign: 'left',
                overflow: 'hidden',
                paddingBottom: '54px'
            };

            let ImageCarousel = () => {
                return (
                    <div>
                        <Route render={({history}) => (
                            <img
                                className="product-image"
                                src={img_url}
                                style={{
                                    cursor: 'pointer'
                                }}
                                onClick={() => {
                                    history.push(`/outfit-page?id=${prod_hash}`)
                                }}
                            />
                        )}/>
                    </div>
                )
            };

            let ColorPicker = () => {
                let image = imageData;
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
                        margin: '2px',
                        marginRight: '0px',
                        display: 'inline-block',
                        cursor: 'pointer'
                    };
                    var colorStyle2 = {
                        width: '50px',
                        height: '50px',
                        borderRadius: '25px',
                        backgroundColor: color_2_hex,
                        margin: '2px',
                        marginRight: '0px',
                        display: 'inline-block',
                        cursor: 'pointer'
                    };
                    var colorStyle3 = {
                        width: '50px',
                        height: '50px',
                        borderRadius: '25px',
                        backgroundColor: color_3_hex,
                        margin: '2px',
                        marginRight: '0px',
                        display: 'inline-block',
                        cursor: 'pointer'
                    };
                }
                let rgbSum = eval(image['color_1'].join('+'));
                var pickerBgUrl;

                if (rgbSum > 400) {
                    pickerBgUrl = 'url("data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9JzIwMCcgd2lkdGg9JzIwMCcgIGZpbGw9IiMw'
                    + 'MDAwMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3Jn'
                    + 'LzE5OTkveGxpbmsiIHZlcnNpb249IjEuMSIgeD0iMHB4IiB5PSIwcHgiIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiBzdHlsZT0i'
                    + 'ZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAxMDAgMTAwOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PHBhdGggZD0iTTk0Ljks'
                    + 'MTcuNmMtMC44LTUuNy00LTguNi02LjYtMTAuNWMtMi45LTIuMS02LjYtMi42LTkuOS0xLjNjLTMuNSwxLjMtNiwzLjktOC42L'
                    + 'DYuNWMtMywzLjItNi4yLDYuMi05LjMsOS4zICBjLTMuMS0yLTQuOC0xLjgtNy4zLDAuNmMtMS41LDEuNS0zLDIuOS00LjQsN'
                    + 'C40Yy0xLjUsMS42LTEuNyw0LjItMC4yLDUuOGMwLjcsMC44LDEuNywxLjMsMi43LDJjLTEuMSwwLjktMS42LDEuMy0yLDEuN'
                    + 'yAgQzM4LDQ3LjQsMjYuNiw1OC44LDE1LjIsNzAuMWMtMi42LDIuNi00LjcsNS40LTUuNyw5LjFjLTAuNSwyLTEuNywzLjktM'
                    + 'i44LDUuNmMtMC4yLDAuMy0wLjQsMC41LTAuNiwwLjhjLTEuNywyLjMtMS42LDUuNCwwLjQsNy40ICBjMC4xLDAuMSwwLjIsM'
                    + 'C4yLDAuMiwwLjJjMiwyLDUsMi4xLDcuMywwLjVjMCwwLDAsMCwwLjEsMGMxLjctMS4yLDMuMy0yLjgsNS4yLTMuMWM0LjItM'
                    + 'C45LDcuNS0zLDEwLjQtNkM0MS4zLDczLjQsNTIuNiw2Miw2NCw1MC43ICBjMC41LTAuNSwxLTAuOSwxLjgtMS43YzAuNSwwL'
                    + 'jcsMC44LDEuMywxLjMsMS44YzIuMiwyLjMsNC42LDIuMiw2LjksMGMxLjItMS4yLDIuNC0yLjQsMy42LTMuNmMyLjktMi45L'
                    + 'DMuNy00LjMsMS4xLTcuOCAgYzIuNC0yLjQsNC44LTQuNyw3LjItNy4xYzMuMy0zLjQsNy4yLTYuMyw4LjctMTEuMUM5NSwyM'
                    + 'Cw5NS4xLDE4LjgsOTQuOSwxNy42eiBNNjEuNiw0Ny4yQzQ5LjksNTguOSwzOC4yLDcwLjYsMjYuNSw4Mi4yICBjLTIuMiwyL'
                    + 'jItNC43LDMuNi03LjcsNC40Yy0yLjMsMC42LTQuMywyLjItNi40LDMuM2MtMC4yLDAuMS0wLjQsMC4zLTAuNiwwLjRjLTAuN'
                    + 'iwwLjUtMS41LDAuNC0yLTAuMWMwLDAsMCwwLDAsMCAgYy0wLjUtMC42LTAuNi0xLjQtMC4xLTJjMC43LTAuOSwxLjQtMS44L'
                    + 'DItMi43YzAuOC0xLjMsMS41LTIuOCwxLjgtNC4zYzAuNi0yLjksMS45LTUuMywzLjktNy4zYzEyLjEtMTIuMSwyNC4yLTI0L'
                    + 'jIsMzYuMS0zNi4xICBjMi45LDIuOCw1LjcsNS43LDguNyw4LjdDNjIuMiw0Ni41LDYxLjksNDYuOSw2MS42LDQ3LjJ6Ij48L'
                    + '3BhdGg+PC9zdmc+")';
                    // pickerBgUrl = 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAQAAABIkb+zAAADeklEQVR4Ae3bA8wlSRQF4LO2bbN/1blrK1rbRrC2bdu2vRtutN4d27ZtvJ44k54enO5+r2qS+k6c+m/3bf33CVEURVEURVFlVnP72fl2Pz/mH9aDIznHZtso68E/+DEf4AVuP6yGMBn5FP/gHEuXk1n2pz3JY7A6QtG8CW+ybpaKmcIvebr385Fszac5w9Ki4Uh7JNkaftgafDr/khEzjbd5uKBcq/WwtKqwnzsODbQqH7D5llYbfmyboxFsG/vT0rpkQgPOgzuSk7Ib5hy+2rwrADTvylez94WyjjU+iFVQP3aWzVvySeL2xWLcvhyZXSOt+xaroj7cdTmbW9h2KDLaDuFCZV02/AD1wEtzN/Y+cvA9cV02z6Jq7oz8o8WDkMMOlNdlcyeqxJal3Zq7b4gcu2+or8uGl6IqyfocYml+kvXz/0Jdl3t3taEa9k22ePWXUF7Ys5IRw52cKbwCTwy+r6/Lzf0oa/e1bNgyG6i5g5HhDmZNX5eb2a3boRz30AqMxHtjMbY3R5ZZl8mHZW/f6fmF6zNK5GZvFMe7LfUdvoKikjVtvKXeM3X3tVAML7A0iFyCYvhbGA3wOxThtmVNuAnlCHVnYjXoeJM2z+sR6h4NHX/R5nk9Qt0bIFuFM6R5Xo9Ql29D5fYThzE9Ql3+DZW7XJzn9Qh12R8qPi3O83qEuhwHFX8O6hJaCJV1U+d5PULdeVBxiDjP6xHqchJUNlGd5/UIdbtBlT0GXkeJlN9CZfMsDSh3QsVJITXQdghUNiygBkZhVaisRzgNuMdLzKL+w7m2OXT2bDANvIYieFUgDUxr3gQZwjjtP+4KFLQqpwfQwOcozn71fvX/Y2ugOHez591vn2yKMlq2Z83j7n+889rQBfLG1jA7AVVwF3k48nPskcyxLy5Zk2Mbuvt97SW3E6pkdzbmkuHH7oqW7VG9vTawaZXt5ix7rvxOyvhgRbs/qHlX+JD/IZ8+UbY0wRd3cgUNPA+f7OvSLewNn/bagIPLvfeDVeCXa7V5Ze4A+McTy3yY4XaCf7y0RAN3IAR2feEWxjfyX5jwpT8h3VvWgzeZr116uYz8f/GVXaAL6avHnIuQuFbrIzYwA2FJ1hS/fv8/wqP8AMJdgTAlm/Im9lzuBfQvVkXI3H7L+hEQe7Zut7L+DCu1gbxm97VQuSiKoiiKomgRajYh74++j1MAAAAASUVORK5CYII=)'
                } else {
                    pickerBgUrl = 'url("data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9JzIwMCcgd2lkdGg9JzIwMCcgIGZpbGw9IiNmZ'
                    + 'mZmZmYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnL'
                    + 'zE5OTkveGxpbmsiIHZlcnNpb249IjEuMSIgeD0iMHB4IiB5PSIwcHgiIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiBzdHlsZT0iZ'
                    + 'W5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAxMDAgMTAwOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PHBhdGggZD0iTTk0LjksM'
                    + 'TcuNmMtMC44LTUuNy00LTguNi02LjYtMTAuNWMtMi45LTIuMS02LjYtMi42LTkuOS0xLjNjLTMuNSwxLjMtNiwzLjktOC42L'
                    + 'DYuNWMtMywzLjItNi4yLDYuMi05LjMsOS4zICBjLTMuMS0yLTQuOC0xLjgtNy4zLDAuNmMtMS41LDEuNS0zLDIuOS00LjQsN'
                    + 'C40Yy0xLjUsMS42LTEuNyw0LjItMC4yLDUuOGMwLjcsMC44LDEuNywxLjMsMi43LDJjLTEuMSwwLjktMS42LDEuMy0yLDEuN'
                    + 'yAgQzM4LDQ3LjQsMjYuNiw1OC44LDE1LjIsNzAuMWMtMi42LDIuNi00LjcsNS40LTUuNyw5LjFjLTAuNSwyLTEuNywzLjktM'
                    + 'i44LDUuNmMtMC4yLDAuMy0wLjQsMC41LTAuNiwwLjhjLTEuNywyLjMtMS42LDUuNCwwLjQsNy40ICBjMC4xLDAuMSwwLjIsM'
                    + 'C4yLDAuMiwwLjJjMiwyLDUsMi4xLDcuMywwLjVjMCwwLDAsMCwwLjEsMGMxLjctMS4yLDMuMy0yLjgsNS4yLTMuMWM0LjItM'
                    + 'C45LDcuNS0zLDEwLjQtNkM0MS4zLDczLjQsNTIuNiw2Miw2NCw1MC43ICBjMC41LTAuNSwxLTAuOSwxLjgtMS43YzAuNSwwL'
                    + 'jcsMC44LDEuMywxLjMsMS44YzIuMiwyLjMsNC42LDIuMiw2LjksMGMxLjItMS4yLDIuNC0yLjQsMy42LTMuNmMyLjktMi45L'
                    + 'DMuNy00LjMsMS4xLTcuOCAgYzIuNC0yLjQsNC44LTQuNyw3LjItNy4xYzMuMy0zLjQsNy4yLTYuMyw4LjctMTEuMUM5NSwyM'
                    + 'Cw5NS4xLDE4LjgsOTQuOSwxNy42eiBNNjEuNiw0Ny4yQzQ5LjksNTguOSwzOC4yLDcwLjYsMjYuNSw4Mi4yICBjLTIuMiwyL'
                    + 'jItNC43LDMuNi03LjcsNC40Yy0yLjMsMC42LTQuMywyLjItNi40LDMuM2MtMC4yLDAuMS0wLjQsMC4zLTAuNiwwLjRjLTAuN'
                    + 'iwwLjUtMS41LDAuNC0yLTAuMWMwLDAsMCwwLDAsMCAgYy0wLjUtMC42LTAuNi0xLjQtMC4xLTJjMC43LTAuOSwxLjQtMS44L'
                    + 'DItMi43YzAuOC0xLjMsMS41LTIuOCwxLjgtNC4zYzAuNi0yLjksMS45LTUuMywzLjktNy4zYzEyLjEtMTIuMSwyNC4yLTI0L'
                    + 'jIsMzYuMS0zNi4xICBjMi45LDIuOCw1LjcsNS43LDguNyw4LjdDNjIuMiw0Ni41LDYxLjksNDYuOSw2MS42LDQ3LjJ6Ij48L'
                    + '3BhdGg+PC9zdmc+")';
                    // pickerBgUrl = 'url("../images/baseline_palette_white_48dp.png")';
                }

                let pickerStyle = {
                    width: '54px',
                    height: '54px',
                    backgroundColor: color_1_hex,
                    backgroundImage: pickerBgUrl,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    backgroundSize: '42px 42px',
                    borderRadius: '27px',
                    position: 'absolute',
                    marginTop: '-48px',
                    right: '195px',
                    cursor: 'pointer'
                };

                var pickerDrawerHeight;

                if (this.state.pickerExpanded === img_hash){
                    pickerDrawerHeight = '250px';
                } else {
                    pickerDrawerHeight = '54px';
                }

                let pickerDrawerStyle = {
                    width: '54px',
                    transition: 'width 300ms ease-in-out',
                    height: pickerDrawerHeight,
                    borderRadius: '27px',
                    backgroundColor: '#FFFFFF',
                    bottom: '11px',
                    right: '195px',
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
                                    this.searchSimilarImages(img_hash, color_1);
                                }} />
                            <div
                                style={colorStyle2}
                                onClick={() => {
                                    this.setColorPosTags({'color_rgb': color_2, 'cat':''});
                                    this.searchSimilarImages(img_hash, color_2);
                                }} />
                            <div
                                style={colorStyle3}
                                onClick={() => {
                                    this.setColorPosTags({'color_rgb': color_3, 'cat':''});
                                    this.searchSimilarImages(img_hash, color_3);
                                }} />
                        </div>
                        <Tooltip title="Search By Color">
                            <div
                                style={pickerStyle}
                                onClick={() => {this.expandDrawer(img_hash, this.state.pickerExpanded);}}
                            />
                        </Tooltip>
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
                        <Tooltip title="Add Or Remove Tags">
                            <div
                                className="cat-picker-bubble"
                                onClick={() => {this.expandCatDrawer(prod_id, this.state.catPickerExpanded);}}
                            />
                        </Tooltip>
                    </div>
                )
            };

            return (
                <Paper zDepth={1} className="product-tile" key={key}>
                    <div className="product-name">{name}</div>
                    <div className="product-brand"><p>{brand} from {shop}</p></div>
                    <ImageCarousel />
                    <div className={sale ? 'product-price-sale' : 'product-price'}>
                        {sale ? `${currency}${saleprice}, was ${currency}${price}` : `${currency}${price}`}
                        </div>
                    <div className="prod-description"> </div>
                    <Tooltip title="Search Similar Items" >
                        <div
                            className="search-similar"
                            onClick={() => {
                                this.setColorPosTags({'color_rgb': fst_img_color, 'cat':''});
                                this.searchSimilarImages(fst_img_hash, fst_img_color);
                            }}
                        />
                    </Tooltip>
                    <Tooltip title="Search By Color" >
                        <ColorPicker />
                    </Tooltip>
                    <TagPicker/>
                    {(this.state.isAuth === "true") ? (
                        <Tooltip title="Add To Favorites" >
                            <div className="add-to-favorites" onClick={() => { this.showLookList(fst_img_hash) }} />
                        </Tooltip>
                    ) : (
                        <Route render={({history}) => (
                            <Tooltip title="Add To Favorites" >
                                <div
                                    className="add-to-favorites"
                                    onClick={() => {
                                        history.push(`/register-from-result?id=${fst_img_hash}`)
                                    }}
                                />
                            </Tooltip>
                        )}/>
                    )}
                    <Tooltip title="Buy Now" >
                        <div className="buy-now" onClick={() => {this.buyNow(prod_url)}}/>
                    </Tooltip>
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



        // console.log('Product shown dictionary: ', this.props.prodImgShown);
        return (
            <MuiThemeProvider>
                <div>
                    <div className="result-pane">
                        {tiles}
                    </div>

                    <PosNegButton />
                    {(this.state.addOutfitInput !== null)
                    && (
                        <AddOutfit
                            imgHash={this.state.addOutfitInput}
                            email={this.props.email}
                            addOutfitComplete={this.addOutfitComplete}
                        />
                    )}
                </div>
            </MuiThemeProvider>
        );
    }
}

export default withStyles(styles)(ResultsFromSearch);
