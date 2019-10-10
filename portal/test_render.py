import pytest
from yattag import indent

from .render import dict_as_html


io_pairs = [
    ({'a': 1}, '''
<table>
  <tr>
    <td>a</td>
    <td>1</td>
  </tr>
</table>
'''),
    ({'a': [1, 2]}, '''
<table>
  <tr>
    <td>a</td>
    <td>1, 2</td>
  </tr>
</table>
'''),
    ({'a': {'b': 'c'}}, '''
<table>
  <tr>
    <td>a</td>
    <td>
      <table>
        <tr>
          <td>b</td>
          <td>c</td>
        </tr>
      </table>
    </td>
  </tr>
</table>
''')
]


@pytest.mark.parametrize('io_pair', io_pairs)
def test_dict_as_html(io_pair):
    (input, output) = io_pair
    assert indent(dict_as_html(input)) == output.strip()
