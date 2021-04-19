import React from 'react';
import './Landlord.css';
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
import DatePicker from 'react-datepicker';
import {withRouter} from 'react-router-dom';
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'
import "react-datepicker/dist/react-datepicker.css";
const axios = require('axios').default;
const header = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  };

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

class Landlord extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            step: 0,
            step_content: ["Select Your House Type", "House Information", "Location Information", "Finishing Off"],
            open_house: false,
            img_src: [],
            house_type: "",
            space_type: "",
            bathroom_num: 0,
            toilet_num: 0,
            kitchen_num: 0,
            bed_num: 0,
            amenities: [],
            address: "",
            apt_number: "",
            city: "Select Your City",
            prov: "",
            country: "",
            zip_code: "",
            price: 0,
            description: "",
            picture_urls: [],
            start_date_holder: new Date(),
            end_date_holder: new Date(),
            start_date: [],
            end_date: [],
            img_obj: new FormData(),
            current_user: this.props.cookies.cookies.cur_user,
            getStepContent: (step)=>{
                switch(step){
                    case 0:
                        return (
                        <Form className="house_form">
                        <Form.Group id="house_type">
                            <Row className="row" md="auto">
                                <Col md="auto">
                                    <Button onClick={()=>{this.setState({
                                        open_house:!this.state.open_house,
                                        house_type: "Apartment"
                                        })}} className="houseTypeButton" variant="outline-dark">Apartment</Button>
                                </Col>
                                <Col md="auto">
                                    <Button onClick={()=>{this.setState({
                                        open_house:!this.state.open_house,
                                        house_type: "House"
                                        })}} className="houseTypeButton" variant="outline-dark">House</Button>
                                </Col>
                                <Col md = "auto">
                                    <Button onClick={()=>{this.setState({
                                        open_house:!this.state.open_house,
                                        house_type: "Condo"
                                        })}} className="houseTypeButton" variant="outline-dark">Condo</Button>
                                </Col>
                                <Col md = "auto">
                                    <Button  onClick={()=>{this.setState({
                                        open_house:!this.state.open_house,
                                        house_type: "Basement"
                                        })}} className="houseTypeButton" variant="outline-dark">Basement</Button>
                                </Col>
                            </Row>
                        </Form.Group>
                        <Row className="row" md="auto">
                            <Col md="auto">
                                <Collapse in={this.state.open_house}>
                                    <Form.Group>
                                        <h3>What will the guests have?</h3>
                                            <input onClick={()=> this.setState({space_type: "The entire place"})} type="radio" name="Usage" value="entire"></input><span className="inline-block"><h5>  The entire place</h5></span><br></br>
                                            <input onClick={()=> this.setState({space_type: "Private room"})} type="radio" name="Usage" value="private"></input><span className="inline-block"><h5>  Private room(s)</h5></span><br></br>
                                            <input onClick={()=> this.setState({space_type: "Shared place"})}type="radio" name="Usage" value="shared"></input><span className="inline-block"><h5>  Shared place</h5></span><br></br>
                                            <Button onClick={()=>{if(step != 0){
                                                this.setState({step: this.state.step - 1})}}
                                                }>Prev</Button>
                                            <Button className="Right-align" onClick={()=>{if(step != 3){
                                                this.setState({step: this.state.step + 1})}}
                                                }>Next</Button>
                                    </Form.Group>
                                </Collapse>
                            </Col>
                        </Row>
                    </Form>)
                case 1:
                    return(
                        <Form className="house_form">
                        <Form.Row>
                            <Form.Group as={Col} md="auto">
                                <Form.Label><h5>How many bath rooms?</h5></Form.Label>
                                <Form.Control onChange={(e) => {this.setState({bathroom_num: Number(e.target.value)})}}></Form.Control>
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col} md="auto">
                                <Form.Label><h5>How many toilets?</h5></Form.Label>
                                <Form.Control onChange={(e) => {this.setState({toilet_num: Number(e.target.value)})}}></Form.Control>
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col} md="auto">
                                <Form.Label><h5>How many kitchens?</h5></Form.Label>
                                <Form.Control onChange={(e) => {this.setState({kitchen_num: Number(e.target.value)})}}></Form.Control>
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col} md="auto">
                                <Form.Label><h5>How many beds?</h5></Form.Label>
                                <Form.Control onChange={(e) => {this.setState({bed_num: Number(e.target.value)})}}></Form.Control>
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col} md="auto"></Form.Group>
                                <Form.Label><h5>The amenities you offer:</h5></Form.Label>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col} md="auto">
                                <Form.Check onChange={(e)=>{
                                    if(e.target.checked){
                                        if(!this.state.amenities.includes("Free Parking")){
                                            this.setState({
                                                amenities: [...this.state.amenities, "Free Parking"]
                                            })
                                        }
                                    }
                                    if(!e.target.checked){
                                        if(this.state.amenities.includes("Free Parking")){
                                            this.setState({
                                                amenities: this.state.amenities.filter((value) => {
                                                   return value != "Free Parking"
                                                })
                                            })
                                        }
                                    }
                                }} type="checkbox" label="Free Parking"></Form.Check>
                            </Form.Group>
                            
                            
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col} md="auto">
                                <Form.Check onChange={(e)=>{
                                    if(e.target.checked){
                                        if(!this.state.amenities.includes("Air Condition/Heating")){
                                            this.setState({
                                                amenities: [...this.state.amenities, "Air Condition/Heating"]
                                            })
                                        }
                                    }
                                    if(!e.target.checked){
                                        if(this.state.amenities.includes("Air Condition/Heating")){
                                            this.setState({
                                                amenities: this.state.amenities.filter((value) => {
                                                   return value != "Air Condition/Heating"
                                                })
                                            })
                                        }
                                    }
                                }} type="checkbox" label="Air Condition/Heating"></Form.Check>
                            </Form.Group>
                            
                            
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col} md="auto">
                                <Form.Check onChange={(e)=>{
                                    if(e.target.checked){
                                        if(!this.state.amenities.includes("TV")){
                                            this.setState({
                                                amenities: [...this.state.amenities, "TV"]
                                            })
                                        }
                                    }
                                    if(!e.target.checked){
                                        if(this.state.amenities.includes("TV")){
                                            this.setState({
                                                amenities: this.state.amenities.filter((value) => {
                                                    return value != "TV"
                                                })
                                            })
                                        }
                                    }
                                }} type="checkbox" label="TV"></Form.Check>
                            </Form.Group>
                            
                            
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col} md="auto">
                                <Form.Check onChange={(e)=>{
                                    if(e.target.checked){
                                        if(!this.state.amenities.includes("WIFI")){
                                            this.setState({
                                                amenities: [...this.state.amenities, "WIFI"]
                                            })
                                        }
                                    }
                                    if(!e.target.checked){
                                        if(this.state.amenities.includes("WIFI")){
                                            this.setState({
                                                amenities: this.state.amenities.filter((value) => {
                                                   return value != "WIFI"
                                                })
                                            })
                                        }
                                    }
                                }} type="checkbox" label="WIFI"></Form.Check>
                            </Form.Group>
                            
                            
                        </Form.Row>
                        
                        <Form.Row>
                                <Form.Group as={Col} md="3">
                                    <Button onClick={()=>{if(step != 0){
                                            this.setState({step: this.state.step - 1})}}
                                            
                                        }>Prev</Button>
                                </Form.Group>
                                <Form.Group as={Col} md="1">
                                    <Button className="Right-align" onClick={()=>{if(step != 3){
                                            this.setState({step: this.state.step + 1})}}
                                        }>Next</Button>
                                </Form.Group>
    
    
                        </Form.Row>
                    </Form>
                    )
                case 2:
                    return(
                        <Form className="house_form">
                            <Form.Row>
                                <Form.Group as={Col} md="7">
                                    <Form.Label><h5>Address</h5></Form.Label>
                                    <Form.Control onChange={(e)=>{this.setState({address: e.target.value})}} placeholder="123 Main Street"></Form.Control>
                                </Form.Group>
                                <Form.Group as={Col} md="2">
                                    <Form.Label><h5>Apt/Suit</h5></Form.Label>
                                    <Form.Control onChange={(e)=>{this.setState({apt_number: e.target.value})}} placeholder="1705"></Form.Control>
                                </Form.Group>
                            </Form.Row>
                            <Form.Row>
                                <Form.Group as={Col} md="5">
                                <Form.Label><h5>City</h5></Form.Label>
                                <Dropdown options={cityoptions} onChange={this._onSelect} onChange={(e)=>{this.setState({city: e.value})}} value={this.state.city}/>
                                </Form.Group>
                                <Form.Group as={Col} md="1">
                                    <Form.Label><h5>Prov</h5></Form.Label>
                                    <Form.Control onChange={(e)=>{this.setState({prov: e.target.value})}} placeholder="ON"></Form.Control>
                                </Form.Group>
                                <Form.Group as={Col} md="2">
                                    <Form.Label><h5>Country</h5></Form.Label>
                                    <Form.Control onChange={(e)=>{this.setState({country: e.target.value})}} placeholder="Canada"></Form.Control>
                                </Form.Group>
                                
                                <Form.Group as={Col} md="3">
                                    <Form.Label><h5>ZIP Code</h5></Form.Label>
                                    <Form.Control onChange={(e)=>{this.setState({zip_code: e.target.value})}} placeholder="M5S 1W4"></Form.Control>
                                </Form.Group>
                            </Form.Row>
                            <Form.Row>
    
                            </Form.Row>
                            <Form.Row>
                                <Form.Group as={Col} md="6">
                                    <Button onClick={()=>{if(step != 0){
                                            this.setState({step: this.state.step - 1})}}
                                        }>Prev</Button>
                                </Form.Group>
                                <Form.Group as={Col} md="3">
                                    <Button className="Right-align" onClick={()=>{if(step != 3){
                                            this.setState({step: this.state.step + 1})}}
                                        }>Next</Button>
                                </Form.Group>
                            </Form.Row>
                        </Form>
                    )
                case 3:
                    return(
                        <Form className="house_form">
                            <Form.Row>
                                <Form.Group as={Col} md="auto">
                                    <Form.Label><h5>Price?</h5></Form.Label>
                                    <Form.Control onChange={(e)=>{this.setState({price: Number(e.target.value)})}} placeholder="$1000"></Form.Control>
                                </Form.Group>
    
                            </Form.Row>
                            <Form.Row>
                                <Form.Group as={Col} md="auto">
                                    <Form.Label><h5>Start date</h5></Form.Label><br></br>
                                    <DatePicker selected={this.state.start_date_holder} onChange={this.onChangeStartDate}></DatePicker>
                                </Form.Group>
                                <Form.Group as={Col} md="auto">
                                    <Form.Label><h5>End date</h5></Form.Label><br></br>
                                    <DatePicker selected={this.state.end_date_holder} onChange={this.onChangeEndDate}></DatePicker>
                                </Form.Group>
                            </Form.Row>
                            <Form.Row>
                                    <Form.Label><h5>Add some description?</h5></Form.Label>
                                    <Form.Control onChange={(e)=>{this.setState({description: e.target.value})}} as="textarea" rows="auto" placeholder="Description"></Form.Control>
                            </Form.Row>
                            <Form.Row>
                                <Form.Group as={Col} md="auto">
                                    <Form.Label ><h5>Upload some images?</h5></Form.Label><br></br>
                                    <input type="file" onChange={(e)=>{
                                    this.state.render_img(e.target.files[0])
                                    e.target.value=""
                                }}></input><br></br>
                                </Form.Group>
                            </Form.Row>
                            <Images images={this.state.img_src} 
                            removeImage={(image, i)=>{
                                for(let element of this.state.img_obj.keys()){
                                    if(Number(element) === i){
                                        this.state.img_obj.delete(i)
                                        console.log("deleted")
                                    }
                                };
                                this.setState({
                                    img_src: this.state.img_src.filter(function(i){
                                        return i != image
                                    })
                                })
                            }}></Images>
                            <Form.Row>
                                <Form.Group as={Col} md="12">
                                    <Button className="Right-align" onClick={()=>{
                                        console.log(this.state.current_user)
                                        this.state.upload_information()
                                        this.setState({
                                            modalShow: true
                                        })
                                    }
                                        }>Submit</Button>
                                </Form.Group>
                            </Form.Row>
                        </Form>
                    )
                }
                
            },
            upload_information: () =>{
                axios.post("/Image/SaveImage", this.state.img_obj)
                  .then(res => {
                      console.log(res)
                      const picture_urls = res.data[0]
                      const picture_ids = res.data[1]
                      console.log(this.state.start_date)
                      const new_house = {
                        owner: this.state.current_user._id,
                        owner_name: this.state.current_user.username,
                        housetype: this.state.house_type,
                        spacetype: this.state.space_type,
                        bathroom_num: this.state.bathroom_num,
                        toilet_number: this.state.toilet_num,
                        kitchen_number: this.state.kitchen_num,
                        bed_number: this.state.bed_number,
                        amenities: this.state.amenities,
                        address: this.state.address,
                        apt_number: this.state.apt_number,
                        city: this.state.city,
                        prov: this.state.prov,
                        country: this.state.country,
                        zip_code: this.state.zip_code,
                        price: this.state.price,
                        description: this.state.description,
                        picture_urls: picture_urls,
                        picture_ids: picture_ids,
                        start_date: this.state.start_date,
                        end_date: this.state.end_date
                      }
                      console.log(new_house)
                      if(this.props.match.params.id === undefined){
                        axios.post("/House/CreateHouse", new_house)
                            .then(result => console.log(result))
                            .catch(error => console.log(error))
                      }
                      else{
                          axios.put("/House/UpdateHouse", {house: new_house, id: this.props.match.params.id})
                            .then(result => console.log(result))
                            .catch(err => console.log(err))
                      }
                      
                  })
                  .catch(error => console.log(error))
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
                if(!this.state.img_src.includes(e.target.result)){
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
    // handleDropdown = (e) => {
    //     this.setState({city: e.value})
    //     console.log(this.state.city)
    // }
    render(){
        return (
        <div>
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
            onHide={()=>this.setState({
                modalShow: false
            })}>
        </VerticalModal>
        
        <Link to={'./mainpage'}><Button className="backButton">Back to mainpage</Button></Link>

            

        </div>    
    )
        }
}

export default withRouter(Landlord);