import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import fetchImages from './js/fetchImages';
import createMarkupImg from './js/createMarkup';
import toTopBtn from './js/toTopBtn';

const form = document.querySelector('.search-form');
const searchButton = document.querySelector('[type=submit]');
const gallery = document.querySelector('.gallery');


const options = {
  simpleLightBox: {
    captions: true,
    captionsData: 'alt',
    captionDelay: 500,
  },
  intersectionObserver: {
    root: null,
    rootMargin: '0px',
    threshold: 1.0
  },
};

const loadService = new fetchImages();

form.addEventListener('submit', onFormSubmit);

const callback = function (entries, observer) {
  if (entries[0].isIntersecting) {
    observer.unobserve(entries[0].target);
    loadPictures();
  }
};
const observer = new IntersectionObserver(callback, options.simpleLightBox);

let galleryLightBox = new SimpleLightbox('.gallery a', options.simpleLightBox);

function onFormSubmit(event) {
    event.preventDefault();

  const isFilled = event.currentTarget.elements.searchQuery.value;
  if (isFilled) {
    searchButton.disabled = true;
    loadService.searchQuery = isFilled;
    loadService.resetPage();
    gallery.innerHTML = '';
    loadPictures();
  }
}

function loadPictures() {
  loadService
    .getPictures()
    .then(dataProcessing)
    .catch(error => {
      console.log(error);
      Notify.failure('Something went wrong, please try again...');
    });
}

function dataProcessing(data) {
  searchButton.disabled = false;
  if (data.data.totalHits === 0) {
        Notify.failure('Sorry, there are no images matching your search query. Please try again.');
        return;
    }
  if (data.data.totalHits !== 0 && data.data.hits.length === 0) {
        Notify.warning(`We're sorry, but you've reached the end of search results.`);
        return;
    }

  gallery.insertAdjacentHTML('beforeend', createMarkupImg(data.data.hits));

  galleryLightBox.refresh();

  if (loadService.pageNumber === 2) {
        Notify.info(`Hooray! We found ${data.data.totalHits} images.`);
    } 
    else {
        const { height: cardHeight } = gallery.firstElementChild.getBoundingClientRect();
        window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
        });
    }
  observer.observe(gallery.lastElementChild);
}
