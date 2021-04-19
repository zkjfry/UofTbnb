import React from 'react';
import PropTypes from 'prop-types';

const House_pic = ({pic_info}) => {
    return (
        <img className = "card" src={pic_info.current_picutre.url} alt = {"singer"}/>
    )
}

export default House_pic;