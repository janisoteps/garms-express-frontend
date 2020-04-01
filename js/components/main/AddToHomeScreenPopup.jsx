import React from "react";
require('../../../css/garms.css');

class AddToHomeScreenPopup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isAuth: this.props.isAuth
        };
    }

    render() {
        return (
            <div
                style={{
                    position: 'fixed',
                    bottom: '10',
                    left: '0',
                    backgroundColor: '#f8f8f8',
                    width: '96%',
                    marginLeft: '2%',
                    borderRadius: '5px',
                    boxShadow: '1px 1px 6px 0 rgba(0, 0, 0, 0.6)',
                    textAlign: 'center'
                }}
            >
                <div
                    // style={{
                    //     display: 'grid',
                    //     gridTemplateColumns: '1fr 4fr',
                    //     gridTemplateRows: '1fr',
                    //     gridColumnGap: '0px',
                    //     gridRowGap: '0px'
                    // }}
                >
                    Install Garms on your iPhone: tap
                    <img
                        src={require('../../../images/ios_share_button.png')}
                        style={{
                            width: '30px',
                            height: 'auto',
                            marginTop: '3px',
                            display: 'inline-block'
                        }}
                    />
                    and then Add to Home Screen.
                    <img
                        src={require('../../../images/add_to_home_screen_icon.png')}
                        style={{
                            width: '50px',
                            height: 'auto',
                            marginTop: '8px',
                            marginLeft: '8px',
                            display: 'inline-block'
                        }}
                    />
                </div>
                <div
                    style={{
                        width: '100%',
                        textAlign: 'center'
                    }}
                >
                    <button className="ok-button-pwa" onClick={() => {
                        this.props.closeShowInstallPopup();
                    }} >OK</button>
                </div>
            </div>
        )
    }
}

export default AddToHomeScreenPopup;
