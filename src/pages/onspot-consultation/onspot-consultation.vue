<template>
  <div class="doctor-list-container page-body-container standard-width">
    <button @click="updateAvailability(true)" class="btn btn-secondary">
      Set Available
    </button>
    <!-- Existing b-cards for patient list -->
    <b-row>
      <b-col
        v-for="(request, index) in requests"
        :key="index"
        cols="12"
        md="6"
        lg="4"
        class="mb-4 mt-4"
      >
        <b-card
          :title="'Patient Id: ' + request.user.mrn_number"
          :sub-title="
            'Patient Name: ' +
            request.user.first_name +
            ' ' +
            request.user.middle_name +
            ' ' +
            request.user.family_name
          "
          class="text-center"
        >
          <b-card-text>
            <strong>Status:</strong> {{ request.status }}
          </b-card-text>
          <b-button @click="acceptConsultation(request)" variant="success">
            Accept
          </b-button>
        </b-card>
      </b-col>
    </b-row>

    <!-- New b-card for top-right fixed position -->
    <div v-if="currentRequest" class="fixed-top-right-card">
      <b-card
        :title="'Patient Id: ' + currentRequest.user.mrn_number"
        :sub-title="
          'Patient Name: ' +
          currentRequest.user.first_name +
          ' ' +
          currentRequest.user.middle_name +
          ' ' +
          currentRequest.user.family_name
        "
        class="text-center"
      >
        <b-card-text>
          <strong>Status:</strong> {{ currentRequest.status }}
        </b-card-text>
        <div class="btn-container">
          <b-button
            @click="acceptConsultation(currentRequest)"
            variant="primary"
            >Accept</b-button
          >
          <b-button @click="skipRequest" variant="danger">Skip</b-button>
        </div>
      </b-card>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      patientId: null,
      requests: [],
      currentRequest: null,
      isAvailable: false,
      ringtone: null,
    };
  },
  mounted() {
    console.log("component mounted");
    this.initializeSocket();
    this.ringtone = new Audio(require("@/assets/muzee.mp3"));
    this.ringtone.addEventListener("ended", this.playRingtone);
  },
  beforeDestroy() {
    this.$socket.off("request-list-updated");
    this.$socket.off("error-connecting");
    this.$socket.off("call-connect");
    this.stopRingtone();
    this.ringtone.removeEventListener("ended", this.playRingtone);
  },
  computed: {
    ...mapGetters("user", ["getUserInfo"]),
    ...mapGetters("appointment", ["getOnspotConsultation"]),
  },
  methods: {
    ...mapActions("appointment", [
      "setSelectedOnspotConsultation",
      "setSelectedCall",
    ]),
    initializeSocket() {
      if (this.$socket && this.$socket.connected) {
        this.updateAvailability();
      } else {
        this.$socket.on("connect", (res) => {
          this.updateAvailability();
        });
      }
      this.$socket.emit("fetch-requests");
      this.$socket.on("request-list-updated", this.handleRequestUpdate);
      this.$socket.on("error-connecting", this.handleErrorConnecting);
      this.$socket.on("call-connect", this.handleCallConnect);
    },
    handleRequestUpdate(data) {
      this.requests = data;
      if (data.length > 0) {
        this.currentRequest = data[0];
        this.playRingtone();
      } else {
        this.currentRequest = null;
        this.stopRingtone();
      }
    },
    playRingtone() {
      if (this.ringtone) {
        this.ringtone.currentTime = 0;
        this.ringtone.play();
      }
    },
    stopRingtone() {
      if (this.ringtone) {
        this.ringtone.pause();
        this.ringtone.currentTime = 0;
      }
    },
    acceptConsultation(request) {
      this.$socket.emit("accept-consultation", {
        patient_id: request.user_id,
        doctor_id: this.getUserInfo.id,
      });
      console.log("Accepted consultation for:", {
        patient_id: request.user_id,
        request_id: request.request_id,
        doctor_id: this.getUserInfo.id,
      });
      this.setLoadingState(true);
    },
    skipRequest() {
      const currentIndex = this.requests.indexOf(this.currentRequest);
      const nextIndex = currentIndex + 1;
      if (nextIndex < this.requests.length) {
        this.currentRequest = this.requests[nextIndex];
        this.playRingtone();
      } else {
        this.currentRequest = null;
        this.stopRingtone();
      }
    },
    updateAvailability() {
      this.$socket.emit("register-admin-availability", {
        request_id: this.$socket.id,
        user_id: this.getUserInfo.id,
        role_id: this.getUserInfo.role_id,
      });
      console.log("adminsAvailability emitted");
    },
    handleErrorConnecting(data) {
      console.log("Error connecting data is", data);
      this.setLoadingState(false);
    },
    async handleCallConnect(data) {
      try {
        this.stopRingtone();
        let response = await data;
        this.setSelectedCall(response);
        this.setSelectedOnspotConsultation(response);
        this.navigateTo("Connect Zoom Native");
      } catch (error) {
        console.error("Error in handleCallConnect:", error);
      }
    },
  },
};
</script>

<style scoped>
.fixed-top-right-card {
  position: fixed;
  top: calc(var(--header-height) + 20px);
  right: 20px;
  z-index: 10;
  width: 300px;
}

.btn-container {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}
</style>
