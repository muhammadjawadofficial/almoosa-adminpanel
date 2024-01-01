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
          :placeholder="$t('admin.searchFamilyMemberByMrn')"
          id="type-search"
          type="search"
          v-model="searchQuery"
          debounce="1000"
        ></b-form-input>
      </div>
    </div>
    <div class="filter-container" v-if="!this.userId">
      <div class="toggle-options mb-0">
        <div
          class="toggle-options--single"
          :class="{ active: activeTab == 'pending' }"
          @click="changeTab('pending')"
        >
          {{ $t("admin.pending") }}
        </div>
        <div
          class="toggle-options--single"
          :class="{ active: activeTab == 'approved' }"
          @click="changeTab('approved')"
        >
          {{ $t("admin.approved") }}
        </div>
        <div
          class="toggle-options--single"
          :class="{ active: activeTab == 'rejected' }"
          @click="changeTab('rejected')"
        >
          {{ $t("admin.rejected") }}
        </div>
      </div>
    </div>
    <b-table
      show-empty
      responsive
      stacked="md"
      borderless
      :items="items"
      :fields="tablefields"
      :per-page="5"
      :sort-by="sortBy"
      :sort-desc="sortDesc"
      @sort-changed="sortUsers"
      class="ash-data-table mt-3"
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
            <feather
              @click.stop="rowClicked(data.item)"
              class="pointer"
              type="edit"
            ></feather>
            <feather
              @click.stop="deleteRequest(data.item)"
              class="pointer"
              type="trash"
            ></feather>
          </div>
        </template>
        <template v-else-if="data.field.key == 'family_member_name'">
          <div class="user-name-with-image">
            <!-- <div class="image">
              <img
                :src="
                  getImageUrl(data.item.dependent && data.item.dependent.photo)
                "
                alt="user"
              />
            </div> -->
            <span class="text">{{ getFullName(data.item.dependent) }}</span>
          </div>
        </template>
        <template v-else-if="data.field.key == 'guardian_name'">
          <div class="user-name-with-image">
            <!-- <div class="image">
              <img
                :src="
                  getImageUrl(data.item.guardian && data.item.guardian.photo)
                "
                alt="user"
              />
            </div> -->
            <span class="text">{{ getFullName(data.item.guardian) }}</span>
          </div>
        </template>
        <template v-else-if="data.field.key == 'age' && data.value">
          {{ translateNumber(data.value) + " " + $t("years") }}
        </template>
        <template v-else-if="data.field.key == 'updated_by' && data.value">
          <div class="user-name-with-image">
            <span class="text">
              ({{ data.value.id }}) {{ getFullName(data.value) }}
            </span>
          </div>
        </template>
        <template
          v-else-if="
            data.field.key.toLowerCase().includes('updated_at') ||
            data.field.key.toLowerCase().includes('created_at')
          "
        >
          {{ getLongDateAndTimeFromDate(data.value, true) }}
        </template>
        <template v-else>{{ data.value || "N/A" }}</template>
      </template>
    </b-table>
    <b-pagination
      v-model="currentPage"
      :total-rows="totalRows"
      :per-page="getPerPageSelection"
      @change="fetchAllFamilyMembers(activeTab, $event)"
      class="my-0 justify-content-end"
      v-if="getPerPageSelection"
    ></b-pagination>
    <b-pagination v-else class="my-0"> </b-pagination>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { familyMemberService } from "../../services";
