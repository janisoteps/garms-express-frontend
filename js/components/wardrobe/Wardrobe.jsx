// Wardrobe.jsx
import React from "react";
import {isMobile} from "react-device-detect";
require('../../../css/garms.css');
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper';
import AddOutfit from './AddOutfit';
import RecommendFromTags from './../recommend/RecommendFromTags';
import {Route} from 'react-router-dom';
import Tooltip from '@material-ui/core/Tooltip';
import ReactGA from "react-ga";
import WardrobeCard from "./WardrobeCard";


class Wardrobe extends React.Component  {
    constructor(props) {
        super(props);
        this.state = {
            isAuth: this.props.isAuth,
            username: this.props.username,
            email: this.props.email,
            sex: this.props.sex,
            looks: [],
            outfits: [],
            addingLook: false,
            newLookInput: '',
            removeLookInput: null,
            lookFilter: null,
            showingLooks: true,
            noLooks: false,
            imgHash: null,
            showRenameModal: false
        };

        this.removeLook = this.removeLook.bind(this);
        this.addLook = this.addLook.bind(this);
        this.addOutfit = this.addOutfit.bind(this);
        this.removeOutfit = this.removeOutfit.bind(this);
        this.getProducts = this.getProducts.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.showAddLookModal = this.showAddLookModal.bind(this);
        this.setLookFilter = this.setLookFilter.bind(this);
        this.showRemoveLookModal = this.showRemoveLookModal.bind(this);
        this.expandLooks = this.expandLooks.bind(this);
        this.addOutfitComplete = this.addOutfitComplete.bind(this);
        this.showAddOutfit = this.showAddOutfit.bind(this);
        this.setResultLength = this.setResultLength.bind(this);
    }

