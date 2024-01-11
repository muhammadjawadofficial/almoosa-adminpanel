<template>
  <div class="doctor-list-container page-body-container standard-width">
    <back-navigation
      :title="$t('admin.patientDetails')"
      backLink="Patient Details"
      v-if="userId"
    />
    <div class="search-box full-width mb-3" :class="{ 'mt-4': !!userId }">
      <div class="search-icon">
        <i class="fa fa-search" aria-hidden="true"></i>
      </div>
      <div class="search-input">
        <b-form-input
          :placeholder="$t('admin.searchLoyaltyPointsByNameOrMRN')"
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
        :file-name="'loyalty-point-logs'"
        :file-type="'xlsx'"
        :sheet-name="'loyalty-point-logs-sheet'"
      >
      </vue-excel-xlsx>
      <button
        class="download-icon ml-auto"
        :class="{ disabled: !items.length }"
        @click="downloadReport()"
      >
        <span class="d-sm-block d-none">{{ $t("download") }}</span>
        <i class="fa fa-download" aria-hidden="true"></i>
      </button>
    </div>
    <div class="filter-container" v-if="!this.userId">
      <div class="toggle-options mb-0">
        <div
          class="toggle-options--single"
          :class="{ active: activeTab == '1' }"
          @click="changeTab('1')"
        >
          {{ $t("admin.rewarded") }}
        </div>
        <div
          class="toggle-options--single"
          :class="{ active: activeTab == '2' }"
          @click="changeTab('2')"
        >
          {{ $t("admin.redeemed") }}
        </div>
        <div
          class="toggle-options--single"
          :class="{ active: activeTab == '0' }"
          @click="changeTab('0')"
        >
          {{ $t("admin.manual") }}
        </div>
      </div>
    </div>
    <b-table
      show-empty
      responsive
      stacked="md"
      borderless
      :items="items"
      :fields="tableFields"
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
        <template v-if="data.field.key == 'status'">
          {{ $t("admin." + data.value) }}
        </template>
        <template
          v-else-if="
            (data.field.key == 'updated_by' ||
              data.field.key == 'created_by' ||
              data.field.key == 'user') &&
            data.value
          "
        >
          <span class="text">
            ({{ data.value.id }}) {{ getFullName(data.value) }}
          </span>
        </template>
        <template
          v-else-if="
            (data.field.key.toLowerCase().includes('updated_at') ||
              data.field.key.toLowerCase().includes('created_at')) &&
            data.value
          "
        >
          {{ getLongDateAndTimeFromDate(data.value, true) }}
        </template>
        <template v-else>{{ data.value || "N/A" }}</template>
      </template>
    </b-table>
    <b-pagination
      v-model="currentPage"
      :total-rows="totalRows"
      :per-page="getPerPageSelection"
      @change="fetchAllLoyaltyPointLogs(activeTab, $event)"
      class="my-0 justify-content-end"
      v-if="getPerPageSelection"
    ></b-pagination>
    <b-pagination v-else class="my-0"> </b-pagination>
  </div>
</template>

<script>
import { userService } from "../../services";
export default {
  data() {
    return {
      sortBy: "id",
      sortDesc: true,
      searchQuery: "",
      sortKey: "id",
      totalRows: 1,
      currentPage: 1,
      getPerPageSelection: 5,
      fields: [
        { field: "id", label: "Id" },
        { field: "first_name", label: "First Name" },
        { field: "first_name_ar", label: "First Name Ar" },
        { field: "middle_name", label: "Middle Name" },
        { field: "middle_name_ar", label: "Middle Name Ar" },
        { field: "family_name", label: "Family Name" },
        { field: "family_name_ar", label: "Family Name Ar" },
        { field: "appointment_id", label: "Appointment ID" },
        { field: "mrn_number", label: "MRN" },
        { field: "loyalty_points", label: "Loyalty Points" },
        { field: "amount", label: "Amount" },
        { field: "created_at", label: "Created At" },
        { field: "created_by_name", label: "Created By" },
      ],
      items: [],
      totalItems: [],
      userId: null,
      activeTab: "",
    };
  },
  mounted() {
    this.fetchAllLoyaltyPointLogs("1");
  },
  watch: {
    searchQuery() {
      this.fetchAllLoyaltyPointLogs(this.activeTab, 1);
    },
  },
  computed: {
    tableFields() {
      let skipInManual = ["appointment_id", "amount"];
      let skipInRewarded = ["amount"];
      let skipInRedeemed = ["appointment_id"];
      return [
        { key: "id", label: "id", sortable: true },
        { key: "amount", label: "amount", sortable: true },
        { key: "appointment_id", label: "appointmentId", sortable: true },
        {
          key: "loyalty_points",
          label: "loyaltyPoints",
          sortable: true,
        },
        { key: "user", label: "patient" },
        { key: "created_at", label: "createdAt", sortable: true },
        { key: "created_by", label: "createdBy" },
      ].filter((x) => {
        if (this.activeTab == "0") {
          return !skipInManual.includes(x.key);
        } else if (this.activeTab == "1") {
          return !skipInRewarded.includes(x.key);
        } else if (this.activeTab == "2") {
          return !skipInRedeemed.includes(x.key);
        }
        return true;
      });
    },
  },
  methods: {
    changeTab(type) {
      this.activeTab = type;
      this.fetchAllLoyaltyPointLogs(type, 1);
    },
    sortUsers(filter) {
      this.sortDesc = filter.sortDesc;
      this.sortBy = filter.sortBy;
      this.fetchAllLoyaltyPointLogs(this.activeTab);
    },
    parseData(data, items) {
      data.forEach((x) => {
        items.push({
          ...x,
          first_name: (x.user && x.user.first_name) || "N/A",
          first_name_ar: (x.user && x.user.first_name_ar) || "N/A",
          middle_name: (x.user && x.user.middle_name) || "N/A",
          middle_name_ar: (x.user && x.user.middle_name_ar) || "N/A",
          family_name: (x.user && x.user.family_name) || "N/A",
          family_name_ar: (x.user && x.user.family_name_ar) || "N/A",
          mrn_number: (x.user && x.user.mrn_number) || "N/A",
          created_by_name:
            x.created_by && this.getFullName(x.created_by, "", "en"),
        });
      });
    },
    fetchAllLoyaltyPointLogs(status = "", pageNumber = 1) {
      this.items = [];
      let query = "?query=" + this.searchQuery;
      if (this.sortKey) {
        query +=
          "&sort=" +
          (this.sortDesc ? "DESC" : "ASC") +
          "&orderBy=" +
          this.sortKey;
      }
      query += "&limit=" + this.getPerPageSelection;
      if (pageNumber) {
        query += "&page=" + pageNumber;
      }
      if (status) {
        query += "&status=" + status;
      } else if (this.activeTab) {
        query += "&status=" + this.activeTab;
      } else {
        query += "&status=1";
      }

      userService.fetchAllLoyaltyPoints(query).then(
        (response) => {
          if (response.data.status) {
            this.activeTab = status || "1";
            this.parseData(response.data.data.items, this.items);
            this.currentPage = pageNumber;
            this.totalRows = response.data.data.total_records;
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
    downloadReport() {
      let perPage = this.totalRows || this.getPerPageSelection;
      if (this.totalRows < 1) return;

      this.totalItems = [];
      let query = "?query=&page=1";
      if (perPage) {
        query += "&limit=" + perPage;
      }
      query += "&status=" + this.activeTab || "1";

      userService.fetchAllLoyaltyPoints(query).then(
        (response) => {
          if (response.data.status) {
            this.parseData(response.data.data.items, this.totalItems);
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