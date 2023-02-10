<template>
  <div class="doctor-list-container page-body-container standard-width">
    <div class="search-box full-width mb-5">
      <div class="search-icon">
        <i class="fa fa-search" aria-hidden="true"></i>
      </div>
      <div class="search-input">
        <b-form-input
          :placeholder="$t('admin.searchPromoCodeTitle')"
          id="type-search"
          type="search"
          v-model="searchQuery"
          debounce="500"
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
      class="ash-data-table clickable"
      @row-clicked="rowClicked"
    >
      <template #head()="data">{{ $t("admin." + data.label) }} </template>

      <template #cell()="data">
        <template v-if="data.field.key.includes('date')">
          {{ formatDate(data.value) }}
        </template>
        <template v-else-if="data.field.key == 'action'">
          <div class="action-buttons">
            <feather
              class="pointer"
              type="edit"
              @click.stop="editPromotions(data.item)"
            ></feather>
            <feather
              class="pointer"
              type="trash"
              @click.stop="deletePromotion(data.item)"
            ></feather>
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
import { promotionService } from "../../services";
export default {
  data() {
    return {
      searchQuery: "",
      totalRows: 1,
      currentPage: 1,
      getPerPageSelection: 5,
      tablefields: [
        { key: "id", label: "id", sortable: true },
        { key: "title", label: "title", sortable: true },
        { key: "promo_code", label: "promoCode", sortable: true },
        { key: "discount_percent", label: "discountPercent", sortable: true },
        { key: "overall_limit", label: "usageLimit", sortable: true },
        { key: "overall_usage", label: "currentUsage", sortable: true },
        { key: "start_date", label: "startDate", sortable: true },
        { key: "end_date", label: "endDate", sortable: true },
        { key: "action", label: "action", sortable: true },
      ],
      items: [],
      filteredItems: [],
    };
  },
  mounted() {
    this.fetchPromotions();
  },
  watch: {
    searchQuery(query) {
      this.filteredItems = this.items.filter(
        (x) =>
          x.title.toLowerCase().includes(query) ||
          x.promo_code.toLowerCase().includes(query)
      );
      this.currentPage = 1;
      this.totalRows = this.filteredItems.length;
    },
  },
  methods: {
    ...mapActions("promotion", ["setSelectedPromotion"]),
    rowClicked(promotion) {
      this.setSelectedPromotion(promotion);
      this.navigateTo("Promotions Details");
    },
    editPromotions(promotion) {
      this.setSelectedPromotion(promotion);
      this.navigateTo("Promotions Edit");
    },
    deletePromotion(promotion) {
      this.confirmIconModal(
        this.$t("areYouSure"),
        this.$t("admin.promoCodeDeleteConfirm")
      ).then((res) => {
        if (res.value) {
          this.setLoadingState(true);
          promotionService.deletePromotion(promotion.id).then(
            (response) => {
              if (response.data.status) {
                this.items = [
                  ...this.items.filter((x) => x.id != promotion.id),
                ];
                this.filteredItems = [...this.items];
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
        }
      });
    },
    fetchPromotions() {
      this.setLoadingState(true);
      promotionService.fetchAllPromotions().then(
        (response) => {
          if (response.data.status) {
            this.items = [...response.data.data.items];
            this.filteredItems = [...this.items];
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
.ash-data-table {
  :deep {
    tr {
      &:not(.b-table-empty-row) {
        td {
          div {
            min-height: 3rem;
            display: flex;
            align-items: center;
          }
        }
      }
    }
  }
}
</style>