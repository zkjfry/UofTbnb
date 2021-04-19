import React from 'react';
import './Admin.css'
import 'bootstrap/dist/css/bootstrap.css';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import {slide as Menu} from 'react-burger-menu'
import Nav from 'react-bootstrap/Nav'
import CardDeck from 'react-bootstrap/CardDeck';
import Button from 'react-bootstrap/Button';
import VerticalModal from './VerticalModal'
import { Link } from 'react-router-dom';
import userlist from './UserList'

const axios = require('axios').default;
const header = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  };

let loading = true
class Admin extends React.Component{
    constructor(props){
        super(props)
        console.log(this.props.cookies.cookies)
        this.state = {
            loading: true,
            list_request: [],
            request_type: "List_Requests",
            house_list: [],
            roommate_list: [],
            roommate_request: [],
            menuOpen: false,
            statOpen:false,
            all_users: []
        }
    }
    componentDidMount(){
        this.getHouses()
        this.getRoomate()
        this.getAllUsers()
    }
    getAllUsers = () => {
        axios.get("/Users/GetAllUsers")
            .then(res => {
                this.setState({
                    all_users: res.data
                })
            })
            .catch(err => console.log(err))
    }
    deleteUser = (input_id) => {
        const id_obj = {
            id: input_id
        }
        axios.post("/User/RemoveUser", id_obj)
            .then(res => console.log(res))
            .catch(err => console.log(err))
    }
    getHouses = () => {
        axios.get(`/House/GetAllHouses`)
            .then(res => {
                let request_tmp = []
                let house_tmp = []
                res.data.forEach(element => {
                    if(element.approved){
                        house_tmp.push(element)
                    }
                    else{
                        request_tmp.push(element)
                    }
                });
                this.setState({
                    list_request: request_tmp,
                    house_list: house_tmp
                })
            })
    }
    getRoomate = () => {
        axios.get(`/Roommate/GetAllRoomates`)
            .then(res => {
                let request_tmp = []
                let roommate_tmp = []
                res.data.forEach(element => {
                    if(element.approved){
                        roommate_tmp.push(element)
                    }
                    else{
                        request_tmp.push(element)
                    }
                });
                this.setState({
                    roommate_request: request_tmp,
                    roommate_list: roommate_tmp
                })
            })
            .catch(err => console.log(err))
    }
    handleStateChange(state) {
        this.setState({ menuOpen: state.isOpen })
    }
    statopen = () => {
        this.setState(state => ({statOpen:!state.statOpen}))
    }
    expand = () => {
        this.setState(state => ({ menuOpen: !state.menuOpen }))
    }
    reject_House_request = (value, input_id) => {
            const id_obj = {
                id: input_id
            }
        axios.post("/House/RemoveHouse", id_obj)
            .then(res => {
                console.log(res)
            })
            .catch(err => console.log(err))
    }
    approve_House_request = (input_id) => {
        const id_obj = {
            id: input_id
        }
        axios.put("/House/ApproveHouse", id_obj)
            .then(res => console.log(res))
            .catch(err => console.log(err))
    }
    approve_Roommate_request = (input_id) => {
        const id_obj = {
            id: input_id
        }
        axios.put("/Roomate/ApproveRoomate", id_obj)
            .then(res => console.log(res))
            .catch(err => console.log(err)) 
    }
    reject_Roomate_request = (input_id) => {
        const id = {
            id: input_id
        }
        axios.post("/Roommate/RemoveRoommate", id)
            .then(res => console.log(res))
            .catch(err => console.log(err))
    }
    render(){
        if (this.props.cookies.cookies.cur_user.username != "admin"){
            return null
        } else {
        let request_cards;
        if(this.state.request_type == "List_Requests"){
            console.log(this.state.list_request)
            request_cards = this.state.list_request.map((request, index) => (
                <Col md="3" key={index} className="request_col">
                        <Card className="request_card">
                            <Card.Body>
                                <Card.Text>Name: {request.owner_name}</Card.Text>
                                <Card.Text>Price: ${request.price}</Card.Text>
                                <Card.Text><Link to={`/houseinfo/${request._id}`}>Link</Link></Card.Text>
                                <Button variant="danger" onClick={()=>{
                                    this.reject_House_request(request, request._id)
                                    this.setState({
                                        list_request: this.state.list_request.filter(i => i !== request)     
                                    })
                                }}>Reject</Button>
                                <Button className="float-right" variant="success" onClick={()=>{
                                    this.approve_House_request(request._id)
                                    this.setState({
                                        list_request: this.state.list_request.filter(i => i !== request)     
                                    })
                                }}>Approve</Button>
                            </Card.Body>
                        </Card>
                    

                </Col>
            
            ))
        }        
        else if(this.state.request_type == "House_Lists"){
            request_cards = this.state.house_list.map((house, index) => (
                <Col md="3" key={index} className="request_col">
                        <Card className="request_card">
                            <Card.Body>
                                <Card.Text>Name: {house.owner_name}</Card.Text>
                                <Card.Text>Occupied Status: {house.occupied ? "Occupied" : "Empty"}</Card.Text>
                                <Card.Text><Link to={`/houseinfo/${house._id}`}>Link</Link></Card.Text>
                                <Button variant="danger" onClick={()=>{
                                    this.reject_House_request(house, house._id)
                                    this.setState({
                                        house_list: this.state.house_list.filter(i => i !== house)     
                                    })
                                }}>Cancel this listing</Button>
                            </Card.Body>
                        </Card>

                </Col>
            ))
        }
        else if(this.state.request_type == "Roomates_Requests"){
            request_cards = this.state.roommate_request.map((roommate, index) => (
                <Col md="3" key={index} className="request_col">        
                    <Card className="request_card">
                        <Card.Body>
                            <Card.Text>Name: {roommate.roommate_name}</Card.Text>
                            <Card.Text><Link to={`/roommate/${roommate._id}`}>Link</Link></Card.Text>
                            <Button variant="danger" onClick={()=>{
                                    this.reject_Roomate_request(roommate._id)
                                    this.setState({
                                        roommate_request: this.state.roommate_request.filter(i => i !== roommate)     
                                    })
                                }}>Reject</Button>
                            <Button className="float-right" variant="success" onClick={()=>{
                                    this.approve_Roommate_request(roommate._id)
                                    this.setState({
                                        roommate_request: this.state.roommate_request.filter(i => i !== roommate)     
                                    })
                                }}>Approve</Button>
                            
                        </Card.Body>
                    </Card>
                </Col>
            ))
        }
        else if(this.state.request_type == "Roommates_Lists"){
            request_cards = this.state.roommate_list.map((roommate, index) => (
                <Col md="3" key={index} className="request_col">        
                    <Card className="request_card">
                        <Card.Body>
                            <Card.Text>Name: {roommate.roommate_name}</Card.Text>
                            <Card.Text><Link to={`/roommate/${roommate._id}`}>Link</Link></Card.Text>
                            <Button variant="danger" onClick={()=>{
                                    this.reject_Roomate_request(roommate._id)
                                    this.setState({
                                        roommate_list: this.state.roommate_request.filter(i => i !== roommate)     
                                    })
                                }}>Remove this listing</Button>
                        </Card.Body>
                    </Card>
                </Col>
            ))
        }
        else if(this.state.request_type == "Users"){
            request_cards = this.state.all_users.map((user, index) => (
                <Col md="3" key={index} className="request_col">        
                    <Card className="request_card">
                        <Card.Body>
                            <Card.Text>Name: {user.username}</Card.Text>
                            <Card.Text>Email: {user.email}</Card.Text>
                            <Button variant="danger" onClick={()=>{
                                    this.deleteUser(user._id)
                                    this.setState({
                                        all_users: this.state.all_users.filter(i => i !== user)     
                                    })
                                }}>Delete account</Button>
                        </Card.Body>
                    </Card>
                </Col>
            ))
        }
        return(
            <div>
                <div id="all-wrap">
                <Menu pageWrapId={"pagewrap"} outerContainerId={"all-wrap"} right disableAutoFocus customBurgerIcon={false} isOpen={this.state.menuOpen}
                    onStateChange={(state) => this.handleStateChange(state)}>
                    <div id="profile-pic-contain">
                        <img id="profile-pic" src={this.props.cookies.cookies.cur_user.picture_url}></img>
                        <span id="prof-name">{this.props.cookies.cookies.cur_user.username}</span>
                    </div>
                    <br></br>
                    <Link to={this.props.cookies.cookies.cur_user.username === 'admin' ? './admin' : './user'}>
                        <div id="home" className="menu-item" href="/"><img src="avatar.png"></img><span className="profile-infos">Profiles</span></div>
                    </Link>
                    <br></br>
                    <Link to={this.props.cookies.cookies.cur_user.username === 'admin' ? './admin' : './user'}>
                    <div id="home" className="menu-item" href="/"><img src="star.png"></img><span className="profile-infos">Favourite</span></div>
                    </Link>
                    <br></br>
                    <Link to= './'>
                        <div id="about" className="menu-item" href="/about"><img src="sign-out.png"></img><span className="profile-infos">Sign out</span></div>
                    </Link>
                </Menu>
                <Menu disableAutoFocus customBurgerIcon={false} isOpen={this.state.statOpen}>
                    <a id="List" className="menu-item">
                        <Button className="side_button" variant="outline-light" onClick={()=>{
                            this.getHouses()
                            this.getRoomate()
                            this.getAllUsers()
                            this.setState({
                                request_type: "List_Requests"
                            })
                        }
                            
                        }>House Listing Requests</Button>
                    </a>
                    <a id="House_lists" className="menu-item">
                        <Button className="side_button" variant="outline-light" onClick={()=>{
                            this.getHouses()
                            this.getRoomate()
                            this.getAllUsers()
                            this.setState({
                                request_type: "House_Lists"
                            })
                        }
                            
                        }>Approved Houses</Button>
                    </a>
                    <a id="Roomates" className="menu-item">
                        <Button className="side_button" variant="outline-light" onClick={()=>{
                            this.getHouses()
                            this.getRoomate()
                            this.getAllUsers()
                            this.setState({
                                request_type: "Roomates_Requests"
                            })
                        }
                            
                        }>Roommate Requests</Button>
                    </a>
                    <a id="Roomates_Info" className="menu-item">
                        <Button className="side_button" variant="outline-light" onClick={()=>{
                            this.getHouses()
                            this.getRoomate()
                            this.getAllUsers()
                            this.setState({
                                request_type: "Roommates_Lists"
                            })
                        }
                            
                        }>Approved Roommate Requests</Button>
                    </a>
                    <a id="Users" className="menu-item">
                        <Button className="side_button" variant="outline-light" onClick={()=>{
                            this.getHouses()
                            this.getRoomate()
                            this.getAllUsers()
                            this.setState({
                                request_type: "Users"
                            })
                        }
                            
                        }>Manage Users</Button>
                    </a>
                </Menu>
                <div id="pagewrap">
                    <nav className="navbar sticky-top navbar-expand-lg navbar-light bg-light">
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <form className="form-inline my-2 my-lg-0">
                        <a className="navbar-brand" href="#" onClick={this.statopen}>
                            <img src="expand (1).png"></img>
                        </a>
                            </form>
                            <ul id = "actual-nav"  className="navbar-nav">
                                <Link to={'./mainpage'}>
                                    <div className="navbar-brand active-class" href="#">
                                        <img src="sublease.png" width="40" height="40" alt=""></img>
                                        {' Tenant '}
                                    </div>
                                </Link>
                                <Link to={'./landlord'}>
                                    <div className="navbar-brand" href="#">
                                        <img src="landlord.png" width="40" height="40" alt=""></img>
                                        {' Landlord '}
                                    </div>
                                </Link>
                                <Link to={'./roommate'}>
                                    <div className="navbar-brand" href="#">
                                        <img src="friendship.png" width="40" height="40" alt=""></img>
                                        {' Roommate '}
                                    </div>
                                </Link>
                                <Link to={'./'}>
                                    <div className="navbar-brand" href="#">
                                        <img src="logout.png" width="40" height="40" alt=""></img>
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
                                    <img src="expand.png"></img>
                                </a>
                            </ul>
                        </div>
                    </nav>
                <span className="content">
                    <div className="header">
                        <h2 id="header_text">Dash Board</h2>
                    </div>
                    <h4 className="sub_header">{this.state.request_type}</h4>
                    <Row>
                        {request_cards}
                    </Row>
                </span>


            </div>
            </div>
        </div>
        )
    }}
}

export default Admin;