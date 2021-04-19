import React from 'react'
import './Images.css'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Image from 'react-bootstrap/Image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'

class Images extends React.Component{
    
    render(){
        return(
            this.props.images.map((image, i) => (
                    <Form.Row key={i} className='fadein'>
                        <Form.Group as={Col} md="8">
                            <div 
                            onClick={() => this.props.removeImage(image, i)} 
                            className='delete'>
                                <FontAwesomeIcon icon={faTimesCircle} size='2x' />
                            </div>
                            <Image src={image} alt='' fluid/>
                        </Form.Group>
                    </Form.Row>
            ))
        )
    }
}
export default Images