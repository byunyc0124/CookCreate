import React, { useState, useEffect } from 'react';
import LessonItem from './LessonItem';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import '../../style/lesson/lessonListCss.css';

import { useNavigate } from 'react-router-dom';
// import { setLessonId } from '../../store/lesson/lessonInfo';

function LessonList() {
  const navigate = useNavigate()
  // const dispatch = useDispatch()
  const [lessons, setLessons] = useState([]);
  const type = useSelector((state) => state.lessonSearch.type);
  const deadline = useSelector((state) => state.lessonSearch.deadline);
  const order = useSelector((state) => state.lessonSearch.order);
  const category = useSelector((state) => state.lessonSearch.category);
  const keyword = useSelector((state) => state.lessonSearch.keyword);
  const isLogin = useSelector((state) => state.auth.isLogin)
  
  const handleLessonDetail = (lessonId) => {
    navigate(`/lesson/${lessonId}`)
  }

  const gotoLogin = () => {
    alert('로그인 후 확인할 수 있습니다!')
    navigate('/login')
  }
  useEffect(() => {
    axios.get(`/api/v1/lesson`, {
      params: {
        type,
        keyword,
        category,
        order,
        deadline,
      }
    })
    .then((res) => {
      setLessons(res.data)
    })
    .catch((err) => {
      console.error(err)
    });
  }, [type, keyword, category, order, deadline])
  
  return (
    <div className='lessonListContainer'>
      {lessons.map((lesson) => (
        <div 
          key={lesson.lessonId}
          className="lessonItemContainer"
          style={{
            padding: '20px',
            marginTop: '20px'
          }}
          onClick={() => {
            if (isLogin) {
              handleLessonDetail(lesson.lessonId);
            } else {
              gotoLogin();
            }
          }}  
        >
          <LessonItem
            id={lesson.lessonId}
            title={lesson.lessonTitle}
            date={lesson.lessonDate}
            thumbnailUrl={lesson.thumbnailUrl}
            reviewAvg={lesson.reviewAvg}
            cookyerName={lesson.cookyerName}
            categoryId={lesson.categoryId} 
            difficulty={lesson.difficulty} 
          />
        </div>
      ))}
    </div>
  );
}

export default LessonList;
