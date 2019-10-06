import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Register from './components/user/register/Register'
import RegisterFromResult from './components/user/register/RegisterFromResult'
import Login from './components/user/Login'
import Logout from './components/user/Logout'
import SearchChoice from './SearchChoice'
import TextSearch from './components/search/from_text/TextSearch'
import Wardrobe from './components/wardrobe/Wardrobe'
import Profile from './components/user/Profile'
import Explorer from './components/search/from_explore/Explorer'
import SearchFromImage from './components/search/from_image/SearchFromImage'
import SearchFromId from './components/search/from_id/SearchFromId'
import OutfitPage from './components/search/from_id/OutfitPage'


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
                    <Route exact path='/'
                        render={(props) =>
                            <SearchChoice
                                {...props}
                                username={this.props.username}
                                firstLogin={this.props.firstLogin}
                                sex={this.props.sex}
                                handleHigherCat={(higherCat) => {this.handleHigherCat(higherCat);}}
                                email={this.props.email}
                                isAuth={this.props.isAuth}
                            />}
                    />
                    <Route path='/register' component={Register} />
                    <Route path='/register-from-result' render={(props) =>
                        <RegisterFromResult
                            {...props}
                            handleResultLogin={(email, password, imgHash) => {this.props.handleResultLogin(email, password, imgHash)}}
                            sex={this.props.sex}
                        />
                    } />
                    <Route path='/login' render={(props) =>
                        <Login
                            {...props}
                            handleLogin={(email, password) => {this.props.handleLogin(email, password)}}
                        />
                    }/>
                    <Route path='/login' component={Login} />
                    <Route path='/logout' component={Logout} />
                    <Route path='/textsearch'
                           render={(props) => <TextSearch
                           {...props}
                           sex={this.props.sex}
                           isAuth={this.props.isAuth}
                           email={this.props.email}
                           changeSex={(sex) => {this.changeSex(sex);}}
                           firstLogin={this.props.firstLogin}
                           completeFirstLogin={() => {this.props.completeFirstLogin()}}
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
                    <Route path='/explorer'
                           render={(props) => <Explorer
                               {...props}
                               username={this.props.username}
                               sex={this.props.sex}
                               isAuth={this.props.isAuth}
                               higherCat={this.props.higherCat}
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
                               completeFirstLogin={() => {this.props.completeFirstLogin()}}
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
                               completeFirstLogin={() => {this.props.completeFirstLogin()}}
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
                               completeFirstLogin={() => {this.props.completeFirstLogin()}}
                           />}
                    />
                </Switch>
            </main>
        )
    }
}

export default Main;
