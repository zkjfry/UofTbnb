import React from 'react';
import './EditRoommateInfo.css';
import 'bootstrap/dist/css/bootstrap.css';
import Images from "./Images"
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card'
import Collapse from 'react-bootstrap/Collapse'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import VerticalModal from './VerticalModal'
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'
import DatePicker from 'react-datepicker';
import axios from 'axios';

const cityoptions = [
{ value: 'Downtown Toronto', label: 'Downtown Toronto' },
{ value: 'Mississagua', label: 'Mississagua' },
{ value: 'North York', label: 'North York' },
{ value: 'Scarbourough', label: 'Scarbourough' },
{ value: 'Brampton', label: 'Brampton' },
{ value: 'Vaughan', label: 'Vaughan' },
{ value: 'Richmond Hill', label: 'Richmond Hill' },
{ value: 'Markham', label: 'Markham' },
]

class EditRoommateInfo extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            step: 0,
            step_content: ["Personal Info", "Life style", "Duration of stay", "Finishing Off"],
            open_house: false,
            open_hotel: false,
            img_src: [],
            img_obj: new FormData(),
            name: '',
            age: '',
            location: 'Select Your Location',
            gender: '',
            wakeup_time: '',
            sleep_time: '',
            description: "",
            pets_friently: false,
            smoking: false,
            cooking_level: 0,
            socialization_level: 0,
            friendly_level: 0,
            cleanliness: 0,
            noisy_extent: 0,
            start_date_holder: new Date(),
            end_date_holder: new Date(),
            start_date: [],
            end_date: [],
            picture_urls: [],
            picture_ids: [],
            current_user: this.props.cookies.cookies.cur_user,
            getStepContent: (step) => {
                switch (step) {
                    case 0:
                        return (
                            <Form className="info_form">
                                <Form.Group>
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control type="text" placeholder="Enter your name" onChange={(e) => { this.setState({ name: String(e.target.value) }) }}></Form.Control>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Age</Form.Label>
                                    <Form.Control type="number" placeholder="Enter your age" onChange={(e) => { this.setState({ age: Number(e.target.value) }) }}></Form.Control>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Location</Form.Label>
                                    <Dropdown options={cityoptions} onChange={this._onSelect} onChange={(e)=>{this.setState({location: e.value})}} value={this.state.location}/>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Gender</Form.Label>
                                    <Form.Control type="text" placeholder="Enter your gender" onChange={(e) => { this.setState({ gender: String(e.target.value) }) }}></Form.Control>
                                </Form.Group>
                                <Button className="Right-align" onClick={() => {
                                    if (step != 3) {
                                        this.setState({ step: this.state.step + 1 })
                                    }
                                }
                                } variant="outline-dark">Next</Button>

                            </Form>)
                    case 1:
                        return (
                            <Form className="info_form">
                                <Form.Group>
                                    <Form.Label>Wake Up time</Form.Label>
                                    <Form.Control type="time" placeholder="When would you usually wake up?" onChange={(e) => { this.setState({ wakeup_time: String(e.target.value) }) }}></Form.Control>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Sleep time</Form.Label>
                                    <Form.Control type="time" placeholder="When would you usually sleep?" onChange={(e) => { this.setState({ sleep_time: String(e.target.value) }) }}></Form.Control>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Pet?</Form.Label>
                                    <Row className="row" md="auto">
                                        <Col md="auto">
                                            <Button onClick={() => { this.setState({ pets_friently: true }) }} variant='outline-dark'>I'm okay with it</Button>
                                        </Col>
                                        <Col md="auto">
                                            <Button onClick={() => { this.setState({ pets_friently: false }) }} variant='outline-dark'>No</Button>
                                        </Col>
                                    </Row>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Smoke?</Form.Label>
                                    <Row className="row" md="auto">
                                        <Col md="auto">
                                            <Button onClick={() => { this.setState({ smoking: true }) }} variant='outline-dark'>I'm okay with it</Button>
                                        </Col>
                                        <Col md="auto">
                                            <Button onClick={() => { this.setState({ smoking: false }) }} variant='outline-dark'>No</Button>
                                        </Col>
                                    </Row>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Cooking level</Form.Label>
                                    <Form.Control type="number" placeholder="Out of 5 how good do you think you are at cooking?" onChange={(e) => { this.setState({ cooking_level: Number(e.target.value) }) }}></Form.Control>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Socializing level</Form.Label>
                                    <Form.Control type="number" placeholder="Out of 5 how often do you hangout with friends?" onChange={(e) => { this.setState({ socialization_level: Number(e.target.value) }) }}></Form.Control>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Friendly level</Form.Label>
                                    <Form.Control type="number" placeholder="Out of 5 how friendly do you think you are?" onChange={(e) => { this.setState({ friendly_level: Number(e.target.value) }) }}></Form.Control>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Noisy level</Form.Label>
                                    <Form.Control type="number" placeholder="Out of 5 how noisy do you think you are?" onChange={(e) => { this.setState({ noisy_extent: Number(e.target.value) }) }}></Form.Control>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Cleanliness level</Form.Label>
                                    <Form.Control type="number" placeholder="Out of 5 how clean do you think you are?" onChange={(e) => { this.setState({ cleanliness: Number(e.target.value) }) }}></Form.Control>
                                </Form.Group>
                                <Row className="row" md="auto">
                                    <Col md="auto">
                                        <Button onClick={() => {
                                            if (step != 0) {
                                                this.setState({ step: this.state.step - 1 })
                                            }
                                        }
                                        } variant="outline-dark">Prev</Button>
                                    </Col>
                                    <Col>
                                        <Button className="Right-align" onClick={() => {
                                            if (step != 3) {
                                                this.setState({ step: this.state.step + 1 })
                                            }
                                        }
                                        } variant="outline-dark">Next</Button>
                                    </Col>
                                </Row>

                            </Form>
                        )
                    case 2:
                        return (
                            <Form className="info_form">
                                <Form.Group>
                                    <h3>Duration of stay</h3>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Expected starting date</Form.Label>
                                    <DatePicker selected={this.state.start_date_holder} onChange={this.onChangeStartDate}></DatePicker>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Expected ending date</Form.Label>
                                    <DatePicker selected={this.state.end_date_holder} onChange={this.onChangeEndDate}></DatePicker>
                                </Form.Group>
                                <Button onClick={() => {
                                    if (step != 0) {
                                        this.setState({ step: this.state.step - 1 })
                                    }
                                }
                                } variant="outline-dark">Prev</Button>
                                <Button className="Right-align" onClick={() => {
                                    if (step != 3) {
                                        this.setState({ step: this.state.step + 1 })
                                    }
                                }
                                } variant="outline-dark">Next</Button>
                            </Form>
                        )
                    case 3:
                        return (
                            <Form className="info_form">
                                <Form.Row>
                                    <Form.Label><h5>Add some description?</h5></Form.Label>
                                    <Form.Control onChange={(e)=>{this.setState({
                                        description: e.target.value
                                    })}}as="textarea" rows="auto" placeholder="Description"></Form.Control>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Group as={Col} md="auto">
                                        <Form.Label ><h5>Upload some images?</h5></Form.Label><br></br>
                                        <input type="file" onChange={(e) => {
                                            console.log(e.target.files)
                                            this.state.render_img(e.target.files[0])
                                            e.target.value = ""
                                        }}></input><br></br>
                                    </Form.Group>
                                </Form.Row>
                                <Images images={this.state.img_src}
                                    removeImage={(image, i) => {
                                        for (let element of this.state.img_obj.keys()) {
                                            if (Number(element) === i) {
                                                this.state.img_obj.delete(i)
                                                console.log("deleted")
                                            }
                                        };
                                        this.setState({
                                            img_src: this.state.img_src.filter(function (i) {
                                                return i != image
                                            })
                                        })
                                    }}></Images>
                                <Form.Row>
                                    <Form.Group as={Col} md="12">
                                        <Button onClick={() => {
                                            if (step != 0) {
                                                this.setState({ step: this.state.step - 1 })
                                            }
                                        }
                                        } variant="outline-dark">Prev</Button>
                                        <Button className="Right-align" onClick={() => {
                                            this.state.upload_information()
                                            this.setState({
                                                modalShow: true
                                            })
                                        }
                                        } variant="outline-dark">Submit</Button>
                                    </Form.Group>
                                </Form.Row>
                            </Form>
                        )
                }

            },
            upload_information: ()=>{
                axios.post("/Image/SaveImage", this.state.img_obj).then((res) => {
                    const picture_urls = res.data[0]
                    const picture_ids = res.data[1]
                    const new_roommate = {
                        roommate_id: this.state.current_user._id,
                        roommate_name: this.state.name,
                        gender: this.state.gender,
                        age: this.state.age,
                        location: this.state.location,
                        pets_friendly: this.state.pets_friently,
                        smoking: this.state.smoking, 
                        wakeup_time: this.state.wakeup_time,
                        sleep_time: this.state.sleep_time,
                        cooking_level: this.state.cooking_level,
                        socialization_level: this.state.socialization_level,
                        friendly_level: this.state.friendly_level,
                        cleanliness: this.state.cleanliness,
                        noisy_extent: this.state.noisy_extent,
                        start_date: this.state.start_date,
                        end_date: this.state.end_date,
                        picture_urls: picture_urls,
                        picture_ids: picture_ids,
                        description: this.state.description
                    }
                    axios.post("/roommate/createRoommate", new_roommate)
                    .then(result => console.log(result))
                    .catch(error => console.log(error))
                })
            },
            render_img: (file) => {
                var fr = new FileReader();
                fr.onload = this.state.onFileReaderLoad;
                fr.readAsDataURL(file)
                let tmp = this.state.img_obj
                tmp.append(this.state.img_src.length, file)
                this.setState({
                    img_obj: tmp
                })
            },
            onFileReaderLoad: (e) => {
                if (!this.state.img_src.includes(e.target.result)) {
                    this.setState({
                        img_src: [...this.state.img_src, e.target.result]
                    })
                }

            },
            modalShow: false
        }
    }
    handleChange = date => {
        let tmp = date.toLocaleDateString("en-US")
        tmp = tmp.split("/")
        const year = Number(tmp[2]);
        const month = tmp[0];
        const day = Number(tmp[1]);
        return [year, month, day]
    };
    onChangeStartDate = (date) => {
        this.setState({
            start_date_holder: date
        })
        const new_date = this.handleChange(date)
        console.log(new_date)
        this.setState({
            start_date: new_date
        })
    }
    onChangeEndDate = (date) => {
        this.setState({
            end_date_holder: date
        })
        const new_date = this.handleChange(date)
        this.setState({
            end_date: new_date
        })
    }
    render() {
        return (
            <div className="whole">
                <Stepper className="progress_bar" orientation="vertical" activeStep={this.state.step}>
                    {this.state.step_content.map((label, index) => (
                        <Step key={label}>
                            <StepLabel><h1>{label}</h1></StepLabel>
                            <StepContent>
                                {this.state.getStepContent(index)}
                            </StepContent>
                        </Step>
                    ))}

                </Stepper>
                <VerticalModal
                    show={this.state.modalShow}
                    onHide={() => this.setState({
                        modalShow: false
                    })}>
                </VerticalModal>

                <Link to={'/roommate'}><Button className="backButton" variant="outline-dark">Back to roommate page</Button></Link>



            </div>
        )
    }
}

export default EditRoommateInfo;