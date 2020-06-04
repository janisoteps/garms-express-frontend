// Profile.jsx
import React from "react";
require('../../../css/garms.css');
import {Route} from 'react-router-dom';
import RaisedButton from 'material-ui/RaisedButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import ReactGA from 'react-ga';


class Profile extends React.Component  {
    constructor(props) {
        super(props);
        this.state = {
            isAuth: this.props.isAuth,
            username: this.props.username,
            email: this.props.email,
            insta_pics: null,
            insta_username: null,
            insta_username_prompt: 'Your Instagram username',
            loaded: false,
            rangeVal: 0
        };

        // this.changeInstaUsername = this.changeInstaUsername.bind(this);
        // this.saveInstaUsername = this.saveInstaUsername.bind(this);
        // this.getInstaPicks = this.getInstaPicks.bind(this);
        this.updateRange = this.updateRange.bind(this);

    }

    componentDidMount() {
        ReactGA.pageview(window.location.pathname + window.location.search);
    }

    updateRange(val) {
        this.setState({
            rangeVal: val
        })
    }


    // --------------------- MAIN RENDER ---------------------
    render () {
        const rangeVal = this.state.rangeVal;
        const logOutButton = this.state.isAuth === "true" ? (
            <Route render={({ history }) => (
                <RaisedButton
                    style={{
                        maxWidth: '170px',
                        minWidth: '170px',
                        marginTop: '20px'
                    }}
                    label="Log Out"
                    onClick={() => { history.push('/logout') }} />
            )} />
        ) : (
            <Route render={({ history }) => (
                <RaisedButton className="login-button" label="Log In" onClick={() => { history.push('/login') }} />
            )} />
        );
        const ChangePwButton = () => {
            return (
                <Route render={({ history }) => (
                    <RaisedButton
                        style={{
                            maxWidth: '170px',
                            minWidth: '170px',
                            marginTop: '-10px'
                        }}
                        label="Change Password"
                        onClick={() => { history.push('/password-reset') }}
                    />
                )} />
            )
        };

        let greetingStyle = {
            textAlign: 'center',
            marginTop: '70px'
        };

        return (
            <MuiThemeProvider>
                <div className="profile-product-list">
                    <h4 style={greetingStyle}>Hi {this.state.username}!</h4>
                    <p>Your account details</p>
                    <hr />
                    <br></br>
                    <p>Registered email: <b>{this.state.email}</b></p>
                    {/*<form onSubmit={this.saveInstaUsername}>*/}
                        {/*<label>*/}
                            {/*Your Instagram username:*/}
                            {/*<input type="text" value={this.state.insta_username_prompt} onChange={this.changeInstaUsername} />*/}
                        {/*</label>*/}
                        {/*<input style={saveBtnStyle} type="submit" value="Save" />*/}
                    {/*</form>*/}
                    {/*<br />*/}
                    {/*<hr />*/}
                    {/*<br />*/}
                    {/*<p>Here you will find your Instagram picks</p>*/}
                    {/*<br />*/}
                    {/*<div className="result-pane">*/}
                        {/*{instaPrompt !== null && instaPrompt}*/}
                        {/*{instaList !== null && instaList}*/}
                    {/*</div>*/}
                    {/*<br />*/}
                    <br />
                    {this.state.isAuth && (
                        <ChangePwButton/>
                    )}
                    <br />
                    {logOutButton}

                    <br />
                    <br />
                </div>
            </MuiThemeProvider>
        )
    }
}

export default Profile;
