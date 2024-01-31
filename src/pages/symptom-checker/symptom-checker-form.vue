<template>
  <div class="add-new-insurance-container standard-width page-body-container">
    <back-navigation
      :title="$t('admin.' + (editable ? 'editPackage' : 'addPackage'))"
      :showBack="false"
    />
    <!-- dsfsdf -->
    <div class="row mt-3">
      <div class="col-md-5">
        <b-input-group class="custom-login-input-groups">
          <b-form-input
            v-model="packageForm.title"
            :state="formSubmitted ? packageForm.title != '' : null"
            :placeholder="$t('admin.title')"
          ></b-form-input>
        </b-input-group>
      </div>
      <div class="col-md-5">
        <b-input-group class="custom-login-input-groups">
          <b-form-input
            v-model="packageForm.title_ar"
            :state="formSubmitted ? packageForm.title_ar != '' : null"
            :placeholder="$t('admin.title')"
          ></b-form-input>
        </b-input-group>
      </div>
    </div>

    <!-- fdfsdfs -->
    <div
      class="row"
      v-for="(service, index) in packageForm.options"
      :key="'service-' + index"
    >
      <div class="col-md-5">
        <b-input-group class="custom-login-input-groups">
          <b-form-input
            v-model="service.title"
            :state="formSubmitted ? service.title != '' : null"
            :placeholder="$t('admin.serviceName')"
          ></b-form-input>
        </b-input-group>
      </div>
      <div class="col-md-5">
        <b-input-group class="custom-login-input-groups">
          <b-form-input
            v-model="service.title_ar"
            :state="formSubmitted ? service.title_ar != '' : null"
            :placeholder="$t('admin.serviceDescription')"
          ></b-form-input>
        </b-input-group>
      </div>

    </div>
    <div class="col-md-10">
        <b-input-group class="custom-login-input-groups">
          <multiselect
            v-model="selectedSpecialist"
            :options="promoGroups"
            :placeholder="$t('admin.promoGroup')"
            track-by="id"
            label="title"
          ></multiselect>
          <div
            class="custom-state-invalid icon"
            
          ></div>
        </b-input-group>
        <!-- :class="{
              'is-invalid': promotionFormState.promo_group_id == false,
            }" -->
      </div>
    <div class="row">
      <div class="col-md-5">
        <b-input-group class="custom-login-input-groups">
          <b-form-textarea
            v-model="packageForm.description"
            :state="formSubmitted ? packageForm.description != '' : null"
            :placeholder="$t('admin.description')"
            rows="4"
            max-rows="8"
          ></b-form-textarea>
        </b-input-group>
      </div>
      <div class="col-md-5">
        <b-input-group class="custom-login-input-groups">
          <b-form-textarea
            v-model="packageForm.description_ar"
            :state="formSubmitted ? packageForm.description_ar != '' : null"
            :placeholder="$t('admin.description')"
            rows="4"
            max-rows="8"
          ></b-form-textarea>
        </b-input-group>
      </div>
      <div class="register-navigation col-md-12">
        <div class="button-group">
          <template v-if="editable">
            <button class="btn btn-primary" @click="editPackage">
              {{ $t("admin.editPackage") }}
            </button>
            <button
              class="btn btn-tertiary"
              @click="navigateTo('Symptom checker List')"
            >
              {{ $t("back") }}
            </button>
          </template>
          <button class="btn btn-primary" @click="addPackage" v-else>
            {{ $t("admin.createPackage") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
  
  <script>
import { authService, symptomChecker } from "../../services";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      showUpload: true,
      selectedSpecialist:null,
      packageForm: {
        title: "",
        title_ar: "",
        description: "",
        description_ar: "",
        speciality_id: null,
        options: [
          {
            title: "",
            title_ar: "",
            description: "",
            description_ar: "",
            recommendation: "",
            recommendation_ar: "",
          },
        ],
      },
      promoGroups:[{id:"1",title:"sp1"},{id:"2",title:"sp2"}],
      formSubmitted: false,
      editable: false,
    };
  },
  computed: {
    ...mapGetters("user", ["getUserInfo"]),
    ...mapGetters("symptomChecker", ["getSelectedSymptom"]),
  },
  watch: {
    $route: function () {
      this.checkAccess();
    },
  },
  mounted() {
    this.checkAccess();
  },
  methods: {
    checkAccess() {
      if (this.$route.name.toLowerCase().includes("edit")) {
        if (this.getSelectedSymptom && this.getSelectedSymptom.id) {
          this.editable = true;
        } else {
          this.navigateTo("Services Packages List");
        }
      } else {
        this.editable = false;
      }
      if (this.editable) {
        this.packageForm.title = this.getSelectedSymptom.title;
        this.packageForm.title = this.getSelectedSymptom.title;
        this.packageForm.price = this.getSelectedSymptom.price;
        this.packageForm.description = this.getSelectedSymptom.description;
        this.packageForm.description_ar =
          this.getSelectedSymptom.description_ar;
        this.packageForm.speciality_id = this.getSelectedSymptom.speciality_id;
        this.packageForm.options = [
          ...Object.keys(this.getSelectedSymptom.options).map((x) => {
            return {
              key: x,
              value: this.getSelectedSymptom.options[x],
            };
          }),
        ];
      } else {
        this.resetForm();
      }
    },
    removeService(index) {
      if (this.packageForm.options.length > 0) {
        this.packageForm.options = this.packageForm.options.filter(
          (x, i) => i != index
        );
      }
    },
    addService() {
      this.packageForm.options.push({
        title: "",
        title_ar: "",
        description: "",
        description_ar: "",
        recommendation: "",
        recommendation_ar: "",
      });
    },
    validateForm() {
      let form = this.packageForm;
      let state = {};
      state.title = form.title != "";
      state.title_ar = form.title_ar != "";
      state.description = form.description != "";
      state.description_ar = form.description_ar != "";
      state.speciality_id = form.speciality_id != "";
      state.options = form.options && form.options.length > 0;
      form.options.forEach((item) => {
        if (state.options) {
          state.options =
            item.title != "" &&
            item.title_ar != "" &&
            item.description != "" &&
            item.description_ar != "" &&
            item.recommendation != "" &&
            item.recommendation_ar != "";
        }
      });
      return !Object.values(state).includes(false);
    },
    addPackage() {
      this.formSubmitted = true;
      if (!this.validateForm()) {
        return;
      }
      let parsedDetails = {};
      this.packageForm.options.forEach((item) => {
        if (
          item.title != "" &&
          item.title_ar != "" &&
          item.description != "" &&
          item.description_ar != "" &&
          item.recommendation != "" &&
          item.recommendation_ar != ""
        )
          parsedDetails[item.key] = item.value;
      });
      let newPackage = {
        title: this.packageForm.title,
        title_ar: this.packageForm.title_ar,
        description: this.packageForm.description,
        description_ar: this.packageForm.description_ar,
        speciality_id: this.packageForm.speciality_id,
        options: JSON.stringify(parsedDetails),
      };
      symptomChecker.addNewSymptom(newPackage).then(
        (response) => {
          if (response.data.status) {
            this.resetForm();
            this.successToast(this.$t("admin.symptomCreateSuccessMessage"));
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
    },
    editPackage() {
      this.formSubmitted = true;
      if (!this.validateForm()) {
        return;
      }
      let parsedDetails = {};
      this.packageForm.options.forEach((item) => {
        if (
          item.title != "" &&
          item.title_ar != "" &&
          item.description != "" &&
          item.description_ar != "" &&
          item.recommendation != "" &&
          item.recommendation_ar != ""
        )
          parsedDetails[item.key] = item.value;
      });
      let newPackage = {
        title: this.packageForm.title,
        title_ar: this.packageForm.title_ar,
        description: this.packageForm.description,
        description_ar: this.packageForm.description_ar,
        speciality_id: this.packageForm.speciality_id,
        options: JSON.stringify(parsedDetails),
      };
      symptomChecker.updateSymptom(this.getSelectedSymptom.id, newPackage).then(
        (response) => {
          if (response.data.status) {
            this.formSubmitted = false;
            this.successToast(this.$t("admin.symptomCreateSuccessMessage"));
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
    },
    itemSelected(item) {
      this.selectedItem = item;
    },
    resetForm() {
      this.packageForm = {
        title: "",
        title_ar: "",
        description: "",
        description_ar: "",
        speciality_id: null,
        options: [
          {
            title: "",
            title_ar: "",
            description: "",
            description_ar: "",
            recommendation: "",
            recommendation_ar: "",
          },
        ],
      };
      this.formSubmitted = false;
    },
  },
};
</script>
      
  <style lang="scss" scoped>
.login-form {
  padding-top: 2rem;
}
.heading {
  font-size: 2.938rem;
  color: var(--theme-secondary);
}
.forgot-password {
  font-size: 1.125rem;
}
.register-navigation {
  display: flex;
  margin-top: 3.75rem;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}
.sign-up-link {
  text-align: right;
}
</style>