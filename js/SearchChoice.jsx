import React from "react";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Route } from 'react-router-dom';
import SearchChoiceIntro from './components/intro/SearchChoiceIntro';

class SearchChoice extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            firstLogin: this.props.firstLogin
        };
        // this.handleHigherCat = this.handleHigherCat.bind(this);
    }

    // handleHigherCat(higherCat){
    //     this.props.handleHigherCat(higherCat);
    //     console.log('SearchChoice higherCat: ', higherCat);
    // }

    componentDidUpdate(prevProps){
        if(prevProps.firstLogin !== this.props.firstLogin){
            this.setState({
                firstLogin: this.props.firstLogin
            });
        }
    }

    render () {
        console.log(`SearchChoice firstLogin: ${this.state.firstLogin}`);

        return (
            <MuiThemeProvider>
                <div>
                    <div className="search-choice">
                        <Route render={({ history }) => (
                            <div
                                className="search-choice-button-type"
                                onClick={() => { history.push('/textsearch') }}>
                                <div className="search-choice-title">
                                    <div className="text-search-icon"></div>
                                    <div className="search-choice-text">Type your search</div>
                                </div>
                            </div>
                        )} />

                        <Route render={({ history }) => (
                            <div
                                className="search-choice-button-image"
                                onClick={() => { history.push('/search-from-image') }}>
                                <div className="search-choice-title">
                                    <div className="image-search-icon"></div>
                                    <div className="search-choice-text">Search from photo</div>
                                </div>
                            </div>
                        )} />

                        <Route render={({ history }) => (
                            <div
                                className="search-choice-button-explore"
                                onClick={() => { history.push('/explorer') }}>
                                <div className="search-choice-title">
                                    <div className="search-glass-icon"></div>
                                    <div className="search-choice-text">Or explore...</div>
                                </div>
                            </div>
                        )} />
                    </div>

                    {(this.state.firstLogin === '1') && (<SearchChoiceIntro
                        username={this.props.username}
                    />)}
                </div>
            </MuiThemeProvider>
        )
    }
}

export default SearchChoice;
