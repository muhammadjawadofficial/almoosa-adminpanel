<template>
  <div class="login-card standard-width page-body-container">
    <back-navigation
      :title="$t('admin.broadcastNotification')"
      :showBack="false"
    />
    <div class="admin-form">
      <div class="row">
        <div class="col-xl-5 col-md-6">
          <b-input-group class="custom-login-input-groups same-height forceLtr">
            <b-form-input
              v-model="form.title"
              :state="formState.title"
              :placeholder="
                $t('admin.title') + ' (' + $t('admin.english') + ')'
              "
            ></b-form-input>
          </b-input-group>
        </div>
        <div class="col-xl-5 col-md-6">
          <b-input-group class="custom-login-input-groups same-height forceRtl">
            <b-form-input
              v-model="form.title_ar"
              :state="formState.title_ar"
              :placeholder="$t('admin.title') + ' (' + $t('admin.arabic') + ')'"
            ></b-form-input>
          </b-input-group>
        </div>
        <div class="col-xl-5 col-md-6">
          <b-input-group class="custom-login-input-groups same-height forceLtr">
            <b-form-textarea
              v-model="form.message"
              :state="formState.message"
              :placeholder="
                $t('admin.message') + ' (' + $t('admin.english') + ')'
              "
              rows="5"
              max-rows="10"
            ></b-form-textarea>
          </b-input-group>
        </div>
        <div class="col-xl-5 col-md-6">
          <b-input-group class="custom-login-input-groups same-height forceRtl">
            <b-form-textarea
              v-model="form.message_ar"
              :state="formState.message_ar"
              :placeholder="
                $t('admin.message') + ' (' + $t('admin.arabic') + ')'
              "
              rows="5"
              max-rows="10"
            ></b-form-textarea>
          </b-input-group>
        </div>
        <div class="col-xl-5 col-md-6">
          <b-input-group class="custom-login-input-groups same-height">
            <span class="mr-3">{{ $t("admin.sendIn") }}</span>
            <b-form-radio
              v-model="form.lang"
              name="send-in"
              value="en"
              class="mx-2 d-flex"
            >
              {{ $t("admin.english") }}
            </b-form-radio>
            <b-form-radio
              v-model="form.lang"
              name="send-in"
              value="ar"
              class="mx-2 d-flex"
            >
              {{ $t("admin.arabic") }}
            </b-form-radio>
          </b-input-group>
        </div>
      </div>
      <div class="register-navigation">
        <div class="button-group">
          <button class="btn btn-primary" @click="sendBroadcastNotification">
            {{ $t("admin.send") }}
          </button>
        </div>
      </div>
    </div>
    <div class="mt-5">
      <hr />
    </div>
    <broadcast-list
      :key="'broad-cast-list-' + refreshCount"
      @resend="loadNotification"
    />
  </div>
</template>

<script>
import { notificationService } from "../../services";
import broadcastList from "./broadcast-list.vue";
export default {
  data() {
    return {
      form: {
        title: "",
        title_ar: "",
        message: "",
        message_ar: "",
        lang: "en",
      },
      formState: {
        title: null,
        title_ar: null,
        message: null,
        message_ar: null,
      },
      formSubmitted: false,
      loading: false,
      refreshCount: 0,
    };
  },
  components: {
    "broadcast-list": broadcastList,
  },
  mounted() {
    this.getBroadcastNotifications();
  },
  methods: {
    validateForm() {
      this.formState.title = this.form.title != "";
      this.formState.title_ar = this.form.title_ar != "";
      this.formState.message = this.form.message != "";
      this.formState.message_ar = this.form.message_ar != "";

      return !Object.values(this.formState).includes(false);
    },
    loadNotification(notification) {
      this.form.title = notification.title_en;
      this.form.title_ar = notification.title_ar;
      this.form.message = notification.message_en;
      this.form.message_ar = notification.message_ar;
      this.form.lang = notification.lang || "en";
    },
    sendBroadcastNotification() {
      this.formSubmitted = true;
      if (!this.validateForm()) {
        return;
      }

      let payload = {
        title: this.form["title" + (this.form.lang == "en" ? "" : "_ar")],
        message: this.form["message" + (this.form.lang == "en" ? "" : "_ar")],

        options: {
          sendToTopic: "all",
        },

        title_en: this.form.title,
        title_ar: this.form.title_ar,
        message_en: this.form.message,
        message_ar: this.form.message_ar,
        lang: this.form.lang,
      };

      this.confirmIconModal(
        this.$t("admin.broadcastNotification"),
        this.$t("admin.areYouSureSendNotification")
      ).then((res) => {
        if (res.value) {
          notificationService.sendBroadcastNotification(payload).then(
            (response) => {
              if (response.data.status) {
                this.successToast(this.$t("admin.notificationSent"));
                this.refreshList();
              } else {
                this.failureToast(response.data.message);
              }
            },
            (error) => {
              console.error(error);
              this.failureToast(error.response.data.message);
            }
          );
        }
      });
    },
    refreshList() {
      this.refreshCount++;
      this.resetForm();
    },
    getBroadcastNotifications() {
      notificationService.getBroadcastNotifications().then(
        (response) => {
          if (response.data.status) {
            console.log(response.data.data);
          } else {
            this.failureToast(response.data.message);
          }
        },
        (error) => {
          console.error(error);
          this.failureToast(error.response.data.message);
        }
      );
    },
    resetForm() {
      this.form = {
        title: "",
        title_ar: "",
        message: "",
        message_ar: "",
        lang: "en",
      };
      this.formState = {
        title: null,
        title_ar: null,
        message: null,
        message_ar: null,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.admin-form {
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