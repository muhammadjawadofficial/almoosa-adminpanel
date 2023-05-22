<template>
  <div class="doctor-list-container page-body-container standard-width">
    <div class="search-box full-width mb-5">
      <div class="search-icon">
        <i class="fa fa-search" aria-hidden="true"></i>
      </div>
      <div class="search-input">
        <b-form-input
          :placeholder="$t('admin.searchStaff')"
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
      :items="filteredItems"
      :fields="filteredFields"
      :current-page="currentPage"
      :per-page="5"
      class="ash-data-table clickable"
      @row-clicked="rowClicked"
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
        <template v-else-if="data.field.key == 'patient_name'">
          <div class="user-name-with-image">
            <div class="image" v-if="false">
              <img :src="getImageUrl(data.item.patient_photo)" alt="user" />
            </div>
            <span class="text">{{ data.value }}</span>
          </div>
        </template>
        <template v-else>{{ data.value }}</template>
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
      searchQuery: "",
      totalRows: 1,
      currentPage: 1,
      getPerPageSelection: 5,
      tablefields: [
        { key: "id", label: "id", sortable: true },
        { key: "patient_name", label: "staffName", sortable: true },
        { key: "mrn", label: "mrn", sortable: true, filtered: 3 },
        { key: "roleName", label: "role", sortable: true },
        { key: "email", label: "email", sortable: true },
        { key: "phone", label: "phoneNumber", sortable: true },
        { key: "status", label: "status", sortable: true },
      ],
      filteredFields: [
        { key: "id", label: "id", sortable: true },
        { key: "patient_name", label: "staffName", sortable: true },
        { key: "mrn", label: "mrn", sortable: true, filtered: 3 },
        { key: "roleName", label: "role", sortable: true },
        { key: "email", label: "email", sortable: true },
        { key: "phone", label: "phoneNumber", sortable: true },
        { key: "status", label: "status", sortable: true },
      ],
      items: [],
      filteredItems: [],
    };
  },
  mounted() {
    this.fetchUsers();
  },
  watch: {
    searchQuery(query) {
      this.filteredItems = this.items.filter((item) => {
        return (
          item.patient_name.toLowerCase().includes(query.toLowerCase()) ||
          item.mrn.toLowerCase().includes(query.toLowerCase())
        );
      });
    },
    $route() {
      this.fetchUsers();
    },
  },
  methods: {
    ...mapActions("user", ["setSelectedUser"]),
    rowClicked(e) {
      this.setSelectedUser(e);
      this.navigateTo("Staff Profile");
    },
    parseData(data) {
      this.items = [];
      data.forEach((x) => {
        this.items.push({
          id: x.id,
          patient_name: this.getFullName(x),
          patient_photo: x.photo,
          mrn: x.mrn_number || "N/A",
          roleName: x.role.title || "N/A",
          email: x.email_address || "N/A",
          phone: x.phone_number || "N/A",
          status: x.status || "N/A",
          ...x,
        });
      });
      this.filteredItems = this.items;
    },
    fetchUsers() {
      let roleId = this.$route.params.roleId;
      this.items = [];
      this.filteredItems = [];
      this.filteredFields = this.tablefields.filter(
        (x) => !x.filtered || x.filtered == roleId
      );
      userService.getUsers("?role_id=" + roleId).then(
        (response) => {
          if (response.data.status) {
            this.parseData(response.data.data.items);
            this.currentPage = 1;
            this.totalRows = this.items.length;
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