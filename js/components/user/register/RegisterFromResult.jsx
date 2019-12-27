// RegisterFromResult.jsx
import React from "react";
require('../../../../css/garms.css');
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TextField from 'material-ui/TextField';
import Loyalty from 'material-ui/svg-icons/action/loyalty';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import {Route} from 'react-router-dom';


export default class RegisterFromResult extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            pwd: '',
            username: '',
            sex: 'women',
            regComplete: false,
            imgHash: null,
            prodHash: null,
            prodInfo: null,
            navSelection: 'choice'
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
    }

    componentDidMount() {
        const queryString = window.location.search;
        if(queryString.length > 0) {
            const imgHash = window.location.search.split('id=')[1];
            this.setState({
                imgHash: imgHash
            });

            fetch(`${window.location.origin}/api/get_prod_hash`, {
                method: 'post',
                body: JSON.stringify({'img_hash': imgHash}),
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                }
            }).then(function(response) {
                return response.json();
            }).then(data => {
                this.setState({
                    prodId: data.prod_id
                });

                fetch(`${window.location.origin}/api/get_products`, {
                    method: 'post',
                    body: JSON.stringify({'prod_hashes': [data.prod_id]}),
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    }
                }).then(function(response) {
                    return response.json();
                }).then(prodData => {
                    this.setState({
                        prodInfo: prodData[0][0],
                        sex: prodData[0][0]['sex']
                    });
                })
            });
        } else {
            this.setState({
                sex: this.props.sex
            })
        }
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
                    if (this.state.prodId !== null) {
                        this.props.handleResultLogin(email, pwd, this.state.imgHash);
                    } else {
                        this.setState({
                            regComplete: true
                        });
                    }
                } else {
                    alert('Registration failed');
                }
            });
    }

    handleLogin(event) {
        event.preventDefault();
        let email = this.state.email;
        let pwd = this.state.pwd;

        this.props.handleResultLogin(email, pwd, this.state.imgHash);
        // this.props.handleLogin(email, pwd);
    }

    render() {
        const regForm = (
            <div>
                {(this.state.prodInfo !== null) && (
                    <div>
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '2fr 3fr',
                                gridTemplateRows: '3fr',
                                gridColumnGap: '0px',
                                gridRowGap: '0px',
                                width: '100vw',
                                maxWidth: '400px',
                                borderRadius: '5px',
                                boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px',
                                marginTop: '70px',
                                marginLeft: 'auto',
                                marginRight: 'auto'
                            }}
                        >
                            <div
                                style={{
                                    gridArea: '1 / 1 / 2 / 2',
                                    paddingLeft: '10px'
                                }}
                            >
                                <img
                                    alt="image"
                                    className="product-image"
                                    src={this.state.prodInfo.image_urls[0]}
                                    style={{
                                        width: '100%'
                                    }}
                                />
                            </div>
                            <div
                                style={{
                                    gridArea: '1 / 2 / 2 / 3',
                                    paddingLeft: '10px',
                                    paddingTop: '10px'
                                }}
                            >
                                <h6>Add to wardrobe:</h6>
                                <h6>{this.state.prodInfo.name}</h6>
                                <p>From {this.state.prodInfo.shop}</p>
                                <div style={{
                                    textDecoration: this.state.prodInfo.sale ? 'line-through' : 'none'
                                }}>
                                    <h6>£{this.state.prodInfo.price}</h6></div>
                                {(this.state.prodInfo.sale) && (<div style={{color: '#d6181e'}}>
                                    <h6>£{this.state.prodInfo.saleprice}</h6>
                                </div>)}
                            </div>
                        </div>
                    </div>
                )}
                {(this.state.navSelection === 'choice') && (
                    <div className="register-form">
                        <div
                            style={{
                                width: '100%'
                            }}
                        >
                            <RaisedButton
                                label="Register"
                                primary={true}
                                onClick={() => {
                                    this.setState({
                                        navSelection: 'register'
                                    })
                                }}
                                buttonStyle={{
                                    backgroundColor: 'black'
                                }}
                                style={{
                                    marginTop: '20px',
                                    width: '150px'
                                }}
                            />
                        </div>
                        <div
                            style={{
                                width: '100%'
                            }}
                        >
                            <RaisedButton
                                label="Log In"
                                primary={true}
                                onClick={() => {
                                    this.setState({
                                        navSelection: 'login'
                                    })
                                }}
                                buttonStyle={{
                                    backgroundColor: 'black'
                                }}
                                style={{
                                    marginTop: '20px',
                                    width: '150px'
                                }}
                            />
                        </div>
                    </div>
                )}
                {(this.state.navSelection === 'register') && (
                    <div className="register-form">
                        {/*<h3>Welcome to Garms app!</h3>*/}
                        {/*<h5>Register to add outfits to your wardrobe</h5>*/}
                        <br />
                        <TextField
                            hintText="Your name"
                            name="username"
                            floatingLabelText="First name:"
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
                            defaultSelected={this.state.sex}
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
                            floatingLabelText="E-mail address:"
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
                            floatingLabelText="Password:"
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
                        <br></br>
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
                        <br />
                        <br />
                        <br />

                    </div>
                )}
                {(this.state.navSelection === 'login') && (
                    <div className="register-form">
                        <TextField
                            name="email"
                            hintText="Your e-mail"
                            floatingLabelText="E-mail address:"
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
                            floatingLabelText="Password:"
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
                        <RaisedButton
                            label="Log In"
                            primary={true}
                            onClick={this.handleLogin}
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
        );

        const regSuccess = (
            <div style={{textAlign: 'center', marginTop: '30vh'}}>
                <p>Registration successful!</p>

                <Route render={({history}) => (
                    <FlatButton
                        label="Log In"
                        onClick={() => {
                            history.push('/')
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
