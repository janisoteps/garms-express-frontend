import React from "react";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Route } from 'react-router-dom';
import RecommendFromTags from './components/recommend/RecommendFromTags';
import RecommendRandom from './components/recommend/RecommendRandom';
import AddOutfit from './components/wardrobe/AddOutfit';
import FlatButton from "material-ui/FlatButton";
import Loyalty from "material-ui/svg-icons/action/loyalty";


class SearchChoice extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            firstLogin: this.props.firstLogin,
            lookFilter: null,
            imgHash: null,
            email: this.props.email,
            sex: this.props.sex,
            isAuth: this.props.isAuth
        };

        this.showAddOutfit = this.showAddOutfit.bind(this);
        this.addOutfitComplete = this.addOutfitComplete.bind(this);
        this.changeSex = this.changeSex.bind(this);
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
                                        <Route render={({ history }) => (
                                            <div
                                                className="search-choice-button-image"
                                                onClick={() => { history.push('/search-from-image') }}>
                                                <div className="search-choice-title">
                                                    <div className="image-search-icon"></div>
                                                    <div className="search-choice-text">Search by photo</div>
                                                </div>
                                            </div>
                                        )} />

                                        <Route render={({ history }) => (
                                            <div
                                                className="search-choice-button-type"
                                                onClick={() => { history.push('/textsearch') }}>
                                                <div className="search-choice-title">
                                                    <div className="text-search-icon"></div>
                                                    <div className="search-choice-text">Type your search</div>
                                                </div>
                                            </div>
                                        )} />

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
