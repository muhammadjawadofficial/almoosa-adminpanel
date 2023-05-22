<template>
  <div class="doctor-list-container page-body-container standard-width">
    <div class="search-box full-width mb-5">
      <div class="search-icon">
        <i class="fa fa-search" aria-hidden="true"></i>
      </div>
      <div class="search-input">
        <b-form-input
          :placeholder="$t('admin.searchPhysician')"
          id="type-search"
          type="search"
          v-model="searchQuery"
          debounce="1000"
        ></b-form-input>
      </div>
    </div>

    <b-table
      class="ash-data-table clickable"
      show-empty
      stacked="md"
      borderless
      :items="items"
      :fields="tablefields"
      :per-page="getPerPageSelection"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      @row-clicked="rowClicked"
      @sort-changed="sortUsers"
    >
      <template #empty>
        <div class="text-center my-2">{{ $t("noRecordToShow") }}</div>
      </template>

      <template #head()="data">{{ $t("admin." + data.label) }} </template>

      <template #cell()="data">
        <template v-if="data.field.key == 'status'">
          {{ $t("admin." + data.value) }}
        </template>
        <template v-else-if="data.field.key == 'action'">
          <div class="action-buttons">
            <feather class="pointer" type="edit"></feather>
          </div>
        </template>
        <template v-else-if="data.field.key == 'physicianName'">
          <div class="user-name-with-image">
            <div class="image">
              <img :src="getImageUrl(data.item.patient_photo)" alt="user" />
            </div>
            <span class="text">{{ getFullName(data.item) }}</span>
          </div>
        </template>
        <template v-else-if="data.field.key == 'speciality' && data.value">
          {{ data.value[getLocaleKey("title")] }}
        </template>
        <template v-else>{{ data.value || "N/A" }}</template>
      </template>
    </b-table>
    <b-pagination
      v-model="currentPage"
      :total-rows="totalRows"
      :per-page="getPerPageSelection"
      class="my-0 justify-content-end"
      @change="fetchUsers"
      v-if="getPerPageSelection"
    ></b-pagination>
    <b-pagination v-else class="my-0"> </b-pagination>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { userService } from "../../services";
export default {
  data() {
    return {
      sortBy: "id",
      sortDesc: false,
      searchQuery: "",
      totalRows: 1,
      currentPage: 1,
      getPerPageSelection: 5,
      tablefields: [
        { key: "id", label: "id", sortable: true },
        { key: "physicianName", label: "physicianName" },
        { key: "speciality", label: "speciality" },
        { key: "gender", label: "gender", sortable: true },
        { key: "email", label: "email" },
        { key: "phone_number", label: "phoneNumber" },
      ],
      items: [],
    };
  },
  mounted() {
    this.fetchUsers();
  },
  watch: {
    searchQuery() {
      this.fetchUsers();
    },
  },
  methods: {
    ...mapActions("user", ["setSelectedUser"]),
    rowClicked(e) {
      this.setSelectedUser(e);
      this.navigateTo("Physician Profile");
    },
    parseData(data) {
      this.items = [];
      data.forEach((x) => {
        this.items.push({
          ...x,
          id: x.id,
          physicianName: this.getFullName(x),
          patient_photo: x.photo,
          email: x.email_address,
          phoneNumber: x.phone_number,
          status: x.status,
        });
      });
    },
    sortUsers(filter) {
      this.sortDesc = filter.sortDesc;
      this.sortBy = filter.sortBy;
      this.fetchUsers();
    },
    fetchUsers(pageNumber = 1) {
      this.items = [];
      let query = "";
      query += "&query=" + this.searchQuery;
      if (this.sortBy) {
        query += "&sort=" + (this.sortDesc ? "-" : "") + this.sortBy;
      }
      if (this.getPerPageSelection) {
        query += "&limit=" + this.getPerPageSelection;
      }
      if (pageNumber) {
        query += "&page=" + pageNumber;
      }
      userService.getUsers("/search?role_id=4" + query).then(
        (response) => {
          if (response.data.status) {
            this.parseData(response.data.data.items);
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
  },
};
</script>

<style lang="scss" scoped>
</style>