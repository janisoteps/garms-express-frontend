import React from "react";
require('../../../css/garms.css');
import {Route} from 'react-router-dom';

class StandaloneIOSNav extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isAuth: this.props.isAuth
        };
        this.triggerShare = this.triggerShare.bind(this);
    }

    triggerShare = () => {
        if (navigator.share) {
            navigator.share({
                title: 'Garms',
                url: 'https://garms.io'
            }).then(() => {
                console.log('Add Garms to Home Screen!');
            })
                .catch(console.error);
        } else {
            alert('This browser does not support Share Option')
        }
    };

    render () {
        return (
            <div
                style={{
                    position: 'fixed',
                    bottom: '0',
                    left: '0',
                    backgroundColor: '#f8f8f8',
                    width: '100vw',
                    height: '40px',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr) 2fr',
                    gridTemplateRows: '1fr',
                    gridColumnGap: '0px',
                    gridRowGap: '0px'
                }}
            >
                <div
                    style={{
                        gridArea: '1 / 1 / 2 / 2'
                    }}
                >
                    <Route render={({history}) => (
                        <img
                            src={require('../../../images/ios-back-btn.png')}
                            style={{
                                width: '30px',
                                height: 'auto',
                                marginTop: '5px',
                                marginLeft: '10px',
                                display: 'inline-block'
                            }}
                            onClick={() => {history.goBack()}}
                        />
                    )} />
                </div>
                <div
                    style={{
                        gridArea: '1 / 2 / 2 / 3'
                    }}
                >
                    <Route render={({history}) => (
                        <img
                            src={require('../../../images/ios-fwd-btn.png')}
                            style={{
                                width: '30px',
                                height: 'auto',
                                marginTop: '5px',
                                marginLeft: '10px',
                                display: 'inline-block'
                            }}
                            onClick={() => {history.goForward()}}
                        />
                    )} />
                </div>
                <div
                    style={{
                        gridArea: '1 / 3 / 2 / 4',
                        textAlign: 'center'
                    }}
                >
                    <img
                        src={require('../../../images/ios-share-btn.png')}
                        style={{
                            width: '30px',
                            height: 'auto',
                            marginTop: '5px',
                            display: 'inline-block'
                        }}
                        onClick={() => {this.triggerShare()}}
                    />
                </div>
                <div
                    style={{
                        gridArea: '1 / 4 / 2 / 5'
                    }}
                >

                </div>
            </div>
        )
    }
}

export default StandaloneIOSNav;
