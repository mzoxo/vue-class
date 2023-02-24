const { createApp } = Vue;
const { defineRule, Form, Field, ErrorMessage, configure } = VeeValidate;
const { required, email } = VeeValidateRules;
const { localize, loadLocaleFromURL } = VeeValidateI18n;

const apiUrl = 'https://vue3-course-api.hexschool.io/v2/api';
const apiPath = 'zoxoz';

defineRule('required', required);
defineRule('email', email);
defineRule('isPhone', (value) => {
  const phoneNumber = /^(09)[0-9]{8}$/;
  return phoneNumber.test(value) ? true : '請填入正確的手機號碼';
});

loadLocaleFromURL('https://unpkg.com/@vee-validate/i18n@4.1.0/dist/locale/zh_TW.json');

configure({
  generateMessage: localize('zh_TW')
});

const productModal = {
  template: '#userProductModal',
  data() {
    return {
      modal: {},
      tempProduct: {},
      qty: 1
    };
  },
  props: ['id', 'addToCart', 'openModal', 'loading'],
  mounted() {
    this.modal = new bootstrap.Modal(this.$refs.modal);
    this.$refs.modal.addEventListener('hidden.bs.modal', (event) => {
      this.openModal('');
    });
  },
  methods: {
    getProductItem() {
      axios
        .get(`${apiUrl}/${apiPath}/product/${this.id}`)
        .then((res) => {
          this.tempProduct = res.data.product;
          this.modal.show();
        })
        .catch((err) => {
          console.log(err.data.message);
        });
    },
    hide() {
      this.modal.hide();
    }
  },
  watch: {
    id() {
      if (this.id) {
        this.getProductItem();
      }
    }
  }
};

const app = createApp({
  data() {
    return {
      productList: [],
      productId: '',
      cart: {
        carts: [],
        final_total: 0,
        total: 0
      },
      loadingItem: '',
      loadingAddToCart: false,
      loadingSubmit: false,
      loadingDelCart: false,
      form: {
        user: {
          name: '',
          email: '',
          tel: '',
          address: ''
        },
        message: ''
      },
      isLoading: true
    };
  },
  components: {
    productModal,
    VForm: Form,
    VField: Field,
    ErrorMessage: ErrorMessage,
    loading: VueLoading.Component
  },
  mounted() {
    this.getProductList();
    this.getCartList();
  },
  methods: {
    getProductList() {
      axios
        .get(`${apiUrl}/${apiPath}/products/all`)
        .then((res) => {
          this.productList = res.data.products;
          this.isLoading = false;
        })
        .catch((err) => {
          console.log(err.data.message);
        });
    },
    openModal(id) {
      this.productId = id;
    },
    addToCart(product_id, qty = 1) {
      this.loadingAddToCart = true;
      const data = {
        product_id,
        qty
      };
      axios
        .post(`${apiUrl}/${apiPath}/cart`, { data })
        .then((res) => {
          this.$refs.productModal.hide();
          this.getCartList();
          this.loadingAddToCart = false;
        })
        .catch((err) => {
          console.log(err.data.message);
        });
    },
    getCartList() {
      axios
        .get(`${apiUrl}/${apiPath}/cart`)
        .then((res) => {
          this.cart = res.data.data;
        })
        .catch((err) => {
          console.log(err.data.message);
        });
    },
    updateCartItem(cart) {
      const data = {
        product_id: cart.product_id,
        qty: cart.qty
      };
      this.loadingItem = cart.id;
      axios
        .put(`${apiUrl}/${apiPath}/cart/${cart.id}`, { data })
        .then((res) => {
          this.getCartList();
          this.loadingItem = '';
        })
        .catch((err) => {
          console.log(err.data.message);
        });
    },
    deleteCartItem(id) {
      this.loadingItem = id;
      axios
        .delete(`${apiUrl}/${apiPath}/cart/${id}`)
        .then((res) => {
          this.getCartList();
          this.loadingItem = '';
        })
        .catch((err) => {
          console.log(err.data.message);
        });
    },
    deleteAllCartItem() {
      this.loadingDelCart = true;
      axios
        .delete(`${apiUrl}/${apiPath}/carts`)
        .then((res) => {
          this.getCartList();
          this.loadingDelCart = false;
        })
        .catch((err) => {
          console.log(err.data.message);
        });
    },
    createOrder() {
      if (this.cart.carts.length == 0) {
        alert('請將商品放入購物車後才能結帳唷！');
        return;
      }
      this.loadingSubmit = true;
      const data = this.form;
      axios
        .post(`${apiUrl}/${apiPath}/order`, { data })
        .then((res) => {
          alert('訂單送出成功！');
          this.getCartList();
          this.loadingSubmit = false;
        })
        .catch((err) => {
          console.log(err.data.message);
        });
    }
  }
});
app.mount('#app');
