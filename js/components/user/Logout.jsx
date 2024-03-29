// Register.jsx
import React from "react";
require('../../../css/garms.css');
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import {withCookies, Cookies} from 'react-cookie';
import {instanceOf} from 'prop-types';
import ReactGA from 'react-ga';


class Logout extends React.Component {
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
        this.handleLogout = this.handleLogout.bind(this);
    }

    componentDidMount() {
        ReactGA.pageview(window.location.pathname + window.location.search);
    }

    handleLogout(event) {
        // alert('A name was submitted: ' + this.state.value);
        event.preventDefault();
        const {cookies} = this.props;

        this.setState({
            isAuth: false
        });
        cookies.set('isAuth', false, {path: '/'});
        cookies.set('email', '', {path: '/'});
        cookies.set('sex', 'women', {path: '/'});
        cookies.set('username', '', {path: '/'});
        cookies.set('first_login', '0', {path: '/'});
        document.location.href="/";

        ReactGA.event({
            category: "Log Out",
            action: "Log-out complete",
        });
    }

    render() {
        const logOutTile = this.state.isAuth == true || this.state.isAuth == "true" ? (
            <div className="register-form">
                <p>Log out from Garms</p>
                <RaisedButton
                    label="Log Out"
                    primary={true}
                    onClick={this.handleLogout}
                    buttonStyle={{
                        backgroundColor: 'black'
                    }}
                />
            </div>
        ) : (
            <div className="register-form">
                <p>Thank you for being part of fashion revolution!</p>
            </div>
        );

        return (
            <MuiThemeProvider>
                <div>
                    {logOutTile}
                </div>
            </MuiThemeProvider>
        );
    }
}

export default withCookies(Logout);
