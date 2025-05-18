import '../styles/styles.css';
import 'leaflet/dist/leaflet.css';
import router from './routes/routes.js';
import pushSubscribe from './utils/notification.js';


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
      updateNavbar(); 
      location.hash = '/login'; 
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
      event.preventDefault();
      skipLink.blur();
      mainContent.focus();    
      mainContent.scrollIntoView({ behavior: 'smooth' }); 
    });
  }
});

document.addEventListener('DOMContentLoaded', () => {
  updateNavbar();
  router();

  
  pushSubscribe();
});
