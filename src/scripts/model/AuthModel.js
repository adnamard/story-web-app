const AuthModel = {
    async register({ name, email, password }) {
      try {
        const response = await fetch('https://story-api.dicoding.dev/v1/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        });
  
        const result = await response.json();
        return result;
      } 
      catch (error) {
        console.error('Register error:', error);
        return {
          error: true,
          message: 'Terjadi kesalahan jaringan.',
        };
      }
    },
  
    async login({ email, password }) {
      try {
        const response = await fetch('https://story-api.dicoding.dev/v1/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
  
        const result = await response.json();
        return result;
      } catch (error) {
        console.error('Login error:', error);
        return {
          error: true,
          message: 'Terjadi kesalahan jaringan.',
        };
      }
    },
  
    getToken() {
        return localStorage.getItem('token');
      },
      
  };
  
  export default AuthModel;
  