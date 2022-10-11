<template>
  <router-view />
</template>
<script>
import { mapActions } from "vuex";
export default {
  methods: {
    ...mapActions("appointment", [
      "setSelectedAppointment",
    ]),
    destroyObjects(always = false) {
      if (always || !localStorage.getItem("url")) {
        this.setSelectedAppointment(null);
      }
    },
  },
  created() {
    this.$root.$refs.appointmentModule = this;
  },
  beforeDestroy() {
    this.destroyObjects();
  },
};
</script>