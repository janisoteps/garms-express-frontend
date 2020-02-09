import React from 'react'
import Header from './Header'
import Main from './Main'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

require('../css/garms.css');
// import TextField from 'material-ui/TextField';
// import RaisedButton from 'material-ui/RaisedButton';
import {withCookies, Cookies} from 'react-cookie';
import {instanceOf} from 'prop-types';
import {withRouter} from 'react-router-dom';
import FlatButton from "material-ui/FlatButton";
import Loyalty from "material-ui/svg-icons/action/loyalty";
// import {Route} from 'react-router-dom';


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
            failedLogin: false
        };
        this.handleLoginChange = this.handleLoginChange.bind(this);
        this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
        this.changeSex = this.changeSex.bind(this);
        this.handleHigherCat = this.handleHigherCat.bind(this);
        this.completeFirstLogin = this.completeFirstLogin.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.handleResultLogin = this.handleResultLogin.bind(this);
    }

    // componentWillMount() {
    // }

    componentDidMount() {
        const {cookies} = this.props;
        this.setState({
            isAuth: cookies.get('isAuth'),
            sex: cookies.get('sex'),
            username: cookies.get('username'),
            firstLogin: cookies.get('first_login')
        });
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
                    cookies.set('first_login', 0, {path: '/'});
                    this.setState({
                        firstLogin: 0
                    }, () => {
                        callback();
                    })
                }
            });
    };

    changeSex(sex){
        this.setState({
            sex: sex
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
                    cookies.set('isAuth', data['auth'], {path: '/'});
                    cookies.set('sex', data['res']['sex'], {path: '/'});
                    cookies.set('username', data['res']['username'], {path: '/'});
                    cookies.set('email', data['res']['email'], {path: '/'});
                    cookies.set('first_login', data['res']['first_login'], {path: '/'});
                    this.setState({
                        isAuth: data['auth'],
                        sex: data['res']['sex'],
                        username: data['res']['username'],
                        email: data['res']['email'],
                        pwd: '',
                        firstLogin: data['res']['first_login']
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
                    cookies.set('isAuth', data['auth'], {path: '/'});
                    cookies.set('sex', data['res']['sex'], {path: '/'});
                    cookies.set('username', data['res']['username'], {path: '/'});
                    cookies.set('email', data['res']['email'], {path: '/'});
                    cookies.set('first_login', data['res']['first_login'], {path: '/'});
                    this.setState({
                        isAuth: data['auth'],
                        sex: data['res']['sex'],
                        username: data['res']['username'],
                        email: data['res']['email'],
                        pwd: '',
                        firstLogin: data['res']['first_login']
                    });
                    window.location.pathname = '/';
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
                    cookies.set('isAuth', data['auth'], {path: '/'});
                    cookies.set('sex', data['res']['sex'], {path: '/'});
                    cookies.set('username', data['res']['username'], {path: '/'});
                    cookies.set('email', data['res']['email'], {path: '/'});
                    cookies.set('first_login', data['res']['first_login'], {path: '/'});
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

    render() {
        let isUserAuth = this.state.isAuth;

        return (
            <MuiThemeProvider>
                <div>
                    <Header isAuth={isUserAuth}/>
                    <div className="content-wrapper">
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
                        />
                    </div>
                </div>
            </MuiThemeProvider>
        )
    }
}

// export default App;
export default withRouter(withCookies(App));
