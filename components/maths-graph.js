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
        title: {
          text:'my graph',
          x: 10,
          y: 10
        },
        width: 200,
        height: 200,
        margin: {
          l: 50,
          r: 50,
          b: 50,
          t: 50,
          pad: 0
        },
        xaxis: {
          //range: [-10, 10],
          title: 'x',
          //dtick: 1,
          gridcolor: '#000000',
          zerolinecolor: '#000000',
          zerolinewidth: 2,
        },
        yaxis: {
          title: 'y',
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
          ['autoScale2d', 'zoom2d', 'lasso2d']
        ],
        //modeBarButtonsToRemove: ['toImage'],
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
      this.styleObj.left = this.initData.position[0]
      this.styleObj.top = this.initData.position[1]
    }
  },
  mounted() {
    this.graph = this.$refs.graph
    this.initPlot()
    console.log(this.graph);
  },
  methods: {
    // Graph specific
    initPlot: function () {
      Plotly.plot(this.graph, this.trace, this.layout, this.options);
      this.graph.on('plotly_event', function (data) {
        console.log(this);
        console.log(data);
      })
      this.graph.on('plotly_afterplot', function(){
        console.log('done plotting');
      });
    },
    update: function () {
      Plotly.update(this.graph, this.trace, this.layout)
    },
    deleteGraph: function () {
      this.$root.deleteObjByID(this.$attrs.id)
    },
    test: function () {
      console.log("hello world");
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
    <div ref="graph"></div>
    <div ref="helper" v-bind:class="{graphHelper:true}"></div>
    <ol v-on:contextmenu.prevent="0"
    v-bind:class="{menu: true}"
    v-show="showContextMenu && selected"
    v-bind:style="contextMenuStyle">
      <li v-on:click="deleteGraph" v-bind:class="{menu: true}">Delete Table</li>
    </ol>
  </div>`,
})