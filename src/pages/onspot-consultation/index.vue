<template>
  <router-view />
</template>
<script>
export default {
  beforeDestroy() {
    this.$socket.emit("remove-admin-availability");
  },
};
</script>
