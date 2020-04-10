// Wardrobe.jsx
import React from "react";
require('../../../css/ball-atom.css');


class InfiniteSpinner extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            content: null
        }
    }

    componentDidMount() {
    }

    render() {
        return(
            <div>
                <div className="la-ball-atom la-3x">
                    <div />
                    <div />
                    <div />
                    <div />
                </div>
            </div>
        )
    }
}

export default InfiniteSpinner;
