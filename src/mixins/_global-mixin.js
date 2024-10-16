import { mapGetters } from 'vuex';
import { appointmentService, userService } from '../services';
import { axios } from '../services/axios';
import constants from '../constants/constants';

export default {
    data() {
        return {
            restartEnabled: false,
            checkRoleFromUser: false,
            constants
        }
    },
    filters: {
        capitalize: function (value) {
            if (!value) return ''
            value = value.toString()
            return value.charAt(0).toUpperCase() + value.slice(1)
        }
    },
    computed: {
        ...mapGetters("user", ["getUserRole", "getUserInfo", "getIsGuest", "getLoading", "getUserPermissions"]),
        isDoctor() {
            let roleLS = this.getLSRole();
            let roleS = this.getUserRole;
            return (roleLS == 4 || (roleS && roleS.includes('doc')))
        },
    },
    watch: {
        "$i18n.locale": function (val) {
            this.moment.locale(val)
        }
    },
    methods: {
        getLSRole() {
            if (!userService.isAuthenticatedUser()) {
                return userService.getRole();
            } else {
                return (this.checkRoleFromUser ? userService.getUserRole() : userService.getRole())
            }
        },
        getImageUrl(profile) {
            let path = '/profile.png'
            let getPathFromUrl = (url) => {
                let urlParts = url.split('/');
                let lastPart = urlParts[urlParts.length - 1];
                if (lastPart.includes('.')) {
                    return url;
                }
                return path;
            }

            if (profile == null)
                return path;
            else if (typeof profile == 'string')
                path = getPathFromUrl(profile);
            else if (profile.profile_photo_url)
                path = getPathFromUrl(profile.profile_photo_url)
            else if (profile.path)
                path = process.env.VUE_APP_SERVER + profile.path;
            return path
        },
        getLocaleKey: function (key, enLocale = "", arLocale = "_ar", wordCase = "camel") {
            let postKey = this.$i18n.locale == "ar" ? arLocale : enLocale;
            if (wordCase == "upper") {
                postKey = postKey.toUpperCase();
            } else if (wordCase == "lower") {
                postKey = postKey.toLowerCase();
            }
            return key + postKey;
        },
        getCurrentLang() {
            return this.$i18n.locale;
        },
        numberOnly(number, input) {
            /**
             * @param {string} number
             * @param {string} input
             * @returns {number}
             * @description
             * 1. if input is not a number, return the number without the last character
             * 2. if input is a number, return the number
             * 3. if input is a number and the number is not a number, return the number by removing all non-numbers
             * 4. if input is a number and the number is a number, return the number
             * 5. if input is not a number and the number is not a number, return the number by removing all non-numbers
             * 6. if input is not a number and the number is a number, return the number
             */
            if (isNaN(input)) {
                return number.replace(/[^0-9]/g, "");
            } else {
                return number;
            }
        },
        phoneNumberCharactersOnly(number, input) {
            /**
             * @param {string} number
             * @param {string} input
             * @returns {number}
             * @description
             * 1. if input is a telephone number of saudi format, return the number
             * 2. if input is not a telephone number of saudi format, return the number without valid characters
             */
            if (input.type == "input" && !((0 <= input.data && input.data <= 9) || input.data == "+")) {
                return number.replace(/[^0-9+]/g, "");
            } else {
                return number;
            }
        },
        alphabetsOnly(string) {
            /**
             * @param {string} string
             * @returns {string}
             */
            let regex = this.getCurrentLang() == "en" ? /[^a-zA-Z ]/g : /[^ء-ي ]/g;
            return string.replace(regex, "");
        },
        confirmModal(title, confirmText, cancelText) {
            return this.$swal({
                text: title || this.$t('areYouSure'),
                type: 'question',
                showCancelButton: true,
                confirmButtonText: confirmText || this.$t("ok"),
                confirmButtonColor: "#4466f2",
                cancelButtonText: cancelText || this.$t("cancel"),
                cancelButtonColor: "#4466f2",
            });
        },
        successModal(title, text, confirmText) {
            return this.$swal({
                title: title || this.$t('changesDone'),
                text: text || this.$t('changesDone'),
                type: 'success',
                confirmButtonText: confirmText || this.$t("ok"),
                confirmButtonColor: "#4466f2",
            });
        },
        confirmIconModal(title, text, icon = 'm-check', confirmText = this.$t("ok"), cancelText = this.$t("cancel")) {
            const imagePath = require("../assets/images/" + icon + ".svg")
            return this.$swal({
                title: title || this.$t('areYouSure'),
                text: text || this.$t('areYouSure'),
                showCancelButton: true,
                confirmButtonText: confirmText,
                confirmButtonColor: "#4466f2",
                cancelButtonText: cancelText,
                cancelButtonColor: "#4466f2",
                imageUrl: imagePath,
                customClass: {
                    container: 'swal-custom-icon-top-padding theme-action-button',
                }
            });
        },
        ratingIconModal(title, text, icon, confirmText, cancelText, doctor_id) {
            const imagePath = require("../assets/images/" + (icon || 'm-check') + ".svg");
            let selectedRating = null;
            let innerHTML = `
                            <div class="swal-title">${text}</div>
                            <div class="rating-container">
                                <div class="fa fa-star star"></div>
                                <div class="fa fa-star star"></div>
                                <div class="fa fa-star star"></div>
                                <div class="fa fa-star star"></div>
                                <div class="fa fa-star star"></div>
                            </div>
                            `;
            return this.$swal({
                title: title || this.$t('areYouSure'),
                text: text || this.$t('areYouSure'),
                showCancelButton: true,
                confirmButtonText: confirmText || this.$t("ok"),
                confirmButtonColor: "#4466f2",
                cancelButtonText: cancelText || this.$t("cancel"),
                cancelButtonColor: "#4466f2",
                imageUrl: imagePath,
                customClass: {
                    container: 'swal-custom-icon-top-padding theme-action-button',
                },
                html: innerHTML,
                onBeforeOpen: () => {
                    const ratings = document.getElementsByClassName('star')
                    Object.values(ratings).forEach((rating, index) => {
                        rating.addEventListener('click', () => {
                            for (const element of ratings) {
                                element.classList.remove('active')
                            }
                            for (let i = 0; i <= index; i++) {
                                ratings[i].classList.add('active')
                            }
                            selectedRating = index + 1;
                        })
                    })
                },
                preConfirm: () => {
                    if (selectedRating == null) {
                        this.$swal.showValidationMessage(
                            this.$t('rating.error')
                        )
                        return selectedRating != null
                    } else {
                        let success = false;
                        appointmentService.ratePhysician(doctor_id, selectedRating).then(
                            (response) => {
                                if (response.data.status) {
                                    success = true;
                                    this.successToast(this.$t('rating.submitted'));
                                    this.$swal.close();
                                } else {
                                    this.failureToast(response.data.message);
                                }
                            },
                            (error) => {
                                if (!this.isAPIAborted(error)) this.failureToast(error.response && error.response.data.message);
                            }
                        );
                        return success && selectedRating != null && selectedRating
                    }
                },
            });
        },
        inputIconModal(title, text, icon = 'm-check', type = 'text', confirmText = this.$t("ok"), cancelText = this.$t("cancel")) {
            const imagePath = require("../assets/images/" + icon + ".svg")
            return this.$swal({
                input: type,
                inputPlaceholder: text,
                title: title || this.$t('areYouSure'),
                showCancelButton: true,
                confirmButtonText: confirmText,
                confirmButtonColor: "#4466f2",
                cancelButtonText: cancelText,
                cancelButtonColor: "#4466f2",
                preConfirm: (inputVal) => {
                    let trimInputVal = (inputVal + "").trim();
                    let isValidInput = trimInputVal != '';
                    if (!isValidInput) {
                        this.$swal.showValidationMessage(
                            this.$t('promotions.invalidPromo')
                        )
                    }

                    return isValidInput && trimInputVal;
                },
                imageUrl: imagePath,
                customClass: {
                    container: 'swal-custom-icon-top-padding theme-action-button',
                }
            });
        },
        selectIconModal(title, options, icon = 'm-check', confirmText = this.$t("ok"), cancelText = this.$t("cancel")) {
            const imagePath = require("../assets/images/" + icon + ".svg")
            return this.$swal({
                title: title || this.$t('areYouSure'),
                input: 'select',
                inputOptions: options,
                inputPlaceholder: 'Select a status',
                showCancelButton: true,
                confirmButtonText: confirmText || this.$t("ok"),
                confirmButtonColor: "#4466f2",
                cancelButtonText: cancelText || this.$t("cancel"),
                cancelButtonColor: "#4466f2",
                imageUrl: imagePath,
                customClass: {
                    container: 'swal-custom-icon-top-padding theme-action-button',
                }
            })
        },
        successIconModal(title, text, icon = 'm-check', confirmText = this.$t("ok")) {
            const imagePath = require("../assets/images/" + icon + ".svg")
            return this.$swal({
                title: title || this.$t('changesDone'),
                text: text || this.$t('changesDone'),
                confirmButtonText: confirmText,
                confirmButtonColor: "#4466f2",
                imageUrl: imagePath,
                customClass: {
                    container: 'swal-custom-icon-top-padding',
                }
            });
        },
        successIconListModal(title, text, icon = 'm-check', confirmText = this.$t("ok")) {
            const imagePath = require("../assets/images/" + icon + ".svg")
            return this.$swal({
                title: title || this.$t('changesDone'),
                html: text || this.$t('changesDone'),
                confirmButtonText: confirmText,
                confirmButtonColor: "#4466f2",
                imageUrl: imagePath,
                customClass: {
                    container: 'swal-custom-icon-top-padding',
                }
            });
        },
        failureModal(title, confirmText) {
            this.$swal({
                text: title || this.$t('error.somethingWentWrong'),
                type: 'error',
                confirmButtonText: confirmText || this.$t("ok"),
                confirmButtonColor: "#4466f2"
            });
        },
        failureIconModal(title, text, icon = 'm-check', confirmText = this.$t("ok")) {
            const imagePath = require("../assets/images/" + icon + ".svg")
            this.$swal({
                title: title || this.$t('error.somethingWentWrong'),
                text: text || this.$t('error.somethingWentWrong'),
                confirmButtonText: confirmText,
                confirmButtonColor: "#4466f2",
                imageUrl: imagePath,
                customClass: {
                    container: 'swal-custom-icon-top-padding',
                }
            });
        },
        successToast(message) {
            this.$toasted.show(message || this.$t("success"), {
                theme: "bubble",
                position: "top-right",
                type: "success",
                duration: 5000,
            });
        },
        failureToast(message) {
            this.$toasted.show(message || this.$t("error.somethingWentWrong"), {
                theme: "bubble",
                position: "top-right",
                type: "error",
                duration: 5000,
            });
        },
        setLoadingState(state) {
            this.$store.dispatch('user/setLoading', state);
        },
        download(url) {
            userService.downloadFile(url);
        },
        navigateBack() {
            this.$router.go(-1);
        },
        navigateTo(name, params = null) {
            if (this.$route.name == name) {
                return;
            }
            let obj = { name };
            if (params) {
                obj.params = params
            }
            this.$router.push(obj);
        },
        replaceTo(name) {
            this.$router.replace({ name })
        },
        getDate(dateString, utc = true) {
            let date = this.moment(dateString);
            if (utc) {
                date = date.utc();
            }
            if (this.moment(date).isSame(new Date(), "day")) {
                return this.$t('header.today');
            } else {
                return date.format("DD MMM");
            }
        },
        getTimeFromDate(date, includeAmPm = false) {
            return this.moment(date).utc().format("hh:mm" + (includeAmPm ? " A" : ""));
        },
        removeSecondsFromTimeString(timeString, onlySplice = false, translate = true) {
            let timeArray = timeString.split(":");
            let hh = timeArray[0];
            let mm = timeArray[1];

            let withoutSeconds = hh + ":" + mm;
            if (onlySplice) {
                if (translate) {
                    return this.translateNumber(withoutSeconds)
                }
                return withoutSeconds;
            }
            let parsedString = "";

            if (hh >= 0 && +hh < 12) {
                if (+hh == 0) {
                    hh = '12';
                }
                parsedString = hh + ":" + mm + "AM"
            } else {
                if (hh > 12) {
                    hh = hh - 12;
                }
                hh = '' + hh;
                if (hh.split("").length < 2) {
                    hh = '0' + hh
                }
                parsedString = hh + ":" + mm + "PM"
            }
            return this.translateNumber(parsedString);
        },
        parseDateString(dateString, dateFormat = "YYYY-MM-DD", utc = false) {
            if (utc) {
                return this.moment.utc(dateString, dateFormat).toDate();
            }
            return this.moment(dateString, dateFormat).toDate();
        },
        getDateTimeWithoutTimezone() {
            let format = "YYYY-MM-DDTHH:mm:ss";
            let utcTimezone = ".000Z";
            let date = this.moment().format(format) + utcTimezone;
            return date;
        },
        dateFormatter(date, format = 'MMMM Do YYYY, h:mm A', utc = false, locale = null) {
            if (locale) {
                if (utc) {
                    return this.moment(date).locale(locale).utc().format(format);
                }
                return this.moment(date).locale(locale).format(format);
            }
            if (utc) {
                return this.moment(date).utc().format(format);
            }
            return this.moment(date).format(format);
        },
        formatLongDayDateFromDate(date, utc = true) {
            return this.dateFormatter(date, 'dddd, MMMM DD', utc);
        },
        formatDate(date) {
            return this.dateFormatter(date, "DD-MM-YYYY")
        },
        formatDateTime(date, utc = true) {
            return this.dateFormatter(date, 'DD/MM/YYYY hh:mm A', utc);
        },
        getLongMonthDayFromDate(date) {
            return this.dateFormatter(date, 'MMMM, D dddd')
        },
        getLongDateFromDate(date) {
            return this.dateFormatter(date, 'D MMMM YYYY')
        },
        getLongDateAndTimeFromDate(date, utc = false) {
            return this.dateFormatter(date, 'DD MMMM YYYY - hh:mm A', utc)
        },
        getShortDateFromDate(date, separator = "-") {
            return this.dateFormatter(date, "YYYY" + separator + "MM" + separator + "DD")
        },
        formatNotificationTime(date, utc = false) {
            return this.dateFormatter(date, 'DD MMMM YYYY - hh:mm A', utc)
        },
        isDateSame(date1, date2) {
            let fdate1 = this.formatDate(new Date(date1));
            let fdate2 = this.formatDate(new Date(date2));
            return fdate1 == fdate2;
        },
        getYears(date) {
            return this.moment().diff(date, 'years')
        },
        translateNumber(num) {
            let strNum = num + '';
            // e.g., 12:00AM
            if (this.getCurrentLang() == "ar") {
                let ar = '٠١٢٣٤٥٦٧٨٩'.split('');
                let en = '0123456789'.split('');
                if (strNum.includes("PM")) {
                    strNum = strNum.replace("PM", "")
                    strNum = "م" + strNum;
                }
                if (strNum.includes("AM")) {
                    strNum = strNum.replace("AM", "")
                    strNum = "ص" + strNum;
                }
                let strArray = strNum.split("");
                let translateString = "";
                strArray.forEach(character => {
                    if (en.includes(character)) {
                        translateString += ar[en.indexOf(character)]
                    } else {
                        translateString += character;
                    }
                })
                return translateString;
            }
            return strNum;
        },
        isAllowedToCall(date, start, end) {
            /**
             * @param date: date in string format
             * @param start: start time in string format with format hh:mm:ss
             * @param end: end time in string format with format hh:mm:ss
             * @returns boolean
             */
            let startTime = start.split(":");
            let endTime = end.split(":");

            let now = this.moment().utc();
            let bookDate = this.moment(date).utc().startOf('day')

            let bookDateWithStartTime = this.moment(bookDate).add(startTime[0], 'hours').add(startTime[1], 'minutes');
            let bookDateWithEndTime = this.moment(bookDate).add(endTime[0], 'hours').add(endTime[1], 'minutes');

            let allowedStartLimit = bookDateWithStartTime.add(-15, 'minutes');
            let allowedEndLimit = bookDateWithEndTime;

            if (now.isBefore(allowedStartLimit)) {
                this.failureToast(this.$t("cantJoinCallEarly"));
                return false;
            } else if (now.isAfter(allowedEndLimit)) {
                this.failureToast(this.$t("cantJoinCallLate"));
                return false;
            } else {
                return true;
            }
        },
        getFullName(user, prepend = "", inLang = '') {
            if (!user) {
                return 'N/A'
            }

            let forcedLocale = inLang == 'en' ? '' : '_ar';
            let firstNameKey = 'first_name';
            let middleNameKey = 'middle_name';
            let familyNameKey = 'family_name';

            let translatedFirstNameKey = inLang ? firstNameKey + forcedLocale : this.getLocaleKey(firstNameKey);
            let translatedMiddleNameKey = inLang ? middleNameKey + forcedLocale : this.getLocaleKey(middleNameKey);
            let translatedFamilyNameKey = inLang ? familyNameKey + forcedLocale : this.getLocaleKey(familyNameKey);

            let parseName = (name) => name ? name + " " : "";
            let fullName = parseName(user[translatedFirstNameKey]) + parseName(user[translatedMiddleNameKey]) + parseName(user[translatedFamilyNameKey]);

            if (!fullName) {
                fullName =  (user.first_name) + parseName(user.middle_name) + parseName(user.family_name)
            }
            if (prepend) {
                fullName = prepend + " " + fullName.trim();
            } else {
                if (fullName && user.role_id == 4) {
                    fullName = this.$t('dr') + " " + fullName.trim();
                }
            }
            return fullName || 'N/A';
        },
        isAPIAborted(error) {
            return axios.isCancel(error)
        },
        async setFCMToken() {
            if (this.$messaging) {
                // await this.removeFCMToken();
                this.$messaging.onTokenRefresh(async () => {
                    await this.initializeFCMToken();
                })
                await this.initializeFCMToken();
            }
        },
        async initializeFCMToken() {
            try {
                await this.$messaging.deleteToken({
                    vapidKey:
                        process.env.VUE_APP_FIREBASE_VAPID_KEY,
                });
                let currentToken = await this.$messaging.getToken({
                    vapidKey:
                        process.env.VUE_APP_FIREBASE_VAPID_KEY,
                });
                if (currentToken) {
                    userService.setFCMToken(currentToken);
                    console.log("client token");
                    console.log(currentToken);
                }
            } catch (error) {
                console.log("An error occurred while retrieving token. ", error);
            }
        },
        getFCMToken() {
            return userService.getFCMToken();
        },
        async removeFCMToken() {
            if (this.$messaging) {
                await this.$messaging.deleteToken();
                userService.removeFCMToken();
            }
        },
    },
}