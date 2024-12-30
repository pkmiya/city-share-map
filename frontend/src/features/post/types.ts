// NOTE: 削除予定
export type postByAdmin = {
  createdAt: string;
  createdBy: string;
  deletedAt?: string;
  id: string;
  is_solved: boolean;
  latitude: number;
  longitude: number;
  // is_open: boolean;
  problem_id: number;
  updated_at: string;
  updated_by: string;
  user_id: string;
} & {
  [key: string]: any;
};

export type postByCitizen = {
  coordinate: {
    latitude: number;
    longitude: number;
  };
  createdAt: string;
  id: number;
  isSolved: boolean;
  problemId: number;
  problemName: string;
} & {
  [key: string]: any;
};

export type getListOfPostsRequest = {
  isOpen?: boolean;
  isSolved?: boolean;
  limit?: number;
  skip?: number;
};

export type getListOfPostsByAdminResponse = postByAdmin[];

export type getListOfPostsByCitizenResponse = {
  posts: postByCitizen[];
};

export type getListOfPostsByProblemIdRequest = {
  isOpen?: boolean;
  isSolved?: boolean;
  limit?: number;
  problemId: number;
  skip?: number;
};

export type getListOfPostsByProblemIdResponse = {
  posts: postByAdmin[];
  problemId: number;
  problemName: string;
};
