const mixin_contextmenu = {
  data: function () {
    return {
      showContextMenu: false,
      contextMenuStyle: {
        position: 'absolute',
        width: '100px',
        left: '0px',
        top: '0px'
      }
    }
  },
  methods: {
    onClick: function () {
      this.$root.selectObj(this.$attrs.id)
      this.showContextMenu = false
    },
    onRightClick: function (event) {
      this.$root.selectObj(this.$attrs.id)
      this.contextMenuStyle.left = `${event.layerX}px`
      this.contextMenuStyle.top = `${event.layerY}px`
      this.showContextMenu = true
    }
  }
}