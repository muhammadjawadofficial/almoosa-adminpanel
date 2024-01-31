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
    <div class="filter-container">
      <div class="toggle-options"></div>
      <div class="filters-dropdown">
        {{ $t("admin.date") }}
        <img src="../../assets/images/filter.svg" alt="" />
        <div class="filters-dropdown-menu">
          <template v-if="true">
            <div style="display: flex">
              <div class="date-container" @click="showCalendar = !showCalendar">
                {{ $t("admin.from") }}:
                {{ fromDate || $t("admin.selectDate") }}
              </div>
              <div class="date-container" @click="showCalendar = !showCalendar">
                {{ $t("admin.to") }}:
                {{ toDate || $t("admin.selectDate") }}
              </div>
            </div>
            <date-picker
              :append-to-body="false"
              format="DD-MM-YYYY"
              v-model="dateRange"
              :popup-style="{ top: 'calc(100% - 5px)', left: 0, right: 0 }"
              popup-class="hideSecondCalendar"
              value-type="format"
              class="ash-datepicker"
              range
              :open="showCalendar"
              :lang="getCurrentLang()"
              @input="dateChange"
            >
              <template #icon-calendar>
                <img
                  src="../../assets/images/calendar.svg"
                  alt=""
                  style="width: 1rem; height: 1rem; object-fit: contain"
                />
              </template>
            </date-picker>
          </template>
        </div>
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
      class="ash-data-table clickable"
      @row-clicked="rowClicked"
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
      // sortable: true
      tablefields: [
        { key: "id", label: "id" },
        { key: "title", label: "title", translate: true },
        { key: "description", label: "description", translate: true },
        { key: "options_el", label: "options_el", translate: true },
        { key: "createdAt", label: "createdAt" },
        { key: "action", label: "action" },
      ],
      items: [],
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
      this.fetchSymptoms();
    },
  },
  methods: {
    ...mapActions("myMedication", ["setSelectedMedication"]),
    ...mapActions("symptomChecker", ["setSelectedSymptom"]),
    rowClicked(e) {
      this.setSelectedSymptom(e);
      this.navigateTo("Symptom Checker Details");
    },
    editSymptom(e) {
      this.setSelectedSymptom(e);
      this.navigateTo("Symptom Checker Edit");
    },
    deleteSymptom(item) {
      this.confirmIconModal(
        this.$t("areYouSure"),
        this.$t("admin.symptomDeleteConfirm"),
        "m-check",
        this.$t("admin.delete")
      ).then((res) => {
        if (res.value) {
          symptomChecker.deleteSymptom(item.id).then(
            (response) => {
              if (response.data.status) {
                this.items = [...this.items.filter((x) => x.id != item.id)];
                this.totalRows = this.items.length;
                this.successIconModal(
                  this.$t("changesDone"),
                  this.$t("admin.symptomDeleteSuccess")
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
    dateChange(val) {
      this.fromDate = val[0];
      this.toDate = val[1];
      if (!this.fromDate || this.toDate) {
        this.showCalendar = false;
      }
      this.fetchPackages();
    },
    parseData(data) {
      this.items = [];
      data.forEach((x) => {
        this.items.push({
          createdAt: this.formatDate(x.created_at),
          // options: Object.keys(x.options).join(", "),
          // noOfServices: Object.keys(x.service_details).length,
          options_el: x.options.length,
          ...x,
        });
      });
    },
    fetchSymptoms() {
      symptomChecker.fetchSymptoms().then(
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