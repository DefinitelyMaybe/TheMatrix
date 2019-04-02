Vue.component("object-edit", {
    mixins: [mixin_moveable],
    props: {
      initData: Object,
      selected: Boolean
    },
    data: function () {
      return {
        id: '',
        type: '',
        objData: {}
      }
    },
    created() {
      this.id = this.initData.id
      this.type = this.initData.type
      this.objData = this.initData
    },
    methods: {
      //form specific
      finishForm: function (args) {
        args.id = this.id
        args.type = this.type
        this.$root.finishObjectEdit(args)
      },
      editForm: function () {
        switch (this.type) {
          case 'object-table':
          {
            return 'form-table'
          }
          case 'object-graph':
          {
            return 'form-graph'
          }
          case 'object-variable':
          {
            return 'form-variable'
          }
          default:
          {
            return 'form-function'
          }
        }
      },
      updateForm: function (arg) {
        this.objData = arg
        this.id = arg.id
        this.type = arg.type
      }
    },
    template: `<div draggable="true"
    v-on:dragend="onDragEnd"
    v-on:dragstart="onDragStart"
    v-bind:class="{CreateForm:true,selected:selected}"
    v-bind:style="objStyle">
    <component v-bind:is="editForm()" v-bind:initData="objData"></component>
  </div>`,
  })