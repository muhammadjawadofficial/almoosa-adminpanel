<template>
  <div class="add-new-insurance-container standard-width page-body-container">
    <back-navigation
      :title="$t('admin.' + (editable ? 'editPackage' : 'addPackage'))"
      :showBack="false"
    />
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
            type="number"
            v-model="packageForm.price"
            :state="formSubmitted ? packageForm.price != '' : null"
            :placeholder="$t('admin.price')"
          ></b-form-input>
        </b-input-group>
      </div>
    </div>
    <div
      class="row"
      v-for="(service, index) in packageForm.service_details"
      :key="'service-' + index"
    >
      <div class="col-md-5">
        <b-input-group class="custom-login-input-groups">
          <b-form-input
            v-model="service.key"
            :state="formSubmitted ? service.key != '' : null"
            :placeholder="$t('admin.serviceName')"
          ></b-form-input>
        </b-input-group>
      </div>
      <div class="col-md-5">
        <b-input-group class="custom-login-input-groups">
          <b-form-input
            v-model="service.value"
            :state="formSubmitted ? service.value != '' : null"
            :placeholder="$t('admin.serviceDescription')"
          ></b-form-input>
        </b-input-group>
      </div>
      <div class="col-md-1">
        <div class="add-new-insurance h-100 d-flex align-items-center pointer">
          <div class="icon" v-if="index == 0" @click="addService">
            <img src="../../assets/images/add.svg" alt="add" />
          </div>
          <div class="text" v-else @click="removeService(index)">
            {{ $t("admin.remove") }}
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-10">
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
      <div class="col-md-10">
        <div class="custom-login-input-groups file-upload-container">
          <div class="upload-text" v-if="fileToUpload.length">
            {{ $t("insurance.clickToUpload") }}
          </div>
          <div class="upload-text text-muted w200 center" v-else>
            {{ $t("admin.uploadThumbnail") }}
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
              'dropzone is-invalid': formSubmitted
                ? !packageForm.thumbnail_id
                : null,
            }"
          ></div>
        </div>
      </div>
      <div class="register-navigation col-md-12">
        <div class="button-group">
          <template v-if="editable">
            <button class="btn btn-primary" @click="editPackage">
              {{ $t("admin.editPackage") }}
            </button>
            <button class="btn btn-tertiary" @click="navigateBack()">
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
import { authService, servicesPackagesService } from "../../services";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      showUpload: true,
      packageForm: {
        title: "",
        price: "",
        description: "",
        thumbnail_id: "",
        service_details: [
          {
            key: "",
            value: "",
          },
        ],
      },
      formSubmitted: false,
      validationdropzoneOptions: {
        url: "http://localhost:8080",
        thumbnailWidth: 150,
        acceptedFiles: ["image/jpeg", "image/png"],
        maxFiles: 1,
        dictDefaultMessage: "",
      },
      editable: false,
      fileToUpload: [],
    };
  },
  computed: {
    ...mapGetters("user", ["getUserInfo"]),
    ...mapGetters("servicesPackages", ["getSelectedPackage"]),
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
        if (this.getSelectedPackage && this.getSelectedPackage.id) {
          this.editable = true;
        } else {
          this.navigateTo("Services Packages List");
        }
      } else {
        this.editable = false;
      }

      this.$refs.fileUpload.removeAllFiles();
      this.fileToUpload = [];

      if (this.editable) {
        this.packageForm.title = this.getSelectedPackage.title;
        this.packageForm.price = this.getSelectedPackage.price;
        this.packageForm.description = this.getSelectedPackage.description;
        this.packageForm.service_details = [
          ...Object.keys(this.getSelectedPackage.service_details).map((x) => {
            return {
              key: x,
              value: this.getSelectedPackage.service_details[x],
            };
          }),
        ];
        if (this.getSelectedPackage.thumbnail) {
          let image = this.getSelectedPackage.thumbnail;
          let file = {
            size: +image.size,
            name: image.filename,
            type: image.mimetype,
          };
          this.$refs.fileUpload.manuallyAddFile(
            file,
            this.getImageUrl(this.getSelectedPackage.thumbnail)
          );
          console.log(this.packageForm);
          this.fileToUpload = [file];
        }
      } else {
        this.resetForm();
      }
    },
    removeService(index) {
      if (this.packageForm.service_details.length > 0) {
        this.packageForm.service_details =
          this.packageForm.service_details.filter((x, i) => i != index);
      }
    },
    addService() {
      this.packageForm.service_details.push({ key: "", value: "" });
    },
    removeFile() {
      if (this.fileToUpload.length > 1) {
        this.fileToUpload.splice(0, 1);
      }
    },
    checkFileDimensions(file) {
      if (file.manuallyAdded) return;
      // if (file.width != 1920 || file.height != 450) {
      //   this.failureToast("Upload Image Of Size: 1920x450");
      //   this.$refs.fileUpload.removeAllFiles();
      //   this.fileToUpload = [];
      //   return;
      // }
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
            this.packageForm.thumbnail_id = res.data.data.id;
            this.successToast(this.$t("insurance.idUploaded"));
          } else {
            this.failureToast(res.data.message);
          }
          this.setLoadingState(false);
        },
        (err) => {
          console.error(err);
          this.failureToast();
          this.setLoadingState(false);
        }
      );
    },
    validateForm() {
      let form = this.packageForm;
      let state = {};
      state.title = form.title != "";
      state.price = form.price != "";
      state.description = form.description != "";
      state.service_details =
        form.service_details && form.service_details.length > 0;
      form.service_details.forEach((item) => {
        if (state.service_details) {
          state.service_details = item.key != "" && item.value != "";
        }
      });
      state.thumbnail_id = form.thumbnail_id != "";

      return !Object.values(state).includes(false);
    },
    addPackage() {
      this.formSubmitted = true;
      if (!this.validateForm()) {
        return;
      }
      let parsedDetails = {};
      this.packageForm.service_details.forEach((item) => {
        if (item.key != "" && item.value != "")
          parsedDetails[item.key] = item.value;
      });
      let newPackage = {
        title: this.packageForm.title,
        price: this.packageForm.price,
        description: this.packageForm.description,
        thumbnail_id: this.packageForm.thumbnail_id,
        service_details: JSON.stringify(parsedDetails),
      };
      this.setLoadingState(true);
      servicesPackagesService.addNewPackage(newPackage).then(
        (response) => {
          if (response.data.status) {
            this.resetForm();
            this.successToast(this.$t("admin.packageCreateSuccessMessage"));
          } else {
            this.failureToast(response.data.message);
          }
          this.setLoadingState(false);
        },
        (error) => {
          console.error(error);
          this.failureToast(error.response.data.message);
          this.setLoadingState(false);
        }
      );
    },
    editPackage() {},
    itemSelected(item) {
      this.selectedItem = item;
    },
    resetForm() {
      this.packageForm = {
        title: "",
        price: "",
        description: "",
        thumbnail_id: "",
        service_details: [
          {
            key: "",
            value: "",
          },
        ],
      };
      this.fileToUpload = [];
      this.$refs.fileUpload.removeAllFiles();
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