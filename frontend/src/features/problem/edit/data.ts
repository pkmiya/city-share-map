import { itemTypes } from '../new/data';

export const problem = {
  fields: [
    {
      name: '詳細',
      type: itemTypes[0].name,
    },
    {
      name: '写真',
      type: itemTypes[1].name,
    },
    {
      name: '発生日時',
      type: itemTypes[2].name,
    },
    {
      name: 'ごみの量',
      type: itemTypes[3].name,
    },
    {
      name: 'におい',
      type: itemTypes[4].name,
    },
  ],
  id: 1,
  isOpen: true,
  name: 'ごみ',
  postCount: 123,
  updatedAt: new Date(),
};
