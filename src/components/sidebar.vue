<template>
  <div>
    <nav class="sidebar-main">
      <li
        class="left-arrow"
        :class="{
          'd-none':
            layout.settings.layout_type == 'rtl'
              ? hideLeftArrowRTL
              : hideLeftArrow,
        }"
        @click="
          layoutobject.split(' ').includes('horizontal-wrapper') &&
          layout.settings.layout_type === 'rtl'
            ? scrollToLeftRTL()
            : scrollToLeft()
        "
      >
        <feather type="arrow-left"></feather>
      </li>
      <div id="sidebar-menu">
        <ul
          class="sidebar-links custom-scrollbar"
          id="myDIV"
          :style="[
            layoutobject.split(' ').includes('horizontal-wrapper')
              ? layout.settings.layout_type == 'rtl'
                ? { 'margin-right': margin + 'px' }
                : { 'margin-left': margin + 'px' }
              : { margin: '0px' },
          ]"
        >
          <li class="back-btn">
            <div class="mobile-back">
              <span>Pin Sidebar</span>
            </div>
          </li>
          <li
            v-for="(menuItem, index) in getMenuItems"
            :key="index"
            :class="{
              active: menuItem.active,
              'sidebar-main-title': menuItem.type == 'headtitle',
              'is-dropdown': !menuItem.path,
            }"
            class="sidebar-list"
          >
            <!-- link title -->
            <div v-if="menuItem.type == 'headtitle'">
              <h6 class="lan-1">{{ menuItem.headTitle1 }}</h6>
              <p class="lan-2">{{ menuItem.headTitle2 }}</p>
            </div>
            <!-- Sub -->
            <label
              :class="'badge badge-' + menuItem.badgeType"
              v-if="menuItem.badgeType"
              >{{ menuItem.badgeValue }}</label
            >
            <a
              href="javascript:void(0)"
              class="sidebar-link sidebar-title"
              v-if="menuItem.type == 'sub'"
              @click="setNavActive(menuItem, index)"
            >
              <div class="side-bar-menu-item-icon">
                <component :is="menuItem.icon" />
              </div>
              <span>
                {{ menuItem[getLocaleKey("title")] }}
              </span>
              <div class="according-menu" v-if="menuItem.children">
                <i class="fa fa-angle-right pull-right"></i>
              </div>
            </a>
            <!-- Link -->
            <a
              href="javascript:void(0)"
              @click="loadComponent(menuItem)"
              class="sidebar-link sidebar-title"
              v-if="menuItem.type == 'link'"
            >
              <div class="side-bar-menu-item-icon">
                <component :is="menuItem.icon" />
              </div>
              <span>
                {{ menuItem[getLocaleKey("title")] }}
              </span>
              <i
                class="fa fa-angle-right pull-right"
                v-if="menuItem.children"
              ></i>
            </a>
            <!-- External Link -->
            <a
              :href="menuItem.path"
              class="sidebar-link sidebar-title"
              v-if="menuItem.type == 'extLink'"
              @click="setNavActive(menuItem, index)"
            >
              <i :class="'fa fa-' + menuItem.icon"></i>
              <span>
                {{ menuItem[getLocaleKey("title")] }}
              </span>
              <i
                class="fa fa-angle-right pull-right"
                v-if="menuItem.children"
              ></i>
            </a>
            <!-- External Tab Link -->
            <a
              :href="menuItem.path"
              target="_blank"
              class="sidebar-link sidebar-title"
              v-if="menuItem.type == 'extTabLink'"
              @click="setNavActive(menuItem, index)"
            >
              <i :class="'fa fa-' + menuItem.icon"></i>
              <span>
                {{ menuItem[getLocaleKey("title")] }}
              </span>
              <i
                class="fa fa-angle-right pull-right"
                v-if="menuItem.children"
              ></i>
            </a>
            <!-- 2nd Level Menu -->
            <ul
              class="sidebar-submenu"
              v-if="menuItem.children"
              :class="{ 'menu-open': menuItem.active }"
            >
              <li
                v-for="(childrenItem, index) in menuItem.children"
                :key="index"
                :class="{ active: childrenItem.active }"
              >
                <!-- Sub -->
                <a
                  class="submenu-title"
                  href="javascript:void(0)"
                  v-if="childrenItem.type == 'sub'"
                  @click="setNavActive(childrenItem, index)"
                >
                  {{ childrenItem[getLocaleKey("title")] }}
                  <label
                    :class="
                      'badge badge-' + childrenItem.badgeType + ' pull-right'
                    "
                    v-if="childrenItem.badgeType"
                    >{{ childrenItem.badgeValue }}</label
                  >
                  <div class="according-menu">
                    <i
                      class="fa fa-angle-right pull-right"
                      v-if="childrenItem.children"
                    ></i>
                  </div>
                </a>
                <!-- Link -->
                <router-link
                  class="submenu-title"
                  :to="childrenItem.path"
                  :event="childrenItem.disableClick ? '' : 'click'"
                  v-if="childrenItem.type == 'link'"
                >
                  {{ childrenItem[getLocaleKey("title")] }}
                  <label
                    :class="
                      'badge badge-' + childrenItem.badgeType + ' pull-right'
                    "
                    v-if="childrenItem.badgeType"
                    >{{ childrenItem.badgeValue }}</label
                  >
                  <i
                    class="fa fa-angle-right pull-right mt-1"
                    v-if="childrenItem.children"
                  ></i>
                </router-link>
                <!-- External Link -->
                <a
                  :href="childrenItem.path"
                  v-if="childrenItem.type == 'extLink'"
                  class="submenu-title"
                >
                  {{ childrenItem[getLocaleKey("title")] }}
                  <label
                    :class="
                      'badge badge-' + childrenItem.badgeType + ' pull-right'
                    "
                    v-if="childrenItem.badgeType"
                    >{{ childrenItem.badgeValue }}</label
                  >
                  <i
                    class="fa fa-angle-right pull-right mt-1"
                    v-if="childrenItem.children"
                  ></i>
                </a>
                <!-- External Tab Link -->
                <a
                  class="submenu-title"
                  :href="childrenItem.path"
                  target="_blank"
                  v-if="childrenItem.type == 'extTabLink'"
                >
                  {{ childrenItem[getLocaleKey("title")] }}
                  <label
                    :class="
                      'badge badge-' + childrenItem.badgeType + ' pull-right'
                    "
                    v-if="childrenItem.badgeType"
                    >{{ childrenItem.badgeValue }}</label
                  >
                  <i
                    class="fa fa-angle-right pull-right mt-1"
                    v-if="childrenItem.children"
                  ></i>
                </a>
                <!-- 3rd Level Menu -->
                <ul
                  class="nav-sub-childmenu submenu-content"
                  v-if="childrenItem.children && childrenItem.children.length"
                  :class="{ opensubchild: childrenItem.active }"
                >
                  <li
                    v-for="(childrenSubItem, index) in childrenItem.children"
                    :key="index"
                  >
                    <!-- Link -->
                    <router-link
                      :to="childrenSubItem.path"
                      v-if="childrenSubItem.type == 'link'"
                      :event="childrenSubItem.disableClick ? '' : 'click'"
                      router-link-exact-active
                    >
                      {{ childrenSubItem[getLocaleKey("title")] }}
                      <label
                        :class="
                          'badge badge-' +
                          childrenSubItem.badgeType +
                          ' pull-right'
                        "
                        v-if="childrenSubItem.badgeType"
                        >{{ childrenSubItem.badgeValue }}</label
                      >
                      <i
                        class="fa fa-angle-right pull-right"
                        v-if="childrenSubItem.children"
                      ></i>
                    </router-link>
                    <!-- External Link -->
                    <router-link
                      :to="childrenSubItem.path"
                      v-if="childrenSubItem.type == 'extLink'"
                      router-link-exact-active
                    >
                      {{ childrenSubItem[getLocaleKey("title")] }}
                      <label
                        :class="
                          'badge badge-' +
                          childrenSubItem.badgeType +
                          ' pull-right'
                        "
                        v-if="childrenSubItem.badgeType"
                        >{{ childrenSubItem.badgeValue }}</label
                      >
                      <i
                        class="fa fa-angle-right pull-right"
                        v-if="childrenSubItem.children"
                      ></i>
                    </router-link>
                    <!-- External Tab Link -->
                    <router-link
                      :to="childrenSubItem.path"
                      v-if="childrenSubItem.type == 'extLink'"
                      router-link-exact-active
                    >
                      {{ childrenSubItem[getLocaleKey("title")] }}
                      <label
                        :class="
                          'badge badge-' +
                          childrenSubItem.badgeType +
                          ' pull-right'
                        "
                        v-if="childrenSubItem.badgeType"
                        >{{ childrenSubItem.badgeValue }}</label
                      >
                      <i
                        class="fa fa-angle-right pull-right"
                        v-if="childrenSubItem.children"
                      ></i>
                    </router-link>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <li
        class="right-arrow"
        :class="{
          'd-none':
            layout.settings.layout_type == 'rtl'
              ? hideRightArrowRTL
              : hideRightArrow,
        }"
        @click="
          layoutobject.split(' ').includes('horizontal-wrapper') &&
          layout.settings.layout_type == 'rtl'
            ? scrollToRightRTL()
            : scrollToRight()
        "
      >
        <feather type="arrow-right"></feather>
      </li>
    </nav>
  </div>
