<template>
  <div class="login-card standard-width page-body-container">
    <back-navigation :title="$t('admin.configUrl')" :showBack="false" />
    <div class="config-form">
      <div class="row">
        <div class="col-xl-4 col-md-6">
          <label for="sms-link">
            {{ $t("admin.smsUrl") }}
          </label>
          <b-input-group class="custom-login-input-groups same-height">
            <b-form-input
              id="sms-link"
              type="text"
              v-model="config.sms_link"
              :state="configState.sms_link"
              :placeholder="$t('admin.enterSmsUrl')"
            ></b-form-input>
          </b-input-group>
        </div>
        <div class="col-xl-4 col-md-6">
          <label for="sms-link">
            {{ $t("admin.feedbackUrl") }}
          </label>
          <b-input-group class="custom-login-input-groups same-height">
            <b-form-input
              id="sms-link"
              type="text"
              v-model="config.feedback_link"
              :state="configState.feedback_link"
              :placeholder="$t('admin.enterFeedbackUrl')"
            ></b-form-input>
          </b-input-group>
        </div>
      </div>
      <div class="register-navigation">
        <div class="button-group">
          <button class="btn btn-primary" @click="updateContactInformation">
            {{ $t("admin.update") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { appointmentService, systemConfigService } from "../../services";
export default {
  data() {
    return {
      config: {
        sms_link: "",
        feedback_link: "",
        virtual_tour: "",
      },
      configState: {
        sms_link: null,
        feedback_link: null,
      },
      systemConfig: {},
      allTamaraInstallmentsTypes: [],
      tamaraInstallmentsType: null,
      formSubmitted: false,
    };
  },
  mounted() {
    this.fetchContactInformationConfig();
  },
  methods: {
    fetchContactInformationConfig() {
      systemConfigService.fetchConfig("?title=CONFIG_URL").then(
        (response) => {
          if (response.data.status) {
            let data = response.data.data.items;
            this.systemConfig = { ...data[0] };
            let config = JSON.parse(this.systemConfig.value);
            if (config) {
              this.config.sms_link = config.sms_link;
              this.config.feedback_link = config.feedback_link;
              this.config.virtual_tour = config.virtual_tour;
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
    updateContactInformation() {
      this.formSubmitted = true;
      if (this.validateForm()) {
        systemConfigService
          .updateConfig(this.systemConfig.id, {
            title: "CONFIG_URL",
            value: JSON.stringify(this.config),
          })
          .then(
            (response) => {
              if (response.data.status) {
                this.successToast(response.data.message);
                this.configState.sms_link = null;
                this.configState.feedback_link = null;
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
      }
    },
    validateForm() {
      this.configState.sms_link = this.config.sms_link !== "";
      this.configState.feedback_link = this.config.feedback_link !== "";

      if (!this.configState.sms_link || !this.configState.feedback_link) {
        this.failureToast(this.$t("admin.enterValidUrl"));
      }

      return this.configState.sms_link && this.configState.feedback_link;
    },
  },
};
</script>

<style lang="scss" scoped>
.config-form {
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
  }
}
.register-navigation {
  display: flex;
  margin-top: 3.75rem;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}
</style>