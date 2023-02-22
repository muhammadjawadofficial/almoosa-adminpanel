<template>
  <div class="doctor-list-container page-body-container standard-width">
    <div class="search-box full-width">
      <div class="search-icon">
        <i class="fa fa-search" aria-hidden="true"></i>
      </div>
      <div class="search-input">
        <b-form-input
          :placeholder="$t('admin.searchPatientMrn')"
          id="type-search"
          type="search"
          v-model="searchDoctorQuery"
          debounce="500"
        ></b-form-input>
      </div>
    </div>
    <div class="filter-container">
      <div class="toggle-options">
        <div
          class="toggle-options--single"
          :class="{ active: activeTab == 'onsite' }"
          @click="changeTab('onsite')"
        >
          {{ $t("admin.onsite") }}
        </div>
        <div
          class="toggle-options--single"
          :class="{ active: activeTab == 'online' }"
          @click="changeTab('online')"
        >
          {{ $t("admin.online") }}
        </div>
      </div>
      <div class="filters-dropdown">
        {{ $t("admin.date") }}
        <img src="../../assets/images/filter.svg" alt="" />
        <div class="filters-dropdown-menu">
          <template v-if="true">
            <div style="display: flex">
              <div class="date-container" @click="showCalendar = !showCalendar">
                {{ $t("admin.from") }}:
                {{ fromDate || $t("admin.selectDate") }}
              </div>
              <div class="date-container" @click="showCalendar = !showCalendar">
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
                  src="../../assets/images/calendar.svg"
                  alt=""
                  style="width: 1rem; height: 1rem; object-fit: contain"
                />
              </template>
            </date-picker>
          </template>
        </div>
      </div>
    </div>

    <b-table
      show-empty
      stacked="md"
      borderless
      :items="items"
      :fields="tablefields"
      :per-page="5"
      class="ash-data-table"
      @sort-changed="sortAppointments"
    >
      <template #head()="data">{{ $t("admin." + data.label) }} </template>

      <template #cell()="data">
        <template v-if="data.field.key == 'status'">
          <div
            class="badge"
            :class="
              data.value.toLowerCase() == 'paid'
                ? 'bg-primary'
                : data.value.toLowerCase() == 'cancelled'
                ? 'bg-danger'
                : 'bg-warning'
            "
          >
            {{ data.value | capitalize }}
          </div>
        </template>
        <template v-else-if="data.field.key == 'action'">
          <div class="action-buttons">
            <feather class="pointer" type="edit"></feather>
          </div>
        </template>
        <template v-else-if="data.field.key == 'patient_name'">
          <div class="user-name-with-image">
            <div class="image">
              <img :src="getImageUrl(data.item.patient_photo)" alt="user" />
            </div>
            <span class="text">{{ data.value }}</span>
          </div>
        </template>
        <template v-else>{{ data.value }}</template>
      </template>
    </b-table>
    <b-pagination
      v-model="currentPage"
      :total-rows="totalRows"
      :per-page="getPerPageSelection"
      class="my-0 justify-content-end"
      v-if="getPerPageSelection"
      @change="fetchAppointments"
    ></b-pagination>
    <b-pagination v-else class="my-0"> </b-pagination>
  </div>
</template>

<script>
import { appointmentService } from "../../services";
export default {
  data() {
    return {
      searchDoctorQuery: "",
      activeTab: "onsite",
      totalRows: 1,
      currentPage: 1,
      getPerPageSelection: 5,
      fromDate: null,
      toDate: null,
      dateRange: null,
      tablefields: [
        { key: "id", label: "id", sortable: true },
        { key: "patient_name", label: "patientName", sortable: true },
        { key: "mrn", label: "mrn", sortable: true },
        { key: "datetime", label: "dateTime", sortable: true },
        { key: "doctor_name", label: "consultingDoctor", sortable: true },
        { key: "status", label: "status" },
      ],
      items: [],
      showDatePicker: true,
      showCalendar: false,
      locale: "",
      sortBy: "",
      sortDesc: null,
      defaultStart: null,
      defaultEnd: null,
    };
  },
  mounted() {
    this.resetDates(true);
  },
  watch: {
    searchDoctorQuery(query) {
      this.fetchAppointments();
    },
  },
  computed: {
    disabledDate() {
      console.log("date", date, currentVal);
    },
  },
  methods: {
    resetDates(setDefault = false) {
      let now = new Date();
      const fromDate = this.dateFormatter(now, "YYYY-MM-DD");
      now = new Date();
      const toDate = this.dateFormatter(
        now.setFullYear(now.getFullYear() + 1),
        "YYYY-MM-DD"
      );

      this.fromDate = fromDate;
      this.toDate = toDate;
      if (setDefault) {
        this.defaultStart = fromDate;
        this.defaultEnd = toDate;
      }
      this.dateRange = [this.fromDate, this.toDate];
      this.fetchAppointments();
    },
    disabledBeforeTodayAndAfterAWeek(date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return date < today;
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
      this.fetchAppointments();
    },
    changeTab(type) {
      this.fetchAppointments(1, type);
    },
    parseData(data) {
      this.items = [];
      data.forEach((x) => {
        this.items.push({
          id: x.id,
          patient_name: this.getFullName(x.patient),
          datetime:
            this.formatLongDayDateFromDate(x.booked_date) +
            " / " +
            this.translateNumber(this.getTimeFromDate(x.start_time, true)) +
            " - " +
            this.translateNumber(this.getTimeFromDate(x.end_time, true)),
          doctor_name: this.getFullName(x.doctor),
          status: x.status,
          mrn: x.patient.id,
        });
      });
    },
    sortAppointments(filter) {
      this.sortDesc = filter.sortDesc;
      this.sortBy = filter.sortBy;
      this.fetchAppointments();
    },
    fetchAppointments(pageNumber = 1, type) {
      let fetchType = type;
      if (!fetchType) {
        fetchType = this.activeTab;
      }
      this.setLoadingState(true);
      let query = "";
      if (fetchType) {
        query += "?type=" + fetchType.toUpperCase();
      }
      if (this.sortBy) {
        query += "&sort_by=" + this.sortBy;
      }
      if (this.sortDesc !== null) {
        query += "&sort_direction=" + (this.sortDesc ? "DESC" : "ASC");
      }
      if (this.getPerPageSelection) {
        query += "&per_page=" + this.getPerPageSelection;
      }
      if (pageNumber) {
        query += "&page_number=" + pageNumber;
      }
      if (this.searchDoctorQuery) {
        if (isNaN(this.searchDoctorQuery))
          query += "&name=" + this.searchDoctorQuery;
        else query += "&mrn_number=" + this.searchDoctorQuery;
      }
      if (this.fromDate) {
        query += "&start_date=" + this.fromDate;
      }
      if (this.toDate) {
        query += "&end_date=" + this.toDate;
      }
      appointmentService.fetchAllAppointments(query).then(
        (response) => {
          if (response.data.status) {
            if (fetchType) this.activeTab = fetchType;
            this.parseData(response.data.data.items);
            this.currentPage = pageNumber;
            const tempRecord = response.data.data.items[0];
            if (tempRecord) {
              this.totalRows = tempRecord.total_records;
            } else {
              this.totalRows = 0;
            }
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
  },
};
</script>

<style lang="scss" scoped>
</style>