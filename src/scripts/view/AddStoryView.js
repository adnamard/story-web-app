import AddStoryPresenter from '../presenter/AddStoryPresenter.js';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const AddStoryView = {
  _lat: null,
  _lon: null,
  _cameraStream: null,
  _isCameraOpen: false,

  async render() {
    return `
      <section class="form-section">
        <h2>Tambah Cerita</h2>
        <form id="add-story-form" enctype="multipart/form-data">
          <div class="form-group">
            <label for="description">Deskripsi</label>
            <textarea id="description" name="description" class="input" required></textarea>
          </div>

          <div class="form-group">
            <label for="photo">Unggah Foto</label>
            <input type="file" id="photo" name="photo" class="input" accept="image/*" />
          </div>

          <div class="form-group">
            <button type="button" id="enable-camera-btn" class="btn mt-2">Gunakan Kamera</button>
          </div>

          <div class="form-group" id="camera-section" style="display: none;">
            <label>Kamera Langsung</label>
            <video id="camera-preview" autoplay muted playsinline class="rounded w-full max-w-md h-auto border border-gray-300"></video>
            <button type="button" id="capture-btn" class="btn mt-2">📸 Ambil Gambar</button>
            <canvas id="snapshot" style="display: none;"></canvas>
          </div>

          <div class="form-group">
            <input type="checkbox" id="use-current-location" />
            <label for="use-current-location">Gunakan lokasi saya sekarang</label>
          </div>

          <div id="map" style="height: 300px; margin-top: 1rem;"></div>

          <button type="submit" class="btn mt-4">Unggah</button>
        </form>

        <div id="loading" class="loading" style="display: none;">🔄 Mengunggah...</div>
        <div id="status-message" class="status-message" style="display: none;"></div>
      </section>
    `;
  },

  async afterRender() {
    const form = document.getElementById('add-story-form');
    const checkbox = document.getElementById('use-current-location');
    const enableCameraBtn = document.getElementById('enable-camera-btn');
    const cameraSection = document.getElementById('camera-section');
    const video = document.getElementById('camera-preview');
    const canvas = document.getElementById('snapshot');
    const captureBtn = document.getElementById('capture-btn');

    let capturedBlob = null;

    enableCameraBtn.addEventListener('click', async (event) => {
      this._isCameraOpen = !this._isCameraOpen;

      if (this._isCameraOpen) {
        cameraSection.style.display = 'block';
        event.currentTarget.textContent = 'Tutup Kamera';

        if (navigator.mediaDevices?.getUserMedia) {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            video.srcObject = stream;
            this._cameraStream = stream;
          } catch (err) {
            console.error('Gagal membuka kamera:', err);
            this.showMessage('Kamera tidak bisa diakses.', true);
            this._isCameraOpen = false;
            event.currentTarget.textContent = 'Gunakan Kamera';
          }
        }
      } else {
        this.stopCamera();
        cameraSection.style.display = 'none';
        event.currentTarget.textContent = 'Gunakan Kamera';
      }
    });

    const self = this;
    captureBtn.addEventListener('click', () => {
      const context = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        capturedBlob = blob;
        self.showMessage('Gambar berhasil diambil dari kamera!');
        self.stopCamera(); // Kamera langsung mati setelah capture
        self._isCameraOpen = false;
        enableCameraBtn.textContent = 'Gunakan Kamera';
        cameraSection.style.display = 'none';
      }, 'image/jpeg');
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(form);

      if (capturedBlob) {
        formData.set('photo', capturedBlob, 'captured.jpg');
      } else if (!form.photo.files.length) {
        this.showMessage('Silakan unggah foto atau ambil dari kamera.', true);
        return;
      }

      if (checkbox.checked) {
        if (!navigator.geolocation) {
          this.showMessage('Geolocation tidak didukung oleh browser ini.', true);
          return;
        }

        this.showLoading();

        navigator.geolocation.getCurrentPosition(
          async (position) => {
            formData.append('lat', position.coords.latitude);
            formData.append('lon', position.coords.longitude);
            await this._send(formData);
          },
          (err) => {
            this.hideLoading();
            this.showMessage('Gagal mengambil lokasi: ' + err.message, true);
          }
        );
      } else {
        if (this._lat && this._lon) {
          formData.append('lat', this._lat);
          formData.append('lon', this._lon);
        } else {
          this.showMessage('Pilih lokasi di peta atau centang "Gunakan lokasi saya sekarang"', true);
          return;
        }

        await this._send(formData);
      }
    });

    const map = L.map('map').setView([-6.2, 106.8], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    let marker;
    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      this._lat = lat;
      this._lon = lng;

      if (marker) {
        marker.setLatLng(e.latlng);
      } else {
        marker = L.marker(e.latlng).addTo(map);
      }
    });
  },

  async _send(formData) {
    await AddStoryPresenter.uploadStory({
      formData,
      onLoading: () => this.showLoading(),
      onSuccess: (msg) => {
        this.hideLoading();
        this.showMessage(msg);
        setTimeout(() => window.location.hash = '/', 1500);
      },
      onError: (err) => {
        this.hideLoading();
        this.showMessage(err, true);
      },
    });
  },

  stopCamera() {
    if (this._cameraStream) {
      this._cameraStream.getTracks().forEach((track) => track.stop());
      this._cameraStream = null;
    }
  },

  showLoading() {
    document.getElementById('loading').style.display = 'block';
  },

  hideLoading() {
    document.getElementById('loading').style.display = 'none';
  },

  showMessage(message, isError = false) {
    const msgEl = document.getElementById('status-message');
    msgEl.textContent = message;
    msgEl.style.display = 'block';
    msgEl.style.color = isError ? 'red' : 'green';
  },
};

export default AddStoryView;
