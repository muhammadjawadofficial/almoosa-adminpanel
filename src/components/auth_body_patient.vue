<template>
  <div class="container-fluid">
    <div class="row full-height only-heading">
      <div
        class="col-xl-4 col-lg-6 b-center bg-size image-section"
        :style="{
          backgroundImage:
            'url(' +
            require('../assets/images/login/almoosabuilding.png') +
            ')',
        }"
      >
        <div class="login-dashboard-left">
          <div class="login-dashboard-left--top-section">
            <div class="login-dashboard-left--top-section--logo">
              <img src="../assets/images/logo/ash-logo-xl.svg" alt="" />
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-8 col-lg-6 login-right-padding py-3">
        <div v-if="false" @click="switchLanguage" class="language-switcher">
          {{ layoutType == "ltr" ? "ع" : "En" }}
        </div>
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      layoutType: "ltr",
      role: "",
    };
  },
  computed: {
    ...mapGetters("user", ["getUserRole"]),
  },
  mounted() {
    this.layoutType = this.$i18n.locale == "en" ? "ltr" : "rtl";
    this.switchLanguage("ltr");
    this.updateMenuItems([]);
  },
  methods: {
    ...mapActions("menu", ["updateMenuItems"]),
    ...mapActions("user", ["setUserRole"]),
    switchLanguage(layout) {
      if (layout) {
        this.layoutType = layout;
      } else {
        this.layoutType = this.layoutType == "ltr" ? "rtl" : "ltr";
      }
      this.$store.dispatch("layout/setLayoutType", this.layoutType);
      this.$i18n.locale = this.layoutType == "rtl" ? "ar" : "en";
    },
  },
};
</script>
<style lang="scss" scoped>
.login-dashboard-login-section {
  padding: 1.5rem 2.5rem;
  background: var(--theme-tertiary);
  border-radius: 1rem;
  margin-top: 2.5rem;
  .content {
    color: var(--theme-secondary);
    font-size: 1.375rem;
    line-height: 2rem;
  }
  > .row {
    align-items: center;
    .content,
    .button-group {
      padding-block: 0.5rem;
    }
    .button-group {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      flex-wrap: wrap;
      button {
        flex: 1;
        max-width: 12.5rem;
        padding-block: 0.75rem;
        font-size: 1rem;
        font-weight: 500;
      }
    }
  }
}
.image-section {
  position: relative;
  background-size: cover;
  background-position: center center;
  display: block;
}
.language-switcher {
  position: absolute;
  right: -5px;
  top: 0.5rem;
  background: var(--theme-default);
  padding: 1rem;
  border-radius: 5px;
  color: var(--light);
  cursor: pointer;
}
.login-dashboard-left {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 100%;
  padding: 2rem;
  gap: 8rem;
  &--top-section {
    &--logo {
      img {
        width: 100%;
      }
    }
    &--logo-content {
      .welcome-text {
        font-size: 2.063rem;
      }
      color: white;
      font-size: 2.25rem;
      font-weight: 500;
      margin-top: 0.75rem;
    }
  }
  &--bottom-section {
    display: flex;
    gap: 2rem;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    opacity: 1;
    transition: 0.5s opacity;
    button {
      border-radius: 1rem;
      font-size: 1.25rem;
      padding-block: 0.938rem;
      width: calc(min(100%, 23.5rem));
      vertical-align: middle;
      background: #55b047 0% 0% no-repeat padding-box;
    }
  }
}
.full-height {
  min-height: 100vh;
  @media (max-width: 991px) {
    .login-right-padding {
      position: relative;
      top: -2rem;
      background: white;
      border-top-right-radius: 2rem;
      border-top-left-radius: 2rem;
      padding-top: 2.5rem !important;
    }
    .image-section {
      padding-bottom: 2rem;
    }
  }
  &.only-heading {
    .login-dashboard-left {
      justify-content: flex-start;
      padding-block: 8rem;
      &--top-section {
        padding-block-start: 5rem;
      }
    }
    @media (max-width: 991px) {
      align-content: flex-start;
      .image-section {
        height: fit-content;
        padding-block: 3rem;
      }
      .login-dashboard-left {
        padding-block: 0;
        justify-content: flex-start;
        align-items: center;
        &--top-section {
          padding-block-start: 0;
        }
      }
    }
  }
}
.login-right-padding {
  padding-inline: 2.7rem;
}
</style>