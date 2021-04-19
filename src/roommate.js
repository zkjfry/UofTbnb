import React from 'react';
import './roommate.css';
import 'bootstrap/dist/css/bootstrap.css';
import CardDeck from 'react-bootstrap/CardDeck'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import { DatePicker } from '@y0c/react-datepicker';
import '@y0c/react-datepicker/assets/styles/calendar.scss';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { green } from '@material-ui/core/colors';
import { withStyles } from '@material-ui/core/styles';
import PetsIcon from '@material-ui/icons/Pets';
import SmokingRoomsIcon from '@material-ui/icons/SmokingRooms';
import Pagination from 'react-bootstrap/Pagination'
import SmokeFreeIcon from '@material-ui/icons/SmokeFree';
import Fade from 'react-bootstrap/Fade'
import { makeStyles } from '@material-ui/core/styles';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import Popover from 'react-bootstrap/Popover'
import PopoverTitle from 'react-bootstrap/PopoverTitle'
import PopoverContent from 'react-bootstrap/PopoverContent'
import Overlay from 'react-bootstrap/Overlay'
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import './Mainpage.css'
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
//import Image from 'react-bootstrap/Image';
import Image from 'react-image-resizer'
import { scaleRotate as Menu } from 'react-burger-menu'
import Badge from 'react-bootstrap/Badge'
import axios from 'axios'

