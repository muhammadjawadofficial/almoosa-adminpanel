<template>
  <div class="doctor-list-container standard-width">
    <div class="filter-container">
    </div>
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
      activeTab: "blocked",
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
            (item.iqama &&
              item.iqama.toLowerCase().includes(query.toLowerCase())) ||
            (item.saudi_id &&
              item.saudi_id.toLowerCase().includes(query.toLowerCase()))
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
    deleteUser(item) {
      this.confirmIconModal(
        this.$t("areYouSure"),
        this.$t("admin.userDeleteConfirm"),
        "m-check",
        this.$t("admin.delete")
      ).then((res) => {
        if (res.value) {
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
        }
      });
    },
    changeTab(tab) {
      this.activeTab = tab;
      this.fetchUsers();
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
      if (this.searchQuery) {
        this.filteredItems = [
          ...this.items.filter((item) => {
            return (
              item.patientName
                .toLowerCase()
                .includes(this.searchQuery.toLowerCase()) ||
              (item.mrn_number &&
                item.mrn_number
                  .toLowerCase()
                  .includes(this.searchQuery.toLowerCase()))
            );
          }),
        ];
      } else this.filteredItems = [...this.items];
      this.totalRows = this.filteredItems.length;

      let totalPage = Math.ceil(this.totalRows / this.getPerPageSelection);
      if (this.currentPage > totalPage) {
        this.currentPage = totalPage;
      }
    },
    sortUsers(filter) {
      this.sortDesc = filter.sortDesc;
      this.sortBy = filter.sortBy;
    },
    fetchUsers() {
      this.items = [];
      let query = "";
      if (this.sortBy) {
        query = "&sort=" + (this.sortDesc ? "-" : "") + this.sortBy;
      }
      userService
        .getUsers("?status=" + this.activeTab + "&role_id=3" + query)
        .then(
          (response) => {
            if (response.data.status) {
              this.parseData(response.data.data.items);
              this.currentPage = 1;
              this.totalRows = this.filteredItems.length;
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