'use client';

import React, { useState, useCallback, ReactNode, Children, useRef, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';

interface CarouselProps {
  children: ReactNode;
  autoSlide?: boolean; 
  autoSlideInterval?: number;
}

export default function Carousel({
  children,
  autoSlide = true, // Define o autoplay como padrão (true)
  autoSlideInterval = 10000, // 5 segundos como solicitado
}: CarouselProps) {
  const slides = Children.toArray(children);
  const [currentSlide, setCurrentSlide] = useState(0);
  // Removido: [carouselHeight, setCarouselHeight]
  const totalSlides = slides.length;

  // Removido: slideRefs, setRef
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  // --- Lógica de Navegação ---

  const next = useCallback(() => {
    setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  }, [totalSlides]);
  
  const prev = useCallback(() => {
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  }, [totalSlides]);

  // Hook do Swipe
  const handlers = useSwipeable({
    onSwipedLeft: next,
    onSwipedRight: prev,
    preventScrollOnSwipe: true,
    trackMouse: true,
  });
  
  // --- Efeito de Autoplay (Mantido) ---
  useEffect(() => {
    if (!autoSlide) return;

    const startAutoplay = () => {
      autoplayRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
      }, autoSlideInterval);
    };

    const stopAutoplay = () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };

    startAutoplay();
    
    return stopAutoplay;
    
  }, [autoSlide, autoSlideInterval, totalSlides]); 


  return (
    <div 
      {...handlers} 
      className=" h-auto relative overflow-hidden touch-pan-y cursor-grab active:cursor-grabbing" 
    >
      
      {/* Indicadores (Dots) - MANTIDOS NO TOPO */}
      <div className="absolute top-4 left-0 right-0 z-10">
        <div className="flex items-center justify-center gap-2 p-2 bg-black/10 rounded-full w-fit mx-auto shadow-inner">
          {slides.map((_, i) => (
            <div
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`
                transition-all w-3 h-3 rounded-full cursor-pointer
                ${currentSlide === i ? 'w-6 h-3 bg-primary' : 'bg-white/50 hover:bg-white'}
              `}
            />
          ))}
        </div>
      </div>
      
      {/* Contêiner interno que move os slides */}
      {/* Este contêiner agora definirá a altura baseada no maior slide interno */}
      <div
        className="flex transition-transform ease-out duration-500"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div 
            key={index} 
            // Removida a ref
            className="w-full flex-shrink-0"
          >
            {slide}
          </div>
        ))}
      </div>
      
      {/* Uma área invisível que garante que a seção dots não fique coberta pelo slide */}
      <div className="relative h-8 w-full"></div> 

    </div>
  );
}
