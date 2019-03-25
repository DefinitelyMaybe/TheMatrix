Vue.component("object-graph", {
  mixins: [mixin_moveable, mixin_contextmenu],
  props: {
    initData: Object,
    selected: Boolean
  },
  data: function () {
    return {
      graph: '',
      trace: [
        {
          'x': [],
          'y': [],
          type: 'scatter'
        }
      ],
      layout: {
        title: ' ',
        width: 300,
        height: 300,
        autosize: false,
        xaxis: {
          range: [-10, 10],
          title: 'x',
          gridcolor: '#000000',
          zerolinecolor: '#000000',
          zerolinewidth: 2
        },
        yaxis: {
          range: [-10, 10],
          title: 'f',
          gridcolor: '#000000',
          zerolinecolor: '#000000',
          zerolinewidth: 2
        },
        //paper_bgcolor: 'rgba(0,0,0,0)',
        //plot_bgcolor: 'rgba(0,0,0,0)'
      },
      options: {
        //scrollZoom: true,
        displayModeBar: false,
        //editable: true,
        showAxisDragHandles: false,
        //displaylogo:false,
        //showLink: true,
        //linkText: "edit",
        //save button?
        //showSendToCloud: true,
        //modeBarButtonsToRemove: ['toImage', 'lasso2d', 'zoom2d'],
        //staticPlot: true, //negates editibility
        //responsive: true // window resizing
      }
    }
  },
  created: function () {
    if (this.initData) {
      //console.log(this.initData);
      this.layout.width = this.initData.width
      this.layout.height = this.initData.height
      this.layout.xaxis.range = this.initData.xrange
      this.layout.yaxis.range = this.initData.yrange
      this.layout.yaxis.title = this.initData.yaxis
      this.layout.xaxis.title = this.initData.xaxis
    }
  },
  mounted() {
    this.update()
  },
  methods: {
    deleteObject: function () {
      this.$root.deleteObjByID(this.$attrs.id)
    },
    save: function () {
      return {
        "position": [this.objStyle.left, this.objStyle.top],
        "width": this.layout.width,
        "height": this.layout.height,
        "type": 'object-graph',
        "id": this.$attrs.id,
        "xaxis": this.layout.xaxis.title.text,
        "yaxis": this.layout.yaxis.title.text,
        "xrange": this.layout.xaxis.range,
        "yrange": this.layout.yaxis.range
      }
    },
    edit: function () {
      if (this.selected) {
        this.$root.editObject(this.$attrs.id)
      } else {
        this.onClick(event)
      }
    },
    update: function () {
      this.updateTrace(this)
      Plotly.newPlot(this.getGraphDiv, this.trace, this.layout, this.options)
    },
    updateTrace: function (vueEl) {
      // Do not call Plotly.updateTrace() here. that would cause an infinite loop
      function getGraphRange() {
        // get the input range
        let range = vueEl.layout.xaxis.range
        let delta = Math.abs(range[1]-range[0])/100;
        return _.range(range[0], range[1]+delta, delta)
      }
      function getAxisLabels() {
        let obj = {}
        //console.log(vueEl.layout);
        //console.log(vueEl);
        if (vueEl.layout.xaxis.title.text) {
          obj["xaxis"] = vueEl.layout.xaxis.title.text
        } else {
          obj["xaxis"] = vueEl.layout.xaxis.title
        }
        if (vueEl.layout.yaxis.title.text) {
          obj["yaxis"] = vueEl.layout.yaxis.title.text
        } else {
          obj["yaxis"] = vueEl.layout.yaxis.title
        }
        return obj
      }
      if (vueEl.trace[0].type == "scatter") {
        // getting the function string using the yaxis label
        let axisLabels = getAxisLabels()
        let funcName = axisLabels.yaxis

        let inputs = getGraphRange()
        let realInputs = []
        let realOutputs = []
        let complexInputs = []
        let complexOutputs = []
        let scope = this.$root.getGlobalScope()

        // for now we're dealing with complex numbers naively.
        for (let i = 0; i < inputs.length; i++) {
          scope[axisLabels.xaxis] = inputs[i]
          let result = this.$root.getFunctionEval(funcName, scope)
          if (result) {
            if (result.im) {
              complexInputs.push(inputs[i])
              complexOutputs.push(result.re)
            } else {
              realInputs.push(inputs[i])
              realOutputs.push(result)
            } 
          }
        }

        // finally update the trace
        vueEl.trace.splice(0, vueEl.trace.length)
        vueEl.trace.push({
          type: 'scatter',
          name: 'real',
          x: realInputs,
          y: realOutputs
        })
        vueEl.trace.push({
          type: 'scatter',
          name: 'complex',
          x: complexInputs,
          y: complexOutputs
        })
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
  computed: {
    getGraphDiv: function () {
      for (let i = 0; i < this.$el.children.length; i++) {
        if (this.$el.children[i].id == 'graph') {
          return this.$el.children[i]
        }
      }  
    }
  },
  template: `<div draggable="true"
  v-on:dragend="onDragEnd"
  v-on:dragstart="onDragStart"
  v-on:click.prevent="onClick"
  v-on:contextmenu.prevent="onRightClick"
  v-bind:class="{ graph: true, selected: selected}"
  v-bind:style="objStyle">
    <div id="graph"></div>
    <ol v-on:contextmenu.prevent="0"
    v-bind:class="{menu: true}"
    v-show="showContextMenu && selected"
    v-bind:style="contextMenuStyle">
      <li v-on:click="edit" v-bind:class="{menu: true}">Edit</li>
      <li v-on:click="deleteObject" v-bind:class="{menu: true}">Delete</li>
    </ol>
  </div>`,
})