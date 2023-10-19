<template>
  <div class="doctor-list-container page-body-container standard-width">
    <div class="search-box full-width mb-5">
      <div class="search-icon">
        <i class="fa fa-search" aria-hidden="true"></i>
      </div>
      <div class="search-input">
        <b-form-input :placeholder="$t('admin.searchNotificationTitleMsgMrn')" id="type-search" type="search"
          v-model="searchQuery" debounce="1000"></b-form-input>
      </div>
    </div>

    <b-table show-empty stacked="md" borderless responsive :items="items" :fields="tablefields" :sort-by="sortBy"
      :sort-desc="sortDesc" @sort-changed="sortUsers" :per-page="5" class="ash-data-table">
      <template #empty>
        <div class="text-center my-2">{{ $t("noRecordToShow") }}</div>
      </template>

      <template #head()="data">{{ $t("admin." + data.label) }} </template>

      <template #cell()="data">
        <template v-if="data.field.translate">
          {{ data.item[getLocaleKey(data.field.key, '_en')] }}
        </template>
        <template v-else-if="data.field.key == 'seen' || data.field.key == 'sent'">
          <span class="text">{{ data.value == true ? "Yes" : "No" }}</span>
        </template>
        <template v-else-if="data.field.key.toLowerCase().includes('updated_at') ||
          data.field.key.toLowerCase().includes('created_at')
          ">
          {{ getLongDateAndTimeFromDate(data.value, true) }}
        </template>
        <template v-else>{{ data.value || "N/A" }}</template>
      </template>
    </b-table>
    <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="getPerPageSelection"
      class="my-0 justify-content-end" @change="fetchNotifications" v-if="getPerPageSelection"></b-pagination>
    <b-pagination v-else class="my-0"> </b-pagination>
  </div>
</template>
  
<script>
import { mapActions } from "vuex";
import { notificationService } from "../../services";
export default {
  data() {
    return {
      sortBy: "id",
      sortDesc: true,
      searchQuery: "",
      totalRows: 1,
      currentPage: 1,
      getPerPageSelection: 5,
      tablefields: [
        { key: "id", label: "id", sortable: true },
        { key: "title", label: "title", translate: true, sortable: true },
        { key: "message", label: "message", translate: true, sortable: true },
        { key: "mrn", label: "mrn", },
        { key: "seen", label: "seen", sortable: true },
        { key: "sent", label: "sent", sortable: true },
        { key: "created_at", label: "createdAt", sortable: true },
      ],
      items: [],
      filteredItems: [],
    };
  },
  mounted() {
    this.fetchNotifications();
  },
  watch: {
    searchQuery() {
      this.fetchNotifications();
    },

  },
  methods: {
    ...mapActions("notificationManagement", ["setSelectedNotification"]),

    sortUsers(filter) {
      let field = this.tablefields.find((x) => x.key == filter.sortBy);
      this.sortDesc = filter.sortDesc;
      this.sortKey = field.sortPre || "";
      this.sortBy = filter.sortBy;
      this.fetchNotifications();
    },

    parseData(data) {
      this.items = [];
      data.forEach((x) => {
        this.items.push({
          id: x.id,
          notification_module_en: x.notification_event ? x.notification_event.module_en : '',
          notification_module_ar: x.notification_event ? x.notification_event.module_ar : '',
          mrn: x.user ? x.user.mrn_number : "",
          ...x,
        });
      });
      this.filteredItems = this.items;
      this.totalRows = this.items.length;
    },

    fetchNotifications(pageNumber = 1) {
      this.items = [];
      let query = "?query=" + this.searchQuery;
      if (this.sortDesc || !this.sortDesc) {
        query +=
          "&sort=" +
          (this.sortDesc ? "DESC" : "ASC");
      }
      query += "&limit=" + this.getPerPageSelection;
      if (pageNumber) {
        query += "&page=" + pageNumber;
      }
      notificationService.fetchAllUsersNotifications(query).then(
        (response) => {
          if (response.data.status) {
            this.parseData(response.data.data.items);
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

  },
};
</script>
  
<style lang="scss" scoped></style>