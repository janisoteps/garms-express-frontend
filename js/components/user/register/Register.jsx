// Register.jsx
import React from "react";
require('../../../../css/garms.css');
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TextField from 'material-ui/TextField';
import Loyalty from 'material-ui/svg-icons/action/loyalty';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import FlatButton from 'material-ui/FlatButton';
import {Route} from 'react-router-dom';
import RaisedButton from 'material-ui/RaisedButton';


export default class Register extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            pwd: '',
            username: '',
            sex: 'women',
            regComplete: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        let value =  event.target.value;
        let name = event.target.name;
        this.setState({
            [name]: value
        });
    }

    handleSubmit(event) {
        // alert('A name was submitted: ' + this.state.value);
        event.preventDefault();
        let email = this.state.email;
        let pwd = this.state.pwd;
        let username = this.state.username;
        let sex = this.state.sex;

        fetch(window.location.origin + '/api/register', {
            method: 'post',
            body: JSON.stringify({
                email: email,
                pwd: pwd,
                sex: sex,
                username: username
            }),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(function(response) { return response.json(); })
            .then(data => {
                if (data === true) {
                    this.setState({
                        regComplete: true
                    });
                } else {
                    alert('Registration failed');
                }
            });
    }

    render() {
        const regForm = (
            <div className="register-form">
                <p>Welcome to Garms app!</p>
                <TextField
                    hintText="Your name"
                    name="username"
                    floatingLabelText="Input your first name:"
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
                <br></br>
                <br></br>
                <RadioButtonGroup
                    name="sex"
                    defaultSelected="women"
                    onChange={this.handleChange.bind(this)}
                >
                    <RadioButton
                        value="women"
                        label="Her"
                        checkedIcon={<Loyalty style={{color: '#9276b5'}}/>}
                        uncheckedIcon={<Loyalty/>}
                        labelStyle={{textAlign: 'left'}}
                    />
                    <RadioButton
                        value="men"
                        label="Him"
                        checkedIcon={<Loyalty style={{color: '#9276b5'}}/>}
                        uncheckedIcon={<Loyalty/>}
                        labelStyle={{textAlign: 'left'}}
                    />
                    <RadioButton
                        value="both"
                        label="Them"
                        checkedIcon={<Loyalty style={{color: '#9276b5'}}/>}
                        uncheckedIcon={<Loyalty/>}
                        labelStyle={{textAlign: 'left'}}
                    />
                </RadioButtonGroup>
                <TextField
                    name="email"
                    hintText="Your e-mail"
                    floatingLabelText="Input your e-mail address:"
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
                <br></br>
                <TextField
                    name="pwd"
                    hintText="Password"
                    floatingLabelText="Choose a password:"
                    type="password"
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
                <br />
                <RaisedButton
                    label="Register"
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
        );

        const regSuccess = (
            <div style={{textAlign: 'center', marginTop: '30vh'}}>
                <p>Registration successful!</p>

                <Route render={({history}) => (
                    <FlatButton
                        label="Log In"
                        onClick={() => {
                            history.push('/login')
                        }}
                        buttonStyle={{
                            backgroundColor: 'black'
                        }}
                    />
                )}/>
            </div>
        );


        return (
            <MuiThemeProvider>
                <div>
                    {this.state.regComplete ? (regSuccess) : (regForm)}
                </div>
            </MuiThemeProvider>
        );
    }
}
