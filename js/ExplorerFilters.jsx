import React from "react";
require('../css/garms.css');
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
require('../css/ball-atom.css');
import { CirclePicker } from 'react-color';


//Child component of Explorer, offers to set more filters before performing search
class ExplorerFilters extends React.Component  {
    constructor(props) {
        super(props);
        this.state = {
            mainCatTop: this.props.mainCatTop,
            mainCatSub: this.props.mainCatSub,
            background: '#fff',
            colorRGB: {}
        };
    }

    handleChangeComplete = (color) => {
        this.setState({
            background: color.hex,
            colorRGB: color.rgb
        });
    };

    render () {
        return (
            <MuiThemeProvider>
                <div className="explorer-color-selection-pane">
                    <h3>What color are you looking for?</h3>
                    <CirclePicker
                        onChange={ this.handleChangeComplete }
                        width={'80vw'}
                        circleSize={48}
                        circleSpacing={22}
                        colors={[
                            "#f44336",
                            "#e91e63",
                            "#9c27b0",
                            "#673ab7",
                            "#3f51b5",
                            "#2196f3",
                            "#03a9f4",
                            "#00bcd4",
                            "#009688",
                            "#4caf50",
                            "#8bc34a",
                            "#cddc39",
                            "#ffeb3b",
                            "#ffc107",
                            "#ff9800",
                            "#ff5722",
                            "#795548",
                            "#000000",
                            "#474747",
                            "#949494",
                            "#eeeeee"
                        ]}
                    />
                </div>

            </MuiThemeProvider>
        )
    }
}

export default ExplorerFilters;
