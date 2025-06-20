
"use client";

import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import 'swiper/css/effect-fade';

interface SlideImage {
  src: string;
  alt: string;
  hint: string;
}

interface ImageSliderProps {
  images: SlideImage[];
  className?: string;
}

const ImageSlider: React.FC<ImageSliderProps> = ({ images, className }) => {
  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        pagination={{ clickable: true }}
        loop={true}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        className="h-full w-full"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index} className="relative h-full w-full">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
              priority={index === 0}
              data-ai-hint={image.hint}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ImageSlider;
