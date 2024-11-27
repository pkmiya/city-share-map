import { ItemType } from '@/features/problem/new/data';

export type Location = {
  lat: number;
  lng: number;
};

export type FormData = {
  address: string | null;
  fieldValues: Record<string, any>;
  fields: Field[];
  location: Location | null;
  problem: {
    id: number;
    name: string;
  };
};

export type Field = {
  name: string;
  type: ItemType;
};

export type DetailedProblem = {
  fields: Field[];
  id: number;
  name: string;
};
