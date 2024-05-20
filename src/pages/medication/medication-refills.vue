<template>
  <div class="doctor-list-container page-body-container standard-width">
    <div class="search-box full-width">
      <div class="search-icon">
        <i class="fa fa-search" aria-hidden="true"></i>
      </div>
      <div class="search-input">
        <b-form-input
          :placeholder="$t('admin.searchByMrn')"
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
        :columns="getReportFields"
        :file-name="'medication-refills'"
        :file-type="'xlsx'"
        :sheet-name="'medication-refills-sheet'"
      >
      </vue-excel-xlsx>
      <button
        v-if="getUserPermissions.includes(constants.REPORTS_MANAGEMENT)"
        class="download-icon ml-auto"
        :class="{ disabled: !totalItems.length }"
        @click="downloadReport()"
      >
        <span class="d-sm-block d-none">{{ $t("download") }}</span>
        <i class="fa fa-download" aria-hidden="true"></i>
      </button>
    </div>
    <div class="filter-container">
      <div class="toggle-options">
        <div
          class="toggle-options--single"
          :class="{ active: activeTab == 'refillRequest' }"
          @click="changeTab('refillRequest')"
        >
          {{ $t("admin.refillRequest") }}
        </div>
        <div
          class="toggle-options--single"
          :class="{ active: activeTab == 'deliveryRequest' }"
          @click="changeTab('deliveryRequest')"
        >
          {{ $t("admin.deliveryRequest") }}
        </div>
      </div>
    </div>
    <div class="filters-container">
      <div class="toggle-options mt-0">
        <div
          class="toggle-options--single"
          :class="{ active: subTab == 'pending' }"
          @click="changeSubTab('pending')"
        >
          {{ $t("admin.pending") }}
        </div>
        <div
          class="toggle-options--single"
          :class="{ active: subTab == 'approved' }"
          @click="changeSubTab('approved')"
        >
          {{ $t("admin.approved") }}
        </div>
        <div
          class="toggle-options--single"
          :class="{ active: subTab == 'rejected' }"
          @click="changeSubTab('rejected')"
        >
          {{ $t("admin.rejected") }}
        </div>
      </div>
    </div>
    <b-table
      show-empty
      responsive
      stacked="md"
      borderless
      :items="items"
      :fields="getTableFields"
      :current-page="currentPage"
      :per-page="5"
      class="ash-data-table"
    >
      <template #empty>
        <div class="text-center my-2">{{ $t("noRecordToShow") }}</div>
      </template>

      <template #head()="data">{{ $t("admin." + data.label) }} </template>

      <template #cell()="data">
        <template v-if="data.field.key == 'medicationRefillRequested'">
          {{ $t("admin." + data.value) }}
        </template>
        <template v-else-if="data.field.key == 'action'">
          <div class="action-buttons">
            <feather
              class="pointer"
              type="edit"
              @click.stop="rowClicked(data.item)"
            ></feather>
            <feather
              class="pointer"
              type="trash"
              @click.stop="deleteMedicationRefill(data.item)"
            ></feather>
          </div>
        </template>
        <template v-else-if="data.field.translate && data.value">
          {{ data.field.key.toLowerCase().includes("doctor") ? $t("dr") : "" }}
          {{ data.item[getLocaleKey(data.field.key)] }}
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
import { medicationService } from "../../services";
export default {
  data() {
    return {
      searchQuery: "",
      totalRows: 1,
      currentPage: 1,
      getPerPageSelection: 5,
      fromDate: null,
      toDate: null,
      dateRange: null,
      tablefields: [
        { key: "id", label: "id", sortable: true },
        {
          key: "mrn_number",
          label: "mrn",
          sortable: true,
        },
        {
          key: "patient_name",
          label: "patientName",
          sortable: true,
          translate: true,
        },
        { key: "phone_number", label: "phoneNumber", sortable: true },
        {
          key: "doctor_id",
          label: "doctorId",
          sortable: true,
        },
        {
          key: "doctor_name",
          label: "consultingDoctor",
          sortable: true,
          translate: true,
        },
        {
          key: "insurance_corp_name",
          label: "companyName",
          sortable: true,
        },
        {
          key: "speciality",
          label: "speciality",
          sortable: true,
          translate: true,
        },
        {
          key: "delivery_name",
          label: "deliveryName",
          sortable: true,
          translate: true,
          delivery: true,
        },
        {
          key: "delivery_phone",
          label: "deliveryPhone",
          sortable: true,
          translate: true,
          delivery: true,
        },
        {
          key: "delivery_address",
          label: "deliveryAddress",
          sortable: true,
          translate: true,
          delivery: true,
        },
        {
          key: "medicationRefillRequested",
          label: "refillRequest",
          sortable: true,
        },
        {
          key: "created_at",
          label: "createdAt",
          sortable: true,
        },
        {
          key: "updated_at",
          label: "updatedAt",
          sortable: true,
        },
        {
          key: "updated_by",
          label: "updatedBy",
        },
        { key: "action", label: "action" },
      ],
      fields: [
        { field: "id", label: "Request ID" },
        {
          field: "patient_name",
          label: "Patient Name",
        },
        { field: "phone_number", label: "Phone Number" },
        {
          field: "doctor_name",
          label: "Physician Name",
        },
        {
          field: "speciality",
          label: "Speciality",
        },
        {
          field: "insurance_corp_name",
          label: "Insurance Corp Name",
        },
        {
          key: "delivery_name",
          label: "Delivery Name",
          delivery: true,
        },
        {
          key: "delivery_phone",
          label: "Delivery Phone",
          delivery: true,
        },
        {
          key: "delivery_address",
          label: "Delivery Address",
          delivery: true,
        },
        {
          field: "medicationRefillRequested",
          label: "Status",
        },
        { field: "created_at_formatted", label: "Created At" },
        { field: "updated_at_formatted", label: "Updated At" },
        { field: "updated_by_user", label: "Updated By" },
      ],
      items: [],
      totalItems: [],
      showDatePicker: true,
      showCalendar: false,
      locale: "",
      activeTab: "refillRequest",
      subTab: "pending",
    };
  },
  mounted() {
    this.fetchMedications();
  },
  watch: {
    searchQuery(query) {
      this.filterList(query);
    },
  },
  computed: {
    getTableFields() {
      if (this.activeTab != "deliveryRequest") {
        return this.tablefields.filter((x) => !x.delivery);
      }
      return this.tablefields;
    },
    getReportFields() {
      if (this.activeTab != "deliveryRequest") {
        return this.fields.filter((x) => !x.delivery);
      }
    },
  },
  methods: {
    ...mapActions("myMedication", ["setSelectedMedication"]),
    downloadReport() {
      if (!this.totalItems.length) return;
      this.$refs.export_to_excel.exportExcel();
    },
    rowClicked(e) {
      this.setSelectedMedication(e);
      this.navigateTo("All Medication Details");
    },
    filterList(query) {
      this.items = this.totalItems.filter((x) =>
        ("" + x.mrn_number).includes(query)
      );
      this.totalRows = this.items.length;
    },
    dateChange(val) {
      this.fromDate = val[0];
      this.toDate = val[1];
      if (!this.fromDate || this.toDate) {
        this.showCalendar = false;
      }
      this.fetchMedications();
    },
    changeTab(type) {
      this.fetchMedications();
      this.activeTab = type;
    },
    changeSubTab(type) {
      this.subTab = type;
      this.fetchMedications();
    },
    parseData(data) {
      this.items = [];
      data.forEach((x) => {
        if (this.activeTab == "refillRequest" && x.is_delivery) return;
        if (this.activeTab == "deliveryRequest" && !x.is_delivery) return;
        this.items.push({
          ...x,
          patient_name: x.patient
            ? this.getFullName(x.patient, null, "en")
            : x.patient_name,
          patient_name_ar: x.patient
            ? this.getFullName(x.patient, null, "ar")
            : x.patient_name_ar,
          doctor_name: x.doctor
            ? this.getFullName(x.doctor, null, "en")
            : x.doctor_name,
          doctor_name_ar: x.doctor
            ? this.getFullName(x.doctor, null, "ar")
            : x.doctor_name_ar,
          phone_number: x.patient ? x.patient.phone_number : x.phone_number,
          medicationRefillRequested: x.status,
          speciality: x.clinic ? x.clinic.title : "",
          speciality_ar: x.clinic ? x.clinic.title_ar : "",
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
      this.totalItems = [...this.items];
      this.filterList(this.searchQuery);
    },
    fetchMedications() {
      medicationService.getMedicationRefills("?status=" + this.subTab).then(
        (response) => {
          if (response.data.status) {
            this.parseData(response.data.data.items);
            this.currentPage = 1;
            this.totalRows = this.items.length;
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
    deleteMedicationRefill(item) {
      this.confirmIconModal(
        this.$t("areYouSure"),
        this.$t("admin.medicationRefillDeleteConfirm"),
        "m-check",
        this.$t("admin.delete")
      ).then((res) => {
        if (res.value) {
          medicationService.deleteMedicationRefill(item.id).then(
            (response) => {
              if (response.data.status) {
                this.items = [...this.items.filter((x) => x.id != item.id)];
                this.totalItems = [...this.items];
                this.totalRows = this.items.length;
                this.successIconModal(
                  this.$t("changesDone"),
                  this.$t("admin.medicationRefillDeleteSuccess")
                );
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
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>