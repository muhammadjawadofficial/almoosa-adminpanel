<template>
  <div class="add-new-insurance-container standard-width page-body-container">
    <back-navigation
      :title="$t('admin.' + (editable ? 'editPackage' : 'addPackage'))"
      :showBack="false"
    />
    <div class="row mt-3">
      <div class="col-md-5">
        <b-input-group class="custom-login-input-groups forceLtr">
          <b-form-input
            v-model="packageForm.title"
            :state="formSubmitted ? packageForm.title != '' : null"
            :placeholder="$t('admin.title')"
          ></b-form-input>
        </b-input-group>
      </div>
      <div class="col-md-5">
        <b-input-group class="custom-login-input-groups forceRtl">
          <b-form-input
            v-model="packageForm.title_ar"
            :state="formSubmitted ? packageForm.title != '' : null"
            :placeholder="$t('admin.titleAr')"
          ></b-form-input>
        </b-input-group>
      </div>
    </div>
    <!-- services name and description -->
    <div class="">
      <div
        class="row"
        v-for="(service, index) in packageForm.services"
        :key="'service-' + index"
      >
        <div class="col-md-5">
          <b-input-group class="custom-login-input-groups forceLtr">
            <b-form-input
              v-model="service.name"
              :state="formSubmitted ? service.name != '' : null"
              :placeholder="$t('admin.serviceName')"
            ></b-form-input>
          </b-input-group>
        </div>
        <div class="col-md-5">
          <b-input-group class="custom-login-input-groups forceRtl">
            <b-form-input
              v-model="service.name_ar"
              :state="formSubmitted ? service.name != '' : null"
              :placeholder="$t('admin.serviceNameAr')"
            ></b-form-input>
          </b-input-group>
        </div>
        <div class="col-md-5">
          <b-input-group class="custom-login-input-groups forceLtr">
            <b-form-input
              v-model="service.description"
              :state="formSubmitted ? service.description != '' : null"
              :placeholder="$t('admin.serviceDescription')"
            ></b-form-input>
          </b-input-group>
        </div>
        <div class="col-md-5">
          <b-input-group class="custom-login-input-groups forceRtl">
            <b-form-input
              v-model="service.description_ar"
              :state="formSubmitted ? service.name != '' : null"
              :placeholder="$t('admin.serviceDescriptionAr')"
            ></b-form-input>
          </b-input-group>
        </div>
        <div class="col-md-1">
          <div
            class="add-new-insurance h-100 d-flex align-items-center pointer"
          >
            <div
              class="icon"
              v-if="index == packageForm.services.length - 1"
              @click="addService"
            >
              <img src="../../assets/images/add.svg" alt="add" />
            </div>
            <div class="text" v-else @click="removeService(index)">
              {{ $t("admin.remove") }}
            </div>
            <div
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
            </div>
          </div>
        </div>

        <!-- sub-service -->
        <div v-if="service.toggleSubServices" class="sub_service col-md-12">
          <h1>{{ $t("servicesPackages.subServices") }}</h1>
          <div class="sub-service" v-if="service.sub_services">
            <div
              class="row"
              v-for="(subService, subIndex) in service.sub_services"
              :key="'service-' + subIndex"
            >
              <div class="col-md-5">
                <b-input-group class="custom-login-input-groups forceLtr">
                  <b-form-input
                    v-model="subService.name"
                    :state="formSubmitted ? subService.name != '' : null"
                    :placeholder="$t('admin.serviceName')"
                  ></b-form-input>
                </b-input-group>
              </div>
              <div class="col-md-5">
                <b-input-group class="custom-login-input-groups forceRtl">
                  <b-form-input
                    v-model="subService.name_ar"
                    :state="formSubmitted ? subService.name != '' : null"
                    :placeholder="$t('admin.serviceNameAr')"
                  ></b-form-input>
                </b-input-group>
              </div>
              <div class="col-md-5">
                <b-input-group class="custom-login-input-groups forceLtr">
                  <b-form-input
                    v-model="subService.description"
                    :state="formSubmitted ? subService.description != '' : null"
                    :placeholder="$t('admin.serviceDescription')"
                  ></b-form-input>
                </b-input-group>
              </div>
              <div class="col-md-5">
                <b-input-group class="custom-login-input-groups forceRtl">
                  <b-form-input
                    v-model="subService.description_ar"
                    :state="formSubmitted ? subService.name != '' : null"
                    :placeholder="$t('admin.serviceDescriptionAr')"
                  ></b-form-input>
                </b-input-group>
              </div>
              <div class="col-md-7">
                <b-input-group class="custom-login-input-groups">
                  <b-form-input
                    type="number"
                    v-model="subService.count"
                    :state="formSubmitted ? subService.count != '' : null"
                    :placeholder="$t('servicesPackages.count')"
                  ></b-form-input>
                </b-input-group>
              </div>
              <div class="col-md-1">
                <div
                  class="add-new-insurance h-100 d-flex align-items-center pointer"
                >
                  <div
                    v-if="subIndex == service.sub_services.length - 1"
                    @click="addSubService(service)"
                  >
                    <img src="../../assets/images/add.svg" alt="add" />
                  </div>
                  <div
                    class="text"
                    v-else
                    @click="removeSubService(service, subIndex)"
                  >
                    {{ $t("admin.remove") }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- amount price and vat -->
    <div class="row">
      <div class="col-md-3">
        <b-input-group class="custom-login-input-groups">
          <b-form-input
            type="number"
            v-model="packageForm.price"
            :state="formSubmitted ? packageForm.price != '' : null"
            :placeholder="$t('admin.price')"
            :disabled="true"
          ></b-form-input>
        </b-input-group>
      </div>
      <div class="col-md-3">
        <b-input-group class="custom-login-input-groups">
          <b-form-input
            type="number"
            v-model="packageForm.amount"
            :state="formSubmitted ? packageForm.amount != '' : null"
            :placeholder="$t('servicesPackages.amount')"
            @change="updatePrice"
          ></b-form-input>
        </b-input-group>
      </div>

      <div class="col-md-3">
        <b-input-group class="custom-login-input-groups">
          <b-form-input
            type="number"
            v-model="packageForm.vat"
            :state="formSubmitted ? packageForm.vat != '' : null"
            :placeholder="$t('servicesPackages.vat')"
            @change="updatePrice"
          ></b-form-input>
        </b-input-group>
      </div>
    </div>

    <div class="row">
      <div class="col-md-10">
        <b-input-group class="custom-login-input-groups">
          <multiselect
            v-model="packageForm.term_condition_id"
            :options="cmsPages"
            :placeholder="$t('servicesPackages.selectTerm&Conditions')"
            track-by="id"
            label="page_title"
          ></multiselect>
          <div
            class="custom-state-invalid icon"
            :class="{
              'is-invalid': packageForm.term_condition_id == false,
            }"
          ></div>
        </b-input-group>
      </div>
    </div>
    <div class="row">
      <div class="col-md-5">
        <b-input-group class="custom-login-input-groups forceLtr">
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
        <b-input-group class="custom-login-input-groups forceRtl">
          <b-form-textarea
            v-model="packageForm.description_ar"
            :state="formSubmitted ? packageForm.description != '' : null"
            :placeholder="$t('admin.descriptionAr')"
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
            <button
              class="btn btn-tertiary"
              @click="navigateTo('Services Packages List')"
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
import { authService, servicesPackagesService } from "../../services";
import { cmsPagesService } from "../../services";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      showUpload: true,
      cmsPages: [],
      packageForm: {
        title: "",
        title_ar: "",
        description: "",
        description_ar: "",
        thumbnail_id: null,
        price: "",
        amount: "",
        vat: "",
        term_condition_id: "11",
        services: [
          {
            name: "",
            name_ar: "",
            description: "",
            description_ar: "",
            toggleSubServices: true,
            sub_services: [
              {
                name: "",
                name_ar: "",
                description: "",
                description_ar: "",
                count: null,
              },
            ],
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
      this.fetchArticles();
    },
    "packageForm.amount": "updatePrice",
    "packageForm.vat": "updatePrice",
  },
  mounted() {
    this.checkAccess();
    this.fetchArticles();
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

      // this.$refs.fileUpload.removeAllFiles();
      this.fileToUpload = [];
      if (this.editable) {
        this.packageForm.title = this.getSelectedPackage.title;
        this.packageForm.title_ar = this.getSelectedPackage.title_ar;
        this.packageForm.price = this.getSelectedPackage.price;
        this.packageForm.description = this.getSelectedPackage.description;
        this.packageForm.description_ar =
          this.getSelectedPackage.description_ar;
        this.packageForm.amount = this.getSelectedPackage.amount;
        this.packageForm.vat = this.getSelectedPackage.vat;
        this.packageForm.term_condition_id =
          this.getSelectedPackage.term_condition_id;
        this.packageForm.services = [
          ...this.getSelectedPackage.services.map((x) => {
            return { ...x, toggleSubServices: true };
          }),
        ];
        if (this.getSelectedPackage.thumbnail) {
          this.packageForm.thumbnail_id = this.getSelectedPackage.thumbnail_id;
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
          this.fileToUpload = [file];
        }
      } else {
        this.resetForm();
      }
    },
    toggle(service) {
      console.log("service...", service);
      service.toggleSubServices = !service.toggleSubServices;
    },
    removeService(index) {
      if (this.packageForm.services.length > 0) {
        this.packageForm.services = this.packageForm.services.filter(
          (x, i) => i != index
        );
      }
    },
    updatePrice() {
      if (this.packageForm.amount && !this.packageForm.vat) {
        this.packageForm.price = this.packageForm.amount;
        return;
      }
      this.packageForm.price = +this.packageForm.amount + +this.packageForm.vat;
    },
    addService() {
      this.packageForm.services.push({
        name: "",
        name_ar: "",
        description: "",
        description_ar: "",
        toggleSubServices: true,
        sub_services: [
          {
            name: "",
            name_ar: "",
            description: "",
            description_ar: "",
            count: null,
          },
        ],
      });
    },
    addSubService(service) {
      let newSubService = {
        name: "",
        name_ar: "",
        description: "",
        description_ar: "",
        count: null,
      };
      if (service.sub_services && service.sub_services.length) {
        service.sub_services.push({ ...newSubService });
      } else {
        service.sub_services = [{ ...newSubService }];
      }
    },
    removeSubService(service, index) {
      if (service.sub_services && service.sub_services.length)
        service.sub_services = service.sub_services.filter(
          (x, i) => i != index
        );
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
      authService.uploadId(file).then(
        (res) => {
          if (res.data.status) {
            this.packageForm.thumbnail_id = res.data.data.id;
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
      let form = this.packageForm;
      let state = {};
      state.title = form.title != "";
      state.price = form.price != "";
      state.amount = form.amount != "";
      state.vat = form.vat != "";
      state.term_condition_id = form.term_condition_id != "";
      state.services = form.services && form.services.length > 0;
      form.services.forEach((item) => {
        if (state.services) {
          delete item.toggleSubServices;
          state.services = item.name != "";
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
      this.packageForm.services.forEach((item) => {
        delete item.toggleSubServices;
        if (item.name != "" && item.description != "")
          parsedDetails[item.key] = item.value;
      });
      let newPackage = {
        title: this.packageForm.title,
        title_ar: this.packageForm.title_ar,
        price: this.packageForm.price,
        description: this.packageForm.description,
        description_ar: this.packageForm.description_ar,
        thumbnail_id: this.packageForm.thumbnail_id,
        term_condition_id: this.packageForm.term_condition_id.id,
        amount: this.packageForm.amount,
        vat: this.packageForm.vat,
        services: this.packageForm.services,
      };
      servicesPackagesService.addNewPackage(newPackage).then(
        (response) => {
          if (response.data.status) {
            this.resetForm();
            this.successToast(this.$t("admin.packageCreateSuccessMessage"));
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
      this.packageForm.services.forEach((item) => {
        delete item.toggleSubServices;
        if (item.name != "" && item.description != "")
          parsedDetails[item.key] = item.value;
      });
      let newPackage = {
        title: this.packageForm.title,
        title_ar: this.packageForm.title_ar,
        price: this.packageForm.price,
        description: this.packageForm.description,
        description_ar: this.packageForm.description_ar,
        thumbnail_id: this.packageForm.thumbnail_id,
        term_condition_id: this.packageForm.term_condition_id.id,
        amount: this.packageForm.amount,
        vat: this.packageForm.vat,
        services: this.packageForm.services,
      };
      servicesPackagesService
        .updatePackage(this.getSelectedPackage.id, newPackage)
        .then(
          (response) => {
            if (response.data.status) {
              this.formSubmitted = false;
              this.successToast(this.$t("admin.packageCreateSuccessMessage"));
              this.navigateTo("Services Packages List");
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
        price: "",
        description: "",
        thumbnail_id: "",
        services: [
          {
            name: "",
            name_ar: "",
            description: "",
            description_ar: "",
            toggleSubServices: true,
            sub_services: [
              {
                name: "",
                name_ar: "",
                description: "",
                description_ar: "",
                count: null,
              },
            ],
          },
        ],
      };
      this.fileToUpload = [];
      this.$refs.fileUpload.removeAllFiles();
      this.formSubmitted = false;
    },
    fetchArticles() {
      cmsPagesService.fetchCmsPages().then(
        (response) => {
          if (response.data.status) {
            this.cmsPages = response.data.data.items;
            if (this.editable) {
              this.packageForm.term_condition_id = this.cmsPages.find(
                (el) => el.id === this.getSelectedPackage.term_condition_id
              );
              console.log("cms", this.packageForm.term_condition_id);
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
.sub_service {
  padding-inline: 5rem;
}
@media screen and (max-width: 768px) {
  .sub_service {
    padding-inline: 1.8rem;
  }
}
</style>