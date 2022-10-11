<template>
  <router-view />
</template>
<script>
import { mapActions } from "vuex";
export default {
  methods: {
    ...mapActions("promotion", [
      "setSelectedPromotion",
      "setSelectedPromotionGroup",
    ]),
  },
  beforeDestroy() {
    this.setSelectedPromotion(null);
    this.setSelectedPromotionGroup(null);
  },
};
</script>