class roommate extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            checked_box: [false, false, false],
            smoke_free: false,
            smoke: false,
            filter_open: false,
            useStyles: makeStyles(theme => ({
                root: {
                    width: 300,
                },
                margin: {
                    height: theme.spacing(3),
                },
            })),
            marks: [
                {
                    value: 0,
                    label: '1',
                },
                {
                    value: 25,
                    label: '2',
                },
                {
                    value: 50,
                    label: '3',
                },
                {
                    value: 75,
                    label: '4',
                },
                {
                    value: 100,
                    label: '5',
                },
            ],
            classes: this.useStyles,
            num_request: 0,
            loading: true,
            all_roommate: [],
            current_roommate: [],
            start_index: 0,
            location: ["Downtown Toronto", "Mississagua", "North York", "Scarbourough", "Brampton", "Vaughan", "Richmond Hill", "Markham"],
            location_pic: ["Toronto.jpg", "missi.jpg", "north-york.jpg", "scar.jpg", "bramp.jpg", "vaug.jpg", "richmond.jpg", "markham.jpeg"],
            counting: [0,0,0,0,0,0,0,0],
            pets:false,
            smoke:false,
            filter_info: ["", false, false, "", "", "", "", "", "", "", "", "", 1,1,1,1,1]
        }
    }
    handleStateChange(state) {
        this.setState({ menuOpen: state.isOpen })
    }
    componentWillMount() {
        axios.get(`/allrequest_info/${this.props.cookies.cookies.cur_user._id}`).then(res => {
            axios.get("/allroommate").then(res1 => {
                let to_be_displayed = (res1.data[1]).slice(0, Math.min(8, res1.data[1].length))
                this.setState(
                    {counting: res1.data[0], 
                    all_roommate: res1.data[1], 
                    num_request: res.data.length,
                    start_index:0,
                    current_roommate: to_be_displayed,
                    loading: false})
            })
        }).catch(error => console.log(error))

    }

    expand = () => {
        this.setState(state => ({ menuOpen: !state.menuOpen }))
    }
    change_active = (e, class_name, location) => {
        let filter = this.state.filter_info
        filter[3] = location
        this.setState({
            filter_info: filter
        })
        if (!e.target.classList.contains("active")) {
            const buttons = document.getElementsByClassName(class_name)
            for (let i = 0; i < buttons.length; i++) {
                if (buttons[i].classList.contains("active")) {
                    buttons[i].classList.remove("active")
                }
            }
            e.target.classList.add("active")
        }
    }

    smoke = () => {
        let cur = this.state.smoke
        let filter = this.state.filter_info
        filter[2] = !cur
        this.setState({
            smoke: !cur,
            filter_info: filter
        })
    }

    pets = () => {
        let cur = this.state.pets
        let filter = this.state.filter_info
        filter[1] = !cur
        this.setState(
            {
                pets: !cur,
                filter_info: filter
            }
        )
    }

    set_open = () => {
        this.setState({ filter_open: !this.state.filter_open })
    }
    handleChange = (index) => {
        let new_checked = this.state.checked_box
        let filter = this.state.filter_info
        new_checked[index] = !new_checked[index]
        if (new_checked[index]){
            if (index == 0) {
                filter[0] = "Male"
            }
            else if (index == 1) {
                filter[0] = "Female"
            }
            else {
                filter[0] = "Dont"
            }
        }
        this.setState({
            checked_box: new_checked,
            filter_info: filter
        })
    }

    price = (e, index) => {
        let filter = this.state.filter_info
        if (index == 0) {
            let cur = parseInt(e.target.value)
            filter[4] = cur
            this.setState({
                filter_info: filter
            })
        }
        else if (index == 1) {
            let cur = parseInt(e.target.value)
            filter[5] = cur
            this.setState({
                filter_info: filter
            })
        }
    }

    display = (e, value, index) => {
        let filter = this.state.filter_info
        filter[index+12] = Math.floor((value + 25) / 25)
        this.setState({
            filter_info: filter
        })

    }

    wakeup = (e, index) => {
        let filter = this.state.filter_info
        filter[index] = e.target.value
        this.setState({
            filter_info: filter
        })
    }

    valuetext = (value, index) => {
        // let filter = this.state.filter_info
        // filter[index+12] = value
        // this.setState({
        //     filter_info: filter
        // })
    }

    startfilter = () => {
        let exist = false
        if (this.state.filter_info.indexOf("") == -1){
            axios.post("/filterroommate", {
                filter: this.state.filter_info
            }).then(res => {
                let all_roommates = res.data
                let to_be_displayed = all_roommates.slice(0, Math.min(8, all_roommates.length))
                this.setState({all_roommate: all_roommates, current_roommate: to_be_displayed, start_index: 0})
            }).catch(error => {
                console.log(error)
            })
        }
        else{
            alert("Please complete all fields")
        }
    }

    valueLabelFormat = (value) => {
        return this.state.marks.findIndex(mark => mark.value === value) + 1;
    }

    showdate = (value, date) => {
        console.log(value)
        const month = (value.$M)
        const day = (value.$D)
        const year = (value.$y)
        const info = `${year}-${month}-${day}`
        let tmp = this.state.filter_info
        if (date === "start") {
            tmp[10] = [year, month, day]
            this.setState({ filter_info: tmp })
        }
        else if (date === "end") {
            tmp[11] = [year, month, day]
            this.setState({ filter_info: tmp })
        }
    }

    next_page = () => {
        const all_roommates = this.state.all_roommate
        const index = this.state.start_index
        if (index + 8 < all_roommates.length) {
            let to_be_displayed = all_roommates.slice(index + 8, Math.min(index + 16, all_roommates.length))
            this.setState({
                start_index: this.state.start_index + 8,
                current_roommate: to_be_displayed
            })
        }
    }

    prev_page = () => {
        const all_roommates = this.state.all_roommate
        const index = this.state.start_index
        if (index - 8 >= 0) {
            let to_be_displayed = all_roommates.slice(index - 8, Math.min(index, all_roommates.length))
            this.setState({
                start_index: this.state.start_index - 8,
                current_roommate: to_be_displayed
            })
        }
    }

      filter_general = (location) => {
        axios.get(`/filtergenroommate/${location}`).then(res => {
            let all_roommates = res.data
            let to_be_displayed = all_roommates.slice(0, Math.min(8, all_roommates.length))
            this.setState({all_roommate: res.data, current_roommate: to_be_displayed, start_index: 0})
        })
      }

    render() {
        if (this.state.loading) {
            return null
        }
        else {
            const GreenCheckbox = withStyles({
                root: {
                    color: green[400],
                    '&$checked': {
                        color: green[600],
                    },
                },
                checked: {},
            })(props => <Checkbox color="default" {...props} />);
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
                        <Link to='./'>
                            <div id="about" className="menu-item" href="/about"><img src="sign-out.png"></img><span className="profile-infos">Signout</span>
                            </div>
                        </Link>
                        <br></br>
                    </Menu>
                    <div id="pagewrap">
                        <nav className="navbar sticky-top navbar-expand-lg navbar-light bg-light">
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

                        <div id="Carosel">
                            <CardDeck>
                                {this.state.location.map((data, index) => (
                                    <Card className="square-img round" style={{ height: '150px' }} onClick={() => this.filter_general(data)}>
                                        <Card.Img className="full-pic" variant="top" src={this.state.location_pic[index]} />
                                        <Card.Title><p className="place">{data}</p></Card.Title>
                                    </Card>
                                ))}
                            </CardDeck>
                        </div>
                        <div>
                            <span id="housing-info">
                                <p className="info">Gender</p>
                                <p>Male<span className="margin-lef"></span><FormControlLabel
                                    control={
                                        <GreenCheckbox
                                            checked={this.state.checked_box[0]}
                                            onChange={(e) => this.handleChange(0)}
                                            value="checkedG"
                                        />
                                    } />
                                    <span className="margin-lef"></span>Female<span className="margin-lef"></span><FormControlLabel
                                        control={
                                            <GreenCheckbox
                                                checked={this.state.checked_box[1]}
                                                onChange={(e) => this.handleChange(1)}
                                                value="checkedG"
                                            />
                                        } />
                                </p>
                                <p>I don't mind<span className="margin-lef"></span><FormControlLabel
                                    control={
                                        <GreenCheckbox
                                            checked={this.state.checked_box[2]}
                                            onChange={(e) => this.handleChange(2)}
                                            value="checkedG"
                                        />
                                    } /></p>
                                <p id="pets">Pets Friendly<span className="margin-lef"></span>  <FormControlLabel
                                    control={<Checkbox icon={<PetsIcon />} checkedIcon={<PetsIcon />} value="checkedH" onChange={this.pets} />}
                                /></p>
                                <span id="pets">Smoking <span className="smoke-margin-lef"></span> <FormControlLabel
                                    control={<Checkbox id="smoke" icon={<SmokingRoomsIcon />} checkedIcon={<SmokingRoomsIcon />} value="checkedH"
                                        onChange={this.smoke} />}
                                />
                                </span>
                                <br></br>
                                <p className="info">Location</p>
                                <div className="list-group">
                                    {
                                        this.state.location.map((item, index) => (
                                            <button type="button" className="override location list-group-item list-group-item-action" onClick={(e) => { this.change_active(e, "location", item) }}>{item}
                                                <span className="badge badge-primary badge-pill">{this.state.counting[index]}</span>
                                            </button>
                                        ))
                                    }
                                </div>
                                <br></br>

                                <p className="info">Age range</p>
                                <form>
                                    <div className="form-row">
                                        <div className="col">
                                            <input type="text" className="form-control" placeholder="from" onChange={(e) => this.price(e, 0)}></input>
                                        </div>
                                        <span>-</span>
                                        <div className="col">
                                            <input type="text" className="form-control" placeholder="to" onChange={(e) => this.price(e, 1)}></input>
                                        </div>
                                    </div>
                                </form>
                                <br></br>
                                <p className="info">Wake up time</p>
                                <form>
                                    <div className="form-row">
                                        <div className="col">
                                            <input type="time" className="form-control" placeholder="from" onChange={(e) => this.wakeup(e, 6)}></input>
                                        </div>
                                        <span>-</span>
                                        <div className="col">
                                            <input type="time" className="form-control" placeholder="to" onChange={(e) => this.wakeup(e, 7)}></input>
                                        </div>
                                    </div>
                                </form>
                                <p className="info">Sleep time</p>
                                <form>
                                    <div className="form-row">
                                        <div className="col">
                                            <input type="time" className="form-control" placeholder="from" onChange={(e) => this.wakeup(e, 8)}></input>
                                        </div>
                                        <span>-</span>
                                        <div className="col">
                                            <input type="time" className="form-control" placeholder="to" onChange={(e) => this.wakeup(e, 9)}></input>
                                        </div>
                                    </div>
                                </form>
                                <br></br>
                                <p className="info">Duration of stay</p>
                                <div style={{ height: '80px' }}>
                                    <DatePicker direction={0} placeholder="Start date" showDefaultIcon onChange={(value) => this.showdate(value, "start")} />
                                    <div>--</div>
                                    <DatePicker direction={0} placeholder="End date" showDefaultIcon onChange={(value) => this.showdate(value, "end")} />
                                </div>
                                <div id="more-filters">
                                    <OverlayTrigger
                                        trigger="click"
                                        key={"top"}
                                        placement={"top"}
                                        overlay={
                                            <Popover id={`popover-positioned-${"top"}`}>
                                                <Popover.Title as="h3">More filters for roommate search</Popover.Title>
                                                <Popover.Content>
                                                    <div>
                                                        Cooking Level
                                     <Slider
                                                            defaultValue={0}
                                                            valueLabelFormat={this.valueLabelFormat}
                                                            getAriaValueText={this.valuetext}
                                                            onChange={(e, value) => this.display(e, value, 0)}
                                                            aria-labelledby="discrete-slider-restrict"
                                                            step={null}
                                                            valueLabelDisplay="auto"
                                                            marks={this.state.marks}
                                                        />
                                                        Socialization Level<div className={this.state.classes} />
                                                        <Slider
                                                            defaultValue={0}
                                                            valueLabelFormat={this.valueLabelFormat}
                                                            getAriaValueText={this.valuetext}
                                                            onChange={(e, value) => this.display(e, value, 1)}
                                                            aria-labelledby="discrete-slider-restrict"
                                                            step={null}
                                                            valueLabelDisplay="auto"
                                                            marks={this.state.marks}
                                                        />
                                                        Friendly Level<div className={this.state.classes} />
                                                        <Slider
                                                            defaultValue={0}
                                                            valueLabelFormat={this.valueLabelFormat}
                                                            getAriaValueText={this.valuetext}
                                                            onChange={(e, value) => this.display(e, value, 2)}
                                                            aria-labelledby="discrete-slider-restrict"
                                                            step={null}
                                                            valueLabelDisplay="auto"
                                                            marks={this.state.marks}
                                                        />
                                                        Cleanliness<div className={this.state.classes} />
                                                        <Slider
                                                            defaultValue={0}
                                                            valueLabelFormat={this.valueLabelFormat}
                                                            onChange={(e, value) => this.display(e, value, 3)}
                                                            getAriaValueText={this.valuetext}
                                                            aria-labelledby="discrete-slider-restrict"
                                                            step={null}
                                                            valueLabelDisplay="auto"
                                                            marks={this.state.marks}
                                                        />
                                                        Noisy extent<div className={this.state.classes} />
                                                        <Slider
                                                            defaultValue={0}
                                                            valueLabelFormat={this.valueLabelFormat}
                                                            onChange={(e, value) => this.display(e, value, 4)}
                                                            getAriaValueText={this.valuetext}
                                                            aria-labelledby="discrete-slider-restrict"
                                                            step={null}
                                                            valueLabelDisplay="auto"
                                                            marks={this.state.marks}
                                                        />
                                                    </div>
                                                </Popover.Content>
                                            </Popover>
                                        }>
                                        <Button id="filter-button" variant="primary">More filters</Button>
                                    </OverlayTrigger>
                                </div>
                                <br></br>
                                <Button id="filter_search" variant="primary" onClick={this.startfilter}>
                                    {' Search '}
                                    <img src="Search.png"></img>
                                </Button>
                                <div id="bottom-space">
                                </div>
                            </span>
                            <span id="precise-housing-info">
                            <center>
                                <div id="page-for-room">
                                    <Button height={40} width={40}  onClick={this.prev_page}>
                                        <Image src='left-arrow.png' height={30} width={30}></Image>
                                    </Button>
                                    <span id = "pagenumber"><h4> {this.state.start_index/8 + 1}</h4></span>
                                    <Button height={40} width={40} onClick={this.next_page}>
                                        <Image src='right-arrow.png' height={30} width={30}></Image>
                                    </Button>
                                </div>
                                </center>
                                <div id = "moreroommate"><Link to={'./editroommateinfo'}><Button id="roommate-info-button" variant="success">Can't find an ideal match here? Come post your own information!</Button></Link></div>
                                {
                                    this.state.current_roommate.map(item => (
                                        <span className="housing">
                                            <Card className="precise-info" onClick={this.showhouse}>
                                                <span className="image-container">
                                                    <Card.Img className="detailed-pic" variant="top" src={item.picture_urls[0]} />
                                                </span>
                                                <span className="general-info">
                                                    <p>Name: {item.roommate_name}</p>
                                                    <p>Gender: {item.gender}</p>
                                                    <p>Age: {item.age}</p>
                                                    <p>Location: {item.location}</p>
                                                    <Link to={`/roommate/${item._id}`}><Button>View Detail</Button></Link>
                                                </span>
                                            </Card>
                                        </span>
                                    ))
                                }
                            </span>
                        </div>
                    </div>
                </div>
            )
        }
    }

}

export default roommate