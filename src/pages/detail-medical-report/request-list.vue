<template>
  <div class="doctor-list-container page-body-container standard-width">
    <div class="search-box full-width">
      <div class="search-icon">
        <i class="fa fa-search" aria-hidden="true"></i>
      </div>
      <div class="search-input">
        <b-form-input
          :placeholder="$t('admin.searchByAppointmentIdVisitNo')"
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
        :file-name="'request'"
        :file-type="'xlsx'"
        :sheet-name="'request-sheet'"
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
      <div class="toggle-options mt-0">
        <div
          class="toggle-options--single"
          :class="{ active: subTab == 'pending' }"
          @click="changeSubTab('pending')"
        >
          {{ $t("admin.requested") }}
        </div>
        <div
          class="toggle-options--single"
          :class="{ active: subTab == 'in-progress' }"
          @click="changeSubTab('in-progress')"
        >
          {{ $t("admin.inProgress") }}
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
              @click.stop="rowClicked(data.item)"
            ></feather>
            <feather
              class="pointer"
              type="trash"
              @click.stop="deleteRequest(data.item)"
            ></feather>
          </div>
        </template>
        <template
          v-else-if="data.field.key.includes('ated_by_user') && data.value"
        >
          <div class="user-name-with-image">
            <span class="text">
              ({{ data.value.id }}) {{ getFullName(data.value) }}
            </span>
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
        <template v-else-if="data.field.key == 'status'">
          {{ $t("admin." + data.value) }}
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
    <new-request-modal
      :active-tab="subTab"
      :existing-comments="selectedItemComments"
      @set-update-request="handleUpdateRequest"
    />
  </div>
</template>

