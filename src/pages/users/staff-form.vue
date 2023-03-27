<template>
  <div class="login-card standard-width page-body-container">
    <back-navigation
      :title="$t('familyMembers.addStaffMember')"
      :showBack="false"
    />
    <div class="add-family-member-form">
      <div class="row">
        <div class="col-xl-4 col-lg-6">
          <div class="custom-login-input-groups same-height">
            <multiselect
              v-model="selectedRole"
              :options="rolesList"
              track-by="id"
              label="title"
              :preselectFirst="true"
              :placeholder="$t('admin.selectRole')"
              :selectLabel="$t('selectLabel')"
              :selectedLabel="$t('selectedLabel')"
              :deselectLabel="$t('deselectLabel')"
            >
              <template slot="singleLabel" slot-scope="props">
                <div class="multiselect__with-icon">
                  <span class="multiselect__prepend-icon">
                    <username-svg />
                  </span>
                  {{ props.option[getLocaleKey("title")] }}
                </div>
              </template>
              <template slot="option" slot-scope="props">
                {{ props.option[getLocaleKey("title")] }}
              </template>
            </multiselect>
            <div
              class="custom-state-invalid icon"
              :class="{
                'is-invalid': formSubmitted && selectedRole == null,
              }"
            ></div>
          </div>
        </div>
        <div class="col-xl-4 col-md-6">
          <b-input-group class="custom-login-input-groups same-height">
            <b-form-input
              v-model="userId"
              :state="registerFormState.userId"
              :placeholder="$t('admin.enterStaffId')"
              type="number"
              :formatter="numberOnly"
            ></b-form-input>
          </b-input-group>
        </div>
      </div>
      <div class="row">
        <div class="col-xl-4 col-md-6">
          <b-input-group class="custom-login-input-groups same-height">
            <b-form-input
              v-model="registerForm.first_name"
              :state="registerFormState.first_name"
              :placeholder="$t('familyMembers.firstName')"
              :formatter="alphabetsOnly"
            ></b-form-input>
          </b-input-group>
        </div>
        <div class="col-xl-4 col-md-6">
          <b-input-group class="custom-login-input-groups same-height">
            <b-form-input
              v-model="registerForm.family_name"
              :state="registerFormState.family_name"
              :placeholder="$t('familyMembers.familyName')"
              :formatter="alphabetsOnly"
            ></b-form-input>
          </b-input-group>
        </div>
      </div>
      <div class="row">
        <div class="col-xl-4 col-md-6">
          <b-input-group class="custom-login-input-groups same-height">
            <b-form-input
              v-model="registerForm.email_address"
              :state="registerFormState.email_address"
              :placeholder="$t('familyMembers.emailAddress')"
              type="email"
            ></b-form-input>
          </b-input-group>
        </div>
        <div class="col-xl-4 col-md-6">
          <b-input-group class="custom-login-input-groups same-height">
            <b-form-input
              v-model="registerForm.phone_number"
              :state="registerFormState.phone_number"
              :placeholder="$t('familyMembers.phoneNumber')"
              :formatter="formatNumber"
            ></b-form-input>
          </b-input-group>
        </div>
      </div>
      <div class="register-navigation">
        <div class="button-group">
          <button class="btn btn-primary" @click="addStaffMember">
            {{ $t("familyMembers.addMember") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { authService, rolesPermissionsService } from "../../services";
import constants from "../../constants/constants";
import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      registerForm: {
        first_name: "",
        family_name: "",
        email_address: "",
        phone_number: "",
      },
      registerFormState: {
        first_name: null,
        family_name: null,
        email_address: null,
        phone_number: null,
        userId: null,
      },
      rolesList: [],
      formSubmitted: false,
      userId: "",
      constants,
      loading: false,
      selectedOption: null,
      selectedItem: {},
      selectedRole: null,
    };
  },
  computed: {
    ...mapGetters("user", ["getUserInfo"]),
    validEmailAddress() {
      if (this.formSubmitted) {
        let regex =
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let result = this.registerForm.email_address.match(regex);
        return !!(result && result.length);
      }
      return false;
    },
    validPhoneNumber() {
      if (this.formSubmitted) {
        // let regex = /^(009665|9665|\+9665|05|5)([503649187])(\d{7})$/;
        let regex = /^(05)([503649187])(\d{7})$/;
        let result = this.registerForm.phone_number.match(regex);
        return !!(result && result.length);
      }
      return false;
    },
  },
  mounted() {
    this.checkDropdownValues();
  },
  methods: {
    ...mapActions("user", ["setOtp", "setUserId", "setAuthState"]),
    checkDropdownValues() {
      this.setLoadingState(true);
      Promise.all([rolesPermissionsService.fetchRolesList()])
        .then((res) => {
          if (res[0].data.status) {
            let data = res[0].data.data;
            if (data) {
              this.rolesList = data.items;
            }
          } else {
            this.failureToast(res[0].data.message);
          }
          this.setLoadingState(false);
        })
        .catch((error) => {
          console.error(error);
          if (!this.isAPIAborted(error))
            this.failureToast(
              error.response &&
                error.response.data &&
                error.response.data.message
            );
          this.setLoadingState(false);
        });
    },
    formatNumber(number, input) {
      if (
        input.type == "input" &&
        !((0 <= input.data && input.data <= 9) || input.data == "+")
      ) {
        return number.slice(0, -1);
      }
      return number;
    },
    validateForm() {
      this.registerFormState.first_name = this.registerForm.first_name != "";
      this.registerFormState.family_name = this.registerForm.family_name != "";
      this.registerFormState.email_address = this.validEmailAddress;
      this.registerFormState.phone_number = this.validPhoneNumber;
      this.registerFormState.userId = this.userId != "";

      return !Object.values(this.registerFormState).includes(false);
    },
    addStaffMember() {
      this.formSubmitted = true;
      if (!this.validateForm()) {
        return;
      }
      this.registerForm["id"] = +this.userId;
      this.registerForm.role_id = this.selectedRole.id;
      this.setLoadingState(true);
      authService.addStaffMember(this.registerForm).then(
        (response) => {
          if (response.data.status) {
            this.successIconModal(
              this.$t("familyMembers.addStaffMember"),
              this.$t("familyMembers.staffAddedSuccessfully")
            ).then(() => {
              this.resetForm();
            });
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
    itemSelected(item) {
      this.selectedItem = item;
    },
    resetForm() {
      this.registerForm.first_name = "";
      this.registerForm.family_name = "";
      this.registerForm.email_address = "";
      this.registerForm.phone_number = "";

      this.registerFormState.first_name = null;
      this.registerFormState.family_name = null;
      this.registerFormState.email_address = null;
      this.registerFormState.phone_number = null;
      this.registerFormState.userId = null;

      this.userId = "";
    },
  },
};
</script>

<style lang="scss" scoped>
.add-family-member-form {
  padding-top: 2rem;

  :deep {
    .custom-login-input-groups {
      isolation: auto;

      &:before {
        z-index: 0;
      }

      &.same-height {
        min-height: 4.375rem;
        display: flex;
        align-items: center;
      }
    }

    .ash-datetime-container {
      max-width: 100%;

      .b-form-datepicker > button.btn img {
        width: 1.75rem;
      }
    }

    .input-group-append,
    .custom-state-invalid {
      z-index: 1;
    }
  }
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