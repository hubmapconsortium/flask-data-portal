// eslint-disable-next-line import/no-extraneous-dependencies
import { renderHook, act } from '@testing-library/react-hooks';

import { useVitessceConfig } from './hooks';

describe('Run Vitessce Hooks Test', () => {
  test('Vitessce Config Hook Test', () => {
    // Mocked vitessce config returns ({ name: 'conf1', attr: 'bar' }) in __mocks__/vitessce
    delete window.location;
    window.location = {
      hash: `#mock_url_to_be_ignored`,
    };
    const vitData = [{ name: 'conf1' }, { name: 'conf2' }];
    const props = { vitData, setVitessceState: () => {} };
    const { result } = renderHook(() => useVitessceConfig(props));

    expect(result.current.vitessceSelection).toEqual(0);
    expect(result.current.vitessceConfig[0].name).toEqual('conf1');
    expect(result.current.vitessceConfig[0].attr).toEqual('bar');
    act(() => {
      result.current.setVitessceSelection(1);
    });

    expect(result.current.vitessceSelection).toEqual(1);
  });
});
