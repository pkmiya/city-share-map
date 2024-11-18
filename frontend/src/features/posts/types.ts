export type post = {
  coordinate: {
    latitude: number;
    longitude: number;
  };
  customItems: {
    itemName: string;
    itemValue: any;
  }[];
  id: number;
  isOpen: boolean;
  isSolved: boolean;
  postedAt: Date;
  problemId: number;
  problemName: string;
  userName: string;
};

export type getListOfPostsRequest = {
  isOpen?: boolean;
  isSolved?: boolean;
  limit?: number;
  skip?: number;
};

export type getListOfPostsResponse = {
  posts: post[];
};

export type getListOfPostsByProblemIdRequest = {
  isOpen?: boolean;
  isSolved?: boolean;
  limit?: number;
  problemId: number;
  skip?: number;
};

export type getListOfPostsByProblemIdResponse = {
  posts: post[];
  problemId: number;
  problemName: string;
};
