import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
const app = {
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io/v2',
      apiPath: 'zoxoz',
      products: [],
      tempProduct: {}
    };
  },
  mounted() {
    // 取出 Token
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, '$1');
    axios.defaults.headers.common['Authorization'] = token;
    this.checkAdmin();
  },
  methods: {
    checkAdmin() {
      axios
        .post(`${this.apiUrl}/api/user/check`)
        .then(() => {
          this.getProductList();
        })
        .catch((err) => {
          alert(err.data.message);
          window.location = './login.html';
        });
    },
    getProductList() {
      axios
        .get(`${this.apiUrl}/api/${this.apiPath}/admin/products`)
        .then((res) => {
          this.products = res.data.products;
        })
        .catch((err) => {
          alert(err.data.message);
        });
    }
  }
};
createApp(app).mount('#app');
