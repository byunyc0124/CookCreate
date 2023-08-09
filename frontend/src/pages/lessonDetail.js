import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import IntroduceLesson from '../component/LessonDetail/IntroduceLesson';
import IntroduceCookyer from '../component/LessonDetail/IntroduceCookyer';
import LessonReview from '../component/LessonDetail/LessonReview';
import CookieeNumber from '../component/LessonDetail/CookieeNumber';
import ApplyLesson from '../component/LessonDetail/ApplyLesson';
import LessonSchedule from '../component/LessonDetail/LessonSchedule';
import EditLesson from '../component/LessonDetail/EditLesson';
import {
  setCategoryId, setCategoryName, setDescription, setDifficulty,
  setLessonDate, setLessonStepList, setLessonTitle, setRemaining,
  setMaterials, setMaximum, setPrice, setThumbnailUrl, setTimeTaken, setVideoUrl,
  setIntroduce
} from '../store/lesson/lessonInfo';

function LessonDetail() {
  const dispatch = useDispatch();
  
  const lessonId = useSelector((state) => state.lessonInfo.lessonId)
  const access_token = localStorage.getItem('access_token')

  const userName = localStorage.getItem('nickname')
  const categoryName = useSelector((state) => state.lessonInfo.categoryName);
  const lessonTitle = useSelector((state) => state.lessonInfo.lessonTitle);
  const thumbnailUrl = useSelector((state) => state.lessonInfo.thumbnailUrl);

  const userType = localStorage.getItem('role');
  const [disable, setDisable] = useState(false);
  const [disableEdit, setDisableEdit] = useState(false)
  const lessonDate = useSelector((state) => state.lessonInfo.lessonDate);
  const remaining = parseInt(useSelector((state) => state.lessonInfo.remaining));
  // const lessonId = useSelector((state) => state.lessonInfo.lessonId);

  useEffect(() => {
    const DateTransformType = new Date(lessonDate);
    const currentTime = new Date();
    const futureTime = new Date(currentTime.getTime() + 12 * 60 * 60 * 1000); // 현재 시간 + 12시간
    // const lessonId = useSelector((state) => state.lessonInfo.lessonId)
    axios
      .get(`/api/v1/lesson/${lessonId}`, {}, {
      headers: {
        Access_Token: access_token,
      }
    })
      .then((res) => {
        console.log(res.data);
        console.log(DateTransformType > futureTime, ' 더 미래니?');
        console.log(userType);
        dispatch(setCategoryName(res.data.categoryName));
        dispatch(setCategoryId(res.data.categoryId));
        dispatch(setDescription(res.data.description));
        dispatch(setDifficulty(res.data.difficulty));
        dispatch(setLessonTitle(res.data.lessonTitle));
        dispatch(setLessonStepList(res.data.lessonStepList));
        dispatch(setMaterials(res.data.materials));
        dispatch(setMaximum(res.data.maximum));
        dispatch(setPrice(res.data.price));
        dispatch(setThumbnailUrl(res.data.thumbnailUrl));
        dispatch(setRemaining(res.data.remaining));
        dispatch(setVideoUrl(res.data.videoUrl));
        dispatch(setLessonDate(res.data.lessonDate));
        dispatch(setTimeTaken(res.data.timeTaken));
        dispatch(setVideoUrl(res.data.videoUrl));
        dispatch(setIntroduce(res.data.introduce))
        if (DateTransformType > futureTime && remaining > 0 && userType === 'COOKIEE') {
          setDisable(false);
        } else {
          setDisable(true);
        }
        if (userName === res.data.cookyerName) { 
          setDisableEdit(false)
        } else {
          setDisableEdit(true)
        }
      })
      .catch((err) => {
        console.log(err);
        alert(err.response.data.message);
      });
  }, [disable, lessonId]);

  return (
    <div>
      <br />
      {categoryName}
      <h2>
        {lessonTitle}
      </h2>
      <img src={thumbnailUrl} alt="" />
      <IntroduceLesson />
      <IntroduceCookyer />
      <LessonReview />

      <CookieeNumber />
      <ApplyLesson
        disable={disable}
      />
      <LessonSchedule />
      <EditLesson 
        lessonId={lessonId} 
        disable={disableEdit} 
      />

    </div>
  );
}

export default LessonDetail;
