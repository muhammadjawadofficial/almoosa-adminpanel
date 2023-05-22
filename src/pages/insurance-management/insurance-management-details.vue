<template>
  <div
    class="appointment-detail-container medication-detail-container page-body-container standard-width"
    v-if="getSelectedInsuranceManagement"
  >
    <back-navigation
      :backLink="backRoute"
      :title="$t('admin.insuranceRequestDetails')"
    />
    <div class="row">
      <div class="col-sm-12">
        <b-card header-tag="div" no-body class="ash-card card-rounded">
          <b-card-body class="mt-0">
            <div class="appointment-detail">
              <div class="appointment-detail--type">
                <div class="appointment-detail--label">
                  {{ $t("admin.companyName") }}
                </div>
                <div class="appointment-detail--value">
                  {{ getSelectedInsuranceManagement.company_name }}
                </div>
              </div>
            </div>
            <template v-if="getSelectedInsuranceManagement.patient">
              <div class="appointment-detail mt-5">
                <div class="appointment-detail--type">
                  <div class="appointment-detail--label">
                    {{ $t("admin.patientName") }}
                  </div>
                  <div class="appointment-detail--value">
                    {{ getFullName(getSelectedInsuranceManagement.patient) }}
                  </div>
                </div>
              </div>
              <div class="appointment-detail mt-5">
                <div class="appointment-detail--type">
                  <div class="appointment-detail--label">
                    {{ $t("mrn_number") }}
                  </div>
                  <div class="appointment-detail--value">
                    {{
                      translateNumber(
                        getSelectedInsuranceManagement.patient.mrn_number
                      )
                    }}
                  </div>
                </div>
              </div>
              <div class="appointment-detail mt-5">
                <div class="appointment-detail--type">
                  <div class="appointment-detail--label">
                    {{
                      $t(
                        "register." +
                          (getSelectedInsuranceManagement.patient.saudi_id &&
                          getSelectedInsuranceManagement.patient.saudi_id.toLowerCase() !=
                            "null"
                            ? "saudiId"
                            : "iqamaId")
                      )
                    }}
                  </div>
                  <div class="appointment-detail--value">
                    {{
                      translateNumber(
                        getSelectedInsuranceManagement.patient.saudi_id &&
                          getSelectedInsuranceManagement.patient.saudi_id.toLowerCase() !=
                            "null"
                          ? getSelectedInsuranceManagement.patient.saudi_id
                          : getSelectedInsuranceManagement.patient.iqama
                      )
                    }}
                  </div>
                </div>
              </div>
            </template>
            <div
              class="appointment-detail mt-5"
              v-if="
                getSelectedInsuranceManagement.insurance_card &&
                getSelectedInsuranceManagement.insurance_card.id
              "
            >
              <div class="appointment-detail--type">
                <div class="appointment-detail--label">
                  {{ $t("admin.attachment") }}
                </div>
                <div class="appointment-detail--value">
                  <img
                    :src="
                      getImageUrl(getSelectedInsuranceManagement.insurance_card)
                    "
                    class="insurance-id mt-2"
                  />
                </div>
              </div>
            </div>
            <div class="appointment-detail--type mt-5">
              <div class="appointment-detail--label">
                {{ $t("admin.status") }}
              </div>
              <div
                class="appointment-detail--value mt-3 custom-login-input-groups select-box"
                v-if="
                  statuses.includes(
                    getSelectedInsuranceManagement.status.toLowerCase()
                  )
                "
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
                      {{ $t("admin." + props.option.toLowerCase()) }}
                    </div>
                  </template>
                  <template slot="option" slot-scope="props">
                    <div class="option__desc">
                      <span class="option__title">
                        {{ $t("admin." + props.option.toLowerCase()) }}
                      </span>
                    </div>
                  </template>
                </multiselect>
                <div class="custom-state-invalid icon"></div>
              </div>
              <div
                class="appointment-detail--value mt-3"
                v-else-if="getSelectedInsuranceManagement.status == 'approved'"
              >
                {{ $t("admin.sentToPharmacist") }}
              </div>
              <div class="appointment-detail--value mt-3" v-else>
                {{ $t("admin." + getSelectedInsuranceManagement.status) }}
              </div>
            </div>
          </b-card-body>
        </b-card>
        <div class="appointment--action-buttons">
          <button
            class="btn btn-secondary"
            :class="{
              disabled: savedStatus == selectedStatus,
            }"
            @click="
              savedStatus == selectedStatus ? null : updateInsuranceRequest()
            "
          >
            {{ $t("admin.update") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { insuranceService } from "../../services";
export default {
  data() {
    return {
      backRoute: "Insurance Management List",
      statuses: ["sent for approval", "approved", "rejected"],
      selectedStatus: "",
      savedStatus: "",
    };
  },
  computed: {
    ...mapGetters("insuranceManagement", ["getSelectedInsuranceManagement"]),
  },
  mounted() {
    if (!this.getSelectedInsuranceManagement) {
      this.navigateTo(this.backRoute);
    }
    this.selectedStatus =
      this.getSelectedInsuranceManagement.status || this.statuses[0];
    this.savedStatus = this.selectedStatus;
  },
  methods: {
    updateInsuranceRequest() {
      insuranceService
        .updateInsurances(this.getSelectedInsuranceManagement.id, {
          status: this.selectedStatus,
        })
        .then(
          (response) => {
            if (response.data.status) {
              this.successToast(
                this.$t("admin.insuranceRequestUpdatedSuccess")
              );
              this.savedStatus = this.selectedStatus;
            } else {
              this.failureToast(response.data.message);
            }
          },
          (error) => {
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
.insurance-id {
  max-width: 400px;
  max-height: 300px;
}
.custom-login-input-groups {
  .multiselect {
    font-size: 1.25rem;
  }

  &.select-box {
    width: 35%;
    min-width: 200px;
  }
}
</style>