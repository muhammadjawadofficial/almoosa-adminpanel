<template>
  <div class="add-new-insurance-container standard-width page-body-container">
    <back-navigation
      :title="$t('admin.' + (editable ? 'editSymptom' : 'addSymptom'))"
      :showBack="false"
    />
    <!-- title -->
    <div class="row mt-3">
      <div class="col-md-5">
        <b-input-group class="custom-login-input-groups forceLtr">
          <b-form-input
            v-model="packageForm.title"
            :state="formSubmitted ? packageForm.title != '' : null"
            :placeholder="$t('symptoms.title')"
          ></b-form-input>
        </b-input-group>
      </div>
      <div class="col-md-5">
        <b-input-group class="custom-login-input-groups forceRtl">
          <b-form-input
            v-model="packageForm.title_ar"
            :state="formSubmitted ? packageForm.title_ar != '' : null"
            :placeholder="$t('symptoms.title_ar')"
          ></b-form-input>
        </b-input-group>
      </div>
    </div>
    <!-- description -->
    <div class="row">
      <div class="col-md-5">
        <b-input-group class="custom-login-input-groups forceLtr">
          <b-form-textarea
            v-model="packageForm.description"
            :state="formSubmitted ? packageForm.description != '' : null"
            :placeholder="$t('symptoms.description')"
            rows="4"
            max-rows="8"
          ></b-form-textarea>
        </b-input-group>
      </div>
      <div class="col-md-5">
        <b-input-group class="custom-login-input-groups forceRtl">
          <b-form-textarea
            v-model="packageForm.description_ar"
            :state="formSubmitted ? packageForm.description_ar != '' : null"
            :placeholder="$t('symptoms.description_ar')"
            rows="4"
            max-rows="8"
          ></b-form-textarea>
        </b-input-group>
      </div>
    </div>
    <!-- speciality_id -->
    <div class="row speciality_id">
      <div class="col-md-10">
        <b-input-group class="custom-login-input-groups">
          <multiselect
            v-model="packageForm.speciality_id"
            :options="Specialities"
            :placeholder="$t('profile.speciality')"
            track-by="id"
            label="title"
          ></multiselect>
          <div class="custom-state-invalid icon"></div>
        </b-input-group>
        <!-- :class="{
              'is-invalid': promotionFormState.promo_group_id == false,
            }" -->
      </div>
    </div>
    <!-- options-area -->
    <div class="">
      <h1 class="m-0">{{ $t("admin.options_el") }}</h1>
      <div
        v-for="(option, index) in packageForm.options"
        :key="'option-' + index"
      >
        <!-- title -->
        <div class="row mt-3 title">
          <div class="col-md-5">
            <b-input-group class="custom-login-input-groups forceLtr">
              <b-form-input
                v-model="option.title"
                :state="formSubmitted ? option.title != '' : null"
                :placeholder="$t('symptoms.title')"
              ></b-form-input>
            </b-input-group>
          </div>
          <div class="col-md-5">
            <b-input-group class="custom-login-input-groups forceRtl">
              <b-form-input
                v-model="option.title_ar"
                :state="formSubmitted ? option.title_ar != '' : null"
                :placeholder="$t('symptoms.title_ar')"
              ></b-form-input>
            </b-input-group>
          </div>
        </div>
        <!-- description -->
        <div class="row description">
          <div class="col-md-5">
            <b-input-group class="custom-login-input-groups forceLtr">
              <b-form-textarea
                v-model="option.description"
                :state="formSubmitted ? option.description != '' : null"
                :placeholder="$t('symptoms.description')"
                rows="4"
                max-rows="8"
              ></b-form-textarea>
            </b-input-group>
          </div>
          <div class="col-md-5">
            <b-input-group class="custom-login-input-groups forceRtl">
              <b-form-textarea
                v-model="option.description_ar"
                :state="formSubmitted ? option.description_ar != '' : null"
                :placeholder="$t('symptoms.description_ar')"
                rows="4"
                max-rows="8"
              ></b-form-textarea>
            </b-input-group>
          </div>
        </div>
        <!-- recommendation -->
        <div class="row recommendation">
          <div class="col-md-5">
            <b-input-group class="custom-login-input-groups forceLtr">
              <b-form-input
                v-model="option.recommendation"
                :state="formSubmitted ? option.recommendation != '' : null"
                :placeholder="$t('symptoms.recommendation')"
              ></b-form-input>
            </b-input-group>
          </div>
          <div class="col-md-5">
            <b-input-group class="custom-login-input-groups forceRtl">
              <b-form-input
                v-model="option.recommendation_ar"
                :state="formSubmitted ? option.recommendation_ar != '' : null"
                :placeholder="$t('symptoms.recommendation_ar')"
              ></b-form-input>
            </b-input-group>
          </div>
          <div class="col-md-1">
            <div
              class="add-new-insurance h-100 d-flex align-items-center pointer"
            >
              <div
                class="icon"
                v-if="index == packageForm.options.length - 1"
                @click="addSymptomItem"
              >
                <img src="../../assets/images/add.svg" alt="add" />
              </div>
              <div class="text" v-else @click="removeSymptom(index)">
                {{ $t("admin.remove") }}
              </div>
              <!-- <div
              @click="toggle(service)"
              class=""
              :style="
                'transform: rotate(' +
                (service.toggleSubServices ? 0 : 180) +
                'deg); transition: 0.3s all;margin:0 10px'
              "
            >
              <img
                src="../../assets/images/angle.svg"
                alt=""
                srcset=""
                style="width: 30px"
              />
            </div> -->
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- options-area-end -->
    <div class="row">
      <div class="register-navigation col-md-12">
        <div class="button-group">
          <template v-if="editable">
            <button class="btn btn-primary" @click="editSymptom">
              {{ $t("admin.editSymptom") }}
            </button>
            <button
              class="btn btn-tertiary"
              @click="navigateTo('Symptom Checker List')"
            >
              {{ $t("back") }}
            </button>
          </template>
          <button class="btn btn-primary" @click="addSymptom" v-else>
            {{ $t("admin.create") }}
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
      packageForm: {
        title: "",
        title_ar: "",
        description: "",
        description_ar: "",
        type: "radio",
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
      Specialities: [],
      dataSP: null,
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
    
    this.fetchSpecialities();
  },
  methods: {
    fetchSpecialities() {
      authService.getSpecialitiesV1().then(
        (response) => {
          if (response.data.status) {
            let data = response.data.data.items;
            this.Specialities = data;
            this.dataSP =  this.Specialities
            this.checkAccess();
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
    checkAccess() {
      if (this.$route.name.toLowerCase().includes("edit")) {
        if (this.getSelectedSymptom && this.getSelectedSymptom.id) {
          this.editable = true;
        } else {
          this.navigateTo("Symptom Checker List");
        }
      } else {
        this.editable = false;
      }
      if (this.editable) {
        this.packageForm.title = this.getSelectedSymptom.title;
        this.packageForm.title_ar = this.getSelectedSymptom.title_ar;
        this.packageForm.description = this.getSelectedSymptom.description;
        this.packageForm.description_ar =
          this.getSelectedSymptom.description_ar;
        if (this.Specialities && this.Specialities.length) {
          this.packageForm.speciality_id = this.Specialities.find(
            (el) => el.id == this.getSelectedSymptom.speciality_id
          );
        }
        this.packageForm.options = this.getSelectedSymptom.options;
      } else {
        this.resetForm();
      }
    },
    removeSymptom(index) {
      if (this.packageForm.options.length > 0) {
        this.packageForm.options = this.packageForm.options.filter(
          (x, i) => i != index
        );
      }
    },
    addSymptomItem() {
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
    addSymptom() {
      this.formSubmitted = true;
      if (!this.validateForm()) {
        return;
      }
      let newPackage = {
        title: this.packageForm.title,
        title_ar: this.packageForm.title_ar,
        description: this.packageForm.description,
        description_ar: this.packageForm.description_ar,
        type: "radio",
        speciality_id: this.packageForm.speciality_id.id,
        options: this.packageForm.options,
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
    editSymptom() {
      this.formSubmitted = true;
      if (!this.validateForm()) {
        return;
      }
      let newPackage = {
        title: this.packageForm.title,
        title_ar: this.packageForm.title_ar,
        description: this.packageForm.description,
        description_ar: this.packageForm.description_ar,
        type: "radio",
        speciality_id: this.packageForm.speciality_id,
        options: this.packageForm.options,
      };
      symptomChecker.updateSymptom(this.getSelectedSymptom.id, newPackage).then(
        (response) => {
          if (response.data.status) {
            this.formSubmitted = false;
            this.successToast(this.$t("admin.symptomCreateSuccessMessage"));
            this.resetForm();
            this.navigateTo("Symptom Checker List")
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
  margin-top: 1.75rem;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}
.sign-up-link {
  text-align: right;
}
</style>