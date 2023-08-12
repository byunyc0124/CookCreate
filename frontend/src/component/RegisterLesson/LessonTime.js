import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import { useDispatch, useSelector } from 'react-redux';
import 'react-datepicker/dist/react-datepicker.css';
import { setDateTime, setDateValid, setTimeTaken, setTimeTakenVaild } from "../../store/lesson/lesson";

function LessonTime() {
  const dispatch = useDispatch()

  const [selectedDateTime, setSelectedDateTime] = useState("");
  const [lessonTakenTime, setLessonTakenTime] = useState("");
  const reduxTimeTaken = useSelector((state) => state.lesson.timeTaken)

  const dateValid = useSelector((state) => state.lesson.dateValid);
  const timeTakenValid = useSelector((state) => state.lesson.timeTakenValid);
  
  const handleDateTimeChange = (date) => {
    // 변환된 시간을 표준시(UTC)로 변환
    const utcDateTime = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString();
    
    setSelectedDateTime(date);
    dispatch(setDateTime(utcDateTime)); // 변환된 값을 Redux에 저장
    
    const currentDate = new Date();
    const futureTime = new Date(currentDate.getTime() + 12 * 60 * 60 * 1000); // 현재 시간 + 12시간
    
    dispatch(setDateValid(selectedDateTime > futureTime)); // dateValid 업데이트 로직...
  };

  const handleTakenTime = (e) => {
    const selectedValue = e.target.value;
    setLessonTakenTime(selectedValue);
    dispatch(setTimeTaken(selectedValue));
  };
  
  useEffect(() => {
    setLessonTakenTime(reduxTimeTaken);
    dispatch(setTimeTakenVaild(lessonTakenTime !== 0))
  }, [reduxTimeTaken, lessonTakenTime]);
  
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h3>강의 일시</h3>
          <div style={{ marginLeft: '5px' }}>{dateValid ? '✅' : '🔲'}</div>
        </div>
        <DatePicker
          selected={selectedDateTime}
          onChange={handleDateTimeChange}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={30}
          dateFormat="yyyy-MM-dd HH:mm"
          placeholderText='과외 일시'
        />
        {selectedDateTime && dateValid === false && <p style={{ color: 'red' }}>
          현재 시간 기준 12시간 이전 강의는 생성할 수 없습니다!
          <br/>
          올바른 날짜를 선택해주세요.
        </p>}
      </div>
      <div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h3>강의 시간</h3>
          <div style={{ marginLeft: '5px' }}>{timeTakenValid ? '✅' : '🔲'}</div>
        </div>
        <select value={lessonTakenTime} onChange={handleTakenTime}>
          <option value="">-</option>
          <option value="60">60분</option>
          <option value="90">90분</option>
          <option value="120">120분</option>
          <option value="150">150분</option>
          <option value="180">180분</option>
          <option value="210">210분</option>
          <option value="240">240분</option>
        </select>
      </div>
    </div>
  );
}

export default LessonTime;
