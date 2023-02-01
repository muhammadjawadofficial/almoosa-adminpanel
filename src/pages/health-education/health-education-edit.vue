<template>
  <div class="standard-width page-body-container">
    <back-navigation
      :backLink="backRoute"
      :title="$t('healthEducation.title')"
      :showBack="!!backRoute"
    />
    <div class="row mt-3">
      <div class="col-md-6">
        <b-input-group class="custom-login-input-groups">
          <b-form-input
            v-model="healthEducationForm.short_title"
            :state="healthEducationFormState.short_title"
            :placeholder="$t('admin.shortTitle')"
          ></b-form-input>
        </b-input-group>
      </div>
      <div class="col-md-6">
        <b-input-group class="custom-login-input-groups">
          <b-form-input
            v-model="healthEducationForm.long_title"
            :state="healthEducationFormState.long_title"
            :placeholder="$t('admin.longTitle')"
          ></b-form-input>
        </b-input-group>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <b-input-group class="custom-login-input-groups">
          <b-form-input
            v-model="healthEducationForm.short_text"
            :state="healthEducationFormState.short_text"
            :placeholder="$t('admin.shortText')"
          ></b-form-input>
        </b-input-group>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <b-input-group
          class="custom-login-input-groups"
          style="flex-direction: column"
        >
          <b-form-input
            disabled
            :placeholder="$t('admin.longText')"
            class="w-100"
            :state="healthEducationFormState.long_text"
          ></b-form-input>
          <rich-text-editor v-model="healthEducationForm.long_text" />
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
                ? !healthEducationFormState.thumbnail_id
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
                ? !healthEducationFormState.banner_id
                : null,
            }"
          ></div>
        </div>
      </div>
    </div>
    <div class="row mt-5">
      <div class="register-navigation col-md-12">
        <div class="button-group">
          <button class="btn btn-primary" @click="createUpdateArticle">
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
        banner_id: "",
        thumbnail_id: "",
      },
      healthEducationFormState: {
        short_title: null,
        long_title: null,
        short_text: null,
        long_text: null,
        banner_id: null,
        thumbnail_id: null,
      },
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
    ...mapGetters("user", ["getUserInfo"]),
  },
  components: {
    RichTextEditor,
  },
  watch: {
    $route: function (val) {
      if (val.name.toLowerCase().includes("create")) {
        this.backRoute = null;
      }
    },
  },
  mounted() {
    if (this.$route.name.toLowerCase().includes("create")) {
      this.backRoute = null;
    }
  },
  methods: {
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

      this.setLoadingState(true);
      authService.uploadId(file).then(
        (res) => {
          if (res.data.status) {
            this.healthEducationForm[type + "_id"] = res.data.data.id;
            this.healthEducationFormState[type + "_id"] =
              this.healthEducationForm[type + "_id"] != null;
            this.successToast(this.$t("insurance.idUploaded"));
          } else {
            this.failureToast(res.data.message);
          }
          this.setLoadingState(false);
        },
        (error) => {
          if (!this.isAPIAborted(error))
            this.failureToast(
              error.response.data && error.response.data.message
            );
          this.setLoadingState(false);
        }
      );
    },
    validateForm() {
      let form = this.healthEducationForm;
      this.healthEducationFormState.short_title = form.short_title != "";
      this.healthEducationFormState.long_title = form.long_title != "";
      this.healthEducationFormState.short_text = form.short_text != "";
      this.healthEducationFormState.long_text = form.long_text != "";
      this.healthEducationFormState.banner_id = form.banner_id != "";
      this.healthEducationFormState.thumbnail_id = form.thumbnail_id != "";

      return !Object.values(this.healthEducationFormState).includes(false);
    },
    createUpdateArticle() {
      this.formSubmitted = true;
      if (!this.validateForm()) {
        return;
      }
      this.setLoadingState(true);
      let healthEducationArticle = {
        ...this.healthEducationForm,
      };
      healthEducationService
        .addHealthEducationArticle(healthEducationArticle)
        .then(
          (response) => {
            if (response.data.status) {
              this.resetForm();
              this.successToast(this.$t("insurance.insuranceAdded"));
            } else {
              this.failureToast(response.data.message);
            }
            this.setLoadingState(false);
          },
          (error) => {
            if (!this.isAPIAborted(error))
              this.failureToast(
                error.response.data && error.response.data.message
              );
            this.setLoadingState(false);
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
        banner_id: "",
        thumbnail_id: "",
      };
      this.healthEducationFormState = {
        short_title: null,
        long_title: null,
        short_text: null,
        long_text: null,
        banner_id: null,
        thumbnail_id: null,
      };
      this.thumbnailToUpload = [];
      this.bannerToUpload = [];
      this.$refs.thumbnailFileUpload.removeAllFiles();
      this.$refs.bannerFileUpload.removeAllFiles();
    },
  },
};
</script>

<style>
</style>