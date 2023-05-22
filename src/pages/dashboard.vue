<template>
  <div>
    <div
      class="page-body-container standard-width"
      :class="{ guest: isGuest }"
      v-if="!loading"
    >
      <div class="filter-container">
        <div class="toggle-options">
          <div class="custom-login-input-groups">
            <multiselect
              v-model="selectedClinic"
              :options="clinics"
              :allowEmpty="false"
              :placeholder="$t('profile.select') + ' ' + $t('profile.clinics')"
              track-by="id"
              label="title"
              class="filter-select"
              :selectLabel="''"
              :deselectLabel="''"
              @input="fetchDashboardData"
            >
              <template slot="singleLabel" slot-scope="props">
                {{ props.option[getLocaleKey("title")] }}
              </template>
              <template slot="selection" slot-scope="{ values, search, isOpen }"
                ><span
                  class="multiselect__single"
                  v-if="values.length"
                  v-show="!isOpen"
                >
                  {{ values.map((x) => x[getLocaleKey("title")]).join(" , ") }}
                </span>
              </template>
              <template slot="option" slot-scope="props">
                {{ props.option[getLocaleKey("title")] }}
              </template>
            </multiselect>
          </div>
        </div>
        <div class="filters-dropdown">
          {{ $t("admin.date") }}
          <img src="../assets/images/filter.svg" alt="" />
          <div class="filters-dropdown-menu">
            <template v-if="true">
              <div style="display: flex">
                <div
                  class="date-container"
                  @click="showCalendar = !showCalendar"
                >
                  {{ $t("admin.from") }}:
                  {{ fromDate || $t("admin.selectDate") }}
                </div>
                <div
                  class="date-container"
                  @click="showCalendar = !showCalendar"
                >
                  {{ $t("admin.to") }}:
                  {{ toDate || $t("admin.selectDate") }}
                </div>
              </div>
              <date-picker
                :append-to-body="false"
                format="YYYY-MM-DD"
                v-model="dateRange"
                :popup-style="{ top: 'calc(100% - 5px)', left: 0, right: 0 }"
                popup-class="hideSecondCalendar"
                value-type="format"
                class="ash-datepicker"
                range
                :open="showCalendar"
                :lang="getCurrentLang()"
                @input="dateChange"
                :disabled-date="disabledBeforeTodayAndAfterAWeek"
                :clearable="fromDate != defaultStart && toDate != defaultEnd"
              >
                <template #icon-calendar>
                  <img
                    src="../assets/images/calendar.svg"
                    alt=""
                    style="width: 1rem; height: 1rem; object-fit: contain"
                  />
                </template>
              </date-picker>
            </template>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-xl-4 col-md-12 box-col-12">
          <px-card class="o-hidden">
            <div class="chart-widget-top">
              <div class="card-body pb-0">
                <div class="media">
                  <div class="media-body">
                    <h5>Total Appointments</h5>
                    <h4>{{ statsData.appointment.total || 0 }}</h4>
                  </div>
                </div>
              </div>
              <div>
                <div id="chart-widget1">
                  <apexchart
                    v-if="!reRenderChart"
                    height="170"
                    type="area"
                    :options="chart1.options"
                    :series="chart1.series"
                  ></apexchart>
                </div>
              </div>
            </div>
          </px-card>
        </div>
        <div class="col-xl-4 col-md-12 box-col-12">
          <px-card class="o-hidden">
            <div class="chart-widget-top">
              <div class="card-body pb-0">
                <div class="media">
                  <div class="media-body">
                    <h5>Paid Appointments</h5>
                    <h4>{{ statsData.appointment.paid || 0 }}</h4>
                  </div>
                </div>
              </div>
              <div id="chart-widget2">
                <div
                  class="flot-chart-placeholder"
                  id="chart-widget-top-second"
                >
                  <apexchart
                    v-if="!reRenderChart"
                    height="170"
                    type="area"
                    :options="chart2.options"
                    :series="chart2.series"
                  ></apexchart>
                </div>
              </div>
            </div>
          </px-card>
        </div>
        <div class="col-xl-4 col-md-12 box-col-12">
          <px-card class="o-hidden">
            <div class="chart-widget-top">
              <div class="card-body pb-0">
                <div class="media">
                  <div class="media-body">
                    <h5>Unpaid Appointments</h5>
                    <h4>{{ statsData.appointment.unpaid || 0 }}</h4>
                  </div>
                </div>
              </div>
              <div id="chart-widget3">
                <div class="flot-chart-placeholder" id="chart-widget-top-third">
                  <apexchart
                    v-if="!reRenderChart"
                    height="170"
                    type="area"
                    :options="chart3.options"
                    :series="chart3.series"
                  ></apexchart>
                </div>
              </div>
            </div>
          </px-card>
        </div>
      </div>
      <div class="row">
        <div class="col-sm-6 col-xl-4 col-lg-6">
          <px-card class="static-top-widget-card">
            <div slot="with-padding">
              <div class="media static-top-widget">
                <div class="media-body">
                  <h6 class="font-roboto">Cancelled Appointments</h6>
                  <h4 class="mb-0 counter">
                    {{ statsData.appointment.cancelled || 0 }}
                  </h4>
                </div>
                <img src="../assets/images/calendar.svg" width="41" />
              </div>
              <div class="progress-widget">
                <div class="progress sm-progress-bar progress-animate">
                  <div
                    class="progress-gradient-danger"
                    role="progressbar"
                    :style="'width: ' + calculateCancelledPercentage + '%'"
                    aria-valuenow="75"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    <span class="animate-circle"></span>
                  </div>
                </div>
              </div>
            </div>
          </px-card>
        </div>
        <div class="col-sm-6 col-xl-4 col-lg-6">
          <px-card class="static-top-widget-card">
            <div slot="with-padding">
              <div class="media static-top-widget">
                <div class="media-body">
                  <h6 class="font-roboto">Rescheduled Appointments</h6>
                  <h4 class="mb-0 counter">
                    {{ statsData.appointment.rescheduled || 0 }}
                  </h4>
                </div>
                <img src="../assets/images/calendar.svg" width="41" />
              </div>
              <div class="progress-widget">
                <div class="progress sm-progress-bar progress-animate">
                  <div
                    class="progress-gradient-danger"
                    role="progressbar"
                    :style="'width: ' + calculateRescheduledPercentage + '%'"
                    aria-valuenow="75"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    <span class="animate-circle"></span>
                  </div>
                </div>
              </div>
            </div>
          </px-card>
        </div>
        <div class="col-sm-6 col-xl-4 col-lg-6">
          <px-card class="static-top-widget-card">
            <div slot="with-padding">
              <div class="media static-top-widget">
                <div class="media-body">
                  <h6 class="font-roboto">Registered Users</h6>
                  <h4 class="mb-0 counter">
                    {{ statsData.users.registered || 0 }}
                  </h4>
                </div>
                <img src="../assets/images/calendar.svg" width="41" />
              </div>
              <div class="progress-widget">
                <div class="progress sm-progress-bar progress-animate">
                  <div
                    class="progress-gradient-danger"
                    role="progressbar"
                    :style="'width: ' + 100 + '%'"
                    aria-valuenow="75"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    <span class="animate-circle"></span>
                  </div>
                </div>
              </div>
            </div>
          </px-card>
        </div>
        <div class="col-sm-6 col-xl-4 col-lg-6">
          <px-card class="static-top-widget-card">
            <div slot="with-padding">
              <div class="media static-top-widget">
                <div class="media-body">
                  <h6 class="font-roboto">Refill Requests</h6>
                  <h4 class="mb-0 counter">
                    {{ statsData.medication.refill || 0 }}
                  </h4>
                </div>
                <div style="width: 41px">
                  <pill-fill-svg />
                </div>
              </div>
              <div class="progr`ess-widget">
                <div class="progress sm-progress-bar progress-animate">
                  <div
                    class="progress-gradient-danger"
                    role="progressbar"
                    :style="'width: ' + calculateRefillPercentage + '%'"
                    aria-valuenow="75"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    <span class="animate-circle"></span>
                  </div>
                </div>
              </div>
            </div>
          </px-card>
        </div>
        <div class="col-sm-6 col-xl-4 col-lg-6">
          <px-card class="static-top-widget-card">
            <div slot="with-padding">
              <div class="media static-top-widget">
                <div class="media-body">
                  <h6 class="font-roboto">Delivery Requests</h6>
                  <h4 class="mb-0 counter">
                    {{ statsData.medication.delivery || 0 }}
                  </h4>
                </div>
                <div style="width: 41px">
                  <pill-fill-svg />
                </div>
              </div>
              <div class="progress-widget">
                <div class="progress sm-progress-bar progress-animate">
                  <div
                    class="progress-gradient-danger"
                    role="progressbar"
                    :style="'width: ' + calculateDeliveryPercentage + '%'"
                    aria-valuenow="75"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    <span class="animate-circle"></span>
                  </div>
                </div>
              </div>
            </div>
          </px-card>
        </div>
      </div>
      <div class="row">
        <div class="col-xl-4 col-md-12 box-col-12">
          <px-card class="o-hidden">
            <div class="card-body pb-0">
              <h5>Platform Wise Stats</h5>
            </div>
            <div id="piechart" v-if="!reRenderPieChart">
              <apexchart
                type="pie"
                :options="piechart.chartOptions"
                :series="piechart.series"
              ></apexchart>
            </div>
          </px-card>
        </div>
      </div>
      <!-- <div class="coming-soon-section">
        <div class="heading w600">
          <span class="font-secondary">{{ $t("comingSoon.coming") }}</span>
          <span class="font-primary">{{ $t("comingSoon.soon") }}</span>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>
