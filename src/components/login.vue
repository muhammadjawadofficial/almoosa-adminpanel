<template>
  <div class="login-card">
    <div class="heading w600">Welcome to</div>
    <div class="heading w600">AlMoosa Specialist Hospital</div>
    <div class="sub-heading font-secondary w200">
      To log in to your account, enter the Required Details
    </div>
    <div class="login-form">
      <div class="row">
        <div class="col-xl-5 col-lg-12 col-md-6" @keydown.enter="doLogin">
          <b-input-group class="custom-login-input-groups">
            <b-input-group-prepend is-text>
              <username-svg />
            </b-input-group-prepend>
            <b-form-input
              v-model="username"
              :placeholder="'Username'"
              :state="usernameState"
            ></b-form-input>
          </b-input-group>
        </div>
        <div class="col-xl-5 col-lg-12 col-md-6" @keydown.enter="doLogin">
          <b-input-group class="custom-login-input-groups">
            <b-input-group-prepend is-text>
              <password-svg />
            </b-input-group-prepend>
            <b-form-input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Password"
              :state="passwordState"
            ></b-form-input>
          </b-input-group>
        </div>
        <div class="col-xl-5 col-lg-12 col-md-6">
          <b-form-checkbox
            id="rememberMe"
            v-model="rememberMe"
            name="rememberMe"
            class="mt-3 custom-checkbox"
          >
            Remember Me
          </b-form-checkbox>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12 button-group">
          <button class="btn btn-primary" @click="doLogin">Login</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { authService, userService } from "../../services";
import constants from "../../constants/constants";
import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      username: "",
      password: "",
      usernameState: null,
      passwordState: null,
      constants,
      showPassword: false,
      rememberMe: false,
    };
  },
  computed: {
    ...mapGetters("user", ["getUserRole"]),
  },
  mounted() {},
  methods: {
    ...mapActions("user", ["setUserInfo"]),
    validateForm() {
      this.usernameState = this.username != "";
      this.passwordState = this.password != "";
      return this.usernameState && this.passwordState;
    },
    doLogin() {
      if (!this.validateForm()) {
        return;
      }
      let payload = {
        username: this.username,
        password: this.password,
        field_name: "email_address",
        is_admin: true,
      };
      this.doAdminLogin(payload);
    },
    doAdminLogin(payload) {
      this.setLoadingState(true);
      authService.loginAdmin(payload).then(
        (response) => {
          if (response.data.status) {
            let data = response.data.data;
            userService.storeLoginInfo(data.user, data.access_token);
            this.setUserInfo(data.user);
            this.navigateTo("default");
          } else {
            this.failureToast(response.data.message);
          }
          this.setLoadingState(false);
        },
        (error) => {
          if (!this.isAPIAborted(error)) this.failureToast(error.response && error.response.data.message);
          this.setLoadingState(false);
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
  font-size: 2.5rem;
  color: var(--theme-default);
}
.sub-heading {
  font-size: 1.5rem;
  line-height: 1em;
  margin-block: 0.75rem;
}
.button-group {
  margin-top: 3.875rem;
  &.lg {
    margin-top: 8.875rem;
  }
}
.custom-checkbox {
  :deep {
    input:checked {
      ~ label {
        &::before {
          border-color: var(--theme-default);
          background-color: var(--theme-default);
          border-radius: 3px;
        }
      }
    }
    label {
      font-size: 1rem;
      color: var(--theme-default);
      margin-inline-start: 0.5rem;
      cursor: pointer;
      &::after,
      &::before {
        width: 1.563rem;
        height: 1.563rem;
        top: 0;
        bottom: 0;
        left: -2rem;
        margin: auto;
        border-color: var(--theme-default) !important;
      }
    }
  }
}
</style>