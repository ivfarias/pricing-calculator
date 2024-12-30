export interface PricingTier {
  quantity: number;
  discount: number;
}

export function calculateSellingPrice(
  baseCost: number,
  profitMargin: number,
  operationalCosts: number,
  isOperationalCostsPercentage: boolean,
  creditCardFee: number,
  seasonalDiscount: number,
  taxRate: number
): number {
  const marginMultiplier = 1 / (1 - profitMargin / 100);
  const operationalCostMultiplier = isOperationalCostsPercentage
    ? 1 + operationalCosts / 100
    : 1 + operationalCosts / baseCost;
  const creditCardMultiplier = 1 + creditCardFee / 100;
  const seasonalDiscountMultiplier = 1 - seasonalDiscount / 100;
  const taxMultiplier = 1 + taxRate / 100;

  return (
    baseCost *
    marginMultiplier *
    operationalCostMultiplier *
    creditCardMultiplier *
    seasonalDiscountMultiplier *
    taxMultiplier
  );
}

export function calculateBulkPrice(basePrice: number, quantity: number, tiers: PricingTier[]): number {
  const applicableTier = tiers
    .filter((tier) => quantity >= tier.quantity)
    .sort((a, b) => b.quantity - a.quantity)[0];

  if (applicableTier) {
    return basePrice * (1 - applicableTier.discount / 100);
  }

  return basePrice;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount);
}

