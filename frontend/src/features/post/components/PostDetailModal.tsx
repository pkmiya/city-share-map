import {
  Box,
  Button,
  Divider,
  HStack,
  Img,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tag,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import { DeletePostRequest, Items, PostResponse } from '@/gen/api';

import { useGetAddress } from '../new/hooks/useGetAddress';

type PostDetailModalProps = {
  data: PostResponse | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (data: DeletePostRequest) => void;
};

export const PostDetailModal = ({
  isOpen,
  onClose,
  onDelete,
  data,
}: PostDetailModalProps) => {
  const handleDelete = (req: DeletePostRequest) => {
    onDelete(req);
    onClose();
  };

  const { error, isLoading: loading, fetchAddress } = useGetAddress();
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndSetAddress = async () => {
      if (data?.coodinate) {
        try {
          const res = await fetchAddress({
            lat: Number(data.coodinate.latitude),
            lon: Number(data.coodinate.longitude),
          });
          setAddress(res);
        } catch (error) {
          console.error('住所の取得に失敗しました:', error);
          setAddress(null);
        }
      }
    };

    fetchAndSetAddress();
  }, [data?.coodinate, fetchAddress]);

  if (!data) return null;
  const { coodinate, createdAt, isSolved, items, problem, updatedAt, user } =
    data;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>投稿内容詳細</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack align="stretch" spacing={4}>
            <Text fontSize="xl" fontWeight="bold">
              基本情報
            </Text>
            <Text>課題名: {problem.name}</Text>
            <Text>投稿者: {user?.name ?? 'データなし'}</Text>
            <Text>投稿者ID: {user?.id ?? 'データなし'}</Text>
            <Text>投稿日時: {createdAt.toLocaleString()}</Text>
            {updatedAt && <Text>更新日時: {updatedAt?.toLocaleString()}</Text>}
            <HStack>
              <Text>対応状況: </Text>
              <Tag colorScheme={isSolved ? 'green' : 'red'}>
                {isSolved ? '解決済' : '対応中'}
              </Tag>
            </HStack>

            <Divider />

            <Text fontSize="xl" fontWeight="bold">
              位置情報
            </Text>
            <Text>
              座標: 経度{coodinate.latitude}, 緯度{coodinate.longitude}
            </Text>
            <Text>
              住所: {loading ? '読み込み中...' : address || error || '未選択'}
            </Text>

            <Divider />

            <VStack align="stretch" spacing={2}>
              <Text fontSize="xl" fontWeight="bold">
                入力情報
              </Text>
              {items &&
                Object.entries(items as Record<string, Items>).map(
                  ([key, value]) => {
                    if (typeof value === 'string') {
                      const stringValue = value as string;
                      if (stringValue.startsWith('data:image')) {
                        return (
                          <Box key={key} mb={2}>
                            <Text mb={2}>{key}:</Text>
                            <Img
                              key={key}
                              alt={key}
                              height="auto"
                              src={stringValue}
                              width="100%"
                            />
                          </Box>
                        );
                      }
                      return (
                        <Text key={key}>
                          {key}: {value || '未入力'}
                        </Text>
                      );
                    }
                    if (typeof value === 'number') {
                      return (
                        <Text key={key}>
                          {key}: {value}
                        </Text>
                      );
                    }
                    if (typeof value === 'boolean') {
                      return (
                        <Text key={key}>
                          {key}: {value ? 'はい' : 'いいえ'}
                        </Text>
                      );
                    }
                    if (typeof value === 'object' && value) {
                      const dateString = value as unknown as string;
                      const date = new Date(dateString);
                      if (!isNaN(date.getTime())) {
                        return (
                          <Text key={key}>
                            {key}: {date.toLocaleDateString()}
                          </Text>
                        );
                      }
                    }
                    return (
                      <Text key={key}>
                        {key}: {String(value) || '不明な値'}
                      </Text>
                    );
                  },
                )}
            </VStack>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="red"
            onClick={() =>
              handleDelete({ postId: data.id, problemId: data.problem.id })
            }
          >
            削除
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
