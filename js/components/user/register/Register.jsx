// Register.jsx
import React from "react";
require('../../../../css/garms.css');
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TextField from 'material-ui/TextField';
// import Loyalty from 'material-ui/svg-icons/action/loyalty';
// import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
// import FlatButton from 'material-ui/FlatButton';
import {Route} from 'react-router-dom';
import RaisedButton from 'material-ui/RaisedButton';
import ReactGA from 'react-ga';
import Switch from '@material-ui/core/Switch';
import InfiniteSpinner from "../../loading/InfiniteSpinner";


export default class Register extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            pwd: '',
            username: '',
            sex: this.props.sex,
            regComplete: false,
            dataProtectionCheck: false,
            termsOfUseCheck: false,
            withOnboardingFaves: false,
            registerInProcess: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSwitchChange = this.handleSwitchChange.bind(this);
        this.addOnboardingFaves = this.addOnboardingFaves.bind(this);
        this.addOutfitsToLook = this.addOutfitsToLook.bind(this);
    }

    componentDidMount() {
        ReactGA.pageview(window.location.pathname + window.location.search);
        ReactGA.event({
            category: "Register",
            action: "start",
        });

        const queryString = window.location.search;
        if(queryString.length > 0) {
            const isLikes = window.location.search.split('likes=')[1];
            if (isLikes === '1') {
                this.setState({
                    withOnboardingFaves: true
                });
            }
        }
    }

    handleChange(event) {
        let value =  event.target.value;
        let name = event.target.name;
        this.setState({
            [name]: value
        });
    }

    handleSwitchChange = event => {
        this.setState({
            [event.target.name]: event.target.checked
        });
    };

    handleSubmit(event) {
        if (this.state.dataProtectionCheck === true && this.state.termsOfUseCheck === true) {
            event.preventDefault();
            let email = this.state.email;
            let pwd = this.state.pwd;
            let username = this.state.username;
            let sex = this.state.sex;

            this.setState({
                registerInProcess: true
            });

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
                    if (data['status'] === true) {
                        ReactGA.event({
                            category: "Register",
                            action: "complete",
                            label: email
                        });
                        if(this.state.withOnboardingFaves === true) {
                            this.addOnboardingFaves(email);
                        } else {
                            this.setState({
                                regComplete: true,
                                registerInProcess: false
                            });
                        }
                    } else {
                        alert(`Registration failed: ${data['response']}`);
                    }
                });
        } else {
            alert('Please accept "Terms and Conditions" and "Data Protection Policy"')
        }
    }

    addOnboardingFaves(email) {
        const lookName = 'likes';
        fetch(`${window.location.origin}/api/add_look`, {
            method: 'post',
            body: JSON.stringify({email: email, look_name: lookName}),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(function(response) { return response.json(); })
            .then(data => {
                const looksArr = data.looks.sort(function(a, b){
                    if(a.look_name < b.look_name) { return -1; }
                    if(a.look_name > b.look_name) { return 1; }
                    return 0;
                });
                if (looksArr.length > 0) {
                    const prodIds = this.props.onboardingFaves.map(outfitDict => {
                        return outfitDict.prod_id
                    });
                    this.addOutfitsToLook(lookName, prodIds);
                }
            });
    }

    addOutfitsToLook = (lookName, prodIds) => {
        fetch(`${window.location.origin}/api/add_multiple_outfits`, {
            method: 'post',
            body: JSON.stringify({
                'email': this.state.email,
                'look_name': lookName,
                'prod_ids': prodIds,
                'sex': this.props.sex
            }),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(function(response) {
            return response.json();
        }).then(data => {
            if(data === 'Invalid look') {
                alert('Invalid look')
            }
            this.props.handleResultLogin(this.state.email, this.state.pwd, null);
        });
    };

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

                <div
                    style={{
                        width: '300px',
                        marginTop: '50px',
                        marginBottom: '5px'
                    }}
                >
                    <div
                        className='onboarding-sex-button'
                        style={{
                            backgroundColor: this.props.sex === 'women' && '#000000',
                            color: this.props.sex === 'women' && '#FFFFFF'
                        }}
                        onClick={() => {
                            this.setState({
                                currentStep: 1,
                                chosenOutfits: []
                            });
                            this.props.changeSex('women');
                        }}
                    >
                        HER
                    </div>
                    <div
                        className='onboarding-sex-button'
                        style={{
                            backgroundColor: this.props.sex === 'men' && '#000000',
                            color: this.props.sex === 'men' && '#FFFFFF'
                        }}
                        onClick={() => {
                            this.setState({
                                currentStep: 1,
                                chosenOutfits: []
                            });
                            this.props.changeSex('men');
                        }}
                    >
                        HIM
                    </div>
                </div>

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
                <br />
                <p>By registering you agree to:</p>
                <div
                    style={{
                        width: '100%',
                        fontSize: '0.9rem',
                        textAlign: 'left'
                    }}
                >
                    <Switch
                        checked={this.state.dataProtectionCheck}
                        onChange={this.handleSwitchChange}
                        color="primary"
                        name="dataProtectionCheck"
                        inputProps={{ 'aria-label': 'primary checkbox' }}
                    />
                    <b
                        onClick={() => {
                            const win = window.open('https://garms.io/data-protection', '_blank');
                            win.focus();
                        }}
                        style={{
                            cursor: 'pointer'
                        }}
                    >
                        Data Protection Policy
                    </b>
                </div>

                <div
                    style={{
                        width: '100%',
                        fontSize: '0.9rem',
                        textAlign: 'left'
                    }}
                >
                    <Switch
                        checked={this.state.termsOfUseCheck}
                        onChange={this.handleSwitchChange}
                        color="primary"
                        name="termsOfUseCheck"
                        inputProps={{ 'aria-label': 'primary checkbox' }}
                    />
                    <b
                        onClick={() => {
                            const win = window.open('https://garms.io/terms-conditions', '_blank');
                            win.focus();
                        }}
                        style={{
                            cursor: 'pointer'
                        }}
                    >
                        Terms and Conditions of Use
                    </b>
                </div>

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
                    <RaisedButton
                        label="Log In"
                        primary={true}
                        onClick={() => {
                            history.push('/login')
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
                    {this.state.registerInProcess === true ? (
                        <div>
                            <br />
                            <br />
                            <InfiniteSpinner />
                            <br />
                            <br />
                        </div>
                    ) : (
                        <div>
                            {this.state.regComplete ? (regSuccess) : (regForm)}
                        </div>
                    )}
                </div>
            </MuiThemeProvider>
        );
    }
}
