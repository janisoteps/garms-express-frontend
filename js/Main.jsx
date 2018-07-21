import React from 'react'
import { Switch, Route } from 'react-router-dom'
// import TestList from './TestList'
import Register from './Register'
import Login from './Login'
import Logout from './Logout'
import SearchChoice from './SearchChoice'
import ImageSearch from './ImageSearch'
import TextSearch from './TextSearch'
import Profile from './Profile'
import Explorer from './Explorer'


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
        console.log('Main higherCat: ', higherCat);
    }
    render() {
        // console.log('Main isAuth: ',this.props.isAuth);
        console.log('Main sex: ',this.props.sex);
        // console.log('Main email: ', this.props.email);
        console.log('Main username: ', this.props.username);
        return (
            <main>
                <Switch>
                    <Route exact path='/'
                        render={(props) =>
                            <SearchChoice
                                {...props}
                                sex={this.props.sex}
                                handleHigherCat={(higherCat) => {this.handleHigherCat(higherCat);}}
                            />}
                    />
                    <Route path='/register' component={Register} />
                    <Route path='/login' component={Login} />
                    <Route path='/logout' component={Logout} />
                    <Route path='/imagesearch'
                           render={(props) =>
                                <ImageSearch
                                    {...props}
                                    sex={this.props.sex}
                                    isAuth={this.props.isAuth}
                                    email={this.props.email}
                                    changeSex={(sex) => {this.changeSex(sex);}}
                                />}
                    />
                    <Route path='/textsearch'
                           render={(props) => <TextSearch
                           {...props}
                           sex={this.props.sex}
                           isAuth={this.props.isAuth}
                           email={this.props.email}
                           changeSex={(sex) => {this.changeSex(sex);}}
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
                </Switch>
            </main>
        )
    }
}

export default Main;
