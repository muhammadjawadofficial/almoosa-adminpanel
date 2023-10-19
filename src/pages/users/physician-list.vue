<template>
  <div class="doctor-list-container page-body-container standard-width">
    <div class="search-box full-width mb-5">
      <div class="search-icon">
        <i class="fa fa-search" aria-hidden="true"></i>
      </div>
      <div class="search-input">
        <b-form-input
          :placeholder="$t('admin.searchPhysician')"
          id="type-search"
          type="search"
          v-model="searchQuery"
          debounce="1000"
        ></b-form-input>
      </div>

      <vue-excel-xlsx
        ref="export_to_excel_details"
        class="export-button"
        :data="totalItems"
        :columns="detailFields"
        :file-name="'physician-report'"
        :file-type="'xlsx'"
        :sheet-name="'physician-report-sheet'"
      >
      </vue-excel-xlsx>
      <button
        v-if="getUserPermissions.includes(constants.REPORTS_MANAGEMENT)"
        class="download-icon ml-auto"
        @click="downloadReport('details')"
      >
        <span class="d-sm-block d-none">
          {{ $t("download") }} {{ $t("admin.details") }}
        </span>
        <i class="fa fa-download" aria-hidden="true"></i>
      </button>

      <vue-excel-xlsx
        ref="export_to_excel_rating"
        class="export-button"
        :data="totalItems"
        :columns="ratingFields"
        :file-name="'physician-rating'"
        :file-type="'xlsx'"
        :sheet-name="'physician-rating-sheet'"
      >
      </vue-excel-xlsx>
      <button
        v-if="getUserPermissions.includes(constants.REPORTS_MANAGEMENT)"
        class="download-icon ml-auto"
        @click="downloadReport('rating')"
      >
        <span class="d-sm-block d-none">
          {{ $t("download") }} {{ $t("admin.rating") }}
        </span>
        <i class="fa fa-download" aria-hidden="true"></i>
      </button>
    </div>

    <b-table
      class="ash-data-table clickable"
      show-empty
      stacked="md"
      borderless
      :items="items"
      :fields="tablefields"
      :per-page="getPerPageSelection"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      @row-clicked="rowClicked"
      @sort-changed="sortUsers"
    >
      <template #empty>
        <div class="text-center my-2">{{ $t("noRecordToShow") }}</div>
      </template>

      <template #head()="data">{{ $t("admin." + data.label) }} </template>

      <template #cell()="data">
        <template v-if="data.field.key == 'status'">
          {{ $t("admin." + data.value) }}
        </template>
        <template v-else-if="data.field.key == 'action'">
          <div class="action-buttons">
            <feather class="pointer" type="edit"></feather>
          </div>
        </template>
        <template v-else-if="data.field.key == 'physicianName'">
          <div class="user-name-with-image">
            <!-- <div class="image">
              <img :src="getImageUrl(data.item.patient_photo)" alt="user" />
            </div> -->
            <span class="text">{{ getFullName(data.item) }}</span>
          </div>
        </template>
        <template v-else-if="data.field.key == 'speciality_id' && data.value">
          {{ parseSpeciality(data.value) }}
        </template>
        <template v-else>{{ data.value || "N/A" }}</template>
      </template>
    </b-table>
    <b-pagination
      v-model="currentPage"
      :total-rows="totalRows"
      :per-page="getPerPageSelection"
      class="my-0 justify-content-end"
      @change="fetchUsers"
      v-if="getPerPageSelection"
    ></b-pagination>
    <b-pagination v-else class="my-0"> </b-pagination>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { authService, userService } from "../../services";
