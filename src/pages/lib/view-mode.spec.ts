import { viewModeName, viewModes } from './view-mode';

describe('viewModeName', () => {
  it('should name the mode in Russian', () => {
    expect(viewModeName('list')).toBe('Список');
  });

  it('should fall back to the first mode when storage holds something unknown', () => {
    expect(viewModeName('карточки' as never)).toBe(viewModes[0].name);
  });
});
