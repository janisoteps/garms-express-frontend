import React from 'react'
import Header from './Header'
import Main from './Main'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
require('../../../css/garms.css');
import {withCookies, Cookies} from 'react-cookie';
import {instanceOf} from 'prop-types';
import {withRouter, Route} from 'react-router-dom';
import FlatButton from "material-ui/FlatButton";
import Loyalty from "material-ui/svg-icons/action/loyalty";
import ReactGA from 'react-ga';
import AddToHomeScreenPopup from "../ios/AddToHomeScreenPopup";
import StandaloneIOSNav from "../ios/StandaloneIOSNav";
ReactGA.initialize('UA-161747441-1');
import NewVersionPopup from '../info/NewVersionPopup';
import CookiePopup from "../info/CookiePopup";


class App extends React.Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };

    constructor(props) {
        super(props);
        const {cookies} = this.props;
        this.state = {
            isAuth: cookies.get('isAuth'),
            sex: cookies.get('sex'),
            email: cookies.get('email'),
            username: cookies.get('username'),
            higherCat: '',
            firstLogin: false,
            failedLogin: false,
            loginPage: false,
            showInstallPopup: false,
            showIosNav: false,
            onboardingFaves: [],
            isStandalone: null,
            newContentAvailable: false,
            showCookiePopup: false,
            readyToRender: false
        };
        this.handleLoginChange = this.handleLoginChange.bind(this);
        this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
        this.changeSex = this.changeSex.bind(this);
        this.handleHigherCat = this.handleHigherCat.bind(this);
        this.completeFirstLogin = this.completeFirstLogin.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.handleResultLogin = this.handleResultLogin.bind(this);
        this.iOS = this.iOS.bind(this);
        this.closeShowInstallPopup = this.closeShowInstallPopup.bind(this);
        this.setOnboardingFaves = this.setOnboardingFaves.bind(this);
        this.completeFirstVisit = this.completeFirstVisit.bind(this);
        this.registerNewContentListener = this.registerNewContentListener.bind(this);
        this.closeCookiePopup = this.closeCookiePopup.bind(this);
    }

    componentDidMount() {
        const {cookies} = this.props;

        this._ismounted = true;
        const queryString = window.location.search;
        const current = new Date();
        const nextYear = new Date();
        nextYear.setFullYear(current.getFullYear() + 1);

        this.setState({
            isAuth: cookies.get('isAuth'),
            sex: cookies.get('sex'),
            userHash: cookies.get('user_hash'),
            username: cookies.get('username'),
            firstLogin: cookies.get('first_login'),
            firstVisit: cookies.get('first_visit'),
            onboardingFaves: cookies.get('onboarding_faves') ? cookies.get('onboarding_faves') : [],
            nextYear: nextYear,
            showCookiePopup: cookies.get('show_cookies'),
            readyToRender: true
        }, () => {
            const isInStandaloneMode = () => ('standalone' in window.navigator) && (window.navigator.standalone);
            const showInstallPopupCookie = cookies.get('show_install_popup');
            if (
                this.iOS()
                && !isInStandaloneMode()
                && showInstallPopupCookie !== 'false'
                && showInstallPopupCookie !== false
                && this.state.firstVisit !== true
                && this.state.firstVisit !== 'true'
            ) {
                this.setState({ showInstallPopup: true });
            }
            if (this.iOS() && isInStandaloneMode()) {
                this.setState({ showIosNav: true });
            }
            if (!this.state.sex || this.state.sex === '') {
                let sex = null;
                if (queryString.length > 0) {
                    sex = window.location.search.split('sex=')[1];
                    if (sex) {
                        cookies.set('sex', sex, {
                            path: '/',
                            expires: nextYear
                        });
                        this.setState({
                            sex: sex
                        })
                    }
                } else {
                    this.setState({
                        sex: 'women'
                    }, () => {
                        cookies.set('sex', 'women', {
                            path: '/',
                            expires: nextYear
                        });
                    })
                }
            }
            if (this.state.firstVisit === undefined) {
                this.setState({
                    firstVisit: true
                })
            }
            if (this.state.showCookiePopup === undefined) {
                this.setState({
                    showCookiePopup: true
                })
            }
        });
        const href = window.location.href;
        if (href.includes('login')
            || href.includes('data-protection')
            || href.includes('terms-conditions')
            || href.includes('register')
        ) {
            this.setState({
                loginPage: true
            })
        }
        ReactGA.set({
            userId: cookies.get('user_hash'),
            // any data that is relevant to the user session
            // that you would like to track with google analytics
        });

        if (window.pwaContent) {
            this.registerNewContentListener()
        } else {
            setTimeout(() => {
                if (window.pwaContent) {
                    this.registerNewContentListener()
                } else {
                    setTimeout(() => {
                        if (window.pwaContent) {
                            this.registerNewContentListener()
                        } else {
                            setTimeout(() => {
                                if (window.pwaContent) {
                                    this.registerNewContentListener()
                                }
                            }, 5000)
                        }
                    }, 2000)
                }
            }, 2000)
        }
    }

    componentWillUnmount() {
        this._ismounted = false;
    }

    componentDidUpdate(prevProps){
        if (this._ismounted) {

            if(prevProps !== this.props){
                const href = window.location.href;
                if (href.includes('login')) {
                    this.setState({
                        loginPage: true
                    })
                }
            }
        }
    }

    registerNewContentListener() {
        window.pwaContent.registerListener((val) => {
            this.setState({
                newContentAvailable: true
            })
        });
    }

    closeShowInstallPopup() {
        const {cookies} = this.props;
        cookies.set('show_install_popup', 'false', {path: '/', expires: this.state.nextYear});
        this.setState({
            showInstallPopup: false
        })
    }

    closeCookiePopup() {
        const {cookies} = this.props;
        this.setState({
            showCookiePopup: false
        })
        cookies.set('show_cookies', false, {
            path: '/',
            expires: this.state.nextYear
        });
    }

    iOS() {
        const iDevices = [
            'iPad Simulator',
            'iPhone Simulator',
            'iPod Simulator',
            'iPad',
            'iPhone',
            'iPod'
        ];
        if (!!navigator.platform) {
            while (iDevices.length) {
                if (navigator.platform === iDevices.pop()){ return true; }
            }
        }
        return false;
    }

    // Updates input field state
    handleLoginChange(event) {
        let value = event.target.value;
        let name = event.target.name;
        this.setState({
            [name]: value
        });
    }

    completeFirstLogin = (callback) => {
        const {cookies} = this.props;

        fetch(window.location.origin + '/api/complete_first_login', {
            method: 'post',
            body: JSON.stringify({email: this.state.email}),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(response => response.json())
            .then(data => {
                if (data === true) {
                    cookies.set('first_login', 0, {path: '/', expires: this.state.nextYear});
                    this.setState({
                        firstLogin: 0
                    }, () => {
                        callback();
                    })
                }
            });
    };

    changeSex(sex){
        const {cookies} = this.props;
        this.setState({
            sex: sex
        }, () => {
            cookies.set('sex', sex, {
                path: '/',
                expires: this.state.nextYear
            });
        });
    }

    // Asks the API if submitted pwd is correct and logs the user in if yes
    handleLoginSubmit = (event) => {
        event.preventDefault();
        let email = this.state.email;
        let pwd = this.state.pwd;
        const {cookies} = this.props;

        fetch(window.location.origin + '/api/login', {
            method: 'post',
            body: JSON.stringify({email: email, pwd: pwd}),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(response => response.json())
            .then(data => {
                if (data === false) {
                    this.setState({
                        failedLogin: true
                    });
                } else {
                    cookies.set('isAuth', data['auth'], {path: '/', expires: this.state.nextYear});
                    cookies.set('sex', data['res']['sex'], {path: '/', expires: this.state.nextYear});
                    cookies.set('username', data['res']['username'], {path: '/', expires: this.state.nextYear});
                    cookies.set('email', data['res']['email'], {path: '/', expires: this.state.nextYear});
                    cookies.set('first_login', data['res']['first_login'], {path: '/', expires: this.state.nextYear});
                    cookies.set('user_hash', data['res']['user_hash'], {path: '/', expires: this.state.nextYear})
                    this.setState({
                        isAuth: data['auth'],
                        sex: data['res']['sex'],
                        username: data['res']['username'],
                        email: data['res']['email'],
                        pwd: '',
                        firstLogin: data['res']['first_login'],
                        userHash: data['res']['user_hash']
                    });
                    window.location.reload();
                }
            });
    };

    // Asks the API if submitted pwd is correct and logs the user in if yes
    handleLogin = (email, password) => {
        const {cookies} = this.props;

        fetch(window.location.origin + '/api/login', {
            method: 'post',
            body: JSON.stringify({email: email, pwd: password}),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(response => response.json())
            .then(data => {
                if (data === false) {
                    this.setState({
                        failedLogin: true
                    })
                } else {
                    cookies.set('isAuth', data['auth'], {path: '/', expires: this.state.nextYear});
                    cookies.set('sex', data['res']['sex'], {path: '/', expires: this.state.nextYear});
                    cookies.set('username', data['res']['username'], {path: '/', expires: this.state.nextYear});
                    cookies.set('email', data['res']['email'], {path: '/', expires: this.state.nextYear});
                    cookies.set('first_login', data['res']['first_login'], {path: '/', expires: this.state.nextYear});
                    cookies.set('user_hash', data['res']['user_hash'], {path: '/', expires: this.state.nextYear})
                    this.setState({
                        isAuth: data['auth'],
                        sex: data['res']['sex'],
                        username: data['res']['username'],
                        email: data['res']['email'],
                        pwd: '',
                        firstLogin: data['res']['first_login'],
                        userHash: data['res']['user_hash']
                    }, () => {
                        ReactGA.event({
                            category: "Log In",
                            action: "User logged in",
                            label: data['res']['user_hash']
                        });
                        ReactGA.set({
                            userId: data['res']['user_hash']
                            // any data that is relevant to the user session
                            // that you would like to track with google analytics
                        });
                        window.location.pathname = '/';
                    });
                }
            });
    };

    handleResultLogin = (email, password, imgHash) => {
        const {cookies} = this.props;

        fetch(window.location.origin + '/api/login', {
            method: 'post',
            body: JSON.stringify({email: email, pwd: password}),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(response => response.json())
            .then(data => {
                if (data === false) {
                    this.setState({
                        failedLogin: true
                    })
                } else {
                    cookies.set('isAuth', data['auth'], {path: '/', expires: this.state.nextYear});
                    cookies.set('sex', data['res']['sex'], {path: '/', expires: this.state.nextYear});
                    cookies.set('username', data['res']['username'], {path: '/', expires: this.state.nextYear});
                    cookies.set('email', data['res']['email'], {path: '/', expires: this.state.nextYear});
                    cookies.set('first_login', data['res']['first_login'], {path: '/', expires: this.state.nextYear});
                    this.setState({
                        isAuth: data['auth'],
                        sex: data['res']['sex'],
                        username: data['res']['username'],
                        email: data['res']['email'],
                        pwd: '',
                        firstLogin: data['res']['first_login']
                    });
                    window.location.pathname = `/wardrobe`;
                }
            });
    };

    handleHigherCat = (higherCat) => {
        this.setState({
            higherCat: higherCat
        });
    };

    setOnboardingFaves(prodList) {
        const {cookies} = this.props;
        this.setState({
            onboardingFaves: prodList,
            firstVisit: false
        });
        const prodCatList = prodList.map(itemDict => {
            return {
                kind_cats: itemDict.kind_cats,
                prod_id: itemDict.prod_id
            }
        });
        cookies.set('onboarding_faves', JSON.stringify(prodCatList), {
            path: '/',
            expires: this.state.nextYear
        });
        cookies.set('first_visit', false, {
            path: '/',
            expires: this.state.nextYear
        });
    }

    completeFirstVisit() {
        const {cookies} = this.props;
        this.setState({
            firstVisit: false
        });
        cookies.set('first_visit', false, {
            path: '/',
            expires: this.state.nextYear
        });
    }

    render() {
        let isUserAuth = this.state.isAuth;

        return (
            <MuiThemeProvider>
                <div>
                    <Header isAuth={isUserAuth}/>

                    {!this.state.sex && this.state.loginPage === false && this.state.firstVisit === false ? (
                            <div
                                style={{
                                    width: '100vw',
                                    textAlign: 'center',
                                    position: 'fixed',
                                    top: '50px',
                                    left: '0',
                                    paddingTop: '100px',
                                    backgroundColor: '#FFFFFF',
                                    height: 'calc(100vh - 50px)'
                                }}
                            >
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
                        ):(
                        <div className="content-wrapper">
                            {this.state.readyToRender === true && (
                                <Main
                                    isAuth={this.state.isAuth}
                                    sex={this.state.sex}
                                    username={this.state.username}
                                    email={this.state.email}
                                    changeSex={(sex) => {this.changeSex(sex);}}
                                    higherCat={this.state.higherCat}
                                    firstLogin={this.state.firstLogin}
                                    handleHigherCat={(higherCat) => {this.handleHigherCat(higherCat);}}
                                    completeFirstLogin={(callback) => {this.completeFirstLogin(callback);}}
                                    handleLogin={(email, password) => {this.handleLogin(email, password)}}
                                    handleResultLogin={(email, password, imgHash) => {this.handleResultLogin(email, password, imgHash)}}
                                    failedLogin={this.state.failedLogin}
                                    showIosNav={this.state.showIosNav}
                                    firstVisit={this.state.firstVisit}
                                    setOnboardingFaves={(prodList) => {this.setOnboardingFaves(prodList)}}
                                    onboardingFaves={this.state.onboardingFaves}
                                    completeFirstVisit={() => {this.completeFirstVisit()}}
                                />
                            )}
                        </div>
                    )}

                    {this.state.showInstallPopup === true && (
                        <AddToHomeScreenPopup
                            closeShowInstallPopup={() => {this.closeShowInstallPopup()}}
                        />
                    )}
                    {this.state.showIosNav === true && (
                        <StandaloneIOSNav />
                    )}
                    {this.state.newContentAvailable === true && (
                        <NewVersionPopup />
                    )}

                    {(this.state.showCookiePopup === true || this.state.showCookiePopup === 'true') && (
                        <CookiePopup
                            closeCookiePopup={() => this.closeCookiePopup()}
                        />
                    )}
                </div>
            </MuiThemeProvider>
        )
    }
}

export default withRouter(withCookies(App));
