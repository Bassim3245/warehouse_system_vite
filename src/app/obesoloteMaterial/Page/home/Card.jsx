import React from 'react';
import './componntStyle.css';

const CardComponent = () => {
  const cards = [
    {
      imgSrc: 'path-to-your-chair-image.jpg',
      text: 'استعراض قائمة الاثاث الخاص بالمؤسسات',
    },
    {
      imgSrc: 'path-to-your-car-image.jpg',
      text: 'يمكنك الاطلاع على السيارات الجديدة والقريبة',
    },
    {
      imgSrc: 'path-to-your-laptop-image.jpg',
      text: 'أجهزة الحاسبات المحمولة و المكتبية والاجهزة الالكترونية الاخرى',
    },
  ];
  return (
    <div className="card-container">
      {cards.map((card, index) => (
        <div className={`cardAbout ${index === 1 ? 'selected' : ''}`} key={index}>
          {/* <img src={card.imgSrc} alt="card description" className="card-image" /> */}
          <p className="card-text">{card.text}</p>
        </div>
      ))}
    </div>
  );
};

export default CardComponent;
