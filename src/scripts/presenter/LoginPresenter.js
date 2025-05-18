import AuthModel from '../model/AuthModel';

const LoginPresenter = {
  async login({ email, password, onSuccess, onError }) {
    try {
      const result = await AuthModel.login({ email, password });

      if (!result.error) {
        localStorage.setItem('token', result.loginResult.token);
        onSuccess(); 
      } else {
        onError(result.message || 'Login gagal.');
      }
    } catch (err) {
      console.error('[Login Error]', err);
      onError('Terjadi kesalahan saat login.');
    }
  },
};

export default LoginPresenter;
