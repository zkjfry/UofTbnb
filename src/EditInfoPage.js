import React from 'react';
import { Link } from 'react-router-dom';
import './EditInfoPage.css';
import 'bootstrap/dist/css/bootstrap.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import GaussianBlur from 'react-gaussian-blur'
import userlist from './UserList'
import axios from 'axios';

/* Component for the SignInPage page */ 
class EditInfoPage extends React.Component {
    constructor(props){
      super(props)
      this.state = {
        password:"",
        new_password:"",
        registered_user: userlist.registered_user
      }
    }
      check_crendital = () => {
        axios.get(`/change_password/${this.props.cookies.cookies.cur_user._id}/${this.state.password}/${this.state.new_password}`).then(res =>{
          console.log(res.data)
          if (res.data == "Incorrect password"){
            alert("Incorrect password!")
          }
          else if (res.data == "Success"){
            this.getRedirected()
          }
        }, error => {
          console.log(error)
        } )
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
      update_new_password = (event) => {
        let target = event.target
        let value = target.value
        this.setState({
          new_password : value
        })
      }

      getRedirected = () => {
        window.location.href = './user'
      }

      render(){
          return(
            <div>
            <GaussianBlur x =  '5' y= '5'>
              <div className = "background"></div>
            </GaussianBlur>
            <div id="login-form">
              <Form>
                  <Form.Group>
                    <h3><center className="White">Change your password</center></h3>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label className="White">Password</Form.Label>
                    <Form.Control type="password" placeholder="Enter your current password" onChange = {this.update_password}></Form.Control>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label className="White">New Password</Form.Label>
                    <Form.Control type="password" placeholder="Enter your new password" onChange = {this.update_new_password}></Form.Control>
                  </Form.Group>
                  <center><Button onClick = {this.check_crendital}>Submit</Button></center>
                </Form>
            </div>
            </div>
            )
        }
}

export default EditInfoPage;
