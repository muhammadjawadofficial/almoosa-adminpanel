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
          v-model="searchQuery"
          debounce="500"
        ></b-form-input>
      </div>
    </div>
    <div class="filter-container">
      <div class="toggle-options">
        <div
          class="toggle-options--single"
          :class="{ active: activeTab == 'book' }"
          @click="changeTab('book')"
        >
          {{ $t("admin.booked") }}
          {{ $t("admin.appointments") }}
        </div>
        <div
          class="toggle-options--single"
          :class="{ active: activeTab == 'upcoming' }"
          @click="changeTab('upcoming')"
        >
          {{ $t("admin.upcoming") }}
          {{ $t("admin.appointments") }}
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
              format="DD-MM-YYYY"
              v-model="dateRange"
              :popup-style="{ top: 'calc(100% - 5px)', left: 0, right: 0 }"
              popup-class="hideSecondCalendar"
              value-type="format"
              class="ash-datepicker"
              range
              :open="showCalendar"
              :lang="getCurrentLang()"
              @input="dateChange"
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
      :current-page="currentPage"
      :per-page="5"
      class="ash-data-table"
      :class="{ clickable: isBookedAppointment }"
      @row-clicked="rowClicked"
    >
      <template #head()="data">{{ $t("admin." + data.label) }} </template>

      <template #cell()="data">
        <template v-if="data.field.key == 'type'">
          {{ $t("admin." + data.value) }}
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
      searchQuery: "",
      activeTab: "book",
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
        { key: "type", label: "appointmentType" },
      ],
      items: [],
      showDatePicker: true,
      showCalendar: false,
      locale: "",
      isBookedAppointment: false,
    };
  },
  mounted() {
    this.fetchAppointments(this.activeTab);
    this.isBookedAppointment = this.activeTab == "book";
  },
  watch: {
    searchQuery(query) {
      this.fetchAppointments();
    },
  },
  methods: {
    ...mapActions("appointment", ["setSelectedAppointment"]),
    rowClicked(e) {
      if (!this.isBookedAppointment) return;
      this.setSelectedAppointment(e);
      this.navigateTo("Appointment History Details");
    },
    dateChange(val) {
      this.fromDate = val[0];
      this.toDate = val[1];
      if (!this.fromDate || this.toDate) {
        this.showCalendar = false;
      }
      this.fetchAppointments();
    },
    changeTab(type) {
      this.fetchAppointments(type);
    },
    parseData(data) {
      this.items = [];
      data.forEach((x) => {
        this.items.push({
          id: x.id,
          patient_name: this.getFullName(x),
          patient_photo: x.patient && x.patient.photo,
          mrn: x.patient.mrn_number || "N/A",
          datetime:
            this.formatLongDayDateFromDate(x.booked_date) +
            " / " +
            this.translateNumber(
              this.removeSecondsFromTimeString(x.start_time)
            ) +
            " - " +
            this.translateNumber(this.removeSecondsFromTimeString(x.end_time)),
          doctor_name: this.getFullName(x.doctor),
          type: x.type,
          raw: x,
        });
      });
    },
    fetchAppointments(type) {
      this.setLoadingState(true);
      appointmentService.fetchAppointmentHistory(type).then(
        (response) => {
          if (response.data.status) {
            this.parseData(response.data.data.items);
            if (type) {
              this.activeTab = type;
              this.isBookedAppointment = this.activeTab == "book";
            }
            this.currentPage = 1;
            this.totalRows = this.items.length;
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
              error.response.data && error.response.data.messsage
            );
        }
      );
    },
  },
};
</script>

<style lang="scss" scoped>
</style>