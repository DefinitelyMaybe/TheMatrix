tempC = 1

Vue.component("math-graph", {
  props: {
    initData: Object,
    selected: Boolean
  },
  data: function () {
    return {
      // some defaults
      graph: '', // htmlelement ref
      trace: [
        {
          'x': [],
          'y': [],
          type: 'scatter'
        }
      ],
      layout: {
        title: 'My Graph',
        width: 300,
        height: 300,
        autosize: false,
        xaxis: {
          range: [-10, 10],
          title: 'x',
          //dtick: 1,
          gridcolor: '#000000',
          zerolinecolor: '#000000',
          zerolinewidth: 2,
        },
        yaxis: {
          range: [-10, 10],
          title: 'f',
          gridcolor: '#000000',
          zerolinecolor: '#000000',
          zerolinewidth: 2,
          //dtick: 1,
        },
        //paper_bgcolor: 'rgba(0,0,0,0)',
        //plot_bgcolor: 'rgba(0,0,0,0)'
      },
      options: {
        zoomscroll: true,
        //displayModeBar: true,
        //showLink: true,
        //linkText: "edit",
        //save button?
        //showSendToCloud: true,
        //lanuage
        //locale: 'fr'
        displaylogo:false,
        modeBarButtons: [
          // Can also do custom buttons too
          // https://codepen.io/etpinard/pen/pLOMXR?editors=0010
          // custom buttons look like this: 
          [
            {
              name: 'click me',
              click: function(gd) {
                Plotly.relayout(gd, 'title', 'click number: ' + tempC++)
              }
            }
          ],
          ['autoScale2d']
        ],
        //modeBarButtonsToRemove: ['toImage', 'lasso2d', 'zoom2d'],
        editable: true,
        //staticPlot: true, //negates editibility
        responsive: true // window resizing
      },

      // styling and misc data
      styleObj: {
        'position': 'absolute',
        'left': '0px',
        'top': '0px',
      },
      showContextMenu: false,
      contextMenuStyle: {
        'position': 'absolute',
        'left': '0px',
        'top': '0px'
      },
      dragOffsetX: 0,
      dragOffsetY: 0
    }
  },
  created: function () {
    if (this.initData) {
      //console.log(this.initData);
      this.layout.width = this.initData.width
      this.layout.height = this.initData.height
      this.layout.title = this.initData.title
      this.layout.xaxis.title = this.initData.xaxis
      this.layout.yaxis.title = this.initData.yaxis
      this.styleObj.left = this.initData.position[0]
      this.styleObj.top = this.initData.position[1]
    }
  },
  mounted() {
    this.graph = this.$refs.graph 
    this.updateTrace(this) // What in the heck??? why does scope change for this function?
    Plotly.plot(this.graph, this.trace, this.layout, this.options);
  },
  methods: {
    // Graph specific
    updateTrace: function (vueEl) {
      // Do not call Plotly.updateTrace() here. that would cause an infinite loop
      console.log("Graph updateTrace function called");
      //console.log(vueEl.trace);
      //console.log(vueEl.layout);
      function evaluateFunction(funcString, scope) {
        try {
          let g = math.compile(funcString)
          let outputs = g.eval(scope)
          return outputs
        } catch (error) {
          console.log("Graph threw error.");
          console.log(error);
        }
        // if the above failed then we will return an empty array
        return []
      }
      function getGraphRange() {
        // get the input range
        let range = vueEl.layout.xaxis.range
        let delta = Math.abs(range[1]-range[0])/10;
        return _.range(range[0], range[1]+delta, delta)
      }
      function getAxisLabels() {
        let obj = {}
        console.log(vueEl.layout);
        console.log(vueEl);
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
      // get the type of graph first
      let graphType = vueEl.trace[0].type
      if (graphType == "scatter") {
        console.log("updating a scatter plot");
        // getting the function string using the yaxis label
        let axisLabels = getAxisLabels()
        let func = vueEl.$root.getFunctionString(axisLabels.yaxis)

        // If found do the evaluation
        if (func) {
          console.log("Function found. Doing eval on scope");
          let inputs = getGraphRange()
          let scope = {};
          scope[axisLabels.xaxis] = inputs
          let outputs = evaluateFunction(func, scope)
          if (outputs.length == 0) {
            inputs = []
          }
          // finally update the trace
          vueEl.trace.splice(0, 1, {
            type: 'scatter',
            x: inputs,
            y: outputs
          })

          console.log(outputs);
        }
      }
    },
    deleteGraph: function () {
      this.$root.deleteObjByID(this.$attrs.id)
    },
    onGraphClick: function () {
      console.log("hello world");
      //this.updateTrace(this)
      //Plotly.newPlot(this.graph, this.trace, this.layout)
    },
    update: function () {
      this.updateTrace(this)
      Plotly.newPlot(this.graph, this.trace, this.layout)
    },
    

    // Root specific
    toObject: function () {
      return {
        "position": [this.styleObj.left, this.styleObj.top],
        "width": this.layout.width,
        "height": this.layout.height,
        "type": 'math-graph',
        "id": this.$attrs.id
      }
    },

    // events
    onDragEnd: function (event) {
      let x = event.x - this.dragOffsetX
      let y = event.y - this.dragOffsetY
      //console.log(`moving to:\n(${x},${y})`);
      this.styleObj.left = `${x}px`
      this.styleObj.top = `${y}px`
    },
    onDragStart: function (event) {
      //console.log("onDragStart function says...");
      //console.log(event);
      this.onClick()
      this.dragOffsetX = event.offsetX
      this.dragOffsetY = event.offsetY
      //console.log(`(${this.dragOffsetX}, ${this.dragOffsetY})`);
    },
    onClick: function () {
      this.$root.selectObj(this.$attrs.id)
      this.showContextMenu = false
    },
    onRightClick: function (event) {
      this.$root.selectObj(this.$attrs.id)
      //console.log(event);
      this.contextMenuStyle.left = `${event.layerX}px`
      this.contextMenuStyle.top = `${event.layerY}px`
      this.addedWidth = event.layerX
      this.showContextMenu = true
    }
  },
  template: `<div draggable="true"
  v-on:dragend="onDragEnd"
  v-on:dragstart="onDragStart"
  v-on:click.prevent="onClick"
  v-on:contextmenu.prevent="onRightClick"
  v-bind:class="{ graph: true, selected: selected}"
  v-bind:style="styleObj">
    <div ref="graph"
    v-on:click="onGraphClick"
    v-on:keyup="update"></div>
    <ol v-on:contextmenu.prevent="0"
    v-bind:class="{menu: true}"
    v-show="showContextMenu && selected"
    v-bind:style="contextMenuStyle">
      <li v-on:click="deleteGraph" v-bind:class="{menu: true}">Delete Table</li>
    </ol>
  </div>`,
})

//v-on:plotly_afterplot="customFunction"
