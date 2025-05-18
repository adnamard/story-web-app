import AuthModel from '../model/AuthModel';

const RegisterPresenter = {
  async register({ name, email, password, onSuccess, onError }) {
    const result = await AuthModel.register({ name, email, password });

    if (!result.error) {
      onSuccess();
    } else {
      onError(`Gagal daftar: ${result.message}`);
    }
  }
};

export default RegisterPresenter;
