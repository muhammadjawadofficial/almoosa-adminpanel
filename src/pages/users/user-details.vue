<template>
  <div
    class="timeline-details-container page-body-container standard-width"
    v-if="details"
  >
    <back-navigation
      :title="$t('admin.patientDetails')"
      backLink="Patient List"
    />
    <div class="row">
      <div class="col-lg-8">
        <div class="user-profile-details mt-5">
          <div class="user-image">
            <img :src="getImageUrl(details.photo)" alt="" />
          </div>
          <div class="user-info">
            <div class="user-name">
              {{ details.patient_name }}
            </div>
            <div class="user-speciality">
              <template v-if="details.speciality">
                {{ details.speciality.title }}
                {{ $t("admin.patient") }}
              </template>
              <template v-else> N/A </template>
            </div>
            <div class="user-number text-muted">
              {{ $t("admin.mrn") }} - {{ details.mrn }}
            </div>
            <button
              class="btn btn-primary user-profile"
              @click="navigateProfile()"
            >
              {{ $t("header.viewProfile") }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-8">
        <div class="accordion mt-2" role="tablist">
          <b-card no-body class="transparent mb-2">
            <b-card-header header-tag="header" class="p-1 accordion-tab">
              <b-button block @click="navigateTimeline()">
                <div>Timeline</div>
                <div class="icon"></div>
              </b-button>
            </b-card-header>
          </b-card>

          <b-card no-body class="transparent mb-2">
            <b-card-header header-tag="header" class="p-1 accordion-tab">
              <b-button block @click="navigateFamilyMembers()">
                <div>Care For Family</div>
                <div class="icon"></div>
              </b-button>
            </b-card-header>
          </b-card>

          <b-card no-body class="transparent mb-2">
            <b-card-header header-tag="header" class="p-1 accordion-tab">
              <b-button block @click="navigateMedicalInsurance()">
                <div>Medical Insurance</div>
                <div class="icon"></div>
              </b-button>
            </b-card-header>
          </b-card>

          <b-card no-body class="transparent mb-2">
            <b-card-header header-tag="header" class="p-1 accordion-tab">
              <b-button block @click="navigateLabReports()">
                <div>Lab Reports</div>
                <div class="icon"></div>
              </b-button>
            </b-card-header>
          </b-card>

          <b-card no-body class="transparent mb-2">
            <b-card-header header-tag="header" class="p-1 accordion-tab">
              <b-button block @click="navigateRadiologyReports()">
                <div>Radiology Reports</div>
                <div class="icon"></div>
              </b-button>
            </b-card-header>
          </b-card>

          <b-card no-body class="transparent mb-2">
            <b-card-header header-tag="header" class="p-1 accordion-tab">
              <b-button block @click="navigateMedications()">
                <div>Medications</div>
                <div class="icon"></div>
              </b-button>
            </b-card-header>
          </b-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      details: null,
    };
  },
  computed: {
    ...mapGetters("user", ["getSelectedUser"]),
  },
  mounted() {
    if (!this.getSelectedUser) {
      this.navigateTo("Patient List");
      return;
    }
    this.details = this.getSelectedUser;
  },
  methods: {
    navigateTimeline() {
      this.navigateTo("Patient Timeline List");
    },
    navigateFamilyMembers() {
      this.navigateTo("Patient Family Members");
    },
    navigateLabReports() {
      this.navigateTo("Patient Lab Sessions");
    },
    navigateRadiologyReports() {
      this.navigateTo("Patient Radiology Sessions");
    },
    navigateMedicalInsurance() {
      this.navigateTo("Patient Medical Insurance");
    },
    navigateMedications() {
      this.navigateTo("Patient Medication Session");
    },
    navigateProfile() {
      this.navigateTo("Patient Profile");
    },
  },
};
</script>

<style lang="scss" scoped>
.accordion {
  .card {
    &:has(.not-collapsed) {
      .accordion-tab {
        .btn {
          background-color: var(--theme-secondary) !important;
          border-color: var(--theme-secondary) !important;
          color: var(--theme-tertiary);
          font-family: "DiodrumArabicSemiBold";
          .icon {
            transform: rotateZ(90deg);
          }
        }
      }
    }
    .card-header {
      .btn {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.75rem;
        gap: 1rem;
        border-radius: 12px;
        font-family: "DiodrumArabicSemiBold";
        cursor: default;
        > div {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
      }
    }
    .accordion-tab {
      border-bottom: none;
      .btn {
        background-color: var(--theme-default) !important;
        border: none !important;
        color: var(--theme-secondary);
        cursor: pointer;
        .icon {
          &::before {
            content: "\F054";
          }
          transition: 0.2s transform;
          display: inline-block;
          font: normal normal normal 14px/1 FontAwesome;
          font-size: 0.75em;
          text-rendering: auto;
          -webkit-font-smoothing: antialiased;
        }
        > div {
          z-index: 1;
        }
        padding: 1.25rem;
        width: 100%;
        border-radius: 1rem;
        border-right: 0.15rem solid transparent !important;
        display: flex;
        align-items: center;
        gap: 2rem;
        cursor: pointer;
        position: relative;
        &::after {
          content: "";
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          border-radius: 1rem;
          background-color: var(--theme-tertiary);
          margin-inline-start: -0.125rem;
        }
      }
    }
    .card-body {
      padding-block: 1.25rem 2rem;
      padding-inline: 1rem;
      .card-text {
        .heading {
          font-size: 1.25rem;
          color: var(--theme-default);
        }
        .description {
          font-size: 1rem;
          color: black;
          line-height: 1.2em;
          margin-top: 0.5em;
        }
      }
    }
  }
}
</style>