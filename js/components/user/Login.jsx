// Register.jsx
import React from "react";
require('../../../css/garms.css');
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import {withCookies, Cookies} from 'react-cookie';
import {instanceOf} from 'prop-types';
import {Route} from 'react-router-dom'
import ReactGA from 'react-ga';


class Login extends React.Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };

    constructor(props) {
        super(props);
        const {cookies} = this.props;
        this.state = {
            isAuth: cookies.get('isAuth'),
            email: '',
            pwd: ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        ReactGA.pageview(window.location.pathname + window.location.search);
    }

    handleChange(event) {
        let value = event.target.value;
        let name = event.target.name;
        this.setState({
            [name]: value
        });
    }

    handleSubmit(event) {
        event.preventDefault();

        const email = this.state.email;
        const pwd = this.state.pwd;

        ReactGA.event({
            category: "Log In",
            action: "User attempted log-in",
            label: email
        });

        this.props.handleLogin(email, pwd);
    }

    onEnterPress = (e) => {
        if(e.keyCode === 13 && e.shiftKey === false) {
            e.preventDefault();
            const email = this.state.email;
            const pwd = this.state.pwd;

            ReactGA.event({
                category: "Log In",
                action: "User attempted log-in",
                label: email
            });

            this.props.handleLogin(email, pwd);
        }
    };

    render() {
        const loginForm = this.state.isAuth === true || this.state.isAuth === "true" ? (
            <Route render={({history}) => (
                <div className="login-welcome" onClick={() => {
                    history.push('/')
                }}>
                    <h2>
                        Welcome to Garms app
                    </h2>
                    <br></br>
                    <h3>
                        Start Exploring
                    </h3>
                </div>
            )}/>
        ) : (
            <div className="register-form">
                <h4>Log in your Garms account</h4>
                <TextField
                    hintText="Your e-mail"
                    floatingLabelText="Input your e-mail address:"
                    name="email"
                    onChange={this.handleChange.bind(this)}
                    underlineFocusStyle={{
                        borderBottom: '2px solid rgb(0, 0, 0)'
                    }}
                    underlineDisabledStyle={{
                        borderBottom: '0px solid rgb(0, 0, 0)'
                    }}
                    floatingLabelStyle={{
                       color: 'black'
                    }}
                />
                <TextField
                    hintText="Password"
                    floatingLabelText="Your password:"
                    type="password"
                    name="pwd"
                    onChange={this.handleChange.bind(this)}
                    underlineFocusStyle={{
                        borderBottom: '2px solid rgb(0, 0, 0)'
                    }}
                    underlineDisabledStyle={{
                        borderBottom: '0px solid rgb(0, 0, 0)'
                    }}
                    floatingLabelStyle={{
                       color: 'black'
                    }}
                    onKeyDown={this.onEnterPress}
                />
                {this.props.failedLogin && (
                    <p style={{
                        color: 'red'
                    }}>
                        Incorrect e-mail or password
                    </p>
                    )
                }
                <RaisedButton
                    label="Log In"
                    primary={true}
                    onClick={this.handleSubmit}
                    buttonStyle={{
                        backgroundColor: 'black'
                    }}
                    style={{
                        marginTop: '20px'
                    }}
                />
                <br/>
                <br/>
                <Route render={({history}) => (
                    <div
                        style={{
                            color: '#002e5d',
                            fontSize: '0.9rem',
                            cursor: 'pointer'
                        }}
                        onClick={() => {
                            history.push('/password-reset-email')
                        }}
                    >
                        <p>Forgot my password</p>
                    </div>
                )} />
                <br/>
                <br/>
                <h5>Don't have an account?</h5>

                <Route render={({history}) => (
                    <RaisedButton
                        label="Register"
                        primary={true}
                        onClick={() => {
                            history.push('/register')
                        }}
                        buttonStyle={{
                            backgroundColor: 'black'
                        }}
                        style={{
                            marginTop: '20px'
                        }}
                    />
                )}/>

            </div>
        );

        return (
            <MuiThemeProvider>
                <div>
                    {loginForm}
                </div>
            </MuiThemeProvider>
        );
    }
}

export default withCookies(Login);
