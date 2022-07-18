import React from 'react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import ImageSlider from 'components/organisms/ImageSlider';

export interface IImage {
  id: number;
  src: string;
  alt: string;
}

const images: IImage[] = [
  {
    id: 1,
    src: 'https://iili.io/wOh3Nt.png',
    alt: 'Image 1'
  },
  {
    id: 2,
    src: 'https://iili.io/wOWJqv.png',
    alt: 'Image 2 '
  },
  {
    id: 3,
    src: 'https://iili.io/wOWPTX.png',
    alt: 'Image 3'
  }
];

function Home() {
  return (
    <div>
      <ImageSlider images={images} />
    </div>
  );
}

export default Home;
