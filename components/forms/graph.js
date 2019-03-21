Vue.component("form-graph", {
  props: {
    initData: Object,
  },
  data: function () {
    return {
      yaxis: "f",
      xaxis: "x",
      xrange:[-10, 10],
      yrange:[-10, 10],

      width: 300,
      height: 300,
    }
  },
  created: function () {
    if (this.initData) {
      //console.log(this.initData);
      this.width = this.initData.width
      this.height = this.initData.height
      this.yaxis = this.initData.yaxis
      this.xaxis = this.initData.xaxis

      this.xrange = this.initData.xrange
      this.yrange = this.initData.yrange
    }
  },
  methods: {
    //form specific
    finishForm: function () {
      this.$parent.finishForm({
        xaxis: this.xaxis,
        yaxis: this.yaxis,
        xrange: this.xrange,
        yrange: this.yrange,
        width: this.width,
        height: this.height,
      })
    }
  },
  template: `<form onsubmit="return false">
  <label>Function name:</label>
  <input type="text" v-model="yaxis"></input><br>
  <label>variable:</label>
  <input type="text" v-model="xaxis"></input><br>
  <label>Function range:</label>
  <input type="number" v-model="yrange[0]"></input>
  <input type="number" v-model="yrange[1]"></input><br>
  <label>variable range:</label>
  <input type="number" v-model="xrange[0]"></input>
  <input type="number" v-model="xrange[1]"></input><br>
  <label>Graph width:</label>
  <input type="number" v-model="width"></input><br>
  <label>Graph height:</label>
  <input type="number" v-model="height"></input><br>
  <button v-on:click="finishForm">Finish</button>
</form>`,
})