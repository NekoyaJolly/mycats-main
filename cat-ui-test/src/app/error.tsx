'use client';

import { Container, Text, Title, Button, Stack } from '@mantine/core';
import Link from 'next/link';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Container size='sm' py='xl'>
      <Stack align='center' gap='lg'>
        <Title order={1} size='h1'>
          エラーが発生しました
        </Title>
        <Text c='dimmed' ta='center'>
          申し訳ありません。予期しないエラーが発生しました。
        </Text>
        <Stack gap='sm'>
          <Button onClick={reset}>再試行</Button>
          <Button component={Link} href='/' variant='outline'>
            ホームに戻る
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
}
