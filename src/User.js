import React from 'react';
import './User.css';
import Button from 'react-bootstrap/Button';
import { slide as Menu } from 'react-burger-menu'
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import Carousel from 'react-bootstrap/Carousel'
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Badge from 'react-bootstrap/Badge'
import Image from 'react-image-resizer'
class User extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      username: "",
      name: "",
      id: this.props.match.params.id,
      profile_img: this.props.cookies.cookies.cur_user.picture_url,
      menuOpen: false,
      selectedFile: null,
      loading: true,
      img_obj: new FormData(),
      current_renting: [],
      past_rented: [],
      landlord_renting: [],
      landlord_past: [],
      num_request: 0,

      render_img: (file) => {
        var fr = new FileReader();
        fr.onload = this.state.onFileReaderLoad;
        fr.readAsDataURL(file)
        let tmp = new FormData()
        tmp.append(1, file)
        this.state.img_obj = tmp
      },
      onFileReaderLoad: (e) => {
        this.setState({
          userImage: e.target.result
        })
      }
    }
  }
  componentWillMount() {
    axios.get(`/user/all/${this.props.cookies.cookies.cur_user._id}`).then((res1) => {
      console.log(res1.data)
      this.setState({
        current_renting: res1.data[0],
        past_rented: res1.data[1],
        landlord_renting: res1.data[2],
        landlord_past: res1.data[3],
        loading: false
      })
    }).catch(err => console.log(err))
  }

  handleStateChange(state) {
    this.setState({ menuOpen: state.isOpen })
  }

  expand = () => {
    this.setState(state => ({ menuOpen: !state.menuOpen }))
  }

  end_rent = (houseInfo) => {
    axios.patch(`/House/endRent/${houseInfo}/${this.props.cookies.cookies.cur_user._id}`)
      .then(result => console.log(result))
      .catch(error => console.log(error))
  }
  render() {
    if (this.state.loading) {
      return null
    } else {
      let current_renting
      if (this.state.current_renting.length === 0) {
        current_renting =
          <Col md="3" className="request_col">
            <Card className="request_card">
              <Card.Body>
                <Card.Text>Not currently renting any house</Card.Text>
              </Card.Body>
            </Card>
          </Col>
      } else {
        current_renting = this.state.current_renting.map((houseInfo, index) => (
          <Col md="3" key={index} className="request_col">
            <Card className="request_card">
              <Card.Img src={houseInfo.picture_urls[0]}></Card.Img>
              <Card.Body>
                <Card.Text>Location: {(houseInfo.apt_number + " - " + houseInfo.address + " , " + houseInfo.city + " , " +
                  houseInfo.prov).length > 28 ? (houseInfo.apt_number + " - " + houseInfo.address + " , " + houseInfo.city + " , " +
                    houseInfo.prov).slice(0, 27) + "...." : (houseInfo.apt_number + " - " + houseInfo.address + " , " + houseInfo.city +
                      " , " + houseInfo.prov)}</Card.Text>
                <Card.Text>Category: {houseInfo.housetype} <img src="home.png"></img></Card.Text>
                <span className="house-accessory"><img src="bathtub.png"></img>{` : ${houseInfo.bathroom_num} `}</span>
                <span><img src="kitchen.png"></img>{` : ${houseInfo.kitchen_number} `}</span>
                <br></br>
                <br></br>
                <span className="house-accessory"><img src="bed.png"></img>{` : ${houseInfo.bed_number}`}</span>
                <span><img src="toilet.png"></img>{` : ${houseInfo.toilet_number} `}</span>
                <br></br>
                <Button className="houseInfo-Button" variant="danger" onClick={this.end_rent(houseInfo._id)}>End rent</Button>
              </Card.Body>
            </Card>
          </Col>
        ))
      }

      let past_rented
      if (this.state.past_rented.length === 0) {
        past_rented =
          <Col md="3" className="request_col">
            <Card className="request_card">
              <Card.Body>
                <Card.Text>Nothing in renting history</Card.Text>
                <Card.Text>Go find a rent!</Card.Text>
              </Card.Body>
            </Card>
          </Col>
      } else {
        past_rented = this.state.past_rented.map((houseInfo, index) => (
          <Col md="3" key={index} className="request_col">
            <Card className="request_card">
              <Card.Img src={houseInfo.picture_urls[0]}></Card.Img>
              <Card.Body>
                <Card.Text>Location: {(houseInfo.apt_number + " - " + houseInfo.address + " , " + houseInfo.city + " , " +
                  houseInfo.prov).length > 28 ? (houseInfo.apt_number + " - " + houseInfo.address + " , " + houseInfo.city + " , " +
                    houseInfo.prov).slice(0, 27) + "...." : (houseInfo.apt_number + " - " + houseInfo.address + " , " + houseInfo.city +
                      " , " + houseInfo.prov)}</Card.Text>
                <Card.Text>Category: {houseInfo.housetype} <img src="home.png"></img></Card.Text>
                <span className="house-accessory"><img src="bathtub.png"></img>{` : ${houseInfo.bathroom_num} `}</span>
                <span><img src="kitchen.png"></img>{` : ${houseInfo.kitchen_number} `}</span>
                <br></br>
                <br></br>
                <span className="house-accessory"><img src="bed.png"></img>{` : ${houseInfo.bed_number}`}</span>
                <span><img src="toilet.png"></img>{` : ${houseInfo.toilet_number} `}</span>
                <br></br>
                <Link to={`/writeReview/${houseInfo._id}`}><Button className="houseInfo-Button" variant="danger">Write Review</Button></Link>
              </Card.Body>
            </Card>
          </Col>
        ))
      }
      let landlord_renting
      if (this.state.landlord_renting.length === 0) {
        landlord_renting =
          <Col md="3" className="request_col">
            <Card className="request_card">
              <Card.Body>
                <Card.Text>Currently you are not renting any properties</Card.Text>
              </Card.Body>
            </Card>
          </Col>
      } else {
        landlord_renting = this.state.landlord_renting.map((houseInfo, index) => (
          <Col md="3" key={index} className="request_col">
            <Card className="request_card">
              <Card.Img src={houseInfo.picture_urls[0]}></Card.Img>
              <Card.Body>
                <Card.Text>Location: {(houseInfo.apt_number + " - " + houseInfo.address + " , " + houseInfo.city + " , " +
                  houseInfo.prov).length > 28 ? (houseInfo.apt_number + " - " + houseInfo.address + " , " + houseInfo.city + " , " +
                    houseInfo.prov).slice(0, 27) + "...." : (houseInfo.apt_number + " - " + houseInfo.address + " , " + houseInfo.city +
                      " , " + houseInfo.prov)}</Card.Text>
                <Card.Text>Category: {houseInfo.housetype} <img src="home.png"></img></Card.Text>
                <span className="house-accessory"><img src="bathtub.png"></img>{` : ${houseInfo.bathroom_num} `}</span>
                <span><img src="kitchen.png"></img>{` : ${houseInfo.kitchen_number} `}</span>
                <br></br>
                <br></br>
                <span className="house-accessory"><img src="bed.png"></img>{` : ${houseInfo.bed_number}`}</span>
                <span><img src="toilet.png"></img>{` : ${houseInfo.toilet_number} `}</span>
                <br></br>
                <br></br>
                <Link to={`/landlord/${houseInfo._id}`}><Button className="houseInfo-Button" variant="danger">Update house info</Button></Link>
              </Card.Body>
            </Card>
          </Col>
        ))
      }
      let landlord_past
      if (this.state.landlord_past.length === 0) {
        landlord_past =
          <Col md="3" className="request_col">
            <Card className="request_card">
              <Card.Body>
                <Card.Text>No one has rented your properties yet</Card.Text>
              </Card.Body>
            </Card>
          </Col>
      } else {
        landlord_past = this.state.landlord_past.map((houseInfo, index) => (
          <Col md="3" key={index} className="request_col">
            <Card className="request_card">
              <Card.Img src={houseInfo.picture_urls[0]}></Card.Img>
              <Card.Body>
                <Card.Text>Location: {(houseInfo.apt_number + " - " + houseInfo.address + " , " + houseInfo.city + " , " +
                  houseInfo.prov).length > 28 ? (houseInfo.apt_number + " - " + houseInfo.address + " , " + houseInfo.city + " , " +
                    houseInfo.prov).slice(0, 27) + "...." : (houseInfo.apt_number + " - " + houseInfo.address + " , " + houseInfo.city +
                      " , " + houseInfo.prov)}</Card.Text>
                <Card.Text>Category: {houseInfo.housetype} <img src="home.png"></img></Card.Text>
                <span className="house-accessory"><img src="bathtub.png"></img>{` : ${houseInfo.bathroom_num} `}</span>
                <span><img src="kitchen.png"></img>{` : ${houseInfo.kitchen_number} `}</span>
                <br></br>
                <br></br>
                <span className="house-accessory"><img src="bed.png"></img>{` : ${houseInfo.bed_number}`}</span>
                <span><img src="toilet.png"></img>{` : ${houseInfo.toilet_number} `}</span>
              </Card.Body>
            </Card>
          </Col>
        ))
      }
      return (
        <div id="all-wrap">

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
                    <Link to={"/mainpage"}>
                      <a className="navbar-brand active-class" href="/">
                        <img src="sublease.png" width="40" height="40" alt=""></img>
                        {' Tenant '}
                      </a>
                    </Link>
                    <Link to={'/landlord'}>
                      <a className="navbar-brand" href="#">
                        <img src="landlord.png" width="40" height="40" alt=""></img>
                        {' Landlord '}
                      </a>
                    </Link>
                    <Link to={'/roommate'}>
                      <a className="navbar-brand" href="#">
                        <img src="friendship.png" width="40" height="40" alt=""></img>
                        {' Roommate '}
                      </a>
                    </Link>
                    <Link to={'/'}>
                      <a className="navbar-brand" href="#">
                        <img src="logout.png" width="40" height="40" alt=""></img>
                        {' Sign Out '}
                      </a>
                    </Link>
                    <a id="current-user" className="navbar-brand" href="#">
                      <span id="user-name">{this.props.cookies.cookies.cur_user.username}</span>
                    </a>
                    <a className="navbar-brand" href="#">
                      <img id="nav-pic" src={this.props.cookies.cookies.cur_user.picture_url} width="40" height="40" alt=""></img>
                    </a>
                  </ul>
                </div>
              </nav>
            </div>
            <div className="container d-flex justify-content-center">
              <h1>Welcome, {this.props.cookies.cookies.cur_user.username}</h1>
            </div>
            <div className="profile">
              <div className="Profile-Picture">
                <Image src={this.state.profile_img} className="ProfilePic" height={200} width={200} alt="Profile Picture"></Image>
                <input
                  style={{ display: 'none' }}
                  type='file'
                  onChange={(e) => {
                    this.state.render_img(e.target.files[0])
                    axios.post("/Image/SaveImage", this.state.img_obj)
                      .then(res => {
                        console.log(res.data)
                        const picture_urls = res.data[0]
                        this.setState({
                          profile_img: picture_urls[0]
                        })
                        axios.put("/user/updatePorfile", {
                          id: this.props.cookies.cookies.cur_user._id,
                          url: picture_urls[0]
                        })
                          .then(data => {
                            console.log(data.data)
                            this.props.cookies.setCookie("cur_user", data.data, {
                              path: "/",
                              expires: 0
                            })
                            console.log(this.props.cookies.cookies.cur_user)
                          })
                          .catch(err => console.log(err))
                      })
                    e.target.value = ""
                  }}
                  ref={fileInput => this.fileInput = fileInput} />
                <Button
                  id="change-picture"
                  variant="outline-primary"
                  className="changePicButton"
                  onClick={() => this.fileInput.click()}
                >Change Picture</Button>
              </div>
              <div className="Profile-Info">
                <ul className="info">
                  <li><span className="userInfo">Username: {this.props.cookies.cookies.cur_user.username}</span></li>
                  <li><span className="userInfo">Password: *****</span></li>
                </ul>

                <div className="EditButton">
                  <Link to={'./editInfoPage'}>
                    <Button
                      variant="outline-danger"
                    >Change Password</Button>
                  </Link>
                </div>
              </div>
            </div>

            <div>
              <h1 className="heading">
                Tenants:
              </h1>
              <h1 className="headings_2">
                Currently renting:
              </h1>
            </div>
            <div>
              <Row>
                {current_renting}
              </Row>
            </div>
            <div>
              <h1 className="headings_3">
                History of rented houses:
              </h1>
            </div>
            <div>
              <Row>
                {past_rented}
              </Row>
            </div>
            <div>
              <h1 className="heading">
                Landlords:
              </h1>
              <h1 className="headings_4">
                Houses renting:
              </h1>
            </div>
            <div>
              <Row>
                {landlord_renting}
              </Row>
            </div>
            <div>
              <h1 className="headings_5">
                Renting history:
          </h1>
            </div>
            <div>
              <Row>
                {landlord_past}
              </Row>
            </div>
          </div>
        </div>
      )
    }
  }
}

export default withRouter(User);
