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
    this.initPlot()
    this.$root.updateAllGraphs()
    this.manualGraphUpdate()
  },
  methods: {
    // Graph specific
    initPlot: function () {
      Plotly.plot(this.graph, this.trace, this.layout, this.options);
    },
    update: function () {
      // Do not call Plotly.update() here. that would cause an infinite loop
      console.log("Graph update function called");
      //console.log(this.trace);
      //console.log(this.layout);
      // get the type of graph first
      let graphType = this.trace[0].type
      if (graphType == "scatter") {
        console.log("updating a scatter plot");
        // get the input range
        let range = this.layout.xaxis.range

        // getting the function string
        let func = this.$root.getFunctionString(this.layout.yaxis.title.text)

        // If found do the evaluation
        if (func) {
          try {
            let g = math.compile(func)
            // setup the scope variable for eval
            let delta = Math.abs(range[1]-range[0])/10;
            let newXaxis = _.range(range[0], range[1]+delta, delta)
            let scope = {};
            scope[this.layout.xaxis.title.text] = newXaxis
            console.log(scope);
            // do the eval
            let outputs = g.eval(scope)

            // update the data
            let data = this.trace[0]
            data.x = newXaxis
            data.y = outputs
            this.trace.splice(0, 1, data)
            console.log(this.trace);
          } catch (error) {
            console.log("Graph threw error.");
            console.log(error);
          }
        } else {
          // set to nothing
          this.trace[0].y.splice(0, this.trace[0].y.length)
        }
      }
    },
    deleteGraph: function () {
      this.$root.deleteObjByID(this.$attrs.id)
    },
    onGraphClick: function () {
      console.log("hello world");
      this.update()
    },
    manualGraphUpdate: function () {
      console.log("this is a custom vue call");
      Plotly.update(this.graph, this.trace, this.layout)
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
    v-on:keyup="manualGraphUpdate"></div>
    <ol v-on:contextmenu.prevent="0"
    v-bind:class="{menu: true}"
    v-show="showContextMenu && selected"
    v-bind:style="contextMenuStyle">
      <li v-on:click="deleteGraph" v-bind:class="{menu: true}">Delete Table</li>
    </ol>
  </div>`,
})

//v-on:plotly_afterplot="customFunction"
