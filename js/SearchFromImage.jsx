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
            sexPickerWidth: '56px',
            // color_512: [],
            encodingNoCrop: [],
            posTags: [],
            negTags: [],
            noShop: []
        };

        this.changeSex = this.changeSex.bind(this);
        this.expandSexSelector = this.expandSexSelector.bind(this);
        this.getImageFeatures = this.getImageFeatures.bind(this);
        this.searchSimilarImages = this.searchSimilarImages.bind(this);
        this.setColorCat = this.setColorCat.bind(this);
        this.searchFromImage = this.searchFromImage.bind(this);
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
    setColorCat(selection){
        if(selection['cat'].length > 0) {
            let mainCat = selection['cat'];
            console.log('Cat selections: ', mainCat);
            let tags = this.state.posTags;
            if (tags.includes(mainCat)){
                // let index = posTags.indexOf(mainCat);
                // if (index !== -1) {
                //     posTags = posTags.splice(index, 1);
                //     this.setState({
                //         posTags: posTags
                //     });
                // }
                let filteredTags = tags.filter(function(e) { return e !== mainCat });
                this.setState({
                            posTags: filteredTags
                        });
            } else {
                // posTags = posTags.push(mainCat);
                tags = tags.concat(mainCat);
                console.log('New posTags: ', tags);
                this.setState({
                    posTags: tags
                });
            }
            this.setState({
                mainCat: mainCat
            });
        } else {
            let colorNr = selection['color'];
            this.setState({
                mainColor: colorNr
            });
        }
    }


    searchFromImage(){
        let colorName = 'color_' + this.state.mainColor;
        // let colorValue = this.state.colors[colorName].toString().replace(/\s+/g, '');
        let colorValue = this.state.colors[colorName];
        let tags = this.state.posTags;
        let noShop = this.state.noShop;
        let sex = this.state.sex;
        let encodingNoCrop = this.state.encodingNoCrop;
        console.log('SearchFromImage encoding nocrop: ', encodingNoCrop);

        this.setState({
            colors: {},
            cats: [],
            files: [],
            loading: true,
            mainColor: colorValue
        });

        // let searchString = window.location.origin + '/api/search_from_image?tags=' + tags
        //     + '&color_rgb=' + colorValue
        //     + '&sex=' + sex
        //     + '&no_shop=' + noShop
        //     + '&encoding_nocrop=' + encodingNoCrop;

        fetch(window.location.origin + '/api/search_from_image', {
            method: 'post',
            body: JSON.stringify({
                tags: tags,
                color_rgb: colorValue,
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
                this.setState({
                    results: data.res,
                    loading: false
                });
            });

        // console.log('Search String: ', searchString);
        // console.log('Search short: ', window.location.origin + '/api/search_from_image?posTags=' + tags
        //     + '&color_rgb=' + colorValue
        //     + '&sex=' + sex
        //     + '&no_shop=' + noShop);
        //
        // fetch(searchString, {
        //     method: 'get'
        // }).then(response => {
        //     return response.json();
        // }).then(data => {
        //     console.log(data);
        //     this.setState({
        //         results: data.res,
        //         loading: false
        //     });
        // });
    }


    searchSimilarImages(imgHash, colorRgb){
        this.setState({
            loading: true
        });

        let posTags = this.state.posTags.toString().replace(/\s+/g, '');
        let negTags = this.state.negTags.toString().replace(/\s+/g, '');
        let sex = this.state.sex;
        let noShop = this.state.noShop.toString().replace(/\s+/g, '');
        let color = colorRgb.toString().replace(/\s+/g, '');

        let searchString = window.location.origin + '/api/search_similar?'
            + 'img_hash=' + imgHash
            + '&tags_positive=' + posTags
            + '&tags_negative=' + negTags
            + '&color=' + color
            + '&sex=' + sex
            + '&no_shop=' + noShop;

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


    // // Sends similar product search request to server if user clicks on magnifying glass button
    // // Updates results state with the response
    // similarImageSearch(nr1_cat_ai, nr1_cat_sc, img_cat_sc_txt, color_1, siamese_64, prod_id){
    //
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
    //         + '&main_cat=' + this.state.mainCat
    //         + '&main_cat2=' + this.state.mainCat2
    //         + '&nr1_cat_sc=' + nr1_cat_sc
    //         + '&color_1=[' + mainColor
    //         + ']&pca_256=[' + siam_64
    //         + ']&sex=' + this.state.sex
    //         + '&id=' + prod_id;
    //
    //     console.log('search string: ', searchString);
    //
    //     fetch(searchString, {
    //         method: 'get',
    //     }).then(function(response) {
    //         return response.json();
    //     }).then(data => {
    //         console.log(data);
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
                    setMainCatsAndSearchSimilar={(
                        mainCat1,
                        mainCat2,
                        nr1_cat_ai,
                        nr1_cat_sc,
                        img_cat_sc_txt,
                        color_1,
                        siamese_64,
                        prod_id
                    ) => {this.setMainCatsAndSearchSimilar(
                        mainCat1,
                        mainCat2,
                        nr1_cat_ai,
                        nr1_cat_sc,
                        img_cat_sc_txt,
                        color_1,
                        siamese_64,
                        prod_id
                    ) }}
                    email={this.state.email}
                    searchSimilarImages={(
                        img_hash,
                        color
                    ) => { this.searchSimilarImages(
                        img_hash,
                        color
                    ) }}
                    results={this.state.results}
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
                    setColorCat={(selection) => {this.setColorCat(selection)}}
                    colorCatImageSearch={() => {this.searchFromImage()}}
                    colors={this.state.colors}
                    mainCat={this.state.mainCat}
                    cats={this.state.cats}
                    altCats={this.state.altCats}
                    files={this.state.files}
                    mainColor={this.state.mainColor}
                    tags={this.state.posTags}
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
