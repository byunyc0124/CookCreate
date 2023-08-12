import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import '../../style/lesson/apply-lesson-css.css';

function ApplyLesson() {
  const [disable, setDisable] = useState(false);
  const [disableMsg, setDisableMsg] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [payUrl, setPayUrl] = useState('');
  const [popupWindow, setPopupWindow] = useState('');
  
  const price = useSelector((state) => state.lessonInfo.price);
  const lessonId = useSelector((state) => state.lessonInfo.lessonId);
  const videoUrl = useSelector((state) => state.lessonInfo.videoUrl);
  const access_token = useSelector((state) => state.auth.access_token);
  const role = localStorage.getItem('role');
  
  const remaining = useSelector((state) => state.lessonInfo.remaining);
  const lessonDate = useSelector((state) => state.lessonInfo.lessonDate);
  const DateTransformType = new Date(lessonDate);
  const currentTime = new Date();
  const futureTime = new Date(currentTime.getTime() + 12 * 60 * 60 * 1000);

  useEffect(() => {
    if (remaining === 0) {
      setDisable(true);
      setDisableMsg('최대 인원을 채운 강의입니다.');
    } else if (futureTime > DateTransformType) {
      setDisable(true);
      setDisableMsg('현재 시간 기준 12시간 이전에 예정된 강의는 수강 신청할 수 없습니다.');
    } else {
      setDisable(false)
      setDisableMsg('')
    }
  }, [remaining,DateTransformType, futureTime]);

  const handleApply = () => {
    axios
      .post(`/api/v1/pay/ready/${lessonId}`, {}, {
        headers: {
          Access_Token: access_token,
        },
      })
      .then((res) => {
        setPayUrl(res.data.next_redirect_pc_url);
        const popupWindow = window.open(
          res.data.next_redirect_pc_url,
          '_blank',
          'width=500, height=600'
        );
        setPopupWindow(popupWindow);
      })
      .catch((err) => {
        setErrMsg(err.response.data.message);
      });
  };

  useEffect(() => {
    if (popupWindow) {
      const timer = setInterval(() => {
        const searchParams = new URL(popupWindow.location.href).searchParams;
        const payStatus = searchParams.get('payStatus');
        if (payStatus === 'COMPLETED') {
          popupWindow.close();
          console.log('결제 성공');
          axios
            .post(`/api/v1/lesson/${lessonId}`, {}, {
              headers: {
                Access_Token: access_token,
              },
            })
            .then((res) => {
              console.log(res);
              console.log('결제 후 신청 완료');
            })
            .catch((err) => {
              console.log(err);
            });
          clearInterval(timer);
        } else if (payStatus === 'CANCELLED' || payStatus === 'FAILED') {
          alert('다시 결제를 시도해주세요!');
          clearInterval(timer);
        }
      }, 500);
      return () => {
        clearInterval(timer);
      };
    }
  }, [popupWindow]);


  return (
    <div className='applyLessonContainer'>
      <div className='applyLessonPrice'>{price}원</div>
      <div className='applyLessonApplyButtonContainer'>
        {role === 'COOKIEE' && (
          <button
            onClick={handleApply}
            className={`applyLessonApplyButton ${disable ? 'disabled' : ''}`}
            disabled={disable}
          >
            신청하기
          </button>
        )}
      </div>
      {errMsg && <div className='errMsg'>{errMsg}</div>}
      {disableMsg && <div className='disableMsg'>{disableMsg}</div>}
      <div className='applyLessonVideoUrl'>
        <a href={videoUrl}> 수업 맛보기 </a>
      </div>
    </div>
  );

}

export default ApplyLesson;
