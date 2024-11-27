'use client';

import { Box, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import { usePostContext } from '@/context/postProvider';

import { DetailsForm } from './components/DetailsForm';
import { LocationPick } from './components/LocationPick';
import { ProblemSelect } from './components/ProblemSelect';

export const NewPostForm = () => {
  const [step, setStep] = useState(1);
  const { setFormData } = usePostContext();

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  useEffect(() => {
    setFormData({
      address: '',
      fieldValues: {},
      fields: [],
      location: null,
      problem: {
        id: 0,
        name: '',
      },
    });
  }, []);

  return (
    <Box m="auto" maxW="600px">
      <Text fontSize="x-large" fontWeight="bold">
        レポートの投稿
      </Text>
      <Box mt={4}>
        {step === 1 && <ProblemSelect onNext={handleNext} />}
        {step === 2 && <LocationPick onBack={handleBack} onNext={handleNext} />}
        {step === 3 && <DetailsForm onBack={handleBack} />}
      </Box>
    </Box>
  );
};
