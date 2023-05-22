<template>
  <div class="doctor-list-container page-body-container standard-width">
    <div class="search-box full-width mb-5">
      <div class="search-icon">
        <i class="fa fa-search" aria-hidden="true"></i>
      </div>
      <div class="search-input">
        <b-form-input
          :placeholder="$t('admin.searchBannerTitle')"
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
              @click.stop="editBanner(data.item)"
            ></feather>
            <feather
              class="pointer"
              type="trash"
              @click.stop="deleteBanner(data.item)"
            ></feather>
          </div>
        </template>
        <template v-else-if="data.field.key == 'image'">
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
import { bannerManagementService } from "../../services";
export default {
  data() {
    return {
      searchQuery: "",
      totalRows: 1,
      currentPage: 1,
      getPerPageSelection: 5,
      tablefields: [
        { key: "id", label: "id", sortable: true },
        { key: "image", label: "image" },
        { key: "text", label: "text", sortable: true, translate: true },
        { key: "type", label: "type", sortable: true },
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
        return item[this.getLocaleKey("text")]
          .toLowerCase()
          .includes(query.toLowerCase());
      });
      this.totalRows = this.filteredItems.length;
    },
  },
  mounted() {
    this.fetchBanner();
  },
  methods: {
    ...mapActions("bannerManagement", ["setSelectedBanner"]),
    editBanner(row) {
      this.setSelectedBanner(row);
      this.navigateTo("Banner Management Details");
    },
    deleteBanner(item) {
      this.confirmIconModal(
        this.$t("areYouSure"),
        this.$t("admin.bannerDeleteConfirm"),
        "m-check",
        this.$t("admin.delete")
      ).then((res) => {
        if (res.value) {
          bannerManagementService.deleteBanner(item.id).then(
            (response) => {
              if (response.data.status) {
                this.parseData(this.items.filter((x) => x.id != item.id));
                this.successIconModal(
                  this.$t("changesDone"),
                  this.$t("admin.bannerDeleteSuccess")
                );
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
    fetchBanner() {
      bannerManagementService.fetchAllBanner().then(
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