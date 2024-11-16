import { post } from './types';

export const posts: post[] = [
  {
    coordinate: {
      latitude: 35.681236,
      longitude: 139.767125,
    },
    customItems: [
      {
        itemName: '損傷の種類',
        itemValue: 'ひび割れ',
      },
      {
        itemName: '写真',
        itemValue: '/image_cracked-road.webp',
      },
      {
        itemName: '備考欄',
        itemValue: 'ここに何か書いてください',
      },
    ],
    id: 1,
    isOpen: true,
    isSolved: false,
    postedAt: new Date(),
    problemId: 1,
    problemName: '道路',
    userName: 'user1',
  },
  {
    coordinate: {
      latitude: 35.681236,
      longitude: 139.767125,
    },
    customItems: [
      {
        itemName: '動物の種類',
        itemValue: '野良犬',
      },
      {
        itemName: '大きさや特徴',
        itemValue: '小型で茶色',
      },
      {
        itemName: '行動の様子',
        itemValue: 'かわいいです',
      },
    ],
    id: 2,
    isOpen: false,
    isSolved: true,
    postedAt: new Date(),
    problemId: 2,
    problemName: '動物',
    userName: 'user2',
  },
  {
    coordinate: {
      latitude: 35.681236,
      longitude: 139.767125,
    },
    customItems: [
      {
        itemName: '発生源の種類',
        itemValue: '工場',
      },
      {
        itemName: '時間帯',
        itemValue: '夕方',
      },
      {
        itemName: '頻度',
        itemValue: '毎日',
      },
    ],
    id: 3,
    isOpen: true,
    isSolved: true,
    postedAt: new Date(),
    problemId: 3,
    problemName: '騒音',
    userName: 'user3',
  },
];
