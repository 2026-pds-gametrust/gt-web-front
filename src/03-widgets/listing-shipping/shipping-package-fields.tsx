import { FormField } from '@shared/ui/form-field/form-field';
import type { IShippingPackageDims } from '@features/listings/lib/listing-shipping';

type ShippingPackageFieldsProps = {
  value: IShippingPackageDims;
  onChange: (next: IShippingPackageDims) => void;
  disabled?: boolean;
};

export function ShippingPackageFields({
  value,
  onChange,
  disabled,
}: ShippingPackageFieldsProps) {
  return (
    <fieldset className="mb-4 flex flex-col gap-2 border-0 p-0 m-0">
      <legend className="font-semibold text-[0.925rem]">Embalagem para envio</legend>
      <p className="m-0 text-[0.85rem] text-muted">
        Use a caixa fechada que vai no correio ou transportadora — não o tamanho solto do produto.
      </p>
      <div className="flex flex-col gap-3">
        <FormField id="pkg-weight" label="Peso (gramas)" required>
          <input
            type="number"
            min={1}
            disabled={disabled}
            value={value.packageWeightGrams || ''}
            onChange={(event) =>
              onChange({ ...value, packageWeightGrams: Number(event.target.value) || 0 })
            }
          />
        </FormField>
        <FormField id="pkg-length" label="Comprimento (cm)" required>
          <input
            type="number"
            min={1}
            disabled={disabled}
            value={value.packageLengthCm || ''}
            onChange={(event) =>
              onChange({ ...value, packageLengthCm: Number(event.target.value) || 0 })
            }
          />
        </FormField>
        <FormField id="pkg-width" label="Largura (cm)" required>
          <input
            type="number"
            min={1}
            disabled={disabled}
            value={value.packageWidthCm || ''}
            onChange={(event) =>
              onChange({ ...value, packageWidthCm: Number(event.target.value) || 0 })
            }
          />
        </FormField>
        <FormField id="pkg-height" label="Altura (cm)" required>
          <input
            type="number"
            min={1}
            disabled={disabled}
            value={value.packageHeightCm || ''}
            onChange={(event) =>
              onChange({ ...value, packageHeightCm: Number(event.target.value) || 0 })
            }
          />
        </FormField>
      </div>
    </fieldset>
  );
}
