Vue.component("object-create", {
  mixins: [mixin_moveable],
  props: {
    initData: Object,
    selected: Boolean
  },
  data: function () {
    return {
      type: "Function"
    }
  },
  methods: {
    //form specific
    subform: function (name) {
      switch (name) {
        case 'Function':
          return 'form-function'
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
        {
          this.$root.createObj({
            type: "object-variable",
            position: [this.objStyle.left, this.objStyle.top],
            value: args.value
          })
          break
        }
        case 'Graph':
        {
          this.$root.createObj({
            type: "object-graph",
            position: [this.objStyle.left, this.objStyle.top],
            xaxis: args.xaxis,
            yaxis: args.yaxis,
            xrange: args.xrange,
            yrange: args.yrange
          })
          break
        }
        case 'Table':
        { 
          this.$root.createObj({
            type: "object-table",
            position: [this.objStyle.left, this.objStyle.top],
            inputHeaders: args.inputHeaders,
            inputTable: args.inputTable,
            outputHeaders: args.outputHeaders,
            outputTable: args.outputTable
          })
          break
        }
        case 'Text':
        { 
          this.$root.createObj({
            type: "object-text",
            position: [this.objStyle.left, this.objStyle.top],
          })
          break
        }
        default:
        {
          // default case is Function
          this.$root.createObj({
            type: 'object-function',
            position: [this.objStyle.left, this.objStyle.top],
            name: args.name,
            latex: args.latex
          })
          break
        }
      }
      this.deleteForm()
    },
    deleteForm: function () {
      this.$root.deleteObjByID(this.$attrs.id)
    }
  },
  template: `<div draggable="true"
  v-on:dragend="onDragEnd"
  v-on:dragstart="onDragStart"

  v-bind:class="{CreateForm:true,selected:selected}"
  v-bind:style="objStyle">
  <form onsubmit="return false">
    <label for="object">What would you like to create?</label>
    <select type="text" v-model="type">
      <option v:bind:selected="'Function'==type">Function</option>
      <option v:bind:selected="'Variable'==type">Variable</option>
      <option v:bind:selected="'Graph'==type">Graph</option>
      <option v:bind:selected="'Table'==type">Table</option>
      <option v:bind:selected="'Text'==type">Text</option>
    </select>
    <keep-alive>
      <component v-bind:is="subform(type)"></component>
    </keep-alive>
  </form>
</div>`,
})