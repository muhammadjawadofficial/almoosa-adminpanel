<template>
    <div
      class="
        doctor-list-container
        standard-width
        page-body-container
        promotions-details-conatiner
      "
    >
      <back-navigation
        :title="$t('symptoms.titleTop')"
        :backLink="'Symptom Checker List'"
      />
      <template v-if="getLoading">
        <div class="no-data">{{ $t("loading") }}</div>
      </template>
      <template v-else-if="!packageInfo">
        <div class="no-data">{{ $t("noData") }}</div>
      </template>
      <template v-else>
        <b-card
          header-tag="div"
          no-body
          class="ash-card simple card-wizard transparent"
        >
          <b-card-body class="p-0">
            <div class="promotion-detail">
              <div class="package-information">
                <div class="package-info-section">
                  <div class="title">
                    {{ $t("symptoms.sypmtomTitle") }}
                  </div>
                  <div class="value">{{ packageInfo[getLocaleKey('title')] }}</div>
                </div>
              </div>
              <div class="promotion-detail-section">
                <div class="title">{{ $t("symptoms.description") }}</div>
                <div class="value">{{ packageInfo[getLocaleKey('description')] }}</div>
              </div>
              <div class="promotion-detail-section">
                <div class="title">
                  {{ $t("symptoms.symptomDetails") }}
                </div>
                <div class="value">
                  <div class="appointment-list mt-3 mx-2">
                    <div
                      class="appointment-list-item"
                      v-for="(item, pindex) in packageDetails"
                      :key="'package-' + pindex"
                    >
                      <div class="service-details bg-tertiary">
                        <div class="details-title">
                          {{ item.label }}
                        </div>
                        <div class="details-value">
                          {{ item.value[getLocaleKey('title')] }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </b-card-body>
        </b-card>
        <div class="button-group">
          <button @click="editPackage" class="btn btn-secondary">
            {{ $t("admin.edit") }}
          </button>
        </div>
      </template>
    </div>
  </template>
  
  <script>
  import { mapGetters } from "vuex";
  export default {
    data() {
      return {
        packageDetails: null,
        packageInfo: null,
      };
    },
    computed: {
      ...mapGetters("symptomChecker", ["getSelectedSymptom"]),
    },
    mounted() {
      if (!this.getSelectedSymptom) {
        this.navigateTo("Symptom Checker List");
        return;
      }
      this.initializeData();
    },
    methods: {
      initializeData() {
        this.packageInfo = this.getSelectedSymptom;
        this.packageDetails = [];
        let details = this.getSelectedSymptom.options;
        if (details) {
          let keys = Object.keys(details);
          if (keys) {
            keys.forEach((key) => {
              this.packageDetails.push({
                label: key,
                value: details[key],
              });
            });
          }
        }
      },
      editPackage() {
        this.navigateTo("Symptom Checker Edit");
      },
    },
  };
  </script>
  
  <style lang="scss" scoped>
  .back-btn {
    position: absolute;
    top: 3rem;
    z-index: 1;
  }
  .text-content {
    font-size: 1.125rem;
    color: #8696b8;
    margin-block: 1.5rem;
  }
  .educational-content {
    padding-block-end: 5rem;
    :deep * {
      font-family: "DiodrumArabicMedium" !important;
    }
  }
  .promotions-details-conatiner .promotion-detail-section {
    padding-top: 2rem;
    padding-bottom: 1.5rem;
  }
  .main-banner {
    .background-image {
      .main-banner-text {
        position: relative;
        inset: unset;
        padding-block-start: 2rem;
        width: 100%;
        font-size: 1.625rem;
        line-height: 1.4em;
      }
    }
  }
  @media (min-width: 991px) {
    .educational-content {
      padding-block-start: 1.5rem;
    }
    .main-banner {
      .background-image {
        isolation: isolate;
        height: 500px;
        display: flex;
        .main-banner-text {
          width: 45%;
          padding-block-end: 2rem;
          font-size: 2.625rem;
        }
        > img {
          position: absolute;
          z-index: -1;
          height: 100%;
        }
      }
    }
  }
  @media (max-width: 992px) {
    .main-banner {
      .background-image {
        > img {
          min-height: auto;
        }
      }
    }
  }
  </style>