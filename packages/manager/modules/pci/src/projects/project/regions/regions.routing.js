import map from 'lodash/map';
import { PCI_FEATURES } from '../../projects.constant';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.regions', {
    url: '/regions',
    component: 'pciProjectRegions',
    onEnter: /* @ngInject */ (pciFeatureRedirect) => {
      return pciFeatureRedirect(PCI_FEATURES.SETTINGS.REGION);
    },
    resolve: {
      availableRegions: /* @ngInject */ (
        ovhManagerRegionService,
        OvhApiCloudProjectRegion,
        projectId,
      ) =>
        OvhApiCloudProjectRegion.AvailableRegions()
          .v6()
          .query({ serviceName: projectId })
          .$promise.then((regionIds) =>
            map(regionIds, (region) =>
              ovhManagerRegionService.getRegion(region.name),
            ),
          ),

      regions: /* @ngInject */ (
        ovhManagerRegionService,
        OvhApiCloudProjectRegion,
        projectId,
      ) =>
        OvhApiCloudProjectRegion.v6()
          .query({ serviceName: projectId })
          .$promise.then((regionIds) =>
            map(regionIds, (region) =>
              ovhManagerRegionService.getRegion(region),
            ),
          ),

      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('pci_projects_project_regions'),
    },
  });
};
