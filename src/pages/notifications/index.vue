<template>
    <router-view />
  </template>
    <script>
  import { mapActions } from "vuex";
  export default {
    methods: {
      ...mapActions("notificationManagement", ["setSelectedNotificationManagement"]),
    },
    beforeDestroy() {
      this.setSelectedNotificationManagement(null);
    },
  };
  </script>