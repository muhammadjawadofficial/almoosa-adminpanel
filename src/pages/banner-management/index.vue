<template>
  <router-view />
</template>
  <script>
import { mapActions } from "vuex";
export default {
  methods: {
    ...mapActions("insuranceManagement", ["setSelectedInsuranceManagement"]),
  },
  beforeDestroy() {
    this.setSelectedInsuranceManagement(null);
  },
};
</script>