// src/scripts/presenter/StoryPresenter.js
import StoryModel from '../model/StoryModel';

const StoryPresenter = {
  async init(view) {
    this._view = view;
    await this._loadStories();
  },

  async _loadStories() {
    const token = localStorage.getItem('token');
    
    if (!token) {
      this._view.showError('Kamu belum login.');
      return;
    }

    try {
      const result = await StoryModel.getStories(token);

      if (!result.error) {
        this._view.showStories(result.listStory);
      } else {
        this._view.showError(result.message || 'Gagal memuat cerita');
      }
    } catch (err) {
      this._view.showError('Terjadi kesalahan saat mengambil data cerita.');
      console.error(err);
    }
  },
};

export default StoryPresenter;