export default {
  data() {
    return {
      sortBy: "id",
      sortDesc: true,
      searchQuery: "",
      sortKey: "id",
      totalRows: 1,
      currentPage: 1,
      getPerPageSelection: 5,
      tablefields: [
        { key: "id", label: "id", sortable: true },
        { key: "guardian_name", label: "guardianName" },
        { key: "guardian_mrn", label: "guardianMrn" },
        {
          key: "family_member_name",
          label: "familyMemberName",
        },
        { key: "family_member_mrn", label: "familyMemberMrn" },
        { key: "age", label: "age" },
        { key: "phone", label: "phoneNumber" },
        { key: "status", label: "status", sortable: true },
        { key: "created_at", label: "createdAt", sortable: true },
        { key: "updated_at", label: "updatedAt", sortable: true },
        { key: "updated_by", label: "updatedBy" },
        { key: "action", label: "action" },
      ],
      items: [],
      totalItems: [],
      userId: null,
      activeTab: "",
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
    searchQuery() {
      this.fetchAllFamilyMembers(this.activeTab, 1);
    },
  },
  methods: {
    ...mapActions("familyMember", [
      "setSelectedFamilyMember",
      "setSelectedFamilyMemberRequest",
    ]),
    changeTab(type) {
      this.activeTab = type;
      this.fetchAllFamilyMembers(type, 1);
    },
    rowClicked(e) {
      this.setSelectedFamilyMember(e.dependent);
      this.setSelectedFamilyMemberRequest(e);
      if (this.userId) this.navigateTo("Patient Family Member Profile");
      else this.navigateTo("Family Members Profile");
    },
    sortUsers(filter) {
      console.log("jhdasfasdgfkjgaf", filter);
      this.sortDesc = filter.sortDesc;
      this.sortBy = filter.sortBy;
      this.fetchAllFamilyMembers();
    },
    parseData(data) {
      this.items = [];
      data.forEach((x) => {
        this.items.push({
          id: x.id,
          family_member_mrn: (x.dependent && x.dependent.mrn_number) || "N/A",
          age:
            x.dependent && x.dependent.dob
              ? this.getYears(x.dependent.dob)
              : "N/A",
          guardian_mrn: (x.guardian && x.guardian.mrn_number) || "N/A",
          family_member_phone:
            (x.dependent && x.dependent.phone_number) || "N/A",
          guardian_phone: (x.guardian && x.guardian.phone_number) || "N/A",
          email: (x.dependent && x.dependent.email_address) || "N/A",
          phone: (x.dependent && x.dependent.phone_number) || "N/A",
          status: x.status || "N/A",
          ...x,
        });
      });
      this.totalRows = this.items.length;
      this.totalItems = [...this.items];
    },
    fetchUsers() {
      if (this.userId) {
        this.fetchPatientFamilyMembers();
      } else {
        this.fetchAllFamilyMembers("pending");
      }
    },
    fetchPatientFamilyMembers() {
      familyMemberService
        .fetchAllFamilyMembers("?mrn_number=" + this.getSelectedUser.mrn_number)
        .then(
          (response) => {
            if (response.data.status) {
              this.parseData(response.data.data.items);

              this.currentPage = 1;
            } else {
              this.failureToast(response.data.message);
            }
          },
          (error) => {
            console.error(error);
            if (!this.isAPIAborted(error))
              this.failureToast(
                error.response &&
                  error.response.data &&
                  error.response.data.message
              );
          }
        );
    },
    fetchAllFamilyMembers(status = "", pageNumber = 1) {
      this.items = [];
      let query = "?query=" + this.searchQuery;
      if (this.sortKey) {
        query +=
          "&sort=" +
          (this.sortDesc ? "DESC" : "ASC") +
          "&orderBy=" +
          this.sortKey;
      }
      query += "&limit=" + this.getPerPageSelection;
      if (pageNumber) {
        query += "&page=" + pageNumber;
      }
      if (status) {
        query += "&status=" + status;
      } else if (this.activeTab) {
        query += "&status=" + this.activeTab;
      } else {
        query += "&status=pending";
      }

      familyMemberService.fetchAllFamilyMembers(query).then(
        (response) => {
          if (response.data.status) {
            this.activeTab = status || "pending";
            this.parseData(response.data.data.items);
            this.currentPage = pageNumber;
            this.totalRows = response.data.data.total_records;
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
    deleteRequest(request) {
      this.confirmIconModal(
        this.$t("areYouSure"),
        this.$t("admin.familyMemberDeleteConfirm"),
        "m-check",
        this.$t("admin.delete")
      ).then((res) => {
        if (res.value) {
          familyMemberService.deleteFamilyMemberRequest(request.id).then(
            (response) => {
              if (response.data.status) {
                this.successToast(this.$t("admin.familyMemberDeleteSuccess"));
                this.fetchUsers();
              } else {
                this.failureToast(response.data.message);
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
    editRequest(request) {
      this.setSelectedFamilyMemberRequest(request);
      this.setSelectedFamilyMember(request.dependent);
      this.navigateTo("Family Members Request");
    },
  },
};
</script>

<style lang="scss" scoped></style>