<template>
  <b-modal
    ref="newReportRequest"
    id="newRequestCustomModal"
    centered
    hide-header
    hide-footer
    no-fade
    body-class="transparent"
  >
    <div
      class="swal2-container swal2-center swal-custom-icon-top-padding swal2-shown custom-swal2"
      style="overflow-y: auto"
    >
      <div
        aria-labelledby="swal2-title"
        aria-describedby="swal2-content"
        class="swal2-popup swal2-modal swal2-show"
        tabindex="-1"
        role="dialog"
        aria-live="assertive"
        aria-modal="true"
        style="display: flex"
      >
        <div class="swal2-header">
          <img
            class="swal2-image"
            src="../../assets/images/m-check.svg"
            alt=""
            style="display: flex"
          />
          <h2 class="swal2-title" id="swal2-title" style="display: flex"></h2>
        </div>
        <div>
          <div class="heading text-center">{{$t("admin.updateEditRequest")}}</div>
          
          <hr />
          <div class="d-flex">
            <div class="booking-time-slots mt-0 w-100 sd">
              {{$t("admin.selectReportStatus")}}
              <div
                class="time-slots-container large d-flex justify-content-center"
              >
                <template>
                  <div class="language-options d-flex mt-4">
                    <b-form-radio-group
                      v-model="selectedDecision"
                      :options="filteredDecisionOptions"
                      name="languages"
                      buttons
                      button-variant="outline-secondary status-btn"
                      class="d-flex flex-wrap"
                    >
                    </b-form-radio-group>
                  </div>
                </template>
              </div>
              <!-- Conditionally show textarea when "Rejected" is selected -->
              <div v-if="selectedDecision === 'rejected'" class="mt-3 p-1">
                <b-form-textarea
                  v-model="rejectionReason"
                  placeholder="Enter reason"
                  rows="3"
                ></b-form-textarea>
              </div>
            </div>
          </div>
        </div>
        <div class="swal2-actions">
          <button
            type="button"
            class="swal2-confirm swal2-styled"
            aria-label=""
            style="display: inline-block; background-color: rgb(68, 102, 242)"
            @click="setUpdateRequest"
          >
            {{ $t("ok") }}
          </button>
          <button
            type="button"
            class="swal2-cancel swal2-styled"
            aria-label=""
            @click="closeModal"
          >
            {{ $t("cancel") }}
          </button>
        </div>
      </div>
    </div>
  </b-modal>
</template>

<script>
export default {
  props: {
    activeTab: {
      type: String,
      required: true,
    },
    existingComments: { 
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      selectedDecision: null,
      rejectionReason: "",
      decisionOptions: [
        { value: "pending", text: "Pending", textAr: "قيد الانتظار" },
        { value: "in-progress", text: "In Progress", textAr: "في تَقَدم" },
        { value: "approved", text: "Approved", textAr: "وافقت" },
        { value: "rejected", text: "Rejected", textAr: "مرفوض" },
      ],
    };
  },
  computed: {
    filteredDecisionOptions() {
      const lang = this.$i18n.locale;
      return this.decisionOptions
        .filter((option) => option.value !== this.activeTab)
        .map((option) => {
          return lang === "en"
            ? { ...option, text: option.text }
            : { ...option, text: option.textAr };
        });
    },
  },
  methods: {
    closeModal() {
      this.$refs.newReportRequest.hide();
      this.selectedDecision = null;
      this.rejectionReason = "";
    },
    setUpdateRequest() {
      if (!this.selectedDecision) {
        this.failureToast(this.$t("detailMedical.selectLanguage"));
        return;
      }

      const payload = {
        status: this.selectedDecision,
        comments: [...this.existingComments],
      };

      if (this.selectedDecision === "rejected") {
        if (!this.rejectionReason) {
          this.failureToast(this.$t("detailMedical.enterReason"));
          return;
        }
        payload.comments.push({
          comment: this.rejectionReason,
        });
      }

      console.log("Payload is:", payload);
      this.$emit("set-update-request", payload);
      this.closeModal();
    },
  },
};
</script>

<style lang="scss" scoped>
.heading {
  font-size: 1.5rem;
  color: var(--theme-secondary);
}
.sub-heading {
  font-size: 0.835rem;
  color: var(--gray);
}
.swal2-image {
  padding: 0.5rem;
}
// .language-options ::v-deep .btn-outline-secondary {
//   border-color: #2b4e66 !important;
// }
</style>
