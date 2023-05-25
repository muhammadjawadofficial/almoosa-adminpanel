<template>
  <div class="doctor-list-container page-body-container standard-width">
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
        <template v-else-if="data.field.translate && data.value">
          {{ data.item[getLocaleKey(data.field.key)] }}
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
      getPerPageSelection: 6,
      tablefields: [
        { key: "id", label: "id", sortable: true },
        { key: "relation", label: "relation", translate: true },
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
    this.fetchAllFamilyMembers();
  },
  watch: {
    searchQuery(query) {
      this.items = this.totalItems.filter(
        (x) =>
          ("" + x.family_member_mrn).includes(query) ||
          this.getFullName(x.dependent)
            .toLowerCase()
            .includes(query.toLowerCase())
      );
      this.totalRows = this.items.length;
    },
  },
  methods: {
    ...mapActions("familyMember", ["setSelectedFamilyMemberRelation"]),
    rowClicked(e) {
      this.setSelectedFamilyMemberRelation(e);
      this.navigateTo("Family Relations Edit");
    },
    fetchAllFamilyMembers() {
      familyMemberService.fetchFamilyMemberRelations().then(
        (response) => {
          if (response.data.status) {
            this.items = [...response.data.data.items];
            this.currentPage = 1;
            this.totalItems = [...this.items];
            this.totalRows = this.items.length;
          } else {
            this.failureToast(response.data.messsage);
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
    },
    deleteRequest(request) {
      this.confirmIconModal(
        this.$t("areYouSure"),
        this.$t("admin.relationDeleteConfirm"),
        "m-check",
        this.$t("admin.delete")
      ).then((res) => {
        if (res.value) {
          familyMemberService.deleteFamilyMemberRelation(request.id).then(
            (response) => {
              if (response.data.status) {
                this.successToast(this.$t("admin.relationDeleteSuccess"));
                this.fetchAllFamilyMembers();
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
  },
};
</script>

<style lang="scss" scoped>
</style>