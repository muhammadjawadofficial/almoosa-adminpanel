<template>
  <div class="doctor-list-container page-body-container standard-width">
    <back-navigation
      backLink="Tele Consultation List"
      :title="$t('admin.teleConsultationSessions')"
    />
    <!-- <div class="search-box full-width mt-5">
      <div class="search-icon">
        <i class="fa fa-search" aria-hidden="true"></i>
      </div>
      <div class="search-input">
        <b-form-input
          :placeholder="$t('admin.searchTransaction')"
          id="type-search"
          type="search"
          v-model="searchQuery"
          debounce="1000"
        ></b-form-input>
      </div>
    </div> -->
    <b-table
      show-empty
      responsive
      stacked="md"
      borderless
      :items="items"
      :fields="tablefields"
      :per-page="getPerPageSelection"
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
        <template v-else-if="data.field.key == 'method' && data.value">
          {{ data.value.toUpperCase() }}
        </template>
        <template v-else-if="data.field.key == 'user_id'">
          {{
            data.item.user
              ? data.item.user.role_id == 3
                ? data.item.user.mrn_number
                : data.item.user.id
              : "N/A"
          }}
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
        <template v-else-if="data.field.key == 'role'">
          {{
            data.value == 0
              ? $t("admin.participant")
              : data.value == 1
              ? $t("admin.host")
              : "N/A"
          }}
        </template>
        <div
          v-else-if="data.field.long"
          :title="data.value"
          class="truncate-table-field"
        >
          {{ data.value || "N/A" }}
        </div>
        <template v-else>{{ data.value }}</template>
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
import { mapGetters } from "vuex";
import { appointmentService, transactionsService } from "../../services";
export default {
  data() {
    return {
      totalRows: 1,
      currentPage: 1,
      getPerPageSelection: 5,
      sortBy: "id",
      sortDesc: true,
      sortKey: "tele_consultation_session.id",
      tablefields: [
        {
          key: "id",
          label: "id",
          sortable: true,
          sortPre: "tele_consultation_session.id",
        },
        {
          key: "user_id",
          label: "userId",
        },
        {
          key: "created_by",
          label: "username",
          sortable: true,
          sortPre: "tele_consultation_session.created_by",
        },
        {
          key: "role",
          label: "role",
          sortable: true,
          sortPre: "tele_consultation_session.role",
        },
        {
          key: "created_at",
          label: "createdAt",
          sortable: true,
          sortPre: "tele_consultation_session.created_at",
        },
      ],
      items: [],
      totalItems: [],
      searchQuery: "",
    };
  },
  computed: {
    ...mapGetters("appointment", ["getSelectedTeleconsultation"]),
  },
  mounted() {
    if (!this.getSelectedTeleconsultation) {
      this.navigateTo("Tele Consultation List");
      return;
    }
    this.fetchTeleConsultations();
  },
  watch: {
    searchQuery() {
      this.fetchTeleConsultations();
    },
  },
  methods: {
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
      appointmentService.fetchTeleConsultationSessions(query).then(
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
  },
};
</script>

<style lang="scss" scoped></style>