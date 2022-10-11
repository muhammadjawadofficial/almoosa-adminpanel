<template>
  <report-list
    v-if="appointmentId"
    :appointmentId="appointmentId"
    :backLink="backRoute"
  />
</template>

<script>
import reportList from "../reusable/lab-report-list.vue";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      appointmentId: null,
      backRoute: "default",
    };
  },
  components: {
    reportList,
  },
  computed: {
    ...mapGetters("appointment", ["getSelectedAppointment"]),
    ...mapGetters("labwork", ["getSelectedLabWork"]),
  },
  mounted() {
    if (this.backRoute.includes("Patient")) {
      this.appointmentId = this.getSelectedLabWork.id;
    } else {
      this.appointmentId = this.getSelectedAppointment.id;
    }
  },
  beforeRouteEnter(to, from, next) {
    next((v) => {
      v.backRoute = from.name;
      return true;
    });
  },
};
</script>

<style>
</style>