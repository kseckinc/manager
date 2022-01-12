angular.module('App').controller(
  'HostingUpgradeOfferCtrl',
  class HostingUpgradeOfferCtrl {
    constructor(
      $scope,
      $rootScope,
      $state,
      $stateParams,
      $translate,
      $window,
      Alerter,
      apiTranslator,
      atInternet,
      Hosting,
      WucUser,
    ) {
      this.$scope = $scope;
      this.$rootScope = $rootScope;
      this.$state = $state;
      this.$stateParams = $stateParams;
      this.$translate = $translate;
      this.$window = $window;
      this.Alerter = Alerter;
      this.apiTranslator = apiTranslator;
      this.atInternet = atInternet;
      this.Hosting = Hosting;
      this.WucUser = WucUser;
    }

    $onInit() {
      this.productId = this.$stateParams.productId;
      this.serviceId = null;

      this.availableOffers = [];
      this.durations = null;
      this.loading = {
        availableOffers: true,
        durations: false,
        validation: false,
      };
      this.model = {
        offer: null,
        startTime: '12:00',
        duration: null,
        agree: false,
        downgradeAgree: false,
      };

      this.WucUser.getUser().then((user) => {
        this.ovhSubsidiary = user.ovhSubsidiary;
      });

      this.Hosting.getSelected(this.productId)
        .then((hosting) => {
          this.hosting = hosting;
          return this.Hosting.getServiceInfos(this.productId);
        })
        .then(({ serviceId }) => {
          this.serviceId = serviceId;
          return this.Hosting.getAvailablePlanDetach(serviceId);
        })
        .then((availableOffers) => {
          this.availableOffers = availableOffers.map((offer) => ({
            name: offer.planCode,
            value: offer.planCode,
          }));
        })
        .catch(() => {
          this.availableOffers = [];
        })
        .finally(() => {
          this.loading.availableOffers = false;
        });
    }

    getDurations() {
      this.durations = {
        available: [],
        details: {},
      };
      this.loading.durations = true;

      return this.Hosting.simulateEstimate(this.serviceId, 'perso2014')
        .then((durations) => {
          this.durations.available = durations;
          if (durations.length === 1) {
            [this.model.duration] = this.durations.available;
          }
        })
        .catch((err) => {
          this.Alerter.alertFromSWS(
            this.$translate.instant('hosting_order_upgrade_error'),
            this.apiTranslator.translate(err),
            this.$scope.alerts.page,
          );
          this.$state.go('^');
        })
        .finally(() => {
          this.loading.durations = false;
        });
    }

    formatTime(startTime) {
      const now = moment();
      const time = moment(startTime, 'HH:mm:ss');
      const isToday = time.diff(now) > 0;

      return this.$translate.instant(
        isToday
          ? 'hosting_order_upgrade_start_time_summary_today'
          : 'hosting_order_upgrade_start_time_summary_tomorrow',
        { time: time.format('LT (UTCZ)') },
      );
    }

    formatPrice(price) {
      return price.value === 0
        ? this.$translate.instant('price_free')
        : this.$translate.instant('price_ht_label', { price: price.text });
    }

    orderUpgrade() {
      this.atInternet.trackClick({
        name: 'web::hosting::upgrade::confirm',
        type: 'action',
      });
      this.loading.validation = true;

      const win = this.$window.open('', '_blank');
      win.referrer = null;
      win.opener = null;

      return this.Hosting.executeDetach(this.serviceId, 'perso2014')
        .then((order) => {
          console.log(order);
          this.Alerter.success(
            this.$translate.instant('hosting_order_upgrade_success', {
              t0: order.url,
              t1: order.orderId,
            }),
            this.$scope.alerts.page,
          );
          this.atInternet.trackOrder({
            name: `[hosting]::${this.model.offer.value}[${this.model.offer.value}]`,
            page: 'web::payment-pending',
            orderId: order.orderId,
            priceTaxFree: order.prices.withoutTax.value,
            price: order.prices.withTax.value,
            status: 1,
          });
          win.location = order.url;
        })
        .catch((err) => {
          this.Alerter.alertFromSWS(
            this.$translate.instant('hosting_order_upgrade_error'),
            err,
            this.$scope.alerts.page,
          );
          win.close();
        })
        .finally(() => {
          this.loading.validation = false;
          this.$state.go('^');
        });
    }

    static isProrataDuration({ duration }) {
      return /^upto/.test(duration);
    }
  },
);
