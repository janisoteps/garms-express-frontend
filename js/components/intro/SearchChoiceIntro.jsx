// SearchChoiceIntro.jsx
import React from "react";
require('../../../css/garms.css');
// import {Route} from 'react-router-dom';
// import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';


const styles = (theme) => ({
    button: {
        margin: theme.spacing.unit,
        color: "#cacaca",
        borderColor: "#cacaca"
    }
});

class SearchChoiceIntro extends React.Component  {
    constructor(props) {
        super(props);
        this.state = {
            username: this.props.username,
            introStep: 0
        };

        // this.classes = this.props.classes;
        console.log(this.props);
        this.goToStep = this.goToStep.bind(this);
    }

    goToStep(step) {
        this.setState({
            introStep: step
        });
    }

    // --------------------- MAIN RENDER ---------------------
    render () {
        const { classes } = this.props;

        const IntroStep = () => {
            console.log(`Showing intro step: ${this.state.introStep}`);
            const steps = {
                0: (
                    <div style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        backgroundColor: "rgba(0,0,0, 0.95)",
                        color: "#cacaca"
                    }}>
                        <div style={{
                            marginTop: "150px",
                            width: "100%",
                            textAlign: "center"
                        }}>
                            <h1>Hi {this.state.username}!</h1>
                            <h1>Welcome to Garms</h1>
                            <h3>A new way to shop</h3>
                            <br/>
                            <h5>Search visually similar items</h5>
                            <h5>Don't stop there, keep exploring</h5>
                            <br/>
                            <Button
                                variant="outlined"
                                className={classes.button}
                                size="large"
                                onClick={() => {this.goToStep(1)}}
                            >
                                Show Me Around
                            </Button>
                        </div>
                    </div>
                ),
                1: (
                    <div>
                        <div style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100vw",
                            height: "calc(50vh + 25px)",
                            backgroundColor: "rgba(0,0,0, 0.4)",
                            color: "#cacaca"
                        }}>
                        </div>
                        <div style={{
                            position: "absolute",
                            top: "calc(50vh + 25px)",
                            left: 0,
                            width: "100vw",
                            height: "calc(50vh - 25px)",
                            backgroundColor: "rgba(0,0,0, 0.95)",
                            color: "#cacaca"
                        }}>
                            <div style={{
                                marginTop: "150px",
                                width: "100%",
                                textAlign: "center"
                            }}>
                                <h5>Start your exploration by typing</h5>
                                <br/>
                                <Button
                                    variant="outlined"
                                    className={classes.button}
                                    size="large"
                                    onClick={() => {this.goToStep(2)}}
                                >
                                    Continue
                                </Button>
                            </div>
                        </div>
                    </div>
                ),
                2: (
                    <div>
                        <div style={{
                            position: "absolute",
                            top: "0",
                            left: 0,
                            width: "100vw",
                            height: "calc(50vh + 25px)",
                            backgroundColor: "rgba(0,0,0, 0.95)",
                            color: "#cacaca"
                        }}>
                            <div style={{
                                marginTop: "20vh",
                                width: "100%",
                                textAlign: "center"
                            }}>
                                <h5>Or take a picture yourself</h5>
                                <h5>Or take a screen shot of something you like</h5>
                                <h5>Start exploring by finding visually similar items</h5>
                                <Button
                                    variant="outlined"
                                    className={classes.button}
                                    size="large"
                                    onClick={() => {this.goToStep(4)}}
                                >
                                    Choose one of the options
                                </Button>
                            </div>
                        </div>
                        <div style={{
                            position: "absolute",
                            top: "calc(50vh + 25px)",
                            left: 0,
                            width: "100vw",
                            height: "calc(50vh - 25px)",
                            backgroundColor: "rgba(0,0,0, 0.4)",
                            color: "#cacaca"
                        }}>
                        </div>
                    </div>
                ),
                3: (
                    <div>
                        <div style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100vw",
                            height: "calc(32vh + 50px)",
                            backgroundColor: "rgba(0,0,0, 0.95)",
                            color: "#cacaca"
                        }}>
                        </div>
                        <div style={{
                            position: "absolute",
                            top: "calc(32vh + 50px)",
                            left: 0,
                            width: "100vw",
                            height: "calc(31vh)",
                            backgroundColor: "rgba(0,0,0, 0.95)",
                            color: "#cacaca"
                        }}>
                            <div style={{
                                marginTop: "20px",
                                width: "100%",
                                textAlign: "center"
                            }}>
                                <h5>Or start exploring by selecting a category</h5>
                                <br/>
                                <Button
                                    variant="outlined"
                                    className={classes.button}
                                    size="large"
                                    onClick={() => {this.goToStep(4)}}
                                >
                                    Choose one of the options
                                </Button>
                            </div>
                        </div>
                        <div style={{
                            position: "absolute",
                            top: "calc(63vh + 50px)",
                            left: 0,
                            width: "100vw",
                            height: "calc(37vh - 50px)",
                            backgroundColor: "rgba(0,0,0, 0.4)",
                            color: "#cacaca"
                        }}>
                        </div>
                    </div>
                ),
                4: (
                    <div />
                )
            };
            return steps[this.state.introStep]
        };

        return (
            <div>
                <IntroStep />
            </div>
        )
    }
}

export default withStyles(styles)(SearchChoiceIntro);
