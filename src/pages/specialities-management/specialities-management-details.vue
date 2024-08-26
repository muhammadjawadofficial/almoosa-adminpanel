<template>
  <div
    class="appointment-detail-container medication-detail-container page-body-container standard-width"
    v-if="getSelectedSpecialitiesManagement"
  >
    <back-navigation
      :backLink="backRoute"
      :title="$t('admin.specialityDetails')"
    />
    <div class="row">
      <div class="col-sm-12">
        <b-card header-tag="div" no-body class="ash-card card-rounded">
          <b-card-body class="mt-0">
            <div class="appointment-detail">
              <div class="appointment-detail--type">
                <div class="appointment-detail--label">
                  {{ $t("admin.title") }}
                </div>
                <div class="appointment-detail--value">
                  {{ getSelectedSpecialitiesManagement[getLocaleKey("title")] }}
                </div>
              </div>
            </div>
            <div class="appointment-detail">
              <div class="appointment-detail--type">
                <div class="appointment-detail--label">
                  {{ $t("admin.parentSpeciality") }}
                </div>
                <div class="appointment-detail--value">
                  {{
                    getSelectedSpecialitiesManagement.parentSpeciality
                      ? getSelectedSpecialitiesManagement.parentSpeciality[
                          getLocaleKey("title")
                        ]
                      : "N/A"
                  }}
                  <span
                    class="mx-3 font-secondary pointer"
                    v-if="getSelectedSpecialitiesManagement.parentSpeciality"
                    @click="removeParent"
                  >
                    {{ $t("admin.removeParent") }}
                    <i class="fa fa-times danger" />
                  </span>
                </div>
              </div>
            </div>
            <div class="appointment-detail mt-5">
              <div class="row">
                <div class="col-sm-6">
                  <div class="custom-login-input-groups file-upload-container">
                    <div class="upload-text" v-if="iconToUpload.length">
                      {{ $t("insurance.clickToUpload") }}
                    </div>
                    <div class="upload-text text-muted w200 center" v-else>
                      {{ $t("admin.uploadIcon") }}
                    </div>
                    <vue-dropzone
                      v-if="showUpload"
                      @vdropzone-file-added="fileUpload($event)"
                      @vdropzone-removed-file="removeFile()"
                      :options="validationdropzoneOptions"
                      ref="iconFileUpload"
                      id="iconId"
                      class="dropzone digits custom-file-upload"
                    >
                    </vue-dropzone>
                    <div
                      :class="{
                        'dropzone is-invalid': formSubmitted ? !iconId : null,
                      }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            <div class="appointment-detail mt-5" v-if="items.length">
              <div class="row">
                <div class="col-sm-12">
                  <div class="custom-login-input-groups">
                    <label>{{ $t("admin.childSpecialities") }}</label>
                    <multiselect
                      v-model="selectedSubSpecialities"
                      :options="items"
                      :placeholder="$t('admin.selectSpecialities')"
                      :close-on-select="false"
                      multiple
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
                  </div>
                </div>
              </div>
            </div>
          </b-card-body>
        </b-card>
        <div class="appointment--action-buttons">
          <button class="btn btn-secondary" @click="updateSpeciality()">
            {{ $t("admin.update") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { authService, specialityService } from "../../services";
export default {
  data() {
    return {
      backRoute: "Specialities Management List",
      iconId: "",
      validationdropzoneOptions: {
        url: "http://localhost:8080",
        thumbnailWidth: 150,
        acceptedFiles: ["image/jpeg", "image/png"],
        maxFiles: 1,
        dictDefaultMessage: "",
      },
      showUpload: true,
      formSubmitted: false,
      iconToUpload: [],
      items: [],
      selectedSubSpecialities: [],
    };
  },
  computed: {
    ...mapGetters("specialitiesManagement", [
      "getSelectedSpecialitiesManagement",
    ]),
  },
  mounted() {
    if (!this.getSelectedSpecialitiesManagement) {
      this.navigateTo(this.backRoute);
      return;
    }
    this.initalizeData();
  },
  methods: {
    initalizeData() {
      this.selectedSubSpecialities =
        this.getSelectedSpecialitiesManagement.childSpecialities;
      this.fetchSpecialities();
      let icon = this.getSelectedSpecialitiesManagement.icon;
      if (icon) {
        this.iconId = this.getSelectedSpecialitiesManagement.icon.id;
        let image = icon;
        let file = {
          size: +image.size,
          name: image.filename,
          type: image.mimetype,
        };
        this.$refs.iconFileUpload.manuallyAddFile(file, this.getImageUrl(icon));
        this.iconToUpload = [file];
      }
    },
    fetchSpecialities() {
      authService.getSpecialitiesV1().then(
        (response) => {
          if (response.data.status) {
            this.items = response.data.data.items;
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
    removeParent() {
      specialityService
        .assignParent(this.getSelectedSpecialitiesManagement.id, {})
        .then(
          (response) => {
            if (response.data.status) {
              this.successToast(this.$t("admin.parentRemovedSuccess"));
              this.getSelectedSpecialitiesManagement.parentSpeciality = null;
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
    removeFile() {
      if (this.iconToUpload.length > 1) {
        this.iconToUpload.splice(0, 1);
      }
    },
    fileUpload(file) {
      this.iconToUpload.push(file);
      if (this.iconToUpload.length > 1) {
        this.$refs.iconFileUpload.removeFile(this.iconToUpload[0]);
      }

      if (file.manuallyAdded) {
        return;
      }

      authService.uploadId(file).then(
        (res) => {
          if (res.data.status) {
            this.iconId = res.data.data.id;
            this.successToast(this.$t("admin.iconUploaded"));
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
    updateSpeciality() {
      // this.formSubmitted = true;
      // if (!this.iconId) return;
      specialityService
        .updateSpeciality(this.getSelectedSpecialitiesManagement.id, {
          ...this.getSelectedSpecialitiesManagement,
          // icon: "" + this.iconId,
          icon: this.iconId ? this.iconId : null,
          childSpecialities: this.selectedSubSpecialities,
        })
        .then(
          (response) => {
            if (response.data.status) {
              this.successToast(
                this.$t("admin.specialityRequestUpdatedSuccess")
              );
              this.savedStatus = this.selectedStatus;
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