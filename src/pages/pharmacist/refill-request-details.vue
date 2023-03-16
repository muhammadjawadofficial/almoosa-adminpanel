<template>
  <div
    class="appointment-detail-container medication-detail-container page-body-container standard-width"
    v-if="getSelectedMedication"
  >
    <back-navigation
      :backLink="backRoute"
      :title="$t('myMedication.medicationDetails')"
    />
    <div class="row">
      <div class="col-sm-12">
        <b-card header-tag="div" no-body class="ash-card card-rounded">
          <b-card-body class="mt-0">
            <div class="header-section">
              <div class="header-section--info">
                <div class="icon">
                  <pill-bg-svg />
                </div>
                <div class="name">
                  <div class="title">
                    {{
                      getSelectedMedication.title +
                      " " +
                      getSelectedMedication.variation
                    }}
                  </div>
                  <div class="subTitle w200">
                    {{ getSelectedMedication.description }}
                  </div>
                </div>
              </div>
              <div class="header-section--button"></div>
            </div>
            <div class="appointment-detail mt-5">
              <div class="appointment-detail--type">
                <div class="appointment-detail--label">
                  {{ $t("myMedication.doctorInstruction") }}
                </div>
                <div class="appointment-detail--value">
                  {{ getSelectedMedication.instructions }}
                </div>
              </div>
              <div class="appointment-detail--sepecialist mt-5">
                <div class="appointment-detail--label">
                  {{ $t("myMedication.time") }}
                </div>
                <div class="appointment-detail--value">
                  {{ getSelectedMedication.description }}
                </div>
                <div class="appointment-detail--value--details mt-3">
                  <span
                    v-if="getSelectedMedication.morning_reminder"
                    class="btn btn-secondary btn-pill"
                    >{{
                      translateNumber(
                        removeSecondsFromTimeString(
                          getSelectedMedication.morning_reminder
                        )
                      )
                    }}
                  </span>
                  <span
                    v-if="getSelectedMedication.afternoon_reminder"
                    class="btn btn-dark-blue btn-pill"
                    >{{
                      translateNumber(
                        removeSecondsFromTimeString(
                          getSelectedMedication.afternoon_reminder
                        )
                      )
                    }}
                  </span>
                  <span
                    v-if="getSelectedMedication.evening_reminder"
                    class="btn btn-primary btn-pill"
                    >{{
                      translateNumber(
                        removeSecondsFromTimeString(
                          getSelectedMedication.evening_reminder
                        )
                      )
                    }}
                  </span>
                </div>
              </div>
            </div>
          </b-card-body>
        </b-card>
        <div class="appointment--action-buttons">
          <button class="btn btn-secondary" @click="completeRequest">
            {{ $t("admin.completeRequest") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
  
  <script>
import { mapGetters } from "vuex";
import { medicationService } from "../../services";
export default {
  data() {
    return {
      backRoute: "",
      selectedStatus: null,
      selectedStatusState: null,
      statuses: ["pending", "rejected"],
      deliveryStatuses: ["pending", "delivered"],
    };
  },
  computed: {
    ...mapGetters("myMedication", ["getSelectedMedication"]),
  },
  mounted() {
    this.backRoute = "Pharmacist Dashboard";
    if (!this.getSelectedMedication) {
      this.navigateTo(this.backRoute);
    }
    this.selectedStatus = this.getSelectedMedication.status;
  },
  methods: {
    completeRequest() {
      this.updateMedicationRefill("completed");
    },
    updateMedicationRefill(status = null) {
      this.selectedStatusState = !!this.selectedStatus;
      if (!this.selectedStatusState) return;
      this.setLoadingState(true);
      medicationService
        .updateMedicationRefill(this.getSelectedMedication.id, {
          status: status || this.selectedStatus,
        })
        .then(
          (response) => {
            if (response.data.status) {
              this.getSelectedMedication.status = status || this.selectedStatus;
              this.successToast(this.$t("admin.medicationRefillUpdateSuccess"));
            } else {
              this.failureToast(response.data.messsage);
            }
            this.setLoadingState(false);
          },
          (error) => {
            this.setLoadingState(false);
            if (!this.isAPIAborted(error))
              this.failureToast(
                error.response &&
                  error.response.data &&
                  error.response.data.message
              );
          }
        );
    },
  },
};
</script>
  
  <style lang="scss" scoped>
.appointment-detail--value--details {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.appointment-detail {
  &--label {
    font-size: 1.25rem;
    color: black;
  }

  &--value {
    color: #8696b8;
  }
}

.header-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;

  @media (max-width: 700px) {
    &--button {
      width: 100%;
      text-align: end;
    }
  }

  @media (max-width: 325px) {
    justify-content: center;

    &--button {
      text-align: center;
    }
  }

  &--info {
    display: flex;
    align-items: center;
    gap: 1rem;

    @media (max-width: 325px) {
      flex-direction: column;
    }

    :deep {
      .svg-icon-fill {
        fill: var(--theme-default);
      }

      .svg-icon-fill-bg {
        fill: #fbfaf7;
      }
    }

    .icon {
      width: 109px;
      height: 109px;

      svg {
        width: 100%;
        height: 100%;
        aspect-ratio: 1;
      }
    }

    .title {
      font-size: 1.813rem;
    }

    .subTitle {
      font-size: 1rem;
      color: #8696b8;
    }
  }
}

.custom-login-input-groups {
  .multiselect {
    font-size: 1.25rem;
  }

  &.select-box {
    width: 25%;
    min-width: 200px;
  }
}
</style>