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
    >
      <template #head()="data">{{ $t("admin." + data.label) }} </template>

      <template #cell()="data">
        <template v-if="data.field.key == 'status'">
          <div
            class="badge"
            :class="
              data.value == 'confirmed'
                ? 'bg-primary'
                : data.value == 'cancelled'
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
        { key: "doctor_id", label: "doctorId", sortable: true },
        { key: "status", label: "status" },
      ],
      items: [],
      showDatePicker: true,
      showCalendar: false,
      locale: "",
    };
  },
  mounted() {
    this.fetchAppointments(this.activeTab);
  },
  watch: {
    searchDoctorQuery(query) {
      this.fetchAppointments();
    },
  },
  methods: {
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
          patient_name:
            x.patient.first_name +
            (x.patient.middle_name ? " " + x.patient.middle_name : "") +
            (x.patient.family_name ? " " + x.patient.family_name : ""),
          patient_photo: x.patient.photo,
          mrn: x.mrn_number || "N/A",
          datetime:
            this.formatLongDayDateFromDate(x.booked_date) +
            " / " +
            this.translateNumber(
              this.removeSecondsFromTimeString(x.start_time)
            ) +
            " - " +
            this.translateNumber(this.removeSecondsFromTimeString(x.end_time)),
          doctor_name:
            x.doctor.first_name +
            (x.doctor.middle_name ? " " + x.doctor.middle_name : "") +
            (x.doctor.family_name ? " " + x.doctor.family_name : ""),
          doctor_id: x.doctor.id,
          status: x.status,
        });
      });
    },
    fetchAppointments(type) {
      this.setLoadingState(true);
      appointmentService.fetchAppointments(type).then(
        (response) => {
          if (response.data.status) {
            if (type) this.activeTab = type;
            this.parseData(response.data.data.items);
            this.currentPage = 1;
            this.totalRows = this.items.length;
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
  },
};
</script>

<style lang="scss" scoped>
</style>