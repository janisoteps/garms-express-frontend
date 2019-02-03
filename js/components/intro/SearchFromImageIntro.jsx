// SearchFromImageIntro.jsx
import React from "react";
require('../../../css/garms.css');
// import {Route} from 'react-router-dom';
// import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
// import Button from '@material-ui/core/Button';
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

        // this.classes = this.props.classes;
        console.log(this.props);

        this.scrollTo = this.scrollTo.bind(this);
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.completeFirstLogin = this.completeFirstLogin.bind(this);
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    scrollTo = (px) => {
        console.log(`Scrolling by ${px}`);
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
        // const { classes } = this.props;
        console.log('Rendering');

        const ArrowDown = () => {
            return (
                <div>
                    <div className="arrow arrow-first"/>
                    <div className="arrow arrow-second"/>
                </div>
            )
        };

        // const ResultIntro = () => {
        //     const { classes } = this.props;
        //
        //     const introPickerBgUrl = 'url("data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9JzIwMCcgd2lkdGg9JzIwMCcgIGZpbGw9IiNmZ'
        //         + 'mZmZmYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnL'
        //         + 'zE5OTkveGxpbmsiIHZlcnNpb249IjEuMSIgeD0iMHB4IiB5PSIwcHgiIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiBzdHlsZT0iZ'
        //         + 'W5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAxMDAgMTAwOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PHBhdGggZD0iTTk0LjksM'
        //         + 'TcuNmMtMC44LTUuNy00LTguNi02LjYtMTAuNWMtMi45LTIuMS02LjYtMi42LTkuOS0xLjNjLTMuNSwxLjMtNiwzLjktOC42L'
        //         + 'DYuNWMtMywzLjItNi4yLDYuMi05LjMsOS4zICBjLTMuMS0yLTQuOC0xLjgtNy4zLDAuNmMtMS41LDEuNS0zLDIuOS00LjQsN'
        //         + 'C40Yy0xLjUsMS42LTEuNyw0LjItMC4yLDUuOGMwLjcsMC44LDEuNywxLjMsMi43LDJjLTEuMSwwLjktMS42LDEuMy0yLDEuN'
        //         + 'yAgQzM4LDQ3LjQsMjYuNiw1OC44LDE1LjIsNzAuMWMtMi42LDIuNi00LjcsNS40LTUuNyw5LjFjLTAuNSwyLTEuNywzLjktM'
        //         + 'i44LDUuNmMtMC4yLDAuMy0wLjQsMC41LTAuNiwwLjhjLTEuNywyLjMtMS42LDUuNCwwLjQsNy40ICBjMC4xLDAuMSwwLjIsM'
        //         + 'C4yLDAuMiwwLjJjMiwyLDUsMi4xLDcuMywwLjVjMCwwLDAsMCwwLjEsMGMxLjctMS4yLDMuMy0yLjgsNS4yLTMuMWM0LjItM'
        //         + 'C45LDcuNS0zLDEwLjQtNkM0MS4zLDczLjQsNTIuNiw2Miw2NCw1MC43ICBjMC41LTAuNSwxLTAuOSwxLjgtMS43YzAuNSwwL'
        //         + 'jcsMC44LDEuMywxLjMsMS44YzIuMiwyLjMsNC42LDIuMiw2LjksMGMxLjItMS4yLDIuNC0yLjQsMy42LTMuNmMyLjktMi45L'
        //         + 'DMuNy00LjMsMS4xLTcuOCAgYzIuNC0yLjQsNC44LTQuNyw3LjItNy4xYzMuMy0zLjQsNy4yLTYuMyw4LjctMTEuMUM5NSwyM'
        //         + 'Cw5NS4xLDE4LjgsOTQuOSwxNy42eiBNNjEuNiw0Ny4yQzQ5LjksNTguOSwzOC4yLDcwLjYsMjYuNSw4Mi4yICBjLTIuMiwyL'
        //         + 'jItNC43LDMuNi03LjcsNC40Yy0yLjMsMC42LTQuMywyLjItNi40LDMuM2MtMC4yLDAuMS0wLjQsMC4zLTAuNiwwLjRjLTAuN'
        //         + 'iwwLjUtMS41LDAuNC0yLTAuMWMwLDAsMCwwLDAsMCAgYy0wLjUtMC42LTAuNi0xLjQtMC4xLTJjMC43LTAuOSwxLjQtMS44L'
        //         + 'DItMi43YzAuOC0xLjMsMS41LTIuOCwxLjgtNC4zYzAuNi0yLjksMS45LTUuMywzLjktNy4zYzEyLjEtMTIuMSwyNC4yLTI0L'
        //         + 'jIsMzYuMS0zNi4xICBjMi45LDIuOCw1LjcsNS43LDguNyw4LjdDNjIuMiw0Ni41LDYxLjksNDYuOSw2MS42LDQ3LjJ6Ij48L'
        //         + '3BhdGg+PC9zdmc+")';
        //
        //     return (
        //         <div style={{
        //             position: "fixed",
        //             top: 0,
        //             left: 0,
        //             width: "100vw",
        //             height: "100vh",
        //             backgroundColor: "rgba(0,0,0, 0.95)",
        //             color: "#cacaca",
        //             overflow: "scroll"
        //         }}>
        //             <div style={{
        //                 marginTop: "150px",
        //                 width: "100%",
        //                 height: "100vh",
        //                 textAlign: "center"
        //             }}>
        //                 <h3>More than just a results page</h3>
        //                 <br/>
        //                 <h5>Each result card has intelligent actions</h5>
        //                 <br/>
        //                 <ArrowDown />
        //                 <div>
        //                     <div style={{
        //                         display: "table-cell",
        //                         verticalAlign: "middle",
        //                         horizontalAlign: "center",
        //                         backgroundImage: 'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij4gICAgPHBhdGggZD0iTTE1LjUgMTRoLS43OWwtLjI4LS4yN0MxNS40MSAxMi41OSAxNiAxMS4xMSAxNiA5LjUgMTYgNS45MSAxMy4wOSAzIDkuNSAzUzMgNS45MSAzIDkuNSA1LjkxIDE2IDkuNSAxNmMxLjYxIDAgMy4wOS0uNTkgNC4yMy0xLjU3bC4yNy4yOHYuNzlsNSA0Ljk5TDIwLjQ5IDE5bC00Ljk5LTV6bS02IDBDNy4wMSAxNCA1IDExLjk5IDUgOS41UzcuMDEgNSA5LjUgNSAxNCA3LjAxIDE0IDkuNSAxMS45OSAxNCA5LjUgMTR6Ii8+ICAgIDxwYXRoIGQ9Ik0wIDBoMjR2MjRIMHoiIGZpbGw9Im5vbmUiLz48L3N2Zz4=")',
        //                         backgroundSize: "48px 48px",
        //                         width: "64px",
        //                         height: "64px"
        //                     }} />
        //                     <div className="search-choice-text">
        //                         <h5>New search based on any result card</h5>
        //                     </div>
        //                 </div>
        //                 <div>
        //                     <div style={{
        //                         display: "table-cell",
        //                         verticalAlign: "middle",
        //                         horizontalAlign: "center",
        //                         background: `url('${introPickerBgUrl}') no-repeat center`,
        //                         backgroundSize: "48px 48px",
        //                         width: "64px",
        //                         height: "64px"
        //                     }} />
        //                     <div className="search-choice-text">
        //                         <h5>New search with specific color</h5>
        //                     </div>
        //                 </div>
        //                 <div>
        //                     <div style={{
        //                         width: "64px",
        //                         height: "64px",
        //                         backgroundColor: "#000000",
        //                         backgroundSize: "48px 48px",
        //                         borderRadius: "32px",
        //                         cursor: "pointer",
        //                         overflow: "hidden",
        //                         textAlign: "left"
        //                     }}>
        //                         <div style={{
        //                             position: "relative",
        //                             display: "inline-block",
        //                             top: "8px",
        //                             left: "5px",
        //                             width: "32px",
        //                             height: "32px",
        //                             backgroundColor: "#FFFFFF",
        //                             backgroundImage: "url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij4gICAgPHBhdGggZD0iTTE5IDEzaC02djZoLTJ2LTZINXYtMmg2VjVoMnY2aDZ2MnoiLz4gICAgPHBhdGggZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPjwvc3ZnPg==)",
        //                             backgroundSize: "42px 42px",
        //                             filter: "invert(100%)",
        //                         }}/>
        //                         <div style={{
        //                             position: "relative",
        //                             display: "inlineBlock",
        //                             top: "27px",
        //                             right: "4px",
        //                             width: "32px",
        //                             height: "32px",
        //                             backgroundColor: "#FFFFFF",
        //                             backgroundImage: "url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij4gICAgPHBhdGggZD0iTTE5IDEzSDV2LTJoMTR2MnoiLz4gICAgPHBhdGggZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPjwvc3ZnPg==)",
        //                             backgroundSize: "42px 42px",
        //                             filter: "invert(100%)"
        //                         }}/>
        //                     </div>
        //                     <div className="search-choice-text">
        //                         <h5>Add either positive or negative tag</h5>
        //                         <h5>For example more denim or less ruffles</h5>
        //                     </div>
        //                 </div>
        //                 <div>
        //                     <div style={{
        //                         width: "64px",
        //                         height: "64px",
        //                         backgroundColor: "#FFFFFF",
        //                         backgroundImage: "url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij4gICAgPHBhdGggZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPiAgICA8cGF0aCBkPSJNMTYuNSAzYy0xLjc0IDAtMy40MS44MS00LjUgMi4wOUMxMC45MSAzLjgxIDkuMjQgMyA3LjUgMyA0LjQyIDMgMiA1LjQyIDIgOC41YzAgMy43OCAzLjQgNi44NiA4LjU1IDExLjU0TDEyIDIxLjM1bDEuNDUtMS4zMkMxOC42IDE1LjM2IDIyIDEyLjI4IDIyIDguNSAyMiA1LjQyIDE5LjU4IDMgMTYuNSAzem0tNC40IDE1LjU1bC0uMS4xLS4xLS4xQzcuMTQgMTQuMjQgNCAxMS4zOSA0IDguNSA0IDYuNSA1LjUgNSA3LjUgNWMxLjU0IDAgMy4wNC45OSAzLjU3IDIuMzZoMS44N0MxMy40NiA1Ljk5IDE0Ljk2IDUgMTYuNSA1YzIgMCAzLjUgMS41IDMuNSAzLjUgMCAyLjg5LTMuMTQgNS43NC03LjkgMTAuMDV6Ii8+PC9zdmc+)",
        //                         filter: "invert(100%)",
        //                         backgroundSize: "48px 48px",
        //                         borderRadius: "32px",
        //                         cursor: "pointer"
        //                     }} />
        //                     <div className="search-choice-text">
        //                         <h5>Add item to favorites</h5>
        //                         <h5>From favorites you can then continue with purchase</h5>
        //                     </div>
        //                 </div>
        //                 <br/>
        //                 <Button
        //                     variant="outlined"
        //                     className={classes.button}
        //                     size="large"
        //                     onClick={() => {this.goToStep(1)}}
        //                 >
        //                     Continue
        //                 </Button>
        //             </div>
        //         </div>
        //     )
        // };

        // const IntroStep = () => {
        //     console.log(`Showing intro step: ${this.state.introStep}`);
        //     const steps = {
        //         0: (
        //             <div style={{
        //                 position: "absolute",
        //                 top: 0,
        //                 left: 0,
        //                 width: "100vw",
        //                 height: "100vh",
        //                 backgroundColor: "rgba(0,0,0, 0.95)",
        //                 color: "#cacaca"
        //             }}>
        //                 <div style={{
        //                     marginTop: "150px",
        //                     width: "100%",
        //                     textAlign: "center"
        //                 }}>
        //                     <h1>Hi {this.state.username}!</h1>
        //                     <h1>Welcome to Garms</h1>
        //                     <h3>A new way to shop</h3>
        //                     <br/>
        //                     <h5>Search visually similar items</h5>
        //                     <h5>Don't stop there, keep exploring</h5>
        //                     <br/>
        //                     <Button
        //                         variant="outlined"
        //                         className={classes.button}
        //                         size="large"
        //                         onClick={() => {this.goToStep(1)}}
        //                     >
        //                         Show Me Around
        //                     </Button>
        //                 </div>
        //             </div>
        //         ),
        //         1: (
        //             <div>
        //                 <div style={{
        //                     position: "absolute",
        //                     top: 0,
        //                     left: 0,
        //                     width: "100vw",
        //                     height: "calc(31vh + 50px)",
        //                     backgroundColor: "rgba(0,0,0, 0.4)",
        //                     color: "#cacaca"
        //                 }}>
        //                 </div>
        //                 <div style={{
        //                     position: "absolute",
        //                     top: "calc(31vh + 50px)",
        //                     left: 0,
        //                     width: "100vw",
        //                     height: "calc(69vh - 50px)",
        //                     backgroundColor: "rgba(0,0,0, 0.95)",
        //                     color: "#cacaca"
        //                 }}>
        //                     <div style={{
        //                         marginTop: "150px",
        //                         width: "100%",
        //                         textAlign: "center"
        //                     }}>
        //                         <h5>Start your exploration by typing</h5>
        //                         <br/>
        //                         <Button
        //                             variant="outlined"
        //                             className={classes.button}
        //                             size="large"
        //                             onClick={() => {this.goToStep(2)}}
        //                         >
        //                             Continue
        //                         </Button>
        //                     </div>
        //                 </div>
        //             </div>
        //         ),
        //         2: (
        //             <div>
        //                 <div style={{
        //                     position: "absolute",
        //                     top: 0,
        //                     left: 0,
        //                     width: "100vw",
        //                     height: "calc(32vh + 50px)",
        //                     backgroundColor: "rgba(0,0,0, 0.95)",
        //                     color: "#cacaca"
        //                 }}>
        //                 </div>
        //                 <div style={{
        //                     position: "absolute",
        //                     top: "calc(32vh + 50px)",
        //                     left: 0,
        //                     width: "100vw",
        //                     height: "calc(29vh)",
        //                     backgroundColor: "rgba(0,0,0, 0.4)",
        //                     color: "#cacaca"
        //                 }}>
        //                 </div>
        //                 <div style={{
        //                     position: "absolute",
        //                     top: "calc(61vh + 50px)",
        //                     left: 0,
        //                     width: "100vw",
        //                     height: "calc(39vh - 50px)",
        //                     backgroundColor: "rgba(0,0,0, 0.95)",
        //                     color: "#cacaca"
        //                 }}>
        //                     <div style={{
        //                         marginTop: "20px",
        //                         width: "100%",
        //                         textAlign: "center"
        //                     }}>
        //                         <h5>Or take a picture yourself</h5>
        //                         <h5>Or take a screen shot of something you like</h5>
        //                         <h5>Start exploring by finding visually similar items</h5>
        //                         <Button
        //                             variant="outlined"
        //                             className={classes.button}
        //                             size="large"
        //                             onClick={() => {this.goToStep(3)}}
        //                         >
        //                             Continue
        //                         </Button>
        //                     </div>
        //                 </div>
        //             </div>
        //         ),
        //         3: (
        //             <div>
        //                 <div style={{
        //                     position: "absolute",
        //                     top: 0,
        //                     left: 0,
        //                     width: "100vw",
        //                     height: "calc(32vh + 50px)",
        //                     backgroundColor: "rgba(0,0,0, 0.95)",
        //                     color: "#cacaca"
        //                 }}>
        //                 </div>
        //                 <div style={{
        //                     position: "absolute",
        //                     top: "calc(32vh + 50px)",
        //                     left: 0,
        //                     width: "100vw",
        //                     height: "calc(31vh)",
        //                     backgroundColor: "rgba(0,0,0, 0.95)",
        //                     color: "#cacaca"
        //                 }}>
        //                     <div style={{
        //                         marginTop: "20px",
        //                         width: "100%",
        //                         textAlign: "center"
        //                     }}>
        //                         <h5>Or start exploring by selecting a category</h5>
        //                         <br/>
        //                         <Button
        //                             variant="outlined"
        //                             className={classes.button}
        //                             size="large"
        //                             onClick={() => {this.goToStep(4)}}
        //                         >
        //                             Choose one of the options
        //                         </Button>
        //                     </div>
        //                 </div>
        //                 <div style={{
        //                     position: "absolute",
        //                     top: "calc(63vh + 50px)",
        //                     left: 0,
        //                     width: "100vw",
        //                     height: "calc(37vh - 50px)",
        //                     backgroundColor: "rgba(0,0,0, 0.4)",
        //                     color: "#cacaca"
        //                 }}>
        //                 </div>
        //             </div>
        //         ),
        //         4: (
        //             <div />
        //         )
        //     };
        //     return steps[this.state.introStep]
        // };

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
                                src={require('./../../../images/actions_plus_minus.png')}
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
                            <h5>Add either positive or negative tag</h5>
                            <h5>For example more denim or less ruffles</h5>
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
                        onClick={() => {this.scrollTo(0)}}
                    >
                        <div style={{
                            marginTop: "calc(45vh)",
                            width: "100%",
                            textAlign: "center"
                        }}>

                            <img
                                src={require('./../../../images/actions_fav.png')}
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
                            <h5>Add item to favorites</h5>
                            <h5>From favorites you can then continue with purchase</h5>
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

{/*<div*/}
{/*style={{*/}
{/*width: '22vw',*/}
{/*maxWidth: '150px',*/}
{/*height: '22vw',*/}
{/*maxHeight: "150px",*/}
{/*background: 'url(/images/actions_search.png) no-repeat center center / auto 100%',*/}
{/*backgroundSize: 'auto 100%',*/}
{/*display: 'inline-block',*/}
{/*marginTop: "150px",*/}
{/*textAlign: 'center',*/}
{/*margin: '1.5vw',*/}
{/*cursor: 'pointer'*/}
{/*}}*/}
{/*/>*/}
