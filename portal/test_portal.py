import re
import xml.etree.ElementTree as ET
from xml.etree.ElementTree import ParseError

import pytest

import portal


@pytest.fixture
def client():
    app = portal.create_app()
    app.config['TESTING'] = True
    with app.test_client() as client:
        with app.app_context():
            pass
            # Do any necessary initializations here.
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


@pytest.mark.parametrize('path', [
    '/',
    '/browse/dataset',
    '/browse/dataset/1',
    '/help'
])
def test_200_page(client, path):
    response = client.get(path)
    assert response.status == '200 OK'
    xml = to_xml(response.data.decode('utf8'))
    try:
        ET.fromstring(xml)
    except ParseError as e:
        numbered = '\n'.join([f'{n+1}: {line}' for (n, line) in enumerate(xml.split('\n'))])
        raise Exception(f'{e.msg}\n{numbered}')


@pytest.mark.parametrize('path', [
    '/no-page-here',
    '/browse/no-such-type'
])
def test_404_page(client, path):
    response = client.get(path)
    assert response.status == '404 NOT FOUND'


def test_login(client):
    response = client.get('/auth/login')
    assert response.status == '302 FOUND'
    assert response.location.startswith(
        'https://auth.globus.org/v2/oauth2/authorize'
    )
