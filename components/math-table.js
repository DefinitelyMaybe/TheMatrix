Vue.component("math-table", {
  props: {
    initData: Object,
    selected: Boolean
  },
  data: function () {
    return {
      // some default settings
      headers: ['x', '?'],
      tableInput: [1,2,3,4,5],
      tableOutput: ['', '', '', '', ''],
      // another idea would be connected functions on a separate table?
      dragOffsetX: 0,
      dragOffsetY: 0
    }
  },
  created: function () {
    if (this.initData) {
      //console.log(this.initData);
      this.headers = this.initData.headers
      this.tableInput = this.initData.tableInput
      this.tableOutput = this.initData.tableOutput
    }
  },
  methods: {
    changeHeader: function (index) {
      // select the table before getting tableInput from user
      if (this.selected) {
        let newHeader = prompt("Change the header?", this.headers[index])
        if (newHeader && this.headers[index] != newHeader) {
          this.headers.splice(index, 1, newHeader)
          this.$root.updateData(this.$attrs.id, 'headers', this.headers)
        } 
      } else {
        this.onClick(event)
      }
    },
    changeInput: function (index) {
      // select the table before getting tableInput from user
      if (this.selected) {
        let newInput = prompt("Change the input?", this.tableInput[index])
        try {
          newInput = parseFloat(newInput)
          if (newInput && this.tableInput[index] != newInput) {
            this.tableInput.splice(index, 1, newInput)
            // this is the weirdest looking piece of code ever but...
            // this is how you invoke the setter function of the computed property
            this.outputTable = index
            this.$root.updateData(this.$attrs.id, 'tableInput', this.tableInput)
          }
        } catch (error) {
          // check back here later. this output didn't seem to ever be invoked.
          console.warn("For the moment, inputs must be numbers.");
          console.warn(error);
        }
      } else {
        this.onClick(event)
      }
    },
    onDragEnd: function (event) {
      //console.log("onDragEnd function says...");
      //console.log(event);
      let x = event.x - this.dragOffsetX
      let y = event.y - this.dragOffsetY
      this.$root.updateData(this.$attrs.id, 'position', [`${x}px`, `${y}px`])
      // updating the class appropriately
      this.objHover = false
    },
    onDragStart: function (event) {
      //console.log("onDragStart function says...");
      //console.log(event);
      this.onClick(event)
      this.dragOffsetX = event.offsetX
      this.dragOffsetY = event.offsetY
    },
    onClick: function (event) {
      this.$root.selectObj(event, this.$attrs.id)
    },
    onRightClick: function (event) {
      this.$root.selectObj(event, this.$attrs.id)
      this.$root.onContextMenu(event, 'variable')
    }
  },
  computed: {
    outputTable: {
      get: function () {
        return this.tableOutput
      },
      set: function (index) {
        //console.log(index);
        // now with this index, create the variable scope object for the eval call
        let scope = {}
        // going to hard code just for a moment
        scope[this.headers[0]] = this.tableInput[index]
        //console.log(scope);
        // next we need the output function string
        // more hard coding
        let func = this.$root.getFunctionString(this.headers[1])
        //console.log(func);
        let g = math.compile(func)
        let outputValue = g.eval(scope)

        this.tableOutput.splice(index, 1, outputValue)
        this.$root.updateData(this.$attrs.id, 'tableOutput', this.tableOutput)
      }
    }
  },
  template: `<table draggable="true"
  v-on:dragend="onDragEnd"
  v-on:dragstart="onDragStart"
  v-on:click.prevent="onClick"
  v-on:contextmenu.prevent="onRightClick($event, 'matrix')"
  v-bind:class="{ table: true, selected: selected}">
    <tr>
      <th v-for="(value, index) in headers"
      v-bind:key="index"
      v-on:click="changeHeader(index)">{{ value }}</th>
    </tr>
    <tr v-for="(value, index) in tableInput"
    v-bind:key="index">
      <td v-on:click="changeInput(index)">{{value}}</td>
      <td>{{outputTable[index]}}</td>
    </tr>
  </table>`,
})