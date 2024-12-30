// NOTE: 削除予定
export type postByAdmin = {
  latitude: number;
  longitude: number;
  id: string;
  // is_open: boolean;
  is_solved: boolean;
  createdAt: string;
  createdBy: string;
  deletedAt?: string;
  problem_id: number;
  user_id: string;
  updated_at: string;
  updated_by: string;
} & {
  [key: string]: any;
};

export type postByCitizen = {
  coordinate: {
    latitude: number;
    longitude: number;
  };
  id: number;
  isSolved: boolean;
  createdAt: string;
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
