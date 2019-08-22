// Profile.jsx
import React from "react";
require('../../../css/garms.css');
import {Route} from 'react-router-dom';
import RaisedButton from 'material-ui/RaisedButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper';


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
            loaded: false
        };

        this.changeInstaUsername = this.changeInstaUsername.bind(this);
        this.saveInstaUsername = this.saveInstaUsername.bind(this);
        this.getInstaPicks = this.getInstaPicks.bind(this);
    }

    componentDidMount() {
        this.getInstaPicks(this.state.email);
    }

    getInstaPicks(user_email) {
        let searchString = window.location.origin + '/api/insta_pics?email=' + user_email;

        fetch(searchString, {
            method: 'get',
        }).then(function(response) {
            return response.json();
        }).then(data => {
            console.log(data.res);
            let usernamePrompt = !data.insta_username ? 'Instagram username' : data.insta_username;
            this.setState({
                insta_pics: data.res,
                insta_username: data.insta_username,
                insta_username_prompt: usernamePrompt,
                loaded: true
            });
        });
    }

    changeInstaUsername(event) {
        this.setState({insta_username_prompt: event.target.value});
    }

    saveInstaUsername(event) {
        console.log('Username was submitted: ' + this.state.insta_username_prompt);
        event.preventDefault();

        fetch(window.location.origin + '/api/save_insta_username', {
            method: 'post',
            body: JSON.stringify({
                email: this.state.email,
                insta_username: this.state.insta_username_prompt
            }),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(function(response) { return response.json(); })
            .then(data => {
                console.log('Save Insta username response: ' , data);
                if (data.insta_username !== false) {
                    this.setState({
                        insta_username: data.insta_username
                    });

                    this.getInstaPicks(this.state.email);
                }
            });
    }


    // --------------------- MAIN RENDER ---------------------
    render () {
        const logOutButton = this.state.isAuth === "true" ? (
            <Route render={({ history }) => (
                <RaisedButton className="login-button" label="Log Out" onClick={() => { history.push('/logout') }} />
            )} />
        ) : (
            <Route render={({ history }) => (
                <RaisedButton className="login-button" label="Log In" onClick={() => { history.push('/login') }} />
            )} />
        );

        let greetingStyle = {
            textAlign: 'center',
            marginTop: '70px'
        };

        let insta_tiles = this.state.insta_pics && this.state.insta_pics !== 0 ? this.state.insta_pics.reverse().map(insta => {
            let insta_pic = insta[0];
            let mediaType = insta_pic.media_type;
            let mediaUrl = insta_pic.media_url;
            let mediaPermalink = insta_pic.media_permalink;
            let mediaId = insta_pic.media_id;
            let ownerUsername = insta_pic.owner_username;

            if (mediaType === 'IMAGE') {
                return (
                    <Paper zDepth={1} className="profile-product-tile" key={mediaId}>
                        <a href={mediaPermalink} target="_blank">Image by {ownerUsername} on Instagram</a>
                        <img className="product-image" src={mediaUrl} />
                        <Route render={({ history }) => (
                            <div
                                style={{marginTop: '15px', cursor: 'pointer'}}
                                onClick={() => { history.push('/search-from-image?=' + encodeURIComponent(mediaUrl)) }}
                            >
                                <div className="search-from-url" /> <h4>Search from this image</h4>
                            </div>
                        )} />
                    </Paper>
                )
            }
        }) : null;

        let instaPrompt = null;
        if (!this.state.loaded) {
            instaPrompt = <p>Loading your Instagram picks</p>
        } else if (!this.state.insta_username) {
            instaPrompt = <p>Find any image you like on Instagram and comment @garms.io to shop from it</p>
        } else if (!this.state.insta_pics) {
            instaPrompt = <p>Find any image you like on Instagram and comment @garms.io to shop from it</p>
        } else if (this.state.insta_pics.length === 0) {
            instaPrompt = <p>Find any image you like on Instagram and comment @garms.io to shop from it</p>
        } else {
            instaPrompt = null;
        }

        console.log('Insta pics length: ', this.state.insta_pics && this.state.insta_pics.length);
        let instaList = null;
        if (this.state.insta_pics && this.state.insta_pics.length > 0) {
            instaList = insta_tiles;
        }

        let saveBtnStyle = {
            color: 'white',
            backgroundColor: 'black',
            borderWidth: '0px',
            borderRadius: '4px',
            marginLeft: '10px',
            cursor: 'pointer'
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
                    <br />
                    {logOutButton}
                </div>
            </MuiThemeProvider>
        )
    }
}

export default Profile;
