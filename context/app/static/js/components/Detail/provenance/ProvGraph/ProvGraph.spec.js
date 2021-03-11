import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react';

// eslint-disable-next-line import/no-unresolved
import { render, screen, appProviderEndpoints } from 'test-utils/functions';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

import ProvGraph from './ProvGraph';

const provData = {
  prefix: { hubmap: 'https://hubmapconsortium.org/' },
  agent: {
    'hubmap:agent/30267a6e-35fe-40ef-8792-f311321868e9': {
      'prov:type': { $: 'prov:Person', type: 'prov:QUALIFIED_NAME' },
      'hubmap:userDisplayName': 'Elizabeth Neumann',
      'hubmap:userEmail': 'neumane@vanderbilt.edu',
      'hubmap:userUUID': '30267a6e-35fe-40ef-8792-f311321868e9',
    },
    'hubmap:organization/73bb26e4-ed43-11e8-8f19-0a7c1eab007a': {
      'prov:type': { $: 'prov:Organization', type: 'prov:QUALIFIED_NAME' },
      'hubmap:groupUUID': '73bb26e4-ed43-11e8-8f19-0a7c1eab007a',
      'hubmap:groupName': 'Vanderbilt TMC',
    },
  },
  activity: {
    'hubmap:activities/b2d1ee0970654ba5a158b25526910add': {
      'prov:startTime': '2019-11-01T18:50:35',
      'prov:endTime': '2019-11-01T18:50:35',
      'prov:type': 'Activity',
      'hubmap:created_by_user_sub': '83ae233d-6d1d-40eb-baa7-b6f636ab579a',
      'hubmap:uuid': 'b2d1ee0970654ba5a158b25526910add',
      'hubmap:created_by_user_email': 'allenj2@vanderbilt.edu',
      'hubmap:created_by_user_displayname': 'Jamie Allen',
      'hubmap:creation_action': 'Create Sample Activity',
      'hubmap:created_timestamp': '2019-11-01T18:50:35',
      'hubmap:hubmap_id': 'HBM665.NTZB.997',
    },
    'hubmap:activities/dc7103d824476585ac84494dfdbe8f42': {
      'prov:startTime': '2019-11-01T18:49:10',
      'prov:endTime': '2019-11-01T18:49:10',
      'prov:type': 'Activity',
      'hubmap:created_by_user_sub': '83ae233d-6d1d-40eb-baa7-b6f636ab579a',
      'hubmap:uuid': 'dc7103d824476585ac84494dfdbe8f42',
      'hubmap:created_by_user_email': 'allenj2@vanderbilt.edu',
      'hubmap:created_by_user_displayname': 'Jamie Allen',
      'hubmap:creation_action': 'Register Donor Activity',
      'hubmap:created_timestamp': '2019-11-01T18:49:10',
      'hubmap:hubmap_id': 'HBM398.NBBW.527',
    },
  },
  actedOnBehalfOf: {
    '_:id1': {
      'prov:delegate': 'hubmap:agent/30267a6e-35fe-40ef-8792-f311321868e9',
      'prov:responsible': 'hubmap:organization/73bb26e4-ed43-11e8-8f19-0a7c1eab007a',
      'prov:activity': 'hubmap:activities/b2d1ee0970654ba5a158b25526910add',
    },
    '_:id4': {
      'prov:delegate': 'hubmap:agent/30267a6e-35fe-40ef-8792-f311321868e9',
      'prov:responsible': 'hubmap:organization/73bb26e4-ed43-11e8-8f19-0a7c1eab007a',
      'prov:activity': 'hubmap:activities/dc7103d824476585ac84494dfdbe8f42',
    },
  },
  entity: {
    'hubmap:entities/13129ad371683171b152618c83fd9e6f': {
      'prov:type': 'Entity',
      'hubmap:data_access_level': 'public',
      'hubmap:organ': 'LK',
      'hubmap:created_by_user_sub': '30267a6e-35fe-40ef-8792-f311321868e9',
      'hubmap:uuid': '13129ad371683171b152618c83fd9e6f',
      'hubmap:created_by_user_email': 'neumane@vanderbilt.edu',
      'hubmap:created_by_user_displayname': 'Elizabeth Neumann',
      'hubmap:specimen_type': 'organ',
      'hubmap:entity_type': 'Sample',
      'hubmap:lab_tissue_sample_id': '65631',
      'hubmap:group_name': 'Vanderbilt TMC',
      'hubmap:last_modified_timestamp': '2019-11-01T18:50:35',
      'hubmap:protocol_url': 'https://dx.doi.org/10.17504/protocols.io.bfskjncw',
      'hubmap:created_timestamp': '2019-11-01T18:50:35',
      'hubmap:group_uuid': '73bb26e4-ed43-11e8-8f19-0a7c1eab007a',
      'hubmap:hubmap_id': 'HBM666.CHPF.373',
      'hubmap:submission_id': 'VAN0003-LK',
    },
    'hubmap:entities/c624abbe9836c7e3b6a8d8216a316f30': {
      'prov:type': 'Entity',
      'hubmap:label': 'Entity',
      'hubmap:data_access_level': 'public',
      'hubmap:created_by_user_sub': '30267a6e-35fe-40ef-8792-f311321868e9',
      'hubmap:description': 'Age 73, White Female',
      'hubmap:uuid': 'c624abbe9836c7e3b6a8d8216a316f30',
      'hubmap:created_by_user_email': 'neumane@vanderbilt.edu',
      'hubmap:lab_donor_id': '68-71',
      'hubmap:created_by_user_displayname': 'Elizabeth Neumann',
      'hubmap:entity_type': 'Donor',
      'hubmap:group_name': 'Vanderbilt TMC',
      'hubmap:last_modified_timestamp': '2019-11-01T18:50:35',
      'hubmap:protocol_url': 'dx.doi.org/10.17504/protocols.io.7hhhj36',
      'hubmap:created_timestamp': '2019-11-01T18:50:35',
      'hubmap:group_uuid': '73bb26e4-ed43-11e8-8f19-0a7c1eab007a',
      'hubmap:hubmap_id': 'HBM547.NCQL.874',
      'hubmap:submission_id': 'VAN0003',
    },
  },
  wasGeneratedBy: {
    '_:id2': {
      'prov:entity': 'hubmap:entities/13129ad371683171b152618c83fd9e6f',
      'prov:activity': 'hubmap:activities/b2d1ee0970654ba5a158b25526910add',
    },
    '_:id5': {
      'prov:entity': 'hubmap:entities/c624abbe9836c7e3b6a8d8216a316f30',
      'prov:activity': 'hubmap:activities/dc7103d824476585ac84494dfdbe8f42',
    },
  },
  used: {
    '_:id3': {
      'prov:activity': 'hubmap:activities/b2d1ee0970654ba5a158b25526910add',
      'prov:entity': 'hubmap:entities/c624abbe9836c7e3b6a8d8216a316f30',
    },
    '_:id6': {
      'prov:activity': 'hubmap:activities/dc7103d824476585ac84494dfdbe8f42',
      'prov:entity': 'hubmap:entities/73bb26e4-ed43-11e8-8f19-0a7c1eab007a',
    },
  },
};

