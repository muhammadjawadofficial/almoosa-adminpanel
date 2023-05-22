<template>
  <div
    class="appointment-detail-container medication-detail-container page-body-container standard-width"
  >
    <back-navigation
      :backLink="backRoute"
      :title="
        $t('admin.' + (selectedBannerId ? 'bannerDetails' : 'createBanner'))
      "
      :showBack="!!selectedBannerId"
    />
    <div class="row">
      <div class="col-sm-12">
        <b-card header-tag="div" no-body class="ash-card card-rounded">
          <b-card-body class="mt-0">
            <div class="row">
              <div class="col-md-6">
                <b-input-group class="custom-login-input-groups forceLtr">
                  <b-form-textarea
                    v-model="text"
                    :state="textState"
                    :placeholder="$t('admin.text') + ' ' + $t('admin.english')"
                    no-resize
                    rows="3"
                    max-rows="3"
                  ></b-form-textarea>
                </b-input-group>
              </div>
              <div class="col-md-6">
                <b-input-group class="custom-login-input-groups forceRtl">
                  <b-form-textarea
                    v-model="textAr"
                    :state="textArState"
                    :placeholder="$t('admin.text') + ' ' + $t('admin.arabic')"
                    no-resize
                    rows="3"
                    max-rows="3"
                  ></b-form-textarea>
                </b-input-group>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <div class="custom-login-input-groups same-height">
                  <multiselect
                    v-model="type"
                    :options="typeOptions"
                    :preselectFirst="true"
                    :placeholder="$t('admin.selectTypeOfBanner')"
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
                      'is-invalid': typeState == false,
                    }"
                  ></div>
                </div>
              </div>
            </div>
            <div class="appointment-detail">
              <div class="row">
                <div class="col-sm-6">
                  <div class="custom-login-input-groups file-upload-container">
                    <div class="upload-text" v-if="imageToUpload.length">
                      {{ $t("insurance.clickToUpload") }}
                    </div>
                    <div class="upload-text text-muted w200 center" v-else>
                      {{ $t("admin.uploadBannerImage") }}
                    </div>
                    <vue-dropzone
                      v-if="showUpload"
                      @vdropzone-file-added="fileUpload($event)"
                      @vdropzone-removed-file="removeFile()"
                      :options="validationdropzoneOptions"
                      ref="imageFileUpload"
                      id="imageId"
                      class="dropzone digits custom-file-upload"
                    >
                    </vue-dropzone>
                    <div
                      :class="{
                        'dropzone is-invalid': imageIdState == false,
                      }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </b-card-body>
        </b-card>
        <div class="appointment--action-buttons">
          <button
            class="btn btn-secondary"
            @click="createBanner()"
            v-if="!selectedBannerId"
          >
            {{ $t("admin.create") }}
          </button>
          <button class="btn btn-secondary" @click="updateBanner()" v-else>
            {{ $t("admin.update") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { authService, bannerManagementService } from "../../services";
export default {
  data() {
    return {
      originalBackRoute: "Banner Management List",
      backRoute: "Banner Management List",
      validationdropzoneOptions: {
        url: "http://localhost:8080",
        thumbnailWidth: 150,
        acceptedFiles: ["image/jpeg", "image/png"],
        maxFiles: 1,
        dictDefaultMessage: "",
      },
      showUpload: true,
      formSubmitted: false,
      imageToUpload: [],
      selectedBannerId: null,
      text: "",
      textAr: "",
      imageId: "",
      type: "",
      textState: null,
      textArState: null,
      imageIdState: null,
      typeState: null,
      typeOptions: ["PROMOTIONAL", "MAIN"],
    };
  },
  computed: {
    ...mapGetters("bannerManagement", ["getSelectedBanner"]),
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
      if (this.$route.name.toLowerCase().includes("details")) {
        if (!this.getSelectedBanner) {
          this.navigateTo(this.backRoute);
          return;
        }
        this.initializeData();
      } else {
        this.backRoute = null;
        this.resetValues();
      }
    },
    resetValues() {
      this.selectedBannerId = null;
      this.text = "";
      this.textAr = "";
      this.imageId = "";
      this.type = "";
      this.textState = null;
      this.textArState = null;
      this.imageIdState = null;
      this.typeState = null;

      this.imageToUpload = [];
      this.$refs.imageFileUpload.removeAllFiles();
    },
    initializeData() {
      let image = this.getSelectedBanner.image;
      if (image) {
        this.imageId = this.getSelectedBanner.image.id;
        let file = {
          size: +image.size,
          name: image.filename,
          type: image.mimetype,
        };
        this.$refs.imageFileUpload.manuallyAddFile(
          file,
          this.getImageUrl(image)
        );
        this.imageToUpload = [file];
      }
      this.text = this.getSelectedBanner.text;
      this.textAr = this.getSelectedBanner.text_ar;
      this.type = this.getSelectedBanner.type;
      this.selectedBannerId = this.getSelectedBanner.id;
    },
    removeFile() {
      if (this.imageToUpload.length > 1) {
        this.imageToUpload.splice(0, 1);
      }
    },
    fileUpload(file) {
      this.imageToUpload.push(file);
      if (this.imageToUpload.length > 1) {
        this.$refs.imageFileUpload.removeFile(this.imageToUpload[0]);
      }

      if (file.manuallyAdded) {
        return;
      }

      authService.uploadId(file).then(
        (res) => {
          if (res.data.status) {
            this.imageId = res.data.data.id;
            this.successToast(this.$t("admin.bannerUploaded"));
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
      this.textState = this.text != "";
      this.textArState = this.textAr != "";
      this.imageIdState = this.imageId != "";
      this.typeState = this.type != "";

      return (
        this.textState &&
        this.textArState &&
        this.imageIdState &&
        this.typeState
      );
    },
    updateBanner() {
      if (!this.validateForm()) return;
      let payload = {
        text: this.text,
        text_ar: this.textAr,
        type: this.type,
        image_id: this.imageId,
      };
      bannerManagementService
        .updateBanner(this.getSelectedBanner.id, payload)
        .then(
          (response) => {
            if (response.data.status) {
              this.successToast(this.$t("admin.bannerUpdatedSuccess"));
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
    createBanner() {
      if (!this.validateForm()) return;
      let payload = {
        text: this.text,
        text_ar: this.textAr,
        type: this.type,
        image_id: this.imageId,
      };
      bannerManagementService.createBanner(payload).then(
        (response) => {
          if (response.data.status) {
            this.successToast(this.$t("admin.bannerCreatedSuccess"));
            this.resetValues();
            this.navigateTo(this.originalBackRoute);
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
  },
};
</script>

<style lang="scss" scoped>
.appointment-detail--value--details {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.appointment-detail {
  &--label {
    font-size: 1.25rem;
    color: black;
  }
  &--value {
    color: #8696b8;
  }
}
.header-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  @media (max-width: 700px) {
    &--button {
      width: 100%;
      text-align: end;
    }
  }
  @media (max-width: 325px) {
    justify-content: center;
    &--button {
      text-align: center;
    }
  }
  &--info {
    display: flex;
    align-items: center;
    gap: 1rem;
    @media (max-width: 325px) {
      flex-direction: column;
    }
    :deep {
      .svg-icon-fill {
        fill: var(--theme-default);
      }
      .svg-icon-fill-bg {
        fill: #fbfaf7;
      }
    }
    .icon {
      width: 109px;
      height: 109px;
      svg {
        width: 100%;
        height: 100%;
        aspect-ratio: 1;
      }
    }
    .title {
      font-size: 1.813rem;
    }
    .subTitle {
      font-size: 1rem;
      color: #8696b8;
    }
  }
}
.speciality-id {
  max-width: 400px;
}
.custom-login-input-groups {
  .multiselect {
    font-size: 1.25rem;
  }

  &.select-box {
    width: 35%;
    min-width: 200px;
  }
}
</style>