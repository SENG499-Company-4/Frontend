import React from 'react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider, { Settings } from 'react-slick';
import 'components/styles/slideStyles.css';

function ImageSlider(props: any) {
    const settings: Settings = {
        infinite: true,
        dots: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 9000,
    };
    return (
        <>
            <div className="imgslider">
                <Slider {...settings}>
                    {props.images.map((item: any) => (
                        <div key={item.id}>
                            <img src={item.src} alt={item.alt} />
                        </div>
                    ))}
                </Slider>
            </div>
        </>
    )
}

export default ImageSlider;