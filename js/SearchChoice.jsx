import React from "react";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Route } from 'react-router-dom';
import SearchChoiceIntro from './components/intro/SearchChoiceIntro';
import RecommendFromTags from './components/recommend/RecommendFromTags';
import RecommendRandom from './components/recommend/RecommendRandom';
import AddOutfit from './components/wardrobe/AddOutfit';


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
    }

    componentDidUpdate(prevProps){
        if(prevProps.firstLogin !== this.props.firstLogin){
            this.setState({
                firstLogin: this.props.firstLogin
            });
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

    render () {
        return (
            <MuiThemeProvider>
                <div>
                    <div className="search-choice">
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

                        <Route render={({ history }) => (
                            <div
                                className="search-choice-button-image"
                                onClick={() => { history.push('/search-from-image') }}>
                                <div className="search-choice-title">
                                    <div className="image-search-icon"></div>
                                    <div className="search-choice-text">Search from photo</div>
                                </div>
                            </div>
                        )} />

                        {/*<Route render={({ history }) => (*/}
                            {/*<div*/}
                                {/*className="search-choice-button-explore"*/}
                                {/*onClick={() => { history.push('/explorer') }}>*/}
                                {/*<div className="search-choice-title">*/}
                                    {/*<div className="search-glass-icon"></div>*/}
                                    {/*<div className="search-choice-text">Or explore...</div>*/}
                                {/*</div>*/}
                            {/*</div>*/}
                        {/*)} />*/}
                        {(this.state.isAuth === "true") ? (
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
                                <RecommendRandom
                                    sex={this.state.sex}
                                    showAddOutfit={(imgHash) => {this.showAddOutfit(imgHash)}}
                                />
                            </div>
                        )}


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

                    {(this.state.firstLogin === '1') && (<SearchChoiceIntro
                        username={this.props.username}
                    />)}
                </div>
            </MuiThemeProvider>
        )
    }
}

export default SearchChoice;
