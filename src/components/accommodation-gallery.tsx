'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AccommodationImage {
  src: string;
  alt: string;
  hint: string;
}

interface AccommodationGalleryProps {
  images: AccommodationImage[];
}

const IMAGES_PER_PAGE = 4;

export default function AccommodationGallery({ images }: AccommodationGalleryProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const totalPages = Math.ceil(images.length / IMAGES_PER_PAGE);
  const startIndex = (currentPage - 1) * IMAGES_PER_PAGE;
  const currentImages = images.slice(startIndex, startIndex + IMAGES_PER_PAGE);

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  const openLightbox = (index: number) => {
    setSelectedImageIndex(startIndex + index);
  };

  const closeLightbox = () => {
    setSelectedImageIndex(null);
  };

  const goToPreviousInLightbox = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((prev) => (prev !== null ? Math.max(0, prev - 1) : null));
    }
  };

  const goToNextInLightbox = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((prev) => (prev !== null ? Math.min(images.length - 1, prev + 1) : null));
    }
  };

  return (
    <>
      <div>
        <h2 className="font-headline text-2xl font-bold text-foreground mb-4">
          📸 Galería de imágenes
        </h2>
        
        <div className="grid grid-cols-2 gap-4">
          {currentImages.map((image, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-lg overflow-hidden bg-muted cursor-pointer group"
              onClick={() => openLightbox(index)}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                quality={75}
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                data-ai-hint={image.hint}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-6">
            <Button
              variant="outline"
              size="icon"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <Dialog open={selectedImageIndex !== null} onOpenChange={closeLightbox}>
        <DialogContent className="max-w-4xl w-full h-[90vh] p-0 bg-black/95 border-none">
          <DialogHeader className="absolute top-0 left-0 right-0 z-10 flex flex-row items-center justify-between p-4 bg-gradient-to-b from-black/60 to-transparent">
            <DialogTitle className="text-white text-sm md:text-base">
              {selectedImageIndex !== null ? images[selectedImageIndex].alt : ''}
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={closeLightbox}
              className="text-white hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </Button>
          </DialogHeader>
          
          {selectedImageIndex !== null && (
            <div className="relative w-full h-full flex items-center justify-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={goToPreviousInLightbox}
                disabled={selectedImageIndex === 0}
                className="absolute left-4 z-10 text-white hover:bg-white/20 h-12 w-12"
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
              
              <Image
                src={images[selectedImageIndex].src}
                alt={images[selectedImageIndex].alt}
                fill
                sizes="100vw"
                quality={85}
                className="object-contain"
                priority
              />
              
              <Button
                variant="ghost"
                size="icon"
                onClick={goToNextInLightbox}
                disabled={selectedImageIndex === images.length - 1}
                className="absolute right-4 z-10 text-white hover:bg-white/20 h-12 w-12"
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            </div>
          )}

          <div className="absolute bottom-4 left-0 right-0 text-center text-white text-sm bg-black/40 py-2">
            {selectedImageIndex !== null ? selectedImageIndex + 1 : 0} / {images.length}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
