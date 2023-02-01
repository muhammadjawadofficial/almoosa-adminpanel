<template>
  <div class="doctor-list-container page-body-container standard-width">
    <back-navigation
      :title="$t('admin.patientDetails')"
      backLink="Patient Details"
      v-if="userId"
    />
    <div class="search-box full-width mb-3" :class="{ 'mt-4': !!userId }">
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
        <template v-else-if="data.field.key == 'patient_name'">
          <div class="user-name-with-image">
            <div class="image">
              <img :src="getImageUrl(data.item.photo)" alt="user" />
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
import { mapActions, mapGetters } from "vuex";
import { familyMemberService, userService } from "../../services";
export default {
  data() {
    return {
      searchQuery: "",
      totalRows: 1,
      currentPage: 1,
      getPerPageSelection: 5,
      tablefields: [
        { key: "id", label: "id", sortable: true },
        { key: "patient_name", label: "patientName", sortable: true },
        { key: "mrn", label: "mrn", sortable: true },
        { key: "email", label: "email", sortable: true },
        { key: "phone", label: "phoneNumber", sortable: true },
        { key: "status", label: "status", sortable: true },
      ],
      items: [],
      userId: null,
    };
  },
  computed: {
    ...mapGetters("user", ["getSelectedUser"]),
  },
  mounted() {
    if (this.$route.name.toLowerCase().includes("patient")) {
      this.userId = this.getSelectedUser.id;
      if (!this.userId) {
        this.navigateTo("Patient Details");
      }
    }
    this.fetchUsers();
  },
  watch: {
    searchQuery(query) {
      this.fetchUsers();
    },
  },
  methods: {
    ...mapActions("familyMember", ["setSelectedFamilyMember"]),
    rowClicked(e) {
      this.setSelectedFamilyMember(e);
      if (this.userId) this.navigateTo("Patient Family Member Profile");
      else this.navigateTo("Family Members Profile");
    },
    parseData(data) {
      this.items = [];
      data.forEach((x) => {
        this.items.push({
          id: x.id,
          patient_name: this.getFullName(x),
          patient_photo: x.patient && x.patient.photo,
          mrn: x.mrn_number || "N/A",
          email: x.email_address || "N/A",
          phone: x.phone_number || "N/A",
          status: x.status || "N/A",
          ...x,
        });
      });
    },
    fetchUsers() {
      if (this.userId) {
        this.fetchPatientFamilyMembers();
      } else {
        this.fetchAllFamilyMembers();
      }
    },
    fetchPatientFamilyMembers() {
      this.setLoadingState(true);
      familyMemberService.fetchFamilyMembers(this.userId).then(
        (response) => {
          if (response.data.status) {
            this.parseData(response.data.data.items);
            this.currentPage = 1;
            this.totalRows = this.items.length;
          } else {
            this.failureToast(response.data.message);
          }
          this.setLoadingState(false);
        },
        (error) => {
          console.error(error);
          if (!this.isAPIAborted(error))
            this.failureToast(
              error.response.data && error.response.data.message
            );
          this.setLoadingState(false);
        }
      );
    },
    fetchAllFamilyMembers() {
      this.setLoadingState(true);
      familyMemberService.fetchAllFamilyMembers("?status=unverified").then(
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
          if (!this.isAPIAborted(error)) this.failureToast(error.response.data && error.response.data.message);
        }
      );
    },
  },
};
</script>

<style lang="scss" scoped>
</style>