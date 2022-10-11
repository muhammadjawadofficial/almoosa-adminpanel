<template>
  <div>
    <my-medical-insurance
      v-if="userId"
      :backLink="backRoute"
      :userId="userId"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import MyMedicalInsurance from "../reusable/my-medical-insurance";
export default {
  data() {
    return {
      backRoute: "default",
      userId: null,
    };
  },
  components: {
    MyMedicalInsurance,
  },
  computed: {
    ...mapGetters("appointment", ["getSelectedAppointment"]),
    ...mapGetters("user", ["getSelectedUser"]),
  },
  mounted() {
    if (this.backRoute.includes("Patient")) {
      this.userId = this.getSelectedUser.id;
    } else {
      this.userId = this.getSelectedAppointment.raw.patient.id;
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