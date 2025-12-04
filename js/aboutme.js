const track = document.querySelector('.carousel-track');
const slides = Array.from(track.children);
const nextBtn = document.querySelector('.next-btn');
const prevBtn = document.querySelector('.prev-btn');

let currentIndex = 0;

function getVisibleSlides() {
  const width = window.innerWidth;
  if (width <= 480) return 1;
  if (width <= 768) return 1.5;
  if (width <= 1024) return 2;
  return 2.5;
}

function moveToSlide(index) {
  const gap = 20; // must match CSS
  const slideWidth = slides[0].getBoundingClientRect().width;
  track.style.transform = `translateX(-${index * (slideWidth + gap)}px)`;
}

nextBtn.addEventListener('click', () => {
  const visibleSlides = getVisibleSlides();
  const maxIndex = Math.floor(slides.length - visibleSlides);
  if (currentIndex < maxIndex) {
    currentIndex++;
    moveToSlide(currentIndex);
  }
});

prevBtn.addEventListener('click', () => {
  if (currentIndex > 0) {
    currentIndex--;
    moveToSlide(currentIndex);
  }
});

window.addEventListener('resize', () => moveToSlide(currentIndex));
