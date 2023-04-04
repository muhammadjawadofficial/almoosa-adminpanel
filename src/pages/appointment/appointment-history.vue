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
          debounce="1000"
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
      <template #empty>
        <div class="text-center my-2">{{ $t("noRecordToShow") }}</div>
      </template>

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
            {{ $t("paymentStatus." + data.value.toLowerCase()) }}
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
            <span class="text">
              {{ getFullName(data.item.patient) }}
            </span>
          </div>
        </template>
        <template v-else-if="data.field.key == 'doctor_name'">
          {{ getFullName(data.item.doctor, $t("dr")) }}
        </template>
        <template v-else-if="data.field.key == 'speciality'">
          {{ data.item.doctor[getLocaleKey("speciality")] }}
        </template>
        <template v-else-if="data.field.key == 'datetime'">
          {{
            formatLongDayDateFromDate(data.item.booked_date) +
            " / " +
            translateNumber(getTimeFromDate(data.item.start_time, true)) +
            " - " +
            translateNumber(getTimeFromDate(data.item.end_time, true))
          }}
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
import { mapActions } from "vuex";
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
        { key: "speciality", label: "speciality" },
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
  methods: {
    ...mapActions("appointment", ["setSelectedAppointment"]),
    resetDates(setDefault = false) {
      let now = new Date();
      const fromDate = this.dateFormatter(
        now.setFullYear(now.getFullYear() - 1),
        "YYYY-MM-DD"
      );
      now = new Date();
      const toDate = this.dateFormatter(
        now.setDate(now.getDate() - 1),
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
    onRowSelected(e) {
      this.setSelectedAppointment(e);
      this.navigateTo("Appointment History Details");
    },
    disabledBeforeTodayAndAfterAWeek(date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return today <= date;
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
          mrn: x.patient.id,
          ...x,
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
      let query = "?";
      if (fetchType) {
        query += "&type=" + fetchType.toUpperCase();
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

<style lang="scss" scoped></style>