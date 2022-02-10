export interface NutritionInfo {
  priceCents: number;
  massGrams: number;
  energyKilocalorie: number;
  fatGrams: number;
  carbohydrateGrams: number;
  proteinGrams: number;
}

export function nutritionInfoDescription(value: NutritionInfo): string {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  return `${formatter.format(value.priceCents / 100)} / ${value.massGrams}g / ${
    value.energyKilocalorie
  }kcal / ${value.fatGrams}g fat / ${value.carbohydrateGrams}g carb / ${
    value.proteinGrams
  }g protein`;
}

export function nutritionInfo(): NutritionInfo {
  return {
    priceCents: 0,
    massGrams: 0,
    energyKilocalorie: 0,
    fatGrams: 0,
    carbohydrateGrams: 0,
    proteinGrams: 0,
  };
}

export function addNutritionInfo(
  lhs: NutritionInfo,
  rhs: NutritionInfo
): NutritionInfo {
  return {
    priceCents: lhs.priceCents + rhs.priceCents,
    massGrams: lhs.massGrams + rhs.massGrams,
    energyKilocalorie: lhs.energyKilocalorie + rhs.energyKilocalorie,
    fatGrams: lhs.fatGrams + rhs.fatGrams,
    carbohydrateGrams: lhs.carbohydrateGrams + rhs.carbohydrateGrams,
    proteinGrams: lhs.proteinGrams + rhs.proteinGrams,
  };
}

export function sumNutritionInfo(info: Array<NutritionInfo>): NutritionInfo {
  return info.reduce(
    (previousValue, currentValue) =>
      addNutritionInfo(previousValue, currentValue),
    nutritionInfo()
  );
}

export function divideNutritionInfo(
  lhs: NutritionInfo,
  rhs: number
): NutritionInfo {
  return {
    priceCents: Math.round(lhs.priceCents / rhs),
    massGrams: Math.round(lhs.massGrams / rhs),
    energyKilocalorie: Math.round(lhs.energyKilocalorie / rhs),
    fatGrams: Math.round(lhs.fatGrams / rhs),
    carbohydrateGrams: Math.round(lhs.carbohydrateGrams / rhs),
    proteinGrams: Math.round(lhs.proteinGrams / rhs),
  };
}

export function multiplyNutritionInfo(
  lhs: NutritionInfo,
  rhs: number
): NutritionInfo {
  return {
    priceCents: Math.round(lhs.priceCents * rhs),
    massGrams: Math.round(lhs.massGrams * rhs),
    energyKilocalorie: Math.round(lhs.energyKilocalorie * rhs),
    fatGrams: Math.round(lhs.fatGrams * rhs),
    carbohydrateGrams: Math.round(lhs.carbohydrateGrams * rhs),
    proteinGrams: Math.round(lhs.proteinGrams * rhs),
  };
}
