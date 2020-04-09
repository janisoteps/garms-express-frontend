// ResultsFromSearch.jsx
import React from "react";
require('../../../../css/garms.css');
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { withStyles } from '@material-ui/core/styles';
import AddOutfit from '../../wardrobe/AddOutfit';
import {isMobile} from "react-device-detect";
import ResultCard from './ResultCard';


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
            sex: this.props.sex,
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

    shouldComponentUpdate(nextProps, nextState) {
        if (
            this.props.results.length === nextProps.results.length
            && this.state.addOutfitInput === nextState.addOutfitInput
            && this.state.posNegButtonTag === nextState.posNegButtonTag
        ) {
            return false;
        } else {
            return true;
        }
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
        });
        this.props.changeOutfitShown(true);
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
        });
        this.props.changeOutfitShown(false);
    };

    buyNow = (prodUrl) => {
        const win = window.open(prodUrl, '_blank');
        win.focus();
    };

    setPosNegButtonTag = (tag) => {
        this.setState({
            posNegButtonTag: tag
        })
    };

    //################################## MAIN RENDER FUNCTION ##################################
    render () {

        let PosNegButton = () => {
            if (this.state.posNegButtonTag.length > 0) {
                let posNegButtonStyle = {
                    position: 'fixed',
                    width: '100vw',
                    height: 'calc(100vh - 50px)',
                    top: '50px',
                    left: '0',
                    zIndex: '10'
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
                            onClick={() => {
                                this.setTags(this.state.posNegButtonTag, 'positive', 'add')
                            }}
                        >
                            <h1>more {this.state.posNegButtonTag}</h1>
                        </div>
                        <div
                            style={negButtonStyle}
                            onClick={() => {
                                this.setTags(this.state.posNegButtonTag, 'negative', 'add')
                            }}
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

        const desktopTiles = this.props.results.map(productData => {
            return (
                <ResultCard
                    key={productData['prod_serial'].prod_id + Math.floor(Math.random() * 1000)}
                    productData={productData}
                    setColorPosTags={selection => {this.setColorPosTags(selection)}}
                    searchSimilarImages={(imgHash, color_1) => {this.searchSimilarImages(imgHash, color_1)}}
                    isAuth={this.props.isAuth}
                    showLookList={img_hash => {this.showLookList(img_hash)}}
                    addBrandFilter={(brand, showPicker) => {this.props.addBrandFilter(brand, showPicker)}}
                    device='desktop'
                    setPosNegButtonTag={(tag) => {this.setPosNegButtonTag(tag)}}
                />
            )
        });

        const mobileTiles = this.props.results.map(productData => {
            return(
                <ResultCard
                    key={productData['prod_serial'].prod_id + Math.floor(Math.random() * 1000)}
                    productData={productData}
                    setColorPosTags={selection => {this.setColorPosTags(selection)}}
                    searchSimilarImages={(imgHash, color_1) => {this.searchSimilarImages(imgHash, color_1)}}
                    isAuth={this.props.isAuth}
                    showLookList={img_hash => {this.showLookList(img_hash)}}
                    addBrandFilter={(brand, showPicker) => {this.props.addBrandFilter(brand, showPicker)}}
                    device='mobile'
                    setPosNegButtonTag={(tag) => {this.setPosNegButtonTag(tag)}}
                />
            )
        });

        // ================  MAIN RENDER FUNCTION  =================
        return (
            <MuiThemeProvider>
                <div>
                    {(this.state.addOutfitInput !== null) && (
                        <div>
                            <AddOutfit
                                sex={this.state.sex}
                                imgHash={this.state.addOutfitInput}
                                email={this.props.email}
                                addOutfitComplete={this.addOutfitComplete}
                            />
                            <br />
                            <br />
                            <br />
                            <br />
                        </div>
                    )}
                    {isMobile && (
                        <div className="result-pane">
                            {mobileTiles}
                        </div>
                    )}
                    {!isMobile && (
                        <div className="result-pane">
                            {desktopTiles}
                        </div>
                    )}
                    <PosNegButton />
                </div>
            </MuiThemeProvider>
        );
    }
}

export default withStyles(styles)(ResultsFromSearch);
