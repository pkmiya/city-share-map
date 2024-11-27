'use client';

import { Box, Text } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { DetailsForm } from './components/DetailsForm';
import { LocationPick } from './components/LocationPick';
import { ProblemSelect } from './components/ProblemSelect';
import { problems } from './data';

export const NewPostForm = () => {
  const [step, setStep] = useState(1);
  const [selectedProblem, setSelectedProblem] = useState<number | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [formData, setFormData] = useState({
    details: '',
    location: null,
    problem: '',
  });

  const router = useRouter();

  const handleNext = (data: any) => {
    setFormData({ ...formData, ...data });
    if (data.problem) {
      const problem = problems.find((p) => p.name === data.problem);
      setSelectedProblem(problem?.id || null);
    }
    if (data.location) {
      setLocation(data.location);
    }
    setStep(step + 1);
  };

  const handleBack = () => setStep(step - 1);

  const handleSubmit = async (data: Record<string, any>) => {
    // TODO: APIつなぎこみ
    console.log('Submitting data:', { ...formData, details: data });
    alert('投稿が完了しました！');

    await router.push('/map');
  };

  useEffect(() => {
    setFormData({
      details: '',
      location: null,
      problem: '',
    });
    setStep(1);
  }, []);

  return (
    <Box m="auto" maxW="600px">
      <Text fontSize="x-large" fontWeight="bold">
        レポートの投稿
      </Text>
      <Box mt={4}>
        {step === 1 && <ProblemSelect onNext={handleNext} />}
        {step === 2 && <LocationPick onBack={handleBack} onNext={handleNext} />}
        {step === 3 && selectedProblem && location && (
          <DetailsForm
            fields={
              problems.find((p) => p.id === selectedProblem)?.fields || []
            }
            location={location}
            problem={problems.find((p) => p.id === selectedProblem)?.name || ''}
            onBack={handleBack}
            onSubmit={handleSubmit}
          />
        )}
      </Box>
    </Box>
  );
};
