<template>
  <div class="standard-width page-body-container">
    <back-navigation
      :backLink="backRoute"
      :title="$t('healthEducation.title')"
      :showBack="!!backRoute"
    />
    <div class="row mt-3">
      <div class="col-md-6">
        <b-input-group class="custom-login-input-groups forceLtr">
          <b-form-input
            v-model="healthEducationForm.short_title"
            :state="healthEducationFormState.short_title"
            :placeholder="$t('admin.shortTitle') + ' ' + $t('admin.english')"
          ></b-form-input>
        </b-input-group>
      </div>
      <div class="col-md-6">
        <b-input-group class="custom-login-input-groups forceLtr">
          <b-form-input
            v-model="healthEducationForm.long_title"
            :state="healthEducationFormState.long_title"
            :placeholder="$t('admin.longTitle') + ' ' + $t('admin.english')"
          ></b-form-input>
        </b-input-group>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <b-input-group class="custom-login-input-groups forceLtr">
          <b-form-input
            v-model="healthEducationForm.short_text"
            :state="healthEducationFormState.short_text"
            :placeholder="$t('admin.shortText') + ' ' + $t('admin.english')"
          ></b-form-input>
        </b-input-group>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <b-input-group
          class="custom-login-input-groups forceLtr"
          style="flex-direction: column"
        >
          <b-form-input
            disabled
            :placeholder="$t('admin.longText') + ' ' + $t('admin.english')"
            class="w-100"
            :state="healthEducationFormState.long_text"
          ></b-form-input>
          <rich-text-editor v-model="healthEducationForm.long_text" />
        </b-input-group>
      </div>
    </div>
    <div class="row mt-3">
      <div class="col-md-6">
        <b-input-group class="custom-login-input-groups forceRtl">
          <b-form-input
            v-model="healthEducationForm.short_title_ar"
            :state="healthEducationFormState.short_title_ar"
            :placeholder="$t('admin.shortTitle') + ' ' + $t('admin.arabic')"
          ></b-form-input>
        </b-input-group>
      </div>
      <div class="col-md-6">
        <b-input-group class="custom-login-input-groups forceRtl">
          <b-form-input
            v-model="healthEducationForm.long_title_ar"
            :state="healthEducationFormState.long_title_ar"
            :placeholder="$t('admin.longTitle') + ' ' + $t('admin.arabic')"
          ></b-form-input>
        </b-input-group>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <b-input-group class="custom-login-input-groups forceRtl">
          <b-form-input
            v-model="healthEducationForm.short_text_ar"
            :state="healthEducationFormState.short_text_ar"
            :placeholder="$t('admin.shortText') + ' ' + $t('admin.arabic')"
          ></b-form-input>
        </b-input-group>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <b-input-group
          class="custom-login-input-groups forceRtl"
          style="flex-direction: column"
        >
          <b-form-input
            disabled
            :placeholder="$t('admin.longText') + ' ' + $t('admin.arabic')"
            class="w-100"
            :state="healthEducationFormState.long_text_ar"
          ></b-form-input>
          <rich-text-editor v-model="healthEducationForm.long_text_ar" />
        </b-input-group>
      </div>
    </div>
    <div class="row">
      <div class="col-md-6">
        <div class="custom-login-input-groups file-upload-container">
          <div class="upload-text" v-if="thumbnailToUpload.length">
            {{ $t("insurance.clickToUpload") }}
          </div>
          <div class="upload-text text-muted w200 center" v-else>
            {{ $t("admin.uploadThumbnail") }}
          </div>
          <vue-dropzone
            v-if="showUpload"
            @vdropzone-file-added="fileUpload($event, 'thumbnail')"
            @vdropzone-removed-file="removeFile('thumbnail')"
            :options="validationdropzoneOptions"
            ref="thumbnailFileUpload"
            id="validationdropzone"
            class="dropzone digits custom-file-upload"
          >
          </vue-dropzone>
          <div
            :class="{
              'dropzone is-invalid': formSubmitted
                ? healthEducationFormState.thumbnail_id == false
                : null,
            }"
          ></div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="custom-login-input-groups file-upload-container">
          <div class="upload-text" v-if="bannerToUpload.length">
            {{ $t("insurance.clickToUpload") }}
          </div>
          <div class="upload-text text-muted w200 center" v-else>
            {{ $t("admin.uploadBanner") }}
          </div>
          <vue-dropzone
            v-if="showUpload"
            @vdropzone-file-added="fileUpload($event, 'banner')"
            @vdropzone-removed-file="removeFile('banner')"
            :options="validationdropzoneOptions"
            ref="bannerFileUpload"
            id="thumbnailId"
            class="dropzone digits custom-file-upload"
          >
          </vue-dropzone>
          <div
            :class="{
              'dropzone is-invalid': formSubmitted
                ? healthEducationFormState.banner_id == false
                : null,
            }"
          ></div>
        </div>
      </div>
    </div>
    <div class="row mt-5">
      <div class="register-navigation col-md-12">
        <div class="button-group">
          <button
            class="btn btn-primary"
            @click="updateArticle"
            v-if="healthEducationId"
          >
            {{ $t("admin.update") }}
          </button>
          <button class="btn btn-primary" @click="createArticle" v-else>
            {{ $t("admin.create") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RichTextEditor from "@/components/rich-text-editor";
import { mapGetters } from "vuex";
import { authService, healthEducationService } from "../../services";
export default {
  data() {
    return {
      backRoute: "Health Education List",
      showUpload: true,
      formSubmitted: false,
      thumbnailToUpload: [],
      bannerToUpload: [],
      healthEducationForm: {
        short_title: "",
        long_title: "",
        short_text: "",
        long_text: "",
        short_title_ar: "",
        long_title_ar: "",
        short_text_ar: "",
        long_text_ar: "",
        banner_id: "",
        thumbnail_id: "",
      },
      healthEducationFormState: {
        short_title: null,
        long_title: null,
        short_text: null,
        long_text: null,
        short_title_ar: null,
        long_title_ar: null,
        short_text_ar: null,
        long_text_ar: null,
        banner_id: null,
        thumbnail_id: null,
      },
      healthEducationId: null,
      validationdropzoneOptions: {
        url: "http://localhost:8080",
        thumbnailWidth: 150,
        acceptedFiles: ["image/jpeg", "image/png"],
        maxFiles: 1,
        dictDefaultMessage: "",
      },
    };
  },
  computed: {
    ...mapGetters("healthEducation", ["getSelectedHealthEducation"]),
  },
  components: {
    RichTextEditor,
  },
  watch: {
    $route: function (val) {
      if (val.name.toLowerCase().includes("create")) {
        this.backRoute = null;
        this.resetForm();
      }
    },
  },
  mounted() {
    if (this.$route.name.toLowerCase().includes("edit")) {
      if (!this.getSelectedHealthEducation) {
        this.navigateTo("Health Education List");
        return;
      }
      this.initializeData();
    }
    if (this.$route.name.toLowerCase().includes("create")) {
      this.backRoute = null;
    }
  },
  methods: {
    initializeData() {
      healthEducationService
        .fetchHealthEducationsDetails(this.getSelectedHealthEducation.id)
        .then(
          (response) => {
            if (response.data.status) {
              let data = response.data.data;
              this.healthEducationId = data.id;
              this.healthEducationForm.short_title = data.short_title;
              this.healthEducationForm.long_title = data.long_title;
              this.healthEducationForm.short_text = data.short_text;
              this.healthEducationForm.long_text = data.long_text;
              this.healthEducationForm.short_title_ar = data.short_title_ar;
              this.healthEducationForm.long_title_ar = data.long_title_ar;
              this.healthEducationForm.short_text_ar = data.short_text_ar;
              this.healthEducationForm.long_text_ar = data.long_text_ar;
              let thumbnail =
                data.thumbnail || this.getSelectedHealthEducation.thumbnail;
              if (thumbnail) {
                this.healthEducationForm.thumbnail_id = data.thumbnail_id;
                let image = thumbnail;
                let file = {
                  size: +image.size,
                  name: image.filename,
                  type: image.mimetype,
                };
                this.$refs.thumbnailFileUpload.manuallyAddFile(
                  file,
                  this.getImageUrl(thumbnail)
                );
                this.thumbnailToUpload = [file];
              }
              let banner =
                data.banner || this.getSelectedHealthEducation.banner;
              if (banner) {
                this.healthEducationForm.banner_id = data.banner_id;
                let image = banner;
                let file = {
                  size: +image.size,
                  name: image.filename,
                  type: image.mimetype,
                };
                this.$refs.bannerFileUpload.manuallyAddFile(
                  file,
                  this.getImageUrl(banner)
                );
                this.bannerToUpload = [file];
              }
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
    removeFile(type) {
      if (type == "thumbnail") {
        if (this.thumbnailToUpload.length > 1) {
          this.thumbnailToUpload.splice(0, 1);
        }
      } else {
        if (this.bannerToUpload.length > 1) {
          this.bannerToUpload.splice(0, 1);
        }
      }
    },
    fileUpload(file, type) {
      if (type == "thumbnail") {
        this.thumbnailToUpload.push(file);
        if (this.thumbnailToUpload.length > 1) {
          this.$refs.thumbnailFileUpload.removeFile(this.thumbnailToUpload[0]);
        }
      } else {
        this.bannerToUpload.push(file);
        if (this.bannerToUpload.length > 1) {
          this.$refs.bannerFileUpload.removeFile(this.bannerToUpload[0]);
        }
      }

      if (file.manuallyAdded) {
        return;
      }

      authService.uploadId(file).then(
        (res) => {
          if (res.data.status) {
            this.healthEducationForm[type + "_id"] = res.data.data.id;
            this.healthEducationFormState[type + "_id"] =
              this.healthEducationForm[type + "_id"] != null;
            this.successToast(this.$t("admin." + type + "Uploaded"));
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
      let form = this.healthEducationForm;
      this.healthEducationFormState.short_title = form.short_title != "";
      this.healthEducationFormState.long_title = form.long_title != "";
      this.healthEducationFormState.short_text = form.short_text != "";
      this.healthEducationFormState.long_text = form.long_text != "";
      this.healthEducationFormState.short_title_ar = form.short_title_ar != "";
      this.healthEducationFormState.long_title_ar = form.long_title_ar != "";
      this.healthEducationFormState.short_text_ar = form.short_text_ar != "";
      this.healthEducationFormState.long_text_ar = form.long_text_ar != "";
      this.healthEducationFormState.banner_id = form.banner_id != "";
      this.healthEducationFormState.thumbnail_id = form.thumbnail_id != "";

      return !Object.values(this.healthEducationFormState).includes(false);
    },
    createArticle() {
      this.formSubmitted = true;
      if (!this.validateForm()) {
        return;
      }
      let healthEducationArticle = {
        ...this.healthEducationForm,
      };
      healthEducationService
        .addHealthEducationArticle(healthEducationArticle)
        .then(
          (response) => {
            if (response.data.status) {
              this.resetForm();
              this.successToast(this.$t("admin.articleAddedSuccess"));
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
    updateArticle() {
      this.formSubmitted = true;
      if (!this.validateForm()) {
        return;
      }
      let healthEducationArticle = {
        ...this.healthEducationForm,
      };
      healthEducationService
        .updateHealthEducationArticle(
          this.healthEducationId,
          healthEducationArticle
        )
        .then(
          (response) => {
            if (response.data.status) {
              this.successToast(this.$t("admin.articleUpdatedSuccess"));
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
      this.healthEducationForm = {
        short_title: "",
        long_title: "",
        short_text: "",
        long_text: "",
        short_title_ar: "",
        long_title_ar: "",
        short_text_ar: "",
        long_text_ar: "",
        banner_id: "",
        thumbnail_id: "",
      };
      this.healthEducationFormState = {
        short_title: null,
        long_title: null,
        short_text: null,
        long_text: null,
        short_title_ar: null,
        long_title_ar: null,
        short_text_ar: null,
        long_text_ar: null,
        banner_id: null,
        thumbnail_id: null,
      };
      this.thumbnailToUpload = [];
      this.bannerToUpload = [];
      this.$refs.thumbnailFileUpload.removeAllFiles();
      this.$refs.bannerFileUpload.removeAllFiles();
      this.healthEducationId = null;
    },
  },
};
</script>

<style></style>