<script>
import { medicalReportsService } from "../../services";
import newRequestModal from "./new-request-modal.vue";
export default {
  data() {
    return {
      searchQuery: "",
      itemId: null,
      totalRows: 1,
      currentPage: 1,
      getPerPageSelection: 5,
      fromDate: null,
      toDate: null,
      dateRange: null,
      tablefields: [
        { key: "id", label: "id", sortable: true },
        { key: "mrn_number", label: "mrnNumber" },
        {
          key: "appointment_id",
          label: "appointmentId",
          sortable: true,
        },
        {
          key: "visit_no",
          label: "visitNo",
          sortable: true,
        },
        {
          key: "status",
          label: "status",
          sortable: true,
        },
        {
          key: "created_at",
          label: "createdAt",
          sortable: true,
        },
        {
          key: "created_by_user",
          label: "createdBy",
        },
        {
          key: "updated_at",
          label: "updatedAt",
          sortable: true,
        },
        {
          key: "updated_by_user",
          label: "updatedBy",
        },
        { key: "action", label: "action" },
      ],
      fields: [
        { field: "id", label: "ID" },
        { field: "mrn_number", label: "MRN Number" },
        { field: "appointment_id", label: "Appointment ID" },
        { field: "visit_no", label: "Visit No" },
        { field: "status", label: "Status" },
        { field: "created_at", label: "Created At" },
        { field: "created_by_user_name_en", label: "Created By (English)" },
        { field: "created_by_user_name_ar", label: "Created By (Arabic)" },
        { field: "updated_at", label: "Updated At" },
        { field: "updated_by_user_name_en", label: "Updated By (English)" },
        { field: "updated_by_user_name_ar", label: "Updated By (Arabic)" },
      ],
      items: [],
      selectedItemComments: [],
      totalItems: [],
      showDatePicker: true,
      showCalendar: false,
      locale: "",
      subTab: "pending",
      availableOptions: ["pending", "in-progress", "approved", "rejected"],
    };
  },
  components: {
    "new-request-modal": newRequestModal,
  },
  mounted() {
    this.fetchRequests();
  },
  watch: {
    searchQuery(query) {
      this.filterList(query);
    },
  },
  computed: {
    getFirstOption() {
      return this.availableOptions.filter(
        (option) => option !== this.subTab
      )[0];
    },
    getSecondOption() {
      return this.availableOptions.filter(
        (option) => option !== this.subTab
      )[1];
    },
  },
  methods: {
    filterList(query) {
      this.items = this.totalItems.filter(
        (x) =>
          ("" + x.appointment_id).includes(query) ||
          ("" + x.visit_no).includes(query)
      );
      this.totalRows = this.items.length;
    },
    changeSubTab(type) {
      this.subTab = type;
      this.fetchRequests();
    },
    downloadReport() {
      if (!this.totalItems.length) return;
      this.$refs.export_to_excel.exportExcel();
    },
    openNewReportRequestModal() {
      this.$bvModal.show("newRequestCustomModal");
    },

    hideNewReportRequestModal() {
      this.$bvModal.hide("newRequestCustomModal");
    },
    parseData(data) {
      console.log("Data is :", data)
      this.items = [];
      data.forEach((x) => {
        this.items.push({
          ...x,
          patient_name: x.patient
            ? this.getFullName(x.patient, null, "en")
            : x.patient_name,
          patient_name_ar: x.patient
            ? this.getFullName(x.patient, null, "ar")
            : x.patient_name_ar,
          created_at_formatted: this.getLongDateAndTimeFromDate(
            x.created_at,
            true
          ),
          updated_at_formatted: this.getLongDateAndTimeFromDate(
            x.updated_at,
            true
          ),
          updated_by_user_name_en: x.updated_by_user
            ? `(${x.updated_by_user.id}) ${this.getFullName(
                x.updated_by_user,
                "",
                "en"
              )}`
            : "",
          created_by_user_name_en: x.created_by_user
            ? `(${x.created_by_user.id}) ${this.getFullName(
                x.created_by_user,
                "",
                "en"
              )}`
            : "",
          updated_by_user_name_ar: x.updated_by_user
            ? `(${x.updated_by_user.id}) ${this.getFullName(
                x.updated_by_user,
                "",
                "ar"
              )}`
            : "",
          created_by_user_name_ar: x.created_by_user
            ? `(${x.created_by_user.id}) ${this.getFullName(
                x.created_by_user,
                "",
                "ar"
              )}`
            : "",
          mrn_number: x.created_by_user ? x.created_by_user.mrn_number : "N/A",
        });
      });
      this.totalItems = [...this.items];
      this.filterList(this.searchQuery);
    },
    rowClicked(e) {
      this.itemId = e.id;
      this.selectedItemComments = e.comments || [];
      this.openNewReportRequestModal();
    },
    handleUpdateRequest(payload) {
      // console.log("New payload is:", payload);
      medicalReportsService
        .updateRequest(this.itemId, payload)
        .then((response) => {
          if (response.data.status) {
            this.fetchRequests();
          } else {
            this.failureToast(response.data.messsage);
          }
        })
        .catch((error) => {
          if (!this.isAPIAborted(error))
            this.failureToast(
              error.response &&
                error.response.data &&
                error.response.data.message
            );
        });
    },
    // rowClicked(e) {
    //   this.openNewReportRequestModal();
    //   console.log("Id is: ", e.id);

    //   return;
    //   this.confirmIconModal(
    //     this.$t("admin.editRequest"),
    //     this.$t("admin.editRequestDescription"),
    //     "m-info",
    //     this.$t("admin." + this.getFirstOption),
    //     this.$t("admin." + this.getSecondOption)
    //   ).then((res) => {
    //     if (res.value) {
    //       this.updateRequest(e.id, this.getFirstOption);
    //     } else if (res.dismiss == "cancel") {
    //       this.updateRequest(e.id, this.getSecondOption);
    //     }
    //   });
    // },
    fetchRequests() {
      let query = `?status=${this.subTab}`;
      medicalReportsService
        .fetchAllRequests(query)
        .then((response) => {
          if (response.data.status) {
            this.parseData(response.data.data.items);
            this.currentPage = 1;
            this.totalRows = this.items.length;
          } else {
            this.failureToast(response.data.messsage);
          }
        })
        .catch((error) => {
          if (!this.isAPIAborted(error))
            this.failureToast(
              error.response &&
                error.response.data &&
                error.response.data.message
            );
        });
    },
    updateRequest(id, status) {
      medicalReportsService
        .updateRequest(id, {
          status,
        })
        .then(
          (response) => {
            if (response.data.status) {
              this.fetchRequests();
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
    deleteRequest(item) {
      this.confirmIconModal(
        this.$t("areYouSure"),
        this.$t("admin.medicationRefillDeleteConfirm"),
        "m-check",
        this.$t("admin.delete")
      ).then((res) => {
        if (res.value) {
          medicalReportsService.deleteRequest(item.id).then(
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
  },
};
</script>

<style lang="scss" scoped></style>