from collections import namedtuple
import json
from datetime import datetime

import requests

# Hopefully soon, generate API client code from OpenAPI:
# https://github.com/hubmapconsortium/hubmap-data-portal/issues/179


Entity = namedtuple('Entity', ['uuid', 'type', 'name'], defaults=['TODO: name'])


def _format_timestamp(ts):
    return datetime.utcfromtimestamp(int(ts) / 1000).strftime('%Y-%m-%d %H:%M:%S')


class ApiClient():
    def __init__(self, url_base, nexus_token):
        self.url_base = url_base
        self.nexus_token = nexus_token

    def _request(self, path):
        headers = {'Authorization': 'Bearer ' + self.nexus_token}
        response = requests.get(
            f'{self.url_base}{path}',
            headers=headers
        )
        return response.json()

    def get_entity_types(self):
        # NOTE: Not called right now, but tested by test_api.py.
        response = requests.get(f'{self.url_base}/entities')
        return response.json()['entity_types']

    def get_entities(self, type):
        response = self._request(f'/entities/types/{type}')
        return [Entity(uuid, type) for uuid in response['uuids']]

    def get_entity(self, uuid):
        response = self._request(f'/entities/{uuid}')
        entity = response['entity_node']
        # TODO: Move this into object
        entity['created'] = _format_timestamp(entity['provenance_create_timestamp'])
        entity['modified'] = _format_timestamp(entity['provenance_modified_timestamp'])
        return response['entity_node']

    def get_provenance(self, uuid):
        response = self._request(f'/entities/{uuid}/provenance')
        provenance = json.loads(response['provenance_data'])

        # TODO: These should not be needed with next update to NPM.
        del provenance['agent']
        provenance['prefix']['hubmap'] = 'https://hubmapconsortium.org'

        return provenance


# TODO: More functions
