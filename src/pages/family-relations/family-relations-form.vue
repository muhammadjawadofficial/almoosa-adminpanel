<template>
  <div class="login-card standard-width page-body-container">
    <back-navigation
      :title="$t('admin.' + (relationId ? 'updateRelation' : 'addRelation'))"
      backLink="Family Relations List"
      :showBack="relationId"
    />
    <div class="add-family-relation-form">
      <div class="row">
        <div class="col-xl-4 col-md-6">
          <b-input-group class="custom-login-input-groups same-height forceLtr">
            <b-form-input
              v-model="registerForm.relation"
              :state="registerFormState.relation"
              :placeholder="
                $t('admin.relation') + ' (' + $t('admin.english') + ')'
              "
            ></b-form-input>
          </b-input-group>
        </div>
        <div class="col-xl-4 col-md-6">
          <b-input-group class="custom-login-input-groups same-height forceRtl">
            <b-form-input
              v-model="registerForm.relation_ar"
              :state="registerFormState.relation_ar"
              :placeholder="
                $t('admin.relation') + ' (' + $t('admin.arabic') + ')'
              "
            ></b-form-input>
          </b-input-group>
        </div>
      </div>
      <div class="register-navigation">
        <div class="button-group">
          <button
            class="btn btn-primary"
            @click="updateFamilyMemberRelation"
            v-if="relationId"
          >
            {{ $t("admin.update") }}
          </button>
          <button
            class="btn btn-primary"
            @click="addFamilyMemberRelation"
            v-else
          >
            {{ $t("admin.create") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { familyMemberService } from "../../services";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      registerForm: {
        relation: "",
        relation_ar: "",
      },
      registerFormState: {
        relation: null,
        relation_ar: null,
      },
      relationId: null,
      formSubmitted: false,
      loading: false,
    };
  },
  computed: {
    ...mapGetters("familyMember", ["getSelectedFamilyMemberRelation"]),
  },
  mounted() {
    if (this.$route.name.toLowerCase().includes("edit")) {
      if (!this.getSelectedFamilyMemberRelation) {
        this.navigateTo("Family Relations List");
        return;
      }
      this.initializeData();
    }
  },
  watch: {
    $route: function (val) {
      if (val.name.toLowerCase().includes("create")) {
        this.relationId = null;
        this.resetForm();
      }
    },
  },
  methods: {
    initializeData() {
      this.registerForm.relation =
        this.getSelectedFamilyMemberRelation.relation;
      this.registerForm.relation_ar =
        this.getSelectedFamilyMemberRelation.relation_ar;
      this.relationId = this.getSelectedFamilyMemberRelation.id;
    },
    validateForm() {
      this.registerFormState.relation = this.registerForm.relation != "";
      this.registerFormState.relation_ar = this.registerForm.relation_ar != "";

      return !Object.values(this.registerFormState).includes(false);
    },
    addFamilyMemberRelation() {
      this.formSubmitted = true;
      if (!this.validateForm()) {
        return;
      }
      familyMemberService.addFamilyMemberRelation(this.registerForm).then(
        (response) => {
          if (response.data.status) {
            this.successIconModal(
              this.$t("admin.addRelation"),
              this.$t("admin.relationAddedSuccess")
            ).then(() => {
              this.navigateTo("Family Relations List");
            });
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
    updateFamilyMemberRelation() {
      this.formSubmitted = true;
      if (!this.validateForm()) {
        return;
      }
      familyMemberService
        .updateFamilyMemberRelation({
          id: this.relationId,
          ...this.registerForm,
        })
        .then(
          (response) => {
            if (response.data.status) {
              this.successIconModal(
                this.$t("admin.updateRelation"),
                this.$t("admin.relationUpdatedSuccess")
              ).then(() => {
                this.navigateTo("Family Relations List");
              });
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
      this.registerForm = {
        relation: "",
        relation_ar: "",
      };
      this.registerFormState = {
        relation: null,
        relation_ar: null,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.add-family-relation-form {
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