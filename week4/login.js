import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
const app = {
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io/v2',
      form: {
        username: '',
        password: ''
      }
    };
  },
  methods: {
    login() {
      axios
        .post(`${this.apiUrl}/admin/signin`, this.form)
        .then((res) => {
          // 儲存 token 至 cookie
          const { token, expired } = res.data;
          document.cookie = `hexToken=${token}; expires=${new Date(expired)};`;
          window.location = './product.html';
        })
        .catch((err) => {
          alert(err.data.message);
        });
    }
  }
};

createApp(app).mount('#app');
