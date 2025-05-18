import AuthModel from './AuthModel';

const StoryModel = {
  async getStories() {
    const token = AuthModel.getToken();
    if (!token) {
      return {
        error: true,
        message: 'Token tidak tersedia. Harap login terlebih dahulu.',
      };
    }

    try {
      const response = await fetch('https://story-api.dicoding.dev/v1/stories?location=1', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return await response.json();
    } catch (error) {
      console.error('Get stories error:', error);
      return {
        error: true,
        message: 'Gagal mengambil cerita. Cek koneksi jaringan.',
      };
    }
  },

  async addStory(formData) {
    const token = AuthModel.getToken();
    if (!token) {
      return {
        error: true,
        message: 'Token tidak tersedia. Harap login terlebih dahulu.',
      };
    }

    try {
      const response = await fetch('https://story-api.dicoding.dev/v1/stories', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      return await response.json();
    } catch (error) {
      console.error('Add story error:', error);
      return {
        error: true,
        message: 'Gagal mengunggah cerita. Cek koneksi jaringan.',
      };
    }
  }
};

export default StoryModel;
