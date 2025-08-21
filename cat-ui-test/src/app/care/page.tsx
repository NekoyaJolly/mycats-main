'use client';

import { useState } from 'react';
import {
  Container,
  Title,
  Card,
  Group,
  Text,
  Badge,
  Stack,
  Tabs,
  Table,
  ScrollArea,
  Box,
  Button,
  ActionIcon,
  Modal,
  TextInput,
  Select,
  Textarea,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import {
  IconPlus,
  IconEdit,
  IconCalendar,
  IconPill,
  IconWeight,
  IconShield,
} from '@tabler/icons-react';

// ケア記録の型定義
interface CareRecord {
  id: string;
  catId: string;
  catName: string;
  type: 'ワクチン' | '駆虫' | '健康診断' | '体重測定' | 'その他';
  date: string;
  description: string;
  nextDate?: string;
  status: '完了' | '予定' | '遅延';
  veterinarian?: string;
  notes?: string;
}

// サンプルケア記録データ
const sampleCareRecords: CareRecord[] = [
  {
    id: '1',
    catId: 'c1',
    catName: 'レオ',
    type: 'ワクチン',
    date: '2025-08-03',
    description: '3種混合ワクチン接種',
    nextDate: '2026-08-03',
    status: '完了',
    veterinarian: '田中獣医師',
    notes: '副反応なし、経過良好',
  },
  {
    id: '2',
    catId: 'c2',
    catName: 'ルナ',
    type: '健康診断',
    date: '2025-08-05',
    description: '定期健康診断',
    nextDate: '2025-11-05',
    status: '予定',
    veterinarian: '佐藤獣医師',
  },
  {
    id: '3',
    catId: 'c3',
    catName: 'ミケ',
    type: '駆虫',
    date: '2025-07-28',
    description: '内部寄生虫駆除薬投与',
    nextDate: '2025-08-28',
    status: '遅延',
    notes: '投与予定日を過ぎています',
  },
  {
    id: '4',
    catId: 'c1',
    catName: 'レオ',
    type: '体重測定',
    date: '2025-08-01',
    description: '定期体重測定: 4.2kg',
    nextDate: '2025-08-15',
    status: '完了',
  },
  {
    id: '5',
    catId: 'c4',
    catName: 'シロ',
    type: 'ワクチン',
    date: '2025-08-10',
    description: '子猫用ワクチン（2回目）',
    nextDate: '2025-09-10',
    status: '予定',
    veterinarian: '田中獣医師',
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case '完了':
      return 'green';
    case '予定':
      return 'blue';
    case '遅延':
      return 'red';
    default:
      return 'gray';
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'ワクチン':
      return <IconShield size={16} />;
    case '駆虫':
      return <IconPill size={16} />;
    case '健康診断':
      return <IconCalendar size={16} />;
    case '体重測定':
      return <IconWeight size={16} />;
    default:
      return <IconEdit size={16} />;
  }
};

export default function CarePage() {
  const [careRecords, setCareRecords] =
    useState<CareRecord[]>(sampleCareRecords);
  const [opened, { open, close }] = useDisclosure(false);
  const [activeTab, setActiveTab] = useState<string>('today');

  // 今日の予定を取得
  const getTodayCare = () => {
    const today = new Date().toISOString().split('T')[0];
    return careRecords.filter(
      record => record.date === today || record.nextDate === today,
    );
  };

  // 遅延中のケアを取得
  const getOverdueCare = () => {
    const today = new Date().toISOString().split('T')[0];
    return careRecords.filter(
      record =>
        record.nextDate && record.nextDate < today && record.status !== '完了',
    );
  };

  // 今週の予定を取得
  const getWeekCare = () => {
    const today = new Date();
    const weekLater = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const todayStr = today.toISOString().split('T')[0];
    const weekLaterStr = weekLater.toISOString().split('T')[0];

    return careRecords.filter(
      record =>
        (record.date >= todayStr && record.date <= weekLaterStr) ||
        (record.nextDate &&
          record.nextDate >= todayStr &&
          record.nextDate <= weekLaterStr),
    );
  };

  return (
    <Container
      size='lg'
      style={{
        minHeight: '100vh',
        backgroundColor: '#f8f9fa',
        padding: '1rem',
        paddingBottom: '5rem',
      }}
    >
      {/* ヘッダー */}
      <Group justify='space-between' mb='lg' wrap='nowrap'>
        <Title order={1} c='blue' size='h2'>
          ケアスケジュール
        </Title>
        <Button leftSection={<IconPlus size={16} />} onClick={open} size='sm'>
          ケア記録追加
        </Button>
      </Group>

      {/* サマリーカード */}
      <Group grow mb='lg'>
        <Card padding='md' bg='red.0' radius='md'>
          <Group gap='xs'>
            <Text size='xl' c='red'>
              ⚠️
            </Text>
            <Box>
              <Text size='lg' fw={700} c='red'>
                {getOverdueCare().length}
              </Text>
              <Text size='sm' c='dimmed'>
                遅延中
              </Text>
            </Box>
          </Group>
        </Card>
        <Card padding='md' bg='blue.0' radius='md'>
          <Group gap='xs'>
            <Text size='xl' c='blue'>
              📅
            </Text>
            <Box>
              <Text size='lg' fw={700} c='blue'>
                {getTodayCare().length}
              </Text>
              <Text size='sm' c='dimmed'>
                本日予定
              </Text>
            </Box>
          </Group>
        </Card>
        <Card padding='md' bg='green.0' radius='md'>
          <Group gap='xs'>
            <Text size='xl' c='green'>
              📊
            </Text>
            <Box>
              <Text size='lg' fw={700} c='green'>
                {getWeekCare().length}
              </Text>
              <Text size='sm' c='dimmed'>
                今週予定
              </Text>
            </Box>
          </Group>
        </Card>
      </Group>

      {/* タブ */}
      <Tabs
        value={activeTab}
        onChange={value => setActiveTab(value || 'today')}
        variant='outline'
        mb='md'
      >
        <Tabs.List grow>
          <Tabs.Tab value='today' leftSection={<IconCalendar size={14} />}>
            本日
          </Tabs.Tab>
          <Tabs.Tab value='overdue' leftSection={<Text size='sm'>⚠️</Text>}>
            遅延中
          </Tabs.Tab>
          <Tabs.Tab value='week' leftSection={<Text size='sm'>📊</Text>}>
            今週
          </Tabs.Tab>
          <Tabs.Tab value='all' leftSection={<IconEdit size={14} />}>
            全記録
          </Tabs.Tab>
        </Tabs.List>

        {/* 本日のケア */}
        <Tabs.Panel value='today' pt='md'>
          <Stack gap='md'>
            {getTodayCare().length === 0 ? (
              <Card padding='lg' bg='gray.0' radius='md'>
                <Text ta='center' c='dimmed'>
                  本日のケア予定はありません
                </Text>
              </Card>
            ) : (
              getTodayCare().map(record => (
                <Card
                  key={record.id}
                  shadow='sm'
                  padding='md'
                  radius='md'
                  withBorder
                >
                  <Group justify='space-between' wrap='nowrap'>
                    <Group gap='md'>
                      {getTypeIcon(record.type)}
                      <Box>
                        <Text fw={500}>{record.catName}</Text>
                        <Text size='sm' c='dimmed'>
                          {record.description}
                        </Text>
                        {record.veterinarian && (
                          <Text size='xs' c='blue'>
                            担当: {record.veterinarian}
                          </Text>
                        )}
                      </Box>
                    </Group>
                    <Group gap='xs'>
                      <Badge size='sm' color={getStatusColor(record.status)}>
                        {record.status}
                      </Badge>
                      <ActionIcon variant='subtle' size='sm'>
                        <IconEdit size={14} />
                      </ActionIcon>
                    </Group>
                  </Group>
                </Card>
              ))
            )}
          </Stack>
        </Tabs.Panel>

        {/* 遅延中のケア */}
        <Tabs.Panel value='overdue' pt='md'>
          <Stack gap='md'>
            {getOverdueCare().length === 0 ? (
              <Card padding='lg' bg='green.0' radius='md'>
                <Text ta='center' c='green'>
                  遅延中のケアはありません
                </Text>
              </Card>
            ) : (
              getOverdueCare().map(record => (
                <Card
                  key={record.id}
                  shadow='sm'
                  padding='md'
                  radius='md'
                  withBorder
                  bg='red.0'
                >
                  <Group justify='space-between' wrap='nowrap'>
                    <Group gap='md'>
                      {getTypeIcon(record.type)}
                      <Box>
                        <Text fw={500}>{record.catName}</Text>
                        <Text size='sm' c='dimmed'>
                          {record.description}
                        </Text>
                        <Text size='xs' c='red'>
                          予定日: {record.nextDate}
                        </Text>
                        {record.notes && (
                          <Text size='xs' c='orange'>
                            {record.notes}
                          </Text>
                        )}
                      </Box>
                    </Group>
                    <Group gap='xs'>
                      <Badge size='sm' color='red'>
                        遅延中
                      </Badge>
                      <ActionIcon variant='subtle' size='sm'>
                        <IconEdit size={14} />
                      </ActionIcon>
                    </Group>
                  </Group>
                </Card>
              ))
            )}
          </Stack>
        </Tabs.Panel>

        {/* 今週の予定 */}
        <Tabs.Panel value='week' pt='md'>
          <Stack gap='md'>
            {getWeekCare().map(record => (
              <Card
                key={record.id}
                shadow='sm'
                padding='md'
                radius='md'
                withBorder
              >
                <Group justify='space-between' wrap='nowrap'>
                  <Group gap='md'>
                    {getTypeIcon(record.type)}
                    <Box>
                      <Text fw={500}>{record.catName}</Text>
                      <Text size='sm' c='dimmed'>
                        {record.description}
                      </Text>
                      <Text size='xs' c='blue'>
                        {record.status === '完了'
                          ? `実施日: ${record.date}`
                          : `予定日: ${record.nextDate || record.date}`}
                      </Text>
                    </Box>
                  </Group>
                  <Group gap='xs'>
                    <Badge size='sm' color={getStatusColor(record.status)}>
                      {record.status}
                    </Badge>
                    <ActionIcon variant='subtle' size='sm'>
                      <IconEdit size={14} />
                    </ActionIcon>
                  </Group>
                </Group>
              </Card>
            ))}
          </Stack>
        </Tabs.Panel>

        {/* 全記録 */}
        <Tabs.Panel value='all' pt='md'>
          <Card shadow='sm' padding='md' radius='md' withBorder>
            <ScrollArea>
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>猫名</Table.Th>
                    <Table.Th>ケア種類</Table.Th>
                    <Table.Th>実施日</Table.Th>
                    <Table.Th>次回予定</Table.Th>
                    <Table.Th>状態</Table.Th>
                    <Table.Th>操作</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {careRecords.map(record => (
                    <Table.Tr key={record.id}>
                      <Table.Td>
                        <Text fw={500}>{record.catName}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Group gap='xs'>
                          {getTypeIcon(record.type)}
                          <Text size='sm'>{record.type}</Text>
                        </Group>
                      </Table.Td>
                      <Table.Td>{record.date}</Table.Td>
                      <Table.Td>{record.nextDate || '-'}</Table.Td>
                      <Table.Td>
                        <Badge size='sm' color={getStatusColor(record.status)}>
                          {record.status}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <ActionIcon variant='subtle' size='sm'>
                          <IconEdit size={14} />
                        </ActionIcon>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </ScrollArea>
          </Card>
        </Tabs.Panel>
      </Tabs>

      {/* ケア記録追加モーダル */}
      <Modal opened={opened} onClose={close} title='ケア記録追加' size='md'>
        <Stack gap='md'>
          <Select
            label='猫選択'
            placeholder='ケアを実施する猫を選択'
            data={[
              { value: '1', label: 'レオ' },
              { value: '2', label: 'ルナ' },
              { value: '3', label: 'ミケ' },
              { value: '4', label: 'シロ' },
            ]}
          />
          <Select
            label='ケア種類'
            placeholder='実施するケアの種類を選択'
            data={[
              { value: 'ワクチン', label: 'ワクチン接種' },
              { value: '駆虫', label: '寄生虫駆除' },
              { value: '健康診断', label: '健康診断' },
              { value: '体重測定', label: '体重測定' },
              { value: 'その他', label: 'その他' },
            ]}
          />
          <DateInput label='実施日' placeholder='ケアを実施した日を選択' />
          <TextInput label='ケア内容' placeholder='具体的なケア内容を入力' />
          <TextInput
            label='担当獣医師'
            placeholder='担当した獣医師名（任意）'
          />
          <DateInput label='次回予定日' placeholder='次回実施予定日（任意）' />
          <Textarea label='備考' placeholder='特記事項があれば入力' rows={3} />
          <Group justify='flex-end' mt='md'>
            <Button variant='outline' onClick={close}>
              キャンセル
            </Button>
            <Button onClick={close}>登録</Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
}
