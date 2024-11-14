import { problem } from './types';

export const problems: problem[] = [
  {
    id: 1,
    isOpen: true,
    name: 'ごみ',
    postCount: 123,
    updatedAt: new Date(),
  },
  {
    id: 2,
    isOpen: false,
    name: '動物',
    postCount: 456,
    updatedAt: new Date(new Date().getTime() - 1 * 24 * 3600 * 1000),
  },
  {
    id: 3,
    isOpen: true,
    name: '道路',
    postCount: 789,
    updatedAt: new Date(new Date().getTime() - 2 * 24 * 3600 * 1000),
  },
];
