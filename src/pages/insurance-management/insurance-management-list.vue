<template>
  <div class="doctor-list-container page-body-container standard-width">
    <div class="search-box full-width mb-5">
      <div class="search-icon">
        <i class="fa fa-search" aria-hidden="true"></i>
      </div>
      <div class="search-input">
        <b-form-input
          :placeholder="$t('admin.searchInsurance')"
          id="type-search"
          type="search"
          v-model="searchQuery"
          debounce="1000"
        ></b-form-input>
      </div>
    </div>
    <div class="filter-container">
      <div class="toggle-options mt-0">
        <div
          class="toggle-options--single"
          :class="{ active: activeTab == 'Sent for approval' }"
          @click="changeTab('Sent for approval')"
        >
          {{ $t("admin.pending") }}
        </div>
        <div
          class="toggle-options--single"
          :class="{ active: activeTab == 'approved' }"
          @click="changeTab('approved')"
        >
          {{ $t("admin.approved") }}
        </div>
        <div
          class="toggle-options--single"
          :class="{ active: activeTab == 'rejected' }"
          @click="changeTab('rejected')"
        >
          {{ $t("admin.rejected") }}
        </div>
      </div>
    </div>

    <b-table
      show-empty
      stacked="md"
      borderless
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
              @click.stop="editInsurance(data.item)"
            ></feather>
            <feather
              class="pointer"
              type="trash"
              @click.stop="deleteInsurance(data.item)"
            ></feather>
          </div>
        </template>
        <template v-else-if="data.field.key == 'thumbnail'">
          <div class="user-name-with-image">
            <div class="image">
              <img :src="getImageUrl(data.value)" alt="user" />
            </div>
          </div>
        </template>
        <template v-else-if="data.field.translate">
          {{ data.item[getLocaleKey(data.field.key)] }}
        </template>
        <template v-else-if="data.field.key == 'status'">
          {{ $t("admin." + data.value.toLowerCase()) }}
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
import { insuranceService } from "../../services";
export default {
  data() {
    return {
      searchQuery: "",
      totalRows: 1,
      currentPage: 1,
      getPerPageSelection: 5,
      tablefields: [
        { key: "id", label: "id", sortable: true },
        { key: "company_name", label: "companyName", sortable: true },
        { key: "status", label: "status", sortable: true },
        { key: "action", label: "action" },
      ],
      items: [],
      filteredItems: [],
      sortBy: "",
      sortDesc: null,
      activeTab: "Sent for approval",
    };
  },
  watch: {
    searchQuery(query) {
      this.filteredItems = this.items.filter((item) => {
        return item.company_name.toLowerCase().includes(query.toLowerCase());
      });
      this.totalRows = this.filteredItems.length;
    },
  },
  mounted() {
    this.fetchInsurances();
  },
  methods: {
    ...mapActions("insuranceManagement", ["setSelectedInsuranceManagement"]),
    changeTab(type) {
      this.activeTab = type;
      this.fetchInsurances(1, type);
    },
    editInsurance(row) {
      this.setSelectedInsuranceManagement(row);
      this.navigateTo("Insurance Management Details");
    },
    deleteInsurance(item) {
      this.confirmIconModal(
        this.$t("areYouSure"),
        this.$t("admin.insuranceDeleteConfirm"),
        "m-check",
        this.$t("admin.delete")
      ).then((res) => {
        if (res.value) {
          this.setLoadingState(true);
          this.setLoadingState(true);
          insuranceService.deleteInsurance(item.id).then(
            (response) => {
              if (response.data.status) {
                this.parseData(this.items.filter((x) => x.id != item.id));
                this.successIconModal(
                  this.$t("changesDone"),
                  this.$t("admin.insuranceDeleteSuccess")
                );
              } else {
                this.failureToast(response.data.messsage);
              }
              this.setLoadingState(false);
            },
            (error) => {
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
          id: x.id,
          ...x,
        });
      });
      this.filteredItems = this.items;
      this.totalRows = this.items.length;
    },
    fetchInsurances() {
      this.setLoadingState(true);
      insuranceService.fetchAllInsurances("?status=" + this.activeTab).then(
        (response) => {
          if (response.data.status) {
            let data = response.data.data.items;
            this.parseData(data);
          } else {
            this.failureToast(response.data.messsage);
          }
          this.setLoadingState(false);
        },
        (error) => {
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