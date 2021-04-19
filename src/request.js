import React from 'react';
import './Admin.css'
import 'bootstrap/dist/css/bootstrap.css';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import './Mainpage.css'
import Card from 'react-bootstrap/Card'
import {slide as Menu} from 'react-burger-menu'
import Nav from 'react-bootstrap/Nav'
import CardDeck from 'react-bootstrap/CardDeck';
import Button from 'react-bootstrap/Button';
import VerticalModal from './VerticalModal'
import { Link } from 'react-router-dom';
import userlist from './UserList'
import axios from 'axios'
import {withRouter} from 'react-router-dom';
import Badge from 'react-bootstrap/Badge'

const header = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  };
class Request extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            loading: true,
            list_request: [],
            sender:[],
            menuOpen: false
        }
    }

    componentWillMount() {
        axios.get(`/requesting/${this.props.match.params.id}`).then(res => {
            console.log(res)
            
            this.setState({list_request: res.data[0], sender: res.data[1], loading:false}
            )
        }).then(error => console.log(error))
    }

    handleStateChange(state) {
        this.setState({ menuOpen: state.isOpen })
      }

    reject_request = (request) => {
        //TODO : Implement the backend part, remove this request from the database, and notify the sender(if we have time)
        axios.post("/rejectrequest", {
            request: request
        }).then(res => {
            console.log(res)
        }).catch(error => console.log(error))
    }

    approve_request = (request) => {
        //TODO: Implement the backend part, approve this request, and notify the sender
        axios.post("/approverequest", {
            request: request
        }).then(res => {
            console.log(res)
        }).catch(error => console.log(error))
    }

    expand = () => {
        this.setState(state => ({ menuOpen: !state.menuOpen }))
      }
    render(){
        if (this.state.loading){
            return null
        }
        else{
            let request_cards = []
            request_cards = this.state.list_request.map((request, index) => (
                <Col md="3" key={index} className="request_col">
                        <Card className="request_card">
                            <Card.Body>
                                <Card.Text>Type: {request.reserve_type}</Card.Text>
                                <Card.Text>Sender: {this.state.sender[index]}</Card.Text>
                                <Button variant="danger" onClick={()=>{
                                    this.reject_request(request)
                                    this.setState({
                                        list_request: this.state.list_request.filter(i => i !== request)     
                                    })
                                }}>Reject</Button>
                                <Button className="float-right" variant="success" onClick={()=>{
                                    this.approve_request(request)
                                    this.setState({
                                        list_request: this.state.list_request.filter(i => i !== request)     
                                    })
                                }}>Approve</Button>
                            </Card.Body>
                        </Card>
                </Col>
            ))      
            return(
                <div id = "all-wrap">
                     <Menu pageWrapId={"pagewrap"} outerContainerId={"all-wrap"} right disableAutoFocus customBurgerIcon={false} isOpen={this.state.menuOpen}
            onStateChange={(state) => this.handleStateChange(state)}>
            <div id="profile-pic-contain">
              <img id="profile-pic" src={this.props.cookies.cookies.cur_user.picture_url}></img>
              <span id="prof-name">{this.props.cookies.cookies.cur_user.username}</span>
            </div>
            <br></br>
            <Link to={this.props.cookies.cookies.cur_user.username === 'Admin' ? `${process.env.PUBLIC_URL}/admin` : `${process.env.PUBLIC_URL}/user`}>
              <div id="home" className="menu-item" href="/"><img src={process.env.PUBLIC_URL + "/avatar.png"}></img><span className="profile-infos">Profiles</span></div>
            </Link>
            <br></br>
            <div id="about" className="menu-item" href="/about"><img src={process.env.PUBLIC_URL + "/sign-out.png"}></img><span className="profile-infos">Signout</span>
            </div>
          </Menu>
          <div id = "page-wrap">
                    <nav className="navbar sticky-top navbar-expand-lg navbar-light bg-light">
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <Link to={`${process.env.PUBLIC_URL}/messages/${this.props.cookies.cookies.cur_user._id}`}>
                                <a className="navbar-brand active-class" href="#">
                                    <img src={process.env.PUBLIC_URL+ "/envelope.png"} width="40" height="40" alt=""></img>
                                </a>  
                            </Link>
                            <Badge pill variant="danger">
                            {this.state.list_request.length}
                            </Badge>
                            <ul id = "actual-nav"  className="navbar-nav">
                                <Link to={`${process.env.PUBLIC_URL}/mainpage`}>
                                    <div className="navbar-brand active-class" href="#">
                                        <img src={process.env.PUBLIC_URL + "/sublease.png"} width="40" height="40" alt=""></img>
                                        {' Tenant '}
                                    </div>
                                </Link>
                                <Link to={`${process.env.PUBLIC_URL}/landlord`}>
                                    <div className="navbar-brand" href="#">
                                        <img src={process.env.PUBLIC_URL + "/landlord.png"} width="40" height="40" alt=""></img>
                                        {' Landlord '}
                                    </div>
                                </Link>
                                <Link to={`${process.env.PUBLIC_URL}/roommate`}>
                                    <div className="navbar-brand" href="#">
                                        <img src={process.env.PUBLIC_URL + "/friendship.png"} width="40" height="40" alt=""></img>
                                        {' Roommate '}
                                    </div>
                                </Link>
                                <Link to={`${process.env.PUBLIC_URL}/`}>
                                    <div className="navbar-brand" href="#">
                                        <img src={process.env.PUBLIC_URL + "/logout.png"} width="40" height="40" alt=""></img>
                                        {' Sign Out '}
                                    </div>
                                </Link>
                                <a id="current-user" className="navbar-brand" href="">
                                    <span id="user-name">{this.props.cookies.cookies.cur_user.username}</span>
                                </a>
                                <a className="navbar-brand" href="#">
                                    <img id="nav-pic" src={this.props.cookies.cookies.cur_user.picture_url} width="40" height="40" alt=""></img>
                                </a>
                                <a className="navbar-brand" href="#" onClick={this.expand}>
                                    <img src={process.env.PUBLIC_URL + "/expand.png"}></img>
                                </a>
                            </ul>
                        </div>
                    </nav>
                <span className="content">
                    <div className="header">
                            <h2 id="header_text">Dash Board</h2>
                    </div>
                    <h4 className="sub_header">{this.state.request_type} Requests</h4>
                    <Row>
                        {request_cards}
                    </Row>
                </span>

                </div>
                </div>
            )
        }
        }
}

export default withRouter(Request);