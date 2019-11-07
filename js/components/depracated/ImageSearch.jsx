// ImageSearch.jsx
import React from "react";
require('../../../css/garms.css');
require('../../../css/ball-atom.css');
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Dropzone from 'react-dropzone';
import ProductResults from './ProductResults';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import CatPicker from '../search/from_image/CatPicker';


//Component to search for products using an uploaded image
class ImageSearch extends React.Component  {

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
            mainColor: '',
            mainColorNr: 1,
            cats: [],
            altCats: [],
            mainCat: '',
            mainCat2: '',
            pca_256: [],
            sexPickerWidth: '56px',
            catsOn: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onDrop = this.onDrop.bind(this);
        this.getColors = this.getColors.bind(this);
        this.similarImageSearch = this.similarImageSearch.bind(this);
        this.getColorsCats = this.getColorsCats.bind(this);
        this.colorCatImageSearch = this.colorCatImageSearch.bind(this);
        this.setColorCat = this.setColorCat.bind(this);
        this.changeSex = this.changeSex.bind(this);
        this.expandSexSelector = this.expandSexSelector.bind(this);
        this.showCatPicker = this.showCatPicker.bind(this);
        this.setMainCats = this.setMainCats.bind(this);
        this.setMainCatsAndSearchSimilar = this.setMainCatsAndSearchSimilar.bind(this);
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
                if (data === "OK") {
                    this.setState({
                        isAuth: true
                    });
                }
            });
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

    // Sends color extraction request to server, sets state to colors in response
    getColors(){
        this.setState({
            loading: true
        });

        let imageFile = this.state.files[0];

        let data = new FormData();
        data.append('image', imageFile);

        fetch(window.location.origin + '/api/color', {
            method: 'post',
            body: data
        }).then(response => {
            return response.json();
        }).then(data => {
            this.setState({
                colors: data.res,
                loading: false
            });
        });
    }

    // Sends color and category prediction request to server, sets state to colors and categories in response
    getColorsCats(){
        this.setState({
            loading: true
        });

        let imageFile = this.state.files[0];

        let data = new FormData();
        // data.append('image', imageFile);
        data.append('image', imageFile);

        fetch(window.location.origin + '/api/colorcat', {
            method: 'post',
            body: data
        }).then(response => {
            return response.json();
        }).then(data => {
            this.setState({
                colors: data.res.colors,
                cats: data.res['img_cats_ai_txt'],
                altCats: data.res['alt_cats_txt'],
                mainCat: data.res['img_cats_ai_txt'][0],
                loading: false
            });
        });
    }

    // Once user has selected color from their image sends request to server to
    // analyse the image category and find the best color matches
    colorCatImageSearch(){
        let colorName = 'color_' + this.state.mainColor;
        let colorValue = this.state.colors[colorName].toString().replace(/\s+/g, '');
        // let pcaValue = this.state.pca_256.toString().replace(/\s+/g, '');
        let sex = this.state.sex;

        let catName = this.state.mainCat;

        this.setState({
            colors: {},
            cats: [],
            files: [],
            loading: true,
            mainColor: colorValue
        });

        let searchString = window.location.origin + '/api/colorcatsearch?cat_ai_txt=' + catName
            + '&color_rgb=' + colorValue
            + '&sex=' + sex;

        fetch(searchString, {
            method: 'get'
        }).then(response => {
            return response.json();
        }).then(data => {
            this.setState({
                results: data.res,
                loading: false
            });
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

        fetch(searchString, {
            method: 'get',
        }).then(function(response) {
            return response.json();
        }).then(data => {
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

        this.setState({
            loading: true
        });

        let mainColor = color_1.toString().replace(/\s+/g, '');
        let siam_64 = siamese_64.toString().replace(/\s+/g, '');

        let searchString = window.location.origin + '/api/search?nr1_cat_ai=' + nr1_cat_ai
            + '&main_cat=' + this.state.mainCat
            + '&main_cat2=' + this.state.mainCat2
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

    // Set main color and category state based on selection from modal
    setColorCat(selection){
        if(selection['cat'].length > 0) {
            let mainCat = selection['cat'];
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
            mainCat: mainCat,
            mainCat2: mainCat2
        });
    }

    // -------------------------- MAIN RENDER FUNCTION ----------------------------
    render () {
        // console.log('User email: ', this.state.email);

        // Element that shows preview of just uploaded photo
        let preview = this.state.files.length > 0 ? (
            <div className="preview-container">
                <img className="image-preview" src={this.state.files[0].preview} />
                <div className="search-button" onClick={this.getColorsCats}><p>search</p></div>
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
                <ProductResults
                    mainCat={this.state.mainCat}
                    setMainCatsAndSearchSimilar={(mainCat1, mainCat2, nr1_cat_ai, nr1_cat_sc, img_cat_sc_txt, color_1, siamese_64, prod_id) => {this.setMainCatsAndSearchSimilar(mainCat1, mainCat2, nr1_cat_ai, nr1_cat_sc, img_cat_sc_txt, color_1, siamese_64, prod_id) }}
                    email={this.state.email}
                    simImgSearch={(nr1_cat_ai, nr1_cat_sc, img_cat_sc_txt, color_1, siamese_64, id) => { this.similarImageSearch(nr1_cat_ai, nr1_cat_sc, img_cat_sc_txt, color_1, siamese_64, id) }}
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

        // Dynamic CSS for image color choice modal
        if(Object.keys(this.state.colors).length > 0){
            var colorStyle1 = {
                width: '70px',
                height: '70px',
                borderRadius: '30px',
                backgroundColor: this.state.colors.color_1_hex,
                margin: '10px',
                display: 'inline-block',
                cursor: 'pointer',
                borderWidth: this.state.mainColor === 1 && '5px',
                borderColor: this.state.mainColor === 1 && '#7f649c',
                borderStyle: this.state.mainColor === 1 && 'solid'
            };
            var colorStyle2 = {
                width: '70px',
                height: '70px',
                borderRadius: '30px',
                backgroundColor: this.state.colors.color_2_hex,
                margin: '10px',
                display: 'inline-block',
                cursor: 'pointer',
                borderWidth: this.state.mainColor === 2 && '5px',
                borderColor: this.state.mainColor === 2 && '#7f649c',
                borderStyle: this.state.mainColor === 2 && 'solid'
            };
            var colorStyle3 = {
                width: '70px',
                height: '70px',
                borderRadius: '30px',
                backgroundColor: this.state.colors.color_3_hex,
                margin: '10px',
                display: 'inline-block',
                cursor: 'pointer',
                borderWidth: this.state.mainColor === 3 && '5px',
                borderColor: this.state.mainColor === 3 && '#7f649c',
                borderStyle: this.state.mainColor === 3 && 'solid'
            };
        }

        // if colors are set in state show choice modal to select one main color
        // stateless component
        let ColorChoiceModal = () => {
            if(Object.keys(this.state.colors).length > 0){
                let catClass = (cat) => {
                    if(this.state.mainCat === cat){
                        return 'cat-choice-main'
                    } else {
                        return 'cat-choice'
                    }
                };

                let mainCats = this.state.cats.map((cat, index) => {
                    return(
                        <div key={index} className={catClass(cat)} onClick={() => this.setColorCat({'cat': cat})} >{cat}</div>
                    )
                });

                let moreCats = this.state.altCats.map((altCat, index) => {
                    return(
                        <div key={index} className={catClass(altCat)} onClick={() => this.setColorCat({'cat': altCat})} >{altCat}</div>
                    )
                });

                if(Object.keys(this.state.cats).length > 0){
                    return(
                        <div className="color-modal">
                            <div className="color-modal-image-preview">
                                <img className="color-image-preview" src={this.state.files[0].preview} />
                            </div>
                            <h5>I found these colors and themes in your photo</h5>
                            <br></br>
                            <p>choose which color to search for:</p>
                            <div style={colorStyle1} onClick={() => this.setColorCat({'color': 1, 'cat':''})} />
                            <div style={colorStyle2} onClick={() => this.setColorCat({'color': 2, 'cat':''})} />
                            <div style={colorStyle3} onClick={() => this.setColorCat({'color': 3, 'cat':''})} />
                            <br></br>
                            <br></br>
                            <p>choose which tags to search for:</p>
                            <div>
                                {mainCats}
                            </div>
                            <br></br>
                            <p>or choose from some more predictions:</p>
                            <div className="alt-cat-selection">
                                {moreCats}
                            </div>
                            <div className="colorcat-search-button" onClick={() => this.colorCatImageSearch() } >search</div>
                        </div>
                    )
                } else {
                    return(
                        <div className="overlay">
                            <Paper zDepth={1} className="color-modal">
                                <h3>Can't recognize the outfit, try a better quality photo</h3>
                                <RaisedButton className="ok-button" label="OK" onClick={() => { window.location.reload(); }} />
                            </Paper>
                        </div>
                    )
                }

            } else {
                return(
                    ''
                )
            }
        };

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
                boxShadow: '1px 1px 3px 0 rgba(0, 0, 0, 0.4)'
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

        // Main render
        return (
            <MuiThemeProvider>
                <div>
                    {searchOrResults}

                    <ColorChoiceModal />

                    <SexSelector />

                    <CatSelector />

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

                    {(this.state.catsOn === true) && (
                        <CatPicker
                            showCatPicker={this.showCatPicker}
                            setMainCats={(mainCat, mainCat2) => {this.setMainCats(mainCat, mainCat2);}}
                            mainCat={this.state.mainCat}
                            mainCat2={this.state.mainCat2}
                        />
                    )}
                </div>
            </MuiThemeProvider>
        );
    }
}

// export default withCookies(ImageSearch);
export default ImageSearch;
