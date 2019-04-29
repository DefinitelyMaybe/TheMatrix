const Vue = require('vue')
const DATA_objects = require("./data/maths/dev.js")

require("./components/objects/text.js")
require("./components/objects/function.js")
require("./components/objects/graph.js")
//require("./components/objects/matrix.js")
require("./components/objects/table.js")
require("./components/objects/table-old.js")
require("./components/objects/variable.js")

/*require("./libs/math.js")
require("./libs/vue.js")
require("./libs/plotly.min.js")
require("./libs/JQuery.js")
const MQ = require('./libs/mathquill').getInterface(2);
require("./libs/mathquill.js")

require("./components/mixins/moveable.js")
require("./components/mixins/contextmenu.js")
require("./components/main-menu.js")
require("./components/dialogs/create.js")
require("./components/dialogs/load.js")
require("./components/dialogs/save.js")
require("./components/dialogs/reset.js")
require("./components/edit.js")
require("./components/pages.js")
require("./components/forms/function.js")
require("./components/forms/variable.js")
require("./components/forms/graph.js")
require("./components/forms/table.js")
require("./components/forms/text.js")
*/

const TheMatrix = new Vue({
  el: '#VueContainer',
  //mixins: [mixin_contextmenu],
  data: {
    nextID: 0, // The next ID to be used if there are no freeobjectIDs left
    freeObjectID: [], // if an object is ever removed. its id is added here
    selectedObj: '', // The id of the currently selected object
    sceneObjects: [],

    editing: false,
    editData:{},

    dialog: false,
    currentDialog: "dialog-create",

    // maths globals
    globalScope: {},

    // Style and misc data
    styleObj: {
      background: 'white',
      'flex-grow': 100,
      overflow: 'scroll',
    },
  },
  created: function () {
    for (let i = 0; i < DATA_objects.length; i++) {
      this.createObj(DATA_objects[i])
    }
  },
  methods: {
    // Organizing the scene
    getNewObjectID: function () {
      let id = this.freeObjectID.pop()
      if (id == undefined) {
        id = this.nextID.toString()
        this.nextID += 1
      }
      return id
    },
    getObjectByID: function (id) {
      for (let i = 0; i < this.sceneObjects.length; i++) {
        if (this.sceneObjects[i].id == id) {
          return this.sceneObjects[i]
        }
      }
    },
    getVueObjectbyID: function (id) {
      for (let i = 0; i < this.$children.length; i++) {
        if (this.$children[i].$attrs.id == id) {
          return this.$children[i]
        }
      }
      return undefined
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
      //console.log(options);
      switch (options.type) {
        case 'object-matrix':
        {
          this.sceneObjects.push({
            id: this.getNewObjectID(),
            type: options.type,
            position: options.position,
            entries: options.entries
          })
          break;
        }
        case 'object-function':
        {
          this.sceneObjects.push({
            id: this.getNewObjectID(),
            type: options.type,
            position: options.position,
            name: options.name,
            latex: options.latex
          })
          break;
        }
        case 'object-variable':
        {
          this.sceneObjects.push({
            id: this.getNewObjectID(),
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
        case 'object-text':
        {
          this.sceneObjects.push({
            id: this.getNewObjectID(),
            type: options.type,
            position: options.position,
            width: options.width,
            height: options.height,
            value: options.value || ''
          })
          break;
        }
        case 'object-table':
        {
          this.sceneObjects.push({
            id: this.getNewObjectID(),
            type: options.type,
            position: options.position,
            headers: options.headers || ['x'],
            table: options.table || [[1],[2],[3],[4],[5]]
          })
          break;
        }
        case 'object-function-table':
        {
          this.sceneObjects.push({
            id: this.getNewObjectID(),
            type: options.type,
            position: options.position,
            inputHeaders: options.inputHeaders || ['x'],
            inputTable: options.inputTable || [[1],[2],[3],[4],[5]],
            outputHeaders: options.outputHeaders || ['?'],
            outputTable: options.outputTable || [['?'], ['?'], ['?'], ['?'], ['?']]
          })
          break;
        }
        case 'object-graph':
        {
          this.sceneObjects.push({
            id: this.getNewObjectID(),
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
        default:
          console.warn("The default creation case hasn't created anything with:");
          console.log(options);
          break;
      }
    },
    mainMenu: function (type) {
      this.dialog = true
      switch (type) {
        case "load":
        {
          this.currentDialog = "dialog-load"
          break;
        }
        case "save":
        {
          this.currentDialog = "dialog-save"
          break;
        }
        case "reset":
        {
          this.currentDialog = "dialog-reset"
          break;
        }   
        default:
        {
          this.currentDialog = "dialog-create"
          break;
        }
      }
      // we're assuming the function was called from a context menu
      this.showContextMenu = false
    },
    deleteObjByID: function (id) {
      let x = 0
      for (let i = 0; i < this.sceneObjects.length; i++) {
        if (this.sceneObjects[i].id == id) {
          x = i
        }
      }
      this.sceneObjects.splice(x, 1)
      this.freeObjectID.push(`${x}`)
      this.showContextMenu = false
    },
    deleteAllObjects: function () {
      // if all sceneObjects are being deleted we can reset the unique ids
      this.sceneObjects.splice(0, this.sceneObjects.length, [])
      this.nextID = 0
      this.freeObjectID = []
      this.editing = false
    },
    toJSON: function () {
      let output = []
      for (let i = 0; i < this.$children.length; i++) {
        if (this.$children[i].save) {
          output.push(this.$children[i].save())
        }
      }
      return JSON.stringify(output)
    },
    editObject: function (id) {
      this.editData = this.getObjectByID(id)
      if (this.editing) {
        // there was already an object being edited
        this.$refs.editObject.updateForm(this.editData)
      } else {
        this.editing = true
      }
    },
    finishObjectEdit: function (args) {
      // remember where it was
      let oldPosition = this.getObjectByID(args.id).position
      // remove the old object
      this.deleteObjByID(args.id)
      // and then remake it
      args.position = oldPosition
      delete args.id

      this.createObj(args)
      this.editing = false
    },

    // overwriting the contextmenu functions as this is the root.
    selectObj: function (id) {
      // if we just selected an obj, make sure we close the main context menu
      this.showContextMenu = false
      this.selectedObj = id
    },
    onClick: function () {
      this.selectObj('')      
    },
    onRightClick: function (event) {
      this.selectObj('')
      //console.log(event);
      this.contextMenuStyle.left = `${event.layerX}px`
      this.contextMenuStyle.top = `${event.layerY}px`
      this.showContextMenu = true
    },

    // Helper functions for maths sceneObjects
    getFunctionEval: function (symbol, scope) {
      let functions = this.getAllObjectsOfType('object-function')
      for (let i = 0; i < functions.length; i++) {
        if (functions[i].name == symbol) {
          return functions[i].evaluate(scope)
        }
      }
      return undefined
    },
    updateAllTables: function () {
      let tables = this.getAllObjectsOfType("object-function-table")
      for (let i = 0; i < tables.length; i++) {
        tables[i].evaluateAllRows()
      }
    },
    updateTablesWithSymbol: function (symbol) {
      //console.log(`updating tables with: ${symbol}`);
      let tables = this.getAllObjectsOfType("object-function-table")
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
      let graphs = this.getAllObjectsOfType("object-graph")
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
      // If we return the exact object then the functions we pass it to will insert
      // there values into the object, which we dont want.
      return Object.assign({}, this.globalScope)
    },
    updateAllGraphs: function() {
      let graphs = this.getAllObjectsOfType('object-graph')
      for (let i = 0; i < graphs.length; i++) {
        graphs[i].update()
      }
    }
  },
  render: function (createElement) {
    //A function as per normal
    //console.log(createElement);
    //console.log(this.$data);
    sceneObjects = []
    for (let i = 0; i < this.$data.sceneObjects.length; i++) {
      const element = this.$data.sceneObjects[i];

      // push onto the array
      sceneObjects.push(createElement('component', {
        key: element.key,
        props: {
          initData: element,
          selected: element.id === this.$data.selectedObj
        },
        attrs: {
          id: element.id
        },
        is: element.type,
        type: element.type,
      }))
    }
    // content holder
    return createElement('main', {
      // any attributes/additions/bindings?
      class: 'test'
    }, sceneObjects)
  }
})

/*
template: `<main>
  <main-menu>
    <button v-on:click="mainMenu('load')">Load</button>
    <button v-on:click="mainMenu('save')">Save</button>
    <button v-on:click="mainMenu">Create</button>
    <button v-on:click="mainMenu('reset')">Reset</button>
  </main-menu>
  <div v-bind:style="styleObj" v-on:click="dialog=false">
    <component v-for="(obj, key) in sceneObjects"
      v-bind:key="obj.id"
      v-bind:id="obj.id"
      v-bind:initData="obj"
      v-bind:is="obj.type"
      v-bind:type="obj.type"
      v-bind:selected="obj.id === selectedObj">
    </component>
    <object-edit v-bind:class="{CreateForm:true}" ref="editObject" v-if="editing" v-bind:initData="editData">
    </object-edit>
  </div>
  <main-pages></main-pages>
</main>`

ondragover="event.preventDefault()"
v-on:click.self.prevent="selectObj('')"
v-on:contextmenu.self.prevent="onRightClick"
*/