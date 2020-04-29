import React from "react";
require('../../../css/garms.css');


class NewVersionPopup extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div
                style={{
                    bottom: '45px',
                    left: '0',
                    position: 'fixed',
                    width: '100%'
                }}
            >
                <div
                    style={{
                        backgroundColor: '#454545',
                        width: '96%',
                        maxWidth: '400px',
                        marginLeft: '0 auto',
                        borderRadius: '5px',
                        boxShadow: '1px 1px 6px 0 rgba(0, 0, 0, 0.6)',
                        textAlign: 'center',
                        color: '#ffffff',
                        margin: '0 auto',
                        padding: '5px',
                        cursor: 'pointer'
                    }}
                    onClick={() => {window.location.reload(true)}}
                >
                    New update available. Click here to refresh and get the latest Garms.
                </div>
            </div>

        )
    }
}

export default NewVersionPopup;
