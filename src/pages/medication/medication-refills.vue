<template>
  <div class="doctor-list-container page-body-container standard-width">
    <div class="search-box full-width">
      <div class="search-icon">
        <i class="fa fa-search" aria-hidden="true"></i>
      </div>
      <div class="search-input">
        <b-form-input
          :placeholder="$t('admin.searchPatientMrn')"
          id="type-search"
          type="search"
          v-model="searchQuery"
          debounce="500"
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
    >
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
              @click.stop="rowClicked(data.item)"
            ></feather>
            <feather
              class="pointer"
              type="trash"
              @click.stop="deleteMedicationRefill(data.item)"
            ></feather>
          </div>
        </template>
        <template v-else-if="data.field.key == 'patient_name'">
          <div class="user-name-with-image">
            <div class="image">
              <img :src="getImageUrl(data.item.patient_photo)" alt="user" />
            </div>
            <span class="text">{{ data.value }}</span>
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
import { medicationService } from "../../services";
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
      tablefields: [
        { key: "id", label: "id", sortable: true },
        { key: "title", label: "title", sortable: true },
        { key: "variation", label: "variation", sortable: true },
        { key: "description", label: "description", sortable: true },
        {
          key: "medicationRefillRequested",
          label: "refillRequest",
          sortable: true,
        },
        { key: "action", label: "action", sortable: true },
      ],
      items: [],
      showDatePicker: true,
      showCalendar: false,
      locale: "",
    };
  },
  mounted() {
    this.fetchAppointments();
  },
  watch: {
    searchQuery(query) {
      this.fetchAppointments();
    },
  },
  methods: {
    ...mapActions("myMedication", ["setSelectedMedication"]),
    rowClicked(e) {
      this.setSelectedMedication(e);
      this.navigateTo("All Medication Details");
    },
    dateChange(val) {
      this.fromDate = val[0];
      this.toDate = val[1];
      if (!this.fromDate || this.toDate) {
        this.showCalendar = false;
      }
      this.fetchAppointments();
    },
    changeTab(type) {
      this.fetchAppointments(type);
    },
    parseData(data) {
      this.items = [];
      data.forEach((x) => {
        this.items.push({
          medicationRefillRequested: x.status,
          title: x.medication.title,
          variation: x.medication.variation,
          description: x.medication.description,
          ...x,
        });
      });
    },
    fetchAppointments(type) {
      this.setLoadingState(true);
      medicationService.getMedicationRefills().then(
        (response) => {
          if (response.data.status) {
            this.parseData(response.data.data.items);
            this.currentPage = 1;
            this.totalRows = this.items.length;
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
              error.response.data && error.response.data.message
            );
        }
      );
    },
    deleteMedicationRefill(item) {
      this.confirmIconModal(
        this.$t("areYouSure"),
        this.$t("admin.medicationRefillDeleteConfirm"),
        "m-check",
        this.$t("admin.delete")
      ).then((res) => {
        if (res.value) {
          this.setLoadingState(true);
          medicationService.deleteMedicationRefill(item.id).then(
            (response) => {
              if (response.data.status) {
                this.items = [...this.items.filter((x) => x.id != item.id)];
                this.totalRows = this.items.length;
                this.successIconModal(
                  this.$t("changesDone"),
                  this.$t("admin.medicationRefillDeleteSuccess")
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
                  error.response.data && error.response.data.message
                );
            }
          );
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>