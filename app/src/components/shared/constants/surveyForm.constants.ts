export const willingRadio = {
  willing: false,
  notWilling: false,
  veryWilling: false
} as const;

export const overallDefaults = {
  ability: 'cannot',
  willing: 'notWilling'
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

