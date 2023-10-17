<template>
    <div class="doctor-list-container page-body-container standard-width">
      <div class="search-box full-width mb-5">
        <div class="search-icon">
          <i class="fa fa-search" aria-hidden="true"></i>
        </div>
        <div class="search-input">
          <b-form-input
            :placeholder="$t('admin.searchNotificationTitle')"
            id="type-search"
            type="search"
            v-model="searchQuery"
            debounce="1000"
          ></b-form-input>
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
                @click.stop="editNotification(data.item)"
              ></feather>
            </div>
          </template>
          <template v-else-if="data.field.translate">
            {{ data.item[getLocaleKey(data.field.key, '_en')] }}
          </template>
          <template v-else-if="data.field.key == 'updated_by' && data.value">
          <div class="user-name-with-image">
            <span class="text">
              ({{ data.value.id }}) {{ getFullName(data.value,) }}</span>
          </div>
        </template>
        <template v-else-if="data.field.key.toLowerCase().includes('updated_at') ||
          data.field.key.toLowerCase().includes('created_at')
          ">
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
  import { notificationService } from "../../services";
  export default {
    data() {
      return {
        searchQuery: "",
        totalRows: 1,
        currentPage: 1,
        getPerPageSelection: 5,
        tablefields: [
          { key: "id", label: "id"},
          { key: "title", label: "title", translate: true },
          { key: "msg", label: "message", translate: true },
          { key: "created_at", label: "createdAt"},
          { key: "updated_at", label: "updatedAt"},
          { key: "updated_by", label: "updatedBy"},
          { key: "notification_module", label: "event", translate: true},
          { key: "action", label: "action" },
        ],
        items: [],
        filteredItems: [],
        sortBy: "",
        sortDesc: null,
      };
    },
    watch: {
      searchQuery(query) {
        this.filteredItems = this.items.filter((item) => {
           return item[this.getLocaleKey("title",'_en')].toLowerCase().includes(query.toLowerCase());
        });
        this.totalRows = this.filteredItems.length;
      },

    },
    mounted() {
      this.fetchNotifications();
    },
    methods: {
      ...mapActions("notificationManagement", ["setSelectedNotification"]),

      editNotification(row) {
        this.setSelectedNotification(row);
        this.navigateTo("Notification Update");
      },

      parseData(data) {
        this.items = [];
        data.forEach((x) => {
          this.items.push({
            id: x.id,
            notification_module_en: x.notification_event ? x.notification_event.module_en : '', 
            notification_module_ar: x.notification_event ? x.notification_event.module_ar : '', 
            updated_by_user: x.updated_by ? `(${x.updated_by.id}) ${this.getFullName(x.updated_by, '', 'en')}` : "",
            ...x,
          });
        });
        this.filteredItems = this.items;
        this.totalRows = this.items.length;
      },

      fetchNotifications() {
        notificationService.fetchAllNotifications().then(
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