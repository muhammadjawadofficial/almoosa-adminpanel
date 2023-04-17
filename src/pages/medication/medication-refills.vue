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
          key: "patient_name",
          label: "patientName",
          sortable: true,
          translate: true,
        },
        {
          key: "doctor_name",
          label: "consultingDoctor",
          sortable: true,
          translate: true,
        },
        { key: "phone_number", label: "phoneNumber", sortable: true },
        {
          key: "speciality",
          label: "speciality",
          sortable: true,
          translate: true,
        },
        {
          key: "medicationRefillRequested",
          label: "refillRequest",
          sortable: true,
        },
        { key: "action", label: "action" },
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
  methods: {
    ...mapActions("myMedication", ["setSelectedMedication"]),
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
      this.activeTab = type;
      this.fetchMedications();
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
          medicationRefillRequested: x.status,
          speciality: x.clinic ? x.clinic.title : "",
          speciality_ar: x.clinic ? x.clinic.title_ar : "",
          ...x,
        });
      });
      this.totalItems = [...this.items];
      this.filterList(this.searchQuery);
      console.log(this.searchQuery, 'asldkasldkf')
    },
    fetchMedications() {
      this.setLoadingState(true);
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
          this.setLoadingState(false);
        },
        (error) => {
          this.appointmentStatus = null;
          this.setLoadingState(false);
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
          this.setLoadingState(true);
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
              this.setLoadingState(false);
            },
            (error) => {
              this.appointmentStatus = null;
              this.setLoadingState(false);
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