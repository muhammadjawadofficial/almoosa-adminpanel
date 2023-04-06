<template>
  <div>
    <div
      class="page-wrapper"
      :class="[layoutobj, { 'full-width': !stickysidebar || withoutSideBar }]"
    >
      <div
        v-if="getUserInfo"
        class="page-header"
        :class="{ close_icon: !togglesidebar && !withoutSideBar }"
      >
        <Header @clicked="sidebar_toggle" :hideSidebar="withoutSideBar" />
      </div>
      <div class="page-body-wrapper">
        <div class="bg-overlay"></div>
        <div
          class="sidebar-wrapper"
          :class="[{ close_icon: !togglesidebar }]"
          :sidebar-layout="layout.settings.sidebar_setting"
          v-if="!withoutSideBar"
        >
          <Sidebar @clicked="sidebar_toggle" />
        </div>
        <div
          class="page-body"
          @click="hidesecondmenu()"
          :class="{ 'm-0': !getUserInfo }"
        >
          <transition name="fadeIn" enter-active-class="animated fadeIn">
            <router-view class="view"></router-view>
          </transition>
        </div>
        <Footer v-if="getUserInfo" />
      </div>
      <TapTop />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import { layoutClasses } from "../constants/layout";
import Header from "./header";
import Sidebar from "./sidebar.vue";
import Footer from "./footer";
import TapTop from "./taptop";
import { rolesPermissionsService, userService } from "../services";

export default {
  name: "mainpage",
  // props:['sidebar_toggle_var'],
  components: {
    Header,
    Sidebar,
    Footer,
    TapTop,
  },
  data() {
    return {
      mobileheader_toggle_var: false,
      sidebar_toggle_var: false,
      horizontal_Sidebar: true,
      resized: false,
      layoutobj: {},
      withoutSideBar: false,
    };
  },
  computed: {
    ...mapState({
      menuItems: (state) => state.menu.data,
      layout: (state) => state.layout.layout,
      togglesidebar: (state) => state.menu.togglesidebar,
      stickysidebar: (state) => state.menu.stickysidebar,
      activeoverlay: (state) => state.menu.activeoverlay,
    }),
    ...mapGetters("user", ["getUserInfo"]),
    ...mapGetters("menu", ["getMenuItems"]),
    layoutobject: {
      get: function () {
        return JSON.parse(
          JSON.stringify(
            layoutClasses.find(
              (item) => Object.keys(item).pop() === this.layout.settings.layout
            )
          )
        )[this.layout.settings.layout];
      },
      set: function () {
        this.layoutobj = layoutClasses.find(
          (item) => Object.keys(item).pop() === this.layout.settings.layout
        );
        this.layoutobj = JSON.parse(JSON.stringify(this.layoutobj))[
          this.layout.settings.layout
        ];
        return this.layoutobj;
      },
    },
  },
  watch: {
    $route(route) {
      this.menuItems.filter((items) => {
        if (items.path === route.path)
          this.$store.dispatch("menu/setActiveRoute", items);
        if (!items.children) return false;
        items.children.filter((subItems) => {
          if (subItems.path === route.path)
            this.$store.dispatch("menu/setActiveRoute", subItems);
          if (!subItems.children) return false;
          subItems.children.filter((subSubItems) => {
            if (subSubItems.path === route.path)
              this.$store.dispatch("menu/setActiveRoute", subSubItems);
          });
        });
      });
      this.layoutobj = layoutClasses.find(
        (item) => Object.keys(item).pop() === this.layout.settings.layout
      );
      this.setLayoutObject();
      this.$store.dispatch("menu/setNavLinkActive", { path: route.path });
    },
    sidebar_toggle_var: function () {
      this.resized =
        this.width <= 991 ? !this.sidebar_toggle_var : this.sidebar_toggle_var;
    },
    getMenuItems(val) {
      this.withoutSideBar = !!(val && val.length == 1) && false;
    },
  },
  beforeDestroy(){
    this.withoutSideBar = false;
  },
  created() {
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
    this.resized = this.sidebar_toggle_var;
    this.$store.dispatch("layout/set");
    this.layout.settings.layout = this.$route.query.layout
      ? this.$route.query.layout
      : "Dubai";
    this.layoutobj = layoutClasses.find(
      (item) => Object.keys(item).pop() === this.layout.settings.layout
    );
    this.layoutobj = JSON.parse(JSON.stringify(this.layoutobj))[
      this.layout.settings.layout
    ];
    this.$store.dispatch("menu/setNavLinkActive", { path: this.$route.path });
    let userInfo = userService.currentUser();
    this.setUserInfo(userInfo);
  },
  methods: {
    ...mapActions("user", ["setUserInfo"]),
    setLayoutObject() {
      if (
        (window.innerWidth < 991 &&
          this.layout.settings.layout === "LosAngeles") ||
        (window.innerWidth < 991 &&
          this.layout.settings.layout === "Singapore") ||
        (window.innerWidth < 991 && this.layout.settings.layout === "Barcelona")
      ) {
        const newlayout = JSON.parse(
          JSON.stringify(this.layoutobj).replace(
            "horizontal-wrapper",
            "compact-wrapper"
          )
        );
        this.layoutobj = JSON.parse(JSON.stringify(newlayout))[
          this.layout.settings.layout
        ];
      } else {
        this.layoutobj = JSON.parse(JSON.stringify(this.layoutobj))[
          this.layout.settings.layout
        ];
      }
    },
    sidebar_toggle(value) {
      this.sidebar_toggle_var = !value;
    },
    mobiletoggle_toggle(value) {
      this.mobileheader_toggle_var = value;
    },
    handleResize() {
      this.$store.dispatch("menu/resizetoggle");
    },
    removeoverlay() {
      this.$store.state.menu.activeoverlay = false;
      if (window.innerWidth < 991) {
        this.$store.state.menu.togglesidebar = false;
      }
      this.menuItems.filter((menuItem) => {
        menuItem.active = false;
      });
    },
    hidesecondmenu() {
      if (this.layoutobject.split(" ").includes("compact-sidebar")) {
        this.menuItems.filter((menuItem) => {
          menuItem.active = false;
        });
      }
      if (!this.stickysidebar) this.$store.state.menu.togglesidebar = true;
    },
  },
};
</script>

