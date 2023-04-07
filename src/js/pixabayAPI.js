import axios from 'axios';

export { fetchImages };

axios.defaults.baseURL = 'https://pixabay.com/api/';
const API_KEY = '35168652-e3d07a1f2c4886b9d79735066';

async function fetchImages(query, page, perPage) {
  const response = await axios.get(
    `?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`
  );

  return response;
}
