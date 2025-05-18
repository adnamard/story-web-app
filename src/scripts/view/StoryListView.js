import StoryPresenter from '../presenter/StoryPresenter.js';
import Database from '../model/db.js';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const StoryListView = {
  async render() {
    return `
      <section class="content">
        <h2 class="section-title">Cerita Terbaru</h2>
        <div id="story-list" class="story-list"></div>
      </section>
    `;
  },

  async afterRender() {
    const main = document.getElementById('main-content');
    if (main) {
      main.focus();
    }

    StoryPresenter.init(this);
  },

  showStories(stories) {
    const container = document.querySelector('#story-list');
  container.innerHTML = '';

  stories.forEach(async (story) => {
    
    const article = document.createElement('article');
    article.classList.add('story-item');

    const isSaved = await Database.getStoryById(story.id);

    article.innerHTML = `
      <img src="${story.photoUrl}" alt="Foto oleh ${story.name}" loading="lazy">
      <h3>${story.name}</h3>
      <p>${story.description}</p>
      <p><small>${new Date(story.createdAt).toLocaleString()}</small></p>
      <div class="buttons">
        <button class="btn-save" data-id="${story.id}">${isSaved ? 'Hapus dari Favorit' : 'Simpan ke Favorit'}</button>
      </div>
      <div id="map-${story.id}" class="story-map" style="height: 200px;"></div>
    `;

    container.appendChild(article);

    const map = L.map(`map-${story.id}`).setView([story.lat, story.lon], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    L.marker([story.lat, story.lon])
      .addTo(map)
      .bindPopup(`<b>${story.name}</b><br>${story.description}`);
    });
    
    container.addEventListener('click', async (e) => {
      if (e.target.classList.contains('btn-save')) {
        const id = e.target.dataset.id;
        const story = stories.find(s => s.id === id);
        const isSaved = await Database.getStoryById(id);

      if (isSaved) {
        await Database.removeStory(id);
        e.target.textContent = 'Simpan ke Favorit';
        alert('Cerita dihapus dari favorit');
      } else {
        await Database.putStory(story);
        e.target.textContent = 'Hapus dari Favorit';
        alert('Cerita disimpan ke favorit');
      }
    }
  });
  },

  showError(error) {
    const container = document.querySelector('#story-list');
    container.innerHTML = `<p>Gagal memuat cerita. Coba muat ulang.</p>`;
    console.error(error);
  },
};

export default StoryListView;