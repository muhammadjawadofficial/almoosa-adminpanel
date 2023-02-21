<template>
  <div class="doctor-list-container page-body-container standard-width">
    <div class="search-box full-width mb-5">
      <div class="search-icon">
        <i class="fa fa-search" aria-hidden="true"></i>
      </div>
      <div class="search-input">
        <b-form-input :placeholder="$t('admin.searchArticleName')" id="type-search" type="search" v-model="searchQuery"
          debounce="500"></b-form-input>
      </div>
    </div>

    <b-table show-empty stacked="md" borderless :items="filteredItems" :fields="tablefields" :per-page="5"
      class="ash-data-table clickable" @row-clicked="onRowClicked">
      <template #head()="data">{{ $t("admin." + data.label) }} </template>

      <template #cell()="data">
        <template v-if="data.field.key == 'action'">
          <div class="action-buttons">
            <feather class="pointer" type="edit" @click.stop="editArticle(data.item)"></feather>
            <!-- <feather class="pointer" type="trash" @click.stop="deleteArticle(data.item)"></feather> -->
          </div>
        </template>
        <template v-else-if="data.field.key == 'thumbnail'">
          <div class="user-name-with-image">
            <div class="image">
              <img :src="getImageUrl(data.value)" alt="user" />
            </div>
          </div>
        </template>
        <template v-else-if="data.field.translate">{{ data.item[getLocaleKey(data.field.key)] }}</template>
        <template v-else>{{ data.value }}</template>
      </template>
    </b-table>
    <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="getPerPageSelection"
      class="my-0 justify-content-end" v-if="getPerPageSelection" @change="fetchArticles"></b-pagination>
    <b-pagination v-else class="my-0"> </b-pagination>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { healthEducationService } from "../../services";
export default {
  data() {
    return {
      searchQuery: "",
      activeTab: "onsite",
      totalRows: 1,
      currentPage: 1,
      getPerPageSelection: 5,
      fromDate: null,
      toDate: null,
      dateRange: null,
      tablefields: [
        { key: "id", label: "id", sortable: true },
        { key: "thumbnail", label: "thumbnail" },
        { key: "short_title", label: "short_title", sortable: true, translate: true },
        { key: "short_text", label: "short_text", sortable: true, translate: true },
        { key: "action", label: "action" },
      ],
      items: [],
      filteredItems: [],
      showDatePicker: true,
      showCalendar: false,
      locale: "",
      sortBy: "",
      sortDesc: null,
      defaultStart: null,
      defaultEnd: null,
    };
  },
  watch: {
    searchQuery(query) {
      this.filteredItems = this.items.filter((item) => {
        return (
          item[this.getLocaleKey('short_title')].toLowerCase().includes(query.toLowerCase())
        );
      });
      this.totalRows = this.filteredItems.length;
    },
  },
  mounted() {
    this.fetchArticles();
  },
  methods: {
    ...mapActions('healthEducation', ['setSelectedHealthEducation']),
    onRowClicked(row) {
      this.navigateTo("Health Education Details", { id: row.id });
    },
    editArticle(row) {
      this.setSelectedHealthEducation(row);
      this.navigateTo("Health Education Edit", { id: row.id });
    },
    deleteArticle(item) {
      this.confirmIconModal(
        this.$t("areYouSure"),
        this.$t("admin.articleDeleteConfirm"),
        "m-check",
        this.$t("admin.delete")
      ).then((res) => {
        if (res.value) {
          this.setLoadingState(true);
          this.setLoadingState(true);
          healthEducationService.deleteArticle(item.id).then(
            (response) => {
              if (response.data.status) {
                this.parseData(this.items.filter((x) => x.id != item.id));
                this.successIconModal(
                  this.$t("changesDone"),
                  this.$t("admin.articleDeleteSuccess")
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
          ...x
        });
      });
      this.filteredItems = this.items;
      this.totalRows = this.items.length;
    },
    fetchArticles() {
      this.setLoadingState(true);
      healthEducationService.fetchHealthEducations().then(
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