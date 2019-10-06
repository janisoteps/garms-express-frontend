// Wardrobe.jsx
import React from "react";
require('../../../css/garms.css');
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper';
import AddOutfit from './AddOutfit';
import RecommendFromTags from './../recommend/RecommendFromTags';
import {Route} from 'react-router-dom';


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
            removeShow: null,
            lookFilter: null,
            showingLooks: true,
            noLooks: false,
            imgHash: null
        };

        this.removeLook = this.removeLook.bind(this);
        this.addLook = this.addLook.bind(this);
        this.addOutfit = this.addOutfit.bind(this);
        this.removeOutfit = this.removeOutfit.bind(this);
        this.getProducts = this.getProducts.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.showAddLookModal = this.showAddLookModal.bind(this);
        this.setLookFilter = this.setLookFilter.bind(this);
        this.showRemove = this.showRemove.bind(this);
        this.showRemoveLookModal = this.showRemoveLookModal.bind(this);
        this.expandLooks = this.expandLooks.bind(this);
        this.addOutfitComplete = this.addOutfitComplete.bind(this);
        this.showAddOutfit = this.showAddOutfit.bind(this);
    }

    componentDidMount() {
        // Handle registration redirect from RegisterFromResult
        const queryString = window.location.search;
        if(queryString.length > 0) {
            const imgHash = window.location.search.split('id=')[1];
            this.setState({
                imgHash: imgHash
            });
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
                        prodHashInfoDict[prodDict[0]['prod_hash']] = {
                            imgUrl: prodDict[0]['img_url'],
                            brand: prodDict[0]['brand'],
                            price: prodDict[0]['price'],
                            currency: prodDict[0]['currency'],
                            name: prodDict[0]['name'],
                            url: prodDict[0]['prod_url'],
                            sale: prodDict[0]['sale'],
                            salePrice: prodDict[0]['saleprice'],
                            shop: prodDict[0]['shop'],
                            imgHash: prodDict[0]['img_hashes'][0]
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
            }
        });
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
        this.setState({
            lookFilter: lookName
        })
    };

    removeLook = (lookName) => {
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

                this.setState({
                    removeLookInput: null,
                    lookFilter: null,
                    looks: looksArr
                });
            });
    };

    showRemoveLookModal = (lookName) => {
        this.setState({
            removeLookInput: lookName,
            lookFilter: null
        })
    };

    addLook = (e) => {
        e.preventDefault();
        let email = this.state.email;
        let lookName = this.state.newLookInput;
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
        let email = this.state.email;
        fetch(`${window.location.origin}/api/add_outfit`, {
            method: 'post',
            body: JSON.stringify({email: email, look_name: lookName, prod_id: prodId}),
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
                        prodHashInfoDict[prodDict[0]['prod_hash']] = {
                            imgUrl: prodDict[0]['img_url'],
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
                        looks: looksArr
                    });
                });
            });
    };

    getProducts = (prodHashes, callback) => {
        fetch(`${window.location.origin}/api/get_products`, {
            method: 'post',
            body: JSON.stringify({prod_hashes: prodHashes}),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(function(response) { return response.json(); })
            .then(data => {
                callback(data);
            });
    };

    showRemove = (lookName) => {
        this.setState({
            removeShow: lookName
        })
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
                        prodHashInfoDict[prodDict[0]['prod_hash']] = {
                            imgUrl: prodDict[0]['img_url'],
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


    // ######################################## MAIN RENDER FUNCTION ###########################################
    render () {
        let greetingStyle = {
            textAlign: 'center',
            marginTop: '95px'
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
            const priceStyle = outfitDict.info.sale ? {
                textDecoration: 'line-through'
            } : {
                textDecoration: 'none'
            };
            if (this.state.lookFilter === null || this.state.lookFilter === outfitDict.look_name) {
                return (
                    <Paper zDepth={1} className="profile-product-tile" key={key}>
                        <div
                            className="product-name"
                            style={{
                                marginLeft: '5px',
                                marginRight: '5px'
                            }}
                        >
                            <h3>{outfitDict.look_name.toUpperCase()}</h3>
                        </div>
                        <a href={outfitDict.info.url} target="_blank">
                            <div className="product-name"><h4>{outfitDict.info.name}</h4></div>
                        </a>
                        <div style={priceStyle}><h5>{outfitDict.info.currency}{outfitDict.info.price}</h5></div>
                        {(outfitDict.info.sale) && (<div style={{color: '#d6181e'}}>
                            <h5>{outfitDict.info.currency}{outfitDict.info.salePrice}</h5>
                        </div>)}

                        <Route render={({history}) => (
                            <img
                                className="product-image" src={outfitDict.info.imgUrl}
                                style={{
                                    marginBottom: '30px',
                                    cursor: 'pointer'
                                }}
                                onClick={() => {
                                    history.push(`/outfit-page?id=${outfitDict.prod_id}`)
                                }}
                            />
                        )}/>

                        <Route render={({history}) => (
                            <div
                                className="search-similar-recommend"
                                onClick={() => {
                                    history.push(`/search-from-id?id=${outfitDict.info.imgHash}`)
                                }}
                            />
                        )}/>

                        <a
                            href={outfitDict.info.url}
                            target="_blank"
                        >
                            <h5>{outfitDict.info.brand} from {outfitDict.info.shop}</h5>
                            <h5>Open in shop</h5>
                        </a>
                        <div
                            className="profile-product-delete"
                            onClick={() => {
                                this.removeOutfit(outfitDict.look_name, outfitDict.prod_id, outfitDict.outfit_date)
                            }}
                        />
                    </Paper>
                )
            }
        });

        const lookTiles = this.state.looks.map(lookDict => {
            const bgColor = this.state.lookFilter === null || this.state.lookFilter === lookDict.look_name ? 'black' : '#7a7a7a';
            return (
                <div
                    onMouseEnter={() => {this.showRemove(lookDict.look_name)}}
                    onMouseLeave={() => {this.showRemove(null)}}
                    style={{
                        color: 'white',
                        backgroundColor: bgColor,
                        borderRadius: '4px',
                        marginTop: '5px',
                        paddingLeft: '5px',
                        paddingRight: '5px',
                        cursor: 'pointer'
                    }}
                    key={lookDict.look_name}
                    onClick={() => {this.setLookFilter(lookDict.look_name)}}
                >
                    {(this.state.removeShow === lookDict.look_name) && (
                        <div
                            className='remove-look-button'
                            onClick={() => {this.showRemoveLookModal(lookDict.look_name)}}
                        />
                    )}{lookDict.look_name.toUpperCase()}
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
                    top: '70px',
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
                        <h3>Remove {this.state.removeLookInput.charAt(0).toUpperCase() + this.state.removeLookInput.slice(1)}?</h3>
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
                        >Remove</div>
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


        // #################### MAIN RENDER RETURN #######################
        return (
            <MuiThemeProvider>
                <div className="profile-product-list">
                    <h1 style={greetingStyle}>{this.state.username}'s wardrobe</h1>
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
                        top: '70px',
                        left: '10px',
                        position: 'fixed',
                        zIndex: '10'
                    }}>
                        {(this.state.looks.length > 0) && (
                            lookTilesOrLoading
                        )}
                    </div>
                    {(this.state.looks.length > 0) && (
                        <RecommendFromTags
                            email={this.state.email}
                            sex={this.state.sex}
                            lookFilter={this.state.lookFilter}
                            showAddOutfit={(imgHash) => {this.showAddOutfit(imgHash)}}
                        />
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
                    </div>

                    {(this.state.imgHash !== null) && (
                        <div
                            style={{
                                width: '100vw',
                                backgroundColor: 'white',
                                height: 'calc(100vh)',
                                top: '0px',
                                position: 'fixed'
                            }}
                        >
                            <AddOutfit
                                imgHash={this.state.imgHash}
                                email={this.props.email}
                                addOutfitComplete={this.addOutfitComplete}
                            />
                        </div>
                    )}
                </div>
            </MuiThemeProvider>
        )
    }
}

export default Wardrobe;
