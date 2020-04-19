// RecommendRandom.jsx
import React from "react";
require('../../../css/garms.css');
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
// import Paper from 'material-ui/Paper';
// import {Route} from 'react-router-dom';
// import Tooltip from '@material-ui/core/Tooltip';
// import ReactGA from "react-ga";
import InfiniteSpinner from "../loading/InfiniteSpinner";
import RecommendCard from "./RecommendCard";
import {withCookies, Cookies} from 'react-cookie';

class RecommendRandom extends React.Component  {
    constructor(props) {
        super(props);
        this.state = {
            sex: this.props.sex,
            outfits: [],
            loadedProdIds: [],
            infiniteCount: 0,
            infiniteLoading: false,
            infiniteLoadingComplete: false,
            onboardingFaves: []
        };

        this.showAddOutfit = this.showAddOutfit.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.getRecommendations = this.getRecommendations.bind(this);
        this.getRecommendationsFromFaves = this.getRecommendationsFromFaves.bind(this);
    }

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll, { passive: true });
        this._ismounted = true;
        this.setState({
            sex: this.props.sex
        });
        const {cookies} = this.props;
        const onboardingFaves = cookies.get('onboarding_faves') ? cookies.get('onboarding_faves') : [];

        if(this.props.onboardingFaves.length > 0) {
            this.getRecommendationsFromFaves()
        } else if(onboardingFaves.length > 0) {
            this.setState({
                onboardingFaves: onboardingFaves
            }, () => {
                this.getRecommendationsFromFaves()
            })
        } else {
            fetch(`${window.location.origin}/api/recommend_random`, {
                method: 'post',
                body: JSON.stringify({
                    'sex': this.props.sex,
                    'prev_prod_ids': []
                }),
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                }
            }).then(function(response) {
                return response.json();
            }).then(data => {
                let loadedProdIds = [];
                data.forEach(lookDict => {
                    lookDict.prod_suggestions.forEach(suggestion => {
                        loadedProdIds.push(suggestion[0].prod_id)
                    })
                });
                if (this._ismounted) {
                    this.setState({
                        outfits: data,
                        loadedProdIds: loadedProdIds
                    });
                }
            });
        }
    }

    componentWillUnmount() {
        this._ismounted = false;
        window.removeEventListener('scroll', this.handleScroll);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (
            this.props.lookFilter === nextProps.lookFilter
            && this.state.outfits.length === nextState.outfits.length
            && this.state.infiniteLoading === nextState.infiniteLoading
            && this.state.infiniteLoadingComplete === nextState.infiniteLoadingComplete
            && this.props.sex === nextProps.sex
            && this.props.onboardingFaves === nextProps.onboardingFaves
        ) {
            return false;
        } else {
            return true;
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.sex !== prevProps.sex) {
            this.getRecommendations();
        }
    }

    handleScroll(event) {
        const docHeight = document.body.scrollHeight;
        const scrollDistance = window.pageYOffset + document.body.clientHeight;

        if (scrollDistance > (docHeight - docHeight * (0.4 ** (this.state.infiniteCount + 1)))) {
            if(this.state.infiniteLoading === false) {
                this.setState({
                    infiniteLoading: true
                });
                if(this.props.onboardingFaves.length > 0) {
                    this.getRecommendationsFromFaves();
                } else {
                    this.getRecommendations();
                }
            }
        }
    }

    getRecommendationsFromFaves() {
        const reqBody = {
            'sex': this.props.sex,
            'prev_prod_ids': this.state.loadedProdIds,
            'fave_outfits': this.props.onboardingFaves.length > 0 ? this.props.onboardingFaves : this.state.onboardingFaves
        };
        fetch(`${window.location.origin}/api/recommend_from_onboarding`, {
            method: 'post',
            body: JSON.stringify(reqBody),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(function(response) {
            return response.json();
        }).then(data => {
            if (data.length > 0) {
                let loadedProdIds = [];
                data.forEach(lookDict => {
                    lookDict.prod_suggestions.forEach(suggestion => {
                        loadedProdIds.push(suggestion[0].prod_id)
                    })
                });
                if(this._ismounted) {
                    this.setState({
                        outfits: this.state.outfits.concat(data),
                        infiniteCount: this.state.infiniteCount + 1,
                        loadedProdIds: this.state.loadedProdIds.concat(loadedProdIds),
                        infiniteLoading: false
                    });
                }
            } else {
                this.setState({
                    infiniteLoadingComplete: true
                });
            }
        });
    }

    getRecommendations() {
        const reqBody = {
            'sex': this.props.sex,
            'prev_prod_ids': this.state.loadedProdIds
        };
        fetch(`${window.location.origin}/api/recommend_random`, {
            method: 'post',
            body: JSON.stringify(reqBody),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(function(response) {
            return response.json();
        }).then(data => {
            if (data.length > 0) {
                let loadedProdIds = [];
                data.forEach(lookDict => {
                    lookDict.prod_suggestions.forEach(suggestion => {
                        loadedProdIds.push(suggestion[0].prod_id)
                    })
                });
                if(this._ismounted) {
                    this.setState({
                        outfits: this.state.outfits.concat(data),
                        infiniteCount: this.state.infiniteCount + 1,
                        loadedProdIds: this.state.loadedProdIds.concat(loadedProdIds),
                        infiniteLoading: false
                    });
                }
            } else {
                this.setState({
                    infiniteLoadingComplete: true
                });
            }
        });
    }

    showAddOutfit(imgHash) {
        this.props.showAddOutfit(imgHash);
    }

    render() {
        const outfitTiles = this.state.outfits.map(lookDict => {
            const suggestionArr = lookDict.prod_suggestions;

            return suggestionArr.map(prodSuggestionArr => {
                const prodSuggestion = prodSuggestionArr[0];

                return (
                    <RecommendCard
                        key={prodSuggestion.prod_id}
                        prodData={prodSuggestion}
                        lookName={'all'}
                        showAddOutfit={(imgHash) => {this.showAddOutfit(imgHash)}}
                        isAuth={this.state.isAuth}
                        gaCat={'Recommend From Random'}
                    />
                )
            })
        });
        const tilesOrLoading = (
            <div>
                {(this.state.outfits.length > 0) ? (
                    <div>
                        <br />
                        <br />
                        <br />
                        {outfitTiles}
                    </div>
                ) : (
                    <div
                        style={{
                            paddingTop: '100px'
                        }}
                    >
                        <br />
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

        return (
            <div>
                <MuiThemeProvider>
                    <div>
                        {tilesOrLoading}

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
                    </div>
                </MuiThemeProvider>
            </div>
        )
    }
}

export default withCookies(RecommendRandom);
