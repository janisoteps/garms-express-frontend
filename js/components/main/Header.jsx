import React from "react";
// import { Button, Grid, Row, Col } from "react-bootstrap";
require('../../../css/garms.css');
import RaisedButton from 'material-ui/RaisedButton';
import {Link} from 'react-router-dom';
import {Route} from 'react-router-dom';
import Tooltip from '@material-ui/core/Tooltip';


class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isAuth: this.props.isAuth
        };
    }

    render() {
        const buttons = this.state.isAuth === "true" ? (
            <div style={{width: '100vw'}}>
                <Route render={({history}) => (
                    <Tooltip title="Deal Finder">
                        <div className="deal-button" onClick={() => {
                            history.push('/deals')
                        }}>
                        </div>
                    </Tooltip>
                )}/>
                <Route render={({history}) => (
                    <Tooltip title="Your Profile">
                        <div className="profile-button" onClick={() => {
                            history.push('/profile')
                        }}>
                        </div>
                    </Tooltip>
                )}/>
                <Route render={({history}) => (
                    <Tooltip title="Your Favorites">
                        <div className="favorites-button" onClick={() => {
                            history.push('/wardrobe')
                        }}>
                        </div>
                    </Tooltip>
                )}/>
            </div>
        ) : (
            <div style={{width: '100vw'}}>
                <Route render={({history}) => (
                    <div style={{
                        paddingTop: '7px',
                        paddingRight: '7px'
                    }}>
                        <RaisedButton
                            label="Log In"
                            primary={false}
                            onClick={() => {
                                history.push('/login')
                            }}
                        />
                    </div>
                )}/>
            </div>
        );

        return (
            <div className="header-bar">
                <div className="logo">
                    <h1>
                        <Link style={{textDecoration: 'none', color: '#171732'}} to="/">
                            <img
                                src={require('../../../images/garms_logo.png')}
                                style={{
                                    height: '34px',
                                    width: 'auto',
                                    marginTop: '8px',
                                    marginLeft: '8px'
                                }}
                            />
                        </Link>
                    </h1>
                </div>
                {buttons}
            </div>
        )
    }
}

export default Header;