const descendants = [
  {
    uuid: 'c5bd4ae9a43b580f821c5d499953bdec',
    prov: {
      prefix: { hubmap: 'https://hubmapconsortium.org/' },
      agent: {
        'hubmap:agent/30267a6e-35fe-40ef-8792-f311321868e9': {
          'prov:type': { $: 'prov:Person', type: 'prov:QUALIFIED_NAME' },
          'hubmap:userDisplayName': 'Elizabeth Neumann',
          'hubmap:userEmail': 'neumane@vanderbilt.edu',
          'hubmap:userUUID': '30267a6e-35fe-40ef-8792-f311321868e9',
        },
        'hubmap:organization/73bb26e4-ed43-11e8-8f19-0a7c1eab007a': {
          'prov:type': { $: 'prov:Organization', type: 'prov:QUALIFIED_NAME' },
          'hubmap:groupUUID': '73bb26e4-ed43-11e8-8f19-0a7c1eab007a',
          'hubmap:groupName': 'Vanderbilt TMC',
        },
      },
      activity: {
        'hubmap:activities/5fde31296b9074b6e570671322f2c690': {
          'prov:startTime': '2019-12-23T15:42:25',
          'prov:endTime': '2019-12-23T15:42:25',
          'prov:type': 'Activity',
          'hubmap:created_by_user_sub': '30267a6e-35fe-40ef-8792-f311321868e9',
          'hubmap:uuid': '5fde31296b9074b6e570671322f2c690',
          'hubmap:created_by_user_email': 'neumane@vanderbilt.edu',
          'hubmap:created_by_user_displayname': 'Elizabeth Neumann',
          'hubmap:creation_action': 'Create Sample Activity',
          'hubmap:created_timestamp': '2019-12-23T15:42:25',
          'hubmap:hubmap_id': 'HBM358.MRDC.967',
        },
        'hubmap:activities/b2d1ee0970654ba5a158b25526910add': {
          'prov:startTime': '2019-11-01T18:50:35',
          'prov:endTime': '2019-11-01T18:50:35',
          'prov:type': 'Activity',
          'hubmap:created_by_user_sub': '83ae233d-6d1d-40eb-baa7-b6f636ab579a',
          'hubmap:uuid': 'b2d1ee0970654ba5a158b25526910add',
          'hubmap:created_by_user_email': 'allenj2@vanderbilt.edu',
          'hubmap:created_by_user_displayname': 'Jamie Allen',
          'hubmap:creation_action': 'Create Sample Activity',
          'hubmap:created_timestamp': '2019-11-01T18:50:35',
          'hubmap:hubmap_id': 'HBM665.NTZB.997',
        },
        'hubmap:activities/dc7103d824476585ac84494dfdbe8f42': {
          'prov:startTime': '2019-11-01T18:49:10',
          'prov:endTime': '2019-11-01T18:49:10',
          'prov:type': 'Activity',
          'hubmap:created_by_user_sub': '83ae233d-6d1d-40eb-baa7-b6f636ab579a',
          'hubmap:uuid': 'dc7103d824476585ac84494dfdbe8f42',
          'hubmap:created_by_user_email': 'allenj2@vanderbilt.edu',
          'hubmap:created_by_user_displayname': 'Jamie Allen',
          'hubmap:creation_action': 'Register Donor Activity',
          'hubmap:created_timestamp': '2019-11-01T18:49:10',
          'hubmap:hubmap_id': 'HBM398.NBBW.527',
        },
      },
      actedOnBehalfOf: {
        '_:id1': {
          'prov:delegate': 'hubmap:agent/30267a6e-35fe-40ef-8792-f311321868e9',
          'prov:responsible': 'hubmap:organization/73bb26e4-ed43-11e8-8f19-0a7c1eab007a',
          'prov:activity': 'hubmap:activities/5fde31296b9074b6e570671322f2c690',
        },
        '_:id4': {
          'prov:delegate': 'hubmap:agent/30267a6e-35fe-40ef-8792-f311321868e9',
          'prov:responsible': 'hubmap:organization/73bb26e4-ed43-11e8-8f19-0a7c1eab007a',
          'prov:activity': 'hubmap:activities/b2d1ee0970654ba5a158b25526910add',
        },
        '_:id7': {
          'prov:delegate': 'hubmap:agent/30267a6e-35fe-40ef-8792-f311321868e9',
          'prov:responsible': 'hubmap:organization/73bb26e4-ed43-11e8-8f19-0a7c1eab007a',
          'prov:activity': 'hubmap:activities/dc7103d824476585ac84494dfdbe8f42',
        },
      },
      entity: {
        'hubmap:entities/c5bd4ae9a43b580f821c5d499953bdec': {
          'prov:type': 'Entity',
          'hubmap:data_access_level': 'public',
          'hubmap:created_by_user_sub': '30267a6e-35fe-40ef-8792-f311321868e9',
          'hubmap:last_modified_user_email': 'SHIREY@pitt.edu',
          'hubmap:description': '68-71',
          'hubmap:uuid': 'c5bd4ae9a43b580f821c5d499953bdec',
          'hubmap:created_by_user_email': 'neumane@vanderbilt.edu',
          'hubmap:last_modified_user_sub': 'e19adbbb-73c3-43a7-b05e-0eead04f5ff8',
          'hubmap:created_by_user_displayname': 'Elizabeth Neumann',
          'hubmap:specimen_type': 'fresh_frozen_tissue',
          'hubmap:entity_type': 'Sample',
          'hubmap:last_modified_user_displayname': 'Bill Shirey',
          'hubmap:group_name': 'Vanderbilt TMC',
          'hubmap:last_modified_timestamp': '2019-12-23T15:42:25',
          'hubmap:protocol_url': 'dx.doi.org/10.17504/protocols.io.7gehjte',
          'hubmap:created_timestamp': '2019-12-23T15:42:25',
          'hubmap:group_uuid': '73bb26e4-ed43-11e8-8f19-0a7c1eab007a',
          'hubmap:hubmap_id': 'HBM743.BZVB.466',
          'hubmap:submission_id': 'VAN0003-LK-32',
        },
        'hubmap:entities/13129ad371683171b152618c83fd9e6f': {
          'prov:type': 'Entity',
          'hubmap:data_access_level': 'public',
          'hubmap:organ': 'LK',
          'hubmap:created_by_user_sub': '30267a6e-35fe-40ef-8792-f311321868e9',
          'hubmap:uuid': '13129ad371683171b152618c83fd9e6f',
          'hubmap:created_by_user_email': 'neumane@vanderbilt.edu',
          'hubmap:created_by_user_displayname': 'Elizabeth Neumann',
          'hubmap:specimen_type': 'organ',
          'hubmap:entity_type': 'Sample',
          'hubmap:lab_tissue_sample_id': '65631',
          'hubmap:group_name': 'Vanderbilt TMC',
          'hubmap:last_modified_timestamp': '2019-12-23T15:42:25',
          'hubmap:protocol_url': 'https://dx.doi.org/10.17504/protocols.io.bfskjncw',
          'hubmap:created_timestamp': '2019-12-23T15:42:25',
          'hubmap:group_uuid': '73bb26e4-ed43-11e8-8f19-0a7c1eab007a',
          'hubmap:hubmap_id': 'HBM666.CHPF.373',
          'hubmap:submission_id': 'VAN0003-LK',
        },
        'hubmap:entities/c624abbe9836c7e3b6a8d8216a316f30': {
          'prov:type': 'Entity',
          'hubmap:label': 'Entity',
          'hubmap:data_access_level': 'public',
          'hubmap:created_by_user_sub': '30267a6e-35fe-40ef-8792-f311321868e9',
          'hubmap:description': 'Age 73, White Female',
          'hubmap:uuid': 'c624abbe9836c7e3b6a8d8216a316f30',
          'hubmap:created_by_user_email': 'neumane@vanderbilt.edu',
          'hubmap:lab_donor_id': '68-71',
          'hubmap:created_by_user_displayname': 'Elizabeth Neumann',
          'hubmap:entity_type': 'Donor',
          'hubmap:group_name': 'Vanderbilt TMC',
          'hubmap:last_modified_timestamp': '2019-11-01T18:50:35',
          'hubmap:protocol_url': 'dx.doi.org/10.17504/protocols.io.7hhhj36',
          'hubmap:created_timestamp': '2019-11-01T18:50:35',
          'hubmap:group_uuid': '73bb26e4-ed43-11e8-8f19-0a7c1eab007a',
          'hubmap:hubmap_id': 'HBM547.NCQL.874',
          'hubmap:submission_id': 'VAN0003',
        },
      },
      wasGeneratedBy: {
        '_:id2': {
          'prov:entity': 'hubmap:entities/c5bd4ae9a43b580f821c5d499953bdec',
          'prov:activity': 'hubmap:activities/5fde31296b9074b6e570671322f2c690',
        },
        '_:id5': {
          'prov:entity': 'hubmap:entities/13129ad371683171b152618c83fd9e6f',
          'prov:activity': 'hubmap:activities/b2d1ee0970654ba5a158b25526910add',
        },
        '_:id8': {
          'prov:entity': 'hubmap:entities/c624abbe9836c7e3b6a8d8216a316f30',
          'prov:activity': 'hubmap:activities/dc7103d824476585ac84494dfdbe8f42',
        },
      },
      used: {
        '_:id3': {
          'prov:activity': 'hubmap:activities/5fde31296b9074b6e570671322f2c690',
          'prov:entity': 'hubmap:entities/13129ad371683171b152618c83fd9e6f',
        },
        '_:id6': {
          'prov:activity': 'hubmap:activities/b2d1ee0970654ba5a158b25526910add',
          'prov:entity': 'hubmap:entities/c624abbe9836c7e3b6a8d8216a316f30',
        },
        '_:id9': {
          'prov:activity': 'hubmap:activities/dc7103d824476585ac84494dfdbe8f42',
          'prov:entity': 'hubmap:entities/73bb26e4-ed43-11e8-8f19-0a7c1eab007a',
        },
      },
    },
  },
  {
    uuid: '729935b4f3319c237f782cce3c3fea56',
    prov: {
      prefix: { hubmap: 'https://hubmapconsortium.org/' },
      agent: {
        'hubmap:agent/30267a6e-35fe-40ef-8792-f311321868e9': {
          'prov:type': { $: 'prov:Person', type: 'prov:QUALIFIED_NAME' },
          'hubmap:userDisplayName': 'Elizabeth Neumann',
          'hubmap:userEmail': 'elizabeth.neumann@Vanderbilt.Edu',
          'hubmap:userUUID': '30267a6e-35fe-40ef-8792-f311321868e9',
        },
        'hubmap:organization/73bb26e4-ed43-11e8-8f19-0a7c1eab007a': {
          'prov:type': { $: 'prov:Organization', type: 'prov:QUALIFIED_NAME' },
          'hubmap:groupUUID': '73bb26e4-ed43-11e8-8f19-0a7c1eab007a',
          'hubmap:groupName': 'Vanderbilt TMC',
        },
      },
      activity: {
        'hubmap:activities/fbe4e709c054786a7732320cbb83f2c5': {
          'prov:startTime': '2020-10-01T21:19:32',
          'prov:endTime': '2020-10-01T21:19:32',
          'prov:type': 'Activity',
          'hubmap:created_by_user_sub': '30267a6e-35fe-40ef-8792-f311321868e9',
          'hubmap:uuid': 'fbe4e709c054786a7732320cbb83f2c5',
          'hubmap:created_by_user_email': 'elizabeth.neumann@Vanderbilt.Edu',
          'hubmap:created_by_user_displayname': 'Elizabeth Neumann',
          'hubmap:creation_action': 'Create Sample Activity',
          'hubmap:created_timestamp': '2020-10-01T21:19:32',
          'hubmap:hubmap_id': 'HBM534.VGXH.932',
        },
        'hubmap:activities/b2d1ee0970654ba5a158b25526910add': {
          'prov:startTime': '2019-11-01T18:50:35',
          'prov:endTime': '2019-11-01T18:50:35',
          'prov:type': 'Activity',
          'hubmap:created_by_user_sub': '83ae233d-6d1d-40eb-baa7-b6f636ab579a',
          'hubmap:uuid': 'b2d1ee0970654ba5a158b25526910add',
          'hubmap:created_by_user_email': 'allenj2@vanderbilt.edu',
          'hubmap:created_by_user_displayname': 'Jamie Allen',
          'hubmap:creation_action': 'Create Sample Activity',
          'hubmap:created_timestamp': '2019-11-01T18:50:35',
          'hubmap:hubmap_id': 'HBM665.NTZB.997',
        },
        'hubmap:activities/dc7103d824476585ac84494dfdbe8f42': {
          'prov:startTime': '2019-11-01T18:49:10',
          'prov:endTime': '2019-11-01T18:49:10',
          'prov:type': 'Activity',
          'hubmap:created_by_user_sub': '83ae233d-6d1d-40eb-baa7-b6f636ab579a',
          'hubmap:uuid': 'dc7103d824476585ac84494dfdbe8f42',
          'hubmap:created_by_user_email': 'allenj2@vanderbilt.edu',
          'hubmap:created_by_user_displayname': 'Jamie Allen',
          'hubmap:creation_action': 'Register Donor Activity',
          'hubmap:created_timestamp': '2019-11-01T18:49:10',
          'hubmap:hubmap_id': 'HBM398.NBBW.527',
        },
      },
      actedOnBehalfOf: {
        '_:id1': {
          'prov:delegate': 'hubmap:agent/30267a6e-35fe-40ef-8792-f311321868e9',
          'prov:responsible': 'hubmap:organization/73bb26e4-ed43-11e8-8f19-0a7c1eab007a',
          'prov:activity': 'hubmap:activities/fbe4e709c054786a7732320cbb83f2c5',
        },
        '_:id4': {
          'prov:delegate': 'hubmap:agent/30267a6e-35fe-40ef-8792-f311321868e9',
          'prov:responsible': 'hubmap:organization/73bb26e4-ed43-11e8-8f19-0a7c1eab007a',
          'prov:activity': 'hubmap:activities/b2d1ee0970654ba5a158b25526910add',
        },
        '_:id7': {
          'prov:delegate': 'hubmap:agent/30267a6e-35fe-40ef-8792-f311321868e9',
          'prov:responsible': 'hubmap:organization/73bb26e4-ed43-11e8-8f19-0a7c1eab007a',
          'prov:activity': 'hubmap:activities/dc7103d824476585ac84494dfdbe8f42',
        },
      },
      entity: {
        'hubmap:entities/729935b4f3319c237f782cce3c3fea56': {
          'prov:type': 'Entity',
          'hubmap:data_access_level': 'public',
          'hubmap:organ': 'LK',
          'hubmap:created_by_user_sub': '30267a6e-35fe-40ef-8792-f311321868e9',
          'hubmap:uuid': '729935b4f3319c237f782cce3c3fea56',
          'hubmap:created_by_user_email': 'elizabeth.neumann@Vanderbilt.Edu',
          'hubmap:created_by_user_displayname': 'Elizabeth Neumann',
          'hubmap:specimen_type': 'ffpe_block',
          'hubmap:entity_type': 'Sample',
          'hubmap:lab_tissue_sample_id': '71',
          'hubmap:group_name': 'Vanderbilt TMC',
          'hubmap:last_modified_timestamp': '2020-10-01T21:19:32',
          'hubmap:protocol_url': 'dx.doi.org/10.17504/protocols.io.7gehjte',
          'hubmap:created_timestamp': '2020-10-01T21:19:32',
          'hubmap:group_uuid': '73bb26e4-ed43-11e8-8f19-0a7c1eab007a',
          'hubmap:hubmap_id': 'HBM643.FDGT.862',
          'hubmap:submission_id': 'VAN0003-LK-33',
        },
        'hubmap:entities/13129ad371683171b152618c83fd9e6f': {
          'prov:type': 'Entity',
          'hubmap:data_access_level': 'public',
          'hubmap:organ': 'LK',
          'hubmap:created_by_user_sub': '30267a6e-35fe-40ef-8792-f311321868e9',
          'hubmap:uuid': '13129ad371683171b152618c83fd9e6f',
          'hubmap:created_by_user_email': 'neumane@vanderbilt.edu',
          'hubmap:created_by_user_displayname': 'Elizabeth Neumann',
          'hubmap:specimen_type': 'organ',
          'hubmap:entity_type': 'Sample',
          'hubmap:lab_tissue_sample_id': '65631',
          'hubmap:group_name': 'Vanderbilt TMC',
          'hubmap:last_modified_timestamp': '2020-10-01T21:19:32',
          'hubmap:protocol_url': 'https://dx.doi.org/10.17504/protocols.io.bfskjncw',
          'hubmap:created_timestamp': '2020-10-01T21:19:32',
          'hubmap:group_uuid': '73bb26e4-ed43-11e8-8f19-0a7c1eab007a',
          'hubmap:hubmap_id': 'HBM666.CHPF.373',
          'hubmap:submission_id': 'VAN0003-LK',
        },
        'hubmap:entities/c624abbe9836c7e3b6a8d8216a316f30': {
          'prov:type': 'Entity',
          'hubmap:label': 'Entity',
          'hubmap:data_access_level': 'public',
          'hubmap:created_by_user_sub': '30267a6e-35fe-40ef-8792-f311321868e9',
          'hubmap:description': 'Age 73, White Female',
          'hubmap:uuid': 'c624abbe9836c7e3b6a8d8216a316f30',
          'hubmap:created_by_user_email': 'neumane@vanderbilt.edu',
          'hubmap:lab_donor_id': '68-71',
          'hubmap:created_by_user_displayname': 'Elizabeth Neumann',
          'hubmap:entity_type': 'Donor',
          'hubmap:group_name': 'Vanderbilt TMC',
          'hubmap:last_modified_timestamp': '2019-11-01T18:50:35',
          'hubmap:protocol_url': 'dx.doi.org/10.17504/protocols.io.7hhhj36',
          'hubmap:created_timestamp': '2019-11-01T18:50:35',
          'hubmap:group_uuid': '73bb26e4-ed43-11e8-8f19-0a7c1eab007a',
          'hubmap:hubmap_id': 'HBM547.NCQL.874',
          'hubmap:submission_id': 'VAN0003',
        },
      },
      wasGeneratedBy: {
        '_:id2': {
          'prov:entity': 'hubmap:entities/729935b4f3319c237f782cce3c3fea56',
          'prov:activity': 'hubmap:activities/fbe4e709c054786a7732320cbb83f2c5',
        },
        '_:id5': {
          'prov:entity': 'hubmap:entities/13129ad371683171b152618c83fd9e6f',
          'prov:activity': 'hubmap:activities/b2d1ee0970654ba5a158b25526910add',
        },
        '_:id8': {
          'prov:entity': 'hubmap:entities/c624abbe9836c7e3b6a8d8216a316f30',
          'prov:activity': 'hubmap:activities/dc7103d824476585ac84494dfdbe8f42',
        },
      },
      used: {
        '_:id3': {
          'prov:activity': 'hubmap:activities/fbe4e709c054786a7732320cbb83f2c5',
          'prov:entity': 'hubmap:entities/13129ad371683171b152618c83fd9e6f',
        },
        '_:id6': {
          'prov:activity': 'hubmap:activities/b2d1ee0970654ba5a158b25526910add',
          'prov:entity': 'hubmap:entities/c624abbe9836c7e3b6a8d8216a316f30',
        },
        '_:id9': {
          'prov:activity': 'hubmap:activities/dc7103d824476585ac84494dfdbe8f42',
          'prov:entity': 'hubmap:entities/73bb26e4-ed43-11e8-8f19-0a7c1eab007a',
        },
      },
    },
  },
];

