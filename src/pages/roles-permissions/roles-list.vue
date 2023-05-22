<template>
  <div class="doctor-list-container page-body-container standard-width">
    <div class="search-box full-width mb-5">
      <div class="search-icon">
        <i class="fa fa-search" aria-hidden="true"></i>
      </div>
      <div class="search-input">
        <b-form-input
          :placeholder="$t('admin.searchRole')"
          id="type-search"
          type="search"
          v-model="searchQuery"
          debounce="1000"
        ></b-form-input>
      </div>
    </div>

    <div class="no-data" v-if="filteredRoles == null">
      {{ $t("loading") }}
    </div>
    <div class="no-data" v-else-if="!filteredRoles.length">
      {{ $t("noData") }}
    </div>
    <div class="row" v-else>
      <div class="col-md-10 accordion">
        <b-card
          no-body
          class="transparent mb-2"
          v-for="(section, index) in filteredRoles"
          :key="'section-' + index"
        >
          <b-card-header
            header-tag="header"
            class="p-1 accordion-tab"
            role="tab"
          >
            <b-button block v-b-toggle="'accordion-' + index">
              {{ section[getLocaleKey("title")] || "N/A" }}
              <div class="icon"></div>
            </b-button>
          </b-card-header>
          <b-collapse
            :id="'accordion-' + index"
            accordion="my-accordion"
            role="tabpanel"
            @show="fetchDetails(section.id, index)"
            @hide="resetPermissions()"
          >
            <b-card-body>
              <template v-if="section.title">
                <b-card-text>
                  <div class="row">
                    <div
                      class="col-sm-6"
                      v-for="permission in activePermissions"
                      :key="'permission-' + permission.id"
                    >
                      <b-form-checkbox
                        :id="'checkbox-' + section.id + '-' + permission.id"
                        v-model="permission.checked"
                        :name="'checkbox-' + section.id + '-' + permission.id"
                        class="role-checkbox"
                      >
                        {{ permission[getLocaleKey("title")] || "N/A" }}
                      </b-form-checkbox>
                    </div>
                  </div>
                  <div class="row mt-3">
                    <div class="col-sm-12">
                      <b-button
                        variant="primary"
                        class="btn btn-primary btn-block"
                        @click="updateRolePermissions(section.id)"
                      >
                        {{ $t("admin.update") }}
                      </b-button>
                    </div>
                  </div>
                </b-card-text>
              </template>
              <template v-else>
                <b-card-text>
                  <div class="description">
                    {{ $t("noData") }}
                  </div>
                </b-card-text>
              </template>
            </b-card-body>
          </b-collapse>
        </b-card>
      </div>
    </div>
  </div>
</template>

<script>
import { rolesPermissionsService } from "../../services";
export default {
  data() {
    return {
      searchQuery: "",
      roles: [],
      permissions: [],
      activePermissions: [],
      filteredRoles: null,
    };
  },
  mounted() {
    this.fetchData();
  },
  watch: {
    searchQuery(val) {
      this.filteredRoles = this.roles.filter((item) =>
        item[this.getLocaleKey("title")]
          .toLowerCase()
          .includes(val.toLowerCase())
      );
    },
  },
  methods: {
    updateRolePermissions(id) {
      let permissions = this.activePermissions
        .filter((item) => item.checked)
        .map((item) => item.id);
      rolesPermissionsService
        .updateRolePermissions(id, permissions)
        .then((res) => {
          if (res.data.status) {
            this.successToast(res.data.message);
          } else {
            this.failureToast(res.data.message);
          }
        })
        .catch((error) => {
          if (!this.isAPIAborted(error))
            this.failureToast(
              error.response &&
                error.response.data &&
                error.response.data.message
            );
        });
    },
    resetPermissions() {
      this.activePermissions = [
        ...this.permissions.map((item) => {
          return {
            ...item,
            checked: false,
          };
        }),
      ];
    },
    fetchDetails(id) {
      rolesPermissionsService
        .fetchRoleDetails(id)
        .then((res) => {
          if (res.data.status) {
            let permissionId = res.data.data.items.map((x) => x.permission_id);
            this.activePermissions = this.activePermissions.map((item) => {
              item.checked = permissionId.includes(item.id);
              return item;
            });
          } else {
            this.failureToast(res.data.message);
          }
        })
        .catch((error) => {
          if (!this.isAPIAborted(error))
            this.failureToast(
              error.response &&
                error.response.data &&
                error.response.data.message
            );
        });
    },
    fetchData() {
      this.roles = [];
      this.permissions = [];
      Promise.all([
        rolesPermissionsService.fetchRolesList(),
        rolesPermissionsService.fetchPermissionsList(),
      ])
        .then((res) => {
          let roles = res[0];
          if (roles.data.status) {
            this.roles = roles.data.data.items.filter((x) => ![1,3,4].includes(x.id));
            this.filteredRoles = [...this.roles];
          } else {
            this.failureToast(roles.data.messsage);
            this.filteredRoles = [];
            this.roles = [];
          }

          let permissions = res[1];
          if (permissions.data.status) {
            this.permissions = permissions.data.data.items;
            this.resetPermissions();
          } else {
            this.failureToast(permissions.data.message);
          }
        })
        .catch((error) => {
          this.filteredRoles = [];
          this.roles = [];
          if (!this.isAPIAborted(error))
            this.failureToast(
              error.response &&
                error.response.data &&
                error.response.data.message
            );
        })
        .finally(() => {
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.accordion {
  .card {
    &:has(.not-collapsed) {
      .accordion-tab {
        .btn {
          background-color: var(--theme-secondary) !important;
          border-color: var(--theme-secondary) !important;
          color: var(--theme-tertiary);
          font-family: "DiodrumArabicSemiBold";
          .icon {
            transform: rotateZ(90deg);
          }
        }
      }
    }
    .card-header {
      .btn {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.75rem;
        gap: 1rem;
        border-radius: 12px;
        font-family: "DiodrumArabicSemiBold";
        cursor: default;
        > div {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
      }
    }
    .accordion-tab {
      border-bottom: none;
      .btn {
        background-color: var(--theme-tertiary) !important;
        border-color: var(--theme-tertiary) !important;
        color: var(--theme-secondary);
        font-family: "DiodrumArabicMedium";
        cursor: pointer;
        .icon {
          &::before {
            content: "\F054";
          }
          transition: 0.2s transform;
          display: inline-block;
          font: normal normal normal 14px/1 FontAwesome;
          font-size: 0.75em;
          text-rendering: auto;
          -webkit-font-smoothing: antialiased;
        }
      }
    }
    .card-body {
      padding-block: 1rem;
      padding-inline: 1rem;
      .card-text {
        .heading {
          font-size: 1rem;
          color: var(--theme-default);
        }
        .description {
          font-size: 1rem;
          color: black;
          line-height: 1.2em;
          margin-bottom: 0.5em;
        }
      }
    }
  }
}
.role-checkbox {
  display: flex;
  align-items: center;
  padding-left: 1.75rem;
  :deep {
    input:checked ~ label {
      &:before {
        border-color: var(--theme-default);
        background-color: var(--theme-default);
      }
    }
    label {
      cursor: pointer;
      font-family: "DiodrumArabicMedium";
      font-size: 1rem;
      &:before,
      &:after {
        top: 0;
        bottom: 0;
        margin: auto;
        width: 1.25rem;
        height: 1.25rem;
        left: -1.75rem;
      }
    }
  }
}
</style>