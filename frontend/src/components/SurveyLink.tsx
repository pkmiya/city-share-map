import { Link } from '@chakra-ui/react';

export const SurveyLink = () => {
  const surveyUrl = 'https://forms.office.com/r/chN7SxM55b';
  return (
    <Link
      fontSize="sm"
      fontWeight="bold"
      href={surveyUrl}
      textDecoration="underline"
      w="full"
    >
      アンケートへの回答をお願いします🙇‍♂️
    </Link>
  );
};
