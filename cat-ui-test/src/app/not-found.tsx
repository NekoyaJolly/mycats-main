import { Container, Text, Title, Button, Stack } from '@mantine/core';
import Link from 'next/link';

export default function NotFound() {
  return (
    <Container size="sm" py="xl">
      <Stack align="center" gap="lg">
        <Title order={1} size="h1">
          404
        </Title>
        <Title order={2} size="h3">
          ページが見つかりません
        </Title>
        <Text c="dimmed" ta="center">
          お探しのページは存在しないか、削除された可能性があります。
        </Text>
        <Button component={Link} href="/">
          ホームに戻る
        </Button>
      </Stack>
    </Container>
  );
}
