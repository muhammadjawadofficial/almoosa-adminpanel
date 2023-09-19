<template>
  <div class="doctor-list-container page-body-container standard-width">
    <div class="search-box full-width">
      <div class="search-icon">
        <i class="fa fa-search" aria-hidden="true"></i>
      </div>
      <div class="search-input">
        <b-form-input
          :placeholder="$t('admin.searchByStatusAppointmentIdMRNPromoCode')"
          id="type-search"
          type="search"
          v-model="searchQuery"
          debounce="1000"
        ></b-form-input>
      </div>

      <vue-excel-xlsx
        ref="export_to_excel"
        class="export-button"
        :data="totalItems"
        :columns="fields"
        :file-name="'first-free-appointment'"
        :file-type="'xlsx'"
        :sheet-name="'first-free-appointment-sheet'"
      >
      </vue-excel-xlsx>
      <button class="download-icon ml-auto" @click="downloadReport()">
        <span class="d-sm-block d-none">{{ $t("download") }}</span>
        <i class="fa fa-download" aria-hidden="true"></i>
      </button>
    </div>
    <b-table
      show-empty
      responsive
      stacked="md"
      borderless
      :items="items"
      :fields="tablefields"
      :per-page="5"
      :sort-by="sortBy"
      :sort-desc="sortDesc"
      @sort-changed="sortUsers"
      class="ash-data-table mt-3"
    >
      <template #empty>
        <div class="text-center my-2">{{ $t("noRecordToShow") }}</div>
      </template>

      <template #head()="data">{{ $t("admin." + data.label) }} </template>

      <template #cell()="data">
        <template v-if="data.field.key.includes('status') && data.value">
          {{ $t("admin." + data.value) }}
        </template>
        <template v-else-if="data.field.key == 'action'">
          <div class="action-buttons">
            <feather class="pointer" type="edit"></feather>
          </div>
        </template>
        <template v-else-if="data.field.key == 'amount'">
          {{ data.value + " " + data.item.currency }}
        </template>
        <template
          v-else-if="
            data.field.key.toLowerCase().includes('updated') ||
            data.field.key.toLowerCase().includes('created')
          "
        >
          {{ getLongDateAndTimeFromDate(data.value, true) }}
        </template>
        <template v-else-if="data.field.key == 'user'">
          <div class="user-name-with-image">
            <div class="image">
              <img :src="getImageUrl(data.value.photo)" alt="user" />
            </div>
            <span class="text">{{ getFullName(data.value) || "N/A" }}</span>
          </div>
        </template>
        <div
          v-else-if="data.field.long"
          :title="data.value"
          class="truncate-table-field"
        >
          {{ data.value || "N/A" }}
        </div>
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
import { promotionService } from "../../services";
export default {
  data() {
    return {
      totalRows: 1,
      currentPage: 1,
      getPerPageSelection: 5,
      sortBy: "id",
      sortDesc: true,
      sortKey: "id",
      tablefields: [
        { key: "id", label: "id", sortable: true, sortPre: "id" },
        {
          key: "user",
          label: "patientName",
        },
        {
          key: "mrn_number",
          label: "mrn",
          sortable: true,
          sortPre: "mrn_number",
        },
        {
          key: "appointment_id",
          label: "appointmentId",
          sortable: true,
          sortPre: "appointment_id",
        },
        {
          key: "status",
          label: "status",
          sortable: true,
          sortPre: "status",
        },
        {
          key: "created_at",
          label: "createdAt",
          sortable: true,
          sortPre: "created_at",
        },
        {
          key: "updated_at",
          label: "updatedAt",
          sortable: true,
          sortPre: "updated_at",
        },
      ],
      fields: [
        {
          field: "id",
          label: "ID",
        },
        {
          field: "patientFirstName",
          label: "Patient First Name",
        },
        {
          field: "patientMiddleName",
          label: "Patient Middle Name",
        },
        {
          field: "patientFamilyName",
          label: "Patient Family Name",
        },
        {
          field: "patientFirstNameAr",
          label: "Patient First Name Ar",
        },
        {
          field: "patientMiddleNameAr",
          label: "Patient Middle Name Ar",
        },
        {
          field: "patientFamilyNameAr",
          label: "Patient Family Name Ar",
        },
        {
          field: "mrn_number",
          label: "Patient MRN",
        },
        {
          field: "appointment_id",
          label: "Appointment ID",
        },
        {
          field: "status",
          label: "Status",
        },
        {
          field: "created_at",
          label: "Created At",
        },
        {
          field: "updated_at",
          label: "Updated At",
        },
      ],
      items: [],
      totalItems: [],
      searchQuery: "",
    };
  },
  mounted() {
    this.fetchUsers();
  },
  watch: {
    searchQuery() {
      this.fetchUsers();
    },
  },
  methods: {
    sortUsers(filter) {
      this.sortDesc = filter.sortDesc;
      let field = this.tablefields.find((x) => x.key == filter.sortBy);
      this.sortKey = field.sortPre || "";
      this.sortBy = filter.sortBy;
      this.fetchUsers();
    },
    parseData(data, items) {
      data.forEach((x) => {
        items.push({
          patientName: x.user && this.getFullName(x.user),
          patientFirstName: x.user && x.user.first_name,
          patientMiddleName: (x.user && x.user.middle_name) || "",
          patientFamilyName: (x.user && x.user.family_name) || "",
          patientFirstNameAr: (x.user && x.user.first_name_ar) || "",
          patientMiddleNameAr: (x.user && x.user.middle_name_ar) || "",
          patientFamilyNameAr: (x.user && x.user.family_name_ar) || "",
          appointment_id: x.appointment_id || "",
          ...x,
        });
      });
    },
    fetchUsers(pageNumber = 1) {
      this.items = [];
      let payload = {
        query: this.searchQuery,
        sort: this.sortDesc ? "DESC" : "ASC",
        orderBy: this.sortKey,
        limit: this.getPerPageSelection,
        page: pageNumber,
      };
      promotionService.getFirstFreeAppointmentReport(payload).then(
        (response) => {
          if (response.data.status) {
            this.parseData(response.data.data.items, this.items);
            this.currentPage = pageNumber;
            this.totalRows = response.data.data.total_records;
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
    downloadReport() {
      this.totalItems = [];
      let payload = {
        query: this.searchQuery,
        sort: this.sortDesc ? "DESC" : "ASC",
        orderBy: this.sortKey,
        limit: this.totalRows,
        page: "1",
      };
      promotionService.getFirstFreeAppointmentReport(payload).then(
        (response) => {
          if (response.data.status) {
            this.parseData(response.data.data.items, this.totalItems);
            console.log(this.totalItems);
            this.$refs.export_to_excel.exportExcel();
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
  },
};
</script>

<style lang="scss" scoped></style>