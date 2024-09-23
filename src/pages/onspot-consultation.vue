<template>
  <div>
    <button @click="updateAvailability(true)">Set Available</button>
    <input type="text" v-model="patientId" />
    <button @click="acceptConsultation()">Accept</button>
  </div>
</template>

<script>
import io from "socket.io-client";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      socket: null,
      socketURL: process.env.VUE_APP_SERVER,
      patientId: "3642119",
    };
  },
  mounted() {
    this.initializeSocket();
  },
  beforeDestroy() {
    this.destroySocket();
  },
  computed: {
    ...mapGetters("user", ["getUserInfo"]),
  },
  methods: {
    initializeSocket() {
      // Establish the connection with the WebSocket server
      this.socket = io(this.socketURL);
      this.socket.on("connect_error", (err) => {
        console.log(`connect_error due to ${err.message}`);
      });
      this.socket.on("connect", (res) => {
        console.log("WebSocket connected", this.socketURL);
        this.updateAvailability();
      });
      this.socket.on("requestUpdate", this.handleRequestUpdate);
      this.socket.on("initial-requests", this.handleRequestUpdate);
      this.socket.on("error-connecting", this.handleErrorConnecting);
      this.socket.on("call-connect", this.handleCallConnect);
    },
    handleRequestUpdate(requests) {
      console.log(requests);
    },
    acceptConsultation() {
      this.socket.emit("acceptConsultation", { patient_id: this.patientId });
    },
    updateAvailability() {
      this.socket.emit("registerAdminAvailability", {
        request_id: this.socket.id,
        user_id: this.getUserInfo.id,
        role_id: this.getUserInfo.role_id,
      });
      console.log("adminsAvailability emitted");
    },
    handleErrorConnecting(data) {
      console.log(data);
    },
    handleCallConnect(data) {
      console.log(data);
    },
    destroySocket() {
      if (this.socket) {
        // Disconnect the socket and clean up event listeners
        this.socket.disconnect();
        console.log("WebSocket disconnected");
      }
    },
  },
};
</script>

<style>
</style>