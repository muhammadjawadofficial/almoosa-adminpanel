<template>
  <div class="doctor-list-container standard-width">
    <b-table
      class="ash-data-table clickable"
      show-empty
      stacked="md"
      borderless
      :items="items"
      :fields="tablefields"
      :per-page="5"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      @row-clicked="rowClicked"
      @sort-changed="sortUsers"
    >
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
        <template v-else-if="data.field.key == 'patientName'">
          <div class="user-name-with-image">
            <div class="image">
              <img :src="getImageUrl(data.item.patient_photo)" alt="user" />
            </div>
            <span class="text">{{ data.value }}</span>
          </div>
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
  props: {
    searchQuery: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      sortBy: "id",
      sortDesc: false,
      totalRows: 1,
      currentPage: 1,
      getPerPageSelection: 5,
      tablefields: [
        { key: "id", label: "id", sortable: true },
        { key: "patientName", label: "patientName" },
        { key: "mrn_number", label: "mrn", sortable: true },
        { key: "email", label: "email" },
        { key: "phoneNumber", label: "phoneNumber" },
      ],
      items: [],
      activeTab: "registered",
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
      this.navigateTo("Patient Details");
    },
    parseData(data) {
      this.items = [];
      data.forEach((x) => {
        this.items.push({
          ...x,
          id: x.row_number,
          patientName: this.getFullName(x),
          patient_photo: x.photo,
          mrn_number: x.mrn_number,
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
      this.setLoadingState(true);
      let query = "";
      if (this.sortBy) {
        query = "&sort_by=" + this.sortBy;
      }
      if (this.sortDesc !== null) {
        query += "&sort_direction=" + (this.sortDesc ? "DESC" : "ASC");
      }
      if (this.getPerPageSelection) {
        query += "&per_page=" + this.getPerPageSelection;
      }
      if (pageNumber) {
        query += "&page_number=" + pageNumber;
      }
      if (this.searchQuery) {
        if (isNaN(this.searchQuery)) query += "&name=" + this.searchQuery;
        else query += "&mr_number=" + this.searchQuery;
      }
      userService.getPatients("?role=PATIENT" + query).then(
        (response) => {
          if (response.data.status) {
            this.parseData(response.data.data.items);
            this.currentPage = pageNumber;
            if (this.items[0]) this.totalRows = this.items[0].total_records;
            else this.totalRows = 0;
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
              error.response.data && error.response.data.message
            );
        }
      );
    },
  },
};
</script>

<style lang="scss" scoped>
</style>