var primary =
  document.documentElement.style.getPropertyValue("--theme-default") ||
  "#7366ff";
var secondary =
  document.documentElement.style.getPropertyValue("--secondary-default") ||
  "#f73164";
import { mapGetters } from "vuex";
import { authService, reportService } from "../services";
// import countTo from "vue-count-to";
export default {
  data() {
    return {
      isGuest: false,
      loading: true,
      showDatePicker: true,
      showCalendar: false,
      fromDate: null,
      toDate: null,
      dateRange: null,
      defaultStart: null,
      defaultEnd: null,
      statsData: {},
      clinics: [],
      selectedClinic: null,
      reRenderChart: false,
      reRenderPieChart: false,
      chart1: {
        options: {
          chart: {
            width: 510,
            height: 190,
            type: "area",
            toolbar: {
              show: false,
            },
          },
          colors: [primary],
          dataLabels: {
            enabled: false,
          },
          stroke: {
            curve: "smooth",
            width: 2,
          },
          xaxis: {
            show: false,
            type: "datetime",
            categories: [
              "2018-09-19T00:00:00",
              "2018-09-19T01:30:00",
              "2018-09-19T02:30:00",
              "2018-09-19T03:30:00",
              "2018-09-19T04:30:00",
              "2018-09-19T05:30:00",
              "2018-09-19T06:30:00",
              "2018-09-19T07:30:00",
              "2018-09-19T08:30:00",
              "2018-09-19T09:30:00",
            ],
            labels: {
              show: false,
            },
            axisBorder: {
              show: false,
            },
            axisTicks: {
              show: false,
            },
          },
          yaxis: {
            show: false,
          },
          fill: {
            colors: [primary],
          },
          tooltip: {
            enabled: false,
          },
          grid: {
            show: false,
            padding: {
              left: 0,
              right: -10,
              bottom: -50,
            },
          },
        },
        series: [
          {
            name: "",
            data: [],
          },
        ],
      },
      chart2: {
        options: {
          chart: {
            width: 510,
            height: 190,
            type: "area",
            toolbar: {
              show: false,
            },
          },
          colors: [secondary],
          dataLabels: {
            enabled: false,
          },
          stroke: {
            curve: "smooth",
            width: 2,
          },
          xaxis: {
            show: false,
            type: "datetime",
            categories: [
              "2018-09-19T00:00:00",
              "2018-09-19T01:30:00",
              "2018-09-19T02:30:00",
              "2018-09-19T03:30:00",
              "2018-09-19T04:30:00",
              "2018-09-19T05:30:00",
              "2018-09-19T06:30:00",
              "2018-09-19T07:30:00",
              "2018-09-19T08:30:00",
              "2018-09-19T09:30:00",
            ],
            labels: {
              show: false,
            },
            axisBorder: {
              show: false,
            },
            axisTicks: {
              show: false,
            },
          },
          yaxis: {
            show: false,
          },
          fill: {
            colors: [secondary],
          },
          tooltip: {
            enabled: false,
          },
          grid: {
            show: false,
            padding: {
              left: 0,
              right: -10,
              bottom: -50,
            },
          },
        },
        series: [
          {
            name: "series1",
            data: [],
          },
        ],
      },
      chart3: {
        options: {
          chart: {
            width: 510,
            height: 190,
            type: "area",
            toolbar: {
              show: false,
            },
          },
          colors: ["#51BB25"],
          dataLabels: {
            enabled: false,
          },
          stroke: {
            curve: "smooth",
            width: 2,
          },
          xaxis: {
            show: false,
            type: "datetime",
            categories: [
              "2018-09-19T00:00:00",
              "2018-09-19T01:30:00",
              "2018-09-19T02:30:00",
              "2018-09-19T03:30:00",
              "2018-09-19T04:30:00",
              "2018-09-19T05:30:00",
              "2018-09-19T06:30:00",
              "2018-09-19T07:30:00",
              "2018-09-19T08:30:00",
              "2018-09-19T09:30:00",
            ],
            labels: {
              show: false,
            },
            axisBorder: {
              show: false,
            },
            axisTicks: {
              show: false,
            },
          },
          yaxis: {
            show: false,
          },
          fill: {
            colors: ["#51BB25"],
          },
          tooltip: {
            enabled: false,
          },
          grid: {
            show: false,
            padding: {
              left: 0,
              right: -10,
              bottom: -50,
            },
          },
        },
        series: [
          {
            name: "series1",
            data: [],
          },
        ],
      },
      piechart: {
        series: [],
        chartOptions: {
          chart: {
            width: 380,
            type: "pie",
          },
          labels: [],
          responsive: [
            {
              breakpoint: 480,
              options: {
                chart: {
                  width: 300,
                },
                legend: {
                  position: "bottom",
                  fontSize: "9px",
                },
              },
            },
          ],
          colors: [
            "#55b047",
            "#2b4e66",
            "#f8d62b",
            "#fd7e14",
            "#a927f9",
          ],
        },
      },
    };
  },
  watch: {
    getMenuItems() {
      this.loadDashboard();
    },
  },
  mounted() {
    authService
      .getClinics()
      .then((res) => {
        if (res.data.status) {
          let data = res.data.data;
          if (data) {
            this.clinics = data.items;
            this.selectedClinic = data.items[0];
          }
        } else {
          this.failureToast(res.data.message);
        }
      })
      .catch((error) => {
        if (!this.isAPIAborted(error))
          this.failureToast(
            error.response && error.response.data && error.response.data.message
          );
      })
      .finally(() => {
        this.resetDates(true);
      });

    // this.loadDashboard();
    this.isGuest = this.$route.path.includes("guest");
  },
  computed: {
    ...mapGetters("menu", ["getMenuItems"]),
    ...mapGetters("user", ["getUserInfo"]),
    calculateCancelledPercentage() {
      let obj = this.statsData.appointment;
      if (!obj) return 0;
      if (obj.total < 1) return 0;
      return (obj.cancelled / obj.total) * 100;
    },
    calculateRescheduledPercentage() {
      let obj = this.statsData.appointment;
      if (!obj) return 0;
      if (obj.total < 1) return 0;
      return (obj.rescheduled / obj.total) * 100;
    },
    calculateRefillPercentage() {
      let obj = this.statsData.medication;
      if (!obj) return 0;
      let total = +obj.refill + +obj.delivery;
      if (total < 1) return 0;
      return (obj.refill / total) * 100;
    },
    calculateDeliveryPercentage() {
      let obj = this.statsData.medication;
      if (!obj) return 0;
      let total = +obj.delivery + +obj.delivery;
      if (total < 1) return 0;
      return (obj.delivery / total) * 100;
    },
  },
  components: {
    // countTo,
  },
  methods: {
    resetDates(setDefault = false) {
      let now = new Date();
      const toDate = this.dateFormatter(now, "YYYY-MM-DD");
      now = new Date();
      const fromDate = this.dateFormatter(
        now.setMonth(now.getMonth() - 1),
        "YYYY-MM-DD"
      );

      this.fromDate = fromDate;
      this.toDate = toDate;
      if (setDefault) {
        this.defaultStart = fromDate;
        this.defaultEnd = toDate;
      }
      this.dateRange = [this.fromDate, this.toDate];
      this.fetchDashboardData();
    },
    disabledBeforeTodayAndAfterAWeek(date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return date > today;
    },
    dateChange(val) {
      this.fromDate = val[0];
      this.toDate = val[1];

      if (!this.fromDate && !this.toDate) {
        this.resetDates();
        return;
      }

      if (!this.fromDate || this.toDate) {
        this.showCalendar = false;
      }
      this.fetchDashboardData();
    },
    loadDashboard() {
      this.loading = true;
      let firstItem = this.getMenuItems[0];
      let getPath = (item) => {
        if (item && item.children && item.children.length) {
          let subChild = item.children[0];
          return getPath(subChild);
        }
        return item.path;
      };
      let path = getPath(firstItem);
      if (path && path != this.$route.path) {
        this.$router.replace(path);
      }

      this.fetchDashboardData();
    },
    initializeLineChart() {
      let getNumber = (max = 100) => {
        return Math.floor(Math.random() * Math.floor(max));
      };

      let getRandomNumberArray = (number) => {
        let arr = [];
        for (let index = 0; index <= 10; index++) {
          arr.push(number == null ? getNumber() : number);
        }
        return arr;
      };
      this.chart1.series[0].data = getRandomNumberArray();
      this.chart2.series[0].data = getRandomNumberArray();
      this.chart3.series[0].data = getRandomNumberArray();
      if (!this.statsData.appointment.total) {
        this.chart1.series[0].data = getRandomNumberArray(0);
      }
      if (!this.statsData.appointment.paid) {
        this.chart2.series[0].data = getRandomNumberArray(0);
      }
      if (!this.statsData.appointment.unpaid) {
        this.chart3.series[0].data = getRandomNumberArray(0);
      }
      this.reRenderChart = true;
      setTimeout(() => {
        this.reRenderChart = false;
      }, 100);
    },
    initializePieChart(data) {
      if (!data || !data.platform) return;
      let platform = data.platform;
      let series = [];
      let labels = [];
      Object.keys(platform).forEach((key) => {
        if (key == "total" || key == "withoutPlatform") return;
        labels.push(this.$t("admin." + key));
        series.push(platform[key]);
      });
      this.piechart.series = [...series];
      this.piechart.chartOptions.labels = [...labels];
      this.reRenderPieChart = true;
      setTimeout(() => {
        this.reRenderPieChart = false;
      }, 100);
    },
    fetchDashboardData() {
      // return;
      reportService
        .getDashboardStats(
          "?from_date=" +
            this.fromDate +
            "&to_date=" +
            this.toDate +
            "&clinic_id=" +
            this.selectedClinic.id +
            "&role_id=3&skip_date_filter=true"
        )
        .then(
          (response) => {
            if (response.data.status) {
              this.statsData = response.data.data;
              this.initializeLineChart();
              this.initializePieChart(response.data.data);
            } else {
              this.failureToast(response.data.messsage);
            }
            this.loading = false;
            this.appointmentStatus = null;
          },
          (error) => {
            this.loading = false;
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
.coming-soon-section {
  height: calc(100vh - var(--header-height) - var(--footer-height));
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 0.75em;
  font-size: 1rem;
  &.guest {
    height: 95vh;
    @media (max-width: 1200px) {
      height: 65vh;
    }
    @media (max-width: 992px) {
      height: auto;
      padding-block: 5em;
    }
  }
  @media (max-width: 1200px) {
    font-size: 0.75em;
  }
  @media (max-width: 992px) {
    font-size: 0.5em;
  }
  .heading {
    font-size: 4em;
    line-height: 1;
    gap: 0.3em;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    text-align: center;
  }
  .sub-heading {
    font-size: 1em;
    color: black;
    @media (max-width: 992px) {
      font-size: 2em;
    }
  }
}
.custom-login-input-groups {
  margin: 0;
  padding: 0;
  width: 20rem;
  font-size: 1rem;
  .multiselect {
    :deep(.multiselect__select) {
      background-position: center;
    }
  }

  &.select-box {
    width: 35%;
    min-width: 200px;
  }
}
</style>