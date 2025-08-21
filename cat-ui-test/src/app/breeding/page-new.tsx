'use client';

import { useState } from 'react';
import {
  Container,
  Title,
  Text,
  Table,
  Button,
  Group,
  Stack,
  Paper,
  Badge,
} from '@mantine/core';

// 正しい型定義 - BreedingRecordベース
interface BreedingRecord {
  id: string;
  maleId: string;
  femaleId: string;
  breedingDate: string;
  expectedDueDate?: string;
  actualDueDate?: string;
  numberOfKittens?: number;
  notes?: string;
  status: 'PLANNED' | 'COMPLETED' | 'FAILED';
  // リレーション
  male: {
    name: string;
    registrationId: string;
  };
  female: {
    name: string;
    registrationId: string;
  };
}

export default function BreedingPage() {
  const [breedingRecords, setBreedingRecords] = useState<BreedingRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // TODO: 実際のAPIエンドポイントに接続
  // const { data, isLoading } = useQuery(['breeding-records'], () =>
  //   fetch('/api/v1/breeding-records').then(res => res.json())
  // );

  return (
    <Container size="xl" py="md">
      <Stack gap="md">
        <Group justify="space-between">
          <Title order={1}>🔗 交配管理</Title>
          <Button variant="filled">新しい交配記録</Button>
        </Group>

        <Text c="dimmed">
          猫の交配記録を管理します。計画中の交配、完了した交配、出産予定などを追跡できます。
        </Text>

        <Paper p="md" withBorder>
          <Title order={2} size="h3" mb="md">交配記録一覧</Title>
          
          {breedingRecords.length === 0 ? (
            <Text ta="center" c="dimmed" py="xl">
              交配記録がありません。新しい記録を作成してください。
            </Text>
          ) : (
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>交配日</Table.Th>
                  <Table.Th>オス猫</Table.Th>
                  <Table.Th>メス猫</Table.Th>
                  <Table.Th>出産予定日</Table.Th>
                  <Table.Th>子猫数</Table.Th>
                  <Table.Th>ステータス</Table.Th>
                  <Table.Th>アクション</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {breedingRecords.map((record) => (
                  <Table.Tr key={record.id}>
                    <Table.Td>
                      {new Date(record.breedingDate).toLocaleDateString('ja-JP')}
                    </Table.Td>
                    <Table.Td>
                      <Text fw={500}>{record.male.name}</Text>
                      <Text size="xs" c="dimmed">{record.male.registrationId}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text fw={500}>{record.female.name}</Text>
                      <Text size="xs" c="dimmed">{record.female.registrationId}</Text>
                    </Table.Td>
                    <Table.Td>
                      {record.expectedDueDate 
                        ? new Date(record.expectedDueDate).toLocaleDateString('ja-JP')
                        : '-'
                      }
                    </Table.Td>
                    <Table.Td>
                      {record.numberOfKittens ?? '-'}
                    </Table.Td>
                    <Table.Td>
                      <Badge 
                        color={
                          record.status === 'COMPLETED' ? 'green' :
                          record.status === 'PLANNED' ? 'blue' : 'red'
                        }
                      >
                        {record.status === 'COMPLETED' ? '完了' :
                         record.status === 'PLANNED' ? '計画中' : '失敗'
                        }
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <Button size="xs" variant="light">編集</Button>
                        <Button size="xs" variant="light" color="red">削除</Button>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          )}
        </Paper>

        <Paper p="md" withBorder>
          <Title order={2} size="h3" mb="md">交配統計</Title>
          <Text c="dimmed">
            今後、交配成功率、平均子猫数、品種別統計などを表示します。
          </Text>
        </Paper>
      </Stack>
    </Container>
  );
}
