// SearchFromImage.jsx
import React from "react";
require('../../../../css/garms.css');
require('../../../../css/ball-atom.css');
import Dropzone from 'react-dropzone';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import ColorChoiceModal from './ColorChoiceModal';
import SexSelector from '../results/SexSelector';
import ResultsFromSearch from '../results/ResultsFromSearch';
import TagCloud from '../results/TagCloud';
import ColorPicker from './ColorPicker';
import SearchFromImageIntro from '../../intro/SearchFromImageIntro';
import FlatButton from 'material-ui/FlatButton';
import Loyalty from 'material-ui/svg-icons/action/loyalty';


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
            selectedColors: [],
            sexPickerWidth: '48px',
            encodingNoCrop: [],
            posTags: [],
            negTags: [],
            noShop: [],
            prodImgShown: {},
            menuOpen: true,
            viewPortWidth: null,
            viewPortHeight: null,
            previewImgDims: {},
            firstLogin: this.props.firstLogin
        };

        this.changeSex = this.changeSex.bind(this);
        this.expandSexSelector = this.expandSexSelector.bind(this);
        this.getImageFeatures = this.getImageFeatures.bind(this);
        this.searchSimilarImages = this.searchSimilarImages.bind(this);
        this.squexpandMenu = this.squexpandMenu.bind(this);
        this.searchFromImage = this.searchFromImage.bind(this);
        this.setTags = this.setTags.bind(this);
        this.setColor = this.setColor.bind(this);
        this.uploadFromUrl = this.uploadFromUrl.bind(this);
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.onImgLoad = this.onImgLoad.bind(this);
    }

    componentDidMount() {
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
    //             console.log(data);
    //             if (data === "OK") {
    //                 this.setState({
    //                     isAuth: true
    //                 });
    //             }
    //         });
    // }

    changeSex(sex){
        this.props.changeSex(sex);
        this.setState({
            sex: sex
        });
    }

    expandSexSelector(){
        let currentWidth = this.state.sexPickerWidth;
        // console.log('Expanding sex selector ', currentWidth);
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
                // console.log(`File from URL: ${imgUrl}`);
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
                // console.log('Reader loaded');
                const fileAsBinaryString = reader.result;
                let img = document.createElement("img");
                img.onload = () => {
                    // console.log('Img loaded');
                    let canvas = document.createElement('canvas');
                    let ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0);
                    let MAX_WIDTH = 600;
                    let MAX_HEIGHT = 600;
                    let width = img.width;
                    let height = img.height;
                    // console.log('Width: ', width);
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
            // console.log(data);
            this.setState({
                colors: data.res.colors,
                cats: data.res['img_cats_ai_txt'],
                altCats: data.res['alt_cats_txt'],
                mainCat: data.res['img_cats_ai_txt'][0],
                encodingNoCrop: data.res['encoding_nocrop'],
                loading: false
            });
        });
    }

    // Set main color and category state based on selection from modal
    setColorPosTags(selection){
        if(selection['cat'].length > 0) {
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

    searchFromImage(){
        let colorRgb1 = this.state.selectedColors[0];
        let colorRgb2 = this.state.selectedColors[1];
        let tags = this.state.posTags;
        let noShop = this.state.noShop;
        let sex = this.state.sex;
        let encodingNoCrop = this.state.encodingNoCrop;
        // console.log('SearchFromImage encoding nocrop: ', encodingNoCrop);
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
                color_rgb_2: colorRgb2,
                sex: sex,
                no_shop: noShop,
                encoding_nocrop: encodingNoCrop
            }),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(function(response) { return response.json(); })
            .then(data => {
                // console.log(data);
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
                    prodImgShown: prodImgShown
                });
            });
    }

    searchSimilarImages(imgHash, colorRgb1, colorRgb2){
        this.setState({
            loading: true
        });
        let posTags = this.state.posTags.toString().replace(/\s+/g, '');
        let negTags = this.state.negTags.toString().replace(/\s+/g, '');
        let sex = this.state.sex;
        let noShop = this.state.noShop.toString().replace(/\s+/g, '');
        let color_1 = colorRgb1.toString().replace(/\s+/g, '');
        let color_2 = colorRgb2.toString().replace(/\s+/g, '');
        let searchString = window.location.origin + '/api/search_similar?'
            + 'img_hash=' + imgHash
            + '&tags_positive=' + posTags
            + '&tags_negative=' + negTags
            + '&color_1=' + color_1
            + '&color_2=' + color_2
            + '&sex=' + sex
            + '&no_shop=' + noShop;
        // console.log('Search string: ', searchString);
        fetch(searchString, {
            method: 'get',
        }).then(function(response) {
            return response.json();
        }).then(data => {
            // console.log(data);
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
                prodImgShown: prodImgShown
            });
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
            window.scrollTo(0, 0);
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


    // -------------------------- MAIN RENDER FUNCTION ----------------------------
    render () {
        // console.log(`viewportHeight: ${this.state.viewPortHeight}\n`
        //     + `viewportWidth: ${this.state.viewPortWidth}\n`
        //     + `imageHeight: ${this.state.previewImgDims.height}\n`
        //     + `imageWidth: ${this.state.previewImgDims.width}\n`
        // );
        // console.log(`SearchFromImage firstLogin: ${this.state.firstLogin}`);
        let previewStyle = this.state.viewPortHeight - this.state.previewImgDims.height
        < this.state.viewPortWidth - this.state.previewImgDims.width ? {
            height: `calc( ${this.state.viewPortHeight}px - 175px )`,
            width: "auto"
        } : {
            width: `calc(${this.state.viewPortWidth}px - 20px)`,
            height: "auto"
        };
        // console.log('File from URL');
        // console.log(this.state.fileFromUrl);
        // Element that shows preview of just uploaded photo
        let preview = this.state.files.length > 0 && this.state.encodingNoCrop.length === 0 ? (
            <div className="preview-container">
                <img onLoad={this.onImgLoad} style={previewStyle} src={this.state.files[0].preview} />
                <div className="search-button" onClick={this.getImageFeatures}><p>search</p></div>
            </div>
        ) : (
            this.state.fileFromUrl &&
            <div className="preview-container">
                <img onLoad={this.onImgLoad} style={previewStyle} src={this.state.fileFromUrl.imgUrl} />
                <div className="search-button" onClick={() => {this.getImageFeatures()}}><p>search</p></div>
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
                            <Dropzone className="image-dropzone" onDrop={(files) => this.onDrop(files)} accept="image/jpeg">
                                <div className="image-search-title">
                                    <div className="image-search-icon-alt"></div>
                                    <div className="search-choice-text">Drop image here or tap to select image</div>
                                </div>
                            </Dropzone>
                        </div>
                    </section>
                )
                }
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
            // console.log('ImageSearch email: ', this.state.email);
            var searchOrResults = this.state.results.length > 0 ? (
                <div>
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
                        prodImgShown={this.state.prodImgShown}
                        setTags={(tag, type, flag) => {this.setTags(tag, type, flag)}}
                        setColorPosTags={(selection) => {this.setColorPosTags(selection)}}
                        selectedColors={this.state.selectedColors}
                        firstLogin={this.props.firstLogin}
                    />

                    <SexSelector
                        sex={this.state.sex}
                        sexPickerWidth={this.state.sexPickerWidth}
                        changeSex={(sex) => {this.changeSex(sex)}}
                        expandSexSelector={() => {this.expandSexSelector()}}
                    />
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

                <TagCloud
                    posTags={this.state.posTags}
                    negTags={this.state.negTags}
                    setTags={(tag, type, flag) => {this.setTags(tag, type, flag)}}
                />

                <ColorPicker
                    setColor={(selection) => {this.setColor(selection)}}
                    selectedColors={this.state.selectedColors}
                    searchSimilarImages={(imgHash, color1, color2) => {
                        this.searchSimilarImages(imgHash, color1, color2)
                    }}
                    results={this.state.results}
                />

                <ColorChoiceModal
                    setColorPosTags={(selection) => {this.setColorPosTags(selection)}}
                    colorCatImageSearch={() => {this.searchFromImage()}}
                    colors={this.state.colors}
                    mainCat={this.state.mainCat}
                    cats={this.state.cats}
                    altCats={this.state.altCats}
                    files={this.state.files}
                    fileFromUrl={this.state.fileFromUrl}
                    selectedColors={this.state.selectedColors}
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
        );
    }
}

export default SearchFromImage;
