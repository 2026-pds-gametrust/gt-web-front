import { digitsOnly, maskCpf, maskPhone } from './input-masks';

describe('digitsOnly', () => {
  it('strips punctuation and respects a max length', () => {
    expect(digitsOnly('123.456.789-01')).toBe('12345678901');
    expect(digitsOnly('(11) 99999-9999', 11)).toBe('11999999999');
    expect(digitsOnly('11999999999000', 11)).toBe('11999999999');
  });
});

describe('maskCpf', () => {
  it('applies the Brazilian CPF pattern as digits arrive', () => {
    expect(maskCpf('')).toBe('');
    expect(maskCpf('123')).toBe('123');
    expect(maskCpf('123456')).toBe('123.456');
    expect(maskCpf('123456789')).toBe('123.456.789');
    expect(maskCpf('12345678901')).toBe('123.456.789-01');
  });

  it('ignores extra characters and re-applies the mask on paste', () => {
    expect(maskCpf('123.456.789-01')).toBe('123.456.789-01');
    expect(maskCpf('12345678901999')).toBe('123.456.789-01');
  });
});

describe('maskPhone', () => {
  it('grows from DDD to landline then mobile', () => {
    expect(maskPhone('')).toBe('');
    expect(maskPhone('11')).toBe('(11');
    expect(maskPhone('1199')).toBe('(11) 99');
    expect(maskPhone('1199999999')).toBe('(11) 9999-9999');
    expect(maskPhone('11999999999')).toBe('(11) 99999-9999');
  });

  it('re-masks a pasted formatted number', () => {
    expect(maskPhone('(11) 99999-9999')).toBe('(11) 99999-9999');
  });
});
