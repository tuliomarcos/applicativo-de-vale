export const onlyDigits = (value: string): string => value.replace(/\D/g, '');

export const formatCnpj = (value: string): string => {
  const digits = onlyDigits(value).slice(0, 14);

  if (digits.length <= 2) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
  if (digits.length <= 8) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
  if (digits.length <= 12) {
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`;
  }

  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`;
};

export const formatPhone = (value: string): string => {
  const digits = onlyDigits(value).slice(0, 11);

  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

export const isValidCnpj = (value: string): boolean => {
  const cnpj = onlyDigits(value);

  if (cnpj.length !== 14) return false;
  if (/^(\d)\1+$/.test(cnpj)) return false;

  const calcDigit = (base: string, factors: number[]): number => {
    const total = base
      .split('')
      .reduce((sum, current, index) => sum + Number(current) * factors[index], 0);

    const remainder = total % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  const firstDigit = calcDigit(cnpj.slice(0, 12), [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  const secondDigit = calcDigit(cnpj.slice(0, 13), [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);

  return cnpj.endsWith(`${firstDigit}${secondDigit}`);
};

export const isValidPhone = (value: string): boolean => {
  const phone = onlyDigits(value);

  if (phone.length !== 10 && phone.length !== 11) return false;
  if (/^(\d)\1+$/.test(phone)) return false;

  const ddd = Number(phone.slice(0, 2));
  return ddd >= 11 && ddd <= 99;
};

export const formatCpf = (value: string): string => {
  const digits = onlyDigits(value).slice(0, 11);

  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
};

export const isValidCpf = (value: string): boolean => {
  const cpf = onlyDigits(value);

  if (cpf.length !== 11) return false;
  if (/^(\d)\1+$/.test(cpf)) return false;

  const calcDigit = (base: string, factor: number): number => {
    const total = base
      .split('')
      .reduce((sum, current) => {
        const result = sum + Number(current) * factor;
        factor -= 1;
        return result;
      }, 0);

    const remainder = (total * 10) % 11;
    return remainder === 10 ? 0 : remainder;
  };

  const firstDigit = calcDigit(cpf.slice(0, 9), 10);
  const secondDigit = calcDigit(cpf.slice(0, 10), 11);

  return cpf.endsWith(`${firstDigit}${secondDigit}`);
};

export const formatTruckPlate = (value: string): string => {
  const plate = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 7);

  if (plate.length <= 3) return plate;
  return `${plate.slice(0, 3)}-${plate.slice(3)}`;
};

export const normalizeTruckPlate = (value: string): string =>
  value.toUpperCase().replace(/[^A-Z0-9]/g, '');
