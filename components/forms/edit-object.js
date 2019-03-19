Vue.component("edit-object", {
  mixins: [mixin_moveable],
  props: {
    initData: Object,
    selected: Boolean
  },
  data: function () {
    return {
      type: "Function",
      data: {}
    }
  },
  created() {
    if (this.initData) {
      this.data = this.initData
    }
  },
  methods: {
    //form specific
    subform: function (name) {
      switch (name) {
        case 'Variable':
          return 'form-variable'
        case 'Graph':
          return 'form-graph'
        case 'Table':
          return 'form-table'
        case 'Text':
          return 'form-text'
        default:
          return 'form-function'
      }
    },
    finishForm: function (args) {
      //console.log(args);
      switch (this.type) {
        case 'Variable':
          this.$root.createObj({
            type: "math-variable",
            position: [this.objStyle.left, this.objStyle.top],
            value: args.value
          })
          break
        case 'Graph':
          this.$root.createObj({
            type: "math-graph",
            position: [this.objStyle.left, this.objStyle.top],
            xaxis: args.xaxis,
            yaxis: args.yaxis,
            xrange: args.xrange,
            yrange: args.yrange,
          })
          break
        case 'Table':
          this.$root.createObj({
            type: "math-table",
            position: [this.objStyle.left, this.objStyle.top],
            inputHeaders: this.inputHeaders,
            inputTable: this.inputTable,
            outputHeaders: this.outputHeaders,
            outputTable: this.outputTable
          })
          break
        case 'Text':
          this.$root.createObj({
            type: "base-text",
            position: [this.objStyle.left, this.objStyle.top],
          })
          break
        default:
          // default case is Function
          this.$root.createObj({
            type: 'math-function',
            position: [this.objStyle.left, this.objStyle.top],
            name: args.name,
            latex: args.latex
          })
          break
      }
      this.$root.deleteObjByID(this.$attrs.id)
    }
  },
  template: `<div draggable="true"
  v-on:dragend="onDragEnd"
  v-on:dragstart="onDragStart"

  v-bind:class="{CreateForm:true}"
  v-bind:style="objStyle">
  <component v-bind:is="subform(type)" v-bind:initData="initData"></component>
</div>`,
})