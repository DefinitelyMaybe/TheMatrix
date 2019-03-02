Vue.component("form-function", {
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
      //console.log(this.initData);
      this.formData = this.initData.formData
      this.styleObj.left = this.initData.position[0]
      this.styleObj.top = this.initData.position[1]
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
      this.$parent.finishForm({
        name: this.name,
        latex: this.latex
      })
    },
    spanEdit: function () {
      this.latex = this.mathq.latex()
    }
  },
  template: `<form onsubmit="return false">
  <label>Name:</label>
  <input type="text" v-model="name"></input><br>
  <label v-show="!importFunc">Function:</label>
  <span ref="quillspan"
  v-bind:class="{formQuill: true}"
  v-show="!importFunc"></span><br v-show="!importFunc">
  <label>Import latex</label>
  <input type="checkbox" v-model="importFunc"></input><br>
  <template v-if="importFunc">
    <textarea v-model="latex"></textarea>
  </template><br>
  <button v-on:click="finishForm">Finish</button>
</form>`,
})