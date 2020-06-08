import React from "react";
import Vibrant from "node-vibrant";
import Dropzone from "react-dropzone";
import ColorSelector from './ColorSelector';
import CatSelector from "./CatSelector";
import ReactGA from "react-ga";
import ResultFilters from "../results/result_filters/ResultFilters";
import InfiniteSpinner from "../../loading/InfiniteSpinner";
import ResultsFromSearch from "../results/ResultsFromSearch";
import LoadingScreen from "../../loading/LoadingScreen";
import FailedRecognitionTagPicker from "./FailedRecognitionTagPicker";


class ImageSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            viewPortWidth: null,
            viewPortHeight: null,
            previewImgDims: {},
            vgg16Encoding: [],
            files: [],
            imgColors: null,
            selectedColor: null,
            colorChoosingComplete: false,
            loading: false,
            imgCats: null,
            failedTagRecognition: false,
            failedRecognition: false,
            posTags: [],
            negTags: [],
            filterBrands: [],
            loadedProdIds: [],
            rangeVal: 500,
            infiniteLoading: false,
            infiniteCount: 0,
            infiniteLoadingComplete: false,
            results: [],
            addOutfitShown: false,
            tagPickerShown: false,
            brandPickerShown: false,
            priceFilterShown: false,
            discountPickerShown: false,
            discountRate: 0,
            imgFeaturesLoading: false,
            loadingContent: null,
        };
        this.uploadFromUrl = this.uploadFromUrl.bind(this);
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.onDrop = this.onDrop.bind(this);
        this.onImgLoad = this.onImgLoad.bind(this);
        this.getColorFeatures = this.getColorFeatures.bind(this);
        this.setSelectedColor = this.setSelectedColor.bind(this);
        this.getImageFeatures = this.getImageFeatures.bind(this);
        this.completeColorChoosing = this.completeColorChoosing.bind(this);
        this.completeCatChoosing = this.completeCatChoosing.bind(this);
        this.updateRange = this.updateRange.bind(this);
        this.showBrandPicker = this.showBrandPicker.bind(this);
        this.addBrandFilter = this.addBrandFilter.bind(this);
        this.showTagPicker = this.showTagPicker.bind(this);
        this.addTagFilter = this.addTagFilter.bind(this);
        this.changeOutfitShown = this.changeOutfitShown.bind(this);
        this.showPriceFilter = this.showPriceFilter.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.setColorPosTags = this.setColorPosTags.bind(this);
        this.searchFromImage = this.searchFromImage.bind(this);
        this.addOwnCat = this.addOwnCat.bind(this);
        this.showHideTagPicker = this.showHideTagPicker.bind(this);
    }

    componentDidMount() {
        this._ismounted = true;
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
        window.addEventListener('scroll', this.handleScroll, { passive: true });
    }

    componentWillUnmount() {
        this._ismounted = false;
        window.removeEventListener('resize', this.updateWindowDimensions);
        window.removeEventListener('scroll', this.handleScroll);
    }

    handleScroll(event) {
        const docHeight = document.body.scrollHeight;
        const scrollDistance = window.pageYOffset + document.body.clientHeight;

        if (scrollDistance > (docHeight - docHeight * (0.7 ** (this.state.infiniteCount + 1)))) {
            if(this.state.infiniteLoading === false) {
                if (this.state.infiniteCount < 10) {
                    this.setState({
                        infiniteLoading: true
                    });
                    this.searchFromImage();
                } else {
                    this.setState({
                        infiniteLoadingComplete: true,
                        infiniteLoading: false
                    });
                }
            }
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

    setSelectedColor(colorDict) {
        this.setState({
            selectedColor: colorDict
        })
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
                    this.setState({files: [image_file]}, () => {
                        this.getColorFeatures();
                        this.getImageFeatures();
                    });
                };
                img.src = fileAsBinaryString;
            };
            reader.onabort = () => console.log('file reading was aborted');
            reader.onerror = () => console.log('file reading has failed');

            reader.readAsDataURL(file);
        });
    };

    getImageFeatures() {
        this.setState({
            imgFeaturesLoading: true
        });
        let imageFile;
        if (this.state.fileFromUrl) {
            imageFile = this.state.fileFromUrl.file;
        } else {
            imageFile = this.state.files[0];
        }
        let data = new FormData();
        data.append('image', imageFile);
        fetch(window.location.origin + '/api/img_features_light', {
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
                imgCats: data.res['img_cats_ai_txt'],
                vgg16Encoding: data.res['vgg16_encoding'],
                imgFeaturesLoading: false,
                failedTagRecognition: data.res['img_cats_ai_txt'].length === 0
            });
        }).catch((err) => {
            console.error(err);
            this.setState({
                failedRecognition: true
            })
        });
    }

    getColorFeatures() {
        Vibrant.from(this.state.files[0].preview)
            .addFilter(((red, green, blue, alpha) => {
                if ((red + green + blue) > 500) {
                    return true
                }
            }))
            .getPalette()
            .then((palette) => {
            const extractedColors = Object.keys(palette).map(key => {
                const colorDict = palette[key];
                return {
                    rgb: colorDict.rgb,
                    hex: colorDict.hex,
                    pop: colorDict.population
                }
            });
            const sortedColors = extractedColors.sort((a, b) => {
                if(a.hex < b.hex) {
                    return 1;
                } else {
                    return -1
                }
            });
                const filteredColors = sortedColors.filter(colorDict => {
                    if (colorDict) {
                        if (colorDict.pop > 5) {
                            return true
                        } else {
                            return false
                        }
                    } else {
                        return false
                    }
                })
            this.setState({
                imgColors: filteredColors
            }, () => {
                Vibrant.from(this.state.files[0].preview)
                    .getPalette()
                    .then((palette) => {
                        const extractedColors = Object.keys(palette).map(key => {
                            const colorDict = palette[key];
                            if (colorDict !== null) {
                                return {
                                    rgb: colorDict.rgb,
                                    hex: colorDict.hex,
                                    pop: colorDict.population
                                }
                            }
                        });
                        const sortedColors = extractedColors.sort((a, b) => {
                            if(a.hex < b.hex) {
                                return 1;
                            } else {
                                return -1
                            }
                        });
                        const filteredColors = sortedColors.filter(colorDict => {
                            if (colorDict) {
                                if (colorDict.pop > 5) {
                                    return true
                                } else {
                                    return false
                                }
                            } else {
                                return false
                            }
                        })
                        this.setState({
                            imgColors: this.state.imgColors.concat(filteredColors)
                        }, () => {
                            Vibrant.from(this.state.files[0].preview)
                                .addFilter(((red, green, blue, alpha) => {
                                    if ((red + green + blue) < 70) {
                                        return true
                                    }
                                }))
                                .getPalette()
                                .then((palette) => {
                                    const extractedColors = Object.keys(palette).map(key => {
                                        const colorDict = palette[key];
                                        if (colorDict !== null) {
                                            return {
                                                rgb: colorDict.rgb,
                                                hex: colorDict.hex,
                                                pop: colorDict.population
                                            }
                                        }
                                    });
                                    const sortedColors = extractedColors.sort((a, b) => {
                                        if(a.hex < b.hex) {
                                            return 1;
                                        } else {
                                            return -1
                                        }
                                    });
                                    const filteredColors = sortedColors.filter(colorDict => {
                                        if (colorDict) {
                                            if (colorDict.pop > 5) {
                                                return true
                                            } else {
                                                return false
                                            }
                                        } else {
                                            return false
                                        }
                                    })
                                    this.setState({
                                        imgColors: this.state.imgColors.concat(filteredColors)
                                    })
                                });
                        })
                    });
            });
        });
    }

    completeColorChoosing() {
        this.setState({
            colorChoosingComplete: true
        })
    }

    completeCatChoosing(cats) {
        this.setState({
            posTags: cats
        }, () => {
            this.searchFromImage()
        })
    }

    searchFromImage(){
        this.setState({
            loading: this.state.infiniteLoading === false
        }, () => {
            if (this.state.infiniteLoading === false) {
                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
                window.scrollTo(0, 0);
            }
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
                fetch(window.location.origin + '/api/image_search_infinite', {
                    method: 'post',
                    body: JSON.stringify({
                        pos_tags: this.state.posTags,
                        neg_tags: this.state.negTags,
                        color_1: this.state.selectedColor.rgb,
                        sex: this.props.sex,
                        vgg16_encoding: this.state.vgg16Encoding,
                        brands: this.state.filterBrands,
                        prev_prod_ids: this.state.loadedProdIds,
                        max_price: this.state.rangeVal < 500 ? this.state.rangeVal : 1000000,
                        discount_rate: this.state.discountRate
                    }),
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    }
                }).then(function(response) { return response.json(); })
                    .then(data => {
                        if(this._ismounted) {
                            const loadedProdIds = data.res.map(resDict => {
                                return resDict.image_data.prod_id
                            });
                            if (loadedProdIds.length > 0) {
                                this.setState({
                                    results: this.state.infiniteLoading === true ? this.state.results.concat(data.res) : data.res,
                                    loading: false,
                                    loadedProdIds: this.state.infiniteLoading === true
                                        ? this.state.loadedProdIds.concat(loadedProdIds) : loadedProdIds,
                                    infiniteCount: this.state.infiniteLoading === true ? this.state.infiniteCount + 1 : 0,
                                    infiniteLoading: false,
                                });
                            } else {
                                this.setState({
                                    infiniteLoadingComplete: true,
                                    infiniteLoading: false,
                                })
                            }
                        }
                    });
            });
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
    }

    setColorPosTags(selection) {
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
                label: `${selection['color_rgb']}`,
            });
            let colorRgb = selection['color_rgb'];
            this.setState({
                selectedColor: {
                    rgb: colorRgb,
                    hex: this.state.selectedColor.hex,
                    pop: this.state.selectedColor.pop
                }
            });
        }
    }

    setPosTags(imgCat) {
        if (this.state.posTags.includes(imgCat)) {
            this.setState({
                posTags: this.state.posTags.filter(cat => {
                    return cat !== imgCat
                })
            })
        } else {
            this.setState({
                posTags: this.state.posTags.concat([imgCat])
            })
        }
    }

    changeOutfitShown(isShown){
        this.setState({
            addOutfitShown: isShown
        })
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
                    this.setState({
                        infiniteLoadingComplete: false,
                        infiniteLoading: false,
                        loadedProdIds: []
                    }, () => {
                        this.searchFromImage();
                    });
                }
            });
        }
    }

    updateRange(val, callback) {
        this.setState({
            rangeVal: val
        }, () => {
            callback();
        });
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
                        this.setState({
                            infiniteLoadingComplete: false,
                            infiniteLoading: false,
                            loadedProdIds: []
                        }, () => {
                            this.searchFromImage();
                        });
                    }
                });
            }
        } else {
            ReactGA.event({
                category: "Tag Filter",
                action: 'negative',
                label: negTag,
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
                        this.setState({
                            infiniteLoadingComplete: false,
                            infiniteLoading: false,
                            loadedProdIds: []
                        }, () => {
                            this.searchFromImage();
                        });
                    }
                });
            }
        }
    }

    showTagPicker(show) {
        this.setState({
            tagPickerShown: show
        });
        if (show === false) {
            this.setState({
                infiniteLoadingComplete: false,
                infiniteLoading: false,
                loadedProdIds: []
            }, () => {
                this.searchFromImage();
            });
        }
    }

    showHideTagPicker(show) {
        this.setState({
            tagPickerShown: show
        });
    }

    showBrandPicker(show) {
        this.setState({
            brandPickerShown: show
        });
        if (show === false) {
            this.setState({
                infiniteLoadingComplete: false,
                infiniteLoading: false,
                loadedProdIds: []
            }, () => {
                this.searchFromImage();
            });
        }
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
            this.setState({
                infiniteLoadingComplete: false,
                infiniteLoading: false,
                loadedProdIds: []
            }, () => {
                this.searchFromImage();
            });
        }
    }

    addOwnCat(cat) {
        let cats = this.state.imgCats;
        cats.push(cat);

        this.setState({
            imgCats: cats,
            failedTagRecognition: false
        });
    }

    showDiscountPicker(show) {
        this.setState({
            discountPickerShown: show
        });
        if (show === false) {
            ReactGA.event({
                category: "Deal Filter",
                action: 'discount rate'
            });
            this.setState({
                infiniteLoadingComplete: false,
                infiniteLoading: false,
                loadedProdIds: []
            }, () => {
                this.searchFromImage();
            });
        }
    }

    setDiscountRate(rate) {
        this.setState({
            discountRate: rate
        });
    }


    // ================================================ MAIN RENDER =================================================

    render () {
        const Spinner = () => {
            return(
                <div>
                    {(this.state.loading === true) && (
                        <LoadingScreen
                            loadingContent={this.state.loadingContent}
                        />
                    )}
                </div>
            )
        };

        let previewStyle = this.state.viewPortHeight - this.state.previewImgDims.height
        < this.state.viewPortWidth - this.state.previewImgDims.width ? {
            height: `calc( ${this.state.viewPortHeight}px - 200px )`,
            width: "auto",
            marginBottom: '5px',
            boxShadow: this.state.selectedColor !== null ? `${this.state.selectedColor.hex} 0px 0px 10px` : ''
        } : {
            width: `calc(${this.state.viewPortWidth}px - 50px)`,
            height: "auto",
            marginBottom: '5px',
            boxShadow: this.state.selectedColor !== null ? `${this.state.selectedColor.hex} 0px 0px 10px` : ''
        };
        // Element that shows preview of just uploaded photo
        const preview = this.state.files.length > 0 ? (
            <div className="preview-container-new">
                <img
                    onLoad={this.onImgLoad}
                    style={previewStyle}
                    src={this.state.files[0].preview}
                />
                {this.state.imgColors !== null && this.state.colorChoosingComplete === false && (
                    <div>
                        <ColorSelector
                            imgColors={this.state.imgColors}
                            setSelectedColor={(color) => {this.setSelectedColor(color)}}
                            completeColorChoosing={() => {this.completeColorChoosing()}}
                            imgFeaturesLoading={this.state.imgFeaturesLoading}
                            selectedColor={this.state.selectedColor}
                            showIosNav={this.props.showIosNav}
                        />
                    </div>
                )}
                {this.state.colorChoosingComplete === true && (
                    <CatSelector
                        imgCats={this.state.imgCats}
                        posTags={this.state.posTags}
                        completeCatChoosing={(cats) => {this.completeCatChoosing(cats)}}
                        addOwnCat={(cat) => {
                            this.addOwnCat(cat);
                            this.showHideTagPicker(false);
                        }}
                        tagPickerShown={this.state.tagPickerShown}
                        setPosTags={(tag) => {this.setPosTags(tag)}}
                        showHideTagPicker={(show) => {this.showHideTagPicker(show)}}
                        showIosNav={this.props.showIosNav}
                    />
                )}
                {this.state.colorChoosingComplete === true && this.state.failedTagRecognition === true && (
                    <FailedRecognitionTagPicker
                        imgCats={this.state.imgCats}
                        posTags={this.state.posTags}
                        completeCatChoosing={(cats) => {this.completeCatChoosing(cats)}}
                        addOwnCat={(cat) => {
                            this.addOwnCat(cat);
                            this.showHideTagPicker(false);
                        }}
                        tagPickerShown={this.state.tagPickerShown}
                        setPosTags={(tag) => {this.setPosTags(tag)}}
                        showHideTagPicker={(show) => {this.showHideTagPicker(show)}}
                        showIosNav={this.props.showIosNav}
                    />
                )}
                {this.state.failedRecognition === true && (
                    <div
                        style={{
                            position: 'fixed',
                            top: '50',
                            left: '0',
                            width: '100vw',
                            height: 'calc(100vh - 50px)',
                            textAlign: 'center',
                            paddingTop: '100px',
                            backgroundColor: '#FFFFFF'
                        }}
                    >
                        <h3>Oh no, it didn't work!</h3>
                        <p>Try another image</p>
                        <div
                            onClick={() => {
                                window.location.reload();
                            }}
                            style={{
                                display: 'inline-block',
                                width: '90px',
                                cursor: 'pointer',
                                height: '30px',
                                color: '#FFFFFF',
                                backgroundColor: '#000000',
                                borderRadius: '3px'
                            }}
                        >
                            OK
                        </div>
                    </div>
                )}
            </div>
        ) : (
            this.state.fileFromUrl &&
            <div className="preview-container">
                <img
                    onLoad={this.onImgLoad}
                    style={previewStyle}
                    src={this.state.fileFromUrl.imgUrl}
                />
                <div
                    className="search-button"
                    onClick={() => {this.getColorFeatures()}}
                >
                    <p>SEARCH</p>
                </div>
            </div>
        );
        return (
            <div>
                {this.state.results.length === 0 && (
                    <div
                        style={{
                            overflow: 'hidden'
                        }}
                    >
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
                )}
                {this.state.results.length > 0 && (
                    <div>
                        <ResultsFromSearch
                            sex={this.props.sex}
                            isAuth={this.props.isAuth}
                            email={this.props.email}
                            searchSimilarImages={(
                                img_hash,
                                color_1
                            ) => {
                                this.props.history.push(`/search-similar?id=${img_hash}&sex=${this.props.sex}&clr=${encodeURIComponent(color_1)}&cats=${encodeURIComponent(this.state.posTags)}&disc=${Math.floor(this.state.discountRate * 100)}`);
                            }}
                            results={this.state.results}
                            setTags={(tag, type, flag) => {this.setTags(tag, type, flag)}}
                            setColorPosTags={(selection) => {this.setColorPosTags(selection)}}
                            selectedColor={this.state.selectedColor.rgb}
                            firstLogin={this.props.firstLogin}
                            changeOutfitShown={(isShown) => {this.changeOutfitShown(isShown)}}
                            addBrandFilter={(brand, showPicker) => {this.addBrandFilter(brand, showPicker)}}
                        />

                        {this.state.infiniteLoading && !this.state.infiniteLoadingComplete && (
                            <div
                                style={{
                                    marginBottom: '100px',
                                    marginTop: '100px',
                                    paddingBottom: '50px'
                                }}
                            >
                                <br />
                                <InfiniteSpinner />
                                <br />
                            </div>
                        )}

                        {this.state.infiniteLoadingComplete && (
                            <div
                                style={{
                                    width: '100%',
                                    textAlign: 'center'
                                }}
                            >
                                <br />
                                <br />
                                <div className="infinite-spinner-done">

                                </div><h4>All Results Loaded</h4>
                                <br />
                                <br />
                            </div>
                        )}

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
                                selectedColor={this.state.selectedColor.rgb}
                                searchSimilarImages={(imgHash, color1) => {
                                    this.setState({
                                        infiniteLoadingComplete: false,
                                        infiniteLoading: false
                                    })
                                    this.searchFromImage();
                                }}
                                results={this.state.results}
                                filterBrands={this.state.filterBrands}
                                brandPickerShown={this.state.brandPickerShown}
                                showBrandPicker={(show) => {this.showBrandPicker(show)}}
                                addBrandFilter={(brand, showPicker) => {this.addBrandFilter(brand, showPicker)}}
                                showPriceFilter={(show) => {this.showPriceFilter(show)}}
                                priceFilterShown={this.state.priceFilterShown}
                                showDiscountPicker={(show) => {this.showDiscountPicker(show)}}
                                discountPickerShown={this.state.discountPickerShown}
                                setDiscountRate={(rate) => {this.setDiscountRate(rate)}}
                                discountRate={this.state.discountRate}
                            />
                        )}
                    </div>
                )}

                <Spinner />
            </div>
        )
    }
}

export default ImageSearch
