<template>
  <div class="doctor-list-container page-body-container standard-width">
    <div class="search-box full-width mb-5">
      <div class="search-icon">
        <i class="fa fa-search" aria-hidden="true"></i>
      </div>
      <div class="search-input">
        <b-form-input
          :placeholder="$t('admin.searchPatientMrn')"
          id="type-search"
          type="search"
          v-model="searchQuery"
          debounce="500"
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
      :current-page="currentPage"
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
        { key: "patientName", label: "patientName" },
        { key: "mrn_number", label: "mrn", sortable: true },
        { key: "email", label: "email" },
        { key: "phoneNumber", label: "phoneNumber" },
        { key: "status", label: "status", sortable: true },
      ],
      items: [],
    };
  },
  mounted() {
    this.fetchUsers();
  },
  watch: {
    searchQuery(query) {
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
      data.forEach((x) => {
        this.items.push({
          ...x,
          id: x.id,
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
      if (!filter.sortBy) {
        return;
      }
      this.sortDesc = filter.sortDesc;
      this.sortBy = filter.sortBy;
      this.fetchUsers();
    },
    fetchUsers() {
      this.items = [];
      this.setLoadingState(true);
      let query = "";
      if (this.sortBy) {
        query = "?sort=" + (this.sortDesc ? "-" : "") + this.sortBy;
      }
      userService.getUsers("?role_id=3" + query).then(
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
        () => {
          this.appointmentStatus = null;
          this.setLoadingState(false);
          this.failureToast();
        }
      );
    },
  },
};
</script>

<style lang="scss" scoped>
</style>