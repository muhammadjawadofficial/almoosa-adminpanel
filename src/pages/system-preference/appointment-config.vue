<template>
  <div class="login-card standard-width page-body-container">
    <back-navigation :title="$t('admin.appointmentConfig')" :showBack="false" />
    <div class="contact-information-form">
      <div class="row">
        <div class="col-xl-4 col-md-6">
          <label for="virtual-call-duration-contact">
            {{ $t("admin.virtualCallAllowedLimit") }}
          </label>
          <b-input-group class="custom-login-input-groups same-height">
            <b-form-input
              id="virtual-call-duration-contact"
              type="text"
              v-model="config.virtual.allowed_duration"
              :state="
                formSubmitted ? config.virtual.allowed_duration !== '' : null
              "
              :placeholder="$t('admin.enterInMin')"
            ></b-form-input>
          </b-input-group>
        </div>
      </div>
      <div class="register-navigation">
        <div class="button-group">
          <button class="btn btn-primary" @click="updateAppointmentConfig">
            {{ $t("admin.update") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { systemConfigService } from "../../services";
export default {
  data() {
    return {
      config: {
        virtual: {},
      },
      systemConfig: {},
      allTamaraInstallmentsTypes: [],
      tamaraInstallmentsType: null,
      formSubmitted: false,
    };
  },
  mounted() {
    this.fetchAppointmentConfig();
  },
  methods: {
    fetchAppointmentConfig() {
      systemConfigService.fetchConfig("?title=APPOINTMENT_CONFIG").then(
        (response) => {
          if (response.data.status) {
            let data = response.data.data.items;
            this.systemConfig = { ...data[0] };
            this.config = JSON.parse(this.systemConfig.value);
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
    updateAppointmentConfig() {
      this.formSubmitted = true;
      if (this.validateForm()) {
        systemConfigService
          .updateConfig(this.systemConfig.id, {
            title: "APPOINTMENT_CONFIG",
            value: JSON.stringify(this.config),
          })
          .then(
            (response) => {
              if (response.data.status) {
                this.successToast(response.data.message);
                this.formSubmitted = false;
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
      if (this.config.virtual.allowed_duration == "") {
        this.failureToast(this.$t("admin.enterValidPhone"));
      }

      return this.config.virtual.allowed_duration !== "";
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