import React from 'react';
import { Link } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import GaussianBlur from 'react-gaussian-blur'
import userlist from './UserList'
import axios from "axios"
import User from './User';

/* Component for the SignInPage page */ 
class SignInPage extends React.Component {
    constructor(props){
      super(props)
      this.state = {
        email:"",
        ismounted : true,
        password:"",
        logged_in: false,
        admin: false,
        registered_user:[]
      }
    }
    
    componentDidMount() {
      this.state.mounted = true
    }
    componentWillUnmount() {
      this.state.mounted = false
    }
      
      check_crendital = () => {
        axios.get(`/login_credential/${this.state.email}/${this.state.password}`).then(res =>{
          if (res.data[0] === "No user" && this.state.admin == false){
            this.setState({logged_in:false})
            alert("Please Register first")
          }
          else if (res.data[0] == "logged in" || this.state.admin){
              this.props.cookies.setCookie("cur_user", res.data[1], {
                path : "/",
                expires: 0
              })
              console.log(this.props.cookies)
              if (this.state.mounted){
                this.setState({logged_in: true})
                this.getRedirected()
              }
          }
          else{
            this.setState({logged_in: false})
            alert("Incorrect password")
          }
        }, error => {
          console.log(error)
        } )
      }

      update_email = (event) => {
        let target = event.target
        let value = target.value
        this.setState({
          email: value
        }
        )
      }
      update_password = (event) => {
        let target = event.target
        let value = target.value
        this.setState(
          {
            password: value
          }
        )
      }
    check_user = () =>{
      if (this.state.email === "admin" && this.state.password === "admin") {
        this.setState({admin: true})
      }
    }

    getRedirected = () => {
      window.location.href = this.state.admin ? './admin' : './mainpage'
    }
    
      render(){
        userlist.current_user_name = null;
          return(
            <div>
            <GaussianBlur x =  '5' y= '5'>
              <div className = "background" onMouseMove={this.check_user}></div>
            </GaussianBlur>
            <div>
                <Link to={'./signUpPage'}>
                <Button variant="warning" className="SignUpButton">
                    <h4>Sign Up</h4>
                </Button>
                </Link>
            </div>
            <div id="login-form">
              <Form>
                  <Form.Group>
                    <h3><center className="White">Login to begin</center></h3>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label className="White">Email</Form.Label>
                    <Form.Control type="text" placeholder="Enter your email" onChange = {this.update_email}></Form.Control>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label className="White">Password</Form.Label>
                    <Form.Control type="password" placeholder="Enter your password" onChange = {this.update_password}></Form.Control>
                  </Form.Group>
                  <center>
                  <Button onMouseMove={this.check_user} onClick = {this.check_crendital}>Submit</Button>
                  </center>
                </Form>
            </div>
            </div>
            )
        }
}

export default SignInPage;
