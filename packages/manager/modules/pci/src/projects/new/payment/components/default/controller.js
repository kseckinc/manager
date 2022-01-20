export default class PciProjectNewPaymentDefaultCtrl {
  $onInit() {
    this.sectionUrls = {
      payment: this.buildedUrls.payment,
      myAccount: this.buildedUrls.myAccount,
    };
  }
}
