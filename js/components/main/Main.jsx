import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Register from '../user/register/Register'
import RegisterFromResult from '../user/register/RegisterFromResult'
import Login from '../user/Login'
import Logout from '../user/Logout'
import Home from './Home'
import TextSearch from '../search/from_text/TextSearch'
import Wardrobe from '../wardrobe/Wardrobe'
import Profile from '../user/Profile'
import SearchFromImage from '../search/from_image/SearchFromImage'
import SearchFromId from '../search/from_id/SearchFromId'
import OutfitPage from '../search/from_id/OutfitPage'
import Intro from '../intro/Intro'
import PasswordReset from "../user/PasswordReset";
import PasswordResetEmail from "../user/PasswordResetEmail";
import RecommendDeals from "../recommend/RecommendDeals";
import DataProtectionPolicy from "../policy/DataProtectionPolicy";
import TermsOfUse from "../policy/TermsOfUse";

// The Main component renders one of the provided
// Routes (provided that one matches). The / route will only match
// when the pathname is exactly the string "/"

class Main extends React.Component {
    constructor(props) {
        super(props);

        this.changeSex = this.changeSex.bind(this);
        this.handleHigherCat = this.handleHigherCat.bind(this);
    }

    changeSex(sex){
        this.props.changeSex(sex);
    }

    handleHigherCat(higherCat){
        this.props.handleHigherCat(higherCat);
    }
    render() {
        return (
            <main>
                <Switch>
                    <Route path='/register' component={Register} />
                    <Route path='/register-from-result' render={(props) =>
                        <RegisterFromResult
                            {...props}
                            handleResultLogin={(email, password, imgHash) => {this.props.handleResultLogin(email, password, imgHash)}}
                            sex={this.props.sex}
                            failedLogin={this.props.failedLogin}
                        />
                    } />
                    <Route path='/login' render={(props) =>
                        <Login
                            {...props}
                            handleLogin={(email, password) => {this.props.handleLogin(email, password)}}
                            failedLogin={this.props.failedLogin}
                        />
                    }/>
                    <Route path='/logout' component={Logout} />
                    <Route path='/password-reset' render={(props) =>
                        <PasswordReset
                            {...props}
                            email={this.props.email}
                            isAuth={this.props.isAuth}
                            username={this.props.username}
                        />
                    }/>
                    <Route path='/password-reset-email' render={(props) =>
                        <PasswordResetEmail
                            {...props}
                            isAuth={this.props.isAuth}
                        />
                    }/>
                    <Route path='/textsearch'
                           render={(props) => <TextSearch
                           {...props}
                           sex={this.props.sex}
                           isAuth={this.props.isAuth}
                           email={this.props.email}
                           changeSex={(sex) => {this.changeSex(sex);}}
                           firstLogin={this.props.firstLogin}
                           completeFirstLogin={(callback) => {this.props.completeFirstLogin(callback)}}
                        />}
                    />
                    <Route path='/wardrobe'
                           render={(props) => <Wardrobe
                               {...props}
                               username={this.props.username}
                               sex={this.props.sex}
                               isAuth={this.props.isAuth}
                               email={this.props.email}
                           />}
                    />
                    <Route path='/profile'
                           render={(props) => <Profile
                               {...props}
                               username={this.props.username}
                               sex={this.props.sex}
                               isAuth={this.props.isAuth}
                               email={this.props.email}
                           />}
                    />
                    <Route path='/deals'
                           render={(props) => <RecommendDeals
                               {...props}
                               username={this.props.username}
                               sex={this.props.sex}
                               isAuth={this.props.isAuth}
                               email={this.props.email}
                               changeSex={(sex) => {this.changeSex(sex);}}
                           />}
                    />
                    <Route path='/search-from-image'
                           render={(props) => <SearchFromImage
                               {...props}
                               username={this.props.username}
                               sex={this.props.sex}
                               isAuth={this.props.isAuth}
                               email={this.props.email}
                               changeSex={(sex) => {this.changeSex(sex);}}
                               firstLogin={this.props.firstLogin}
                               completeFirstLogin={(callback) => {this.props.completeFirstLogin(callback)}}
                           />}
                    />
                    <Route path='/search-from-id'
                           render={(props) => <SearchFromId
                               {...props}
                               username={this.props.username}
                               sex={this.props.sex}
                               isAuth={this.props.isAuth}
                               email={this.props.email}
                               changeSex={(sex) => {this.changeSex(sex);}}
                               firstLogin={this.props.firstLogin}
                               completeFirstLogin={(callback) => {this.props.completeFirstLogin(callback)}}
                           />}
                    />
                    <Route path='/outfit-page'
                           render={(props) => <OutfitPage
                               {...props}
                               username={this.props.username}
                               sex={this.props.sex}
                               isAuth={this.props.isAuth}
                               email={this.props.email}
                               firstLogin={this.props.firstLogin}
                               completeFirstLogin={(callback) => {this.props.completeFirstLogin(callback)}}
                               showIosNav={this.props.showIosNav}
                           />}
                    />
                    <Route
                        path='/intro'
                        render={(props) => <Intro
                            {...props}
                            username={this.props.username}
                            sex={this.props.sex}
                            completeFirstLogin={(callback) => {this.props.completeFirstLogin(callback)}}
                        />}
                    />
                    <Route
                        path='/data-protection'
                        render={(props) => <DataProtectionPolicy
                            {...props}
                        />}
                    />
                    <Route
                        path='/terms-conditions'
                        render={(props) => <TermsOfUse
                            {...props}
                        />}
                    />
                    <Route path='/'
                           render={(props) =>
                               <Home
                                   {...props}
                                   changeSex={(sex) => {this.changeSex(sex);}}
                                   username={this.props.username}
                                   firstLogin={this.props.firstLogin}
                                   sex={this.props.sex}
                                   handleHigherCat={(higherCat) => {this.handleHigherCat(higherCat);}}
                                   email={this.props.email}
                                   isAuth={this.props.isAuth}
                               />}
                    />
                    <Route path='/index.html'
                           render={(props) =>
                               <Home
                                   {...props}
                                   changeSex={(sex) => {this.changeSex(sex);}}
                                   username={this.props.username}
                                   firstLogin={this.props.firstLogin}
                                   sex={this.props.sex}
                                   handleHigherCat={(higherCat) => {this.handleHigherCat(higherCat);}}
                                   email={this.props.email}
                                   isAuth={this.props.isAuth}
                               />}
                    />
                </Switch>
            </main>
        )
    }
}

export default Main;
