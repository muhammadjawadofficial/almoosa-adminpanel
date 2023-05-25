<template>
  <div class="doctor-details-container user-profile-container">
    <div class="doctor-details" v-if="getSelectedFamilyMember">
      <div class="doctor-details-card">
        <div class="standard-width page-body-container">
          <div class="doctor-details-card-header">
            <div class="doctor-details-card-header-image">
              <img
                :src="
                  getImageUrl(
                    typeof getSelectedFamilyMember.photo == 'string'
                      ? { path: getSelectedFamilyMember.photo }
                      : getSelectedFamilyMember.photo
                  )
                "
                alt="doctor-image"
              />
              <label
                for="user-profile-picture-upload"
                v-if="isEditingAllowed && !forceDisable"
              >
                {{ $t("profile.uploadPicture") }}
                <input
                  type="file"
                  @change="changeProfilePicture"
                  id="user-profile-picture-upload"
                  class="d-none"
                />
              </label>
            </div>
            <div class="doctor-details-card-header-right">
              <div class="doctor-details-card-header-right-info">
                <div class="doctor-details-card-header-right-info-name">
                  {{ getFullName(getSelectedFamilyMember) }}
                </div>
                <div class="doctor-details-card-header-right-info-user">
                  <div class="user-id">
                    {{ getSelectedFamilyMember.mrn_number || "N/A" }}
                  </div>
                </div>
                <div class="doctor-details-card-header-right-info-section">
                  <template v-if="getSelectedFamilyMember.nationality">
                    <div
                      class="doctor-details-card-header-right-info-section-detail"
                    >
                      <div class="title">{{ $t("profile.nationality") }}</div>
                      <div class="value">
                        {{
                          getSelectedFamilyMember.nationality[
                            getLocaleKey("nationality")
                          ] || getSelectedFamilyMember.nationality
                        }}
                      </div>
                    </div>
                  </template>
                  <template v-if="getSelectedFamilyMember.saudi_id">
                    <div
                      class="doctor-details-card-header-right-info-section-detail"
                    >
                      <div class="title">{{ $t("saudi_id") }}</div>
                      <div class="value">
                        {{ getSelectedFamilyMember.saudi_id }}
                      </div>
                    </div>
                  </template>
                  <template v-if="getSelectedFamilyMember.iqama">
                    <div
                      class="doctor-details-card-header-right-info-section-detail"
                    >
                      <div class="title">{{ $t("iqama") }}</div>
                      <div class="value">
                        {{ getSelectedFamilyMember.iqama }}
                      </div>
                    </div>
                  </template>
                  <template v-if="!isSelectedUserDoctor">
                    <div
                      class="doctor-details-card-header-right-info-section-detail with-icon"
                    >
                      <div class="icon">
                        <img
                          src="../../assets/images/star-points.svg"
                          alt="star-img"
                        />
                      </div>
                      <div class="content">
                        <div class="title">
                          {{ $t("profile.loyaltyPoint") }}
                        </div>
                        <div class="value">
                          {{ getSelectedFamilyMember.loyality_points || 0 }} /
                          <div class="sub-value">
                            {{ $t("equal") }}
                            {{
                              translateNumber(
                                (getSelectedFamilyMember.loyality_points || 0) /
                                  2
                              )
                            }}
                            {{ $t("sar") }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </template>
                  <template v-else>
                    <div
                      class="doctor-details-card-header-right-info-section-detail with-icon"
                    >
                      <div class="icon">
                        <img
                          src="../../assets/images/star-points.svg"
                          alt="star-img"
                        />
                      </div>
                      <div class="content">
                        <div class="title">
                          {{ $t("admin.rating") }}:
                          {{ getSelectedFamilyMember.rating || 0 }}/5
                        </div>
                        <div class="value mt-2">
                          <div class="rating-container disable-hover">
                            <div class="fa fa-star star"></div>
                            <div class="fa fa-star star"></div>
                            <div class="fa fa-star star"></div>
                            <div class="fa fa-star star"></div>
                            <div class="fa fa-star star"></div>
                            <div
                              class="rating-filled"
                              :style="
                                'width: ' +
                                ((getSelectedFamilyMember.rating || 0) / 5) *
                                  100 +
                                '%'
                              "
                            >
                              <div class="fa fa-star star active"></div>
                              <div class="fa fa-star star active"></div>
                              <div class="fa fa-star star active"></div>
                              <div class="fa fa-star star active"></div>
                              <div class="fa fa-star star active"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="standard-width doctor-details-section">
        <div class="">
          <div class="profile-info patient" v-if="!isSelectedUserDoctor">
            <div class="profile-info-card" v-if="false">
              <div class="profile-info-card-logo">
                <img src="../../assets/images/home.svg" alt="" />
              </div>
              <div class="profile-info-card-detail">
                <div class="profile-info-card-detail-title">
                  {{ $t("profile.address") }}
                </div>
                <div
                  class="profile-info-card-detail-value"
                  :class="{ inactive: !isEditing }"
                >
                  <b-form-input
                    v-model="address"
                    :state="addressState"
                    :placeholder="$t('profile.address')"
                    :disabled="!isEditing"
                  ></b-form-input>
                </div>
              </div>
              <div class="profile-info-card-option">
                <img
                  src="../../assets/images/pencil.svg"
                  alt=""
                  v-if="isEditing"
                />
              </div>
            </div>
            <div class="profile-info-card">
              <div class="profile-info-card-logo">
                <img src="../../assets/images/home.svg" alt="" />
              </div>
              <div class="profile-info-card-detail">
                <div class="profile-info-card-detail-title">
                  {{ $t("admin.area") }}
                </div>
                <div class="profile-info-card-detail-value">
                  {{ translateNumber(getSelectedFamilyMember.area || "N/A") }}
                </div>
              </div>
            </div>
            <div class="profile-info-card">
              <div class="profile-info-card-logo">
                <img src="../../assets/images/home.svg" alt="" />
              </div>
              <div class="profile-info-card-detail">
                <div class="profile-info-card-detail-title">
                  {{ $t("admin.city") }}
                </div>
                <div class="profile-info-card-detail-value">
                  {{ translateNumber(getSelectedFamilyMember.city || "N/A") }}
                </div>
              </div>
            </div>
            <div class="profile-info-card">
              <div class="profile-info-card-logo">
                <img src="../../assets/images/home.svg" alt="" />
              </div>
              <div class="profile-info-card-detail">
                <div class="profile-info-card-detail-title">
                  {{ $t("admin.district") }}
                </div>
                <div class="profile-info-card-detail-value">
                  {{
                    translateNumber(getSelectedFamilyMember.district || "N/A")
                  }}
                </div>
              </div>
            </div>
            <div class="profile-info-card">
              <div class="profile-info-card-logo">
                <img src="../../assets/images/active-problems.svg" alt="" />
              </div>
              <div class="profile-info-card-detail">
                <div class="profile-info-card-detail-title">
                  {{ $t("profile.activeProblem") }}
                </div>
                <div class="profile-info-card-detail-value">
                  Caries of dentine
                </div>
              </div>
              <div class="profile-info-card-option"></div>
            </div>
            <div class="profile-info-card">
              <div class="profile-info-card-logo">
                <img src="../../assets/images/clinical-warning.svg" alt="" />
              </div>
              <div class="profile-info-card-detail">
                <div class="profile-info-card-detail-title">
                  {{ $t("profile.clinicWarning") }}
                </div>
                <div class="profile-info-card-detail-value">Not Added Yet</div>
              </div>
              <div class="profile-info-card-option"></div>
            </div>
            <div class="profile-info-card">
              <div class="profile-info-card-logo">
                <img src="../../assets/images/MRN.svg" alt="" />
              </div>
              <div class="profile-info-card-detail">
                <div class="profile-info-card-detail-title">
                  {{ $t("admin.dob") }}
                </div>
                <div class="profile-info-card-detail-value">
                  {{ translateNumber(formatDate(getSelectedFamilyMember.dob)) }}
                </div>
              </div>
            </div>
            <div class="profile-info-card" v-if="false">
              <div class="profile-info-card-logo">
                <img src="../../assets/images/call.svg" alt="" />
              </div>
              <div class="profile-info-card-detail">
                <div class="profile-info-card-detail-title">
                  {{ $t("profile.phoneNumber") }}
                </div>
                <div
                  class="profile-info-card-detail-value"
                  :class="{ inactive: !isEditing }"
                >
                  <b-form-input
                    v-model="phoneNumber"
                    :state="phoneNumberState"
                    :placeholder="$t('profile.phoneNumber')"
                    :formatter="formatNumber"
                    :disabled="!isEditing"
                  ></b-form-input>
                </div>
              </div>
              <div class="profile-info-card-option">
                <img
                  src="../../assets/images/pencil.svg"
                  alt=""
                  v-if="isEditing"
                />
              </div>
            </div>
            <div class="profile-info-card">
              <div class="profile-info-card-logo">
                <img src="../../assets/images/call.svg" alt="" />
              </div>
              <div class="profile-info-card-detail">
                <div class="profile-info-card-detail-title">
                  {{ $t("admin.primaryPhoneNumber") }}
                </div>
                <div class="profile-info-card-detail-value">
                  {{
                    translateNumber(
                      getSelectedFamilyMember.phoneNumber ||
                        getSelectedFamilyMember.primary_phone_number ||
                        "N/A"
                    )
                  }}
                </div>
              </div>
            </div>
            <div class="profile-info-card">
              <div class="profile-info-card-logo">
                <img src="../../assets/images/call.svg" alt="" />
              </div>
              <div class="profile-info-card-detail">
                <div class="profile-info-card-detail-title">
                  {{ $t("admin.secondaryPhoneNumber") }}
                </div>
                <div class="profile-info-card-detail-value">
                  {{
                    translateNumber(
                      getSelectedFamilyMember.secondary_phone_number || "N/A"
                    )
                  }}
                </div>
              </div>
            </div>
            <div class="profile-info-card">
              <div class="profile-info-card-logo">
                <img src="../../assets/images/MRN.svg" alt="" />
              </div>
              <div class="profile-info-card-detail">
                <div class="profile-info-card-detail-title">
                  {{ $t("admin.mrn") }}
                </div>
                <div
                  class="profile-info-card-detail-value"
                  :class="{ inactive: !isEditing }"
                >
                  <b-form-input
                    v-model="mrnNumber"
                    :state="mrnNumberState"
                    :placeholder="
                      !isEditing && !mrnNumber ? 'N/A' : $t('admin.enterMRN')
                    "
                    :disabled="!isEditing"
                    :formatter="numberOnly"
                  ></b-form-input>
                </div>
              </div>
              <div class="profile-info-card-option">
                <img
                  src="../../assets/images/pencil.svg"
                  alt=""
                  v-if="isEditing"
                />
              </div>
            </div>
            <div class="profile-info-card">
              <div class="profile-info-card-logo">
                <img src="../../assets/images/heart-vitals-bg.svg" alt="" />
              </div>
              <div class="profile-info-card-detail">
                <div class="profile-info-card-detail-title">
                  {{ $t("admin.status") }}
                </div>
                <div
                  class="profile-info-card-detail-value"
                  :class="{ inactive: !isEditing && !isEditingStatus }"
                >
                  <multiselect
                    v-model="userStatus"
                    :options="userStatusOptions"
                    :placeholder="$t('admin.selectStatus')"
                    :selectLabel="$t('admin.selectLabel')"
                    :selectedLabel="$t('admin.selectedLabel')"
                    :deselectLabel="$t('admin.deselectLabel')"
                    :disabled="!isEditing && !isEditingStatus"
                  >
                    <template slot="singleLabel" slot-scope="props">
                      <div class="multiselect__with-icon">
                        {{ $t("admin." + props.option) }}
                      </div>
                    </template>
                    <template slot="option" slot-scope="props">
                      <div class="option__desc">
                        <span class="option__title">
                          {{ $t("admin." + props.option) }}
                        </span>
                      </div>
                    </template>
                  </multiselect>
                  <div
                    class="custom-state-invalid icon"
                    :class="{
                      'is-invalid': userStatusState == false,
                    }"
                  ></div>
                </div>
              </div>
              <div
                v-if="isEditing || isEditingStatus"
                class="profile-info-card-option"
              >
                <img src="../../assets/images/pencil.svg" alt="" />
              </div>
            </div>
            <div class="profile-info-card">
              <div class="profile-info-card-logo">
                <img src="../../assets/images/family-bg.svg" alt="" />
              </div>
              <div class="profile-info-card-detail">
                <div class="profile-info-card-detail-title">
                  {{ $t("admin.relation") }}
                </div>
                <div
                  class="profile-info-card-detail-value"
                  :class="{ inactive: !isEditing && !isEditingStatus }"
                >
                  <multiselect
                    v-model="selectedRelation"
                    :options="relations"
                    :preselectFirst="true"
                    :placeholder="$t('admin.selectRelation')"
                    :selectLabel="$t('admin.selectLabel')"
                    :selectedLabel="$t('admin.selectedLabel')"
                    :deselectLabel="$t('admin.deselectLabel')"
                    :disabled="!isEditing && !isEditingStatus"
                  >
                    <template slot="singleLabel" slot-scope="props">
                      {{ props.option[getLocaleKey("relation")] }}
                    </template>
                    <template slot="option" slot-scope="props">
                      <div class="option__desc">
                        <span class="option__title">
                          {{ props.option[getLocaleKey("relation")] }}
                        </span>
                      </div>
                    </template>
                  </multiselect>
                  <div
                    class="custom-state-invalid icon"
                    :class="{
                      'is-invalid': selectedRelationState == false,
                    }"
                  ></div>
                </div>
              </div>
              <div
                v-if="isEditing || isEditingStatus"
                class="profile-info-card-option"
              >
                <img src="../../assets/images/pencil.svg" alt="" />
              </div>
            </div>
            <div class="w-100">
              <div class="profile-info-card">
                <div class="profile-info-card-logo">
                  <img src="../../assets/images/active-problems.svg" alt="" />
                </div>
                <div class="profile-info-card-detail">
                  <div class="profile-info-card-detail-title">
                    {{ $t("admin.familyMemberDocument") }}
                    <i
                      v-if="documentToUpload"
                      class="fa fa-external-link"
                      @click="openDocument"
                    ></i>
                  </div>
                  <div
                    class="profile-info-card-detail-value"
                    :class="{ inactive: !isEditing && !isEditingStatus }"
                  >
                    <div class="iframe-container text-center">
                      <label for="user-profile-picture-upload">
                        <div
                          class="text-muted w200 center"
                          v-if="
                            !documentToUpload && !isEditing && !isEditingStatus
                          "
                        >
                          {{ $t("admin.noDocumentUploaded") }}
                        </div>
                        <div v-else-if="isEditing || isEditingStatus">
                          {{ $t("insurance.clickToUpload") }}
                        </div>
                        <iframe
                          v-if="documentToUpload"
                          :src="getImageUrl(documentToUpload)"
                          frameborder="0"
                          @click.stop="openDocument"
                        ></iframe>
                        <input
                          type="file"
                          @change="fileUpload"
                          id="user-profile-picture-upload"
                          class="d-none"
                          v-if="!hideFileInput"
                        />
                      </label>
                      <div
                        class="custom-state-invalid icon"
                        :class="{
                          'is-invalid': documentIdState == false,
                        }"
                      ></div>
                    </div>
                  </div>
                </div>
                <div
                  v-if="isEditing || isEditingStatus"
                  class="profile-info-card-option"
                >
                  <img src="../../assets/images/pencil.svg" alt="" />
                </div>
              </div>
            </div>
            <div
              class="profile-info-card"
              v-if="
                getSelectedFamilyMember.card && getSelectedFamilyMember.card.id
              "
            >
              <div class="profile-info-card-logo">
                <img src="../../assets/images/active-problems.svg" alt="" />
              </div>
              <div class="profile-info-card-detail">
                <div class="profile-info-card-detail-title">
                  {{ $t("profile.cardId") }}
                </div>
                <div class="profile-info-card-detail-value inactive">
                  <img
                    :src="getImageUrl(getSelectedFamilyMember.card)"
                    alt="card-id"
                    style="width: 100%; max-height: 200px; object-fit: contain"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="profile-info" v-else>
            <div class="profile-info-card">
              <div class="profile-info-card-logo">
                <img src="../../assets/images/location-bg.svg" alt="" />
              </div>
              <div class="profile-info-card-detail">
                <div class="profile-info-card-detail-title">
                  {{ $t("profile.clinics") }}
                </div>
                <div
                  class="profile-info-card-detail-value"
                  :class="{ inactive: !isEditing }"
                >
                  <multiselect
                    :disabled="!isEditing"
                    v-model="doctor.clinics"
                    :options="clinics"
                    :placeholder="
                      $t('profile.select') + ' ' + $t('profile.clinics')
                    "
                    multiple
                    track-by="id"
                    label="title"
                  >
                    <template slot="singleLabel" slot-scope="props">
                      {{ props.option[getLocaleKey("title")] }}
                    </template>
                    <template
                      slot="selection"
                      slot-scope="{ values, search, isOpen }"
                      ><span
                        class="multiselect__single"
                        v-if="values.length"
                        v-show="!isOpen"
                      >
                        {{
                          values
                            .map((x) => x[getLocaleKey("title")])
                            .join(" , ")
                        }}
                      </span>
                    </template>
                    <template slot="option" slot-scope="props">
                      {{ props.option[getLocaleKey("title")] }}
                    </template>
                  </multiselect>
                  <div
                    class="custom-state-invalid icon"
                    :class="{
                      'is-invalid': doctorState.clinicsState == false,
                    }"
                  ></div>
                </div>
              </div>
              <div class="profile-info-card-option">
                <img
                  src="../../assets/images/pencil.svg"
                  alt=""
                  v-if="isEditing"
                />
              </div>
            </div>
            <div class="profile-info-card">
              <div class="profile-info-card-logo">
                <img src="../../assets/images/heart-vitals-bg.svg" alt="" />
              </div>
              <div class="profile-info-card-detail">
                <div class="profile-info-card-detail-title">
                  {{ $t("profile.speciality") }}
                </div>
                <div class="profile-info-card-detail-value inactive">
                  {{
                    (doctor.speciality &&
                      doctor.speciality[getLocaleKey("title")]) ||
                    "N/A"
                  }}
                  <multiselect
                    v-if="false"
                    v-model="doctor.speciality"
                    disabled
                    :options="specialities"
                    :placeholder="
                      $t('profile.select') + ' ' + $t('profile.speciality')
                    "
                    track-by="id"
                    label="title"
                  >
                    <template slot="singleLabel" slot-scope="props">
                      {{ props.option[getLocaleKey("title")] }}
                    </template>

                    <template slot="option" slot-scope="props">
                      {{ props.option[getLocaleKey("title")] }}
                    </template>
                  </multiselect>
                  <div
                    class="custom-state-invalid icon"
                    :class="{
                      'is-invalid': doctorState.specialityState == false,
                    }"
                  ></div>
                </div>
              </div>
            </div>
            <div class="profile-info-card">
              <div class="profile-info-card-logo">
                <img src="../../assets/images/translate-bg.svg" alt="" />
              </div>
              <div class="profile-info-card-detail">
                <div class="profile-info-card-detail-title">
                  {{ $t("profile.languages") + " - " + $t("admin.english") }}
                </div>
                <div
                  class="profile-info-card-detail-value forceLtr"
                  :class="{ inactive: !isEditing }"
                >
                  <b-form-input
                    v-model="doctor.languages"
                    :state="doctorState.languagesState"
                    :placeholder="$t('profile.languages')"
                    :disabled="!isEditing"
                  ></b-form-input>
                </div>
              </div>
              <div class="profile-info-card-option">
                <img
                  src="../../assets/images/pencil.svg"
                  alt=""
                  v-if="isEditing"
                />
              </div>
            </div>
            <div class="profile-info-card">
              <div class="profile-info-card-logo">
                <img src="../../assets/images/flag-bg.svg" alt="" />
              </div>
              <div class="profile-info-card-detail">
                <div class="profile-info-card-detail-title">
                  {{ $t("profile.nationality") }}
                </div>
                <div
                  class="profile-info-card-detail-value"
                  :class="{ inactive: !isEditing }"
                >
                  <!-- {{
                    (doctor.nationality &&
                      doctor.nationality[getLocaleKey("nationality")]) ||
                    "N/A"
                  }} -->
                  <multiselect
                    :disabled="!isEditing"
                    v-model="doctor.nationality"
                    :options="nationalities"
                    track-by="id"
                    label="nationality"
                    :placeholder="
                      $t('profile.select') + ' ' + $t('profile.nationality')
                    "
                  >
                    <template slot="singleLabel" slot-scope="props">
                      {{ props.option[getLocaleKey("nationality")] }}
                    </template>

                    <template slot="option" slot-scope="props">
                      {{ props.option[getLocaleKey("nationality")] }}
                    </template>
                  </multiselect>
                  <div
                    class="custom-state-invalid icon"
                    :class="{
                      'is-invalid': doctorState.nationalityState == false,
                    }"
                  ></div>
                </div>
              </div>
              <div class="profile-info-card-option">
                <img
                  src="../../assets/images/pencil.svg"
                  alt=""
                  v-if="isEditing"
                />
              </div>
            </div>
            <div class="profile-info-card">
              <div class="profile-info-card-logo">
                <img src="../../assets/images/doctor-bg.svg" alt="" />
              </div>
              <div class="profile-info-card-detail">
                <div class="profile-info-card-detail-title">
                  {{ $t("profile.expertise") + " - " + $t("admin.english") }}
                </div>
                <div
                  class="profile-info-card-detail-value forceLtr"
                  :class="{ inactive: !isEditing }"
                >
                  <b-form-textarea
                    v-model="doctor.expertise"
                    :state="doctorState.expertiseState"
                    :placeholder="$t('profile.expertise')"
                    :disabled="!isEditing"
                    no-resize
                    rows="3"
                    max-rows="3"
                  ></b-form-textarea>
                </div>
              </div>
              <div class="profile-info-card-option">
                <img
                  src="../../assets/images/pencil.svg"
                  alt=""
                  v-if="isEditing"
                />
              </div>
            </div>
            <div class="profile-info-card">
              <div class="profile-info-card-logo">
                <img src="../../assets/images/doctor-bg-sec.svg" alt="" />
              </div>
              <div class="profile-info-card-detail">
                <div class="profile-info-card-detail-title">
                  {{ $t("profile.expertise") + " - " + $t("admin.arabic") }}
                </div>
                <div
                  class="profile-info-card-detail-value forceRtl"
                  :class="{ inactive: !isEditing }"
                >
                  <b-form-textarea
                    v-model="doctor.expertiseAr"
                    :state="doctorState.expertiseArState"
                    :placeholder="
                      $t('profile.expertise') + ' - ' + $t('admin.arabic')
                    "
                    :disabled="!isEditing"
                    no-resize
                    rows="3"
                    max-rows="3"
                  ></b-form-textarea>
                </div>
              </div>
              <div class="profile-info-card-option">
                <img
                  src="../../assets/images/pencil.svg"
                  alt=""
                  v-if="isEditing"
                />
              </div>
            </div>
            <div class="profile-info-card">
              <div class="profile-info-card-logo">
                <img src="../../assets/images/family-bg.svg" alt="" />
              </div>
              <div class="profile-info-card-detail">
                <div class="profile-info-card-detail-title">
                  {{ $t("profile.consulting") + " - " + $t("admin.english") }}
                </div>
                <div
                  class="profile-info-card-detail-value forceLtr"
                  :class="{ inactive: !isEditing }"
                >
                  <b-form-input
                    v-model="doctor.consulting"
                    :state="doctorState.consultingState"
                    :placeholder="$t('profile.consulting')"
                    :disabled="!isEditing"
                  ></b-form-input>
                </div>
              </div>
              <div class="profile-info-card-option">
                <img
                  src="../../assets/images/pencil.svg"
                  alt=""
                  v-if="isEditing"
                />
              </div>
            </div>
            <div class="profile-info-card">
              <div class="profile-info-card-logo">
                <img src="../../assets/images/family-bg-sec.svg" alt="" />
              </div>
              <div class="profile-info-card-detail">
                <div class="profile-info-card-detail-title">
                  {{ $t("profile.consulting") + " - " + $t("admin.arabic") }}
                </div>
                <div
                  class="profile-info-card-detail-value forceRtl"
                  :class="{ inactive: !isEditing }"
                >
                  <b-form-input
                    v-model="doctor.consultingAr"
                    :state="doctorState.consultingArState"
                    :placeholder="
                      $t('profile.consulting') + ' - ' + $t('admin.arabic')
                    "
                    :disabled="!isEditing"
                  ></b-form-input>
                </div>
              </div>
              <div class="profile-info-card-option">
                <img
                  src="../../assets/images/pencil.svg"
                  alt=""
                  v-if="isEditing"
                />
              </div>
            </div>
            <div class="profile-info-card">
              <div class="profile-info-card-logo">
                <img src="../../assets/images/translate-bg.svg" alt="" />
              </div>
              <div class="profile-info-card-detail">
                <div class="profile-info-card-detail-title">
                  {{ $t("profile.languages") + " - " + $t("admin.arabic") }}
                </div>
                <div
                  class="profile-info-card-detail-value forceRtl"
                  :class="{ inactive: !isEditing }"
                >
                  <b-form-input
                    v-model="doctor.languagesAr"
                    :state="doctorState.languagesArState"
                    :placeholder="
                      $t('profile.languages') + ' - ' + $t('admin.arabic')
                    "
                    :disabled="!isEditing"
                  ></b-form-input>
                </div>
              </div>
              <div class="profile-info-card-option">
                <img
                  src="../../assets/images/pencil.svg"
                  alt=""
                  v-if="isEditing"
                />
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12 button-group">
              <button
                class="btn btn-secondary"
                @click="editProfile"
                v-if="isEditingAllowed"
              >
                {{
                  isEditing
                    ? $t("profile.updateProfile")
                    : $t("profile.editProfile")
                }}
              </button>
              <button
                class="btn btn-secondary"
                @click="editFamilyMemberRequestStatus"
                v-if="isStatusEditingAllowed && getSelectedFamilyMember.status"
              >
                {{
                  isEditingStatus
                    ? $t("profile.updateProfile")
                    : $t("profile.editProfile")
                }}
              </button>
              <button
                class="btn"
                :class="
                  (isEditingAllowed || isStatusEditingAllowed) &&
                  getSelectedFamilyMember.status
                    ? 'btn-tertiary'
                    : 'btn-secondary'
                "
                @click="cancelEditing"
              >
                {{ isEditing || isEditingStatus ? $t("cancel") : $t("back") }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { authService, familyMemberService, userService } from "../../services";
export default {
  data() {
    return {
      user: null,
      isEditing: false,
      isEditingStatus: false,
      address: "",
      addressState: null,
      phoneNumber: "",
      phoneNumberState: null,
      mrnNumber: "",
      mrnNumberState: null,
      userStatus: null,
      userStatusState: null,
      documentId: null,
      documentIdState: null,
      userStatusOptions: ["pending", "approved", "rejected"],
      doctor: {
        clinics: [],
        speciality: {},
        expertise: "",
        expertiseAr: "",
        nationality: {},
        languages: "",
        languagesAr: "",
        consulting: "",
        consultingAr: "",
      },
      doctorState: {
        clinicsState: null,
        specialityState: null,
        expertiseState: null,
        expertiseArState: null,
        nationalityState: null,
        languagesState: null,
        languagesArState: null,
        consultingState: null,
        consultingArState: null,
      },
      nationalities: [],
      clinics: [],
      specialities: [],
      isEditingAllowed: false,
      isStatusEditingAllowed: false,
      backRoute: "",
      activeTab: "english",
      forceDisable: false,
      validationdropzoneOptions: {
        url: "http://localhost:8080",
        thumbnailWidth: 150,
        acceptedFiles: ["application/pdf"],
        maxFiles: 1,
        dictDefaultMessage: "",
      },
      documentToUpload: null,
      relations: [],
      selectedRelation: null,
      selectedRelationState: null,
      hideFileInput: false,
    };
  },
  mounted() {
    this.forceDisable = false;
    if (process.env.NODE_ENV !== "production") {
      this.isEditingAllowed = !!localStorage.getItem("editProfile");
    }
    let routeName = this.$route.name.toLowerCase();
    if (routeName.includes("patient")) {
      this.backRoute = "Patient Family Members";
    } else {
      this.backRoute = "Family Members List";
    }
    if (!this.getSelectedFamilyMember) {
      this.navigateTo(this.backRoute);
      return;
    }
    if (!this.isSelectedUserDoctor) {
      this.isStatusEditingAllowed = true;
      // this.forceDisable = true;
    }
    this.initializeData();
    this.checkDropdownValues();
  },
  computed: {
    ...mapGetters("familyMember", [
      "getSelectedFamilyMember",
      "getSelectedFamilyMemberRequest",
    ]),
    validPhoneNumber() {
      let regex = /^(009665|9665|\+9665|05|5)([503649187])(\d{7})$/;
      let result = this.phoneNumber.match(regex);
      return !!(result && result.length);
    },
    isSelectedUserDoctor() {
      return this.$route.name.toLowerCase().includes("physician");
    },
  },
  methods: {
    ...mapActions("familyMember", ["updateSelectedFamilyMember"]),
    changeTab(tab) {
      this.activeTab = tab;
    },
    fileUpload(e) {
      let file = e.target.files[0];
      authService.uploadPdf(file).then(
        (res) => {
          if (res.data.status) {
            this.documentId = res.data.data.id;
            this.documentToUpload = res.data.data;
            this.successToast(this.$t("admin.documentUploaded"));
          } else {
            this.failureToast(res.data.message);
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
    openDocument() {
      window.open(this.getImageUrl(this.documentToUpload), "_blank");
    },
    changeProfilePicture(e) {
      let file = e.target.files[0];
      if (!file) {
        return;
      }
      authService.uploadId(file).then(
        (res) => {
          if (res.data.status) {
            this.updateProfilePicture(
              { photo: res.data.data },
              { photo_id: res.data.data.id }
            );
          } else {
            this.failureToast(res.data.message);
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
    checkDropdownValues() {
      if (this.isSelectedUserDoctor) {
        Promise.all([
          authService.getNationalities(),
          authService.getClinics(),
          authService.getSpecialities(),
        ])
          .then((res) => {
            let nationalities = res[0];
            let clinics = res[1];
            let specialities = res[2];
            if (nationalities.data.status) {
              let data = nationalities.data.data;
              if (data) {
                this.nationalities = data.items;
              }
            } else {
              this.failureToast(nationalities.data.message);
            }
            if (clinics.data.status) {
              let data = clinics.data.data;
              if (data) {
                this.clinics = data.items;
              }
            } else {
              this.failureToast(clinics.data.message);
            }
            if (specialities.data.status) {
              let data = specialities.data.data;
              if (data) {
                this.specialities = data.items;
              }
            } else {
              this.failureToast(specialities.data.message);
            }
          })
          .catch((error) => {
            if (!this.isAPIAborted(error))
              this.failureToast(
                error.response &&
                  error.response.data &&
                  error.response.data.message
              );
          })
          .finally(() => {
            this.getProfileData();
          });
      } else {
        console.log("running");
        Promise.all([familyMemberService.fetchFamilyMemberRelations()])
          .then((res) => {
            let relations = res[0];
            if (relations.data.status) {
              let data = relations.data.data;
              if (data) {
                this.relations = data.items;
              }
            } else {
              this.failureToast(relations.data.message);
            }
          })
          .catch((error) => {
            if (!this.isAPIAborted(error))
              this.failureToast(
                error.response &&
                  error.response.data &&
                  error.response.data.message
              );
          })
          .finally(() => {
            this.getProfileData();
          });
      }
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
    initializeData() {
      this.resetData();
    },
    getProfileData() {
      if (
        this.getSelectedFamilyMember.role_id == 4 ||
        !this.getSelectedFamilyMember.mrn_number
      )
        this.getDoctorProfile();
      else this.getLoggedInUserData();
    },
    getDoctorProfile() {
      userService.getDoctorProfile(this.getSelectedFamilyMember.id).then(
        (res) => {
          if (res.data.status) {
            this.updateSelectedFamilyMember(res.data.data.items[0]);
            this.resetData();
          } else {
            this.failureToast(res.data.message);
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
    getLoggedInUserData() {
      userService
        .getProfile(
          this.getSelectedFamilyMember.role_id == 4 ? "doctor" : "patient",
          this.getSelectedFamilyMember.role_id == 4
            ? this.getSelectedFamilyMember.id
            : this.getSelectedFamilyMember.mrn_number
        )
        .then(
          (res) => {
            if (res.data.status) {
              this.updateSelectedFamilyMember(res.data.data);
              this.resetData();
            } else {
              this.failureToast(res.data.message);
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
    resetData() {
      if (this.isSelectedUserDoctor) {
        this.doctor.clinics = this.getSelectedFamilyMember.clinics || [];
        this.doctor.speciality = this.getSelectedFamilyMember.speciality;
        this.doctor.nationality = this.getSelectedFamilyMember.nationality;
        this.doctor.expertise = this.getSelectedFamilyMember.expertise;
        this.doctor.expertiseAr = this.getSelectedFamilyMember.expertise_ar;
        this.doctor.languages = this.getSelectedFamilyMember.languages;
        this.doctor.languagesAr = this.getSelectedFamilyMember.languages_ar;
        this.doctor.consulting =
          this.getSelectedFamilyMember.consulting_age_group;
        this.doctor.consultingAr =
          this.getSelectedFamilyMember.consulting_age_group_ar;
        this.doctorState = {
          clinicsState: null,
          specialityState: null,
          expertiseState: null,
          expertiseArState: null,
          nationalityState: null,
          languagesState: null,
          languagesArState: null,
          consultingState: null,
          consultingArState: null,
        };
      } else {
        this.address = this.getSelectedFamilyMember.location;
        this.phoneNumber = this.getSelectedFamilyMember.phone_number;
        this.mrnNumber = this.getSelectedFamilyMember.mrn_number;
        this.userStatus = this.getSelectedFamilyMemberRequest.status;
        this.phoneNumberState = null;
        this.mrnNumberState = null;
        this.userStatusState = null;
        this.selectedRelation = this.getSelectedFamilyMemberRequest.relation;
        this.documentToUpload = null;
        this.documentId = null;
        this.documentIdState = null;
        this.selectedRelationState = null;
        let thumbnail = this.getSelectedFamilyMemberRequest.document;
        if (thumbnail) {
          this.documentId = this.getSelectedFamilyMemberRequest.document_id;
          let image = thumbnail;
          this.documentToUpload = image;
        } else {
          this.hideFileInput = true;
          setTimeout(() => {
            this.hideFileInput = false;
          }, 100);
        }
      }
      this.isEditing = false;
      this.isEditingStatus = false;
    },
    validateForm() {
      if (this.isSelectedUserDoctor) {
        this.doctorState.clinicsState =
          this.doctor.clinics != [] &&
          this.doctor.clinics.length > 0 &&
          !!this.doctor.clinics;
        this.doctorState.expertiseState =
          this.doctor.expertise != "" && !!this.doctor.expertise;
        this.doctorState.expertiseArState =
          this.doctor.expertiseAr != "" && !!this.doctor.expertiseAr;
        this.doctorState.languagesState =
          this.doctor.languages != "" && !!this.doctor.languages;
        this.doctorState.languagesArState =
          this.doctor.languagesAr != "" && !!this.doctor.languagesAr;
        this.doctorState.consultingState =
          this.doctor.consulting != "" && !!this.doctor.consulting;
        this.doctorState.consultingArState =
          this.doctor.consultingAr != "" && !!this.doctor.consultingAr;
        return !Object.values(this.doctorState).includes(false);
      } else {
        this.addressState = this.address != "";
        this.phoneNumberState = this.validPhoneNumber;
        return this.addressState && this.phoneNumberState;
      }
    },
    validateFamilyMemberUpdateForm() {
      this.userStatusState =
        this.userStatus != "" &&
        !!this.userStatus &&
        this.userStatusOptions.includes(this.userStatus);
      this.documentIdState = this.documentId != null;
      this.selectedRelationState = this.selectedRelation != null;
      return (
        this.userStatusState &&
        this.documentIdState &&
        this.selectedRelationState
      );
    },
    editProfile() {
      if (this.isEditing) {
        if (!this.validateForm()) {
          return;
        }
        let updateUserObj = {};
        if (this.isSelectedUserDoctor) {
          if (
            this.getSelectedFamilyMember.clinics &&
            this.doctor.clinics &&
            this.getSelectedFamilyMember.clinics.map((x) => x.id).join(",") !==
              this.doctor.clinics.map((x) => x.id).join(",")
          ) {
            updateUserObj.clinics = this.doctor.clinics.map((x) => x.id);
          }
          if (
            this.getSelectedFamilyMember.expertise !== this.doctor.expertise
          ) {
            updateUserObj.expertise = this.doctor.expertise;
          }
          if (
            this.getSelectedFamilyMember.expertiseAr !== this.doctor.expertiseAr
          ) {
            updateUserObj.expertise_ar = this.doctor.expertiseAr;
          }
          if (
            this.getSelectedFamilyMember.languages !== this.doctor.languages
          ) {
            updateUserObj.languages = this.doctor.languages;
          }
          if (
            this.getSelectedFamilyMember.languagesAr !== this.doctor.languagesAr
          ) {
            updateUserObj.languages_ar = this.doctor.languagesAr;
          }
          if (
            this.getSelectedFamilyMember.nationality_id !==
            this.doctor.nationality.id
          ) {
            updateUserObj.nationality_id = this.doctor.nationality.id;
          }
          if (
            this.getSelectedFamilyMember.consulting_age_group !==
            this.doctor.consulting
          ) {
            updateUserObj.consulting_age_group = this.doctor.consulting;
          }
          if (
            this.getSelectedFamilyMember.consulting_age_group_ar !==
            this.doctor.consultingAr
          ) {
            updateUserObj.consulting_age_group_ar = this.doctor.consultingAr;
          }
        } else {
          updateUserObj = {
            location: this.address,
            phone_number: this.phoneNumber,
          };
        }
        this.updateProfileInfo(updateUserObj);
      } else {
        this.isEditing = true;
      }
    },
    editFamilyMemberRequestStatus() {
      if (this.isEditingStatus) {
        if (!this.validateFamilyMemberUpdateForm()) {
          return;
        }
        let updateUserObj = {
          id: this.getSelectedFamilyMemberRequest.id,
          guardian_id: this.getSelectedFamilyMemberRequest.guardian_id,
          document_id: this.documentId,
          relation_id: this.selectedRelation.id,
          phone_number: this.getSelectedFamilyMember.phone_number,
          saudi_id: this.getSelectedFamilyMember.saudi_id,
          iqama: this.getSelectedFamilyMember.iqama,
          status: this.userStatus,
        };
        this.updateFamilyMemberRequest(updateUserObj);
      } else {
        this.isEditingStatus = true;
      }
    },
    updateFamilyMemberRequest(payload) {
      familyMemberService.updateFamilyMember(payload).then(
        (res) => {
          if (res.data.status) {
            this.getSelectedFamilyMemberRequest.status = this.userStatus;
            this.successToast(this.$t("profile.updateSuccess"));
            this.getSelectedFamilyMemberRequest.document =
              this.documentToUpload;
            this.getSelectedFamilyMemberRequest.relation =
              this.selectedRelation;
            this.getSelectedFamilyMemberRequest.document_id = this.documentId;
            this.getSelectedFamilyMemberRequest.relation_id =
              this.selectedRelation.id;
            this.resetData();
          } else {
            this.failureToast(res.data.message);
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
    updateProfileInfo(data) {
      userService.updateProfile(this.getSelectedFamilyMember.id, data).then(
        (res) => {
          if (res.data.status) {
            this.getProfileData();
            this.successToast(this.$t("profile.updateSuccess"));
            this.resetData();
          } else {
            this.failureToast(res.data.message);
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
    updateProfilePicture(data, data_id) {
      userService.updateProfile(this.getSelectedFamilyMember.id, data_id).then(
        (res) => {
          if (res.data.status) {
            let obj = { ...data };
            let doctorObj = { photo: data.photo.path };
            let saveObj = this.isSelectedUserDoctor ? doctorObj : obj;
            this.updateSelectedFamilyMember({ ...saveObj });
            this.successToast(this.$t("profile.updateSuccess"));
            this.resetData();
          } else {
            this.failureToast(res.data.message);
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
    cancelEditing() {
      if (this.isEditing || this.isEditingStatus) {
        this.resetData();
      } else {
        this.navigateTo(this.backRoute);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.button-group {
  margin-top: 10rem;

  button {
    padding-block-start: 0.5rem;
    padding-block-end: 0.4rem;
    border-radius: 6px;
  }

  button.btn-secondary {
    font-size: 1.25rem;
    max-width: fit-content;
    min-width: 12.5rem;
  }

  button.btn-tertiary {
    max-width: 7.25rem !important;
    font-size: 1.125rem;
  }
}

.doctor-details-card-header-image {
  position: relative;

  label {
    position: absolute;
    bottom: -3.5rem;
    left: 0;
    right: 0;
    height: 3.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 0.2s bottom;
    width: 100%;
    font-size: 1rem;
    color: var(--theme-tertiary);
    margin: 0;
    padding-bottom: 1rem;
    isolation: isolate;
    cursor: pointer;

    &::before {
      content: "";
      background: var(--theme-secondary);
      filter: opacity(0.5);
      position: absolute;
      inset: 0;
      z-index: -1;
    }
  }

  &:hover {
    label {
      bottom: 0;
    }
  }
}

.rating-container {
  .star {
    width: 1.5rem;
    height: 1.5rem;
    min-width: 1.5rem;
    font-size: 1.5rem;
  }

  .rating-filled {
    position: absolute;
    display: flex;
    overflow: hidden;
    left: 0;
  }
}
</style>