<template>
  <div class="add-promotion-container standard-width page-body-container">
    <back-navigation
      :title="editable ? $t('admin.editPromotion') : $t('admin.addPromotion')"
      :showBack="false"
    />
    <div class="row mt-3">
      <div class="col-md-12">
        <b-input-group class="custom-login-input-groups">
          <b-form-input
            v-model="promoGroupForm.title"
            :state="promoGroupFormState.title"
            :placeholder="$t('admin.title')"
          ></b-form-input>
        </b-input-group>
      </div>
      <div class="col-md-12">
        <b-input-group class="custom-login-input-groups">
          <multiselect
            v-model="selectedPromotionUsers"
            :options="promoGroups"
            :placeholder="$t('admin.addMember')"
            multiple
            track-by="id"
            label="name"
          ></multiselect>
          <div
            class="custom-state-invalid icon"
            :class="{
              'is-invalid': promoGroupFormState.promo_group_id == false,
            }"
          ></div>
        </b-input-group>
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
            @click="navigateTo('Promotions Groups')"
          >
            {{ $t("back") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { authService, promotionService, userService } from "../../services";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      showUpload: true,
      selectedPromotionUsers: null,
      promoGroupForm: {
        title: "",
      },
      promoGroupFormState: {
        title: null,
      },
      formSubmitted: false,
      editable: false,
      promoGroups: [],
    };
  },
  computed: {
    ...mapGetters("promotion", ["getSelectedPromotionGroup"]),
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
        if (
          this.getSelectedPromotionGroup &&
          this.getSelectedPromotionGroup.id
        ) {
          this.editable = true;
        } else {
          this.navigateTo("Promotions Groups");
        }
      } else {
        this.editable = false;
      }
      if (this.editable) {
        this.promoGroupForm.title = this.getSelectedPromotionGroup.title;
        this.selectedPromotionUsers = [
          ...this.getSelectedPromotionGroup.users.map((x) => {
            return {
              name: this.getFullName(x),
              ...x,
            };
          }),
        ];
      } else {
        this.promoGroupForm.title = "";
        this.selectedPromotionUsers = [];
      }
    },
    checkDropdownValues() {
      this.setLoadingState(true);
      userService.getUsers().then(
        (res) => {
          if (res.data.status) {
            this.promoGroups = [
              ...res.data.data.items.map((x) => {
                return {
                  name: this.getFullName(x),
                  ...x,
                };
              }),
            ];
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
    removeFile() {
      if (this.fileToUpload.length > 1) {
        this.fileToUpload.splice(0, 1);
      }
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
            this.promoGroupForm.image_id = res.data.data.id;
            this.promoGroupFormState.image_id =
              this.promoGroupForm.image_id != null;
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
      let form = this.promoGroupForm;
      this.promoGroupFormState.title = form.title != "";
      return !Object.values(this.promoGroupFormState).includes(false);
    },
    createUpdatePromotion() {
      this.formSubmitted = true;
      this.promoGroupForm.promo_group_id =
        this.selectedPromotionUsers && this.selectedPromotionUsers.id;
      if (!this.validateForm()) {
        return;
      }
      this.setLoadingState(true);
      if (!this.editable) {
        promotionService
          .createPromoGroup({
            ...this.promoGroupForm,
            users: this.selectedPromotionUsers.map((x) => x.id),
          })
          .then(
            (response) => {
              if (response.data.status) {
                this.successToast(this.$t("admin.promoGroupAdded"));
                this.navigateTo("Promotions Groups");
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
      } else {
        promotionService
          .updatePromoGroupDetails(
            this.getSelectedPromotionGroup.id,
            this.promoGroupForm
          )
          .then(
            (response) => {
              if (response.data.status) {
                promotionService
                  .updatePromoGroupUsers({
                    promo_group_id: this.getSelectedPromotionGroup.id,
                    users: this.selectedPromotionUsers.map((x) => x.id),
                  })
                  .then(
                    (response) => {
                      if (response.data.status) {
                        this.successToast(this.$t("admin.promoGroupUpdated"));
                        this.navigateTo("Promotions Groups");
                      } else {
                        this.failureToast(response.data.message);
                      }
                    },
                    (error) => {
                      console.error(error);
                      this.setLoadingState(false);
                      this.failureToast(error.response.data.message);
                    }
                  );
              } else {
                this.failureToast(response.data.message);
              }
            },
            (error) => {
              console.error(error);
              this.failureToast(error.response.data.message);
              this.setLoadingState(false);
            }
          );
      }
    },
    addUsers(userId) {
      if (userId) {
        promotionService
          .updatePromoGroupUsers({
            promo_group_id: userId,
            users: this.selectedPromotionUsers.map((x) => x.id),
          })
          .then(
            (response) => {
              if (response.data.status) {
                return true;
              } else {
                this.failureToast(response.data.message);
              }
            },
            (error) => {
              console.error(error);
              this.failureToast(error.response.data.message);
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
.multiselect {
  display: flex;
  align-items: center;
  min-height: 3rem;
  & :deep &__tags {
    display: flex;
    align-items: center;
    line-height: 1em !important;
  }
  & :deep &__tag {
    font-size: 1rem !important;
  }
}
</style>