<template>
  <div class="add-promotion-container standard-width page-body-container">
    <back-navigation
      :title="editable ? $t('admin.editPromotion') : $t('admin.addPromotion')"
      :showBack="false"
    />
    <div class="row mt-3">
      <div class="col-md-6">
        <b-input-group class="custom-login-input-groups forceLtr">
          <b-form-input
            v-model="promotionForm.title"
            :state="promotionFormState.title"
            :placeholder="$t('admin.title')"
          ></b-form-input>
        </b-input-group>
      </div>
      <div class="col-md-6">
        <b-input-group class="custom-login-input-groups forceRtl">
          <b-form-input
            v-model="promotionForm.title_ar"
            :state="promotionFormState.title_ar"
            :placeholder="$t('admin.titleAr')"
          ></b-form-input>
        </b-input-group>
      </div>
      <div class="col-md-6">
        <b-input-group class="custom-login-input-groups forceLtr">
          <b-form-textarea
            id="textarea"
            v-model="promotionForm.details"
            :state="promotionFormState.details"
            :placeholder="$t('admin.details')"
            rows="3"
            max-rows="5"
          ></b-form-textarea>
        </b-input-group>
      </div>
      <div class="col-md-6">
        <b-input-group class="custom-login-input-groups forceRtl">
          <b-form-textarea
            id="textarea"
            v-model="promotionForm.details_ar"
            :state="promotionFormState.details_ar"
            :placeholder="$t('admin.detailsAr')"
            rows="3"
            max-rows="5"
          ></b-form-textarea>
        </b-input-group>
      </div>
      <div class="col-md-4" v-if="isConfigurable">
        <b-input-group class="custom-login-input-groups">
          <multiselect
            v-model="promotionForm.discount_type"
            :options="discountType"
            :placeholder="$t('admin.discountType')"
            :selectLabel="$t('selectLabel')"
            :selectedLabel="$t('selectedLabel')"
            :deselectLabel="$t('deselectLabel')"
          >
            <template slot="singleLabel" slot-scope="props">
              {{ $t("admin." + props.option) }}
            </template>
            <template slot="option" slot-scope="props">
              {{ $t("admin." + props.option) }}
            </template>
          </multiselect>
          <div
            class="custom-state-invalid icon"
            :class="{
              'is-invalid': promotionFormState.discount_type == false,
            }"
          ></div>
        </b-input-group>
      </div>
      <div class="col-md-6">
        <b-input-group class="custom-login-input-groups">
          <b-form-input
            type="text"
            v-model="promotionForm.discount"
            :state="promotionFormState.discount"
            :placeholder="$t('admin.discount')"
          ></b-form-input>
        </b-input-group>
      </div>
      <div class="col-md-6">
        <b-input-group class="custom-login-input-groups">
          <b-form-input
            type="text"
            v-model="promotionForm.promo_code"
            :state="promotionFormState.promo_code"
            :placeholder="$t('admin.promoCode')"
          ></b-form-input>
        </b-input-group>
      </div>
      <div class="col-md-12">
        <b-input-group class="custom-login-input-groups">
          <b-form-input
            type="text"
            v-model="promotionForm.survey_link"
            :state="promotionFormState.survey_link"
            :placeholder="$t('admin.surveyLink')"
          ></b-form-input>
        </b-input-group>
      </div>
      <div class="col-md-4">
        <b-input-group class="custom-login-input-groups">
          <b-form-input
            type="number"
            v-model="promotionForm.usage_count_per_user"
            :state="promotionFormState.usage_count_per_user"
            :placeholder="$t('admin.usageOfCount')"
          ></b-form-input>
        </b-input-group>
      </div>
      <div class="col-md-4">
        <b-input-group class="custom-login-input-groups">
          <b-form-input
            type="text"
            :value="promotionForm.start_date"
            :state="promotionFormState.start_date"
            :placeholder="$t('admin.startDate')"
            @click.stop="showStartDateCalendar = !showStartDateCalendar"
            readonly
          ></b-form-input>
          <date-picker
            :append-to-body="false"
            v-model="promotionForm.start_date"
            format="YYYY-MM-DD"
            :popup-style="{ top: 'calc(100% - 5px)', left: 0, right: 0 }"
            popup-class="hideSecondCalendar"
            value-type="format"
            class="ash-datepicker"
            :lang="getCurrentLang()"
            :open="showStartDateCalendar"
            @input="showStartDateCalendar = false"
          >
            <template #icon-calendar>
              <img src="../../assets/images/calendar.svg" alt="" />
            </template>
          </date-picker>
        </b-input-group>
      </div>
      <div class="col-md-4">
        <b-input-group class="custom-login-input-groups">
          <b-form-input
            type="text"
            :value="promotionForm.expiry_date"
            :state="promotionFormState.expiry_date"
            :placeholder="$t('admin.expiryDate')"
            @click.stop="showEndDateCalendar = !showEndDateCalendar"
            readonly
          ></b-form-input>
          <date-picker
            :append-to-body="false"
            v-model="promotionForm.expiry_date"
            format="YYYY-MM-DD"
            :popup-style="{ top: 'calc(100% - 5px)', left: 0, right: 0 }"
            popup-class="hideSecondCalendar"
            value-type="format"
            class="ash-datepicker"
            :lang="getCurrentLang()"
            :open="showEndDateCalendar"
            @input="showEndDateCalendar = false"
          >
            <template #icon-calendar>
              <img src="../../assets/images/calendar.svg" alt="" />
            </template>
          </date-picker>
        </b-input-group>
      </div>
      <!-- allUser -->
      <div class="col-md-3 mt-3 inputChecker">
        <input
          id="allUsers"
          type="checkbox"
          class="checkboxInput"
          v-model="promotionForm.is_for_all_users"
          value="Bike"
        />
        <label for="allUsers">{{ $t("admin.allUsers") }}</label>
      </div>
      <template>
        <div class="col-md-3 mt-3 inputChecker" v-if="isConfigurable">
          <input
            id="allSpecialities"
            type="checkbox"
            v-model="promotionForm.is_for_all_specialities"
            value="Bike"
          />
          <label for="allSpecialities">{{ $t("admin.allSpecialities") }}</label>
        </div>
        <div class="col-md-3 mt-3 inputChecker" v-if="isConfigurable">
          <input
            id="virtualappointment"
            type="checkbox"
            v-model="promotionForm.is_virtual_appointment_promo"
            value="Bike"
          />
          <label for="virtualappointment">{{
            $t("admin.virtualappointment")
          }}</label>
        </div>
        <div class="col-md-3 mt-3 inputChecker" v-if="isConfigurable">
          <input
            id="onsiteAppointment"
            type="checkbox"
            v-model="promotionForm.is_onsite_appointment_promo"
          />
          <label for="onsiteAppointment">{{
            $t("admin.onsiteAppointment")
          }}</label>
        </div>
        <div class="col-md-3 mt-3 inputChecker" v-if="isConfigurable">
          <input
            id="allPackages"
            type="checkbox"
            v-model="promotionForm.is_for_all_packages"
          />
          <label for="allPackages">{{ $t("admin.allPackages") }}</label>
        </div>
        <div class="col-md-3 mt-3 inputSwitch" style="display: flex; gap: 1rem">
          <span>{{ $t("admin.showInList") }}</span>
          <label class="switch">
            <input type="checkbox" v-model="promotionForm.is_show" />
            <span class="slider round"></span>
          </label>
        </div>
        <div
          class="col-md-3 mt-3 inputSwitch"
          v-if="isConfigurable"
          style="display: flex; gap: 1rem"
        >
          <span>{{ $t("admin.active") }}</span>
          <label class="switch" for="isActive">
            <input
              type="checkbox"
              id="isActive"
              v-model="promotionForm.is_active"
            />
            <span class="slider round"></span>
          </label>
        </div>
        <div
          v-if="!promotionForm.is_for_all_users"
          class="col-md-10 checkBoxInput"
          style="display: flex; gap: 10px; align-items: center"
        >
          <div style="flex-grow: 1">
            <b-input-group class="custom-login-input-groups">
              <multiselect
                class="tags-spacing small-tags"
                v-model="items"
                :options="allUsers"
                :placeholder="$t('admin.allUsers')"
                track-by="mrn_number"
                multiple
                label="label"
                :close-on-select="false"
                :clear-on-select="false"
                :internal-search="false"
                @search-change="searchUsers"
              >
              </multiselect>
              <div
                class="custom-state-invalid icon"
                :class="{
                  'is-invalid': promotionFormState.promo_group_id == false,
                }"
              ></div>
            </b-input-group>
          </div>
        </div>
        <div
          v-if="!promotionForm.is_for_all_specialities && isConfigurable"
          class="col-md-10 checkBoxInput"
          style="display: flex; gap: 10px; align-items: center"
        >
          <div style="flex-grow: 1">
            <b-input-group class="custom-login-input-groups">
              <multiselect
                class="tags-spacing"
                v-model="selectedSpecialities"
                :options="specialities"
                :placeholder="$t('admin.allSpecialities')"
                track-by="id"
                multiple
                label="title"
                :close-on-select="false"
              >
              </multiselect>
              <div
                class="custom-state-invalid icon"
                :class="{
                  'is-invalid': promotionFormState.promo_group_id == false,
                }"
              ></div>
            </b-input-group>
          </div>
        </div>
      </template>
    </div>
    <div class="row">
      <div class="col-md-6">
        <div class="custom-login-input-groups file-upload-container">
          <div class="upload-text" v-if="fileToUpload.length">
            {{ $t("insurance.clickToUpload") }}
          </div>
          <div class="upload-text text-muted w200 center" v-else>
            {{ $t("admin.uploadPromotionBanner") }}
          </div>
          <vue-dropzone
            v-if="showUpload"
            @vdropzone-thumbnail="checkFileDimensions"
            @vdropzone-removed-file="removeFile"
            :options="validationdropzoneOptions"
            ref="promoImageToUpload"
            id="validationdropzone"
            class="dropzone digits custom-file-upload"
          >
          </vue-dropzone>
          <div
            :class="{
              'dropzone is-invalid': promotionFormState.image_id == false,
            }"
          ></div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="register-navigation col-md-12">
        <div class="button-group mt-5">
          <button class="btn btn-primary" @click="createUpdatePromotion">
            {{ $t("admin." + (editable ? "update" : "create")) }}
          </button>
          <button
            class="btn btn-tertiary"
            v-if="editable"
            @click="navigateBack()"
          >
            {{ $t("back") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script>
import { authService, promotionCodeService, userService } from "../../services";
import { mapGetters } from "vuex";
import { debounce } from "lodash";

export default {
  data() {
    return {
      items: [],
      allUsers: [],
      specialities: [],
      selectedSpecialities: [],
      sortBy: "id",
      sortDesc: true,
      showUpload: true,
      selectedPromotion: null,
      searchQuery: "",
      isConfigurable: false,
      promotionForm: {
        title: "",
        title_ar: "",
        details: "",
        details_ar: "",
        start_date: "",
        expiry_date: "",
        discount: "",
        discount_type: "percentage",
        promo_code: "",
        usage_count_per_user: null,
        image_id: null,
        survey_link: "",
        is_virtual_appointment_promo: false,
        is_onsite_appointment_promo: false,
        is_for_all_users: true,
        is_for_all_specialities: true,
        is_for_all_packages: false,
        is_show: false,
        is_active: false,
        user_ids: [],
        specialities_ids: [],
      },

      promotionFormState: {
        title: null,
        title_ar: null,
        details: null,
        details_ar: null,
        start_date: null,
        expiry_date: null,
        discount: null,
        discount_type: null,
        usage_count_per_user: null,
        promo_code: null,
        image_id: null,
        survey_link: null,
        is_virtual_appointment_promo: false,
        is_onsite_appointment_promo: false,
        is_for_all_users: false,
        is_for_all_specialities: false,
        is_for_all_packages: false,
        is_show: false,
        is_active: false,
        user_ids: [],
        specialities_ids: [],
      },
      formSubmitted: false,

      validationdropzoneOptions: {
        url: "http://172.16.242.88:3000",
        acceptedFiles: ["image/jpeg", "image/png"],
        maxFiles: 1,
        dictDefaultMessage: "",
      },

      fileToUpload: [],
      editable: false,
      showStartDateCalendar: false,
      showEndDateCalendar: false,
      discountType: ["percentage", "amount"],
    };
  },
  computed: {
    ...mapGetters("promotionCode", ["getSelectedPromotionCode"]),
  },
  watch: {
    $route: function () {
      this.checkAccess();
    },
    "promotionForm.is_for_all_specialities": function (val) {
      if (!val && !this.specialities.length) {
        this.fetchSpecialities();
      }
    },
  },

  mounted() {
    this.checkAccess();
  },

  methods: {
    checkAccess() {
      if (this.$route.name.toLowerCase().includes("edit")) {
        if (this.getSelectedPromotionCode && this.getSelectedPromotionCode.id) {
          this.editable = true;
        } else {
          this.navigateTo("Promotion List");
        }
      } else {
        this.editable = false;
      }

      this.fileToUpload = [];
      if (this.$refs.promoImageToUpload) {
        this.$refs.promoImageToUpload.removeAllFiles();
      }
      if (this.editable) {
        this.promotionForm.title = this.getSelectedPromotionCode.title;
        this.promotionForm.title_ar = this.getSelectedPromotionCode.title_ar;
        this.promotionForm.details = this.getSelectedPromotionCode.details;
        this.promotionForm.details_ar =
          this.getSelectedPromotionCode.details_ar;
        this.promotionForm.promo_code =
          this.getSelectedPromotionCode.promo_code;
        this.promotionForm.discount = this.getSelectedPromotionCode.discount;
        this.promotionForm.discount_type =
          this.getSelectedPromotionCode.discount_type;
        this.promotionForm.is_active = this.getSelectedPromotionCode.is_active;
        this.promotionForm.is_show = this.getSelectedPromotionCode.is_show;
        this.promotionForm.is_for_all_packages =
          this.getSelectedPromotionCode.is_for_all_packages;
        this.promotionForm.is_for_all_specialities =
          this.getSelectedPromotionCode.is_for_all_specialities;
        this.promotionForm.is_for_all_users =
          this.getSelectedPromotionCode.is_for_all_users;
        this.promotionForm.is_virtual_appointment_promo =
          this.getSelectedPromotionCode.is_virtual_appointment_promo;
        this.promotionForm.is_onsite_appointment_promo =
          this.getSelectedPromotionCode.is_onsite_appointment_promo;
        this.promotionForm.usage_count_per_user =
          this.getSelectedPromotionCode.usage_count_per_user;
        this.selectedSpecialities =
          this.getSelectedPromotionCode.specialities_ids;
        this.promotionForm.start_date = this.dateFormatter(
          this.getSelectedPromotionCode.start_date,
          "YYYY-MM-DD"
        );
        this.promotionForm.expiry_date = this.dateFormatter(
          this.getSelectedPromotionCode.expiry_date,
          "YYYY-MM-DD"
        );
        this.promotionForm.image_id = this.getSelectedPromotionCode.image_id;
        this.promotionForm.survey_link =
          this.getSelectedPromotionCode.survey_link;
        this.items = [];
        if (this.getSelectedPromotionCode.user_ids)
          this.parseData(this.getSelectedPromotionCode.user_ids, this.items);
        if (this.getSelectedPromotionCode.image) {
          let image = this.getSelectedPromotionCode.image;
          let file = {
            size: +image.size,
            name: image.filename,
            type: image.mimetype,
          };
          this.$refs.promoImageToUpload.manuallyAddFile(
            file,
            this.getImageUrl(this.getSelectedPromotionCode.image)
          );

          this.fileToUpload = [file];
        }
      } else {
        this.promotionForm.title = "";
        this.promotionForm.title_ar = "";
        this.promotionForm.details = "";
        this.promotionForm.details_ar = "";
        this.promotionForm.usage_count_per_user = "";
        this.promotionForm.discount = "";
        this.promotionForm.discount_type = "percentage";
        this.promotionForm.promo_code = "";
        this.promotionForm.start_date = "";
        this.promotionForm.expiry_date = "";
        this.promotionForm.image_id = "";
        this.promotionForm.survey_link = "";
        this.promotionForm.is_active = false;
        this.promotionForm.is_show = false;
        this.promotionForm.is_for_all_packages = false;
        this.promotionForm.is_for_all_specialities = false;
        this.promotionForm.is_for_all_users = false;
        this.promotionForm.is_virtual_appointment_promo = false;
        this.promotionForm.is_onsite_appointment_promo = false;
        this.items = [];
        this.selectedSpecialities = [];
        if (!this.isConfigurable) {
          this.promotionForm.is_active = true;
          this.promotionForm.is_show = true;
          this.promotionForm.is_for_all_packages = true;
          this.promotionForm.is_for_all_specialities = true;
          this.promotionForm.is_for_all_users = true;
          this.promotionForm.is_virtual_appointment_promo = true;
          this.promotionForm.is_onsite_appointment_promo = true;
        }
      }
    },

    removeFile() {
      if (this.fileToUpload.length > 1) {
        this.fileToUpload.splice(0, 1);
      }
    },

    checkFileDimensions(file) {
      if (file.manuallyAdded) return;
      if (file.width != 1920 || file.height != 450) {
        this.failureToast("Upload Image Of Size: 1920x450");
        this.$refs.promoImageToUpload.removeAllFiles();
        this.fileToUpload = [];
        return;
      }
      this.fileUpload(file);
    },

    fileUpload(file) {
      this.fileToUpload.push(file);
      if (this.fileToUpload.length > 1) {
        this.$refs.promoImageToUpload.removeFile(this.fileToUpload[0]);
      }

      authService.uploadId(file).then(
        (res) => {
          if (res.data.status) {
            this.promotionForm.image_id = res.data.data.id;
            this.promotionFormState.image_id =
              this.promotionForm.image_id != "";
            this.successToast(this.$t("insurance.idUploaded"));
          } else {
            this.failureToast(res.data.message);
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

    validateForm() {
      let form = this.promotionForm;
      this.promotionFormState.title = form.title != "";
      this.promotionFormState.title_ar = form.title_ar != "";
      this.promotionFormState.details = form.details != "";
      this.promotionFormState.details_ar = form.details_ar != "";
      this.promotionFormState.start_date = form.start_date != "";
      this.promotionFormState.expiry_date = form.expiry_date != "";
      this.promotionFormState.discount = form.discount != null;
      this.promotionFormState.discount_type = form.discount_type != "";
      this.promotionFormState.promo_code = form.promo_code != "";
      this.promotionFormState.usage_count_per_user =
        form.usage_count_per_user != null;
      this.promotionFormState.image_id = form.image_id != "";
      this.promotionFormState.survey_link = form.survey_link != "";
      this.promotionFormState.is_virtual_appointment_promo =
        form.is_virtual_appointment_promo != false;
      this.promotionFormState.is_onsite_appointment_promo =
        form.is_onsite_appointment_promo != false;
      this.promotionFormState.is_for_all_users = form.is_for_all_users != true;
      this.promotionFormState.is_for_all_specialities =
        form.is_for_all_specialities != true;
      this.promotionFormState.is_for_all_packages =
        form.is_for_all_packages != false;
      this.promotionFormState.is_show = form.is_show != false;
      this.promotionFormState.is_active = form.is_active != false;

      return !Object.values(this.promotionFormState).includes(false);
    },

    parseData(data, ref) {
      data.forEach((x) => {
        ref.push({
          ...x,
          mrn_number: x.mrn_number,
          identity_number: x.saudi_id || x.iqama,
          label: `(${x.mrn_number}) ${x.first_name} ${x.middle_name} ${x.family_name}`,
          label_ar: `(${x.mrn_number}) ${x.first_name_ar} ${x.middle_name_ar} ${x.family_name_ar}`,
        });
      });
    },

    searchUsers(searchQuery) {
      this.searchQuery = searchQuery.trim();
      if (this.searchQuery && this.searchQuery.length > 3) {
        this.fetchUsers();
      } else {
        this.allUsers = [];
      }
    },

    fetchUsers: debounce(function () {
      let query = "?status=verified&role_id=3&page=1&query=" + this.searchQuery;
      this.allUsers = [];
      userService.searchUsers(query).then(
        (response) => {
          if (response.data.status) {
            this.parseData(response.data.data.items, this.allUsers);
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
    }, 500),

    fetchSpecialities() {
      authService.getSpecialities().then(
        (response) => {
          if (response.data.status) {
            this.specialities = response.data.data.items;
          } else {
            this.failureToast(response.data.messsage);
          }
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

    // create-&-update-function
    createUpdatePromotion() {
      this.formSubmitted = true;
      // if (this.validateForm()) {
      //   console.log("create 1 promo", this.validateForm())
      //   return;
      // }
      if (this.promotionForm.is_for_all_users) this.promotionForm.user_ids = [];
      else {
        this.promotionForm.user_ids =
          this.items && this.items.length ? this.items.map((x) => x.id) : [];
      }
      if (this.promotionForm.is_for_all_specialities)
        this.promotionForm.specialities_ids = [];
      else {
        this.promotionForm.specialities_ids =
          this.selectedSpecialities && this.selectedSpecialities.length
            ? this.selectedSpecialities.map((x) => x.id)
            : [];
      }
      if (!this.editable) {
        console.log("data", this.promotionForm);
        promotionCodeService.createPromotions(this.promotionForm).then(
          (response) => {
            if (response.data.status) {
              this.successToast(this.$t("admin.promoGroupAdded"));
              this.navigateTo("Promotion List");
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
      } else {
        promotionCodeService
          .updatePromotions(
            this.getSelectedPromotionCode.id,
            this.promotionForm
          )
          .then(
            (response) => {
              if (response.data.status) {
                this.successToast(this.$t("admin.promoCodeUpdate"));
                this.navigateTo("Promotion List");
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
    },
  },
};
</script>
      
<style lang="scss" scoped>
.add-promotion-container {
  .ash-datepicker {
    display: flex;
    align-items: center;

    :deep {
      .mx-icon-calendar {
        cursor: pointer;

        img {
          width: 2rem;
          height: 2rem;
        }
      }
    }
  }
}

.inputChecker {
  display: inline-flex;
  gap: 1.5rem;
  * {
    cursor: pointer;
  }
}

.checkBoxInput input[type="checkbox"] {
  margin: 4px 0 0;
  line-height: normal;
  width: 20px;
  height: 20px;
}

.inputChecker input[type="checkbox"] {
  line-height: normal;
  width: 20px;
  height: 20px;
}

.inputChecker label {
  font-size: 1rem;
}

.inputCheck {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.inputCheck input {
  padding: 20px;
}

// switcher
.inputSwitch {
  display: flex;
  gap: 1rem;
}

.inputSwitch span {
  font-size: 1rem;
}

.switch {
  position: relative;
  display: inline-block;
  width: 47px;
  height: 25px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #8e8b8b;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: calc(100% - 3px);
  aspect-ratio: 1;
  inset: 1.5px;
  width: 21px;
  left: 1px;
  bottom: 1px;
  background-color: rgb(230, 239, 233);
  margin-block: block;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

input:checked + .slider {
  background-color: #5daf00;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196f3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(24px);
  -ms-transform: translateX(24px);
  transform: translateX(24px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>