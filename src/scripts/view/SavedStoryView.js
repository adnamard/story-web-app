import Database from '../model/db.js';
import L from 'leaflet';

const SavedStoryView = {
  async render() {
    return `
      <section class="content">
        <h2 class="section-title">Cerita yang Disimpan</h2>
        <div id="saved-story-list" class="story-list"></div>
      </section>
    `;
  },

  async afterRender() {
    const container = document.querySelector('#saved-story-list');
    const stories = await Database.getAllStories();
    container.innerHTML = '';

    if (!stories.length) {
      container.innerHTML = '<p>Belum ada cerita yang disimpan.</p>';
      return;
    }

    stories.forEach((story) => {
      const article = document.createElement('article');
      article.classList.add('story-item');

      article.innerHTML = `
        <img src="${story.photoUrl}" alt="Foto oleh ${story.name}" loading="lazy">
        <h3>${story.name}</h3>
        <p>${story.description}</p>
        <p><small>${new Date(story.createdAt).toLocaleString()}</small></p>
        <div class="buttons">
          <button class="btn-remove" data-id="${story.id}">❌ Hapus</button>
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
      if (e.target.classList.contains('btn-remove')) {
        const id = e.target.dataset.id;
        await Database.removeStory(id);
        alert('Cerita dihapus dari favorit');
        this.afterRender(); 
      }
    });
  },
};

export default SavedStoryView;
