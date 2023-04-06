<template>
  <div class="doctor-list-container page-body-container standard-width">
    <b-table
      show-empty
      stacked="md"
      borderless
      :items="items"
      :fields="tablefields"
      :current-page="currentPage"
      :per-page="5"
      :sort-by="sortBy"
      :sort-desc="sortDesc"
      @sort-changed="sortUsers"
      class="ash-data-table"
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
            <feather class="pointer" type="edit"></feather>
          </div>
        </template>
        <template v-else-if="data.field.key == 'amount'">
          {{ data.value + " " + data.item.currency }}
        </template>
        <template v-else-if="data.field.key.toLowerCase().includes('date')">
          {{ getLongDateAndTimeFromDate(data.value, true) }}
        </template>
        <template v-else-if="data.field.key == 'patient_name'">
          <div class="user-name-with-image">
            <div class="image">
              <img :src="getImageUrl(data.item.patient_photo)" alt="user" />
            </div>
            <span class="text">{{ data.value || "N/A" }}</span>
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
import { transactionsService } from "../../services";
export default {
  data() {
    return {
      totalRows: 1,
      currentPage: 1,
      getPerPageSelection: 5,
      sortBy: "id",
      sortDesc: true,
      tablefields: [
        { key: "id", label: "id", sortable: true },
        { key: "gateway_id", label: "gatewayId" },
        { key: "amount", label: "amount", sortable: true },
        { key: "appointment_id", label: "appointmentId", sortable: true },
        { key: "mrn", label: "mrn" },
        { key: "consultingDoctor", label: "consultingDoctor" },
        { key: "status", label: "status", sortable: true },
      ],
      items: [],
    };
  },
  mounted() {
    this.fetchUsers();
  },
  methods: {
    sortUsers(filter) {
      this.sortDesc = filter.sortDesc;
      this.sortBy = filter.sortBy;
      this.fetchUsers();
    },
    parseData(data) {
      this.items = [];
      data.forEach((x) => {
        this.items.push({
          mrn: x.patient && x.patient.mrn_number,
          consultingDoctor: x.doctor && this.getFullName(x.doctor),
          ...x,
        });
      });
    },
    fetchUsers(pageNumber = 1) {
      this.items = [];
      this.setLoadingState(true);
      let query = "";
      if (this.sortBy) {
        query = "?sort=" + (this.sortDesc ? "-" : "") + this.sortBy;
      }
      // if (this.getPerPageSelection) {
      //   query += "&limit=" + this.getPerPageSelection;
      // }
      // if (pageNumber) {
      //   query += "&page=" + pageNumber;
      // }
      transactionsService.fetchTransactionList(query).then(
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