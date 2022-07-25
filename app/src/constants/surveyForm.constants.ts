export const willingRadio = {
  willing: false,
  notWilling: false,
  veryWilling: false
} as const;

export enum ability {
  can = 'can',
  effort = 'effort',
  cannot = 'cannot'
}

export enum willing {
  willing = 'willing',
  notWilling = 'notWilling',
  veryWilling = 'veryWilling'
}

export const overallDefaults = {
  ability: ability.cannot,
  willing: willing.notWilling
} as const;
