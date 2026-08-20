import {
  buildModerationChangeDrafts,
  draftsToRequiredChanges,
} from './moderation-request-changes-form';
import type { IListing } from '@entities/listing/model';
import { EListingStatus } from '@entities/listing/model';

function aListing(overrides: Partial<IListing> = {}): IListing {
  return {
    id: 'lst-1',
    sellerId: 'seller-1',
    productId: 'prod-1',
    title: 'RTX 4060',
    description: 'Placa usada',
    condition: 'GOOD',
    status: EListingStatus.SUBMITTED,
    priceCents: 100000,
    currency: 'BRL',
    media: {
      assetIds: ['photo-a', 'photo-b'],
      videoAssetId: 'video-1',
    },
    shipping: { modes: ['PICKUP'], freeShipping: false },
    createdAt: '2026-08-01T12:00:00.000Z',
    ...overrides,
  } as IListing;
}

describe('buildModerationChangeDrafts', () => {
  it('lists photos, video and description without inventing AI marks', () => {
    const drafts = buildModerationChangeDrafts({ listing: aListing() });

    expect(drafts.map((d) => d.label)).toEqual(['Foto 1', 'Foto 2', 'Vídeo', 'Descrição']);
    expect(drafts.every((d) => !d.selected && !d.suggestedByAi)).toBe(true);
  });

  it('marks AI fails as suggestions that still need confirmation', () => {
    const drafts = buildModerationChangeDrafts({
      listing: aListing(),
      aiFailItemIds: ['photo-a'],
    });

    const photo1 = drafts.find((d) => d.key === 'photo:photo-a');
    expect(photo1?.selected).toBe(true);
    expect(photo1?.suggestedByAi).toBe(true);
    expect(drafts.find((d) => d.key === 'description')?.suggestedByAi).toBe(false);
  });
});

describe('draftsToRequiredChanges', () => {
  it('requires a reason for every selected item', () => {
    const drafts = buildModerationChangeDrafts({ listing: aListing() }).map((draft, index) =>
      index === 0 ? { ...draft, selected: true, reason: '' } : draft,
    );

    expect(draftsToRequiredChanges(drafts)).toBeNull();

    drafts[0] = { ...drafts[0], reason: 'Foto sem ângulo do serial' };
    expect(draftsToRequiredChanges(drafts)).toEqual([
      {
        target: 'PHOTO',
        reason: 'Foto sem ângulo do serial',
        assetId: 'photo-a',
      },
    ]);
  });
});
