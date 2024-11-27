import { ItemType } from '../new/data';

export const problem = {
  fields: [
    {
      name: '詳細',
      type: ItemType.Text,
    },
    {
      name: '写真',
      type: ItemType.Photo,
    },
    {
      name: '発生日時',
      type: ItemType.DateTime,
    },
    {
      name: 'ごみの量',
      type: ItemType.Number,
    },
    {
      name: '生活への影響',
      type: ItemType.OnOff,
    },
  ],
  id: 1,
  isOpen: true,
  name: 'ごみ',
  postCount: 123,
  updatedAt: new Date(),
};
