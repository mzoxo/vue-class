import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
let productModal = null;
let delProductModal = null;
const app = {
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io/v2',
      apiPath: 'zoxoz',
      productLoading: false,
      productList: [],
      productData: {
        imagesUrl: []
      },
      productStatus: null
    };
  },
  mounted() {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, '$1');
    axios.defaults.headers.common['Authorization'] = token;

    productModal = new bootstrap.Modal('#productModal', {
      keyboard: false
    });

    delProductModal = new bootstrap.Modal('#delProductModal', {
      keyboard: false
    });

    this.checkAdmin();
  },
  methods: {
    checkAdmin() {
      axios
        .post(`${this.apiUrl}/api/user/check`)
        .then(() => {
          this.getProducts();
        })
        .catch((err) => {
          alert(err.data.message);
          window.location = 'login.html';
        });
    },
    getProducts() {
      this.productLoading = true;
      axios
        .get(`${this.apiUrl}/api/${this.apiPath}/admin/products`)
        .then((res) => {
          this.productList = res.data.products;
          this.productLoading = false;
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
    updateProduct() {
      // 去空字串
      this.productData.imagesUrl ? this.productData.imagesUrl.filter((el) => el) : '';
      const method = this.productStatus === 'new' ? 'post' : 'put';
      const url =
        this.productStatus === 'new'
          ? `${this.apiUrl}/api/${this.apiPath}/admin/product`
          : `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.productData.id}`;
      axios[method](url, { data: this.productData })
        .then((res) => {
          alert(res.data.message);
          productModal.hide();
          this.getProducts();
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
    delProduct() {
      axios
        .delete(`${this.apiUrl}/api/${this.apiPath}/admin/product/${this.productData.id}`)
        .then((res) => {
          alert(res.data.message);
          delProductModal.hide();
          this.getProducts();
        })
        .catch((err) => {
          alert(err.data.message);
          delProductModal.hide();
        });
    },
    openModel(type, product) {
      this.productStatus = type;
      if (type === 'new') {
        this.productData = {
          imagesUrl: []
        };
        productModal.show();
      } else if (type === 'edit') {
        this.productData = { ...product };
        productModal.show();
      } else if (type === 'delete') {
        this.productData = { ...product };
        delProductModal.show();
      }
    },
    createImage() {
      this.productData.imagesUrl = [];
      this.productData.imagesUrl.push('');
    }
  }
};
createApp(app).mount('#app');