const server = setupServer(
  rest.post(`/${appProviderEndpoints.elasticsearchEndpoint}`, (req, res, ctx) => {
    const descendantData = {
      hits: {
        hits: [
          {
            _source: {
              immediate_descendants: [
                {
                  uuid: descendants[0].uuid,
                },
                {
                  uuid: descendants[1].uuid,
                },
              ],
            },
          },
        ],
      },
    };
    return res(ctx.json(descendantData), ctx.status(200));
  }),
  rest.get(`/${appProviderEndpoints.entityEndpoint}/entities/${descendants[0].uuid}/provenance`, (req, res, ctx) => {
    return res(ctx.json(descendants[0].prov), ctx.status(200));
  }),
  rest.get(`/${appProviderEndpoints.entityEndpoint}/entities/${descendants[1].uuid}/provenance`, (req, res, ctx) => {
    return res(ctx.json(descendants[1].prov), ctx.status(200));
  }),
);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('should display the correct initial nodes', () => {
  const sampleEntityText = 'Sample - HBM666.CHPF.373';
  const nodesText = [
    'hubmap:entities/73bb26e4-ed43-11e8-8f19-0a7c1eab007a',
    'Register Donor Activity - HBM398.NBBW.527',
    'Donor - HBM547.NCQL.874',
    'Create Sample Activity - HBM665.NTZB.997',
    sampleEntityText,
  ];

  render(<ProvGraph provData={provData} />);

  nodesText.forEach((text) => expect(screen.getByText(text)).toBeInTheDocument());
});

