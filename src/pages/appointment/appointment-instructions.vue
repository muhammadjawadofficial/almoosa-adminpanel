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
        <div class="mt-5 forceRtl">
          <b-form-textarea
            id="textarea"
            v-model="instructionsAr"
            placeholder="Enter something..."
            rows="10"
            max-rows="15"
          ></b-form-textarea>
        </div>
      </template>

      <div class="view-instructions-container" v-else>
        <div class="no-data" v-if="getLoading">{{ $t("loading") }}...</div>
        <ul class="swal2-list" v-else-if="getInstructionsInArray.length">
          <li
            v-for="(instruction, index) in getInstructionsInArray"
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
        v-if="
          isEditing && getInstructionsInArray && getInstructionsInArray.length
        "
        @click="cancelAppointment"
        class="btn btn-tertiary"
      >
        {{ $t("admin.cancel") }}
      </button>
      <button v-if="!isEditing" @click="preview" class="btn btn-secondary">
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
      instructionsAr: "",
      instructionsArray: [],
      instructionsArrayAr: [],
      savedInstructions: {
        instructions: "",
      },
      savedInstructionsAr: {
        instructions: "",
      },
      isEditing: false,
    };
  },
  mounted() {
    this.fetchAppointmentInstruction();
  },
  computed: {
    getInstructionsInArray() {
      if (this.$i18n.locale == "en") {
        return this.instructionsArray;
      } else {
        return this.instructionsArrayAr;
      }
    },
  },
  methods: {
    getInstructionArray(instruction) {
      return this[instruction].split(/\r?\n/).filter((x) => x != "");
    },
    fetchAppointmentInstruction() {
      this.setLoadingState(true);
      Promise.all([
        appointmentService.fetchAppointmentInstructions(
          "?title=TELE_INSTRUCTIONS"
        ),
        appointmentService.fetchAppointmentInstructions(
          "?title=TELE_INSTRUCTIONS_AR"
        ),
      ])
        .then((res) => {
          if (res[0].data.status) {
            let data = res[0].data.data.items[0];
            let parsedData = JSON.parse(data.value);
            this.savedInstructions = {
              ...data,
              instructions: parsedData,
            };
            this.instructionsArray = parsedData.filter((x) => x != "");
          } else {
            this.failureToast(res[0].data.messsage);
          }
          if (res[1].data.status) {
            let dataAr = res[1].data.data.items[0];
            let parsedDataAr = JSON.parse(dataAr.value);
            this.savedInstructionsAr = {
              ...dataAr,
              instructions: parsedDataAr,
            };
            this.instructionsArrayAr = parsedDataAr.filter((x) => x != "");
          } else {
            this.failureToast(res[1].data.messsage);
          }

          console.log(this.instructionsArray);
          this.appointmentStatus = null;
          this.setLoadingState(false);
        })
        .catch((err) => {
          this.appointmentStatus = null;
          this.setLoadingState(false);
          if (!this.isAPIAborted(err))
            this.failureToast(
              err.response && err.response.data && err.response.data.messsage
            );
        });

      // this.setLoadingState(true);
      // appointmentService
      //   .fetchAppointmentInstructions("?title=TELE_INSTRUCTIONS")
      //   .then(
      //     (response) => {
      //       if (response.data.status) {
      //         let data = response.data.data.items[0];
      //         this.savedInstructions = {
      //           ...data,
      //           instructions: JSON.parse(data.value),
      //         };
      //       } else {
      //         this.failureToast(response.data.messsage);
      //       }
      //       this.appointmentStatus = null;
      //       this.setLoadingState(false);
      //     },
      //     (error) => {
      //       this.appointmentStatus = null;
      //       this.setLoadingState(false);
      //       if (!this.isAPIAborted(error))
      //         this.failureToast(
      //           error.response &&
      //             error.response.data &&
      //             error.response.data.messsage
      //         );
      //     }
      //   );
      // this.setLoadingState(true);
      // appointmentService
      //   .fetchAppointmentInstructions("?title=TELE_INSTRUCTIONS_AR")
      //   .then(
      //     (response) => {
      //       if (response.data.status) {
      //         let data = response.data.data.items[0];
      //         this.savedInstructionsAr = {
      //           ...data,
      //           instructions: JSON.parse(data.value),
      //         };
      //       } else {
      //         this.failureToast(response.data.messsage);
      //       }
      //       this.appointmentStatus = null;
      //       this.setLoadingState(false);
      //     },
      //     (error) => {
      //       this.appointmentStatus = null;
      //       this.setLoadingState(false);
      //       if (!this.isAPIAborted(error))
      //         this.failureToast(
      //           error.response &&
      //             error.response.data &&
      //             error.response.data.messsage
      //         );
      //     }
      //   );
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
      let instructions = this.instructionsArray;
      let instructionsAr = this.instructionsArrayAr;
      this.setInstructions();
      if (!this.isEditing) {
        this.isEditing = true;
        return;
      }
      this.updateAppointmentInstruction(
        this.savedInstructions.id,
        JSON.stringify(instructions)
      );
      this.updateAppointmentInstruction(
        this.savedInstructionsAr.id,
        JSON.stringify(instructionsAr)
      );
      this.isEditing = false;
    },
    cancelAppointment() {
      this.setInstructions();
      this.isEditing = false;
    },
    setInstructions() {
      this.instructions = this.savedInstructions.instructions.join("\r\n");
      this.instructionsAr = this.savedInstructionsAr.instructions.join("\r\n");
    },
    preview() {
      let html =
        "<ul class='swal2-list'>" +
        this.getInstructionsInArray.map((x) => "<li>" + x + "</li>").join("") +
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