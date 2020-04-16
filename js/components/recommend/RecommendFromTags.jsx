// RecommendFromTags.jsx
import React from "react";
require('../../../css/garms.css');
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper';
import {Route} from 'react-router-dom';
import Tooltip from '@material-ui/core/Tooltip';
import ReactGA from "react-ga";
import InfiniteSpinner from "../loading/InfiniteSpinner";
import RecommendCard from "./RecommendCard";


class RecommendFromTags extends React.Component  {
    constructor(props) {
        super(props);
        this.state = {
            email: this.props.email,
            sex: this.props.sex,
            lookFilter: this.props.lookFilter,
            outfits: [],
            loadedProdIds: [],
            infiniteCount: 0,
            infiniteLoading: false,
            infiniteLoadingComplete: false
        };

        this.showAddOutfit = this.showAddOutfit.bind(this);
        this.shuffle = this.shuffle.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.getRecommendations = this.getRecommendations.bind(this);
    }

    componentDidMount() {
        this._ismounted = true;
        window.addEventListener('scroll', this.handleScroll, { passive: true });

        fetch(`${window.location.origin}/api/recommend_tags`, {
            method: 'post',
            body: JSON.stringify({
                'email': this.state.email,
                'sex': this.state.sex,
                'req_looks': this.props.lookFilter,
                'prev_prod_ids': this.state.loadedProdIds
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
        })
    }

    componentDidUpdate(prevProps){
        if (this._ismounted) {
            if(prevProps.lookFilter !== this.props.lookFilter){
                this.setState({
                    lookFilter: this.props.lookFilter,
                    outfits: []
                }, () => {
                    window.scrollTo({
                        top: 0
                    });
                    window.scrollTo(0, 0);
                });
                fetch(`${window.location.origin}/api/recommend_tags`, {
                    method: 'post',
                    body: JSON.stringify({
                        'email': this.state.email,
                        'sex': this.state.sex,
                        'req_looks': this.props.lookFilter,
                        'prev_prod_ids': this.state.loadedProdIds
                    }),
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    }
                }).then(function(response) {
                    return response.json();
                }).then(data => {
                    const loadedProdIds = [];
                    data.forEach(lookDict => {
                        lookDict.prod_suggestions.forEach(suggestion => {
                            loadedProdIds.push(suggestion[0].prod_id)
                        })
                    });
                    if (this._ismounted) {
                        this.setState({
                            outfits: data,
                            loadedProdIds: loadedProdIds,
                            infiniteCount: 0
                        });
                    }
                })
            }
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
        ) {
            return false;
        } else {
            return true;
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
                this.getRecommendations();
            }
        }
    }

    getRecommendations() {
        const reqBody = this.state.loadedProdIds === null ? {'sex': this.state.sex} : {
            'sex': this.state.sex,
            'prev_prod_ids': this.state.loadedProdIds,
            'email': this.state.email,
            'req_looks': this.props.lookFilter
        };
        fetch(`${window.location.origin}/api/recommend_tags`, {
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
                const loadedProdIds = [];
                data.forEach(lookDict => {
                    lookDict.prod_suggestions.forEach(suggestion => {
                        loadedProdIds.push(suggestion[0].prod_id)
                    })
                });
                this.setState({
                    outfits: this.state.outfits.concat(data),
                    infiniteCount: this.state.infiniteCount + 1,
                    loadedProdIds: this.state.loadedProdIds.concat(loadedProdIds),
                    infiniteLoading: false
                });
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

    shuffle(a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    render() {
        const outfitTiles = this.state.outfits.map(lookDict => {
            const lookName = lookDict.look_name;
            const suggestionArr = lookDict.prod_suggestions;

            return suggestionArr.map(prodSuggestionArr => {
                const prodSuggestion = prodSuggestionArr[0];
                if (this.props.lookFilter === null || this.props.lookFilter === lookName) {
                    return (
                        <RecommendCard
                            key={prodSuggestion.prod_id}
                            prodData={prodSuggestion}
                            lookName={lookName}
                            showAddOutfit={(imgHash) => {this.showAddOutfit(imgHash)}}
                            isAuth={this.props.isAuth}
                            gaCat={"Recommend From Tags"}
                        />
                    )
                }
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

                        {this.state.infiniteLoading
                        && !this.state.infiniteLoadingComplete
                        && this.state.outfits.length > 0
                        && (
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

export default RecommendFromTags;
