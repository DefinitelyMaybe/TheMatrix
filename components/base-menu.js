Vue.component("base-menu", {
  data: function () {
    return {
      isSideBarOpen: false
    }
  },
  props: {
    isOpen: {
      type: Boolean,
      required: false
    },
    right: {
      type: Boolean,
      required: false
    },
    width: {
      type: [String],
      required: false,
      default: '300'
    },
    disableEsc: {
      type: Boolean,
      required: false
    },
    noOverlay: {
      type: Boolean,
      required: false
    },
    onStateChange: {
      type: Function,
      required: false
    },
    burgerIcon: {
      type: Boolean,
      required: false,
      default: true
    },
    crossIcon: {
      type: Boolean,
      required: false,
      default: true
    },
    disableOutsideClick: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  methods: {
    openMenu() {
      this.$emit('openMenu');
      this.isSideBarOpen = true;
      if (!this.noOverlay) {
        document.body.className += 'bm-overlay';
      }
      if (this.right) {
        this.$refs.sideNav.style.left = 'auto';
        this.$refs.sideNav.style.right = '0px';
      }
      this.$nextTick(function() {
        this.$refs.sideNav.style.width = this.width
          ? this.width + 'px'
          : '300px';
      });
    },
    closeMenu() {
      this.$emit('closeMenu');
      this.isSideBarOpen = false;
      document.body.className = document.body.className.replace(
        'bm-overlay',
        ''
      );
      this.$refs.sideNav.style.width = '0px';
    },
    closeMenuOnEsc(e) {
      e = e || window.event;
      if (e.key === 'Escape' || e.keyCode === 27) {
        this.$refs.sideNav.style.width = '0px';
        document.body.style.backgroundColor = 'inherit';
        this.isSideBarOpen = false;
      }
    },
    documentClick(e) {
      let element = this.$refs.bmBurgerButton;
      let target = null;
      if (e && e.target) {
        target = e.target;
      }
      if (
        element &&
        element !== target &&
        !element.contains(target) &&
        e.target.className !== 'bm-menu' &&
        this.isSideBarOpen &&
        !this.disableOutsideClick
      ) {
        this.closeMenu();
      }
    }
  },
  mounted() {
    if (!this.disableEsc) {
      document.addEventListener('keyup', this.closeMenuOnEsc);
    }
  },
  created: function() {
    document.addEventListener('click', this.documentClick);
  },
  destroyed: function() {
    document.removeEventListener('keyup', this.closeMenuOnEsc);
    document.removeEventListener('click', this.documentClick);
  },
  watch: {
    isOpen: {
      deep: true,
      immediate: true,
      handler(newValue, oldValue) {
        this.$nextTick(() => {
          if (!oldValue && newValue) {
            this.openMenu();
          }
          if (oldValue && !newValue) {
            this.closeMenu();
          }
        });
      }
    },
    right: {
      deep: true,
      immediate: true,
      handler(oldValue, newValue) {
        if (oldValue) {
          this.$nextTick(() => {
            this.$refs.bmBurgerButton.style.left = 'auto';
            this.$refs.bmBurgerButton.style.right = '36px';
            this.$refs.sideNav.style.left = 'auto';
            this.$refs.sideNav.style.right = '0px';
            document.querySelector('.bm-burger-button').style.left = 'auto';
            document.querySelector('.bm-burger-button').style.right = '36px';
            document.querySelector('.bm-menu').style.left = 'auto';
            document.querySelector('.bm-menu').style.right = '0px';
            document.querySelector('.cross-style').style.right='250px';
          });
        }
        if (newValue) {
          if (
            this.$refs.bmBurgerButton.hasAttribute('style')
          ) {
            this.$refs.bmBurgerButton.removeAttribute('style');
            this.$refs.sideNav.style.right = 'auto';
            document
              .querySelector('.bm-burger-button')
              .removeAttribute('style');
            document.getElementById('sideNav').style.right = 'auto';
            document.querySelector('.cross-style').style.right='0px';
          }
        }
      }
    }
  },
  template: `<div>

  <div ref="sideNav" class="bm-menu">
      <nav class="bm-item-list">
          <slot></slot>
      </nav>
      <span class="bm-cross-button cross-style"
        v-on:click="closeMenu"
        v-bind:class="{ hidden: !crossIcon }">
          <span v-for="(x, index) in 2" :key="x"
            class="bm-cross"
            v-bind:style="{ position: 'absolute', width: '3px', height: '14px',transform: index === 1 ? 'rotate(45deg)' : 'rotate(-45deg)'}">
          </span>
      </span>
  </div>

  <div ref="bmBurgerButton" class="bm-burger-button"
   v-on:click="openMenu"
   v-bind:class="{ hidden: !burgerIcon }">
      <span v-for="(x, index) in 3" :key="index"
        class="bm-burger-bars line-style"
        v-bind:style="{top:20 * (index * 2) + '%'}"></span>
  </div>

</div>`,
})

/*
<template>
    <div>
        <Menu v-bind="this.$attrs" @openMenu="openMenu" @closeMenu="closeMenu">
            <slot></slot>
        </Menu>
    </div>
</template>

<script>
    import Menu from '../Menu';
    export default {
      name: 'slide',
      components: {
        Menu: Menu
      },
      methods: {
        openMenu() {
          this.$emit('openMenu');
        },
        closeMenu() {
          this.$emit('closeMenu');
        }
      }
    };
</script>

<template>
    
</template>

<script>
    export default {
      name: 'menubar',
      
</script>

<style>
    html {
      height: 100%;
    }
    
</style>
*/