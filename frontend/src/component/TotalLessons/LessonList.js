import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LessonItem from './LessonItem';
import { useSelector } from 'react-redux';
import axios from 'axios';
import '../../style/lesson/lessonListCss.css';

function LessonList() {
  const [lessons, setLessons] = useState([]);
  const type = useSelector((state) => state.lessonSearch.type);
  const deadline = useSelector((state) => state.lessonSearch.deadline);
  const order = useSelector((state) => state.lessonSearch.order);
  const category = useSelector((state) => state.lessonSearch.category);
  const keyword = useSelector((state) => state.lessonSearch.keyword);

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
        >
          <Link
            to={`/lesson/${lesson.lessonId}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <LessonItem
              id={lesson.lessonId}
              title={lesson.lessonTitle}
              date={lesson.lessonDate}
              thumbnailUrl = {lesson.thumbnailUrl}
              reviewAvg = {lesson.reviewAvg}
              cookyerName = {lesson.cookyerName}
              categoryId = {lesson.categoryId} 
            />
          </Link>
        </div>
      ))}
    </div>
  );
}

export default LessonList;
