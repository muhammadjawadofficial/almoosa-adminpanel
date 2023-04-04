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
          debounce="1000"
        ></b-form-input>
      </div>
    </div>
    <div class="filter-container">
      <div class="toggle-options">
        <div
          class="toggle-options--single"
          :class="{ active: activeTab == 'registered' }"
          @click="changeTab('registered')"
        >
          {{ $t("admin.registered") }}
        </div>
        <div
          class="toggle-options--single"
          :class="{ active: activeTab == 'requested' }"
          @click="changeTab('requested')"
        >
          {{ $t("admin.newRequest") }}
        </div>
        <div
          class="toggle-options--single"
          :class="{ active: activeTab == 'duplicated' }"
          @click="changeTab('duplicated')"
        >
          {{ $t("admin.duplicated") }}
        </div>
      </div>
    </div>

    <patient-register-list
      :searchQuery="searchQuery"
      v-if="activeTab == 'registered'"
    />
    <patient-request-list
      :searchQuery="searchQuery"
      v-if="activeTab == 'requested'"
    />
    <patient-duplicated-request-list
      :searchQuery="searchQuery"
      v-if="activeTab == 'duplicated'"
    />
  </div>
</template>

<script>
import patientRegisterList from "./patient-register-list.vue";
import patientRequestList from "./patient-request-list.vue";
import patientDuplicatedRequestList from "./patient-duplicated-request-list.vue";
export default {
  data() {
    return {
      searchQuery: "",
      activeTab: "registered",
    };
  },
  components: {
    "patient-register-list": patientRegisterList,
    "patient-request-list": patientRequestList,
    "patient-duplicated-request-list": patientDuplicatedRequestList,
  },
  mounted() {
    this.activeTab = this.$route.params.tab || "registered";
    this.changeRouteParam();
  },
  methods: {
    changeTab(tab) {
      this.activeTab = tab;
      this.changeRouteParam();
    },
    changeRouteParam() {
      this.$router.replace({
        name: "Patient List",
        params: { tab: this.activeTab },
      });
    },
  },
};
</script>