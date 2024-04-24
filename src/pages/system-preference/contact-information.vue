<template>
  <div class="login-card standard-width page-body-container">
    <back-navigation
      :title="$t('admin.contactInformation')"
      :showBack="false"
    />
    <div class="contact-information-form">
      <div class="row">
        <div class="col-xl-4 col-md-6">
          <label for="whatsapp-contact">
            {{ $t("admin.whatsapp") }}
          </label>
          <b-input-group class="custom-login-input-groups same-height">
            <b-form-input
              id="whatsapp-contact"
              type="text"
              v-model="config.whatsapp"
              :state="configState.whatsapp"
              :placeholder="$t('admin.enterWhatsapp')"
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
        whatsapp: "",
      },
      configState: {
        whatsapp: null,
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
      systemConfigService.fetchConfig("?title=CONTACT_NUMBER").then(
        (response) => {
          if (response.data.status) {
            let data = response.data.data.items;
            this.systemConfig = { ...data[0] };
            let config = JSON.parse(this.systemConfig.value);
            if (config) {
              this.config.whatsapp = config.whatsapp;
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
            title: "CONTACT_NUMBER",
            value: JSON.stringify(this.config),
          })
          .then(
            (response) => {
              if (response.data.status) {
                this.successToast(response.data.message);
                this.configState.whatsapp = null;
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
      this.configState.whatsapp = this.config.whatsapp !== "";

      if (!this.configState.whatsapp) {
        this.failureToast(this.$t("admin.enterValidPhone"));
      }

      return this.configState.whatsapp;
    },
  },
};
</script>

<style lang="scss" scoped>
.contact-information-form {
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