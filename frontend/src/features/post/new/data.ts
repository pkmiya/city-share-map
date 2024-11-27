import { ItemType } from '@/features/problem/new/data';

import { DetailedProblem } from './types';

export const problems: DetailedProblem[] = [
  {
    fields: [
      {
        name: '発生源',
        type: ItemType.Text,
      },
      {
        name: '時間帯',
        type: ItemType.Text,
      },
      {
        name: '頻度',
        type: ItemType.Text,
      },
      {
        name: '生活への影響',
        type: ItemType.OnOff,
      },
    ],
    id: 1,
    name: '騒音',
  },
  {
    fields: [
      {
        name: '遭遇日時',
        type: ItemType.DateTime,
      },
      {
        name: '動物の種類',
        type: ItemType.Text,
      },
      {
        name: '大きさや特徴',
        type: ItemType.Text,
      },
      {
        name: '行動の様子',
        type: ItemType.Text,
      },
    ],
    id: 2,
    name: '動物',
  },
  {
    fields: [
      {
        name: '損傷の種類',
        type: ItemType.Text,
      },
      {
        name: '道路の写真',
        type: ItemType.Photo,
      },
      {
        name: '備考欄',
        type: ItemType.Text,
      },
    ],
    id: 3,
    name: '道路',
  },
];
