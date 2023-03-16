<template>
  <div>
    <div
      class="coming-soon-section"
      :class="{ guest: isGuest }"
      v-if="!loading"
    >
      <div class="heading w600">
        <span class="font-secondary">{{ $t("comingSoon.coming") }}</span>
        <span class="font-primary">{{ $t("comingSoon.soon") }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      isGuest: false,
      loading: true,
    };
  },
  watch: {
    getMenuItems() {
      this.loadDashboard();
    },
  },
  mounted() {
    this.loadDashboard();
  },
  mounted() {
    this.isGuest = this.$route.path.includes("guest");
  },
  computed: {
    ...mapGetters("menu", ["getMenuItems"]),
    ...mapGetters("user", ["getUserInfo"]),
  },
  methods: {
    loadDashboard() {
      this.loading = true;
      let firstItem = this.getMenuItems[0];
      let getPath = (item) => {
        if (item.children && item.children.length) {
          let subChild = item.children[0];
          return getPath(subChild);
        }
        return item.path;
      };
      let path = getPath(firstItem);
      if (path && path != this.$route.path) {
        this.$router.replace(path);
      }
      this.loading = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.coming-soon-section {
  height: calc(100vh - var(--header-height) - var(--footer-height));
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 0.75em;
  font-size: 1rem;
  &.guest {
    height: 95vh;
    @media (max-width: 1200px) {
      height: 65vh;
    }
    @media (max-width: 992px) {
      height: auto;
      padding-block: 5em;
    }
  }
  @media (max-width: 1200px) {
    font-size: 0.75em;
  }
  @media (max-width: 992px) {
    font-size: 0.5em;
  }
  .heading {
    font-size: 4em;
    line-height: 1;
    gap: 0.3em;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    text-align: center;
  }
  .sub-heading {
    font-size: 1em;
    color: black;
    @media (max-width: 992px) {
      font-size: 2em;
    }
  }
}
</style>