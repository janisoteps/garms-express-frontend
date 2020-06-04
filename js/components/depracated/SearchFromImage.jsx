// SearchFromImage.jsx
import React from "react";
require('../../../css/garms.css');
require('../../../css/ball-atom.css');
import Dropzone from 'react-dropzone';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import ColorChoiceModal from '../search/from_image/ColorChoiceModal';
import ResultsFromSearch from '../search/results/ResultsFromSearch';
import SearchFromImageIntro from '../intro/SearchFromImageIntro';
import FlatButton from 'material-ui/FlatButton';
import Loyalty from 'material-ui/svg-icons/action/loyalty';
import ResultFilters from "../search/results/ResultFilters";
import LoadingScreen from "../loading/LoadingScreen";
import ReactGA from "react-ga";


//Component to search for products using an uploaded image
class SearchFromImage extends React.Component  {
    constructor(props) {
        super(props);
        this.state = {
            isAuth: this.props.isAuth,
            sex: this.props.sex,
            email: this.props.email,
            pwd: '',
            files: [],
            fileFromUrl: null,
            results: [],
            colors: {},
            selectedColor: [],
            sexPickerWidth: '48px',
            rcnnEncoding: [],
            posTags: [],
            negTags: [],
            noShop: [],
            prodImgShown: {},
            menuOpen: true,
            viewPortWidth: null,
            viewPortHeight: null,
            previewImgDims: {},
            firstLogin: this.props.firstLogin,
            rangeVal: 500,
            filterBrands: [],
            brandPickerShown: false,
            tagPickerShown: false,
            addOutfitShown: false,
            loadingContent: null,
            priceFilterShown: false
        };

        this.getImageFeatures = this.getImageFeatures.bind(this);
        this.searchSimilarImages = this.searchSimilarImages.bind(this);
        this.squexpandMenu = this.squexpandMenu.bind(this);
        this.searchFromImage = this.searchFromImage.bind(this);
        this.setTags = this.setTags.bind(this);
        this.setColor = this.setColor.bind(this);
        this.uploadFromUrl = this.uploadFromUrl.bind(this);
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.onImgLoad = this.onImgLoad.bind(this);
        this.updateRange = this.updateRange.bind(this);
        this.addOwnColor = this.addOwnColor.bind(this);
        this.addOwnCat = this.addOwnCat.bind(this);
        this.showBrandPicker = this.showBrandPicker.bind(this);
        this.addBrandFilter = this.addBrandFilter.bind(this);
        this.showTagPicker = this.showTagPicker.bind(this);
        this.addTagFilter = this.addTagFilter.bind(this);
        this.changeSex = this.changeSex.bind(this);
        this.changeOutfitShown = this.changeOutfitShown.bind(this);
        this.showPriceFilter = this.showPriceFilter.bind(this);
    }

