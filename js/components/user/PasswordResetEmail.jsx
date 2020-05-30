// PasswordResetEmail.jsx
import React from "react";
require('../../../css/garms.css');
// import {Route} from 'react-router-dom';
import TextField from "material-ui/TextField";
import RaisedButton from "material-ui/RaisedButton";
import ReactGA from 'react-ga';


class PasswordResetEmail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isAuth: this.props.isAuth,
            email: null,
            response: null,
            result: null,
            token: null
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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

        if (email === null) {
            this.setState({
                response: 'Input an email address',
                result: 'negative'
            });
        } else {
            fetch(window.location.origin + '/api/pw_reset_email', {
                method: 'post',
                body: JSON.stringify({
                    email: email
                }),
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                }
            }).then(response => response.json()).then(data => {
                if (data.response !== 202) {
                    this.setState({
                        response: 'E-mail could not be sent, check if address is correct',
                        result: 'negative'
                    });
                    ReactGA.event({
                        category: "Password Reset",
                        action: 'failed',
                        label: email
                    });
                } else {
                    this.setState({
                        response: 'Password reset e-mail sent',
                        result: 'positive'
                    });
                    ReactGA.event({
                        category: "Password Reset",
                        action: 'completed',
                        label: email
                    });
                }
            })
        }
    }

    render(){
        return(
            <div>
                {(this.state.isAuth === "false" || this.state.isAuth === undefined) && (
                    <div
                        style={{
                            textAlign: 'center'
                        }}
                    >
                        <br />
                        <br />
                        <h5>Send Password Reset E-mail</h5>
                        <div
                            style={{
                                width: '100%'
                            }}
                        >
                            <TextField
                                hintText="E-mail Address"
                                floatingLabelText="E-mail Address"
                                type="email"
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
                        </div>

                        {this.state.result !== null && this.state.result === 'negative' && (
                            <div
                                style={{
                                    color: 'red'
                                }}
                            >
                                <br />
                                {this.state.response}
                            </div>
                        )}
                        {this.state.result !== null && this.state.result === 'positive' && (
                            <div
                                style={{
                                    color: 'green'
                                }}
                            >
                                <br />
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

export default PasswordResetEmail;
