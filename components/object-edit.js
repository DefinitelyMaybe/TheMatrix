Vue.component("object-edit", {
    mixins: [mixin_moveable],
    props: {
      initData: Object,
      selected: Boolean
    },
    data: function () {
      return {
        id: '',
        type: ''
      }
    },
    created() {
      console.log("created called");
      this.id = this.initData.id
      this.type = this.initData.type
    },
    methods: {
      //form specific
      finishForm: function (args) {
        console.log("edit has finished. cleaning up");
        this.$root.finishObjectEdit(args)
      },
      editForm: function () {
        console.log("edit switch to appropriate form")
        switch (this.type) {
          case 'object-table':
          {
            //inputHeaders:inputHeaders,outputHeaders:outputHeaders, inputTable:inputTable, outputTable:outputTable
            return 'form-table'
          }
          case 'object-graph':
          {
            /*{width:layout.width,height:layout.height,
              xrange:layout.xaxis.range, yrange:layout.yaxis.range,
              yaxis:layout.yaxis.title.text, xaxis:layout.xaxis.title.text}*/
            return 'form-graph'
          }
          case 'object-variable':
          {
            // name:name,value:value
            return 'form-variable'
          }
          default:
          {
            // name:name,latex:latex
            return 'form-function'
          }
        }
      },
      updateForm: function () {
        console.log(this.initData);
      }
    },
    template: `<div draggable="true"
    v-on:dragend="onDragEnd"
    v-on:dragstart="onDragStart"
    v-bind:class="{CreateForm:true,selected:selected}"
    v-bind:style="objStyle">
    <component v-bind:is="editForm()" v-bind:initData="initData"></component>
  </div>`,
  })