    componentDidMount() {
        ReactGA.pageview(window.location.pathname + window.location.search);
        // Check if there is image url passed in query
        let url = window.location.href;
        let imgUrl = url.split("?")[1];
        if (imgUrl) {
            imgUrl = imgUrl.split('=')[1];
            imgUrl = decodeURIComponent(imgUrl);
            if (imgUrl) {
                this.uploadFromUrl(imgUrl);
            }
        }

        // Checks windows dimensions and resizing
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    componentDidUpdate(prevProps){
        if(prevProps.firstLogin !== this.props.firstLogin){
            this.setState({
                firstLogin: this.props.firstLogin
            });
        }
    }

    updateWindowDimensions() {
        this.setState({
            viewPortWidth: window.innerWidth,
            viewPortHeight: window.innerHeight
        });
    }

    onImgLoad({target:img}) {
        this.setState({
            previewImgDims: {
                height:img.offsetHeight,
                width:img.offsetWidth
            }
        });
    }

    // Handles login input change
    handleChange(event) {
        let value =  event.target.value;
        let name = event.target.name;
        this.setState({
            [name]: value
        });
    }

    uploadFromUrl = (imgUrl) => {
        const responseStatus = function (response) {
            if (response.status === 200 || response.status === 0) {
                return Promise.resolve(response)
            } else {
                return Promise.reject(new Error('Error loading: ' + url))
            }
        };
        const parseBlob = function (response) {
            return response.blob();
        };
        const downloadFile = function (url) {
            return fetch(url)
                .then(responseStatus)
                .then(parseBlob);
        };
        downloadFile(imgUrl)
            .then((blob) => {
                this.setState({
                    fileFromUrl: {
                        imgUrl: imgUrl,
                        file : blob
                    }
                });
            });
    };

    // When file is uploaded resize the image and then add to state
    onDrop = (acceptedFiles) => {
        // Define a function to get back to file type after resizing and getting base64 string
        function base64ToFile(dataURI, origFile) {
            let byteString, mimestring;
            if(dataURI.split(',')[0].indexOf('base64') !== -1 ) {
                byteString = atob(dataURI.split(',')[1]);
            } else {
                byteString = decodeURI(dataURI.split(',')[1]);
            }
            mimestring = dataURI.split(',')[0].split(':')[1].split(';')[0];
            let content = new Array();
            for (let i = 0; i < byteString.length; i++) {
                content[i] = byteString.charCodeAt(i);
            }
            let newFile = new Blob(
                [new Uint8Array(content)], {type: mimestring}
            );
            // Copy props set by the dropzone in the original file
            let origProps = [
                "upload", "status", "previewElement", "previewTemplate", "accepted", "preview"
            ];
            origProps.forEach(p => {
                newFile[p] = origFile[p];
            });
            return newFile;
        }

        // For each file dropped read it, turn it to base64 and resize using FileReader and canvas
        acceptedFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = () => {
                const fileAsBinaryString = reader.result;
                let img = document.createElement("img");
                img.onload = () => {
                    let canvas = document.createElement('canvas');
                    let ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0);
                    let MAX_WIDTH = 600;
                    let MAX_HEIGHT = 600;
                    let width = img.width;
                    let height = img.height;
                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }
                    canvas.width = width;
                    canvas.height = height;
                    let ctx_new = canvas.getContext("2d");
                    ctx_new.drawImage(img, 0, 0, width, height);
                    // Here we turn canvas to JPEG
                    let dataUrl = canvas.toDataURL("image/jpeg", 0.85);
                    // And here base64 JPEG to an actual file with Dropzone props added back
                    let image_file = base64ToFile(dataUrl, file);
                    this.setState({files: [image_file]});
                };
                img.src = fileAsBinaryString;
            };
            reader.onabort = () => console.log('file reading was aborted');
            reader.onerror = () => console.log('file reading has failed');

