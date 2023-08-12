import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import TestScreen from "../../component/Video/TestScreen";
import Timer from "../../component/Video/Timer";
import ResetButton from "./../../component/Gesture/ResetButton";
import GoBackMain from "./../../component/Gesture/GoBackMain";
import TestExplain from "./../../component/Gesture/TestExplain";
import { IoIosHand } from "react-icons/io";
import { AiFillCheckCircle } from "react-icons/ai";

import '../../style/testVideo.css'

function GestureTest() {
    const [ handState, handSetter ] = useState(false); // 안쓰니까 없앨까
    const [ checkState, checkSetter ] = useState(false);
    
    // const timerRdx = useSelector((state) => state.gestureTest.timer);
    const handRdx = useSelector((state) => state.gestureTest.hand);
    const checkRdx = useSelector((state) => state.gestureTest.check);

    return (
        <>
        <div className='test-content-video'>
            <TestScreen/>
            <div className="right-column">
                <div className="timer-reset-container">
                    <Timer role={"COOKIEE"} isGestureTest={true}/> {/**Timer와 ResetButton 한 행 */}
                    <ResetButton/>
                    <TestExplain/>
                </div>
                {handRdx ? (<IoIosHand className='test-handsup-icon-active'/>) : (<IoIosHand className='test-handsup-icon'/>)}
                {checkRdx ? (<AiFillCheckCircle className='test-check-icon-active'/>) : (<AiFillCheckCircle className='test-check-icon'/>)}
                <GoBackMain/> {/**얘만 한 행 */}
            </div>
        </div>
        </>
    );
}

export default GestureTest;