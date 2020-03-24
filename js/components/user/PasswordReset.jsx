// PasswordReset.jsx
import React from "react";
require('../../../css/garms.css');
// import {Route} from 'react-router-dom';
import TextField from "material-ui/TextField";
import RaisedButton from "material-ui/RaisedButton";
import ReactGA from 'react-ga';


class PasswordReset extends React.Component  {
    constructor(props) {
        super(props);
        this.state = {
            isAuth: this.props.isAuth,
            username: this.props.username,
            email: this.props.email,
            response: null,
            result: null,
            currentPw: null,
            newPw: null,
            confirmPw: null,
            token: null,
            emailInput: null
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handlePwChange = this.handlePwChange.bind(this);
        this.handlePwChangeToken = this.handlePwChangeToken.bind(this);
    }

    componentDidMount() {
        const queryString = window.location.search;
        if(queryString.length > 0) {
            const token = window.location.search.split('t=')[1];
            this.setState({
                token: token
            });
        }
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
        const currentPw = this.state.currentPw;
        const newPw = this.state.newPw;
        const confirmPw = this.state.confirmPw;
        let email = null;
        const token = this.state.token;

        if(this.state.emailInput) {
            email = this.state.emailInput;
        } else {
            email = this.state.email;
        }

        if (newPw !== confirmPw) {
            this.setState({
                response: 'New passwords do not match',
                result: 'negative'
            });
        } else if (newPw === null) {
            this.setState({
                response: 'Please input the new password',
                result: 'negative'
            });
        } else {

            if (token !== null) {
                this.handlePwChangeToken(email, newPw, token);
            } else {
                this.handlePwChange(email, currentPw, newPw);
            }
        }
    }

    handlePwChangeToken(email, newPw, token) {
        fetch(window.location.origin + '/api/pw_reset', {
            method: 'post',
            body: JSON.stringify({
                email: email,
                new_pw: newPw,
                token: token
            }),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(response => response.json()).then(resetData => {
            if (resetData.res === 'incorrect email') {
                this.setState({
                    response: 'Incorrect e-mail',
                    result: 'negative'
                })
            } else if (resetData.res === 'invalid token') {
                this.setState({
                    response: 'Please try again',
                    result: 'negative'
                })
            } else if (resetData.res === 'success') {
                this.setState({
                    response: 'Password changed',
                    result: 'positive',
                    currentPw: null,
                    newPw: null,
                    confirmPw: null
                })
            }
        });
    }

    handlePwChange = (email, currentPw, newPw) => {

        fetch(window.location.origin + '/api/pw_reset_token', {
            method: 'post',
            body: JSON.stringify({
                email: email,
                pw: currentPw
            }),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(response => response.json()).then(data => {
            if (data === false) {
                this.setState({
                    response: 'Incorrect Current Password',
                    result: 'negative'
                })
            } else {
                console.log(data);
                const token = data['token'];
                console.log(token);

                fetch(window.location.origin + '/api/pw_reset', {
                    method: 'post',
                    body: JSON.stringify({
                        email: email,
                        new_pw: newPw,
                        token: token
                    }),
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    }
                }).then(response => response.json()).then(resetData => {
                    if (resetData.res === 'incorrect email') {
                        this.setState({
                            response: 'Incorrect e-mail',
                            result: 'negative'
                        })
                    } else if (resetData.res === 'invalid token') {
                        this.setState({
                            response: 'Please try again',
                            result: 'negative'
                        })
                    } else if (resetData.res === 'success') {
                        this.setState({
                            response: 'Password changed',
                            result: 'positive',
                            currentPw: null,
                            newPw: null,
                            confirmPw: null
                        })
                    }
                })
            }
        });
    };

    render() {
        return(
            <div>
                {this.state.token != null && (
                    <div
                        style={{
                            textAlign: 'center'
                        }}
                    >
                        <div
                            style={{
                                width: '100%'
                            }}
                        >
                            <TextField
                                hintText="E-mail address"
                                floatingLabelText="E-mail address"
                                type="text"
                                name="emailInput"
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
                        </div>
                        <div
                            style={{
                                width: '100%'
                            }}
                        >
                            <TextField
                                hintText="New Password"
                                floatingLabelText="New Password"
                                type="password"
                                name="newPw"
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
                        </div>
                        <div
                            style={{
                                width: '100%'
                            }}
                        >
                            <TextField
                                hintText="Confirm New Password"
                                floatingLabelText="Confirm Password"
                                type="password"
                                name="confirmPw"
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
                        </div>
                        {this.state.result !== null && this.state.result === 'negative' && (
                            <div
                                style={{
                                    color: 'red'
                                }}
                            >
                                {this.state.response}
                            </div>
                        )}
                        {this.state.result !== null && this.state.result === 'positive' && (
                            <div
                                style={{
                                    color: 'green'
                                }}
                            >
                                {this.state.response}
                            </div>
                        )}
                        <RaisedButton
                            label="Submit"
                            primary={true}
                            onClick={this.handleSubmit}
                            buttonStyle={{
                                backgroundColor: 'black'
                            }}
                            style={{
                                marginTop: '20px'
                            }}
                        />
                    </div>
                )}
                {this.state.isAuth !== "false" && (
                    <div
                        style={{
                            textAlign: 'center'
                        }}
                    >
                        <div
                            style={{
                                width: '100%'
                            }}
                        >
                            <TextField
                                hintText="Current Password"
                                floatingLabelText="Current Password"
                                type="password"
                                name="currentPw"
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
                        </div>
                        <div
                            style={{
                                width: '100%'
                            }}
                        >
                            <TextField
                                hintText="New Password"
                                floatingLabelText="New Password"
                                type="password"
                                name="newPw"
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
                        </div>
                        <div
                            style={{
                                width: '100%'
                            }}
                        >
                            <TextField
                                hintText="Confirm New Password"
                                floatingLabelText="Confirm Password"
                                type="password"
                                name="confirmPw"
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
                        </div>
                        {this.state.result !== null && this.state.result === 'negative' && (
                            <div
                                style={{
                                    color: 'red'
                                }}
                            >
                                {this.state.response}
                            </div>
                        )}
                        {this.state.result !== null && this.state.result === 'positive' && (
                            <div
                                style={{
                                    color: 'green'
                                }}
                            >
                                {this.state.response}
                            </div>
                        )}
                        <RaisedButton
                            label="Submit"
                            primary={true}
                            onClick={this.handleSubmit}
                            buttonStyle={{
                                backgroundColor: 'black'
                            }}
                            style={{
                                marginTop: '20px'
                            }}
                        />
                    </div>
                )}
            </div>
        )
    }
}

export default PasswordReset;
