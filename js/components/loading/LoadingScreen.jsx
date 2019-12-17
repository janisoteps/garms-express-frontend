// Wardrobe.jsx
import React from "react";
require('../../../css/ball-atom.css');


class LoadingScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            content: null
        }
    }

    componentDidMount() {
        const content = this.props.loadingContent;
        this.setState({
            content: content
        });
    }

    render() {
        return(
            <div>
                <div
                    style={{
                        position: 'fixed',
                        top: '0',
                        width: '100vw',
                        height: '100vh',
                        zIndex: '100',
                        backgroundColor: 'rgb(248,239,220)',
                        paddingTop: '25vh'
                    }}
                >
                    {this.state.content !== null && (
                        <div
                            style={{
                                width: '100vw',
                                maxWidth: '400px',
                                margin: '0 auto',
                                fontSize: '1.1rem',
                                position: 'relative',
                                fontStyle: 'italic'
                            }}
                        >
                            <p>
                                {this.state.content.content_text}
                            </p>
                        </div>
                    )}
                    <div className="la-ball-atom la-3x">
                        <div />
                        <div />
                        <div />
                        <div />
                    </div>
                </div>
            </div>
        )
    }
}

export default LoadingScreen;