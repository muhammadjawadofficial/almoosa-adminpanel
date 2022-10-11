<template>
    <div class="lab-works-doctors-container page-body-container standard-width">
      <back-navigation
        :title="$t('labWorks.reports')"
        :backLink="backLink"
      />
      <div class="search-box">
        <div class="search-icon">
          <i class="fa fa-search" aria-hidden="true"></i>
        </div>
        <div class="search-input">
          <b-form-input
            :placeholder="$t('admin.searchReportName')"
            id="type-search"
            type="search"
            v-model="searchReportQuery"
          ></b-form-input>
        </div>
      </div>
      <b-card header-tag="div" no-body class="ash-card simple transparent">
        <b-card-body class="py-0 px-3 mt-4">
          <div
            class="appointment-list"
            :class="{ noData: !reports || !reports.length }"
          >
            <div class="loading" v-if="reports == null">{{ $t("loading") }}</div>
            <div class="no-data" v-else-if="!reports.length">
              {{ $t("noData") }}
            </div>
            <template v-else>
              <div
                class="appointment-list-item"
                v-for="report in reports"
                :key="'upcoming-appointment-id' + report.id"
              >
                <div class="appointment-card default">
                  <div class="doctor-avatar transparent">
                    <lab-bg-svg />
                  </div>
                  <div class="appointment-details">
                    <div class="doctor-name">
                      {{ report.title }}
                    </div>
                    <div class="doctor-speciality">
                      {{ getLongDateAndTimeFromDate(report.dated, true) }}
                    </div>
                    <div class="appointment-status">
                      {{ report.result }}
                    </div>
                  </div>
                  <div class="report-action-buttons">
                    <div class="view-report" @click="viewReport(report)">
                      <img src="../../assets/images/stats.svg" alt="stats-img" />
                    </div>
                    <div class="download-report" @click="downloadReport(report)">
                      <img
                        src="../../assets/images/download.svg"
                        alt="download-img"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </b-card-body>
      </b-card>
    </div>
  </template>
  
  <script>
  import { mapGetters } from "vuex";
  import { reportService, userService } from "../../services";
  export default {
    props: {
      appointmentId: {
        require: true,
      },
      backLink: {},
    },
    data() {
      return {
        reports: [],
        allReports: [],
        searchReportQuery: "",
      };
    },
    mounted() {
      this.initializeData();
    },
    computed: {
      ...mapGetters("appointment", ["getSelectedAppointment"]),
    },
    watch: {
      searchReportQuery(val) {
        this.reports = [
          ...this.allReports.filter((x) =>
            x.title.toLowerCase().includes(val.toLowerCase())
          ),
        ];
      },
    },
    methods: {
      initializeData() {
        if (!this.appointmentId) {
          this.navigateTo(this.backLink);
          return;
        }
        this.fetchReports();
      },
      fetchReports() {
        this.setLoadingState(true);
        reportService.fetchLabReports(this.appointmentId).then(
          (response) => {
            if (response.data.status) {
              this.reports = [...response.data.data.items];
              this.allReports = [...response.data.data.items];
            } else {
              this.failureToast(response.data.messsage);
            }
            this.appointmentStatus = null;
            this.setLoadingState(false);
          },
          () => {
            this.appointmentStatus = null;
            this.setLoadingState(false);
            this.failureToast();
          }
        );
      },
      viewReport(report) {
        window.open(
          process.env.VUE_APP_SERVER + report.report_file.path,
          "_blank"
        );
      },
      downloadReport(report) {
        let file = {
          name: report.report_file.filename,
          url: report.report_file.path,
        };
        userService.downloadFile(file);
      },
    },
  };
  </script>
  