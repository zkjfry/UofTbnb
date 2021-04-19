import React from 'react';
import './RoommateInfo.css';
import 'bootstrap/dist/css/bootstrap.css';
import houses from './houses'
import Button from 'react-bootstrap/Button';
import ProgressBar from 'react-bootstrap/ProgressBar'
import { Link, NavLink } from 'react-router-dom';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import { slide as Menu } from 'react-burger-menu'
import { RangeDatePicker } from '@y0c/react-datepicker';
import { withRouter } from 'react-router-dom';
import userlist from './UserList'
import CardDeck from 'react-bootstrap/CardDeck'
import Card from 'react-bootstrap/Card'
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

class RoommateInfo extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            pic: process.env.PUBLIC_URL + "/dummyuser.jpg",
            apply_state: "APPLY FOR ROOMMATE",
            id: this.props.match.params.id,
            roommate_info: undefined,
            loading: true,
            menuOpen: false,
            start_date: new Date(),
            end_date: new Date(),
            num_request: 0
        }
    }
    componentWillMount(state) {
        axios.get(`/roommateinfo/${this.state.id}`).then((res) => {
            axios.get(`/requesting/${this.props.cookies.cookies.cur_user._id}`)
                .then((res1) => {
                    this.setState({
                        roommate_info: res.data,
                        num_request: res1.data[0].length,
                        loading: false
                    })
                })

        })
    }
    handleStateChange(state) {
        this.setState({ menuOpen: state.isOpen })
    }

    handleStateChange(state) {
        this.setState({ menuOpen: state.isOpen })
    }

    expand = () => {
        this.setState(state => ({ menuOpen: !state.menuOpen }))
    }

    change_apply_state = (e) => {
        console.log(this.state.roommate_info)
        if (this.state.apply_state == "APPLY FOR ROOMMATE") {
            this.setState({
                apply_state: "CANCEL"
            })
            e.target.setAttribute("variant", "danger")
            e.target.classList.remove("btn-success")
            e.target.classList.add("btn-danger")
            axios.post("/reserve", {
                sender_id: this.props.cookies.cookies.cur_user._id,
                receiver_id: this.state.roommate_info.roommate_id,
                reserve_type: "roommate",
                approved: false,
                info_id: this.state.id,
                start_date: this.state.start_date,
                end_date: this.state.end_date
            }, header).then(response => {
                console.log(response.data);
            }).catch((err) => {
                console.log(err)
            });
        } else {
            this.setState({
                apply_state: "APPLY FOR ROOMMATE"
            })
            e.target.setAttribute("variant", "success")
            e.target.classList.remove("btn-danger")
            e.target.classList.add("btn-success")
        }

    }

    formatDate = string => {
        let date = new Date(string)
        console.log(date)
        let tmp = date.toLocaleDateString("en-US")
        tmp = tmp.split("/")
        const year = tmp[2];
        const month = tmp[0];
        const day = tmp[1];
        const datei = `${year}/${month}/${day}`;
        return datei;
    }

    onChange = (date1, date2) => {
        this.setState({
            start_date: date1,
            end_date: date2
        })
    }

    render() {

        if (this.state.loading) {
            return null
        } else {
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
                            <div id="home" className="menu-item" href="/"><img src={process.env.PUBLIC_URL + "/avatar.png"}></img><span className="profile-infos">Profiles</span></div>
                        </Link>
                        <br></br>
                        <Link to="./">
                            <div id="about" className="menu-item" href="/about"><img src={process.env.PUBLIC_URL + "/sign-out.png"}></img><span className="profile-infos">Sign out</span></div>
                        </Link>
                    </Menu>

                    <div id="pagewrap">
                        <div>
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
                                        <Link to={`${process.env.PUBLIC_URL}/mainpage`}>
                                            <div className="navbar-brand active-class" href="/">
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
                                        <a id="current-user" className="navbar-brand" href="#">
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
                            <Container className="userinfocontainer">
                                <Row>
                                <Carousel>
                                {this.state.roommate_info.picture_urls.map((item) => (
                                <Carousel.Item>
                                <Image className="d-block w-100 sidebar-carosel" src={item} height={500} width={600} alt="First slide"></Image>
                                </Carousel.Item>
                                ))}
                                </Carousel>
                                </Row>
                                <Row>
                                    <Col sm={3}><h1 className="name">{this.state.roommate_info.roommate_name}</h1></Col>
                                </Row>
                                <Row>
                                    <Col sm={3}><h4 className="info">Gender: {this.state.roommate_info.gender}</h4></Col>
                                    <Col sm={3}><h4 className="info">Age: {this.state.roommate_info.age}</h4></Col>
                                    <Col sm={3}><h4 className="info">Live at: {this.state.roommate_info.location}</h4></Col>
                                </Row>
                                <Row>
                                    <Col sm={3}><h4 className="info">Socializing level: </h4><div><ProgressBar variant="success" now={this.state.roommate_info.socialization_level * 20}/></div></Col>
                                    <Col sm={3}><h4 className="info">Friendly level: </h4><div><ProgressBar variant="info" now={this.state.roommate_info.friendly_level * 20}/></div></Col>
                                    <Col sm={3}><h4 className="info">Cooking level: </h4><div><ProgressBar variant="warning" now={this.state.roommate_info.cooking_level * 20}/></div></Col>
                                </Row>
                                <Row>
                                <Col sm={3}><h4 className="info">Cleanliness: </h4><div><ProgressBar variant="danger" now={this.state.roommate_info.cleanliness * 20}/></div></Col>
                                <Col sm={3}><h4 className="info">Noisy extent: </h4><div><ProgressBar variant="dark" now={this.state.roommate_info.noisy_extent * 20}/></div></Col>
                                </Row>
                                <Row>
                                    <Col sm={3}><h4 className="info">Wakeup: {this.state.roommate_info.wakeup_time}</h4></Col>
                                    <Col sm={3}><h4 className="info">Sleep: {this.state.roommate_info.sleep_time}</h4></Col>
                                </Row>
                                <Row>
                                    <Col sm={3}><h4 className="info">Smoking: {this.state.roommate_info.smoking ? "Yes" : "No"}</h4></Col>
                                    <Col sm={3}><h4 className="info">Pets friendly: {this.state.roommate_info.pets_friendly ? "Yes" : "No"}</h4></Col>
                                </Row>
                                <Row>
                                    <Col sm={3}><h4 className="info">Start date: {this.formatDate(this.state.roommate_info.start_date)}</h4></Col>
                                    <Col sm={3}><h4 className="info">End date: {this.formatDate(this.state.roommate_info.end_date)}</h4></Col>
                                </Row>
                                <Row>
                                    <Col md={7}><p>
                                    {this.state.roommate_info.description}
                                    </p></Col>
                                </Row>


                            </Container>
                            <div id="Carousel">
                                <CardDeck>
                                    <Card id="request">
                                        <h3 className="info">Roommate Duration</h3>
                                        <div>
                                            <RangeDatePicker direction={0} startPlaceholder="Start Date" endPlaceholder="End Date" onChange={this.onChange} />
                                        </div>
                                        <br></br>
                                        <Button id="reserve_button" variant="success" onClick={this.change_apply_state}>
                                            {this.state.apply_state}
                                        </Button>
                                        <br></br>
                                    </Card>
                                </CardDeck>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    }
}

export default withRouter(RoommateInfo)