export default {
  data() {
    return {
      sortBy: "id",
      sortDesc: false,
      searchQuery: "",
      totalRows: 1,
      currentPage: 1,
      getPerPageSelection: 5,
      ratingFields: [
        { field: "id", label: "Physician Id" },
        { field: "first_name", label: "First Name" },
        { field: "first_name_ar", label: "First Name Ar" },
        { field: "middle_name", label: "Middle Name" },
        { field: "middle_name_ar", label: "Middle Name Ar" },
        { field: "family_name", label: "Family Name" },
        { field: "family_name_ar", label: "Family Name Ar" },
        { field: "specialityEn", label: "Speciality" },
        { field: "specialityAr", label: "Speciality Ar" },
        { field: "gender", label: "Gender" },
        { field: "email", label: "Email Address" },
        { field: "phone_number", label: "Phone Number" },
        { field: "rating", label: "Rating" },
        { field: "rating_count", label: "Rating Count" },
      ],
      detailFields: [
        { field: "id", label: "Doctor ID" },
        { field: "first_name", label: "First Name" },
        { field: "first_name_ar", label: "First Name Ar" },
        { field: "middle_name", label: "Middle Name" },
        { field: "middle_name_ar", label: "Middle Name Ar" },
        { field: "family_name", label: "Family Name" },
        { field: "family_name_ar", label: "Family Name Ar" },
        { field: "specialityEn", label: "Speciality" },
        { field: "specialityAr", label: "Speciality Ar" },
        { field: "gender", label: "Gender" },
        { field: "dob", label: "DOB" },
        { field: "email", label: "Email" },
        { field: "phone_number", label: "Phone Number" },
        { field: "clinicsEn", label: "Clinics" },
        { field: "clinicsAr", label: "Clinics Ar" },
        { field: "nationalityEn", label: "Nationality" },
        { field: "nationalityAr", label: "Nationality Ar" },
        { field: "languages", label: "Languages" },
        { field: "languages_ar", label: "Languages Ar" },
        { field: "expertise", label: "Expertise" },
        { field: "expertise_ar", label: "Expertise Ar" },
        { field: "consulting_age_group", label: "Consulting Age Groups" },
        { field: "consulting_age_group_ar", label: "Consulting Age Groups Ar" },
        { field: "photoLink", label: "Photo Link" },
      ],
      tablefields: [
        { key: "id", label: "id" },
        { key: "physicianName", label: "physicianName" },
        { key: "speciality_id", label: "speciality" },
        { key: "gender", label: "gender" },
        { key: "email", label: "email" },
        { key: "phone_number", label: "phoneNumber" },
      ],
      items: [],
      totalItems: [],
      specialities: [],
    };
  },
  mounted() {
    this.fetchSpecialities();
    this.fetchUsers();
  },
  computed: {
    parseSpeciality() {
      return (id) => {
        let speciality = this.specialities.find((x) => x.id == id);
        return speciality ? speciality[this.getLocaleKey('title')] : id;
      };
    },
  },
  watch: {
    searchQuery() {
      this.fetchUsers();
    },
  },
  methods: {
    ...mapActions("user", ["setSelectedUser"]),
    downloadReport(type) {
      let perPage = this.totalRows;
      this.totalItems = [];
      let query = "&query=&page=1";
      if (perPage) {
        query += "&limit=" + perPage;
      }
      userService.getUsers("/search?role_id=4" + query).then(
        (response) => {
          if (response.data.status) {
            this.parseData(response.data.data.items, this.totalItems);
            this.$refs["export_to_excel_" + type].exportExcel();
          } else {
            this.failureToast(response.data.messsage);
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
    rowClicked(e) {
      let speciality = this.specialities.find((x) => x.id == e.speciality_id);
      if (!speciality) {
        this.failureIconModal(
          this.$t("failure"),
          this.$t("admin.specialityNotFound"),
          'm-payment-failure'
        );
        return;
      }
      this.setSelectedUser(e);
      this.navigateTo("Physician Profile");
    },
    parseData(data, items) {
      data.forEach((x) => {
        items.push({
          ...x,
          id: x.id,
          physicianName: this.getFullName(x),
          patient_photo: x.photo,
          email: x.email_address,
          phoneNumber: x.phone_number,
          status: x.status,
          nationalityEn: x.nationality_id ? x.nationality.nationality : "",
          nationalityAr: x.nationality_id ? x.nationality.nationality_ar : "",
          specialityEn: x.speciality ? x.speciality.title : "",
          specialityAr: x.speciality ? x.speciality.title_ar : "",
          clinicsEn: x.clinics ? x.clinics.map((x) => x.title).join(", ") : "",
          clinicsAr: x.clinics
            ? x.clinics.map((x) => x.title_ar).join(", ")
            : "",
          photoLink: x.photo_id ? this.getImageUrl(x.photo) : "",
        });
      });
    },
    sortUsers(filter) {
      this.sortDesc = filter.sortDesc;
      this.sortBy = filter.sortBy;
      this.fetchUsers();
    },
    fetchSpecialities() {
      authService.getSpecialitiesV1().then(
        (response) => {
          if (response.data.status) {
            this.specialities = response.data.data.items;
          } else {
            this.failureToast(response.data.messsage);
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
    fetchUsers(pageNumber = 1) {
      this.items = [];
      let query = "";
      //check if all alphabets
      if (this.searchQuery.match(/^[0-9]+$/)) {
        query += "&mr_number=" + this.searchQuery;
      } else {
        query += "&name=" + this.searchQuery;
      }
      query += "&sort_direction=" + (this.sortDesc ? "DESC" : "ASC");
      if (this.sortBy) {
        query += "&sort_by=" + this.sortBy;
      }
      if (this.getPerPageSelection) {
        query += "&per_page=" + this.getPerPageSelection;
      }
      if (pageNumber) {
        query += "&page_number=" + pageNumber;
      }
      userService.getDoctors("?role=DOCTOR" + query).then(
        (response) => {
          if (response.data.status) {
            this.parseData(response.data.data.items, this.items);
            this.currentPage = pageNumber;
            this.totalRows = this.items[0].total_records;
          } else {
            this.failureToast(response.data.messsage);
          }
          this.appointmentStatus = null;
        },
        (error) => {
          this.appointmentStatus = null;
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
</style>