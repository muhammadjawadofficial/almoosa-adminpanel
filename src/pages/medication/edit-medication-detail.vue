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
                      getSelectedMedication[getLocaleKey("patient_name")] ||
                      "N/A"
                    }}
                  </div>
                </div>
              </div>
              <div class="header-section--button"></div>
            </div>
            <div class="appointment-detail mt-5">
              <div class="appointment-detail--type">
                <div class="appointment-detail--label">
                  {{ $t("admin.consultingDoctor") }}
                </div>
                <div class="appointment-detail--value">
                  <template v-if="getSelectedMedication.doctor_name">
                    {{ $t("dr") }}
                    {{
                      getSelectedMedication[getLocaleKey("doctor_name")] ||
                      "N/A"
                    }}
                  </template>
                  <template v-else> N/A </template>
                </div>
              </div>
              <div class="appointment-detail--sepecialist mt-5">
                <div class="appointment-detail--label">
                  {{ $t("admin.phoneNumber") }}
                </div>
                <div class="appointment-detail--value">
                  {{ getSelectedMedication.phone_number || "N/A" }}
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
              <!-- Refill Request Section -->
              <div
                class="appointment-detail--type mt-5"
                v-if="!getSelectedMedication.is_delivery"
              >
                <div class="appointment-detail--label">
                  {{ $t("admin.refillRequest") }}
                </div>
                <div
                  class="appointment-detail--value mt-3 custom-login-input-groups select-box"
                  v-if="statuses.includes(this.getSelectedMedication.status)"
                >
                  <multiselect
                    v-model="selectedStatus"
                    :options="statuses"
                    :placeholder="$t('admin.selectStatus')"
                    :selectLabel="$t('admin.selectLabel')"
                    :selectedLabel="$t('admin.selectedLabel')"
                    :deselectLabel="$t('admin.deselectLabel')"
                  >
                    <template slot="singleLabel" slot-scope="props">
                      <div class="multiselect__with-icon">
                        {{ $t("admin." + props.option) }}
                      </div>
                    </template>
                    <template slot="option" slot-scope="props">
                      <div class="option__desc">
                        <span class="option__title">
                          {{ $t("admin." + props.option) }}
                        </span>
                      </div>
                    </template>
                  </multiselect>
                  <div
                    class="custom-state-invalid icon"
                    :class="{
                      'is-invalid': selectedStatusState == false,
                    }"
                  ></div>
                </div>

                <!-- Delivery Request Section -->
                <div
                  class="appointment-detail--value mt-3"
                  v-else-if="getSelectedMedication.status == 'approved'"
                >
                  {{ $t("admin.sentToPharmacist") }}
                </div>
                <div class="appointment-detail--value mt-3" v-else>
                  {{ $t("admin." + getSelectedMedication.status) }}
                </div>
              </div>
              <div class="appointment-detail--type mt-5" v-else>
                <div class="appointment-detail--label">
                  {{ $t("admin.deliveryRequest") }}
                </div>
                <div
                  class="appointment-detail--value mt-3 custom-login-input-groups select-box"
                  v-if="statuses.includes(this.getSelectedMedication.status)"
                >
                  <multiselect
                    v-model="selectedStatus"
                    :options="deliveryStatuses"
                    :placeholder="$t('admin.selectStatus')"
                    :selectLabel="$t('admin.selectLabel')"
                    :selectedLabel="$t('admin.selectedLabel')"
                    :deselectLabel="$t('admin.deselectLabel')"
                  >
                    <template slot="singleLabel" slot-scope="props">
                      <div class="multiselect__with-icon">
                        {{ $t("admin." + props.option) }}
                      </div>
                    </template>
                    <template slot="option" slot-scope="props">
                      <div class="option__desc">
                        <span class="option__title">
                          {{ $t("admin." + props.option) }}
                        </span>
                      </div>
                    </template>
                  </multiselect>
                  <div
                    class="custom-state-invalid icon"
                    :class="{
                      'is-invalid': selectedStatusState == false,
                    }"
                  ></div>
                </div>
                <div
                  class="appointment-detail--value mt-3"
                  v-else-if="getSelectedMedication.status == 'approved'"
                >
                  {{ $t("admin.sentToPharmacist") }}
                </div>
                <div class="appointment-detail--value mt-3" v-else>
                  {{ $t("admin." + getSelectedMedication.status) }}
                </div>
              </div>
            </div>
          </b-card-body>
        </b-card>
        <div
          class="appointment--action-buttons"
          v-if="
            !getSelectedMedication.is_delivery &&
            statuses.includes(this.getSelectedMedication.status)
          "
        >
          <button class="btn btn-secondary" @click="updateMedicationRefill()">
            {{ $t("admin.update") }}
          </button>
          <button class="btn btn-secondary" @click="sendToPharma">
            {{ $t("admin.sendToPharmacist") }}
          </button>
        </div>
        <div
          class="appointment--action-buttons"
          v-if="
            getSelectedMedication.is_delivery &&
            getSelectedMedication.status !== 'delivered'
          "
        >
          <button class="btn btn-secondary" @click="updateMedicationRefill()">
            {{ $t("admin.update") }}
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
    this.backRoute = "All Medication";
    if (!this.getSelectedMedication) {
      this.navigateTo(this.backRoute);
    }
    this.selectedStatus = this.getSelectedMedication.status;
  },
  methods: {
    sendToPharma() {
      this.updateMedicationRefill("approved");
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