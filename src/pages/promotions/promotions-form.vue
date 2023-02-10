<template>
  <div class="add-promotion-container standard-width page-body-container">
    <back-navigation
      :title="editable ? $t('admin.editPromotion') : $t('admin.addPromotion')"
      :showBack="false"
    />
    <div class="row mt-3">
      <div class="col-md-6">
        <b-input-group class="custom-login-input-groups">
          <b-form-input
            v-model="promotionForm.title"
            :state="promotionFormState.title"
            :placeholder="$t('admin.title')"
          ></b-form-input>
        </b-input-group>
      </div>
      <div class="col-md-3">
        <b-input-group class="custom-login-input-groups">
          <b-form-input
            type="text"
            v-model="promotionForm.discount_percent"
            :state="promotionFormState.discount_percent"
            :placeholder="$t('admin.discountPercent')"
          ></b-form-input>
        </b-input-group>
      </div>
      <div class="col-md-3">
        <b-input-group class="custom-login-input-groups">
          <b-form-input
            type="text"
            v-model="promotionForm.overall_limit"
            :state="promotionFormState.overall_limit"
            :placeholder="$t('admin.usageLimit')"
          ></b-form-input>
        </b-input-group>
      </div>
      <div class="col-md-3">
        <b-input-group class="custom-login-input-groups">
          <multiselect
            v-model="selectedPromotion"
            :options="promoGroups"
            :placeholder="$t('admin.promoGroup')"
            track-by="id"
            label="title"
          ></multiselect>
          <div
            class="custom-state-invalid icon"
            :class="{
              'is-invalid': promotionFormState.promo_group_id == false,
            }"
          ></div>
        </b-input-group>
      </div>
      <div class="col-md-3">
        <b-input-group class="custom-login-input-groups">
          <b-form-input
            type="text"
            v-model="promotionForm.promo_code"
            :state="promotionFormState.promo_code"
            :placeholder="$t('admin.promoCode')"
          ></b-form-input>
        </b-input-group>
      </div>
      <div class="col-md-3">
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
      <div class="col-md-3">
        <b-input-group class="custom-login-input-groups">
          <b-form-input
            type="text"
            :value="promotionForm.end_date"
            :state="promotionFormState.details"
            :placeholder="$t('admin.endDate')"
            @click.stop="showEndDateCalendar = !showEndDateCalendar"
            readonly
          ></b-form-input>
          <date-picker
            :append-to-body="false"
            v-model="promotionForm.end_date"
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
      <div class="col-md-12">
        <b-input-group class="custom-login-input-groups">
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
            ref="fileUpload"
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
import { authService, promotionService } from "../../services";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      showUpload: true,
      selectedPromotion: null,
      promotionForm: {
        title: "",
        discount_percent: "",
        overall_limit: "",
        promo_group_id: "",
        promo_code: "",
        start_date: "",
        end_date: "",
        details: "",
        image_id: "",
        survey_link: "",
      },
      promotionFormState: {
        title: null,
        discount_percent: null,
        overall_limit: null,
        promo_group_id: null,
        promo_code: null,
        start_date: null,
        end_date: null,
        details: null,
        image_id: null,
        survey_link: null,
      },
      formSubmitted: false,
      validationdropzoneOptions: {
        url: "http://localhost:8080",
        acceptedFiles: ["image/jpeg", "image/png"],
        maxFiles: 1,
        dictDefaultMessage: "",
      },
      fileToUpload: [],
      editable: false,
      showStartDateCalendar: false,
      showEndDateCalendar: false,
      promoGroups: [],
    };
  },
  computed: {
    ...mapGetters("promotion", ["getSelectedPromotion"]),
  },
  watch: {
    $route: function () {
      this.checkAccess();
    },
  },
  mounted() {
    this.checkAccess();
    this.checkDropdownValues();
  },
  methods: {
    checkAccess() {
      if (this.$route.name.toLowerCase().includes("edit")) {
        if (this.getSelectedPromotion && this.getSelectedPromotion.id) {
          this.editable = true;
        } else {
          this.navigateTo("Promotions List");
        }
      } else {
        this.editable = false;
      }

      this.$refs.fileUpload.removeAllFiles();
      this.fileToUpload = [];

      if (this.editable) {
        this.promotionForm.title = this.getSelectedPromotion.title;
        this.promotionForm.discount_percent =
          this.getSelectedPromotion.discount_percent;
        this.promotionForm.overall_limit =
          this.getSelectedPromotion.overall_limit;
        this.promotionForm.promo_group_id =
          this.getSelectedPromotion.promo_group_id;
        this.selectedPromotion = this.getSelectedPromotion.promo_group;
        this.promotionForm.promo_code = this.getSelectedPromotion.promo_code;
        this.promotionForm.start_date = this.dateFormatter(
          this.getSelectedPromotion.start_date,
          "YYYY-MM-DD"
        );
        this.promotionForm.end_date = this.dateFormatter(
          this.getSelectedPromotion.end_date,
          "YYYY-MM-DD"
        );
        this.promotionForm.details = this.getSelectedPromotion.details;
        this.promotionForm.image_id = this.getSelectedPromotion.image_id;
        this.promotionForm.survey_link = this.getSelectedPromotion.survey_link;
        if (this.getSelectedPromotion.image) {
          let image = this.getSelectedPromotion.image;
          let file = {
            size: +image.size,
            name: image.filename,
            type: image.mimetype,
          };
          this.$refs.fileUpload.manuallyAddFile(
            file,
            this.getImageUrl(this.getSelectedPromotion.image)
          );

          this.fileToUpload = [file];
        }
      } else {
        this.promotionForm.title = "";
        this.promotionForm.discount_percent = "";
        this.promotionForm.overall_limit = "";
        this.selectedPromotion = null;
        this.promotionForm.promo_group_id = "";
        this.promotionForm.promo_code = "";
        this.promotionForm.start_date = "";
        this.promotionForm.end_date = "";
        this.promotionForm.details = "";
        this.promotionForm.image_id = "";
        this.promotionForm.survey_link = "";
      }
    },
    checkDropdownValues() {
      this.setLoadingState(true);
      promotionService.fetchAllPromoGroups().then(
        (res) => {
          if (res.data.status) {
            this.promoGroups = res.data.data.items;
          } else {
            this.failureToast(res.data.message);
          }
          this.setLoadingState(false);
        },
        (error) => {
          if (!this.isAPIAborted(error))
            this.failureToast(
              error.response &&
                error.response.data &&
                error.response.data.message
            );
          this.setLoadingState(false);
        }
      );
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
        this.$refs.fileUpload.removeAllFiles();
        this.fileToUpload = [];
        return;
      }
      this.fileUpload(file);
    },
    fileUpload(file) {
      this.fileToUpload.push(file);
      if (this.fileToUpload.length > 1) {
        this.$refs.fileUpload.removeFile(this.fileToUpload[0]);
      }

      this.setLoadingState(true);
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
          this.setLoadingState(false);
        },
        (error) => {
          if (!this.isAPIAborted(error))
            this.failureToast(
              error.response &&
                error.response.data &&
                error.response.data.message
            );
          this.setLoadingState(false);
        }
      );
    },
    validateForm() {
      let form = this.promotionForm;
      this.promotionFormState.title = form.title != "";
      this.promotionFormState.discount_percent =
        form.discount_percent != "" && +form.discount_percent > 0;
      this.promotionFormState.overall_limit =
        form.overall_limit != "" && +form.overall_limit > 0;
      this.promotionFormState.promo_group_id =
        !!this.selectedPromotion && !!this.selectedPromotion.id;
      this.promotionFormState.promo_code = form.promo_code != "";
      this.promotionFormState.start_date = form.start_date != "";
      this.promotionFormState.end_date = form.end_date != "";
      this.promotionFormState.details = form.details != "";
      this.promotionFormState.image_id = form.image_id != "";
      this.promotionFormState.survey_link = form.survey_link != "";
      return !Object.values(this.promotionFormState).includes(false);
    },
    createUpdatePromotion() {
      this.formSubmitted = true;
      this.promotionForm.promo_group_id =
        this.selectedPromotion && this.selectedPromotion.id;
      if (!this.validateForm()) {
        return;
      }
      this.setLoadingState(true);
      if (!this.editable) {
        promotionService.createPromotion(this.promotionForm).then(
          (response) => {
            if (response.data.status) {
              this.successToast(this.$t("admin.promoGroupAdded"));
              this.navigateTo("Promotions List");
            } else {
              this.failureToast(response.data.message);
            }
            this.setLoadingState(false);
          },
          (error) => {
            if (!this.isAPIAborted(error))
              this.failureToast(
                error.response &&
                  error.response.data &&
                  error.response.data.message
              );
            this.setLoadingState(false);
          }
        );
      } else {
        promotionService
          .updatePromotion(this.getSelectedPromotion.id, this.promotionForm)
          .then(
            (response) => {
              if (response.data.status) {
                this.successToast(this.$t("admin.promoGroupUpdated"));
                this.navigateTo("Promotions List");
              } else {
                this.failureToast(response.data.message);
              }
              this.setLoadingState(false);
            },
            (error) => {
              if (!this.isAPIAborted(error))
                this.failureToast(
                  error.response &&
                    error.response.data &&
                    error.response.data.message
                );
              this.setLoadingState(false);
            }
          );
      }
    },
    itemSelected(item) {
      this.selectedItem = item;
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
</style>