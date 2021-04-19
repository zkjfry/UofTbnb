import React from 'react';
import logo from './logo.svg';
import './Mainpage.css';
import House_pic from './house_pic.js';
import 'bootstrap/dist/css/bootstrap.css';
import Form from 'react-bootstrap/Form';
import CardDeck from 'react-bootstrap/CardDeck'
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import houses from './houses'
import Pagination from 'react-bootstrap/Pagination'
import {CalendarSelectedController, DatePicker} from "@y0c/react-datepicker"
import Carousel from 'react-bootstrap/Carousel'
import { scaleRotate as Menu } from 'react-burger-menu'
import { fallDown as Menu1 } from 'react-burger-menu'
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar'
import ListGroup from 'react-bootstrap/ListGroup'
import { RangeDatePicker } from '@y0c/react-datepicker';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import '@y0c/react-datepicker/assets/styles/calendar.scss';
import { createSecureContext } from 'tls'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Badge from 'react-bootstrap/Badge'
import { withStyles } from '@material-ui/core/styles';
import axios from 'axios';
import { thisExpression } from '@babel/types';


class Mainpage extends React.Component {
  constructor(props){
    super(props)
    console.log(this.props.cookies.cookies)
    this.state = {
      index: 0,
      house_list: houses.top_rated,
      current_house: houses.top_rated[1],
      menuOpen: false,
      infoOpen: false,
      user_name: "",
      housing_info: [1,2,3,4,5,6,7,8],
      all_house: [],
      current_house: [],
      start_house_index: 0,
      location:["Downtown Toronto", "Mississagua", "North York", "Scarbourough", "Brampton", "Vaughan", "Richmond Hill", "Markham"],
      location_pic: ["Toronto.jpg", "missi.jpg", "north-york.jpg", "scar.jpg", "bramp.jpg", "vaug.jpg", "richmond.jpg", "markham.jpeg"],
      house_number:[0,0,0,0,0,0,0,0,0,0,0,0],
      house_type:["Apartments", "Houses", "Basement", "Condos"],
      bottom_value:0,
      top_value:0,
      house_to_show_in_menu:"",
      loading: true,
      filter_info: ["", "", "", "", "", ""],
      num_request: 0
    }
  }

