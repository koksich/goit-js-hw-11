import { fetchImages } from './js/pixabayAPI';
import { renderGallery } from './js/renderGalery';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';

const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.button--loadMore');
let query = '';
let page = 1;
let simpleLightBox;
const perPage = 40;

searchForm.addEventListener('submit', onSearchForm);
loadMoreBtn.addEventListener('click', onLoadMoreBtn);

async function onSearchForm(event) {
  event.preventDefault();
  page = 1;
  query = event.currentTarget.searchQuery.value.trim();
  gallery.innerHTML = '';
  loadMoreBtn.classList.add('is-hidden');
  event.currentTarget.searchQuery.value = ''; // Очистка поля input

  if (query === '') {
    return Notiflix.Notify.failure(
      'The search string cannot be empty. Please specify your search query.'
    );
  }

  try {
    const response = await fetchImages(query, page, perPage);
    const { data } = response;

    if (data.totalHits === 0) {
      Notiflix.Notify.failure(
        `Sorry, there are no images matching your search "${query}". Please try again.`
      );
    } else {
      renderGallery(data.hits);
      simpleLightBox = new SimpleLightbox('.gallery a').refresh();
      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);

      if (data.totalHits > perPage) {
        loadMoreBtn.classList.remove('is-hidden');
      }
    }
  } catch (error) {
    console.log(error);
  }
}

async function onLoadMoreBtn() {
  page += 1;
  simpleLightBox.destroy();

  try {
    const response = await fetchImages(query, page, perPage);
    const { data } = response;

    renderGallery(data.hits);
    simpleLightBox = new SimpleLightbox('.gallery a').refresh();

    const totalPages = Math.ceil(data.totalHits / perPage);

    if (page >= totalPages) {
      loadMoreBtn.classList.add('is-hidden');
      Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
    }
  } catch (error) {
    console.log(error);
  }
}
