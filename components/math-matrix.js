Vue.component("math-matrix", {
  props: {
    initEntries: Array,
    initPosition: Array
  },
  data: function () {
    return {
      entries: [[1,0,0],[0,1,0],[0,0,1]],
      position: [0,0],
      styleObj: {
        position: 'absolute',
        left: `0px`,
        top: `0px`,
      }
    }
  },
  created: function () {
    if (this.initEntries) {
      this.entries = this.initEntries 
    }
    if (this.initPosition) {
      this.position = this.initPosition
      this.styleObj.left = `${this.initPosition[0]}px`
      this.styleObj.top   = `${this.initPosition[1]}px`
    }
  },
  methods: {
    newEntry: function () {
      try {
        this.entries[i][j] = value
        //this.shouldUpdate = true
      } catch (error) {
        console.log(error);
      }
    }
  },
  computed: {
    generateTemplate: function () {
      return `<table v-bind:style="styleObj">
      <tr v-for="(row, i) in entries">
        <td v-for="(item, j) in row"> {{ entries[i][j] }} </td>
      </tr>
    </table>`
    }
  },
  template: `<table v-bind:style="styleObj">
  <tr v-for="(row, i) in entries">
    <td v-for="(item, j) in row"> {{ entries[i][j] }} </td>
  </tr>
</table>`,
})