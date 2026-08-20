import { EShippingMode } from '@entities/listing/model';
import { FeedbackBanner } from '@shared/ui/feedback-banner/feedback-banner';
import { ShippingPackageFields } from '@widgets/listing-shipping/shipping-package-fields';
import type { IShippingPackageDims } from '@features/listings/lib/listing-shipping';

const OPTIONS = [
  {
    value: EShippingMode.PICKUP,
    label: 'Retirada em mãos',
    hint: 'O comprador busca o item com você.',
  },
  {
    value: EShippingMode.SHIPPING,
    label: 'Envio por transportadora',
    hint: 'Obrigatório informar peso e medidas da caixa. Sem isso o anúncio não publica.',
  },
] as const;

type ListingDeliveryFieldsProps = {
  modes: string[];
  packageDims: IShippingPackageDims;
  onToggleMode: (mode: string) => void;
  onPackageChange: (next: IShippingPackageDims) => void;
  disabled?: boolean;
};

export function ListingDeliveryFields({
  modes,
  packageDims,
  onToggleMode,
  onPackageChange,
  disabled,
}: ListingDeliveryFieldsProps) {
  const needsPackage = modes.includes(EShippingMode.SHIPPING);

  return (
    <div>
      <fieldset className="mb-4 flex flex-col gap-2 border-0 p-0 m-0">
        <legend className="font-semibold text-[0.925rem]">Como o comprador recebe</legend>
        <p className="m-0 text-[0.85rem] text-muted">
          Escolha ao menos uma opção. Envio por transportadora só vale com a caixa medida.
        </p>
        <div className="flex flex-col gap-3">
          {OPTIONS.map((option) => (
            <label key={option.value} className="flex min-h-11 items-start gap-3">
              <input
                type="checkbox"
                className="mt-1 h-[1.15rem] w-[1.15rem]"
                checked={modes.includes(option.value)}
                disabled={disabled}
                onChange={() => onToggleMode(option.value)}
              />
              <span>
                {option.label}
                <span className="block text-[0.85rem] text-muted">{option.hint}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {needsPackage ? (
        <>
          <FeedbackBanner
            variant="warning"
            title="Peso e medidas da embalagem"
            message="Informe a caixa que você vai despachar. Sem peso e medidas o anúncio não pode ser publicado com envio."
          />
          <ShippingPackageFields
            value={packageDims}
            onChange={onPackageChange}
            disabled={disabled}
          />
        </>
      ) : null}
    </div>
  );
}
