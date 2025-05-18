const NotFoundView = {
    async render() {
      return `
        <section class="content">
          <h2 class="section-title">404 - Halaman Tidak Ditemukan</h2>
          <p>Maaf, halaman yang kamu cari tidak tersedia.</p>
        </section>
      `;
    },
  
    async afterRender() {
      // Tidak perlu interaksi untuk halaman ini
    },
  };
  
  export default NotFoundView;
  