import '../styles/styles.css';
import 'leaflet/dist/leaflet.css';
import router from './routes/routes.js';

// Fungsi untuk update navbar sesuai status login
export function updateNavbar() {
  const token = localStorage.getItem('token');

  const loginLink = document.getElementById('login-link');
  const registerLink = document.getElementById('register-link');
  const logoutLink = document.getElementById('logout-link');

  if (token) {
    if (loginLink) loginLink.style.display = 'none';
    if (registerLink) registerLink.style.display = 'none';
    if (logoutLink) logoutLink.style.display = 'inline';
  } else {
    if (loginLink) loginLink.style.display = 'inline';
    if (registerLink) registerLink.style.display = 'inline';
    if (logoutLink) logoutLink.style.display = 'none';
  }

  if (logoutLink) {
    logoutLink.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('token');
      alert('Berhasil logout!');
      updateNavbar(); // Update tampilan navbar
      location.hash = '/login'; // Arahkan ke halaman login
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  updateNavbar();
  router();
  
  const skipLink = document.querySelector('.skip-link');
  const mainContent = document.querySelector('#main-content');

  if (skipLink && mainContent) {
    skipLink.addEventListener('click', (event) => {
      event.preventDefault(); // Hindari reload
      skipLink.blur();        // Lepas fokus dari skip link
      mainContent.focus();    // Fokus ke elemen utama
      mainContent.scrollIntoView({ behavior: 'smooth' }); // Scroll halus
    });
  }
});