    componentDidMount() {
        ReactGA.pageview(window.location.pathname + window.location.search);
        this._ismounted = true;

        if (isMobile) {
            this.setState({
                showingLooks: false
            })
        }

        // Handle registration redirect from RegisterFromResult
        const queryString = window.location.search;
        if(queryString.length > 0) {
            const imgHash = window.location.search.split('id=')[1];
            if (imgHash) {
                this.setState({
                    imgHash: imgHash
                });
            }
        }

        // Load looks
        fetch(`${window.location.origin}/api/get_looks`, {
            method: 'post',
            body: JSON.stringify({'email': this.state.email}),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(function(response) {
            return response.json();
        }).then(data => {
            if (data.looks === null) {
                this.setState({
                    noLooks: true
                })
            } else {
                const looksArr = data.looks.sort(function(a, b){
                    if(a.look_name.toLowerCase() < b.look_name.toLowerCase()) { return -1; }
                    if(a.look_name.toLowerCase() > b.look_name.toLowerCase()) { return 1; }
                    return 0;
                });
                const outfitArr = data.wardrobe.reverse();
                const prodHashes = outfitArr.map(outfitDict => {
                    return outfitDict.prod_id
                });

                if (this._ismounted) {
                    this.getProducts(prodHashes, prodData => {

                        const prodHashInfoDict = {};
                        prodData.forEach(prodDict => {
                            prodHashInfoDict[prodDict[0]['prod_id']] = {
                                imgUrl: prodDict[0]['image_urls'][0],
                                brand: prodDict[0]['brand'],
                                price: prodDict[0]['price'],
                                currency: prodDict[0]['currency'],
                                name: prodDict[0]['name'],
                                url: prodDict[0]['prod_url'],
                                sale: prodDict[0]['sale'],
                                salePrice: prodDict[0]['saleprice'],
                                shop: prodDict[0]['shop'],
                                imgHash: prodDict[0]['image_hash'][0]
                            };
                        });

                        const outfitImgArr = outfitArr.map(outfitDict => {
                            let resultOutfitDict = outfitDict;
                            resultOutfitDict['info'] = prodHashInfoDict[outfitDict.prod_id];
                            return resultOutfitDict
                        });

                        if (this._ismounted) {
                            this.setState({
                                outfits: outfitImgArr,
                                looks: looksArr
                            });
                        }
                    });
                }

            }
        });
    }

    componentWillUnmount() {
        this._ismounted = false;
    }

    handleInputChange(event) {
        let value = event.target.value;
        let name = event.target.name;
        this.setState({
            [name]: value
        });
    }

    showAddLookModal = () => {
        this.setState({
            addingLook: true
        });
    };

    setLookFilter = (lookName) => {
        ReactGA.event({
            category: "Wardrobe",
            action: 'look filter',
            label: lookName
        });
        this.setState({
            lookFilter: lookName
        })
    };

    removeLook = (lookName) => {
        ReactGA.event({
            category: "Wardrobe",
            action: 'remove look',
            label: lookName,
        });
        let email = this.state.email;
        fetch(`${window.location.origin}/api/remove_look`, {
            method: 'post',
            body: JSON.stringify({email: email, look_name: lookName}),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(function(response) { return response.json(); })
            .then(data => {
                const looksArr = data.looks.sort(function(a, b){
                    if(a.look_name < b.look_name) { return -1; }
                    if(a.look_name > b.look_name) { return 1; }
                    return 0;
                });

                const outfitArr = data.wardrobe.reverse();
                const prodHashes = outfitArr.map(outfitDict => {
                    return outfitDict.prod_id
                });

                this.getProducts(prodHashes, prodData => {

                    const prodHashInfoDict = {};
                    prodData.forEach(prodDict => {
                        prodHashInfoDict[prodDict[0]['prod_id']] = {
                            imgUrl: prodDict[0]['image_urls'][0],
                            brand: prodDict[0]['brand'],
                            price: prodDict[0]['price'],
                            currency: prodDict[0]['currency'],
                            name: prodDict[0]['name'],
                            url: prodDict[0]['prod_url'],
                            sale: prodDict[0]['sale'],
                            salePrice: prodDict[0]['saleprice'],
                            shop: prodDict[0]['shop'],
                            imgHash: prodDict[0]['image_hash'][0]
                        };
                    });

                    const outfitImgArr = outfitArr.map(outfitDict => {
                        let resultOutfitDict = outfitDict;
                        resultOutfitDict['info'] = prodHashInfoDict[outfitDict.prod_id];
                        return resultOutfitDict
                    });

                    this.setState({
                        removeLookInput: null,
                        lookFilter: null,
                        looks: looksArr,
                        outfits: outfitImgArr
                    });
                });
            });
    };

    renameLook = (lookName) => {
        const email = this.state.email;
        const newLookName = this.state.newLookInput;

        ReactGA.event({
            category: "Wardrobe",
            action: 'rename look',
            label: `${lookName} => ${newLookName}`,
        });

        fetch(`${window.location.origin}/api/rename_look`, {
            method: 'post',
            body: JSON.stringify({
                email: email,
                look_name: lookName,
                new_look_name: newLookName
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(function(response) { return response.json(); })
            .then(data => {
                const looksArr = data.looks.sort(function(a, b){
                    if(a.look_name < b.look_name) { return -1; }
                    if(a.look_name > b.look_name) { return 1; }
                    return 0;
                });

                const outfitArr = data.wardrobe.reverse();
                const prodHashes = outfitArr.map(outfitDict => {
                    return outfitDict.prod_id
                });

                this.getProducts(prodHashes, prodData => {

                    const prodHashInfoDict = {};
                    prodData.forEach(prodDict => {
                        prodHashInfoDict[prodDict[0]['prod_id']] = {
                            imgUrl: prodDict[0]['image_urls'][0],
                            brand: prodDict[0]['brand'],
                            price: prodDict[0]['price'],
                            currency: prodDict[0]['currency'],
                            name: prodDict[0]['name'],
                            url: prodDict[0]['prod_url'],
                            sale: prodDict[0]['sale'],
                            salePrice: prodDict[0]['saleprice'],
                            shop: prodDict[0]['shop'],
                            imgHash: prodDict[0]['image_hash'][0]
                        };
                    });

                    const outfitImgArr = outfitArr.map(outfitDict => {
                        let resultOutfitDict = outfitDict;
                        resultOutfitDict['info'] = prodHashInfoDict[outfitDict.prod_id];
                        return resultOutfitDict
                    });

                    this.setState({
                        newLookInput: '',
                        lookFilter: newLookName,
                        looks: looksArr,
                        outfits: outfitImgArr,
                        showRenameModal: false
                    });
                });
            });
    };

    showRemoveLookModal = (lookName) => {
        this.setState({
            removeLookInput: lookName
        })
    };

    addLook = (e) => {
        e.preventDefault();
        let email = this.state.email;
        let lookName = this.state.newLookInput;

        ReactGA.event({
            category: "Wardrobe",
            action: 'add look',
            label: lookName
        });

        fetch(`${window.location.origin}/api/add_look`, {
            method: 'post',
            body: JSON.stringify({email: email, look_name: lookName}),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(function(response) { return response.json(); })
            .then(data => {
                const looksArr = data.looks.sort(function(a, b){
                    if(a.look_name < b.look_name) { return -1; }
                    if(a.look_name > b.look_name) { return 1; }
                    return 0;
                });
                this.setState({
                    looks: looksArr,
                    addingLook: false,
                    newLookInput: '',
                    noLooks: false
                });
            });
    };

    addOutfit = (lookName, prodId) => {
        ReactGA.event({
            category: "Wardrobe",
            action: 'add outfit',
            label: prodId,
        });
        let email = this.state.email;
        fetch(`${window.location.origin}/api/add_outfit`, {
            method: 'post',
            body: JSON.stringify({
                email: email,
                look_name: lookName,
                prod_id: prodId,
                sex: this.props.sex
            }),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(function(response) { return response.json(); })
            .then(data => {
                this.setState({
                    looks: data
                });
            });
    };

    removeOutfit = (lookName, prodId, outfitDate) => {
        ReactGA.event({
            category: "Wardrobe",
            action: 'remove outfit',
            label: prodId,
        });
        let email = this.state.email;
        fetch(`${window.location.origin}/api/remove_outfit`, {
            method: 'post',
            body: JSON.stringify({email: email, look_name: lookName, prod_id: prodId, outfit_date: outfitDate}),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(function(response) { return response.json(); })
            .then(data => {

                const looksArr = data.looks.sort(function(a, b){
                    if(a.look_name < b.look_name) { return -1; }
                    if(a.look_name > b.look_name) { return 1; }
                    return 0;
                });
                const outfitArr = data.wardrobe.reverse();
                const prodHashes = outfitArr.map(outfitDict => {
                    return outfitDict.prod_id
                });

                this.getProducts(prodHashes, prodData => {
                    const prodHashInfoDict = {};
                    prodData.forEach(prodDict => {
                        prodHashInfoDict[prodDict[0]['prod_id']] = {
                            imgUrl: prodDict[0]['image_urls'][0],
                            brand: prodDict[0]['brand'],
                            price: prodDict[0]['price'],
                            currency: prodDict[0]['currency'],
                            name: prodDict[0]['name'],
                            url: prodDict[0]['prod_url'],
                            sale: prodDict[0]['sale'],
                            salePrice: prodDict[0]['saleprice'],
                            shop: prodDict[0]['shop'],
                            imgHash: prodDict[0]['image_hash'][0]
                        };
                    });

                    const outfitImgArr = outfitArr.map(outfitDict => {
                        let resultOutfitDict = outfitDict;
                        resultOutfitDict['info'] = prodHashInfoDict[outfitDict.prod_id];
                        return resultOutfitDict
                    });

                    this.setState({
                        outfits: outfitImgArr,
                        looks: looksArr
                    });
                });
            });
    };

    getProducts = (prodHashes, callback) => {
        fetch(`${window.location.origin}/api/get_products`, {
            method: 'post',
            body: JSON.stringify({
                prod_hashes: prodHashes,
                sex: this.state.sex
            }),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(function(response) { return response.json(); })
            .then(data => {
                callback(data);
            });
    };

    expandLooks = () => {
        if (this.state.showingLooks) {
            this.setState({
                showingLooks: false
            })
        } else {
            this.setState({
                showingLooks: true
            })
        }
    };

    addOutfitComplete = () => {
        this.setState({
            imgHash: null
        });
        window.history.replaceState(null, null, window.location.pathname);

        // Load looks
        fetch(`${window.location.origin}/api/get_looks`, {
            method: 'post',
            body: JSON.stringify({'email': this.state.email}),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(function(response) {
            return response.json();
        }).then(data => {
            if (data.looks === null) {
                this.setState({
                    noLooks: true
                })
            } else {
                const looksArr = data.looks.sort(function(a, b){
                    if(a.look_name < b.look_name) { return -1; }
                    if(a.look_name > b.look_name) { return 1; }
                    return 0;
                });
                const outfitArr = data.wardrobe.reverse();
                const prodHashes = outfitArr.map(outfitDict => {
                    return outfitDict.prod_id
                });

                this.getProducts(prodHashes, prodData => {

                    const prodHashInfoDict = {};
                    prodData.forEach(prodDict => {
                        prodHashInfoDict[prodDict[0]['prod_id']] = {
                            imgUrl: prodDict[0]['image_urls'][0],
                            brand: prodDict[0]['brand'],
                            price: prodDict[0]['price'],
                            currency: prodDict[0]['currency'],
                            name: prodDict[0]['name'],
                            url: prodDict[0]['prod_url'],
                            sale: prodDict[0]['sale'],
                            salePrice: prodDict[0]['saleprice'],
                            shop: prodDict[0]['shop']
                        };
                    });

                    const outfitImgArr = outfitArr.map(outfitDict => {
                        let resultOutfitDict = outfitDict;
                        resultOutfitDict['info'] = prodHashInfoDict[outfitDict.prod_id];
                        return resultOutfitDict
                    });

                    this.setState({
                        outfits: outfitImgArr,
                        looks: looksArr,
                        noLooks: false
                    });
                });
            }
        });
    };

    showAddOutfit = (imgHash) => {
        this.setState({
            imgHash: imgHash
        })
    };

    setResultLength(length) {
        this.setState({
            resultLength: length
        })
    }


    // ######################################## MAIN RENDER FUNCTION ###########################################
    render () {
        let greetingStyle = {
            textAlign: 'center',
            marginTop: isMobile ? '0' : '50px'
        };

        const LookExpander = () => {
            const looksBtnClass = this.state.showingLooks ? 'contract-looks-button' : 'expand-looks-button';
            return (
                <div
                    style={{
                        color: 'black',
                        backgroundColor: 'white',
                        borderRadius: '4px',
                        borderWidth: '2px',
                        borderColor: 'black',
                        borderStyle: 'solid',
                        marginTop: '5px',
                        paddingLeft: '5px',
                        paddingRight: '5px',
                        cursor: 'pointer'
                    }}
                    key='expand-looks'
                    onClick={() => {this.expandLooks()}}
                >
                    <div className={looksBtnClass}></div> LOOKS
                </div>
            )
        };

        let outfitTiles = this.state.outfits.map(outfitDict => {
            const key = `${outfitDict.prod_id}-${outfitDict.outfit_date}`;

            if (this.state.lookFilter === null || this.state.lookFilter === outfitDict.look_name) {
                return (
                    <WardrobeCard
                        key={key}
                        sex={this.state.sex}
                        outfitData={outfitDict}
                        removeOutfit={(look_name, prod_id, outfit_date) => {this.removeOutfit(look_name, prod_id, outfit_date)}}
                    />
                )
            }
        });

        const lookTiles = this.state.looks.map(lookDict => {
            const bgColor = this.state.lookFilter === null || this.state.lookFilter === lookDict.look_name ? 'black' : '#7a7a7a';
            return (
                <div
                    style={{
                        color: 'white',
                        backgroundColor: bgColor,
                        borderRadius: '4px',
                        marginTop: '5px',
                        paddingLeft: '5px',
                        paddingRight: '5px',
                        cursor: 'pointer',
                        position: 'relative'
                    }}
                    key={lookDict.look_name}
                    onClick={() => {this.setLookFilter(lookDict.look_name)}}
                >
                    {lookDict.look_name.toUpperCase()}
                </div>
            )
        });

        let tilesOrNothing = outfitTiles.filter(function(value) { return value !== undefined }).length > 0 ? (
            <div>
                {outfitTiles}
            </div>
        ) : (
            <div>
                <h3>No outfits in this look...</h3>
            </div>
        );

        let tilesOrLoading = this.state.outfits.length > 0 ? (
            tilesOrNothing
        ) : (
            <div>
                {/*<h2>Loading...</h2>*/}
            </div>
        );

        let lookTilesOrLoading = this.state.looks.length > 0 ? (
            <div>
                <LookExpander />
                {(this.state.showingLooks) && (
                    <div>
                        <div
                            style={{
                                color: 'white',
                                backgroundColor: this.state.lookFilter === null ? 'black' : '#7a7a7a',
                                borderRadius: '4px',
                                marginTop: '5px',
                                paddingLeft: '5px',
                                paddingRight: '5px',
                                cursor: 'pointer'
                            }}
                            key='all-looks'
                            onClick={() => {this.setLookFilter(null)}}
                        >ALL</div>
                        {lookTiles}
                        <div
                            style={{
                                color: 'black',
                                backgroundColor: 'white',
                                borderRadius: '4px',
                                borderWidth: '2px',
                                borderColor: 'black',
                                borderStyle: 'solid',
                                marginTop: '5px',
                                paddingLeft: '5px',
                                paddingRight: '5px',
                                cursor: 'pointer'
                            }}
                            key='add-look'
                            onClick={this.showAddLookModal}
                        >
                            <div className='add-look-button'></div> ADD LOOK
                        </div>
                    </div>
                )}
            </div>
        ) : (
            <p>Loading</p>
        );

        const RemoveLookModal = () => {
            return (
                <div style={{
                    position: 'fixed',
                    top: '80px',
                    width: '300px',
                    left: 'calc(50vw - 150px)'
                }}>
                    <Paper
                        zDepth={1}
                        style={{
                            paddingTop: '10px',
                            paddingBottom: '10px'
                        }}
                    >
                        <h3>Delete {this.state.removeLookInput.toUpperCase()}?</h3>
                        <div
                            style={{
                                color: 'black',
                                backgroundColor: 'white',
                                borderRadius: '4px',
                                borderWidth: '2px',
                                borderColor: 'black',
                                borderStyle: 'solid',
                                marginTop: '5px',
                                paddingLeft: '5px',
                                paddingRight: '5px',
                                cursor: 'pointer',
                                marginBottom: '10px',
                                marginRight: '60px',
                                marginLeft: '60px'
                            }}
                            onClick={() => {this.removeLook(this.state.removeLookInput)}}
                        >Delete</div>
                        <div
                            style={{
                                color: 'black',
                                backgroundColor: 'white',
                                borderRadius: '4px',
                                borderWidth: '2px',
                                borderColor: 'black',
                                borderStyle: 'solid',
                                marginTop: '5px',
                                paddingLeft: '5px',
                                paddingRight: '5px',
                                cursor: 'pointer',
                                marginBottom: '10px',
                                marginRight: '60px',
                                marginLeft: '60px'
                            }}
                            onClick={() => {this.showRemoveLookModal(null)}}
                        >Cancel</div>
                    </Paper>
                </div>
            )
        };

        const RenameLookModal = () => {
            return (
                <div style={{
                    position: 'fixed',
                    top: '80px',
                    width: '300px',
                    left: 'calc(50vw - 150px)'
                }}>
                    <Paper
                        zDepth={1}
                        style={{
                            paddingTop: '10px',
                            paddingBottom: '10px'
                        }}
                    >
                        <h3>Rename {this.state.lookFilter.toUpperCase()}</h3>
                        <label>
                            New look name:
                            <input
                                autoFocus
                                type="text"
                                name="newLookInput"
                                value={this.state.newLookInput}
                                onChange={this.handleInputChange}
                            />
                        </label>
                        <div
                            style={{
                                color: 'black',
                                backgroundColor: 'white',
                                borderRadius: '4px',
                                borderWidth: '2px',
                                borderColor: 'black',
                                borderStyle: 'solid',
                                marginTop: '5px',
                                paddingLeft: '5px',
                                paddingRight: '5px',
                                cursor: 'pointer',
                                marginBottom: '10px',
                                marginRight: '60px',
                                marginLeft: '60px'
                            }}
                            onClick={() => {this.renameLook(this.state.lookFilter)}}
                        >Rename</div>
                        <div
                            style={{
                                color: 'black',
                                backgroundColor: 'white',
                                borderRadius: '4px',
                                borderWidth: '2px',
                                borderColor: 'black',
                                borderStyle: 'solid',
                                marginTop: '5px',
                                paddingLeft: '5px',
                                paddingRight: '5px',
                                cursor: 'pointer',
                                marginBottom: '10px',
                                marginRight: '60px',
                                marginLeft: '60px'
                            }}
                            onClick={() => {
                                this.setState({
                                    showRenameModal: false
                                })
                            }}
                        >Cancel</div>
                    </Paper>
                </div>
            )
        };

        // #################### MAIN RENDER RETURN #######################
        return (
            <MuiThemeProvider>
                <div className="profile-product-list">
                    {(this.state.imgHash !== null) && (
                        <div
                            style={{
                                width: '100vw',
                                backgroundColor: 'white',
                                height: 'calc(100vh)',
                                top: '0px',
                                position: 'relative'
                            }}
                        >
                            <AddOutfit
                                sex={this.state.sex}
                                imgHash={this.state.imgHash}
                                email={this.props.email}
                                addOutfitComplete={this.addOutfitComplete}
                            />
                        </div>
                    )}
                    {isMobile && (
                        <br />
                    )}
                    <h2 style={greetingStyle}>{this.state.username}'s wardrobe</h2>
                    {!isMobile && (
                        <br />
                    )}
                    {this.state.lookFilter && (
                        <h1>{this.state.lookFilter.toUpperCase()}</h1>
                    )}
                    {this.state.lookFilter && (
                        <div>
                            <div
                                style={{
                                    display: 'inline-block',
                                    cursor: 'pointer'
                                }}
                                onClick={() => {
                                    this.setState({
                                        showRenameModal: true
                                    })
                                }}
                            >
                                rename
                            </div> | <div
                                style={{
                                    display: 'inline-block',
                                    cursor: 'pointer'
                                }}
                                onClick={() => {this.showRemoveLookModal(this.state.lookFilter)}}
                            >
                                delete
                            </div>

                        </div>
                    )}
                    <br />
                    {(this.state.noLooks === true) && (
                        <div style={{width: '100%', textAlign: 'center'}}>
                            <h3>There are no outfits in your wardrobe</h3>
                            <h4>Add new outfits from image and text search results</h4>
                        </div>
                    )}
                    <div className="result-pane">
                        {tilesOrLoading}
                    </div>
                    <div className="look-pane" style={{
                        top: '50px',
                        left: '10px',
                        position: 'fixed',
                        zIndex: '10'
                    }}>
                        {(this.state.looks.length > 0) && (
                            lookTilesOrLoading
                        )}
                    </div>
                    {(this.state.looks.length > 0) && (
                        <div>
                            <br />
                            <br />
                            <h3>Recommended</h3>
                            <RecommendFromTags
                                email={this.state.email}
                                sex={this.state.sex}
                                lookFilter={this.state.lookFilter}
                                showAddOutfit={(imgHash) => {this.showAddOutfit(imgHash)}}
                                isAuth={this.props.isAuth}
                                setResultLength={(ln) => {this.setResultLength(ln)}}
                            />
                        </div>
                    )}

                    <div>
                        {(this.state.addingLook) && (
                            <div style={{
                                position: 'fixed',
                                top: '70px',
                                width: '300px',
                                left: 'calc(50vw - 150px)'
                            }}>
                                <Paper zDepth={1} style={{paddingTop: '10px'}}>
                                    <h3>Add Look</h3>
                                    <form onSubmit={this.addLook}>
                                        <label>
                                            Input look name:
                                            <input autoFocus type="text" name="newLookInput" value={this.state.newLookInput} onChange={this.handleInputChange} />
                                        </label>
                                        <input style={{
                                            color: 'black',
                                            backgroundColor: 'white',
                                            borderRadius: '4px',
                                            borderWidth: '2px',
                                            borderColor: 'black',
                                            borderStyle: 'solid',
                                            marginTop: '5px',
                                            paddingLeft: '5px',
                                            paddingRight: '5px',
                                            cursor: 'pointer',
                                            marginBottom: '10px'
                                        }} type="submit" value="Add Look" />
                                    </form>
                                </Paper>
                            </div>
                        )}
                        {(this.state.removeLookInput !== null) && (
                            <RemoveLookModal />
                        )}
                        {this.state.showRenameModal === true && (
                            <RenameLookModal />
                        )}
                    </div>
                </div>
            </MuiThemeProvider>
        )
    }
}

export default Wardrobe;
