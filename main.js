// Global Scripts
// mathjs - http://mathjs.org/
// plotly - https://plot.ly/javascript/
// mathquill - http://mathquill.com/ (requires JQuery)
// lodash - https://lodash.com/ make js great again.


// global varibles
// Have a look at whats in the html file and then in the data folder.
const MQ = MathQuill.getInterface(2);

const TheMatrix = new Vue({
  el: '#VueContainer',
  data: {    
    nextID: 0, // The next ID to be used if there are no freeobjectIDs left
    freeObjectID: [], // if an object is ever removed. its id is added here
    selectedObj: '', // The id of the currently selected object
    initObjects: [], // An array of objects which describe initialized objects

    // maths globals
    globalScope: {},

    // Style and misc data
    showContextMenu: false,
    styleObj: {
      width: '100%',
      height: '100%'
    },
    contextMenuStyle: {
      position: 'absolute',
      width: '175px',
      left: '0px',
      top: '0px'
    },
  },
  created: function () {
    // for the moment we're going to manually bring our scene ids up to speed with the loaded scene
    let x = 0
    for (let i = 0; i < DATA_objects.length; i++) {
      this.createObj(DATA_objects[i])
      x += 1
    }
    this.nextID = x
    //console.log(x);
    //console.log(this.nextID);
  },
  methods: {
    // Organizing the scene
    getNewObjectID: function () {
      let id = this.freeObjectID.pop()
      if (id == undefined) {
        id = this.nextID
        this.nextID += 1
      }
      return id.toString()
    },
    getObjectByID: function (id) {
      for (let i = 0; i < this.initObjects.length; i++) {
        if (this.initObjects[i].id == id) {
          return [this.initObjects[i], i]
        }
      }
    },
    getVueObjectbyID: function (id) {
      for (let i = 0; i < this.$children.length; i++) {
        if (this.$children[i].$attrs.id == id) {
          return this.$children[i]
        }
      }
    },
    getAllObjectsOfType: function (type) {
      let x = []
      for (let i = 0; i < this.$children.length; i++) {
        //console.log(this.$children[i]);
        if (this.$children[i].$attrs.type == type) {
          x.push(this.$children[i])
        }
      }
      return x
    },
    createObj: function (options) {
      //console.log("creating an object");
      //console.log(options);
      switch (options.type) {
        case 'math-matrix':
        {
          this.initObjects.push({
            id: options.id || this.getNewObjectID(),
            type: options.type,
            position: options.position,
            entries: options.entries
          })
          break;
        }
        case 'math-function':
        {
          this.initObjects.push({
            id: options.id || this.getNewObjectID(),
            type: options.type,
            position: options.position,
            name: options.name,
            latex: options.latex
          })
          break;
        }
        case 'math-variable':
        {
          this.initObjects.push({
            id: options.id || this.getNewObjectID(),
            type: options.type,
            position: options.position,
            name: options.name || 'x',
            valueType: options.valueType || 'number',
            value: options.value || 0
          })
          if (options.name) {
            if (options.value) {
              this.updateGlobalScope(options.name, options.value)
            } else {
              this.updateGlobalScope(options.name, 0)
            }
          } else {
            this.updateGlobalScope('x', 0)
          }
          break;
        }
        case 'base-text':
        {
          this.initObjects.push({
            id: options.id || this.getNewObjectID(),
            type: options.type,
            position: options.position,
            width: options.width,
            height: options.height,
            value: options.value || ''
          })
          break;
        }
        case 'math-table':
        {
          this.initObjects.push({
            id: options.id || this.getNewObjectID(),
            type: options.type,
            position: options.position,
            inputHeaders: options.inputHeaders || ['x'],
            inputTable: options.inputTable || [[1],[2],[3],[4],[5]],
            outputHeaders: options.outputHeaders || ['?'],
            outputTable: options.outputTable || [['?'], ['?'], ['?'], ['?'], ['?']]
          })
          break;
        }
        case 'math-graph':
        {
          this.initObjects.push({
            id: options.id || this.getNewObjectID(),
            type: options.type,
            position: options.position,
            width: options.width,
            height: options.height,
            xaxis: options.xaxis,
            yaxis: options.yaxis,
            xrange: options.xrange || [-10, 10],
            yrange: options.yrange || [-10, 10],
          })
          break;
        }
        case 'form-create':
        {
          this.initObjects.push({
            id: options.id || this.getNewObjectID(),
            type: options.type,
            position: options.position
          })
          break;
        }
        default:
          console.warn("The default creation case hasn't created anything with:");
          console.log(options);
          break;
      }
    },
    userCreateObj: function (event) {
      this.createObj({
        type: 'form-create',
        position:[`${event.x}px`, `${event.y}px`]
      })
      // we're assuming the function was called from a context menu
      this.showContextMenu = false
    },
    deleteCurrentObj: function () {
      // We can assume that selectedObj has the obj id we want to delete
      // Also the while loop was just the first way I thought of doing it.
      // Using a for loop is also an option.
      //console.log("delete function");
      let newObjs = []
      while (this.initObjects.length > 0) {
        let x = this.initObjects.pop()
        if (x.id != this.selectedObj) {
          newObjs.push(x)
        } else {
          // because we've found the obj that we want to del
          // we must add its index to free indices.
          // this is so we can guarantee that all object ids are unquie
          //console.log(x.id);
          this.freeObjectID.push(x.id)
        }
      }
      this.initObjects = newObjs
      // and we must close the context menu once the operation finishes
      this.showContextMenu = false
    },
    deleteObjByID: function (id) {
      let x = this.getObjectByID(id)
      //console.log(x);
      this.initObjects.splice(x[1], 1)

      // and we must close the context menu once the operation finishes
      this.showContextMenu = false
    },
    deleteAllObjects: function () {
      // if all initObjects are being deleted we can reset the unique ids
      this.initObjects.splice(0, this.initObjects.length, [])
      this.nextID = 0
      this.freeObjectID = []
    },
    toJSON: function () {
      let output = []
      for (let i = 0; i < this.$children.length; i++) {
        let x = this.$children[i].toObject()
        output.push(x)
      }
      return JSON.stringify(output)
    },

    // events
    selectObj: function (id) {
      // if we just selected an obj, make sure we close the context menu
      this.showContextMenu = false
      //console.log("select obj function called");
      //console.log(id);
      this.selectedObj = id
    },
    onClick: function () {
      this.selectObj('')
      this.showContextMenu = false
    },
    onRightClick: function (event) {
      this.selectObj('')
      //console.log(event);
      this.contextMenuStyle.left = `${event.layerX}px`
      this.contextMenuStyle.top = `${event.layerY}px`
      this.showContextMenu = true
    },
    dropData: function (id, updateObj) {
      //console.log("dropData called.");
      //console.log(id, updateObj);
      // creating the new one first so it has a different ID
      this.createObj(updateObj)

      this.deleteCurrentObj()
      this.selectedObj = null

      // first update the object that was just dropped on
      this.deleteObjByID(id)
    },
    onLoad: function () {
      this.showContextMenu = false
      let x = prompt("what would you like to load in? Type on of the following:\nscene\nobject")
      let y = prompt("paste all of the JSON data here:")
      switch (x) {
        case 'scene':
          {
            try {
              let z = JSON.parse(y)
              this.deleteAllObjects()
              for (let i = 0; i < z.length; i++) {
                this.createObj(z[i]);
              }
            } catch (error) {
              console.log("couldn't manage to parse the data because:");
              console.log(error);
            }
          }
          break;
        case 'object':
          {
            console.log('WIP');
          }
          break;
        default:
          console.log("Sorry, wasn't sure what you wanted to load in.");
          break;
      }
    },
    saveObjects: function () {
      console.log(`Copy the following into the Load function:\n${this.toJSON()}`)
      this.showContextMenu = false
    },

    // Helper functions for maths
    getFunctionString: function (symbol) {
      //console.log(symbol);
      // the idea here is to match the symbol to a function and return the function string
      let x = this.getAllObjectsOfType('math-function')
      for (let i = 0; i < x.length; i++) {
        if (x[i].name == symbol) {
          return x[i].expression
        }
      }
    },
    updateAllTables: function () {
      let tables = this.getAllObjectsOfType("math-table")
      for (let i = 0; i < tables.length; i++) {
        tables[i].evaluateAllRows()
      }
    },
    updateTablesWithSymbol: function (symbol) {
      //console.log(`updating tables with: ${symbol}`);
      let tables = this.getAllObjectsOfType("math-table")
      for (let i = 0; i < tables.length; i++) {
        // first does the table have the symbol
        if (tables[i].outputHeaders.includes(symbol)) {
          // if we did find it then we can call evaluate
          tables[i].evaluateAllRows()
        }
      }
    },
    updateGraphsWithSymbol: function (symbol) {
      //console.log(`updating graphs with: ${symbol}`);
      let graphs = this.getAllObjectsOfType("math-graph")
      for (let i = 0; i < graphs.length; i++) {
        // first does the table have the symbol
        if (graphs[i].layout.yaxis.title == symbol || graphs[i].layout.yaxis.title.text == symbol) {
          // if we did find it then we can call evaluate
          graphs[i].update()
        }
      }
    },
    removeFromGlobalScope: function (symbol) {
      delete this.globalScope[symbol]
    },
    updateGlobalScope: function (symbol, value) {
      //console.log(`updating global scope with: (${symbol}, ${value})`);
      this.globalScope[symbol] = value
      // There is a better way to do this
      // however for the moment, when a symbol is updated
      // We will update every table
      this.updateAllTables()
      this.updateAllGraphs()
    },
    getGlobalScope: function () {
      return Object.assign({}, this.globalScope)
    },
    updateAllGraphs: function() {
      let graphs = this.getAllObjectsOfType('math-graph')
      for (let i = 0; i < graphs.length; i++) {
        graphs[i].update()
      }
    }
  },
  template: `<div ondragover="event.preventDefault()"
v-on:click.self.prevent="selectObj('')"
v-on:contextmenu.self.prevent="onRightClick"
v-bind:style="styleObj">
  <component v-for="(obj, key) in initObjects"
  v-bind:key="obj.id"
  v-bind:id="obj.id"
  v-bind:initData="obj"
  v-bind:is="obj.type"
  v-bind:type="obj.type"
  v-bind:selected="obj.id === selectedObj">
  </component>
  <ol v-on:contextmenu.prevent="onRightClick"
  v-show="showContextMenu && selectedObj == ''"
  v-bind:style="contextMenuStyle"
  v-bind:class="{menu: true}">
    <li v-on:click="onLoad" v-bind:class="{menu: true}">Load</li>
    <li v-on:click="saveObjects" v-bind:class="{menu: true}">Save</li>
    <li v-on:click="userCreateObj" v-bind:class="{menu: true}">Create</li>
  </ol>
</div>`
})

/*
window.onload = function () {
  console.log(MathQuill);
}
*/
