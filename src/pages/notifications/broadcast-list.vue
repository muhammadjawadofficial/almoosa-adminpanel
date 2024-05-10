<template>
  <div class="doctor-list-container page-body-container standard-width">
    <div class="search-box full-width mb-3">
      <div class="search-icon">
        <i class="fa fa-search" aria-hidden="true"></i>
      </div>
      <div class="search-input">
        <b-form-input
          :placeholder="$t('admin.searchNotification')"
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
      class="ash-data-table mt-3"
    >
      <template #empty>
        <div class="text-center my-2">{{ $t("noRecordToShow") }}</div>
      </template>

      <template #head()="data">{{ $t("admin." + data.label) }} </template>

      <template #cell()="data">
        <template
          v-if="
            data.field.key.toLowerCase().includes('updated_at') ||
            data.field.key.toLowerCase().includes('created_at')
          "
        >
          {{ getLongDateAndTimeFromDate(data.value, true) }}
        </template>
        <template v-else-if="data.field.key == 'sent'">
          {{ $t(data.value ? "success" : "failed") }}
        </template>
        <template v-else-if="data.field.key == 'lang' && data.value">
          {{ $t("admin." + data.value) }}
        </template>
        <template v-else-if="data.field.key == 'action'">
          <div class="action-buttons" @click="resendNotification(data)">
            <feather class="pointer" type="refresh-cw"></feather>
          </div>
        </template>
        <template v-else>{{ data.value || "N/A" }}</template>
      </template>
    </b-table>
    <b-pagination
      v-model="currentPage"
      :total-rows="totalRows"
      :per-page="getPerPageSelection"
      @change="getBroadcastNotifications($event)"
      class="my-0 justify-content-end"
      v-if="getPerPageSelection"
    ></b-pagination>
    <b-pagination v-else class="my-0"> </b-pagination>
  </div>
</template>

<script>
import { notificationService } from "../../services";
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
      tablefields: [
        { key: "id", label: "id", sortable: true },
        { key: "title_en", label: "title" },
        { key: "title_ar", label: "titleAr" },
        { key: "message_en", label: "message" },
        { key: "message_ar", label: "messageAr" },
        { key: "lang", label: "lang" },
        { key: "sent", label: "status", sortable: true },
        { key: "created_at", label: "createdAt", sortable: true },
        { key: "action", label: "action", sortable: true },
      ],
      items: [],
      totalItems: [],
    };
  },
  mounted() {
    this.getBroadcastNotifications();
  },
  watch: {
    searchQuery() {
      this.getBroadcastNotifications(1);
    },
  },
  methods: {
    resendNotification(data) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      this.$emit("resend", data.item);
    },
    sortUsers(filter) {
      this.sortDesc = filter.sortDesc;
      this.sortBy = filter.sortBy;
      this.getBroadcastNotifications();
    },
    parseData(data) {
      this.items = [];
      data.forEach((x) => {
        this.items.push({
          id: x.id,
          ...x,
        });
      });
      this.totalRows = this.items.length;
      this.totalItems = [...this.items];
    },
    getBroadcastNotifications(pageNumber = 1, status = "") {
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

      notificationService.getBroadcastNotifications(query).then(
        (response) => {
          if (response.data.status) {
            this.parseData(response.data.data.notifications);
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

<style lang="scss" scoped>
.doctor-list-container {
  scroll-behavior: smooth;
}
</style>