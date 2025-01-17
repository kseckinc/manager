import { ApplicationId } from '@ovh-ux/manager-config/types/application';
import { Environment } from '@ovh-ux/manager-config';
import ShellClient from './shell-client';
import { clientAuth } from '../plugin/auth';

export default function exposeApi(shellClient: ShellClient) {
  return {
    environment: {
      getEnvironment: () =>
        shellClient
          .invokePluginMethod({
            plugin: 'environment',
            method: 'getEnvironment',
          })
          .then((environment) => new Environment(environment as Environment)),
      setUniverse: (applicationId: ApplicationId) =>
        shellClient.invokePluginMethod({
          plugin: 'environment',
          method: 'setUniverse',
          args: [applicationId],
        }),
    },
    i18n: {
      getLocale: () =>
        shellClient.invokePluginMethod({
          plugin: 'i18n',
          method: 'getLocale',
        }),
      onLocaleChange: (callback: CallableFunction) =>
        shellClient.addEventListener('i18n:locale-change', callback),
      setLocale: (locale: string) =>
        shellClient.invokePluginMethod({
          plugin: 'i18n',
          method: 'setLocale',
          args: [locale],
        }),
    },
    routing: {
      init: () =>
        window.addEventListener('hashchange', () => {
          if (window.parent !== window.self) {
            shellClient.invokePluginMethod({
              plugin: 'routing',
              method: 'onHashChange',
              args: [
                {
                  hash: window.location.hash,
                  path: window.location.pathname,
                },
              ],
            });
          }
        }),
    },
    auth: clientAuth(shellClient),
    ux: {
      showAccountSidebar: () =>
        shellClient.invokePluginMethod({
          plugin: 'ux',
          method: 'showAccountSidebar',
        }),
      disableAccountSidebarToggle: () => {
        shellClient.invokePluginMethod({
          plugin: 'ux',
          method: 'disableAccountSidebarVisibilityToggle',
        });
      },
      enableAccountSidebarToggle: () => {
        shellClient.invokePluginMethod({
          plugin: 'ux',
          method: 'enableAccountSidebarVisibilityToggle',
        });
      },
      isAccountSidebarVisible: () =>
        shellClient.invokePluginMethod({
          plugin: 'ux',
          method: 'isAccountSidebarVisible',
        }),
    },
  };
}