            reader.readAsDataURL(file);
        });
    };

    // Sends feature prediction request to server, sets state to data in response
    getImageFeatures(){
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
                    loading: true
                });
                let imageFile;
                if (this.state.fileFromUrl) {
                    imageFile = this.state.fileFromUrl.file;
                } else {
                    imageFile = this.state.files[0];
                }
                let data = new FormData();
                data.append('image', imageFile);
                fetch(window.location.origin + '/api/img_features', {
                    method: 'post',
                    body: data
                }).then(response => {
                    return response.json();
                }).then(data => {
                    ReactGA.event({
                        category: "Image Search",
                        action: 'get features',
                        label: data.res['img_cats_ai_txt'][0]
                    });
                    this.setState({
                        colors: data.res.colors,
                        cats: data.res['img_cats_ai_txt'],
                        mainCat: data.res['img_cats_ai_txt'][0],
                        rcnnEncoding: data.res['rcnn_encoding'],
                        vgg16Encoding: data.res['vgg16_encoding'],
                        loading: false
                    });
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
            this.setState({
                mainCat: selectedCat
            });
        } else {
            ReactGA.event({
                category: "Color Filter",
                action: 'apply',
                label: `${selection['color_rgb']}`
            });
            let colorRgb = selection['color_rgb'];
            this.setState({
                selectedColor: colorRgb
            });
        }
    }

    setColor(selection){
        let color_index = selection['index'];
        let new_rgb = selection['color_rgb'];

        let selectedColors = this.state.selectedColors;
        selectedColors[color_index] = new_rgb;
        this.setState({
            selectedColors: selectedColors
        });
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

    searchFromImage(){
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
                let colorRgb1 = this.state.selectedColor;
                let tags = this.state.posTags;
                let noShop = this.state.noShop;
                let sex = this.state.sex;
                let rcnnEncoding = this.state.rcnnEncoding;
                let vgg16Encoding = this.state.vgg16Encoding;
                this.setState({
                    colors: {},
                    cats: [],
                    files: [],
                    loading: true
                });
                fetch(window.location.origin + '/api/search_from_image', {
                    method: 'post',
                    body: JSON.stringify({
                        tags: tags,
                        color_rgb_1: colorRgb1,
                        sex: sex,
                        no_shop: noShop,
                        encoding_rcnn: rcnnEncoding,
                        vgg16_encoding: vgg16Encoding
                    }),
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    }
                }).then(function(response) { return response.json(); })
                    .then(data => {
                        this.setState({
                            results: data.res,
                            loading: false,
                        });
                    });
            });
        });
    }

    searchSimilarImages(imgHash, colorRgb1){
        this.setState({
            loading: true
        });
        ReactGA.event({
            category: "Image Search",
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

                let posTags = this.state.posTags;
                let negTags = this.state.negTags;
                let sex = this.state.sex;
                let noShop = this.state.noShop;
                let filterBrands = this.state.filterBrands;
                let color_1 = colorRgb1 ? colorRgb1 : this.state.selectedColor;
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

    updateRange(val, callback) {
        this.setState({
            rangeVal: val
        }, () => {
            callback();
        });
    }

    addOwnCat(cat) {
        let cats = this.state.cats;
        cats.push(cat);

        this.setState({
            cats: cats
        })
    }

    addOwnColor(color) {
        let colors = this.state.colors;
        colors['color_4'] = color['rgb'];
        colors['color_4_hex'] = color['hex'];

        this.setState({
            colors: colors,
            ownColorBorder: '5px #000000 solid'
        })
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
                label: negTag
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

    // -------------------------- MAIN RENDER FUNCTION ----------------------------
    render () {
        const rangeVal = this.state.rangeVal;
        let previewStyle = this.state.viewPortHeight - this.state.previewImgDims.height
        < this.state.viewPortWidth - this.state.previewImgDims.width ? {
            height: `calc( ${this.state.viewPortHeight}px - 175px )`,
            width: "auto"
        } : {
            width: `calc(${this.state.viewPortWidth}px - 20px)`,
            height: "auto"
        };

        // Element that shows preview of just uploaded photo
        let preview = this.state.files.length > 0 && this.state.rcnnEncoding.length === 0 ? (
            <div className="preview-container">
                <img onLoad={this.onImgLoad} style={previewStyle} src={this.state.files[0].preview} />
                <div className="search-button" onClick={this.getImageFeatures}><p>SEARCH</p></div>
            </div>
        ) : (
            this.state.fileFromUrl &&
            <div className="preview-container">
                <img onLoad={this.onImgLoad} style={previewStyle} src={this.state.fileFromUrl.imgUrl} />
                <div className="search-button" onClick={() => {this.getImageFeatures()}}><p>SEARCH</p></div>
            </div>
        );

        // Shows either image drop zone or login form if not authorized
        let searchForm = this.state.sex ? (
            <div>
                { this.state.files.length > 0 || this.state.fileFromUrl ? (
                    preview
                ) : (
                    <section>
                        <div className="image-search-area">
                            <Dropzone
                                className="image-dropzone"
                                onDrop={(files) => this.onDrop(files)}
                                accept=""
                            >
                                <div className="image-search-title">
                                    <div className="image-search-icon-alt" />
                                    <div className="search-choice-text">Drop image here or tap to select image</div>
                                </div>
                            </Dropzone>
                        </div>
                    </section>
                )}
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

        // Nested logic: if results object is not falsy then show either product result component if state has results
        // Or show a response saying that image wasn't recognized
        if(this.state.results){
            var searchOrResults = this.state.results.length > 0 ? (
                <div>
                    <ResultsFromSearch
                        sex={this.state.sex}
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
                        addBrandFilter={(brand, showPicker) => {this.addBrandFilter(brand, showPicker)}}
                    />

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
                </div>
            ) : (
                searchForm
            );
        } else {
            searchOrResults = (
                <div className="overlay">
                    <Paper zDepth={1} className="error-modal">
                        <h3>Can't recognize the outfit, try a better quality photo</h3>
                        <RaisedButton className="ok-button" label="OK" onClick={() => { window.location.reload(); }} />
                    </Paper>
                </div>
            )
        }

        // Main render
        return (
            <div>
                {searchOrResults}

                <ColorChoiceModal
                    setColorPosTags={(selection) => {this.setColorPosTags(selection)}}
                    colorCatImageSearch={() => {this.searchFromImage()}}
                    addOwnColor={(color) => {this.addOwnColor(color)}}
                    addOwnCat={(cat) => {this.addOwnCat(cat)}}
                    colors={this.state.colors}
                    mainCat={this.state.mainCat}
                    cats={this.state.cats}
                    altCats={this.state.altCats}
                    files={this.state.files}
                    fileFromUrl={this.state.fileFromUrl}
                    selectedColor={this.state.selectedColor}
                    tags={this.state.posTags}
                />

                {
                    (this.state.results.length > 0)
                    && (this.state.firstLogin === '1')
                    && (<SearchFromImageIntro
                        completeFirstLogin={() => {this.props.completeFirstLogin()}}
                    />)
                }

                {(this.state.loading === true) && (
                    <LoadingScreen
                        loadingContent={this.state.loadingContent}
                    />
                )}
            </div>
        );
    }
}

export default SearchFromImage;
