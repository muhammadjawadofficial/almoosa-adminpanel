<template>
  <div class="login-card standard-width page-body-container">
    <back-navigation :title="$t('admin.tamaraLimits')" :showBack="false" />
    <div class="tamara-limits-form">
      <div class="row">
        <div class="col-xl-4 col-md-6">
          <b-input-group class="custom-login-input-groups same-height">
            <b-form-input
              type="number"
              v-model="config.min"
              :state="configState.min"
              :placeholder="$t('admin.min')"
            ></b-form-input>
          </b-input-group>
        </div>
        <div class="col-xl-4 col-md-6">
          <b-input-group class="custom-login-input-groups same-height">
            <b-form-input
              type="number"
              v-model="config.max"
              :state="configState.max"
              :placeholder="$t('admin.max')"
            ></b-form-input>
          </b-input-group>
        </div>
      </div>
      <div class="register-navigation">
        <div class="button-group">
          <button class="btn btn-primary" @click="updateTamaraLimits">
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
        min: 0,
        max: 0,
      },
      configState: {
        min: null,
        max: null,
      },
      systemConfig: {},
      allTamaraInstallmentsTypes: [],
      tamaraInstallmentsType: null,
      formSubmitted: false,
    };
  },
  mounted() {
    this.fetchTamaraLimits();
    this.fetchTamaraLimitsConfig();
  },
  methods: {
    fetchTamaraLimitsConfig() {
      let query = `?country=SA&currency=SAR&skip_config_check=true`;
      appointmentService.fetchPaymentsTypes(query).then(
        (res) => {
          let response = res.data;
          if (response.status) {
            this.tamaraInstallmentsType = null;
            if (response.data.items && response.data.items.length) {
              this.allTamaraInstallmentsTypes = [...response.data.items];
              this.tamaraInstallmentsType = this.allTamaraInstallmentsTypes[0];
              this.tamaraInstallmentsType.min_limit.amount =
                +this.tamaraInstallmentsType.min_limit.amount;
              this.tamaraInstallmentsType.max_limit.amount =
                +this.tamaraInstallmentsType.max_limit.amount;
            }
          } else {
            this.failureToast(response.message);
          }
        },
        (error) => {
          console.error(error);
          if (!this.isAPIAborted(error))
            this.failureToast(
              error.response &&
                error.response.data &&
                error.response.data.message
            );
        }
      );
    },
    fetchTamaraLimits() {
      systemConfigService.fetchConfig("?title=TAMARA_LIMITS").then(
        (response) => {
          if (response.data.status) {
            let data = response.data.data.items;
            this.systemConfig = { ...data[0] };
            let config = JSON.parse(this.systemConfig.value);
            if (config) {
              this.config.min = +config.min;
              this.config.max = +config.max;
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
    updateTamaraLimits() {
      this.config.min = +this.config.min;
      this.config.max = +this.config.max;
      this.formSubmitted = true;
      if (this.validateForm()) {
        systemConfigService
          .updateConfig(this.systemConfig.id, {
            title: "TAMARA_LIMITS",
            value: JSON.stringify(this.config),
          })
          .then(
            (response) => {
              if (response.data.status) {
                this.successToast(response.data.message);
                this.configState.min = null;
                this.configState.max = null;
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
      this.configState.min =
        this.config.min > 0 &&
        this.config.min < this.config.max &&
        this.config.min >= this.tamaraInstallmentsType.min_limit.amount;
      this.configState.max =
        this.config.max > 0 &&
        this.config.max > this.config.min &&
        this.config.max <= this.tamaraInstallmentsType.max_limit.amount;

      if (this.config.min > this.config.max) {
        this.failureToast(this.$t("admin.minMaxError"));
      } else if (this.config.max < this.config.min) {
        this.failureToast(this.$t("admin.maxMinError"));
      } else if (
        this.config.min < this.tamaraInstallmentsType.min_limit.amount
      ) {
        this.failureToast(
          this.$t("admin.minErrorTamara", {
            min: this.tamaraInstallmentsType.min_limit.amount,
          })
        );
      } else if (
        this.config.max > this.tamaraInstallmentsType.max_limit.amount
      ) {
        this.failureToast(
          this.$t("admin.maxErrorTamara", {
            max: this.tamaraInstallmentsType.max_limit.amount,
          })
        );
      }

      return this.configState.min && this.configState.max;
    },
  },
};
</script>

<style lang="scss" scoped>
.tamara-limits-form {
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