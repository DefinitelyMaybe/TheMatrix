Vue.component("form-text", {
  methods: {
    //form specific
    finishForm: function () {
      this.$parent.finishForm({})
    }
  },
  template: `<form onsubmit="return false">
  <button v-on:click="finishForm">Finish</button>
</form>`,
})