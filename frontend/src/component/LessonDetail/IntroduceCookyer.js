import React from 'react';
import { useSelector } from 'react-redux';
import '../../style/lesson/introduceCookyerCss.css';

function IntroduceCookyer() {
  const cookyerName = useSelector((state) => state.lessonInfo.cookyerName);
  const food = useSelector((state) => state.lessonInfo.food);
  const introduce = useSelector((state) => state.lessonInfo.introduce);
  const badgeExist = useSelector((state) => state.lessonInfo.badge);
  const foodLabels = [ '한식', '양식', '중식', '일식', '아시안', '건강식', '디저트'];

  return (
    <div className='introduceCookyerContainer'>
      <div className='introduceCookyerTitle'>강사 소개</div>
      <div className='introduceCookyerNameContainer'>
        <span className='introduceCookyerName'>{cookyerName}</span>
        {food.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && <span className='separator'> | </span>}
            <span className='introduceCookyerFood'>{foodLabels[item]}</span>
          </React.Fragment>
        ))}
      </div>
      <div> {badgeExist === 'X' && <span className='introduceCookyerBadge'>자격증 소지</span>} </div>
      <div className='introduceCookyerIntroduce'>{introduce}</div>
    </div>
  );
}

export default IntroduceCookyer;
