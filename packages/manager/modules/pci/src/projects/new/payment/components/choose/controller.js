export default class PciProjectNewPaymentChooseCtrl {
  /* @ngInject */
  constructor() {
    this.useNewPaymentMethod = false;
  }

  $onInit() {
    this.myServiceUrl = this.buildedUrls.myServiceUrl;
  }

  /*= =============================
  =            Events            =
  ============================== */

  onUseNewPaymentMethodBtnClick() {
    this.useNewPaymentMethod = !this.useNewPaymentMethod;
  }

  onChooseDefaultPaymentMethodChange() {
    this.useNewPaymentMethod = false;
    this.model.paymentMethod = null;
  }

  /*= ====  End of Events  ====== */
}
