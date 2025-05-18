import LoginPresenter from '../presenter/LoginPresenter';
import { updateNavbar } from '../index.js'; // pastikan path benar

const LoginView = {
  async render() {
    return `
      <section class="form-section">
        <h2>Masuk ke Akun Anda</h2>
        <form id="login-form" class="form-card">
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" placeholder="you@example.com" required class="input" />
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" placeholder="••••••••" required minlength="8" class="input" />
          </div>

          <button type="submit" class="btn">Masuk</button>
        </form>
      </section>
    `;
  },

  async afterRender() {

    const main = document.getElementById('main-content');
    if (main) {
      main.focus();
    }
    
    const form = document.getElementById('login-form');

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = form.email.value;
      const password = form.password.value;

      LoginPresenter.login({
        email,
        password,
        onSuccess: () => {
          updateNavbar();
          window.location.hash = '/';
        },
        onError: (message) => {
          alert(message);
        }
      });
    });
  },
};

export default LoginView;
