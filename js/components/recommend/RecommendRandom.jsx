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
                        <svg
                            version="1.0"
                            width="128px"
                            height="128px"
                            viewBox="0 0 128 128"
                            smiling="fake"
                        >
                            <g transform="rotate(-233.647 64 64)">
                                <path
                                    d="M64 0L40.08 21.9a10.98 10.98 0 0 0-5.05 8.75C34.37 44.85 64 60.63 64 60.63V0z"
                                    fill="#ffb118"
                                />
                                <path
                                    d="M128 64l-21.88-23.9a10.97 10.97 0 0 0-8.75-5.05C83.17 34.4 67.4 64 67.4 64H128z"
                                    fill="#80c141"
                                />
                                <path
                                    d="M63.7 69.73a110.97 110.97 0 0 1-5.04-20.54c-1.16-8.7.68-14.17.68-14.17h38.03s-4.3-.86-14.47 10.1c-3.06 3.3-19.2 24.58-19.2 24.58z"
                                    fill="#cadc28"
                                />
                                <path
                                    d="M64 128l23.9-21.88a10.97 10.97 0 0 0 5.05-8.75C93.6 83.17 64 67.4 64 67.4V128z"
                                    fill="#cf171f"
                                />
                                <path
                                    d="M58.27 63.7a110.97 110.97 0 0 1 20.54-5.04c8.7-1.16 14.17.68 14.17.68v38.03s.86-4.3-10.1-14.47c-3.3-3.06-24.58-19.2-24.58-19.2z"
                                    fill="#ec1b21"
                                />
                                <path
                                    d="M0 64l21.88 23.9a10.97 10.97 0 0 0 8.75 5.05C44.83 93.6 60.6 64 60.6 64H0z"
                                    fill="#018ed5"
                                />
                                <path
                                    d="M64.3 58.27a110.97 110.97 0 0 1 5.04 20.54c1.16 8.7-.68 14.17-.68 14.17H30.63s4.3.86 14.47-10.1c3.06-3.3 19.2-24.58 19.2-24.58z"
                                    fill="#00bbf2"
                                />
                                <path
                                    d="M69.73 64.34a111.02 111.02 0 0 1-20.55 5.05c-8.7 1.14-14.15-.7-14.15-.7V30.65s-.86 4.3 10.1 14.5c3.3 3.05 24.6 19.2 24.6 19.2z"
                                    fill="#f8f400"
                                />
                                <circle cx="64" cy="64" r="2.03"/>
                                <animateTransform
                                    attributeName="transform"
                                    type="rotate"
                                    from="0 64 64"
                                    to="-360 64 64"
                                    dur="1s"
                                    repeatCount="indefinite"
                                />
                            </g>
                        </svg>
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
