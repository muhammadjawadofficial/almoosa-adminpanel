<template>
  <div class="doctor-list-container standard-width">
    <b-table
      class="ash-data-table clickable"
      show-empty
      stacked="md"
      borderless
      :items="filteredItems"
      :fields="tablefields"
      :current-page="currentPage"
      :per-page="5"
      :sort-by="sortBy"
      :sort-desc="sortDesc"
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
        { key: "status", label: "status" },
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
      this.filteredItems = [
        ...this.items.filter((item) => {
          return (
            item.patientName.toLowerCase().includes(query.toLowerCase()) ||
            (item.mrn_number &&
              item.mrn_number.toLowerCase().includes(query.toLowerCase()))
          );
        }),
      ];
      this.totalRows = this.filteredItems.length;
    },
  },
  methods: {
    ...mapActions("user", ["setSelectedUser"]),
    rowClicked(e) {
      this.setSelectedUser(e);
      this.navigateTo("Patient Profile");
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
      this.filteredItems = [...this.items];
    },
    sortUsers(filter) {
      this.sortDesc = filter.sortDesc;
      this.sortBy = filter.sortBy;
    },
    fetchUsers() {
      this.items = [];
      this.setLoadingState(true);
      let query = "";
      if (this.sortBy) {
        query = "&sort=" + (this.sortDesc ? "-" : "") + this.sortBy;
      }
      userService.getUsers("?status=unverified&role_id=3" + query).then(
        (response) => {
          if (response.data.status) {
            this.parseData(response.data.data.items);
            this.currentPage = 1;
            this.totalRows = this.filteredItems.length;
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
  },
};
</script>

<style lang="scss" scoped>
</style>