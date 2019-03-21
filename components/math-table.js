Vue.component("math-table", {
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

      editing: false
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
        "type": 'math-table',
        "id": this.$attrs.id
      }
    },
    edit: function () {
      if (this.selected) {
        this.editing = true
      } else {
        this.onClick(event)
      }
    },
    evaluateAllRows: function () {
      for (let row = 0; row < this.inputTable.length; row++) {
        // First get the whole scenes scope object
        let scope = this.$root.getGlobalScope()

        // Override the scope values with the ones from the table
        for (let i = 0; i < this.inputHeaders.length; i++) {
          scope[this.inputHeaders[i]] = this.inputTable[row][i]
        }
        
        // For each output function
        for (let i = 0; i < this.outputHeaders.length; i++) {
          // Get the eval result from the corresponding function
          let result = this.$root.getFunctionEval(this.outputHeaders[i], scope)
          if (result) {
            let newRow = this.outputTable[row]
            newRow.splice(i, 1, result)
            this.outputTable.splice(row, 1, newRow)
          } else {
            let newRow = this.outputTable[row]
            newRow.splice(i, 1, '?')
            this.outputTable.splice(row, 1, newRow)
          }
        }
      }
    },
    changeHeader: function (index, type) {
      // select the table before getting tableInput from user
      if (this.selected) {
        switch (type) {
          case 'input':
            {
              let newHeader = prompt("Change the header?", this.inputHeaders[index])
              this.inputHeaders.splice(index, 1, newHeader)
            }
            break;
          case 'output':
            {
              let newHeader = prompt("Change the header?", this.outputHeaders[index])
              if (newHeader) {
                this.outputHeaders.splice(index, 1, newHeader)
                this.$root.updateTablesWithSymbol(newHeader) 
              }
            }
            break;
          default:
            {
              console.log("Default case of changeHeader method");
            }
            break;
        } 
      } else {
        this.onClick(event)
      }
    },
    changeInput: function (pos) {
      //console.log("trying to change an input");
      // select the table before getting input from user
      if (this.selected) {
        //console.log(pos);
        let row = pos[0]
        let col = pos[1]
        let userInput = prompt("Change the input?", this.inputTable[row][col])
        try {
          let newValue = parseFloat(userInput)
          // update the array
          let newRow = this.inputTable[row]
          newRow.splice(col, 1, newValue)
          this.inputTable.splice(row, 1, newRow)
          // this is the weirdest looking piece of code ever but...
          // this is how you invoke the setter function of the computed property
          this.functionsOutput = row // this throws an error
        } catch (error) {
          // check back here later. this output didn't seem to ever be invoked.
          console.warn("For the moment, inputs must be numbers.");
          console.warn(error);
        }
      } else {
        this.onClick(event)
      }
    },
    removeInputColumn: function (index) {
      if (this.inputHeaders.length > 1) {
        this.inputHeaders.splice(index, 1)
        for (let i = 0; i < this.inputTable.length; i++) {
          this.inputTable[i].splice(index, 1)
        }
      } else {
        console.warn('Not removing column because table is too small');
      }
    },
    removeOutputColumn: function (index) {
      if (this.outputHeaders.length > 1) {
        this.outputHeaders.splice(index, 1)
        for (let i = 0; i < this.outputTable.length; i++) {
          this.outputTable[i].splice(index, 1)
        } 
      } else {
        console.warn('Not removing column because table is too small');
      }
    },
    addToTable: function (arg) {
      switch (arg) {
        case 'input':
          {
            // get the data for the currently selected table
            this.inputHeaders.push('x')
            // then we'll add in some default values to the table
            for (let i = 0; i < this.inputTable.length; i++) {
              this.inputTable[i].push(i);
            }
          }
          break;
        case 'output':
          {
            this.outputHeaders.push('?')
            // then we'll add in some default values to the table
            for (let i = 0; i < this.inputTable.length; i++) {
              this.outputTable[i].push("?");
            }
          }
          break;
        case 'row':
          {
            console.log("Add row to tables");
          }
          break;
        default:
          break;
      }
      // in all cases close the context menu
      this.showContextMenu = false
    },
    removeFromTable: function (arg) {
      switch (arg) {
        case 'row':
          {
            //console.log("Remove row from table");
            let rowX = prompt("Which row would you like to delete", '1')
            if (rowX) {
              try {
                let intX = parseInt(rowX)
                if (intX == rowX) {
                  intX -= 1 // someone would say delete the 1st row,
                  // not delete the 0th row. A small difference between maths and programming
                  if (this.inputTable.length > 1) {
                    this.inputTable.splice(intX, 1)
                    this.outputTable.splice(intX, 1)
                  } else {
                    console.warn('Not removing row because table is too small');
                  }
                }
              } catch (error) {
                console.warn("Could parseInt because...");
                console.warn(error);
              }
            }
          }
          break;
        case 'inputcolumn':
          {
            //console.log("Remove column from table");
            let colX = prompt("What number column would you like to delete", '1')
            if (colX) {
              let intX = parseInt(colX)
              if (intX == colX) {
                this.removeInputColumn(intX - 1)
              }
            }
          }
          break;
        case 'outputcolumn':
          {
            //console.log("Remove column from table");
            let colX = prompt("What number column would you like to delete", '1')
            if (colX) {
              let intX = parseInt(colX)
              if (intX == colX) {
                this.removeOutputColumn(intX - 1)
              }
            }
          }
          break;
        default:
          break;
      }
      // in all cases close the context menu
      this.showContextMenu = false
    },
    finishForm: function (args) {
      this.editing = false
      this.inputHeaders = args.inputHeaders 
      this.outputHeaders = args.outputHeaders
      this.inputTable = args.inputTable
      this.outputTable = args.outputTable
      this.evaluateAllRows()
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
        v-bind:key="col"
        v-on:click="changeInput([row, col])">{{item}}</td>
      </tr>
    </table>
    <p>:</p>
    <table v-bind:class="{ table: true}">
    <tr>
      <th v-for="(value, index) in outputHeaders"
      v-bind:key="index"
      v-on:click="changeHeader(index, 'output')">{{ value }}</th>
    </tr>
    <tr v-for="(value, row) in outputTable"
    v-bind:key="row">
      <td v-for="(item, col) in value"
      v-bind:key="col">{{item}}</td>
    </tr>
    </table>
    <ol v-on:contextmenu.prevent="0"
    v-bind:class="{menu: true}"
    v-show="showContextMenu && selected"
    v-bind:style="contextMenuStyle">
      <li v-on:click="edit" v-bind:class="{menu:true}">Edit</li>
      <li v-on:click="deleteObject" v-bind:class="{menu: true}">Delete</li>
    </ol>
    <component v-bind:is="'form-table'"
      v-bind:class="{CreateForm:true}"
      v-if="editing && selected"
      v-bind:initData="{inputHeaders:inputHeaders,outputHeaders:outputHeaders, inputTable:inputTable, outputTable:outputTable}"
      v-bind:style="{position:'absolute', left:contextMenuStyle.left, top:contextMenuStyle.top}"></component>
  </div>`,
})