import {
  buildRevisionSnapshot,
  firstRevisionStep,
  isRevisionComplete,
} from './revision-validation';
import { ERequiredChangeTargetEnum as ERequiredChangeTarget } from '@entities/verification-case/model';

describe('revision-validation', () => {
  it('detects unchanged description', () => {
    const baseline = buildRevisionSnapshot({
      photoAssetIds: ['p1'],
      videoAssetId: 'v1',
      defects: 'Old',
      accessories: '',
    });
    const current = buildRevisionSnapshot({
      photoAssetIds: ['p1'],
      videoAssetId: 'v1',
      defects: 'Old',
      accessories: '',
    });
    expect(
      isRevisionComplete(
        [{ target: ERequiredChangeTarget.DESCRIPTION, reason: 'fix' }],
        current,
        baseline,
      ),
    ).toBe(false);
  });

  it('detects removed flagged photo', () => {
    const baseline = buildRevisionSnapshot({
      photoAssetIds: ['p1', 'p2'],
      videoAssetId: 'v1',
      defects: 'text',
      accessories: '',
    });
    const current = buildRevisionSnapshot({
      photoAssetIds: ['p2'],
      videoAssetId: 'v1',
      defects: 'text',
      accessories: '',
    });
    expect(
      isRevisionComplete(
        [{ target: ERequiredChangeTarget.PHOTO, reason: 'blur', assetId: 'p1' }],
        current,
        baseline,
      ),
    ).toBe(true);
  });

  it('prioritizes media step when photo change required', () => {
    expect(
      firstRevisionStep([
        { target: ERequiredChangeTarget.PHOTO, reason: 'blur', assetId: 'p1' },
      ]),
    ).toBe(3);
  });
});
