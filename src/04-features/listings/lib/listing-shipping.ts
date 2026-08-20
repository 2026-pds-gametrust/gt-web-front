import { EShippingMode, type IListing, type IListingShipping } from '@entities/listing/model';

export type IShippingPackageDims = {
  packageWeightGrams: number;
  packageLengthCm: number;
  packageWidthCm: number;
  packageHeightCm: number;
};

export function hasShippingPackageDims(shipping: IListingShipping): boolean {
  return Boolean(
    shipping.packageWeightGrams &&
      shipping.packageLengthCm &&
      shipping.packageWidthCm &&
      shipping.packageHeightCm,
  );
}

export function listingNeedsShippingPackage(listing: IListing | null): boolean {
  return Boolean(listing?.shipping.modes.includes(EShippingMode.SHIPPING));
}

/** Publish rejects SHIPPING without weight and box size. */
export function listingIsBlockedFromPublish(listing: IListing | null): boolean {
  if (!listing) return false;
  return listingNeedsShippingPackage(listing) && !hasShippingPackageDims(listing.shipping);
}

export function buildListingShipping(
  modes: string[],
  packageDims?: Partial<IShippingPackageDims>,
): IListingShipping {
  const shipping: IListingShipping = {
    modes: modes as IListingShipping['modes'],
  };
  if (!modes.includes(EShippingMode.SHIPPING)) {
    return shipping;
  }
  return {
    ...shipping,
    packageWeightGrams: packageDims?.packageWeightGrams,
    packageLengthCm: packageDims?.packageLengthCm,
    packageWidthCm: packageDims?.packageWidthCm,
    packageHeightCm: packageDims?.packageHeightCm,
  };
}

export function packageDimsAreComplete(dims: IShippingPackageDims): boolean {
  return (
    dims.packageWeightGrams > 0 &&
    dims.packageLengthCm > 0 &&
    dims.packageWidthCm > 0 &&
    dims.packageHeightCm > 0
  );
}

const MODE_LABEL: Record<string, string> = {
  [EShippingMode.PICKUP]: 'Retirada em mãos',
  [EShippingMode.SHIPPING]: 'Envio por transportadora',
};

export function listingDeliveryIncompleteReason(
  modes: string[],
  dims: IShippingPackageDims,
): string | null {
  if (modes.length === 0) {
    return 'Escolha ao menos uma forma de entrega.';
  }
  if (modes.includes(EShippingMode.SHIPPING) && !packageDimsAreComplete(dims)) {
    return 'Informe peso e medidas da embalagem para envio por transportadora.';
  }
  return null;
}

export function formatShippingSummary(
  modes: string[],
  dims: IShippingPackageDims,
): string {
  const labels = modes.map((mode) => MODE_LABEL[mode] ?? mode);
  if (labels.length === 0) {
    return 'Não informado';
  }
  if (!modes.includes(EShippingMode.SHIPPING)) {
    return labels.join(', ');
  }
  if (!packageDimsAreComplete(dims)) {
    return `${labels.join(', ')} — falta peso e medidas da caixa`;
  }
  return `${labels.join(', ')} · ${dims.packageWeightGrams} g · ${dims.packageLengthCm}×${dims.packageWidthCm}×${dims.packageHeightCm} cm`;
}
