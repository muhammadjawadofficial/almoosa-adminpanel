<template>
  <div class="doctor-list-container page-body-container standard-width">
    <div class="search-box full-width">
      <div class="search-icon">
        <i class="fa fa-search" aria-hidden="true"></i>
      </div>
      <div class="search-input">
        <b-form-input
          :placeholder="$t('symptoms.searchPlaceholder')"
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
      :items="items"
      :fields="tablefields"
      :current-page="currentPage"
      :per-page="5"
      class="ash-data-table mt-4"
    >
      <template #empty>
        <div class="text-center my-2">{{ $t("noRecordToShow") }}</div>
      </template>

      <template #head()="data">{{ $t("admin." + data.label) }} </template>

      <template #cell()="data">
        <template v-if="data.field.key == 'medicationRefillRequested'">
          {{ $t("admin." + data.value) }}
        </template>
        <template v-else-if="data.field.key == 'action'">
          <div class="action-buttons">
            <feather
              class="pointer"
              type="edit"
              @click.stop="editSymptom(data.item)"
            ></feather>
            <feather
              class="pointer"
              type="trash"
              @click.stop="deleteSymptom(data.item)"
            ></feather>
          </div>
        </template>
        <template v-else-if="data.field.translate">{{
          data.item[getLocaleKey(data.field.key)]
        }}</template>
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
import { symptomChecker } from "../../services";
export default {
  data() {
    return {
      searchQuery: "",
      totalRows: 1,
      currentPage: 1,
      getPerPageSelection: 5,
      fromDate: null,
      toDate: null,
      dateRange: null,
      sortable: true,
      tablefields: [
        { key: "id", label: "id" },
        { key: "speciality_id", label: "speciality", translate: true },
        { key: "condition", label: "condition", translate: true },
        { key: "age", label: "age", translate: true },
        { key: "recommendation", label: "recommendation" },
        { key: "action", label: "action" },
      ],
      items: [],
      originalItems: null,
      showDatePicker: true,
      showCalendar: false,
      locale: "",
    };
  },
  mounted() {
    this.fetchSymptoms();
  },
  watch: {
    searchQuery(query) {
      this.items = this.originalItems.filter((x) =>
        query ? x.title.toLowerCase().includes(query.toLowerCase()) : true
      );
      this.totalRows = this.items.length;
    },
  },
  methods: {
    ...mapActions("myMedication", ["setSelectedMedication"]),
    ...mapActions("symptomChecker", ["setSelectedSymptom"]),
    editSymptom(e) {
      this.setSelectedSymptom(e);
      this.navigateTo("Symptom Checker Age Condition Edit");
    },
    deleteSymptom(item) {
      this.confirmIconModal(
        this.$t("areYouSure"),
        this.$t("admin.symptomAgeConditionDeleteConfirm"),
        "m-check",
        this.$t("admin.delete")
      ).then((res) => {
        if (res.value) {
          symptomChecker.deleteAgeCondition(item.id).then(
            (response) => {
              if (response.data.status) {
                this.items = [...this.items.filter((x) => x.id != item.id)];
                this.totalRows = this.items.length;
                this.successIconModal(
                  this.$t("changesDone"),
                  this.$t("admin.symptomAgeConditionDeleteSuccess")
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
    parseData(data) {
      this.items = [];
      data.forEach((x) => {
        this.items.push({
          createdAt: this.formatDate(x.created_at),
          ...x,
        });
      });
      this.originalItems = [...this.items];
    },
    fetchSymptoms() {
      symptomChecker.fetchAgeConditions().then(
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
  
  <style lang="scss" scoped>
.max-width {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ash-data-table {
  :deep {
    tbody {
      td {
        max-width: 20rem;
      }
    }
  }
}
</style>