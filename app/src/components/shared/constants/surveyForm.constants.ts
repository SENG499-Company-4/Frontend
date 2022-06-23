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

export enum departmentTopics {
  SENG = '480',
  ECE = '496',
  CSC = '482' //TODO: Verify we need to handle CSC cause there are 5 diff variants of topics [482, 483, 484, 485, 486]
}

export const allTopics: { [key: string]: string[] } = {
  SENG: ['480'],
  ECE: ['496', '519', '529', '539', '549', '559', '569', '589', '596'],
  CSC: ['482', '483', '484', '485', '486', '578', '581', '582', '583', '584', '585', '586', '588', '589']
};
