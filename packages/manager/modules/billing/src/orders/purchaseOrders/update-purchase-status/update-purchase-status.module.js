import angular from 'angular';

import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import ngAtInternet from '@ovh-ux/ng-at-internet';

import component from './update-purchase-status.component';
import routing from './update-purchase-status.routing';
import service from './update-purchase-status.service';

const moduleName = 'ovhManagerBillingOrdersPurchaseUpdatePurchaseStatus';
angular
  .module(moduleName, [
    'ui.router',
    'oui',
    'ngTranslateAsyncLoader',
    ngAtInternet,
  ])
  .component('updatePurchaseStatus', component)
  .service('updatePurchaseStatusService', service)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
