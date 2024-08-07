<template>
  <div class="doctor-list-container page-body-container standard-width">
    <div class="search-box full-width mb-5">
      <div class="search-icon">
        <i class="fa fa-search" aria-hidden="true"></i>
      </div>
      <div class="search-input">
        <b-form-input
          :placeholder="$t('admin.searchInsurance')"
          id="type-search"
          type="search"
          v-model="searchQuery"
          debounce="1000"
        ></b-form-input>
      </div>

      <vue-excel-xlsx
        ref="export_to_excel"
        class="export-button"
        :data="items"
        :columns="fields"
        :file-name="'insurance-request'"
        :file-type="'xlsx'"
        :sheet-name="'insurance-request-sheet'"
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
    <div class="filter-container">
      <div class="toggle-options mt-0">
        <div
          class="toggle-options--single"
          :class="{ active: activeTab == 'Sent for approval' }"
          @click="changeTab('Sent for approval')"
        >
          {{ $t("admin.pending") }}
        </div>
        <div
          class="toggle-options--single"
          :class="{ active: activeTab == 'approved' }"
          @click="changeTab('approved')"
        >
          {{ $t("admin.approved") }}
        </div>
        <div
          class="toggle-options--single"
          :class="{ active: activeTab == 'rejected' }"
          @click="changeTab('rejected')"
        >
          {{ $t("admin.rejected") }}
        </div>
      </div>
    </div>

    <b-table
      show-empty
      stacked="md"
      borderless
      responsive
      :items="filteredItems"
      :fields="tablefields"
      :current-page="currentPage"
      :per-page="5"
      class="ash-data-table"
    >
      <template #empty>
        <div class="text-center my-2">{{ $t("noRecordToShow") }}</div>
      </template>

      <template #head()="data">{{ $t("admin." + data.label) }} </template>

      <template #cell()="data">
        <template v-if="data.field.key == 'action'">
          <div class="action-buttons">
            <feather
              class="pointer"
              type="edit"
              @click.stop="editInsurance(data.item)"
            ></feather>
            <feather
              class="pointer"
              type="trash"
              @click.stop="deleteInsurance(data.item)"
            ></feather>
          </div>
        </template>
        <template v-else-if="data.field.key == 'thumbnail'">
          <div class="user-name-with-image">
            <div class="image">
              <img :src="getImageUrl(data.value)" alt="user" />
            </div>
          </div>
        </template>
        <template v-else-if="data.field.translate">
          {{ data.item[getLocaleKey(data.field.key)] }}
        </template>
        <template v-else-if="data.field.key == 'status'">
          {{ $t("admin." + data.value.toLowerCase()) }}
        </template>
        <template v-else-if="data.field.key == 'updated_by' && data.value">
          <div class="user-name-with-image">
            <span class="text">
              ({{ data.value.id }}) {{ getFullName(data.value) }}</span
            >
          </div>
        </template>
        <template
          v-else-if="
            data.field.key.toLowerCase().includes('updated_at') ||
            data.field.key.toLowerCase().includes('created_at')
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
      class="my-0 justify-content-end"
      v-if="getPerPageSelection"
    ></b-pagination>
    <b-pagination v-else class="my-0"> </b-pagination>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { insuranceService } from "../../services";
export default {
  data() {
    return {
      searchQuery: "",
      totalRows: 1,
      currentPage: 1,
      getPerPageSelection: 5,
      fields: [
        { field: "id", label: "Request Id" },
        { field: "company_name", label: "Company Name" },
        { field: "mrn_number", label: "Patient MRN" },
        { field: "first_name", label: "Patient First Name" },
        { field: "first_name_ar", label: "Patient First Name Ar" },
        { field: "middle_name", label: "Patient Middle Name" },
        { field: "middle_name_ar", label: "Patient Middle Name Ar" },
        { field: "family_name", label: "Patient Family Name" },
        { field: "family_name_ar", label: "Patient Family Name Ar" },
        { field: "card_link", label: "Insurance Card Photo" },
        { field: "status", label: "Status" },
        { field: "created_at_formatted", label: "Created At" },
        { field: "updated_at_formatted", label: "Updated At" },
        { field: "updated_by_user", label: "Updated By" },
      ],
      tablefields: [
        { key: "id", label: "id", sortable: true },
        { key: "company_name", label: "companyName", sortable: true },
        { key: "patient.mrn_number", label: "mrn", sortable: true },
        { key: "status", label: "status", sortable: true },
        { key: "created_at", label: "createdAt", sortable: true },
        { key: "updated_at", label: "updatedAt", sortable: true },
        { key: "updated_by", label: "updatedBy" },
      ],
      items: [],
      filteredItems: [],
      sortBy: "",
      sortDesc: null,
      activeTab: "Sent for approval",
    };
  },
  watch: {
    searchQuery(query) {
      this.filteredItems = this.items.filter((item) => {
        return item.company_name.toLowerCase().includes(query.toLowerCase());
      });
      this.totalRows = this.filteredItems.length;
    },
  },
  mounted() {
    this.fetchInsurances();
  },
  methods: {
    ...mapActions("insuranceManagement", ["setSelectedInsuranceManagement"]),
    changeTab(type) {
      this.activeTab = type;
      this.fetchInsurances(1, type);
    },
    downloadReport() {
      if (!this.items.length) return;
      this.$refs.export_to_excel.exportExcel();
    },
    editInsurance(row) {
      this.setSelectedInsuranceManagement(row);
      this.navigateTo("Insurance Management Details");
    },
    deleteInsurance(item) {
      this.confirmIconModal(
        this.$t("areYouSure"),
        this.$t("admin.insuranceDeleteConfirm"),
        "m-check",
        this.$t("admin.delete")
      ).then((res) => {
        if (res.value) {
          insuranceService.deleteInsurance(item.id).then(
            (response) => {
              if (response.data.status) {
                this.parseData(this.items.filter((x) => x.id != item.id));
                this.successIconModal(
                  this.$t("changesDone"),
                  this.$t("admin.insuranceDeleteSuccess")
                );
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
        }
      });
    },
    parseData(data) {
      this.items = [];
      data.forEach((x) => {
        this.items.push({
          ...x,
          id: x.id,
          mrn_number: (x.patient && x.patient.mrn_number) || "",
          first_name: (x.patient && x.patient.first_name) || "",
          first_name_ar: (x.patient && x.patient.first_name_ar) || "",
          middle_name: (x.patient && x.patient.middle_name) || "",
          middle_name_ar: (x.patient && x.patient.middle_name_ar) || "",
          family_name: (x.patient && x.patient.family_name) || "",
          family_name_ar: (x.patient && x.patient.family_name_ar) || "",
          card_link: x.insurance_card_id
            ? this.getImageUrl(x.insurance_card)
            : "",
          created_at_formatted: this.getLongDateAndTimeFromDate(
            x.created_at,
            true
          ),
          updated_at_formatted: this.getLongDateAndTimeFromDate(
            x.updated_at,
            true
          ),
          updated_by_user: x.updated_by
            ? `(${x.updated_by.id}) ${this.getFullName(x.updated_by, "", "en")}`
            : "",
        });
      });
      this.filteredItems = this.items;
      this.totalRows = this.items.length;
    },
    fetchInsurances() {
      insuranceService.fetchAllInsurances("?status=" + this.activeTab).then(
        (response) => {
          if (response.data.status) {
            let data = response.data.data.items;
            this.parseData(data);
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