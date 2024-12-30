import { getListOfPostsResponse } from './newType';

export const posts: getListOfPostsResponse = [
  {
    coordinate: {
      latitude: 35.681236,
      longitude: 139.767125,
    },
    id: '1',
    isOpen: true,
    isSolved: false,
    createdAt: new Date(),
    problem: {
      problemId: '1',
      problemName: '道路',
    },
    user: {
      userId: '1',
      userName: 'user1',
    },
    updatedAt: new Date(),
    updatedBy: 'user1',
  },
  {
    coordinate: {
      latitude: 35.681236,
      longitude: 139.767125,
    },
    id: '2',
    isOpen: true,
    isSolved: false,
    createdAt: new Date(),
    problem: {
      problemId: '2',
      problemName: 'ごみ',
    },
    user: {
      userId: '1',
      userName: 'user1',
    },
    updatedAt: new Date(),
    updatedBy: 'user1',
  },
  {
    coordinate: {
      latitude: 35.681236,
      longitude: 139.767125,
    },
    id: '2',
    isOpen: true,
    isSolved: false,
    createdAt: new Date(),
    problem: {
      problemId: '3',
      problemName: '動物',
    },
    user: {
      userId: '1',
      userName: 'user1',
    },
    updatedAt: new Date(),
    updatedBy: 'user1',
  },
];
