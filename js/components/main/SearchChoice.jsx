import React from "react";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Route } from 'react-router-dom';
import RecommendFromTags from '../recommend/RecommendFromTags';
import RecommendRandom from '../recommend/RecommendRandom';
import AddOutfit from '../wardrobe/AddOutfit';
import FlatButton from "material-ui/FlatButton";
import Loyalty from "material-ui/svg-icons/action/loyalty";
import ReactGA from 'react-ga';
import TextField from "material-ui/TextField";
import {isMobile} from "react-device-detect";


class SearchChoice extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            firstLogin: this.props.firstLogin,
            lookFilter: null,
            imgHash: null,
            email: this.props.email,
            sex: this.props.sex,
            isAuth: this.props.isAuth,
            searchString: ''
        };

        this.showAddOutfit = this.showAddOutfit.bind(this);
        this.addOutfitComplete = this.addOutfitComplete.bind(this);
        this.changeSex = this.changeSex.bind(this);
        this.handleTextInputChange = this.handleTextInputChange.bind(this);
        this.doTextSearch = this.doTextSearch.bind(this);
    }

    componentWillMount() {
        this._ismounted = true;
        window.scrollTo(0, 0);
    }

    componentDidMount() {
        this._ismounted = true;
        if (this.props.firstLogin === '1') {
            this._ismounted = false;
            window.location.pathname = '/intro'
        }
        ReactGA.pageview(window.location.pathname + window.location.search);
    }

    componentWillUnmount() {
        this._ismounted = false;
    }

    componentDidUpdate(prevProps){
        if (this._ismounted) {
            if(prevProps.firstLogin !== this.props.firstLogin){
                this.setState({
                    firstLogin: this.props.firstLogin
                });
            }
        }
    }

    handleTextInputChange(event) {
        const value =  event.target.value;
        const name = event.target.name;
        this.setState({
            [name]: value
        });
    }

    onEnterPress = (e) => {
        if(e.keyCode === 13 && e.shiftKey === false) {
            e.preventDefault();
            this.doTextSearch();
        }
    };

    doTextSearch() {
        const searchStringURI = encodeURIComponent(this.state.searchString.toLowerCase());
        this.props.history.push(`/textsearch?search=${searchStringURI}&sex=${this.state.sex}`);
    }

    showAddOutfit = (imgHash) => {
        this.setState({
            imgHash: imgHash
        })
    };

    addOutfitComplete = () => {
        this.setState({
            imgHash: null
        });
        window.history.replaceState(null, null, window.location.pathname);
    };

    changeSex(sex){
        ReactGA.event({
            category: "Home Page",
            action: 'change sex',
            label: sex
        });
        this.setState({
            sex: sex
        });
        this.props.changeSex(sex);
    }

    render () {
        return (
            <MuiThemeProvider>
                <div>
                    <div className="search-choice">

                        {!this.state.sex ? (
                            <div style={{
                                width: '100vw',
                                textAlign: 'center',
                                position: 'fixed',
                                top: '50px',
                                left: '0',
                                paddingTop: '100px',
                                backgroundColor: '#FFFFFF',
                                height: 'calc(100vh - 50px)'
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
                        ) : (
                            <div>
                                {(this.state.imgHash !== null) ? (
                                    <div
                                        style={{
                                            width: '100vw',
                                            backgroundColor: 'white',
                                            height: 'calc(100vh)',
                                            top: '0px',
                                            position: 'relative',
                                            zIndex: '100'
                                        }}
                                    >
                                        <AddOutfit
                                            sex={this.state.sex}
                                            imgHash={this.state.imgHash}
                                            email={this.props.email}
                                            addOutfitComplete={this.addOutfitComplete}
                                        />
                                    </div>
                                ) : (
                                    <div>
                                        <div
                                            style={{
                                                display: 'grid',
                                                gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 2fr)',
                                                gridTemplateRows: isMobile ? 'repeat(2, 1fr)' : '1fr',
                                                gridColumnGap: '0px',
                                                gridRowGap: '0px'
                                            }}
                                        >
                                            <div
                                                style={{
                                                    gridArea: '1 / 1 / 2 / 2',
                                                    paddingRight: isMobile ? '0px' : '50px'
                                                }}
                                            >
                                                <Route render={({ history }) => (
                                                    <div
                                                        className="search-choice-button-image"
                                                        onClick={() => {
                                                            ReactGA.event({
                                                                category: "Home Page",
                                                                action: 'navigate',
                                                                label: 'search from image'
                                                            });
                                                            history.push('/search-from-image');
                                                        }}>
                                                        <div className="search-choice-title">
                                                            <div className="image-search-icon"></div>
                                                            <div className="search-choice-text">Search by photo</div>
                                                        </div>
                                                    </div>
                                                )} />
                                            </div>
                                            <div
                                                style={{
                                                    gridArea: isMobile ? '2 / 1 / 3 / 2' : '1 / 2 / 2 / 3',
                                                    textAlign: isMobile ? 'center' : 'left',
                                                    paddingLeft: isMobile ? '0px' : '100px'
                                                }}
                                            >
                                                <div className="inner-text-search-box">
                                                    <TextField
                                                        autoFocus="autofocus"
                                                        className="text-search-input"
                                                        // hintText={this.state.searchString ? this.state.searchString : "Purple denim jeans or..."}
                                                        value={this.state.searchString.toUpperCase()}
                                                        inputStyle={{
                                                            fontWeight: '900',
                                                            fontSize: '1.2rem'
                                                        }}
                                                        floatingLabelText="What are you looking for?"
                                                        floatingLabelStyle={{
                                                            color: 'black',
                                                            fontSize: '1.2rem',
                                                            fontWeight: '400',
                                                        }}
                                                        name="searchString"
                                                        onChange={this.handleTextInputChange.bind(this)}
                                                        onKeyDown={this.onEnterPress}
                                                        underlineFocusStyle={{
                                                            borderBottom: '2px solid rgb(0, 0, 0)'
                                                        }}
                                                        underlineDisabledStyle={{
                                                            borderBottom: '0px solid rgb(0, 0, 0)'
                                                        }}
                                                        autoComplete="off"
                                                    />
                                                    <div className="text-search-button" onClick={() => {this.doTextSearch()}}>
                                                        <div className="search-icon" />
                                                        {/*<div className="search-text"> search</div>*/}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>




                                        {/*<Route render={({ history }) => (*/}
                                        {/*    <div*/}
                                        {/*        className="search-choice-button-image"*/}
                                        {/*        onClick={() => {*/}
                                        {/*            ReactGA.event({*/}
                                        {/*                category: "Home Page",*/}
                                        {/*                action: 'navigate',*/}
                                        {/*                label: 'search from image'*/}
                                        {/*            });*/}
                                        {/*            history.push('/search-from-image');*/}
                                        {/*        }}>*/}
                                        {/*        <div className="search-choice-title">*/}
                                        {/*            <div className="image-search-icon"></div>*/}
                                        {/*            <div className="search-choice-text">Search by photo</div>*/}
                                        {/*        </div>*/}
                                        {/*    </div>*/}
                                        {/*)} />*/}

                                        {/*<div className="inner-text-search-box">*/}
                                        {/*    <TextField*/}
                                        {/*        autoFocus="autofocus"*/}
                                        {/*        className="text-search-input"*/}
                                        {/*        // hintText={this.state.searchString ? this.state.searchString : "Purple denim jeans or..."}*/}
                                        {/*        value={this.state.searchString.toUpperCase()}*/}
                                        {/*        inputStyle={{*/}
                                        {/*            fontWeight: '900',*/}
                                        {/*            fontSize: '1.2rem'*/}
                                        {/*        }}*/}
                                        {/*        floatingLabelText="What are you looking for?"*/}
                                        {/*        floatingLabelStyle={{*/}
                                        {/*            color: 'black',*/}
                                        {/*            fontSize: '1.2rem',*/}
                                        {/*            fontWeight: '400',*/}
                                        {/*        }}*/}
                                        {/*        name="searchString"*/}
                                        {/*        onChange={this.handleTextInputChange.bind(this)}*/}
                                        {/*        onKeyDown={this.onEnterPress}*/}
                                        {/*        underlineFocusStyle={{*/}
                                        {/*            borderBottom: '2px solid rgb(0, 0, 0)'*/}
                                        {/*        }}*/}
                                        {/*        underlineDisabledStyle={{*/}
                                        {/*            borderBottom: '0px solid rgb(0, 0, 0)'*/}
                                        {/*        }}*/}
                                        {/*        autoComplete="off"*/}
                                        {/*    />*/}
                                        {/*    <div className="text-search-button" onClick={() => {this.doTextSearch()}}>*/}
                                        {/*        <div className="search-icon" />*/}
                                        {/*        /!*<div className="search-text"> search</div>*!/*/}
                                        {/*    </div>*/}
                                        {/*</div>*/}

                                        {(this.state.isAuth === "true" && this._ismounted) ? (
                                            <div
                                                style={{
                                                    marginTop: '-75px'
                                                }}
                                            >
                                                <RecommendFromTags
                                                    email={this.state.email}
                                                    sex={this.state.sex}
                                                    lookFilter={this.state.lookFilter}
                                                    showAddOutfit={(imgHash) => {this.showAddOutfit(imgHash)}}
                                                />
                                            </div>
                                        ) : (
                                            <div
                                                style={{
                                                    marginTop: '-75px'
                                                }}
                                            >
                                                {this._ismounted && (
                                                    <RecommendRandom
                                                        sex={this.state.sex}
                                                        showAddOutfit={(imgHash) => {this.showAddOutfit(imgHash)}}
                                                    />
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </MuiThemeProvider>
        )
    }
}

export default SearchChoice;
