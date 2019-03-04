Vue.component("form-graph", {
  data: function () {
    return {
      yaxis: "f",
      xaxis: "x",
      xrange:[-10, 10],
      yrange:[-10, 10]
    }
  },
  created: function () {
    if (this.initData) {
      //console.log(this.initData);
      this.formData = this.initData.formData
      this.styleObj.left = this.initData.position[0]
      this.styleObj.top = this.initData.position[1]
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
  <button v-on:click="finishForm">Finish</button>
</form>`,
})