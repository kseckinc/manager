import ngOvhUiRouterLayout from '@ovh-ux/ng-ui-router-layout';
import contacts from './contacts';
import contactUpdate from './contacts/update';
import redirection from './account.redirection';
import routing from './account.routing';
import user from './user';

/* eslint-disable import/no-webpack-loader-syntax, import/no-unresolved, import/extensions */
import 'punycode';
import 'script-loader!ipaddr.js/ipaddr.min';
/* eslint-enable import/no-webpack-loader-syntax, import/no-unresolved, import/extensions */

import validatorService from './components/validator/validator.service';

import 'ovh-manager-webfont/dist/css/ovh-font.css';

const moduleName = 'ovhManagerDedicatedAccount';

angular
  .module(moduleName, [
    contacts,
    contactUpdate,
    'oui',
    'pascalprecht.translate',
    'ui.bootstrap',
    'ui.router',
    user,
    ngOvhUiRouterLayout,
  ])
  .config(redirection)
  .config(routing)
  .service('Validator', validatorService);

export default moduleName;
