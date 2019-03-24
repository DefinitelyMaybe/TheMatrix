Vue.component("form-function", {
  props: {
    initData: Object,
  },
  data: function () {
    return {
      mathq: '',
      name: "f",
      latex: "x+1",
      importFunc: false
    }
  },
  created: function () {
    if (this.initData) {
      this.name = this.initData.name
      this.latex = this.initData.latex
    }
  },
  mounted () {
    // the MQ variable is defined in main.js and is equal to: MathQuill.getInterface(2);
    // TODO: this is throwing the two error messages at the start. Why?
    this.mathq =  MQ.MathField(this.$refs.quillspan, {
      handlers: {
        edit: this.spanEdit
      }
    })
    this.mathq.latex(this.latex)
  },
  methods: {
    //form specific
    finishForm: function () {
      let obj = Object.assign({}, this.initData)
      obj.name = this.name
      obj.latex = this.latex

      this.$parent.finishForm(obj)
    },
    spanEdit: function () {
      this.latex = this.mathq.latex()
    }
  },
  template: `<form onsubmit="return false">
  <label>Name:</label>
  <input type="text" v-model="name"></input><br>
  <label>Import latex</label>
  <input type="checkbox" v-model="importFunc" v-on:click="importFunc = !importFunc"></input><br>
  <template v-if="importFunc">
    <i>paste latex into textbox</i><br>
    <textarea v-model="latex"></textarea>
  </template>
  <label v-show="!importFunc">Function:</label>
  <span ref="quillspan" v-show="!importFunc" v-bind:class="{formQuill: true}"></span><br v-show="!importFunc">
  <button v-on:click="finishForm">Finish</button>
</form>`,
})