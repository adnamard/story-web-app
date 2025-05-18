import RegisterPresenter from '../presenter/RegisterPresenter.js';

const RegisterView = {
  async render() {
    return `
      <section class="form-section">
        <h2>Daftar Akun Baru</h2>
        <form id="register-form" class="form-card">
          <div class="form-group">
            <label for="name">Nama Lengkap</label>
            <input type="text" id="name" name="name" placeholder="Nama Anda" required class="input" />
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" placeholder="you@example.com" required class="input" />
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" placeholder="••••••••" required minlength="8" class="input" />
          </div>

          <button type="submit" class="btn">Daftar</button>
        </form>
      </section>
    `;
  },

  async afterRender() {

    const main = document.getElementById('main-content');
    if (main) {
      main.focus();
    }
    
    const form = document.getElementById('register-form');

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.name.value;
      const email = form.email.value;
      const password = form.password.value;

      RegisterPresenter.register({
        name,
        email,
        password,
        onSuccess: () => {
          alert('Pendaftaran berhasil! Silakan login.');
          window.location.hash = '/login';
        },
        onError: (message) => {
          alert(message);
        }
      });
    });
  }
};

export default RegisterView;
