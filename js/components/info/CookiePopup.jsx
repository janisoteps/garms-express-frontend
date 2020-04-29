import React from "react";
require('../../../css/garms.css');


class CookiePopup extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div
                style={{
                    bottom: '110px',
                    left: '0',
                    position: 'fixed',
                    width: '100%'
                }}
            >
                <div
                    style={{
                        backgroundColor: '#ffffff',
                        width: '96%',
                        maxWidth: '400px',
                        marginLeft: '0 auto',
                        borderRadius: '5px',
                        boxShadow: '1px 1px 6px 0 rgba(0, 0, 0, 0.6)',
                        textAlign: 'center',
                        color: '#1c1c1c',
                        margin: '0 auto',
                        padding: '5px'
                    }}
                >
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: '3fr 1fr',
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
                            <b>This website uses cookies</b>
                            <p
                                style={{
                                    marginBottom: '0px'
                                }}
                            >
                                We use cookies to personalize content and ads, to be able to offer functions for social media and to analyze access to our website.
                            </p>
                            <a href='https://garms.io/data-protection'>Garms Data Protection Policy</a>
                        </div>
                        <div
                            style={{
                                gridArea: '1 / 2 / 2 / 3'
                            }}
                        >
                            <button
                                style={{
                                    width: '60px',
                                    height: '40px',
                                    backgroundColor: '#d4d4d4',
                                    cursor: 'pointer',
                                    borderRadius: '3px',
                                    borderWidth: '0px',
                                    marginTop: 'calc(50% + 5px)'
                                }}
                                onClick={() => {this.props.closeCookiePopup()}}
                            >
                                OK
                            </button>
                        </div>
                    </div>

                </div>
            </div>

        )
    }
}

export default CookiePopup;
