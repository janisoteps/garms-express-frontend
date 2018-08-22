// SearchFromImage.jsx
import React from "react";
require('../css/garms.css');
require('../css/ball-atom.css');
import Dropzone from 'react-dropzone';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import ColorChoiceModal from './ColorChoiceModal';
import SexSelector from './SexSelector';
import ResultsFromImage from './ResultsFromImage';
import TagCloud from './TagCloud';
import ColorPicker from './ColorPicker';


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
            results: [],
            colors: {},
            selectedColors: [],
            sexPickerWidth: '48px',
            // color_512: [],
            encodingNoCrop: [],
            posTags: [],
            negTags: [],
            noShop: [],
            prodImgShown: {}
        };

        this.changeSex = this.changeSex.bind(this);
        this.expandSexSelector = this.expandSexSelector.bind(this);
        this.getImageFeatures = this.getImageFeatures.bind(this);
        this.searchSimilarImages = this.searchSimilarImages.bind(this);
        // this.setColorPosTags = this.setColorPosTags.bind(this);
        this.searchFromImage = this.searchFromImage.bind(this);
        // this.addTagSearchSimilar = this.addTagSearchSimilar.bind(this);
        this.setTags = this.setTags.bind(this);
        this.setColor = this.setColor.bind(this);
    }

    // Handles login input change
    handleChange(event) {
        let value =  event.target.value;
        let name = event.target.name;
        this.setState({
            [name]: value
        });
    }

    //Submits login request to server and sets state/cookies if successful
    handleSubmit(event) {
        // alert('A name was submitted: ' + this.state.value);
        event.preventDefault();
        let email = this.state.email;
        let pwd = this.state.pwd;

        fetch(window.location.origin + '/api/login', {
            method: 'post',
            body: JSON.stringify({email: email, pwd: pwd}),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(function(response) { return response.json(); })
            .then(function(data) {
                console.log(data);
                if (data === "OK") {
                    // this.setLoginState();
                    this.setState({
                        isAuth: true
                    });
                }
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
            // let newFile = new File(
            //     [new Uint8Array(content)], origFile.name, {type: mimestring}
            // );
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
                console.log('Reader loaded');
                const fileAsBinaryString = reader.result;

                let img = document.createElement("img");
                img.onload = () => {
                    console.log('Img loaded');
                    let canvas = document.createElement('canvas');
                    let ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0);

                    let MAX_WIDTH = 600;
                    let MAX_HEIGHT = 600;
                    let width = img.width;
                    let height = img.height;

                    console.log('Width: ', width);

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

        let imageFile = this.state.files[0];

        let data = new FormData();
        // data.append('image', imageFile);
        data.append('image', imageFile);

        fetch(window.location.origin + '/api/img_features', {
            method: 'post',
            body: data
        }).then(response => {
            return response.json();
        }).then(data => {
            console.log(data);
            this.setState({
                colors: data.res.colors,
                cats: data.res['img_cats_ai_txt'],
                altCats: data.res['alt_cats_txt'],
                mainCat: data.res['img_cats_ai_txt'][0],
                // color_512: data.res['color_512'],
                encodingNoCrop: data.res['encoding_nocrop'],
                // encoding_crop: data.res['encoding_crop'],
                // encoding_squarecrop: data.res['encoding_squarecrop'],
                loading: false
            });
        });
    }

    // Set main color and category state based on selection from modal
    setColorPosTags(selection){
        if(selection['cat'].length > 0) {
            let selectedCat = selection['cat'];
            console.log('Cat selections: ', selectedCat);
            let tags = this.state.posTags;
            if (tags.includes(selectedCat)){
                let filteredTags = tags.filter(function(e) { return e !== selectedCat });
                this.setState({
                            posTags: filteredTags
                        });
            } else {
                tags = tags.concat(selectedCat);
                console.log('New posTags: ', tags);
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
        console.log(flag + ' ' + type + ' tag with value ' + tag);
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
        console.log('SearchFromImage encoding nocrop: ', encodingNoCrop);

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
                console.log(data);
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

        console.log('Search string: ', searchString);

        fetch(searchString, {
            method: 'get',
        }).then(function(response) {
            return response.json();
        }).then(data => {
            console.log(data);
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


    // -------------------------- MAIN RENDER FUNCTION ----------------------------
    render () {

        // Element that shows preview of just uploaded photo
        let preview = this.state.files.length > 0 && this.state.encodingNoCrop.length === 0 ? (
            <div className="preview-container">
                <img className="image-preview" src={this.state.files[0].preview} />
                <div className="search-button" onClick={this.getImageFeatures}><p>search</p></div>
            </div>
        ) : (
            <p> </p>
        );

        // Shows either image drop zone or login form if not authorized
        let searchForm = this.state.isAuth === true || this.state.isAuth == "true" ? (
            <div>
                { this.state.files.length > 0 ? (
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
            <div className="register-form">
                <p>Log in your Garms account</p>
                <TextField hintText="Your e-mail"
                           floatingLabelText="Input your e-mail address:"
                           name="email"
                           onChange={this.handleChange.bind(this)}
                />
                <TextField hintText="Password"
                           floatingLabelText="Your password:"
                           type="password"
                           name="pwd"
                           onChange={this.handleChange.bind(this)}
                />
                <RaisedButton label="Log In"
                              primary={true}
                              onClick={this.handleSubmit}
                />
            </div>
        );

        // Nested logic: if results object is not falsy then show either product result component if state has results
        // Or show a response saying that image wasn't recognized
        if(this.state.results){
            // console.log('ImageSearch email: ', this.state.email);
            var searchOrResults = this.state.results.length > 0 ? (
                <ResultsFromImage
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
                />
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

                <SexSelector
                    sex={this.state.sex}
                    sexPickerWidth={this.state.sexPickerWidth}
                    changeSex={(sex) => {this.changeSex(sex)}}
                    expandSexSelector={() => {this.expandSexSelector()}}
                />

                <ColorChoiceModal
                    setColorPosTags={(selection) => {this.setColorPosTags(selection)}}
                    colorCatImageSearch={() => {this.searchFromImage()}}
                    colors={this.state.colors}
                    mainCat={this.state.mainCat}
                    cats={this.state.cats}
                    altCats={this.state.altCats}
                    files={this.state.files}
                    // mainColor={this.state.mainColor}
                    selectedColors={this.state.selectedColors}
                    tags={this.state.posTags}
                />

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
