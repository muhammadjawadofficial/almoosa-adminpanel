<template>
  <div class="onspot-lobby-container page-body-container standard-width">
    <button @click="updateAvailability(true)" class="btn btn-primary availability-btn">
      <i class="fa fa-spinner"></i>
      {{ $t("onspotConsultation.setAvailable") }}
    </button>
    <!-- Existing b-cards for patient list -->
    <div
      class="no-data justify-content-center d-flex h-100"
      v-if="requests.length === 0"
    >
      <h2>
        {{ $t("onspotConsultation.noPatient") }}
      </h2>
    </div>
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
          :title="$t('onspotConsultation.patientMrn') + translateNumber(request.user.mrn_number)"
          :sub-title="
            $t('onspotConsultation.patientName')
            + getFullName(request.user)
          "
          class="text-center"
        >
          <b-card-text>
            <strong>{{ $t("onspotConsultation.patientStatus") }}</strong>
            {{ $t(`onspotConsultation.status.${request.status}`) }}
          </b-card-text>
          <b-button @click="acceptConsultation(request)" variant="success">
            {{ $t("accept") }}
          </b-button>
        </b-card>
      </b-col>
    </b-row>

    <!-- New b-card for top-right fixed position -->
    <div v-if="currentRequest" class="fixed-top-right-card">
      <b-card
        :title="
          $t('onspotConsultation.patientMrn') + translateNumber(currentRequest.user.mrn_number)
        "
        :sub-title="
          $t('onspotConsultation.patientName') + getFullName(currentRequest.user)
        "
        class="text-center animate-border"
      >
        <img :src="ringerGif" alt="Ringer GIF" />
        <b-card-text>
          <strong>{{ $t("onspotConsultation.patientStatus") }}</strong>
          {{ $t(`onspotConsultation.status.${currentRequest.status}`) }}
        </b-card-text>
        <div class="btn-container">
          <img
            class="skip-call"
            @click="acceptConsultation(currentRequest)"
            src="@/assets/accept-call.png"
            alt=""
          />
          <img @click="skipRequest" class="skip-call" src="@/assets/skip-call.png" alt=""/>
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
      Mrn: null,
      requests: [],
      currentRequest: null,
      isAvailable: false,
      ringtone: null,
      ringerGif: require("@/assets/ringer.gif"),
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
    ...mapActions("appointment", ["setSelectedOnspotConsultation"]),
    initializeSocket() {
      console.log("Socket is:", this.$socket);
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
      console.log("Data is:", this.requests);
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
    },
    handleErrorConnecting(data) {
      console.log("Error connecting data is", data);
      this.setLoadingState(false);
    },
    async handleCallConnect(data) {
      console.error("Data is:", data);

      try {
        this.stopRingtone();
        let response = await data;
        this.setSelectedOnspotConsultation(response);
        this.navigateTo("Connect Zoom Native");
      } catch (error) {
        console.error("Error in handleCallConnect:", error);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
img.skip-call {
  transition: transform 0.3s ease-in-out;
}

img.skip-call:hover {
  transform: scale(1.2); /* Scales the image by 20% on hover */
}

.fixed-top-right-card {
  position: fixed;
  top: calc(var(--header-height) + 20px);
  right: 20px;
  z-index: 10;
  width: 300px;
}

.btn-container {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.btn-container > img {
  cursor: pointer;
  height: 50px;
}

.animate-border {
  .card-body {
    background-color: #fff !important;
    border-radius: 10px;
    text-align: center;
    .card-title,
    .card-text {
      margin-bottom: 2rem;
    }
  }
  padding: 0.5rem;
  > * {
    z-index: 1;
  }
  &:before {
    content: "";
    background: linear-gradient(
      -45deg,
      var(--theme-default),
      var(--theme-tertiary),
      var(--theme-default)
    );
    position: absolute;
    inset: 0;
    z-index: 0;
    border-radius: 15px;
    display: block;
    background-size: 400%; /* Stretch the background to create more movement */
    animation: 3s infinite border-rotate linear; /* Smooth, continuous animation */
  }
}

@keyframes border-rotate {
  0% {
    background-position: 0% 50%; /* Initial gradient position */
  }
  50% {
    background-position: 100% 50%; /* Midpoint of the rotation */
  }
  100% {
    background-position: 0% 50%; /* End of rotation */
  }
}
.availability-btn:hover {
  background-color: var(--theme-secondary) !important;
  border-color: var(--theme-secondary) !important;
}
</style>
