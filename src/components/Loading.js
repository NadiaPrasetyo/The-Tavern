import React from 'react';
import '../App.css';

import { GiCrown } from "react-icons/gi";
import { GiQuillInk } from "react-icons/gi";
import { GiTwoHandedSword } from "react-icons/gi";

function Loading() {
    return (
        <div className='loading-container'>
            <div className='loading-ball'>
                <GiCrown className='icon crown'/>
            </div>
            <div className='loading-ball'>
                <GiQuillInk className='icon quill'/>
            </div>
            <div className='loading-ball'>
                <GiTwoHandedSword className='icon sword'/>
            </div>
        </div>
    );
}

export default Loading;
