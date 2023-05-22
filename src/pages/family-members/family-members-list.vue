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
          :placeholder="$t('admin.searchFamilyMemberByNameMrn')"
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
      :per-page="getPerPageSelection"
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
            <!-- <feather
              @click.stop="editRequest(data.item)"
              class="pointer"
              type="settings"
            ></feather> -->
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
            <div class="image">
              <img :src="getImageUrl(data.item.dependent.photo)" alt="user" />
            </div>
            <span class="text">{{ getFullName(data.item.dependent) }}</span>
          </div>
        </template>
        <template v-else-if="data.field.key == 'guardian_name'">
          <div class="user-name-with-image">
            <div class="image">
              <img :src="getImageUrl(data.item.guardian.photo)" alt="user" />
            </div>
            <span class="text">{{ getFullName(data.item.guardian) }}</span>
          </div>
        </template>
        <template v-else>{{ translateNumber(data.value) }}</template>
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
import { familyMemberService } from "../../services";
export default {
  data() {
    return {
      searchQuery: "",
      totalRows: 1,
      currentPage: 1,
      getPerPageSelection: 5,
      tablefields: [
        { key: "id", label: "id", sortable: true },
        { key: "guardian_name", label: "guardianName", sortable: true },
        { key: "guardian_mrn", label: "guardianMrn", sortable: true },
        {
          key: "family_member_name",
          label: "familyMemberName",
          sortable: true,
        },
        { key: "family_member_mrn", label: "familyMemberMrn", sortable: true },
        { key: "phone", label: "phoneNumber", sortable: true },
        { key: "status", label: "status", sortable: true },
        { key: "action", label: "action" },
      ],
      items: [],
      totalItems: [],
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
      this.items = this.totalItems.filter(
        (x) =>
          ("" + x.family_member_mrn).includes(query) ||
          this.getFullName(x.dependent).toLowerCase().includes(query.toLowerCase())
      );
      this.totalRows = this.items.length;
    },
  },
  methods: {
    ...mapActions("familyMember", [
      "setSelectedFamilyMember",
      "setSelectedFamilyMemberRequest",
    ]),
    rowClicked(e) {
      this.setSelectedFamilyMember(e.dependent);
      this.setSelectedFamilyMemberRequest(e);
      if (this.userId) this.navigateTo("Patient Family Member Profile");
      else this.navigateTo("Family Members Profile");
    },
    parseData(data) {
      this.items = [];
      data.forEach((x) => {
        this.items.push({
          id: x.id,
          family_member_mrn: x.dependent.mrn_number || "N/A",
          guardian_mrn: x.guardian.mrn_number || "N/A",
          email: x.dependent.email_address || "N/A",
          phone: x.dependent.phone_number || "N/A",
          status: x.status || "N/A",
          ...x,
        });
      });

      this.totalItems = [...this.items];
    },
    fetchUsers() {
      if (this.userId) {
        this.fetchPatientFamilyMembers();
      } else {
        this.fetchAllFamilyMembers();
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
              this.totalRows = this.items.length;
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
    fetchAllFamilyMembers() {
      familyMemberService.fetchAllFamilyMembers().then(
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

<style lang="scss" scoped>
</style>