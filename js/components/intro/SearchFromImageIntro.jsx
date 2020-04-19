// SearchFromImageIntro.jsx
import React from "react";
require('../../../css/garms.css');
import { withStyles } from '@material-ui/core/styles';
import * as Scroll from 'react-scroll';

let Link       = Scroll.Link;
let Element    = Scroll.Element;
let Events     = Scroll.Events;
let scroll     = Scroll.animateScroll;

const styles = (theme) => ({
    button: {
        margin: theme.spacing.unit,
        color: "#cacaca",
        borderColor: "#cacaca"
    }
});

class SearchFromImageIntro extends React.Component  {
    constructor(props) {
        super(props);
        this.state = {
            username: this.props.username,
            introStep: 0
        };

        this.scrollTo = this.scrollTo.bind(this);
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.completeFirstLogin = this.completeFirstLogin.bind(this);
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    scrollTo = (px) => {
        if (px === 0) {
            this.completeFirstLogin();
        }
        scroll.scrollTo(px);
    };

    componentDidMount() {
        this.updateWindowDimensions();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        this.setState({
            viewPortWidth: window.innerWidth,
            viewPortHeight: window.innerHeight
        });
    }

    completeFirstLogin() {
        this.props.completeFirstLogin()
    }

    // --------------------- MAIN RENDER ---------------------
    render () {
        const ArrowDown = () => {
            return (
                <div>
                    <div className="arrow arrow-first"/>
                    <div className="arrow arrow-second"/>
                </div>
            )
        };

        return (
            <div>
                <div
                    className="element"
                    id="containerElement"
                    style={{
                        height: "100vh",
                        top: 0,
                        overflow: "scroll",
                        paddingTop: "200px",
                        marginTop: "50px"
                    }}
                >
                    <Element
                        name="firstInsideContainer"
                        style={{
                            position: "absolute",
                            top: 0,
                            display: "inner-block",
                            width: "100vw",
                            height: "calc(100vh)",
                            backgroundColor: "rgba(0,0,0, 0.9)",
                            color: "#cacaca",
                            padding: "20px",
                            cursor: "pointer"
                        }}
                        onClick={() => {this.scrollTo(this.state.viewPortHeight)}}
                    >

                        <div style={{
                            marginTop: "calc(50vh - 200px)",
                            textAlign: "center"
                        }}>
                            <h3>More than just a results page</h3>
                            <br/>
                            <h5>Each result card has intelligent actions</h5>
                            <br/>
                            <ArrowDown />
                        </div>
                    </Element>

                    <Element
                        name="secondInsideContainer"
                        style={{
                            position: "absolute",
                            left: 0,
                            top: "100vh",
                            width: "100vw",
                            height: "calc(100vh)",
                            backgroundColor: "rgba(0,0,0, 0.9)",
                            color: "#cacaca",
                            cursor: "pointer"
                        }}
                        onClick={() => {this.scrollTo(2 * this.state.viewPortHeight)}}
                    >
                        <div style={{
                            marginTop: "calc(45vh)",
                            width: "100%",
                            textAlign: "center"
                        }}>

                            <img
                                src={require('./../../../images/actions_search.png')}
                                style={{
                                    width: "100px",
                                    height: '100px',
                                    display: 'inline-block',
                                    marginTop: "50px",
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    boxShadow: "0px 0px 50px 10px rgba(0,0,0,1)",
                                    position: "absolute",
                                    left: "calc(50vw - 50px)",
                                    top: "calc(15vh)"
                                }}
                            />
                            <h5>New search based on any result card</h5>
                            <br/>
                            <Link
                                to="firstInsideContainer"
                                containerId="containerElement"
                                style={{
                                    cursor: "pointer"
                                }}
                            >
                                <ArrowDown />
                            </Link>
                        </div>
                    </Element>

                    <Element
                        name="thirdInsideContainer"
                        style={{
                            position: "absolute",
                            left: 0,
                            top: "200vh",
                            width: "100vw",
                            height: "calc(100vh)",
                            backgroundColor: "rgba(0,0,0, 0.9)",
                            color: "#cacaca",
                            cursor: "pointer"
                        }}
                        onClick={() => {this.scrollTo(3 * this.state.viewPortHeight)}}
                    >
                        <div style={{
                            marginTop: "calc(45vh)",
                            width: "100%",
                            textAlign: "center"
                        }}>

                            <img
                                src={require('./../../../images/actions_colorpick.jpg')}
                                style={{
                                    width: '100px',
                                    height: '100px',
                                    display: 'inline-block',
                                    marginTop: "50px",
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    boxShadow: "0px 0px 50px 10px rgba(0,0,0,1)",
                                    position: "absolute",
                                    left: "calc(50vw - 50px)",
                                    top: "calc(15vh)"
                                }}
                            />
                            <h5>New search with specific color</h5>
                            <br/>
                            <ArrowDown />
                        </div>
                    </Element>

                    <Element
                        name="fourthInsideContainer"
                        style={{
                            position: "absolute",
                            left: 0,
                            top: "300vh",
                            width: "100vw",
                            height: "calc(100vh)",
                            backgroundColor: "rgba(0,0,0, 0.9)",
                            color: "#cacaca",
                            cursor: "pointer"
                        }}
                        onClick={() => {this.scrollTo(4 * this.state.viewPortHeight)}}
                    >
                        <div style={{
                            marginTop: "calc(45vh)",
                            width: "100%",
                            textAlign: "center"
                        }}>

                            <img
                                src={require('./../../../images/baseline-tune-24px.svg')}
                                style={{
                                    width: '100px',
                                    height: '100px',
                                    display: 'inline-block',
                                    marginTop: "50px",
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    // boxShadow: "0px 0px 50px 10px rgba(0,0,0,1)",
                                    position: "absolute",
                                    left: "calc(50vw - 50px)",
                                    top: "calc(15vh)",
                                    filter: 'invert(1)'
                                }}
                            />
                            <h5>Add either positive or negative tag</h5>
                            <h5>For example more denim or less ruffle</h5>
                            <br/>
                            <ArrowDown />
                        </div>
                    </Element>

                    <Element
                        name="fifthInsideContainer"
                        style={{
                            position: "absolute",
                            left: 0,
                            top: "400vh",
                            width: "100vw",
                            height: "calc(100vh)",
                            backgroundColor: "rgba(0,0,0, 0.9)",
                            color: "#cacaca",
                            cursor: "pointer"
                        }}
                        onClick={() => {this.scrollTo(5 * this.state.viewPortHeight)}}
                    >
                        <div style={{
                            marginTop: "calc(45vh)",
                            width: "100%",
                            textAlign: "center"
                        }}>

                            <img
                                src={require('./../../../images/hanger_small.png')}
                                style={{
                                    width: '100px',
                                    height: '100px',
                                    display: 'inline-block',
                                    marginTop: "50px",
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    // boxShadow: "0px 0px 50px 10px rgba(0,0,0,1)",
                                    position: "absolute",
                                    left: "calc(50vw - 50px)",
                                    top: "calc(15vh)"
                                }}
                            />
                            <h5>Add item to wardrobe</h5>
                            <h5>Organise your wardrobe in looks, for example <i>summer</i> or <i>office</i></h5>
                            <br/>
                            <ArrowDown />
                        </div>
                    </Element>

                    <Element
                        name="sixthInsideContainer"
                        style={{
                            position: "absolute",
                            left: 0,
                            top: "500vh",
                            width: "100vw",
                            height: "calc(100vh)",
                            backgroundColor: "rgba(0,0,0, 0.9)",
                            color: "#cacaca",
                            cursor: "pointer"
                        }}
                        onClick={() => {this.scrollTo(0)}}
                    >
                        <div style={{
                            marginTop: "calc(45vh)",
                            width: "100%",
                            textAlign: "center"
                        }}>

                            <img
                                src={require('./../../../images/shopping-cart.svg')}
                                style={{
                                    width: '100px',
                                    height: '100px',
                                    display: 'inline-block',
                                    marginTop: "50px",
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    // boxShadow: "0px 0px 50px 10px rgba(0,0,0,1)",
                                    position: "absolute",
                                    left: "calc(50vw - 50px)",
                                    top: "calc(15vh)",
                                    filter: 'invert(1)'
                                }}
                            />
                            <h5>Open product page</h5>
                            <h5>For the moments when you just need it now</h5>
                            <br/>
                            <ArrowDown />
                        </div>
                    </Element>
                </div>
            </div>
        )
    }
}

export default withStyles(styles)(SearchFromImageIntro);
