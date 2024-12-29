import { ProblemRead, ProblemReadByID } from '@/gen/api';

export type Location = {
  lat: number;
  lng: number;
};

export type FormData = {
  fieldValues?: Record<string, any>;
  location?: {
    address?: string;
    coordinates?: Location;
  };
  problems: ProblemRead[];
  selectedProblemDetail: ProblemReadByID | null;
};

export type item = {
  name: string;
  required?: boolean;
  typeId?: number;
};

export type DetailedProblem = {
  fields: item[];
  id: number;
  name: string;
};
