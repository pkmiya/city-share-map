import { createContext, useContext, useState } from 'react';

import { FormData } from '@/features/post/new/types';

type PostContextType = {
  formData: FormData;
  setFormData: (data: Partial<FormData>) => void;
};

const PostContext = createContext<PostContextType | undefined>(undefined);

export const PostProvider = ({ children }: { children: React.ReactNode }) => {
  const [formData, setFormDataState] = useState<FormData>({
    address: '',
    fieldValues: {},
    fields: [],
    location: null,
    problem: {
      id: 0,
      name: '',
    },
  });

  const setFormData = (data: Partial<FormData>) => {
    setFormDataState((prev) => ({ ...prev, ...data }));
  };

  return (
    <PostContext.Provider value={{ formData, setFormData }}>
      {children}
    </PostContext.Provider>
  );
};

export const usePostContext = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error('usePostContext must be used within a FormProvider');
  }
  return context;
};