</template>
<script>
import { mapActions, mapGetters, mapState } from "vuex";
import { layoutClasses } from "../constants/layout";
import { rolesPermissionsService } from "../services";
import Menu from "../data/menu.json";
export default {
  name: "Sidebar",
  data() {
    return {
      width: 0,
      height: 0,
      margin: 0,
      hideRightArrowRTL: true,
      hideLeftArrowRTL: true,
      hideRightArrow: true,
      hideLeftArrow: true,
      menuWidth: 0,
      toggle_sidebar_var: false,
      clicked: false,
      layoutobj: {},
      rolesList: [],
    };
  },
  computed: {
    ...mapState({
      layout: (state) => state.layout.layout,
      sidebar: (state) => state.layout.sidebarType,
    }),
    ...mapGetters("menu", ["getMenuItems", "getRolesList"]),
    ...mapGetters("user", ["getUserInfo"]),
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
  created() {
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
    if (this.width < 991) {
      this.layout.settings.layout = "Dubai";
      this.margin = 0;
    }
    setTimeout(() => {
      const elmnt = document.getElementById("myDIV");
      this.menuWidth = elmnt && elmnt.offsetWidth;
      if (this.menuWidth > window.innerWidth) {
        this.hideRightArrow = false;
        this.hideLeftArrowRTL = false;
      } else {
        this.hideRightArrow = false;
        this.hideLeftArrowRTL = true;
      }
    }, 500);
    this.layoutobject = layoutClasses.find(
      (item) => Object.keys(item).pop() === this.layout.settings.layout
    );
    this.layoutobject = JSON.parse(JSON.stringify(this.layoutobject))[
      this.layout.settings.layout
    ];
  },
  destroyed() {
    window.removeEventListener("resize", this.handleResize);
  },
  mounted() {
    this.fetchPermissions(this.getUserInfo.role_id);
  },
  watch: {
    $route() {
      this.setActiveLayout();
      this.close_sidebar();
    },
  },
  methods: {
    ...mapActions("menu", ["updateMenuItems"]),
    ...mapActions("user", ["setUserPermissions"]),
    getSubChild(item) {
      return item.children;
    },
    initializeMenuItems() {
      let filteredMenuItems = Menu.data.filter((x) => {
        if (x.children) {
          x.children.forEach((y) => {
            if (y.dynamicSub && !y.children.length) {
              y.children = this.getRolesList;
            }
          });
        }
        return (
          !x.disabled &&
          ((!x.permission && this.getUserInfo.role_id == 1) ||
            x.common ||
            this.getUserPermissions.includes(x.permission) ||
            this.getUserInfo.role_id == 1)
        );
      });

      this.updateMenuItems(JSON.parse(JSON.stringify(filteredMenuItems)));
      this.setActiveLayout();
    },
    fetchPermissions(roleId) {
      if (!roleId) {
        return;
      }
      rolesPermissionsService
        .fetchRoleDetails(roleId)
        .then((response) => {
          if (response.data.status) {
            this.setUserPermissions(
              response.data.data.items.map((x) => x.permission.title)
            );
          } else {
            this.failureToast(response.data.message);
          }
        })
        .catch((error) => {
          if (!this.isAPIAborted(error))
            this.failureToast(error.response && error.response.data.message);
        })
        .finally(() => {
          this.fetchRoles();
        });
    },
    fetchRoles() {
      rolesPermissionsService
        .fetchRolesList()
        .then((res) => {
          if (res.data.status) {
            let data = res.data.data;
            if (data) {
              let roles = data.items
                .filter((x) => ![3, 4].includes(x.id))
                .map((role) => {
                  return {
                    title: role.title,
                    title_ar: role.title_ar,
                    type: "link",
                    path: `/users/staff/${role.id}`,
                  };
                });
              this.$store.dispatch("menu/setRolesList", roles);
            }
          } else {
            this.failureToast(res.data.message);
          }
        })
        .catch((error) => {
          if (!this.isAPIAborted(error))
            this.failureToast(error.response && error.response.data.message);
        })
        .finally(() => {
          this.initializeMenuItems();
        });
    },
    setActiveLayout() {
      this.getMenuItems.filter((items) => {
        if (items.path && this.$route.path.includes(items.path))
          this.$store.dispatch("menu/setActiveRoute", items);
        if (!items.children) return false;
        items.children.filter((subItems) => {
          if (subItems.path && this.$route.path.includes(subItems.path))
            this.$store.dispatch("menu/setActiveRoute", subItems);
          if (!subItems.children) return false;
          subItems.children.filter((subSubItems) => {
            if (subSubItems.path && this.$route.path.includes(subSubItems.path))
              this.$store.dispatch("menu/setActiveRoute", subSubItems);
          });
        });
      });
    },
    toggle_sidebar() {
      this.$store.dispatch("menu/opensidebar");
    },
    close_sidebar() {
      this.$store.dispatch("menu/closesidebar");
    },
    setNavActive(item) {
      this.$store.dispatch("menu/setNavActive", item);
    },
    handleResize() {
      this.width = window.innerWidth - 310;
    },
    scrollToRightRTL() {
      this.temp = this.width + this.margin;
      // Checking condition for remaing margin
      if (this.temp === 0) {
        this.margin = this.temp;
        this.hideRightArrowRTL = true;
      }
      // else
      else {
        this.margin += this.width;
        this.hideRightArrowRTL = false;
        this.hideLeftArrowRTL = false;
      }
    },
    scrollToLeftRTL() {
      // If Margin is reach between screen resolution
      if (this.margin <= -this.width) {
        this.margin += -this.width;
        this.hideLeftArrowRTL = true;
      }
      //Else
      else {
        this.margin += -this.width;
        this.hideRightArrowRTL = false;
      }
    },
    scrollToLeft() {
      // If Margin is reach between screen resolution
      if (this.margin >= -this.width) {
        this.margin = 0;
        this.hideLeftArrow = true;
      }
      //Else
      else {
        this.margin += this.width;
        this.hideRightArrow = false;
      }
    },
    scrollToRight() {
      this.temp = this.menuWidth + this.margin;
      // Checking condition for remaing margin
      if (this.temp < this.menuWidth) {
        this.margin = -this.temp;
        this.hideRightArrow = true;
      }
      // else
      else {
        this.margin += -this.width;
        this.hideLeftArrow = false;
      }
    },
    loadComponent(item) {
      if (!item.active) this.setNavActive(item);
      if (this.$route.path !== item.path) this.$router.push(item.path);
    },
  },
};
</script>
