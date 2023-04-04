<template>
  <div class="doctor-list-container standard-width">
    <div class="filter-container">
      <div class="toggle-options my-0" v-if="false">
        <div
          class="toggle-options--single"
          :class="{ active: activeTab == 'unverified' }"
          @click="changeTab('unverified')"
        >
          {{ $t("admin.unverified") }}
        </div>
        <div
          class="toggle-options--single"
          :class="{ active: activeTab == 'verified' }"
          @click="changeTab('verified')"
        >
          {{ $t("admin.verified") }}
        </div>
        <div
          class="toggle-options--single"
          :class="{ active: activeTab == 'blocked' }"
          @click="changeTab('blocked')"
        >
          {{ $t("admin.blocked") }}
        </div>
      </div>
    </div>
    <b-table
      class="ash-data-table clickable"
      show-empty
      stacked="md"
      borderless
      :items="filteredItems"
      :fields="tablefields"
      :per-page="5"
      :sort-by="sortBy"
      :sort-desc="sortDesc"
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
            <feather
              @click.stop="deleteUser(data.item)"
              class="pointer"
              type="trash"
            ></feather>
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
      sortDesc: true,
      totalRows: 1,
      currentPage: 1,
      getPerPageSelection: 5,
      tablefields: [
        // { key: "id", label: "id", sortable: true },
        { key: "patientName", label: "patientName" },
        { key: "identity_number", label: "identity_number" },
        { key: "phoneNumber", label: "phoneNumber" },
        { key: "status", label: "status" },
        { key: "action", label: "action" },
      ],
      items: [],
      filteredItems: [],
      activeTab: "unverified",
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
      this.navigateTo("Patient Profile");
    },
    changeTab(tab) {
      this.activeTab = tab;
      this.fetchUsers();
    },
    deleteUser(item) {
      this.confirmIconModal(
        this.$t("areYouSure"),
        this.$t("admin.userDeleteConfirm"),
        "m-check",
        this.$t("admin.delete")
      ).then((res) => {
        if (res.value) {
          this.setLoadingState(true);
          userService.deleteUser(item.id).then(
            (response) => {
              if (response.data.status) {
                this.parseData([...this.items.filter((x) => x.id != item.id)]);
                this.successIconModal(
                  this.$t("changesDone"),
                  this.$t("admin.userDeleteSuccess")
                );
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
        }
      });
    },
    parseData(data) {
      this.items = [];
      data.forEach((x) => {
        this.items.push({
          ...x,
          id: x.id,
          patientName: this.getFullName(x),
          patient_photo: x.photo,
          mrn_number: x.mrn_number,
          identity_number: x.saudi_id || x.iqama,
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
    fetchUsers(pageNumber = 1) {
      this.items = [];
      this.setLoadingState(true);
      let query = "";
      if (this.sortBy) {
        query = "?sort=" + (this.sortDesc ? "-" : "") + this.sortBy;
      }
      if (this.getPerPageSelection) {
        query += "&limit=" + this.getPerPageSelection;
      }
      if (pageNumber) {
        query += "&page=" + pageNumber;
      }
      if (this.searchQuery) {
        query += "&search=" + this.searchQuery;
      }
      userService.getDuplicatedUsers(query).then(
        (response) => {
          if (response.data.status) {
            this.parseData(response.data.data.items);
            this.currentPage = pageNumber;
            this.totalRows = response.data.data.total_records;
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

<style lang="scss" scoped></style>