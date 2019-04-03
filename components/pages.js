Vue.component("main-pages", {
  props: {
    initData: Object,
  },
  data: function () {
    return {
      pages: [
        {
          "name": "some page"
        }
      ]
    }
  },
  created() {
    if (this.initData) {
      console.log(this.initData);
      this.pages = this.initData.pages
    }
  },
  methods: {
    //form specific
    loadPage: function (page) {
      console.log("Not Yet Implemented");
    }
  },
  template: `<footer>
  <button v-for="(page, index) in pages" v-bind:key="index" v-on:click="loadPage(index)">{{page.name}}</button>
</footer>`,
})