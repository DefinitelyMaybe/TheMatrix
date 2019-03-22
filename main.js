const MQ = MathQuill.getInterface(2);

const TheMatrix = new Vue({
  el: '#VueContainer',
  mixins: [mixin_contextmenu],
  data: {
    nextID: 0, // The next ID to be used if there are no freeobjectIDs left
    freeObjectID: [], // if an object is ever removed. its id is added here
    selectedObj: '', // The id of the currently selected object
    sceneObjects: [],

    editing: false,
    editData:{},

    // maths globals
    globalScope: {},

    // Style and misc data
    styleObj: {
      width: '100%',
      height: '100%'
    }
  },
  created: function () {
    // for the moment we're going to manually bring our scene ids up to speed with the loaded scene
    for (let i = 0; i < DATA_objects.length; i++) {
      // this bypasses the need to worry about objects connecting to each other.
      DATA_objects[i].id = this.getNewObjectID()
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
            id: options.id || this.getNewObjectID(),
            type: options.type,
            position: options.position,
            entries: options.entries
          })
          break;
        }
        case 'object-function':
        {
          this.sceneObjects.push({
            id: options.id || this.getNewObjectID(),
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
        case 'object-text':
        {
          this.sceneObjects.push({
            id: options.id || this.getNewObjectID(),
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
        case 'object-graph':
        {
          this.sceneObjects.push({
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
        case 'object-create':
        {
          this.sceneObjects.push({
            id: options.id || this.getNewObjectID(),
            type: options.type,
            position: options.position
          })
          break;
        }
        case 'scene-load':
        {
          this.sceneObjects.push({
            id: options.id || this.getNewObjectID(),
            type: options.type,
            position: options.position
          })
          break;
        }
        case 'scene-save':
        {
          this.sceneObjects.push({
            id: options.id || this.getNewObjectID(),
            type: options.type,
            position: options.position
          })
          break;
        }
        case 'scene-reset':
        {
          this.sceneObjects.push({
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
    mainMenu: function (type) {
      switch (type) {
        case "load":
        {
          this.createObj({
            type: "scene-load",
            position:[`${this.contextMenuStyle.left}`, `${this.contextMenuStyle.top}`]
          })
          break;
        }
        case "save":
        {
          this.createObj({
            type: "scene-save",
            position:[`${this.contextMenuStyle.left}`, `${this.contextMenuStyle.top}`]
          })
          break;
        }
        case "reset":
        {
          this.createObj({
            type: "scene-reset",
            position:[`${this.contextMenuStyle.left}`, `${this.contextMenuStyle.top}`]
          })
          break;
        }   
        default:
        {
          // default case is to create an object
          this.createObj({
            type: "object-create",
            position:[`${this.contextMenuStyle.left}`, `${this.contextMenuStyle.top}`]
          })
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
      let tables = this.getAllObjectsOfType("object-table")
      for (let i = 0; i < tables.length; i++) {
        tables[i].evaluateAllRows()
      }
    },
    updateTablesWithSymbol: function (symbol) {
      //console.log(`updating tables with: ${symbol}`);
      let tables = this.getAllObjectsOfType("object-table")
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
  template: `<div ondragover="event.preventDefault()"
v-on:click.self.prevent="selectObj('')"
v-on:contextmenu.self.prevent="onRightClick"
v-bind:style="styleObj">
  <component v-for="(obj, key) in sceneObjects"
    v-bind:key="obj.id"
    v-bind:id="obj.id"
    v-bind:initData="obj"
    v-bind:is="obj.type"
    v-bind:type="obj.type"
    v-bind:selected="obj.id === selectedObj"></component>
  <object-edit v-bind:class="{CreateForm:true}" ref="editObject" v-if="editing" v-bind:initData="editData"></object-edit>
  <ol v-on:contextmenu.prevent="onRightClick"
  v-show="showContextMenu && selectedObj == ''"
  v-bind:style="contextMenuStyle"
  v-bind:class="{menu: true}">
    <li v-on:click="mainMenu('load')" v-bind:class="{menu: true}">Load</li>
    <li v-on:click="mainMenu('save')" v-bind:class="{menu: true}">Save</li>
    <li v-on:click="mainMenu" v-bind:class="{menu: true}">Create</li>
    <li v-on:click="mainMenu('reset')" v-bind:class="{menu: true}">Reset</li>
  </ol>
</div>`
})
