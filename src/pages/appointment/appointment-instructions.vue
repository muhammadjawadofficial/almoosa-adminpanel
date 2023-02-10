<template>
  <div class="page-body-container standard-width">
    <back-navigation title="Instructions" :showBack="false" />
    <div class="instructions-container mt-3">
      <template v-if="isEditing">
        <div class="info-box w200 my-3 font-secondary">
          <strong>NOTE:</strong> Instructions will be displayed in bullet
          points. Write each point in new line. Press Enter for a new line.
        </div>
        <b-form-textarea
          id="textarea"
          v-model="instructions"
          placeholder="Enter something..."
          rows="10"
          max-rows="15"
        ></b-form-textarea>
      </template>
      <div class="view-instructions-container" v-else>
        <div class="no-data" v-if="getLoading">{{ $t("loading") }}...</div>
        <ul class="swal2-list" v-else-if="getInstructionArray.length">
          <li
            v-for="(instruction, index) in getInstructionArray"
            :key="'instruction-line-' + index"
          >
            {{ instruction }}
          </li>
        </ul>
        <div v-else class="no-data">
          {{ $t("noData") }}
        </div>
      </div>
    </div>
    <div class="appointment--action-buttons mt-5">
      <button class="btn btn-primary" @click="saveInstructions">
        {{ $t("admin." + (isEditing ? "save" : "edit")) }}
        {{ $t("admin.instructions") }}
      </button>
      <button
        v-if="isEditing && getInstructionArray && getInstructionArray.length"
        @click="cancelAppointment"
        class="btn btn-tertiary"
      >
        {{ $t("admin.cancel") }}
      </button>
      <button
        v-if="getInstructionArray.length"
        @click="preview"
        class="btn btn-secondary"
      >
        {{ $t("admin.preview") }}
      </button>
    </div>
  </div>
</template>
  
  <script>
import { appointmentService } from "../../services";
export default {
  data() {
    return {
      instructions: "",
      savedInstructions: {
        instructions: "",
      },
      isEditing: false,
    };
  },
  mounted() {
    this.fetchAppointmentInstruction();
  },
  computed: {
    getInstructionArray() {
      let instructions = this.instructions.split(/\r?\n/);
      return instructions.filter((x) => x != "");
    },
  },
  methods: {
    fetchAppointmentInstruction() {
      this.setLoadingState(true);
      appointmentService.fetchAppointmentInstructions().then(
        (response) => {
          if (response.data.status) {
            let data = response.data.data.items[0];
            this.savedInstructions = {
              ...data,
              instructions: data.value,
            };
            this.setInstructions();
          } else {
            this.failureToast(response.data.messsage);
          }
          this.appointmentStatus = null;
          this.setLoadingState(false);
        },
        (error) => {
          this.appointmentStatus = null;
          this.setLoadingState(false);
          if (!this.isAPIAborted(error))
            this.failureToast(
              error.response &&
                error.response.data &&
                error.response.data.messsage
            );
        }
      );
    },
    updateAppointmentInstruction(id, instructions) {
      this.setLoadingState(true);
      appointmentService.updateAppointmentInstructions(id, instructions).then(
        (response) => {
          if (response.data.status) {
            this.fetchAppointmentInstruction();
          } else {
            this.failureToast(response.data.messsage);
          }
          this.appointmentStatus = null;
          this.setLoadingState(false);
        },
        (error) => {
          this.appointmentStatus = null;
          this.setLoadingState(false);
          if (!this.isAPIAborted(error))
            this.failureToast(
              error.response &&
                error.response.data &&
                error.response.data.messsage
            );
        }
      );
    },
    saveInstructions() {
      let instructions = this.getInstructionArray;
      this.setInstructions();
      if (!this.isEditing) {
        this.isEditing = true;
        return;
      }
      this.updateAppointmentInstruction(
        this.savedInstructions.id,
        JSON.stringify(instructions)
      );
      this.isEditing = false;
    },
    cancelAppointment() {
      this.setInstructions();
      this.isEditing = false;
    },
    setInstructions() {
      this.instructions = this.savedInstructions.instructions.join("\r\n");
    },
    preview() {
      let html =
        "<ul class='swal2-list'>" +
        this.getInstructionArray.map((x) => "<li>" + x + "</li>").join("") +
        "</ul>";
      this.successIconListModal(
        this.$t("appointmentDetail.instructionTitle"),
        html,
        "m-clipboard",
        this.$t("appointmentDetail.joinCall")
      );
    },
  },
};
</script>
  
<style lang="scss" scoped>
</style>