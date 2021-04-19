import React from 'react';
import logo from './logo.svg';
import ScrollMenu from 'react-horizontal-scrolling-menu';
import './App.css';
import SignUpPage from './SignUpPage';
import SignInPage from './SignInPage';
import Admin from './Admin'
import Landlord from './Landlord'
import { BrowserRouter, Switch, Route} from 'react-router-dom';
import HouseInfo from './HouseInfo'
import Mainpage from './Mainpage';
import User from './User';
import Roommate from './roommate';
import RoommateInfo from './RoommateInfo';
import EditInfoPage from './EditInfoPage';
import EditRoommateInfo from './EditRoommateInfo';
import WriteReview from './WriteReview'
import Request from './request'
import {withCookies, useCookies, Cookies} from "react-cookie"


function App() {

  const [cookies, setCookie, removeCookie] = useCookies(["cur_user"]);

    return (
      <div>
      <BrowserRouter>
        <Switch>  
          <Route exact path='/' render={() => (<SignInPage cookies={{cookies, setCookie, removeCookie}}/>)}/>
          <Route exact path='/signUpPage' render={() => (<SignUpPage cookies={{cookies, setCookie, removeCookie}}/>)}/>
          <Route exact path='/landlord/:id?' render={() => (<Landlord cookies={{cookies, setCookie, removeCookie}}/>)}/>
          <Route exact path='/houseinfo' render={() => (<HouseInfo cookies={{cookies, setCookie, removeCookie}}/>)}/>
          <Route exact path='/mainpage' render={() => (<Mainpage cookies={{cookies, setCookie, removeCookie}}/>)}/>
          <Route exact path='/user' render={() => (<User cookies={{cookies, setCookie, removeCookie}}/>)}/>
          <Route exact path='/admin' render={() => (<Admin cookies={{cookies, setCookie, removeCookie}}/>)}/>
          <Route exact path='/roommate' render={() => (<Roommate cookies={{cookies, setCookie, removeCookie}}/>)}/>
          <Route exact path='/editInfoPage' render={() => (<EditInfoPage cookies={{cookies, setCookie, removeCookie}}/>)}/>
          <Route exact path='/editroommateinfo' render={() => (<EditRoommateInfo cookies={{cookies, setCookie, removeCookie}}/>)}/>
          <Route exact path='/writeReview/:houseid' render={() => (<WriteReview cookies={{cookies, setCookie, removeCookie}}/>)}/>
          <Route exact path = '/houseinfo/:id' render = {() => (<HouseInfo cookies = {{cookies, setCookie, removeCookie}}/>)}/>
          <Route exact path = '/messages/:id' render = {() => (<Request cookies = {{cookies, setCookie, removeCookie}}/>)}/>
          <Route exact path = '/roommate/:id' render = {() => (<RoommateInfo cookies = {{cookies, setCookie, removeCookie}}/>)}/>
        </Switch>
       </BrowserRouter>
     </div>
    );
  }

export default withCookies(App);