test('should selected node information in detail pane and show immediate descendants when show derived entities button is clicked', async () => {
  render(<ProvGraph provData={provData} />);

  const sampleEntityText = 'Sample - HBM666.CHPF.373';
  const detailPaneText = ['Type', 'Sample', 'ID', 'HBM666.CHPF.373', 'Created', '2019-11-01T18:50:35'];

  fireEvent.click(screen.getByText(sampleEntityText));

  detailPaneText.forEach((text) => expect(screen.getByText(text)).toBeInTheDocument());

  expect(screen.getByRole('link', { name: 'HBM666.CHPF.373' })).toHaveAttribute(
    'href',
    '/browse/sample/13129ad371683171b152618c83fd9e6f',
  );

  const derivedEntitiesButton = screen.getByRole('button', { name: 'Show Derived Entities' });

  expect(derivedEntitiesButton).toBeDisabled();

  detailPaneText.forEach((text) => expect(screen.getByText(text)).toBeInTheDocument());

  await waitFor(() => expect(derivedEntitiesButton).toBeEnabled());

  fireEvent.click(derivedEntitiesButton);

  const newNodesText = [
    'Create Sample Activity - HBM358.MRDC.967',
    'Sample - HBM743.BZVB.466',
    'Create Sample Activity - HBM534.VGXH.932',
    'HBM643.FDGT.862',
  ];

  newNodesText.forEach((text) => expect(screen.getByText(text)).toBeInTheDocument());
});
