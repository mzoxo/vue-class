export default {
  props: ['page', 'getProducts'],
  template: `<nav aria-label="Page navigation">
    <ul class="pagination">
      <li class="page-item" :class="{'disabled':!page.has_pre}"><a class="page-link" href="#" @click.prevent="$emit('change-page',page.current_page-1)">&laquo;</a></li>
      <li class="page-item" v-for="inx in page.total_pages" :key="'page' + inx" :class="{'active':page.current_page === inx}"><a class="page-link" href="#" @click.prevent="$emit('change-page',inx)">{{ inx }}</a></li>
      <li class="page-item" :class="{'disabled':!page.has_next}"><a class="page-link" href="#" @click.prevent="$emit('change-page',page.current_page+1)">&raquo;</a></li>
    </ul>
  </nav>`
};
