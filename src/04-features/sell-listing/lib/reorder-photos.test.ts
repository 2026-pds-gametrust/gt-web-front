import { movePhoto, reorderPhotos } from './reorder-photos';

describe('reorderPhotos', () => {
  it('should move the first photo to the end so another becomes cover', () => {
    expect(reorderPhotos(['a', 'b', 'c'], 0, 2)).toEqual(['b', 'c', 'a']);
  });

  it('should keep ids when the index does not change', () => {
    expect(reorderPhotos(['a', 'b'], 1, 1)).toEqual(['a', 'b']);
  });
});

describe('movePhoto', () => {
  it('should promote the second photo to cover when moved up', () => {
    expect(movePhoto(['a', 'b', 'c'], 'b', 'up')).toEqual(['b', 'a', 'c']);
  });

  it('should ignore an unknown asset', () => {
    expect(movePhoto(['a', 'b'], 'missing', 'down')).toEqual(['a', 'b']);
  });
});
