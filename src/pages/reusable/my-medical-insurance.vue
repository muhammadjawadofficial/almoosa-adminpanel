<template>
  <div
    class="
      my-medical-insurance-container
      standard-width
      page-body-container
      login-form
    "
  >
    <back-navigation
      :title="$t('insurance.medicalInsurance')"
      :backLink="backLink"
    />

    <div class="row mt-3">
      <div class="col-sm-12" style="--numberOfTabs: 2">
        <b-card
          header-tag="div"
          no-body
          class="ash-card card-top-navigation tabs-start"
        >
          <b-card-body class="mt-0">
            <b-tabs pills slot="header" class="tabbed-card">
              <b-tab :title="$t('insurance.myInsurance')">
                <div
                  class="appointment-list"
                  :class="{
                    noData:
                      !getApprovedInsurances || !getApprovedInsurances.length,
                  }"
                >
                  <div
                    class="appointment-list-item"
                    v-for="insurance in getApprovedInsurances"
                    :key="'upcoming-appointment-id' + insurance.id"
                  >
                    <div class="appointment-card success">
                      <div class="doctor-avatar transparent">
                        <shield-bg-svg />
                      </div>
                      <div class="appointment-details">
                        <div class="doctor-name w600">Medical Support</div>
                        <div class="doctor-speciality">
                          {{ insurance.medical_support }}
                        </div>
                        <div class="doctor-name w600">
                          {{ $t("insurance.policyNum") }}
                        </div>
                        <div class="doctor-speciality">
                          {{ insurance.policy_number }}
                        </div>
                        <div class="doctor-name w600">
                          {{ $t("insurance.planDetails") }}
                        </div>
                        <div class="doctor-speciality">
                          {{ insurance.plan_details }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="loading" v-if="!getApprovedInsurances">
                  {{ $t("loading") }}
                </div>
                <div class="no-data" v-else-if="!getApprovedInsurances.length">
                  {{ $t("noData") }}
                </div>
              </b-tab>
              <b-tab :title="$t('insurance.approvals')">
                <div
                  class="appointment-list"
                  :class="{ noData: !insuranceList || !insuranceList.length }"
                >
                  <div
                    class="appointment-list-item"
                    v-for="insurance in insuranceList"
                    :key="'upcoming-appointment-id' + insurance.id"
                  >
                    <div
                      class="appointment-card"
                      :class="getStatusClass(insurance.status)"
                    >
                      <div class="doctor-avatar transparent">
                        <shield-bg-svg />
                      </div>
                      <div class="appointment-details">
                        <div class="doctor-name w600">
                          {{ insurance.company_name }}
                        </div>
                        <div class="doctor-speciality">
                          {{ insurance.medical_support }}
                        </div>
                        <div class="last-update-on w200">
                          {{ $t("insurance.lastUpdate") }}
                        </div>
                        <div class="date-time w200">
                          {{ getLongDateAndTimeFromDate(insurance.updated_at) }}
                        </div>
                        <button class="btn start-call-button status-color">
                          {{ insurance.status }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="loading" v-if="insuranceList == null">
                  {{ $t("loading") }}
                </div>
                <div class="no-data" v-else-if="!insuranceList.length">
                  {{ $t("noData") }}
                </div>
              </b-tab>
            </b-tabs>
          </b-card-body>
        </b-card>
      </div>
    </div>
  </div>
</template>

<script>
import { insuranceService } from "../../services";
export default {
  props: {
    userId: {
      require: true,
    },
    backLink: {},
  },
  data() {
    return {
      insuranceList: null,
    };
  },
  mounted() {
    if (!this.backLink) {
      if (this.$route.name.includes("appointment")) {
        this.backLink = "Appointment History Details";
      } else if (this.$route.name.includes("users/patient")) {
        this.backLink = "Patient Details";
      } else {
        this.backLink = "default";
      }
    }
    if (!this.userId) {
      this.navigateTo(this.backLink);
      return;
    }
    this.getInsurances();
  },
  computed: {
    getApprovedInsurances() {
      return (
        this.insuranceList &&
        this.insuranceList.filter((x) => x.status == "approved")
      );
    },
  },
  methods: {
    getInsurances() {
      this.setLoadingState(true);
      insuranceService.fetchInsurances(this.userId).then(
        (response) => {
          if (response.data.status) {
            this.insuranceList = response.data.data.items;
          } else {
            this.failureToast(response.data.message);
          }
          this.setLoadingState(false);
        },
        (error) => {
          console.error(error);
          this.failureToast();
          this.setLoadingState(false);
        }
      );
    },
    getStatusClass(status) {
      if (
        status.toLowerCase() == "pending" ||
        status.toLowerCase() == "sent for approval"
      )
        return "warning";
      else if (status.toLowerCase() == "rejected") return "danger";
      else return "success";
    },
    editInsurance(insurance) {
      let options = {
        success: this.$t("admin.approved"),
        rejected: this.$t("admin.rejected"),
        "sent for approval": this.$t("admin.sentForApproval"),
      };
      this.selectIconModal(
        this.$t("admin.selectInsuranceStatus"),
        options
      ).then((res) => {
        if (res.value) {
          this.successModal();
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.card.ash-card
  .card-body
  .appointment-list-item
  .appointment-card
  .appointment-details {
  .doctor-name {
    color: #0f425e;
    margin-top: 1rem;
    font-size: 1.375rem;
  }
  .doctor-speciality {
    font-size: 1.188rem;
  }
  .last-update-on {
    margin-top: 1rem;
    font-size: 1.125rem;
  }
  .date-time {
    font-size: 1rem;
    color: #aeaeb4;
  }
  .start-call-button {
    text-transform: capitalize;
  }
}
</style>