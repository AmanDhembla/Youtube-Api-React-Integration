import React from 'react';
import moment from 'moment';
import './DataItem.css';

const DataItem= (props)=>(
                <div className="dataItem">    
                    <h3>{props.title}</h3>
                    <p>{props.description}</p>
                    <p>{moment(props.publishedAt).format('MMMM Do, YYYY')}</p>
                </div>        
);  

export default DataItem;