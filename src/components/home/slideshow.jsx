

import { useState } from 'react';

const SlideShow = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const images = [
        "src/assets/violin.jpg",
        "src/assets/colorin.webp"
    ];

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    const handleDotClick = (index) => {
        setCurrentIndex(index);
    };

    return (
        <div id="default-carousel" className="relative w-full bg-red-50">
            <div className="relative h-56 overflow-hidden rounded-lg md:h-96">
                {images.map((src, index) => (
                    <div
                        key={index}
                        className={`absolute block w-full h-full transition-all duration-700 ease-in-out ${index === currentIndex ? 'block' : 'hidden'}`}
                    >
                        <img src={src} className="w-full h-full object-cover" alt={`Slide ${index + 1}`} />
                    </div>
                ))}
            </div>

            <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse">
                {images.map((_, index) => (
                    <button
                        key={index}
                        type="button"
                        className={`w-3 h-3 rounded-full ${index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'}`}
                        aria-label={`Slide ${index + 1}`}
                        onClick={() => handleDotClick(index)}
                    ></button>
                ))}
            </div>

            <button
                type="button"
                className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group"
                onClick={handlePrev}
            >
                <span className="inline-flex items-center justify-center w-10 h-10 material-symbols-outlined rounded-full">
                    arrow_back_ios
                </span>
                <span className="sr-only">Previous</span>
            </button>

            <button
                type="button"
                className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group"
                onClick={handleNext}
            >
                <span className="material-symbols-outlined">
                    arrow_forward_ios
                </span>
                <span className="sr-only">Next</span>
            </button>
        </div>
    );
};

export default SlideShow;
