import { getListOfPostsResponse } from './newType';

export const posts: getListOfPostsResponse = [
  {
    coordinate: {
      latitude: 35.681236,
      longitude: 139.767125,
    },
    createdAt: new Date(),
    id: '1',
    isOpen: true,
    isSolved: false,
    problem: {
      problemId: '1',
      problemName: '道路',
    },
    updatedAt: new Date(),
    updatedBy: 'user1',
    user: {
      userId: '1',
      userName: 'user1',
    },
  },
  {
    coordinate: {
      latitude: 35.681236,
      longitude: 139.767125,
    },
    createdAt: new Date(),
    id: '2',
    isOpen: true,
    isSolved: false,
    problem: {
      problemId: '2',
      problemName: 'ごみ',
    },
    updatedAt: new Date(),
    updatedBy: 'user1',
    user: {
      userId: '1',
      userName: 'user1',
    },
  },
  {
    coordinate: {
      latitude: 35.681236,
      longitude: 139.767125,
    },
    createdAt: new Date(),
    id: '2',
    isOpen: true,
    isSolved: false,
    problem: {
      problemId: '3',
      problemName: '動物',
    },
    updatedAt: new Date(),
    updatedBy: 'user1',
    user: {
      userId: '1',
      userName: 'user1',
    },
  },
];
