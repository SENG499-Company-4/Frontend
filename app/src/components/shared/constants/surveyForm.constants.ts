export const willingRadio = {
  willing: false,
  notWilling: false,
  veryWilling: false
} as const;

export const overallDefaults = {
  ability: 'cannot',
  willing: 'notWilling'
} as const;

export const ability = {
  can: 'can',
  effort: 'effort',
  cannot: 'cannot'
} as const;

export const willing = {
  willing: 'willing',
  notWilling: 'notWilling',
  veryWilling: 'veryWilling'
} as const;
