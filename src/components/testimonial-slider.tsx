
"use client";

import type { Testimonial } from '@/lib/types';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, Navigation } from 'swiper/modules';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Quote } from 'lucide-react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';

interface TestimonialSliderProps {
  testimonials: Testimonial[];
}

const TestimonialSlider: React.FC<TestimonialSliderProps> = ({ testimonials }) => {
  if (!testimonials || testimonials.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">Aún no hay testimonios para mostrar.</p>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-0"> {/* Added padding for better spacing on small screens */}
      <Swiper
        modules={[Pagination, Autoplay, Navigation]}
        spaceBetween={30}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 7000, // Slower autoplay for readability
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        navigation={true}
        breakpoints={{
          // when window width is >= 768px
          768: {
            slidesPerView: 2,
            spaceBetween: 30
          },
          // when window width is >= 1024px
          1024: {
            slidesPerView: 3,
            spaceBetween: 40
          }
        }}
        className="pb-12 md:pb-16 !px-2 sm:!px-6" // Increased padding bottom for pagination and added horizontal padding for nav buttons
      >
        {testimonials.map((testimonial) => (
          <SwiperSlide key={testimonial.id} className="h-full">
            <Card className="flex flex-col h-full shadow-lg rounded-lg overflow-hidden bg-card text-card-foreground">
              <CardHeader className="pb-3 pt-5 px-5">
                <div className="flex items-start space-x-3">
                  <Quote className="h-8 w-8 text-primary mt-1 shrink-0" />
                  <CardTitle className="text-lg font-normal italic text-muted-foreground leading-relaxed line-clamp-5 flex-grow">
                    "{testimonial.quote}"
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="px-5 pb-5 flex-grow">
                {/* Content can be added here if needed, for now it's minimal */}
              </CardContent>
              <CardFooter className="bg-muted/50 p-4 px-5 border-t">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    {testimonial.avatarUrl ? (
                      <AvatarImage src={testimonial.avatarUrl} alt={testimonial.author} data-ai-hint={testimonial.avatarHint} />
                    ) : (
                      <AvatarImage src={`https://placehold.co/40x40.png?text=${testimonial.author.substring(0,1)}`} alt={testimonial.author} data-ai-hint="person portrait" />
                    )}
                    <AvatarFallback>{testimonial.author.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm text-foreground">{testimonial.author}</p>
                    <p className="text-xs text-primary">{testimonial.destination}</p>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default TestimonialSlider;
