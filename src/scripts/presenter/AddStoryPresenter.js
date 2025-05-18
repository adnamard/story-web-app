import StoryModel from '../model/StoryModel.js';

const AddStoryPresenter = {
  async uploadStory({ formData, onLoading, onSuccess, onError }) {
    
    const lat = formData.get('lat');
    const lon = formData.get('lon');

    if (!lat || !lon || isNaN(parseFloat(lat)) || isNaN(parseFloat(lon))) {
      onError('Lokasi belum dipilih. Silakan klik peta atau centang gunakan lokasi.');
      return;
    }

    onLoading();

    try {
      const result = await StoryModel.addStory(formData);

      if (!result.error) {
        onSuccess('Cerita berhasil ditambahkan!');
      } else {
        onError(`Gagal upload: ${result.message}`);
      }
    } catch (error) {
      console.error(error);
      onError('Terjadi kesalahan saat upload.');
    }
  },
};

export default AddStoryPresenter;