  componentWillMount() {
    console.log("hi")
    this.setState({user_name: this.props.cookies.cookies.cur_user.username})
    axios.get(`/allhouseinfo/${this.props.cookies.cookies.cur_user._id}`).then(res => {
      let houses = res.data[1]
      let to_be_displayed = (res.data[1]).slice(0, Math.min(8, houses.length))
      this.setState({num_request: res.data[2].length, house_number: res.data[0], all_house: houses, current_house: to_be_displayed, loading: false})
    }).catch(error => console.log(error))
  }
  change_active = (e, class_name, index) => {
    if (!e.target.classList.contains("active")) {
      const buttons = document.getElementsByClassName(class_name)
      for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].classList.contains("active")) {
          buttons[i].classList.remove("active")
        }
      }
      e.target.classList.add("active")
      let tmp = this.state.filter_info
      if (index === 1){
        tmp[0] = e.target.firstChild.innerText
        this.setState({filter_info: tmp})
      }
      else if (index === 2){
        tmp[1] = e.target.firstChild.innerText
        this.setState({filter_info:tmp})
      }
    }
  }

  showdate = (value, date) => {
    const month = (value.$M)
    const day = (value.$D)
    const year = (value.$y)
    const info = `${year}-${month}-${day}`
    let tmp = this.state.filter_info
    if (date ==="start"){
      tmp[4] = [year, month, day]
      this.setState({filter_info: tmp})
    }
    else if (date === "end"){
      tmp[5] = [year, month, day]
      this.setState({filter_info: tmp})
    }
  }

  filter_general = (location_name) => {
      axios.get(`/location_info/${location_name}`).then(res => {
        console.log(res)
        let houses = res.data
        let to_be_displayed = res.data.slice(0, Math.min(8, houses.length))
        this.setState({current_house: to_be_displayed, all_houses: to_be_displayed, start_house_index: 0})
      }).catch(error => console.log(error))
  }

  changefont = () => {
    const text = document.getElementById("home")
    const img = document.getElementById("fav-hov")
    text.style.color = "red"
    img.src = "star_hover.png"
  }
  onChange = (date) => {
    // Day.js object

    // to normal Date object
  }
  handleStateChange(state) {
    this.setState({ menuOpen: state.isOpen })
  }
  handleStateChange2(state) {
    this.setState({ infoOpen: state.isOpen })
  }
  showhouse = (e,item) => {
    if (!e.target.classList.contains("PrivateSwitchBase-input-16")) {
      this.setState(state => ({ infoOpen: !state.infoOpen, house_to_show_in_menu: item }))
    }
  }

  filter = () => {
    console.log(this.state.filter_info)
    if (this.state.filter_info.indexOf("") === -1){
      axios.post("/filter_houseinfo", {
        filter_info: this.state.filter_info
      }).then(res => {
        let houses = res.data
        let to_be_displayed = res.data.slice(0, Math.min(8, houses.length))
        this.setState({current_house: to_be_displayed, all_houses: houses, start_house_index: 0})
      }).catch(
        error => console.log(error)
      )
    }
    else{
      alert("Please fill in all the filters")
    }
  }

  storebottomprice = (e) => {
    let tmp = this.state.filter_info
    tmp[2] = e.target.value
    this.setState({filter_info: tmp})
  }

  storetopprice = (e) => {
    let tmp = this.state.filter_info
    tmp[3] = e.target.value
    this.setState({filter_info:tmp})
  }

  next_page = () => {
    const all_houses = this.state.all_house
    const index = this.state.start_house_index
    if (index + 8 < all_houses.length){
      let to_be_displayed = all_houses.slice(index + 8, Math.min(index + 16, all_houses.length))
      this.setState({
        start_house_index: this.state.start_house_index + 8,
        current_house: to_be_displayed
      })
    }
  }

  signout = () => {
    console.log("hi")
    this.props.cookies.removeCookie("cur_user")
    window.location.href = "/"
  }

  prev_page = () => {
    console.log(this.state.all_house.length)
    const all_houses = this.state.all_house
    const index = this.state.start_house_index
    if (index - 8 >= 0){
      let to_be_displayed = all_houses.slice(index - 8, Math.min(index, all_houses.length))
      this.setState({
        start_house_index: this.state.start_house_index - 8,
        current_house: to_be_displayed
      })
    }
    console.log(this.state.start_house_index)
  }

  expand = () => {
    this.setState(state => ({ menuOpen: !state.menuOpen }))
  }
  render() {
    if (!this.state.loading){
      return (
        <div id="all-wrap">
          <Menu pageWrapId={"pagewrap"} outerContainerId={"all-wrap"} right disableAutoFocus customBurgerIcon={false} isOpen={this.state.menuOpen}
            onStateChange={(state) => this.handleStateChange(state)}>
            <div id="profile-pic-contain">
              <img id="profile-pic" src={this.props.cookies.cookies.cur_user.picture_url}></img>
              <span id="prof-name">{this.props.cookies.cookies.cur_user.username}</span>
            </div>
            <br></br>
            <Link to={this.props.cookies.cookies.cur_user.username === 'admin' ? '/admin' : '/user'}>
              <div id="home" className="menu-item" href="/"><img src="avatar.png"></img><span className="profile-infos">Profiles</span></div>
            </Link>
            <br></br>
            <Link to={'./'}>
            <div id="about" className="menu-item" href="/about"><img src="sign-out.png"></img><span className="profile-infos">Signout</span>
            </div>
            </Link>
          </Menu>
          <Menu1 id={"info-bar"} pageWrapId={"pagewrap"} width={'550px'} outerContainerId={"all-wrap"} right disableAutoFocus customBurgerIcon={false} isOpen={this.state.infoOpen}
            onStateChange={(state) => this.handleStateChange2(state)}>
            <div>
              <Carousel>
              {this.state.infoOpen ?
              this.state.house_to_show_in_menu.picture_urls.map((item, index) => (
                  <Carousel.Item>
                    <img
                      className="d-block w-100 sidebar-carosel"
                      src={item}
                      alt="First slide"
                    />
                  </Carousel.Item>
                )
                ) : null}
              </Carousel>
              <br></br>
              {
                this.state.house_to_show_in_menu.description
              }
              <div id="detail-sidebar">
                <Link to={`/houseinfo/${this.state.house_to_show_in_menu._id}`}>
                  <Button variant="info">Click to see more details</Button>
                </Link>
              </div>
  
            </div>
          </Menu1>
  
          <div id="pagewrap">
            <div>
              <nav id = "naving" className="navbar sticky-top navbar-expand-lg navbar-light bg-light">
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <Link to={`/messages/${this.props.cookies.cookies.cur_user._id}`}>
                    <a className="navbar-brand active-class" href="#">
                        <img src="envelope.png" width="40" height="40" alt=""></img>
                    </a>  
                  </Link>
                  <Badge pill variant="danger">
                  {this.state.num_request}
                </Badge>
                  <ul id="nav-bar" className="navbar-nav mr-auto">
                    <a className="navbar-brand active-class" href="#">
                      <img src="sublease.png" width="40" height="40" alt=""></img>
                      {' Tenant '}
                    </a>
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
                      <div className="navbar-brand" onClick = {this.signout}>
                        <img src="logout.png" width="40" height="40" alt=""></img>
                        {' Sign Out '}
                      </div>
                      </Link>
                     <a id="current-user" className="navbar-brand" href="">
                      <span id="user-name">{this.state.user_name}</span>
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
              <div id="Carosel">
                <CardDeck>
                  {this.state.location.map( (data, index) => (
                    <Card className="square-img round" style={{ height: '150px' }} onClick = {() => this.filter_general(data)}>
                     <Card.Img className="full-pic" variant="top" src= {this.state.location_pic[index]} />
                     <Card.Body><p className="place">{data}</p></Card.Body>
                    </Card>
                  ))}
                </CardDeck>
              </div>
            </div>
            <div>
              <span id="housing-info">
                
                <p className="info">Category</p>
                <div className="list-group">            
                    <div className="override category list-group-item list-group-item-action" onClick={(e) => { this.change_active(e, "category",1) }}><span className = "inline-info">Apartment</span>
                      <span className="badge badge-primary badge-pill">{this.state.house_number[0]}</span>
                    </div>
                    <button type="button" className="override category list-group-item list-group-item-action" onClick={(e) => { this.change_active(e, "category",1) }}><span className = "inline-info">House</span>
                      <span className="badge badge-primary badge-pill">{this.state.house_number[1]}</span>
                    </button>
                    <button type="button" className="override category list-group-item list-group-item-action" onClick={(e) => { this.change_active(e, "category",1) }}><span className = "inline-info">Basement</span>
                      <span className="badge badge-primary badge-pill">{this.state.house_number[2]}</span>
                    </button>
                    <button type="button" className="override category list-group-item list-group-item-action" onClick={(e) => { this.change_active(e, "category",1) }}><span className = "inline-info">Condo</span>
                      <span className="badge badge-primary badge-pill">{this.state.house_number[3]}</span>
                    </button>
                </div>
                <br></br>
                <p className="info">Location</p>
                <div className="list-group">
                  <button type="button" className="override location list-group-item list-group-item-action" onClick={(e) => { this.change_active(e, "location",2) }}><span>Downtown Toronto</span>
                    <span className="badge badge-primary badge-pill">{this.state.house_number[4]}</span>
                  </button>
                  <button type="button" className="override location list-group-item list-group-item-action" onClick={(e) => { this.change_active(e, "location",2) }}><span>Mississagua</span>
                    <span className="badge badge-primary badge-pill">{this.state.house_number[5]}</span>
                  </button>
                  <button type="button" className="override location list-group-item list-group-item-action" onClick={(e) => { this.change_active(e, "location",2) }}><span>North York</span>
                    <span className="badge badge-primary badge-pill">{this.state.house_number[6]}</span>
                  </button>
                  <button type="button" className="override location list-group-item list-group-item-action" onClick={(e) => { this.change_active(e, "location",2) }}><span>Scarbourough</span>
                    <span className="badge badge-primary badge-pill">{this.state.house_number[7]}</span>
                  </button>
                  <button type="button" className="override location list-group-item list-group-item-action" onClick={(e) => { this.change_active(e, "location",2) }}><span>Brampton</span>
                    <span className="badge badge-primary badge-pill">{this.state.house_number[8]}</span>
                  </button>
                  <button type="button" className="override location list-group-item list-group-item-action" onClick={(e) => { this.change_active(e, "location",2) }}><span>Vaughan</span>
                    <span className="badge badge-primary badge-pill">{this.state.house_number[9]}</span>
                  </button>
                  <button type="button" className="override location list-group-item list-group-item-action" onClick={(e) => { this.change_active(e, "location",2) }}><span>Richmond Hill</span>
                    <span className="badge badge-primary badge-pill">{this.state.house_number[10]}</span>
                  </button>
                  <button type="button" className="override location list-group-item list-group-item-action" onClick={(e) => { this.change_active(e, "location",2) }}><span>Markham</span>
                    <span className="badge badge-primary badge-pill">{this.state.house_number[11]}</span>
                  </button>
                </div>
                <br></br>
                <p className="info">Price</p>
                <form>
                  <div className="form-row">
                    <div className="col">
                      <input type="text" className="form-control" placeholder="from" onChange = {this.storebottomprice}></input>
                    </div>
                    <span>-</span>
                    <div className="col">
                      <input type="text" className="form-control" placeholder="to" onChange = {this.storetopprice}></input>
                    </div>
                  </div>
                </form>
                <br></br>
                <p className="info">Duration of stay</p>
                <div style={{ height: '80px' }}>
                  <DatePicker direction={0} placeholder = "Start date" showDefaultIcon onChange = {(value) => this.showdate(value, "start")} />
                  <div>--</div>
                  <DatePicker direction={0} placeholder = "End date" showDefaultIcon onChange = {(value) => this.showdate(value, "end")}/>
                 </div>
                <br></br>
                <Button id="filter_search" variant="primary" onClick = {this.filter}>
                  {' Search '}
                  <img src="Search.png"></img>
                </Button>
                <div id="bottom-space">
                </div>
              </span>
              <span id="precise-housing-info">
              <center>
              <div id="page">
                  <Button height={40} width={40} color="#1E6738" onClick={this.prev_page}>
                    <Image src='left-arrow.png' height={30} width={30}></Image>
                  </Button>
                  <span id = "pagenumber"><h4> {this.state.start_house_index/8 + 1}</h4></span>
                  <Button height={40} width={40} color="#1E6738" onClick={this.next_page}>
                    <Image src='right-arrow.png' height={30} width={30}></Image>
                  </Button>
              </div>
              </center>
                {console.log(this.state.current_house)}
                {this.state.current_house.map(item =>
                (
                <span className="housing">
                  <Card className="precise-info" onClick={(e) => this.showhouse(e, item)}>
                    <span className="image-container">
                      <Card.Img className="detailed-pic" variant="top" src={item.picture_urls[0]} />
                    </span>
                    <span className="general-info">
                      <p>Category: {item.housetype} <img src="home.png"></img></p>
                      <p>Location: {item.city}</p>
                      <span className="house-accessory"><img src="bathtub.png"></img>{` : ${item.bathroom_num} `}</span>
                      <span><img src="kitchen.png"></img>{` : ${item.kitchen_number} `}</span>
                      <br></br>
                      <br></br>
                      <span className="house-accessory"><img src="bed.png"></img>{` : ${item.bed_number}`}</span>
                      <span><img src="toilet.png"></img>{` : ${item.toilet_number} `}</span>
                      <p className="price"><br></br>{`Price: ${item.price}`}<span id="margin-lef"></span></p>
                    </span>
                  </Card>
                </span> ))}
  
              </span>
            </div>
          </div>
        </div>
      )
    }
    else{
      return null
    }
  }
}

export default Mainpage;
