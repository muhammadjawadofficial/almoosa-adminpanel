<template>
  <div class="appointment-detail-container medication-detail-container page-body-container standard-width">
    <back-navigation :backLink="backRoute" :title="$t('admin.updateNotification')" />
    <div class="row">
      <div class="col-sm-12">
        <b-card header-tag="div" no-body class="ash-card card-rounded">
          <b-card-body class="mt-0">
            <div class="row">
              <div class="col-md-6">
                <b-input-group class="custom-login-input-groups forceLtr">
                  <b-form-input v-model="text" :placeholder="$t('admin.text') + ' ' + $t('admin.english')"></b-form-input>
                </b-input-group>
              </div>
              <div class="col-md-6">
                <b-input-group class="custom-login-input-groups forceRtl">
                  <b-form-input v-model="textAr"
                    :placeholder="$t('admin.text') + ' ' + $t('admin.arabic')"></b-form-input>
                </b-input-group>
              </div>
            </div>

            <div class="row">
              <div class="col-md-6">
                <b-input-group class="custom-login-input-groups forceLtr">
                  <b-form-textarea v-model="textEnState" :placeholder="$t('admin.text') + ' ' + $t('admin.english')"
                    no-resize rows="3" max-rows="4"></b-form-textarea>
                </b-input-group>
              </div>
              <div class="col-md-6">
                <b-input-group class="custom-login-input-groups forceRtl">
                  <b-form-textarea v-model="textArState" :placeholder="$t('admin.text') + ' ' + $t('admin.arabic')"
                    no-resize rows="3" max-rows="4"></b-form-textarea>
                </b-input-group>
              </div>
            </div>
          </b-card-body>
        </b-card>
        <div class="appointment--action-buttons">
          <button class="btn btn-secondary" @click="updateNotification()">
            {{ $t("admin.update") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script>
import { mapGetters } from "vuex";
import { notificationService } from "../../services";
export default {

  data() {
    return {
      originalBackRoute: "Notifications List",
      backRoute: "Notifications List",
      showUpload: true,
      formSubmitted: false,
      selectedNotificationId: null,
      key: "",
      text: "",
      textAr: "",
      textEnState: "",
      textArState: "",
    };
  },

  computed: {
    ...mapGetters("notificationManagement", ["getSelectedNotification"]),
  },

  watch: {
    $route: function () {
      this.checkAccess();
    },
  },

  mounted() {
    this.checkAccess();
    this.initializeData()
  },
  methods: {

    checkAccess() {
      if (this.$route.name) {
        if (!this.getSelectedNotification) {
          this.navigateTo(this.backRoute);
          return;
        }
        this.initializeData();
      } else {
        this.backRoute = null;
        this.resetValues();
      }
    },

    resetValues() {
      this.text = "";
      this.textAr = "";
      this.textState = "";
      this.textArState = "";
    },

    initializeData() {
      if (this.getSelectedNotification) {
        this.text = this.getSelectedNotification.title_en;
        this.textAr = this.getSelectedNotification.title_ar;
        this.textEnState = this.getSelectedNotification.msg_en;
        this.textArState = this.getSelectedNotification.msg_ar;
        this.selectedNotificationId = this.getSelectedNotification.notification_event_id;
        this.key = this.getSelectedNotification.key
      }

    },

    updateNotification() {
      let payload = {
        title_en: this.text,
        title_ar: this.textAr,
        key: this.key,
        msg_en: this.textEnState,
        msg_ar: this.textArState,
        notification_event_id: this.selectedNotificationId,
      };
      notificationService.updateNotification(this.getSelectedNotification.id, payload).then(
        (response) => {
          if (response.data.status) {
            console.log(response)
            this.successToast(this.$t("admin.notificationUpdatedSuccess"));
            this.navigateTo(this.backRoute);
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