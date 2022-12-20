<template>
  <div class="doctor-list-container page-body-container standard-width">
    <div class="search-box full-width mb-5">
      <div class="search-icon">
        <i class="fa fa-search" aria-hidden="true"></i>
      </div>
      <div class="search-input">
        <b-form-input
          :placeholder="$t('admin.searchPromoGroup')"
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
      @row-clicked="editPromotions"
    >
      <template #head()="data">{{ $t("admin." + data.label) }} </template>

      <template #cell()="data">
        <template v-if="data.field.key.includes('date')">
          {{ formatDate(data.value) }}
        </template>
        <template v-if="data.field.key.includes('noOfUsers')">
          {{ data.item.users.length }}
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
              @click.stop="deletePromotions(data.item)"
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
        { key: "noOfUsers", label: "noOfUsers", sortable: true },
        { key: "action", label: "action", sortable: true },
      ],
      items: [],
      filteredItems: [],
    };
  },
  mounted() {
    this.fetchPromoGroups();
  },
  watch: {
    searchQuery(query) {
      this.filteredItems = this.items.filter((x) =>
        x.title.toLowerCase().includes(query)
      );
      this.currentPage = 1;
      this.totalRows = this.filteredItems.length;
    },
  },
  methods: {
    ...mapActions("promotion", ["setSelectedPromotionGroup"]),
    editPromotions(promotion) {
      this.setSelectedPromotionGroup(promotion);
      this.navigateTo("Edit Promotion Group");
    },
    deletePromotions(promoGroup) {
      this.confirmIconModal(
        this.$t("areYouSure"),
        this.$t("admin.promoGroupDeleteConfirm")
      ).then((res) => {
        if (res.value) {
          this.setLoadingState(true);
          promotionService.deletePromoGroup(promoGroup.id).then(
            (response) => {
              if (response.data.status) {
                this.items = [
                  ...this.items.filter((x) => x.id != promoGroup.id),
                ];
                this.filteredItems = [...this.items];
                this.totalRows = this.filteredItems.length;
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
        }
      });
    },
    fetchPromoGroups() {
      this.setLoadingState(true);
      this.items = [];
      promotionService.fetchAllPromoGroups().then(
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

.add-new-insurance {
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  position: absolute;
  top: calc(var(--pill-height) * -1);
  right: 0;
  cursor: pointer;
  .icon {
    width: 2.5rem;
    height: 2.5rem;
    img {
      width: 100%;
    }
  }
  @media (max-width: 768px) {
    position: relative;
    inset: unset;
    padding: 2rem 2rem 0;
  }
}
</style>