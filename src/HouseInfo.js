import React from 'react';
import './HouseInfo.css';
import './Mainpage.css';
import 'bootstrap/dist/css/bootstrap.css';
import Button from 'react-bootstrap/Button';
import { Link, NavLink } from 'react-router-dom';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import CardDeck from 'react-bootstrap/CardDeck'
import Card from 'react-bootstrap/Card'
import { slide as Menu } from 'react-burger-menu'
import Container from 'react-bootstrap/Container'
import { RangeDatePicker } from '@y0c/react-datepicker';
import {withRouter} from 'react-router-dom';
import axios from 'axios';
import Image from 'react-image-resizer'
import Carousel from 'react-bootstrap/Carousel'
import Badge from 'react-bootstrap/Badge'

const header = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
};

class HouseInfo extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            reserve_id: 0,
            reserve_state: "RESERVE",
            start_date: new Date(),
            end_date: new Date(),
            house_id: this.props.match.params.id,
            menuOpen: false,
            house: undefined,
            reviews: [],
            loading: true,
            users: [],
            avg_rating: 0,
            num_request: 0
        }
    }

    componentWillMount() {
        axios.get(`/Review/GetReviewForHouse/${this.state.house_id}`)
            .then(res => {
                console.log(res)
                this.setState({
                    house: res.data[2],
                    reviews: res.data[1],
                    users: res.data[0],
                    loading: false
                })
                var sum = 0;
                for (var i = 0; i < res.data[1].length; i++) {
                    sum += res.data[1][i].rating
                }
                this.setState({avg_rating: res.data[1].length == 0 ? 0 : (sum/res.data[1].length).toFixed(2)})
                axios.get(`/requesting/${this.props.cookies.cookies.cur_user._id}`)
                    .then(data => {
                        console.log(data)
                        this.setState({
                            num_request: data.data[0].length,
                            loading: false
                        })
                    })
            })
            .catch(err => console.log(err))
    }
    handleStateChange(state) {
        this.setState({ menuOpen: state.isOpen })
    }

    expand = () => {
        this.setState(state => ({ menuOpen: !state.menuOpen }))
    }

    change_reserve_state = (e) => {
        if (this.state.reserve_state == "RESERVE") {
            this.setState({
                reserve_state: "CANCEL"
            })
            e.target.setAttribute("variant", "danger")
            e.target.classList.remove("btn-success")
            e.target.classList.add("btn-danger")
            axios.post("/reserve", {
                sender_id: this.props.cookies.cookies.cur_user._id,
                receiver_id: this.state.house.owner,
                reserve_type: "house",
                approved: false,
                info_id: this.state.house_id,
                start_date: this.state.start_date,
                end_date: this.state.end_date
              }, header).then(response => {
                console.log(response.data);
              }, error => {
                console.log(error)
              });
        } else {
            this.setState({
                reserve_state: "RESERVE"
            })
            e.target.setAttribute("variant", "success")
            e.target.classList.remove("btn-danger")
            e.target.classList.add("btn-success")
        }

    }

    formatDate = string => {
        let date = new Date(string)
        let tmp = date.toLocaleDateString("en-US")
        tmp = tmp.split("/")
        const year = tmp[2];
        const month = tmp[0];
        const day = tmp[1];
        const datei = `${year}/${month}/${day}`;
        return datei;
    }

    change_active = (e, class_name, pic_num) => {
        const picList = document.querySelectorAll('.housepic')
        this.setState({
            pic: picList[pic_num].src
        })
        if (!e.target.classList.contains("act")) {
            const buttons = document.getElementsByClassName(class_name)
            for (let i = 0; i < buttons.length; i++) {
                if (buttons[i].classList.contains("act")) {
                    buttons[i].classList.remove("act")
                }
            }
            e.target.classList.add("act")
        }
    }

    onChange = (date1, date2) => {
        this.setState({
            start_date: date1,
            end_date: date2
        })
    }

    render() {
        if (this.state.loading){
            return null
        }
        else{
            console.log(this.state.users)
            console.log(this.state.reviews)
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
                        <div id="home" className="menu-item" href="/"><img src={process.env.PUBLIC_URL + '/avatar.png'}></img><span className="profile-infos">Profiles</span></div>
                    </Link>
                    <br></br>
                    <Link to = '/'>
                        <div id="about" className="menu-item" href="/about"><img src={process.env.PUBLIC_URL + '/sign-out.png'}></img><span className="profile-infos">Sign out</span></div>
                    </Link>
                </Menu>
                <div id="pagewrap">
                    <nav className="navbar sticky-top navbar-expand-lg navbar-light bg-light">
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <Link to={`/messages/${this.props.cookies.cookies.cur_user._id}`}>
                            <a className="navbar-brand active-class" href="#">
                                <img src={process.env.PUBLIC_URL + "/envelope.png"} width="40" height="40" alt=""></img>
                            </a>  
                        </Link>
                            <Badge pill variant="danger">
                                {this.state.num_request}
                            </Badge>
                            <ul id="nav-bar" className="navbar-nav mr-auto">
                                <Link to={'/mainpage'}>
                                    <div className="navbar-brand active-class" href="#">
                                        <img src={process.env.PUBLIC_URL + '/sublease.png'} width="40" height="40" alt=""></img>
                                        {' Tenant '}
                                    </div>
                                </Link>
                                <Link to={'/landlord'}>
                                    <div className="navbar-brand" href="#">
                                        <img src={process.env.PUBLIC_URL + '/landlord.png'} width="40" height="40" alt=""></img>
                                        {' Landlord '}
                                    </div>
                                </Link>
                                <Link to={'/roommate'}>
                                    <div className="navbar-brand" href="#">
                                        <img src={process.env.PUBLIC_URL + '/friendship.png'} width="40" height="40" alt=""></img>
                                        {' Roommate '}
                                    </div>
                                </Link>
                                <Link to={'/'}>
                                    <div className="navbar-brand" href="#">
                                        <img src={process.env.PUBLIC_URL + '/logout.png'} width="40" height="40" alt=""></img>
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
                                    <img src={process.env.PUBLIC_URL + '/expand.png'}></img>
                                </a>
                            </ul>
                        </div>
                    </nav>
                    <Container className="houseinfocontainer">
                        <Row>
                            <Carousel>
                            {
                                this.state.house.picture_urls.map((item) => (
                                <Carousel.Item>
                                <center>
                                <Image
                                className="d-block w-100 sidebar-carosel"
                                src={item}
                                height={500}
                                width={600}

                                alt="First slide"
                                ></Image>
                                </center>
                                
                                </Carousel.Item>
                            ))}
                            </Carousel>

                        </Row>
                        <Row>
                            <Col md={0.5}><h2>{this.state.house.address}</h2></Col>
                            <Col md={{ span: 4, offset: 1 }}>
                                <h4>owner: {this.state.house.owner_name}</h4>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={0.5}><h3>{this.state.house.city}, {this.state.house.prov}, {this.state.house.country}</h3></Col>
                        </Row>
                        <Row>
                            <Col sm={0.5}><h3>{this.state.house.price}</h3>/month</Col>
                        </Row>
                        <Row>
                            <Col sm={2}><span className="house-accessory"><img src={process.env.PUBLIC_URL + '/bathtub.png'}></img>{` : ${this.state.house.bathroom_num} `}</span></Col>
                            <Col sm={0.5}><span><img src={process.env.PUBLIC_URL + '/kitchen.png'}></img>{` : ${this.state.house.kitchen_number} `}</span></Col>
                        </Row>
                        <Row>
                            <Col sm={2}><span className="house-accessory"><img src={process.env.PUBLIC_URL + '/bed.png'}></img>{` : ${this.state.house.bed_number} `}</span></Col>
                            <Col sm={0.5}><span><img src={process.env.PUBLIC_URL + '/toilet.png'}></img>{` : ${this.state.house.toilet_number} `}</span></Col>
                        </Row>
                        <Row>
                            <Col md={7}><p>
                                {this.state.house.description}
                        </p></Col>
                        </Row>
                        <Row>
                            <Col sm={0.5}> <h3>Amenties:</h3></Col>
                        </Row>
                        <Row>
                                <Col sm={3}><span className="house-accessory"><img src={process.env.PUBLIC_URL + '/wifi.png'}></img>{' Wifi '}: {this.state.house.amenities.indexOf("WIFI") == -1 ? "No" : "Yes"}</span></Col>
                                <Col sm={0.5}><span><img src={process.env.PUBLIC_URL + '/parking.png'}></img>{' Free Parking '}: {this.state.house.amenities.indexOf("Free Parking") == -1 ? "No" : "Yes"}</span></Col>
                        </Row>
                        <Row>
                            <Col sm={3}><span className="house-accessory"><img src={process.env.PUBLIC_URL + '/television.png'}></img>{' TV '}: {this.state.house.amenities.indexOf("TV") == -1 ? "No" : "Yes"}</span></Col>
                            <Col sm={0.5}><span><img src={process.env.PUBLIC_URL + '/thermometer.png'}></img>{' Heating '}: {this.state.house.amenities.indexOf("Air Condition/Heating") == -1 ? "No" : "Yes"}</span></Col>
                        </Row>
                        <Row>
                            <Col sm={0.5}> <h3>Reviews:</h3></Col>
                            <div className='timelineHeader'></div>
                        </Row>
                        <Row>
                            <Col md={0.5}> <img src={process.env.PUBLIC_URL + '/star.png'}></img></Col>
                            <Col md={1}><h4>{this.state.avg_rating}</h4></Col>
                            <Col md={5}><h4> ({this.state.reviews.length} reviews)</h4></Col>
                        </Row>
                        <div>
                        {this.state.reviews.map((review, index) => (
                        <div className='review'>
                            <div className="reviewIconContainer">
                                <img className="reviewIcon" src={this.state.users[index].picture_url}></img>
                            </div>
                            <div className="reviewContent">
                        <div><h4>{this.state.users[index].username}</h4><img src={process.env.PUBLIC_URL + '/star.png'}></img> {review.rating}</div> <span class="grey">{this.formatDate(review.time)}</span>
                                <p>
                                    {review.comment}
                                </p>
                            </div>
                        </div>
                        ))}
                        </div>
                    </Container>
                        <CardDeck>
                            <Card id="requestcard">
                                <p className="info"><h2>${this.state.house.price}</h2> per month</p>
                                <Container>
                                    <Row>
                                        <Col sm={0.5}> <img src={process.env.PUBLIC_URL + '/star.png'}></img></Col>
                                        <Col sm={3}><h4>{this.state.avg_rating}</h4></Col>
                                    </Row>
                                    <Row>
                                        <Col sm={0.5}> House type: {this.state.house.housetype}</Col>
                                    </Row>
                                    <Row>
                                        <Col sm={0.5}> Space type: {this.state.house.spacetype}</Col>
                                    </Row>
                                    <Row>
                                        <Col sm={0.5}> Price: {this.state.house.price}</Col>
                                    </Row>
                                </Container>
                                <div style={{ height: '50px' }}>
                                    <RangeDatePicker direction={0} startPlaceholder="Start Date" endPlaceholder="End Date" onChange={this.onChange}/>
                                </div>
                                <br></br>
                                <Button id="reserve_button" variant="success" onClick={this.change_reserve_state}>
                                    {this.state.reserve_state}
                                </Button>
                                <div id="bottom-space">
                                </div>
                            </Card>
                        </CardDeck>
                                    
            </div >
        </div >
        )
    }}
}

export default withRouter(HouseInfo)