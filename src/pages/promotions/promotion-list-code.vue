<template>
  <div class="doctor-list-container page-body-container standard-width">
    <div class="search-box full-width mb-5">
      <div class="search-icon">
        <i class="fa fa-search" aria-hidden="true"></i>
      </div>
      <div class="search-input">
        <b-form-input :placeholder="$t('admin.searchPromoCodeTitle')" id="type-search" type="search" v-model="searchQuery"
          debounce="1000"></b-form-input>
      </div>
    </div>

    <b-table show-empty stacked="md" borderless responsive :items="filteredItems" :fields="tablefields"
      :current-page="currentPage" :per-page="5" class="ash-data-table clickable" @row-clicked="rowClicked">
      <template #empty>
        <div class="text-center my-2">{{ $t("noRecordToShow") }}</div>
      </template>

      <template #head()="data">{{ $t("admin." + data.label) }} </template>
      
      <template #cell()="data">
        <template v-if="data.field.key.includes('_date')">
          {{ formatDate(data.value) }}
        </template>
        <template v-else-if="data.field.key == 'action'">
          <div class="action-buttons">
            <feather class="pointer" type="edit" @click.stop="editPromotions(data.item)"></feather>
            <feather class="pointer" type="trash" @click.stop="deletePromotion(data.item)"></feather>
          </div>
        </template>
        <template v-else-if="data.field.key.includes('all_users')">
          {{ data.value ? $t('all'): `${translateNumber(data.item.user_ids.length)} ${$t('admin.users')}` }}
        </template>
        <template v-else-if="data.field.key.includes('all_specialities')">
          {{ data.value ? $t('all'): `${translateNumber(data.item.specialities_ids.length)} ${$t('admin.specialites')}` }}
        </template>
        <template v-else-if="data.field.status">
          {{ data.value ? $t('admin.yes'): $t('admin.no') }}
        </template>
        <template v-else-if="data.field.key.includes('_by_name')">
          {{ data.value  }}
        </template>
        <template v-else>{{ data.value || "N/A" }}</template>
      </template>
    </b-table>
    <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="getPerPageSelection"
      class="my-0 justify-content-end" v-if="getPerPageSelection"></b-pagination>
    <b-pagination v-else class="my-0"> </b-pagination>
  </div>
</template>
  
<script>
import { mapActions } from "vuex";
import { promotionCodeService } from "../../services";
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
        { key: "discount", label: "discountPercent", sortable: true },
        // { key: "discount_type", label: "discountType", sortable: true },
        { key: "is_for_all_users", label: "users", sortable: true },
        // { key: "is_virtual_appointment_promo", label: "virtualappointment", sortable: true, status: true },
        // { key: "is_onsite_appointment_promo", label: "onsiteAppointment", sortable: true, status: true },
        // { key: "is_for_all_specialities", label: "allSpecialities", sortable: true },
        // { key: "is_for_all_packages", label: "allPackages", sortable: true, status: true },
        { key: "is_show", label: "show", sortable: true, status: true },
        // { key: "is_active", label: "active", sortable: true, status: true },
        // { key: "start_date", label: "startDate", sortable: true },
        { key: "expiry_date", label: "endDate", sortable: true },
        { key: "created_by_name", label: "createdBy", sortable: true },
        { key: "updated_by_name", label: "updatedBy", sortable: true },
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
    
    ...mapActions("promotionCode", ["setSelectedPromotionCode"]),

    editPromotions(promotion) {
      this.setSelectedPromotionCode(promotion);
      this.navigateTo("Promotions Code Edit");
    },

    rowClicked(promotion) {
      this.setSelectedPromotionCode(promotion);
      this.navigateTo("Promotions Code Edit");
    },

    parseData(data) {
        this.items = [];
        data.forEach((x) => {
          this.items.push({
            id: x.id,
            created_by_name: x.created_by ? `(${x.created_by.id}) ${this.getFullName(x.created_by, '', 'en')}` : "N/A",
            updated_by_name: x.updated_by ? `(${x.updated_by.id}) ${this.getFullName(x.updated_by, '', 'en')}` : "N/A",
            ...x,
          });
        });
        this.filteredItems = this.items;
        this.totalRows = this.items.length;
      },

    // delete-promotion
    deletePromotion(promotion) {
      this.confirmIconModal(
        this.$t("areYouSure"),
        this.$t("admin.promoCodeDeleteConfirm")
      ).then((res) => {
        if (res.value) {
          promotionCodeService.deletePromotions(promotion.id).then(
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
    // fetch-all-promotions
    fetchPromotions() {
      promotionCodeService.getAllpromotions().then(
        (response) => {
          if (response.data.status) {
            this.parseData(response.data.data.items);
            this.currentPage = 1;
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