import React from "react";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RecommendFromTags from '../recommend/RecommendFromTags';
import RecommendRandom from '../recommend/RecommendRandom';
import AddOutfit from '../wardrobe/AddOutfit';
import ReactGA from 'react-ga';
import SearchOptions from "./SearchOptions";
import OnboardingOutfitPicker from "../intro/OnboardingOutfitPicker";


class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            home: 'home',
            firstLogin: this.props.firstLogin,
            lookFilter: null,
            imgHash: null,
            email: this.props.email,
            sex: this.props.sex,
            isAuth: this.props.isAuth,
            showColorPicker: false,
            selectedColor: null,
            searchString: '',
            pullDownRefreshing: false,
            resultLength: null
        };

        this.showAddOutfit = this.showAddOutfit.bind(this);
        this.addOutfitComplete = this.addOutfitComplete.bind(this);
        this.changeSex = this.changeSex.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
    }

    componentWillMount() {
        this._ismounted = true;
        window.scrollTo(0, 0);
    }

    componentDidMount() {
        this._ismounted = true;
        window.addEventListener('scroll', this.handleScroll, { passive: true });
        if (this.props.firstLogin === '1') {
            this._ismounted = false;
            window.location.pathname = '/intro'
        }
        ReactGA.pageview(window.location.pathname + window.location.search);
    }

    componentWillUnmount() {
        this._ismounted = false;
        window.removeEventListener('scroll', this.handleScroll);
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

    setResultLength(length) {
        this.setState({
            resultLength: length
        })
    }

    handleScroll() {
        if (window.scrollY < -20) {
            this.handleNegativeScroll();
        }
        if (window.scrollY < -130) {
            if (this.state.resultLength !== null) {
                this.refreshSite();
            }
        }
        if (window.scrollY >= 0) {
            this.setState({
                pullDownRefreshing: false
            });
        }
    }

    handleNegativeScroll() {
        if (this.state.pullDownRefreshing === false) {
            this.setState({
                pullDownRefreshing: true
            });
        }
    }

    refreshSite() {
        this.props.iOSNavHide(() => {
            window.location.reload();
        });
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
        this.props.changeSex(sex);
        this.setState({
            sex: this.props.sex
        });
    }

    render () {
        return (
            <MuiThemeProvider>
                <div>
                    <div
                        className="search-choice"
                        style={{
                            filter: `opacity(${this.state.pullDownRefreshing === false ? 1 : 0.2})`
                        }}
                    >

                        {this.props.isAuth !== "true" && (this.props.firstVisit === 'true' || this.props.firstVisit === true) ? (
                            <OnboardingOutfitPicker
                                sex={this.props.sex}
                                changeSex={(sex) => {this.changeSex(sex)}}
                                setOnboardingFaves={(prodList) => {this.props.setOnboardingFaves(prodList)}}
                                completeFirstVisit={() => {this.props.completeFirstVisit()}}
                            />
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
                                        <SearchOptions
                                            sex={this.state.sex}
                                            handleColorChange={(color) => {this.handleColorChange(color)}}
                                            showColorPicker={(isShown) => {this.showColorPicker(isShown)}}
                                            handleTextInputChange={(event) => {this.handleTextInputChange(event)}}
                                            selectedColor={this.state.selectedColor}
                                            colorPickerShown={this.state.showColorPicker}
                                            ref={this.searchOptions}
                                            searchString={this.state.searchString}
                                        />

                                        {(this.state.isAuth === "true" && this._ismounted) ? (
                                            <div
                                                style={{
                                                    marginTop: '-75px'
                                                }}
                                            >
                                                <RecommendFromTags
                                                    email={this.state.email}
                                                    sex={this.props.sex}
                                                    lookFilter={this.state.lookFilter}
                                                    showAddOutfit={(imgHash) => {this.showAddOutfit(imgHash)}}
                                                    isAuth={this.props.isAuth}
                                                    setResultLength={(ln) => {this.setResultLength(ln)}}
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
                                                        sex={this.props.sex}
                                                        showAddOutfit={(imgHash) => {this.showAddOutfit(imgHash)}}
                                                        onboardingFaves={this.props.onboardingFaves}
                                                        setResultLength={(ln) => {this.setResultLength(ln)}}
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

export default Home;
