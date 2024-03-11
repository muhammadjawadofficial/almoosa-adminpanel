<template>
  <div class="add-new-insurance-container standard-width page-body-container">
    <back-navigation
      :title="$t('admin.' + (editable ? 'editSymptom' : 'addSymptom'))"
      :showBack="false"
    />
    <!-- title -->
    <div class="row mt-3 speciality_id">
      <div class="col-md-5">
        <b-input-group class="custom-login-input-groups">
          <multiselect
            v-model="symptomForm.speciality_id"
            :options="specialities"
            :placeholder="$t('profile.speciality')"
            track-by="id"
            label="title"
          >
            <template slot="singleLabel" slot-scope="props">
              {{ props.option[getLocaleKey("title")] }}
            </template>

            <template slot="option" slot-scope="props">
              {{ props.option[getLocaleKey("title")] }}
            </template>
          </multiselect>
          <div
            class="custom-state-invalid icon"
            :class="{
              'is-invalid': formSubmitted ? !symptomForm.speciality_id : null,
            }"
          ></div>
        </b-input-group>
      </div>
      <div class="col-md-3">
        <b-input-group class="custom-login-input-groups">
          <multiselect
            v-model="symptomForm.condition"
            :options="conditions"
            :placeholder="$t('admin.condition')"
          >
          </multiselect>
          <div
            class="custom-state-invalid icon"
            :class="{
              'is-invalid': formSubmitted ? !symptomForm.condition : null,
            }"
          ></div>
        </b-input-group>
      </div>
      <div class="col-md-2">
        <b-input-group class="custom-login-input-groups">
          <b-form-input
            v-model="symptomForm.age"
            :state="formSubmitted ? symptomForm.age != '' : null"
            :placeholder="$t('admin.age')"
          ></b-form-input>
        </b-input-group>
      </div>
    </div>
    <div class="mt-5">
      <h1 class="m-0">{{ $t("admin.recommendation") }}</h1>
      <div class="row mt-3">
        <div class="col-md-5">
          <b-input-group class="custom-login-input-groups forceLtr">
            <b-form-input
              v-model="symptomForm.recommendation"
              :state="formSubmitted ? symptomForm.recommendation != '' : null"
              :placeholder="$t('symptoms.recommendation')"
            ></b-form-input>
          </b-input-group>
        </div>
        <div class="col-md-5">
          <b-input-group class="custom-login-input-groups forceRtl">
            <b-form-input
              v-model="symptomForm.recommendation_ar"
              :state="
                formSubmitted ? symptomForm.recommendation_ar != '' : null
              "
              :placeholder="$t('symptoms.recommendation_ar')"
            ></b-form-input>
          </b-input-group>
        </div>
        <div class="col-md-5">
          <b-input-group class="custom-login-input-groups">
            <multiselect
              v-model="symptomForm.recommendation_speciality"
              :options="specialities"
              :placeholder="$t('profile.speciality')"
              track-by="id"
              label="title"
            >
              <template slot="singleLabel" slot-scope="props">
                {{ props.option[getLocaleKey("title")] }}
              </template>

              <template slot="option" slot-scope="props">
                {{ props.option[getLocaleKey("title")] }}
              </template>
            </multiselect>
            <div
              class="custom-state-invalid icon"
              :class="{
                'is-invalid': formSubmitted
                  ? !symptomForm.recommendation_speciality
                  : null,
              }"
            ></div>
          </b-input-group>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="register-navigation col-md-12">
        <div class="button-group">
          <template v-if="editable">
            <button class="btn btn-primary" @click="editSymptom">
              {{ $t("admin.editSymptom") }}
            </button>
            <button
              class="btn btn-tertiary"
              @click="navigateTo('Symptom Checker Age Condition List')"
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
      symptomForm: {
        recommendation: "",
        recommendation_ar: "",
        age: "",
        speciality_id: null,
        recommendation_speciality: null,
        condition: "",
      },
      specialities: [],
      conditions: ["lt", "gt", "eq"],
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
            this.specialities = data;
            this.dataSP = this.specialities;
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
          this.navigateTo("Symptom Checker Age Condition List");
        }
      } else {
        this.editable = false;
      }
      if (this.editable) {
        this.symptomForm.recommendation =
          this.getSelectedSymptom.recommendation;
        this.symptomForm.recommendation_ar =
          this.getSelectedSymptom.recommendation_ar;
        this.symptomForm.age = this.getSelectedSymptom.age;
        if (this.specialities && this.specialities.length) {
          this.symptomForm.speciality_id = this.specialities.find(
            (el) => el.id == this.getSelectedSymptom.speciality_id
          );
          this.symptomForm.recommendation_speciality = this.specialities.find(
            (el) =>
              el.id == this.getSelectedSymptom.recommendation_speciality_id
          );
        }
        this.symptomForm.condition = this.getSelectedSymptom.condition;
      } else {
        this.resetForm();
      }
    },
    validateForm() {
      let form = this.symptomForm;
      let state = {};
      state.recommendation = form.recommendation != "";
      state.recommendation_ar = form.recommendation_ar != "";
      state.condition = form.condition != "";
      state.age = form.age != "";
      state.speciality_id = form.speciality_id != "";
      return !Object.values(state).includes(false);
    },
    addSymptom() {
      this.formSubmitted = true;
      if (!this.validateForm()) {
        return;
      }
      let newPackage = {
        recommendation: this.symptomForm.recommendation,
        recommendation_ar: this.symptomForm.recommendation_ar,
        recommendation_speciality_id: this.symptomForm.recommendation_speciality
          ? this.symptomForm.recommendation_speciality.id
          : null,
        condition: this.symptomForm.condition,
        age: this.symptomForm.age,
        speciality_id: this.symptomForm.speciality_id.id,
      };
      symptomChecker.addAgeCondition(newPackage).then(
        (response) => {
          if (response.data.status) {
            this.resetForm();
            this.successToast(
              this.$t("admin.symptomAgeConditionCreateSuccessMessage")
            );
            this.navigateTo("Symptom Checker Age Condition List");
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
        recommendation: this.symptomForm.recommendation,
        recommendation_ar: this.symptomForm.recommendation_ar,
        recommendation_speciality_id: this.symptomForm.recommendation_speciality
          ? this.symptomForm.recommendation_speciality.id
          : null,
        condition: this.symptomForm.condition,
        age: this.symptomForm.age,
        speciality_id: this.symptomForm.speciality_id.id,
      };
      symptomChecker
        .updateAgeCondition(this.getSelectedSymptom.id, newPackage)
        .then(
          (response) => {
            if (response.data.status) {
              this.formSubmitted = false;
              this.successToast(
                this.$t("admin.symptomAgeConditionUpdateSuccessMessage")
              );
              this.resetForm();
              this.navigateTo("Symptom Checker Age Condition List");
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
      this.symptomForm = {
        recommendation: "",
        recommendation_ar: "",
        recommendation_speciality: null,
        condition: "",
        age: "",
        speciality_id: null,
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