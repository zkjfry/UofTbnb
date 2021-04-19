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
import StarRatings from 'react-star-ratings'
import {withRouter} from 'react-router-dom';
const axios = require('axios').default;

class WriteReview extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            step: 0,
            current_user: this.props.cookies.cookies.cur_user,
            step_content: ["Rate Your Experience", "Add Some Description"],
            rating: 0,
            description: "",
            getStepContent: (step)=>{
                switch(step){
                case 0:
                    return(
                        <Form className="house_form">
                        <Form.Row>
                            <Form.Group as={Col} md="auto">
                                <Form.Label>Please rate, from 1 to 5, your experience</Form.Label><br></br>
                                <StarRatings 
                                    rating={this.state.rating}
                                    starRatedColor="gold"
                                    changeRating={(newRating, name)=>{
                                        this.setState({
                                            rating: newRating
                                        })
                                    }}
                                    numberOfStars={5}
                                    name="rating"
                                    starHoverColor="gold"
                                ></StarRatings>
                                
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col} md="6">
                                <Button className="Right-align" onClick={()=>{if(step != 3){
                                        this.setState({step: this.state.step + 1})}}
                                    }>Next</Button>
                            </Form.Group>
                        </Form.Row>
                        </Form>
                    )
                case 1:
                    return(
                        <Form className="house_form">
                            <Form.Row>
                                <Form.Group as={Col} md="auto">
                                    <Form.Label>Descript your experience (both pros and cons)</Form.Label>
                                    <Form.Control as="textarea" rows="auto" placeholder="Description"
                                    onChange={(e) => {this.setState({
                                        description: e.target.value
                                    })}}></Form.Control>
                                </Form.Group>
                            </Form.Row>
                            <Form.Row>
                                <Form.Group as={Col} md="3">
                                    <Button onClick={()=>{if(step != 0){
                                            this.setState({step: this.state.step - 1})}}
                                        }>Prev</Button>
                                </Form.Group>
                                <Form.Group as={Col} md="4">
                                    <Button className="Right-align" onClick={()=>{
                                        this.submit_change()
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
            render_img: (file) => {
                var fr = new FileReader();
                fr.onload = this.state.onFileReaderLoad;
                fr.readAsDataURL(file)
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
    submit_change = () => {
        console.log(this.props)
        axios.post("/Review/CreateReview", {
            house_id: this.props.match.params.houseid,
            user_id: this.state.current_user._id,
            rating: this.state.rating,
            comment: this.state.description
        })
            .then(res => console.log(res))
            .catch(err => console.log(err))
    }
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

export default withRouter(WriteReview);