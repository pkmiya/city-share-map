export type problem = {
  id: number;
  isOpen: boolean;
  name: string;
  postCount: number;
  updatedAt: Date;
};

export type getListOfProblemsRequest = {
  limit?: number;
  skip?: number;
};

export type getListOfProblemsResponse = {
  problems: problem[];
};
