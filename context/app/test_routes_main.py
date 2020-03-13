import re
import xml.etree.ElementTree as ET
from xml.etree.ElementTree import ParseError
import json

import pytest

from .main import create_app
from .config import types
from .api import client as api_client


@pytest.fixture
def client():
    app = create_app(testing=True)
    with app.test_client() as client:
        with client.session_transaction() as session:
            session['nexus_token'] = '{}'
        yield client


def to_xml(html):
    '''
    Ad-hoc regexes, so we can check for missing or mismatched tags.
    '''
    return re.sub(
        r'(<(meta|link|br)[^>]+)>',
        r'\1/>',
        re.sub(r'<!doctype html>', '', html)
    )


def test_to_xml():
    html = '<!doctype html><html><meta XYZ></html>'
    xml = '<html><meta XYZ/></html>'
    assert to_xml(html) == xml


def assert_is_valid_html(response):
    xml = to_xml(response.data.decode('utf8'))
    try:
        ET.fromstring(xml)
    except ParseError as e:
        numbered = '\n'.join([f'{n+1}: {line}' for (n, line) in enumerate(xml.split('\n'))])
        raise Exception(f'{e.msg}\n{numbered}')


def mock_get(path, **kwargs):
    class MockResponse():
        def json(self):
            if path.endswith('/provenance'):
                return {
                    'agent': '',
                    'prefix': {}
                }
            elif '/types/' in path:
                return {
                    'uuids': []
                }
            else:
                raise Exception('No mock for:', path)

        def raise_for_status(self):
            pass
    return MockResponse()


class MockSearch():
    def __init__(self, **kwargs):
        pass
    def query(self, search, **kwargs):
        pass
    def execute(self):
        return [MockResponse()]


class MockResponse():
    def __init__(self):
        pass
    def to_dict(self):
        return {
            'provenance_create_timestamp': '100000',
            'provenance_modified_timestamp': '100000',
        }


@pytest.mark.parametrize(
    'path',
    ['/', '/help']
    + [f'/browse/{t}' for t in types]
    + [f'/browse/{t}/fake-uuid' for t in types]
)
def test_200_html_page(client, path, mocker):
    mocker.patch('requests.get', side_effect=mock_get)
    mocker.patch.object(api_client, 'Search', MockSearch)
    response = client.get(path)
    assert response.status == '200 OK'
    assert_is_valid_html(response)


@pytest.mark.parametrize(
    'path',
    [f'/browse/{t}/fake-uuid.json' for t in types]
)
def test_200_json_page(client, path, mocker):
    mocker.patch.object(api_client, 'Search', MockSearch)
    response = client.get(path)
    assert response.status == '200 OK'
    json.loads(response.data.decode('utf8'))


def test_login(client):
    response = client.get('/login')
    assert response.status == '302 FOUND'
    assert response.location.startswith(
        'https://auth.globus.org/v2/oauth2/authorize'
    )
