import React, { Component } from 'react';
import './App.css';
import Form from 'react-bootstrap/Form';
import { Col } from 'reactstrap';
import Button from 'react-bootstrap/Button';
import GaussianBlur from 'react-gaussian-blur'
import axios from 'axios';

const header = {
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  }
};


const log = console.log
class SignUpPage extends React.Component{
    constructor(props){
      super(props)
      this.state = {
        new_user:"",
        new_password:"",
        new_name:"",
        img_src: [],
      }
    }
  

  add_new_user = (email, password, name) => {
    axios.post("/user/signup", {
      username: name,
      password: password,
      email: email
    }, header).then(response => {
      console.log(response.data);
    }, error => {
      console.log(error)
    });

  }

  update_new_user = (event) => {
    let target = event.target
    let value = target.value
    this.setState(
      {
        new_user: value
      }
    )
  }

  update_new_password = (event) => {
    let target = event.target
    let value = target.value
    this.setState(
      {
        new_password: value
      }
    )
  }

  update_new_name = (event) => {
    let target = event.target
    let value = target.value
    this.setState({
      new_name: value
    })
  }

    update_new_name = (event) => {
      let target = event.target
      let value = target.value
      this.setState({
        new_name: value
      })
    }


    signup_finish = () => {
      axios.get(`/login_credential/${this.state.new_user}/${this.state.password}`).then(res =>{
        if (res.data === "No user"){
          console.log(res.data)
          this.add_new_user(this.state.new_user, this.state.new_password, this.state.new_name)
          window.location.href = './'
        }
        else {
          alert("Email already registered!")
        }
      }, error => {
        console.log(error)
      } )
    }

    render() {
        return (
          <div>
          <GaussianBlur x =  '5' y= '5'>
              <div className = "signupbackground"></div>
          </GaussianBlur>
        <div id="signup-form">
          <Form>
            <Form.Row>
              <Form.Group as={Col} controlId="formGridEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" placeholder="Enter username" onChange = {this.update_new_user}/>
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} controlId="formGridPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" onChange={this.update_new_password} />
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} controlId="formGridName">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" placeholder="Enter Name" onChange={this.update_new_name} />
              </Form.Group>
            </Form.Row>
              <center>
                <Button variant="primary" onClick={this.signup_finish}>
                  Submit
              </Button>
              </center>
          </Form>
        </div>
      </div>
    )
  }
}

export default SignUpPage;