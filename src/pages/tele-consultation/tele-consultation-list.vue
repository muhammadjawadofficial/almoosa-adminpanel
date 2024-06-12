<template>
  <div class="doctor-list-container page-body-container standard-width">
    <div class="search-box full-width">
      <div class="search-icon">
        <i class="fa fa-search" aria-hidden="true"></i>
      </div>
      <div class="search-input">
        <b-form-input
          :placeholder="$t('admin.searchById')"
          id="type-search"
          type="search"
          v-model="searchQuery"
          debounce="1000"
        ></b-form-input>
      </div>
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
      class="ash-data-table mt-3 clickable"
      @row-clicked="loadSessions"
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
            <feather class="pointer" type="chevron-right"></feather>
          </div>
        </template>
        <template v-else-if="data.field.key == 'amount'">
          {{ data.value + " " + data.item.currency }}
        </template>
        <template v-else-if="data.field.key == 'method' && data.value">
          {{ data.value.toUpperCase() }}
        </template>
        <template
          v-else-if="
            data.field.key.toLowerCase().includes('updated_at') ||
            data.field.key.toLowerCase().includes('created_at')
          "
        >
          {{ getLongDateAndTimeFromDate(data.value, true) }}
        </template>
        <template v-else-if="data.field.key == 'created_by'">
          <div class="user-name-with-image">
            <span class="text">{{ getFullName(data.item.user) || "N/A" }}</span>
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
      @change="fetchTeleConsultations"
      v-if="getPerPageSelection"
    ></b-pagination>
    <b-pagination v-else class="my-0"> </b-pagination>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import bread_crumbs from "../../components/bread_crumbs.vue";
import { appointmentService } from "../../services";
export default {
  components: { bread_crumbs },
  data() {
    return {
      totalRows: 1,
      currentPage: 1,
      getPerPageSelection: 5,
      sortBy: "id",
      sortDesc: true,
      sortKey: "tele_consultation.id",
      tablefields: [
        {
          key: "id",
          label: "id",
          sortable: true,
          sortPre: "tele_consultation.id",
        },
        {
          key: "session_name",
          label: "sessionName",
          sortable: true,
          sortPre: "tele_consultation.session_name",
        },
        {
          key: "patient_id",
          label: "mrn",
          sortable: true,
          sortPre: "tele_consultation.patient_id",
        },
        {
          key: "doctor_id",
          label: "doctorId",
          sortable: true,
          sortPre: "tele_consultation.doctor_id",
        },
        {
          key: "appointment_id",
          label: "appointmentId",
          sortable: true,
          sortPre: "tele_consultation.appointment_id",
        },
        {
          key: "created_at",
          label: "createdAt",
          sortable: true,
          sortPre: "tele_consultation.created_at",
        },
        {
          key: "created_by",
          label: "createdBy",
        },
        {
          key: "action",
          label: "action",
        },
      ],
      items: [],
      totalItems: [],
      searchQuery: "",
    };
  },
  mounted() {
    this.fetchTeleConsultations();
  },
  watch: {
    searchQuery() {
      this.fetchTeleConsultations();
    },
  },
  methods: {
    ...mapActions("appointment", ["setSelectedTeleconsultation"]),
    sortUsers(filter) {
      this.sortDesc = filter.sortDesc;
      let field = this.tablefields.find((x) => x.key == filter.sortBy);
      this.sortKey = field.sortPre || "";
      this.sortBy = filter.sortBy;
      this.fetchTeleConsultations();
    },

    parseData(data) {
      this.items = [];
      data.forEach((x) => {
        this.items.push({
          ...x,
        });
      });
      this.totalItems = [...this.items];
    },

    fetchTeleConsultations(pageNumber = 1) {
      this.items = [];
      let query = "?query=" + this.searchQuery;
      if (this.sortKey) {
        query +=
          "&orderType=" +
          (this.sortDesc ? "DESC" : "ASC") +
          "&orderBy=" +
          this.sortKey;
      }
      query += "&limit=" + this.getPerPageSelection;
      if (pageNumber) {
        query += "&page=" + pageNumber;
      }
      appointmentService.fetchTeleConsultation(query).then(
        (response) => {
          if (response.data.status) {
            this.parseData(response.data.data.sessions);
            this.currentPage = pageNumber;
            this.totalRows = response.data.data.count;
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
    loadSessions(item) {
      console.log(item);
      this.setSelectedTeleconsultation(item);
      this.navigateTo("Tele Consultation Sessions");
    },
  },
};
</script>

<style lang="scss" scoped></style>