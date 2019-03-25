Vue.component("object-table", {
  mixins: [mixin_moveable, mixin_contextmenu],
  props: {
    initData: Object,
    selected: Boolean
  },
  data: function () {
    return {
      // some default settings
      inputHeaders: ['x'],
      inputTable: [[1], [2], [3], [4], [5]],
      outputHeaders: ['?'],
      outputTable: [['?'], ['?'], ['?'], ['?'], ['?']],
    }
  },
  created: function () {
    if (this.initData) {
      //console.log(this.initData);
      this.inputHeaders = this.initData.inputHeaders
      this.outputHeaders = this.initData.outputHeaders
      this.inputTable = this.initData.inputTable
      this.outputTable = this.initData.outputTable
    }
    this.evaluateAllRows()
  },
  methods: {
    deleteObject: function () {
      this.$root.deleteObjByID(this.$attrs.id)
    },
    save: function () {
      return {
        "inputHeaders": this.inputHeaders,
        "inputTable": this.inputTable,
        "outputHeaders": this.outputHeaders,
        "outputTable": this.outputTable,
        "position": [this.objStyle.left, this.objStyle.top],
        "type": 'object-table',
        "id": this.$attrs.id
      }
    },
    edit: function () {
      if (this.selected) {
        this.$root.editObject(this.$attrs.id)
      } else {
        this.onClick(event)
      }
    },
    evaluateAllRows: function () {
      let newOutputTable = []
      for (let row = 0; row < this.inputTable.length; row++) {
        // First get the whole scenes scope object
        let scope = this.$root.getGlobalScope()

        // Override the scope values with the ones from the table
        for (let i = 0; i < this.inputHeaders.length; i++) {
          scope[this.inputHeaders[i]] = this.inputTable[row][i]
        }
        
        // create the output row
        let newRow = []
        // For each output function
        for (let i = 0; i < this.outputHeaders.length; i++) {
          // Get the eval result from the corresponding function
          let result = this.$root.getFunctionEval(this.outputHeaders[i], scope)
          if (result) {
            newRow.push(result)
          } else {
            newRow.push('?')
          }
        }
        newOutputTable.push(newRow)
      }
      this.outputTable = []
      for (let i = 0; i < newOutputTable.length; i++) {
        this.outputTable.push(newOutputTable[i]) 
      }
    },
    onRightClick: function () {
      this.$root.selectObj(this.$attrs.id)
      this.contextMenuStyle.left = `${event.layerX}px`
      this.contextMenuStyle.top = `${event.layerY}px`
      this.showContextMenu = true
      this.editing = false
    }
  },
  template: `<div draggable="true"
  v-on:dragend="onDragEnd"
  v-on:dragstart="onDragStart"
  v-on:click.prevent="onClick"
  v-on:contextmenu.prevent="onRightClick"
  v-bind:class="{ tableContainer: true, selected: selected}"
  v-bind:style="objStyle">
    <table v-bind:class="{ table: true}">
      <tr>
        <th v-for="(value, index) in inputHeaders"
        v-bind:key="index"
        v-on:click="changeHeader(index, 'input')">{{ value }}</th>
      </tr>
      <tr v-for="(value, row) in inputTable"
      v-bind:key="row">
        <td v-for="(item, col) in value"
        v-bind:key="col">{{item}}</td>
      </tr>
    </table>
    <p>:</p>
    <table v-bind:class="{ table: true}">
    <tr>
      <th v-for="(value, index) in outputHeaders"
      v-bind:key="index"
      v-on:click="changeHeader(index, 'output')">{{ value }}</th>
    </tr>
    <tr v-for="(value, index) in outputTable"
    v-bind:key="index">
      <td v-for="(item, jndex) in value"
      v-bind:key="jndex">{{item}}</td>
    </tr>
    </table>
    <ol v-on:contextmenu.prevent="0"
    v-bind:class="{menu: true}"
    v-show="showContextMenu && selected"
    v-bind:style="contextMenuStyle">
      <li v-on:click="edit" v-bind:class="{menu:true}">Edit</li>
      <li v-on:click="deleteObject" v-bind:class="{menu: true}">Delete</li>
    </ol>
  </div>`,
})