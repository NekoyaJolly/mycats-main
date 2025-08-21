'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Title,
  Card,
  TextInput,
  Select,
  NumberInput,
  Textarea,
  Button,
  Group,
  Stack,
  Grid,
  Text,
  Paper,
  Accordion,
  ActionIcon,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { notifications } from '@mantine/notifications';
import '@mantine/dates/styles.css';
import {
  IconDeviceFloppy,
  IconArrowLeft,
  IconGenderMale,
  IconGenderFemale,
  IconDna,
  IconInfoCircle,
  IconPaw,
  IconUser,
  IconPlus,
  IconSearch,
} from '@tabler/icons-react';

interface PedigreeFormData {
  pedigreeId: string;
  title?: string;
  catName: string;
  catName2?: string;
  breedCode?: number;
  genderCode?: number;
  eyeColor?: string;
  coatColorCode?: number;
  birthDate?: Date;
  breederName?: string;
  ownerName?: string;
  registrationDate?: Date;
  brotherCount?: number;
  sisterCount?: number;
  notes?: string;
  notes2?: string;
  otherNo?: string;
  
  // 父親情報
  fatherTitle?: string;
  fatherCatName?: string;
  fatherCoatColor?: string;
  fatherEyeColor?: string;
  fatherJCU?: string;
  fatherOtherCode?: string;
  
  // 母親情報
  motherTitle?: string;
  motherCatName?: string;
  motherCoatColor?: string;
  motherEyeColor?: string;
  motherJCU?: string;
  motherOtherCode?: string;
  
  // 祖父母情報（父方祖父母）
  ffTitle?: string;
  ffCatName?: string;
  ffCatColor?: string;
  ffJCU?: string;
  
  fmTitle?: string;
  fmCatName?: string;
  fmCatColor?: string;
  fmJCU?: string;
  
  // 祖父母情報（母方祖父母）
  mfTitle?: string;
  mfCatName?: string;
  mfCatColor?: string;
  mfJCU?: string;
  
  mmTitle?: string;
  mmCatName?: string;
  mmCatColor?: string;
  mmJCU?: string;
}

export default function NewPedigreePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<PedigreeFormData>({
    pedigreeId: '',
    catName: '',
  });

  // Call ID検索用の状態
  const [callIdData, setCallIdData] = useState({
    mainId: '',
    parentsId: '',
    fatherId: '',
    motherId: '',
  });

  useEffect(() => {
    setMounted(true);
    // 自動ID生成は削除 - 新規ボタンクリック時のみ生成
  }, []);

  // 新規ボタン：PedigreeID生成とフォームリセット
  const handleNewForm = async () => {
    try {
      const response = await fetch('http://localhost:3004/api/v1/pedigrees/next-id');
      if (response.ok) {
        const data = await response.json();
        // フォーム全体をリセットして新規IDを設定
        setFormData({
          pedigreeId: data.nextPedigreeId,
          catName: '',
        });
        // Call IDも初期化
        setCallIdData({
          mainId: '',
          parentsId: '',
          fatherId: '',
          motherId: '',
        });
        
        notifications.show({
          title: '新規フォーム',
          message: `新規PedigreeID: ${data.nextPedigreeId} を生成しました`,
          color: 'green',
        });
      }
    } catch (error) {
      console.error('Error generating new PedigreeID:', error);
      notifications.show({
        title: 'エラー',
        message: '新規IDの生成に失敗しました',
        color: 'red',
      });
    }
  };

  // Call ID検索機能
  const searchByCallId = async (pedigreeId: string, searchType: 'main' | 'parents' | 'father' | 'mother') => {
    if (!pedigreeId.trim()) return;

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3004/api/v1/pedigrees/search/${pedigreeId}`);
      
      if (response.ok) {
        const searchData = await response.json();
        applySearchResult(searchData, searchType);
        
        notifications.show({
          title: '検索成功',
          message: `PedigreeID ${pedigreeId} の情報を取得しました`,
          color: 'green',
        });
      } else {
        notifications.show({
          title: '検索失敗',
          message: `PedigreeID ${pedigreeId} が見つかりませんでした`,
          color: 'red',
        });
      }
    } catch (error) {
      console.error('Search error:', error);
      notifications.show({
        title: 'エラー',
        message: '検索中にエラーが発生しました',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  // 検索結果を適切な世代にマッピング
  const applySearchResult = (searchData: PedigreeFormData, searchType: string) => {
    switch (searchType) {
      case 'main':
        // 本猫ID: そのまま全世代表示
        setFormData(prev => ({
          ...prev,
          // G0 本猫情報
          title: searchData.title,
          catName: searchData.catName,
          catName2: searchData.catName2,
          breedCode: searchData.breedCode,
          genderCode: searchData.genderCode,
          eyeColor: searchData.eyeColor,
          coatColorCode: searchData.coatColorCode,
          birthDate: searchData.birthDate ? new Date(searchData.birthDate) : undefined,
          registrationDate: searchData.registrationDate ? new Date(searchData.registrationDate) : undefined,
          breederName: searchData.breederName,
          ownerName: searchData.ownerName,
          brotherCount: searchData.brotherCount,
          sisterCount: searchData.sisterCount,
          notes: searchData.notes,
          notes2: searchData.notes2,
          otherNo: searchData.otherNo,
          // G1 両親情報
          fatherTitle: searchData.fatherTitle,
          fatherCatName: searchData.fatherCatName,
          fatherCoatColor: searchData.fatherCoatColor,
          fatherEyeColor: searchData.fatherEyeColor,
          fatherJCU: searchData.fatherJCU,
          fatherOtherCode: searchData.fatherOtherCode,
          motherTitle: searchData.motherTitle,
          motherCatName: searchData.motherCatName,
          motherCoatColor: searchData.motherCoatColor,
          motherEyeColor: searchData.motherEyeColor,
          motherJCU: searchData.motherJCU,
          motherOtherCode: searchData.motherOtherCode,
          // G2 祖父母情報
          ffTitle: searchData.ffTitle,
          ffCatName: searchData.ffCatName,
          ffCatColor: searchData.ffCatColor,
          ffJCU: searchData.ffJCU,
          fmTitle: searchData.fmTitle,
          fmCatName: searchData.fmCatName,
          fmCatColor: searchData.fmCatColor,
          fmJCU: searchData.fmJCU,
          mfTitle: searchData.mfTitle,
          mfCatName: searchData.mfCatName,
          mfCatColor: searchData.mfCatColor,
          mfJCU: searchData.mfJCU,
          mmTitle: searchData.mmTitle,
          mmCatName: searchData.mmCatName,
          mmCatColor: searchData.mmCatColor,
          mmJCU: searchData.mmJCU,
        }));
        break;

      case 'parents':
        // 両親ID: G1からG3の3世代表示（G0は無視）
        setFormData(prev => ({
          ...prev,
          // G1 両親情報
          fatherTitle: searchData.fatherTitle,
          fatherCatName: searchData.fatherCatName,
          fatherCoatColor: searchData.fatherCoatColor,
          fatherEyeColor: searchData.fatherEyeColor,
          fatherJCU: searchData.fatherJCU,
          fatherOtherCode: searchData.fatherOtherCode,
          motherTitle: searchData.motherTitle,
          motherCatName: searchData.motherCatName,
          motherCoatColor: searchData.motherCoatColor,
          motherEyeColor: searchData.motherEyeColor,
          motherJCU: searchData.motherJCU,
          motherOtherCode: searchData.motherOtherCode,
          // G2 祖父母情報
          ffTitle: searchData.ffTitle,
          ffCatName: searchData.ffCatName,
          ffCatColor: searchData.ffCatColor,
          ffJCU: searchData.ffJCU,
          fmTitle: searchData.fmTitle,
          fmCatName: searchData.fmCatName,
          fmCatColor: searchData.fmCatColor,
          fmJCU: searchData.fmJCU,
          mfTitle: searchData.mfTitle,
          mfCatName: searchData.mfCatName,
          mfCatColor: searchData.mfCatColor,
          mfJCU: searchData.mfJCU,
          mmTitle: searchData.mmTitle,
          mmCatName: searchData.mmCatName,
          mmCatColor: searchData.mmCatColor,
          mmJCU: searchData.mmJCU,
        }));
        break;

      case 'father':
        // 父猫ID: 検索データの本猫→G1Father、2世代シフト表示
        setFormData(prev => ({
          ...prev,
          // G0→G1 Father
          fatherTitle: searchData.title,
          fatherCatName: searchData.catName,
          fatherCoatColor: searchData.fatherCoatColor,
          fatherEyeColor: searchData.eyeColor,
          fatherJCU: searchData.fatherJCU,
          fatherOtherCode: searchData.fatherOtherCode,
          // G1→G2 父方祖父母
          ffTitle: searchData.fatherTitle,
          ffCatName: searchData.fatherCatName,
          ffCatColor: searchData.fatherCoatColor,
          ffJCU: searchData.fatherJCU,
          fmTitle: searchData.motherTitle,
          fmCatName: searchData.motherCatName,
          fmCatColor: searchData.motherCoatColor,
          fmJCU: searchData.motherJCU,
        }));
        break;

      case 'mother':
        // 母猫ID: 検索データの本猫→G1Mother、2世代シフト表示
        setFormData(prev => ({
          ...prev,
          // G0→G1 Mother
          motherTitle: searchData.title,
          motherCatName: searchData.catName,
          motherCoatColor: searchData.motherCoatColor,
          motherEyeColor: searchData.eyeColor,
          motherJCU: searchData.motherJCU,
          motherOtherCode: searchData.motherOtherCode,
          // G1→G2 母方祖父母
          mfTitle: searchData.fatherTitle,
          mfCatName: searchData.fatherCatName,
          mfCatColor: searchData.fatherCoatColor,
          mfJCU: searchData.fatherJCU,
          mmTitle: searchData.motherTitle,
          mmCatName: searchData.motherCatName,
          mmCatColor: searchData.motherCoatColor,
          mmJCU: searchData.motherJCU,
        }));
        break;
    }
  };

  const updateFormData = <K extends keyof PedigreeFormData>(
    key: K,
    value: PedigreeFormData[K],
  ) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        birthDate: formData.birthDate?.toISOString().split('T')[0],
        registrationDate: formData.registrationDate?.toISOString().split('T')[0],
      };

      const response = await fetch('http://localhost:3004/api/v1/pedigrees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        notifications.show({
          title: '登録完了',
          message: '血統書が正常に登録されました',
          color: 'green',
        });
        router.push('/pedigrees');
      } else {
        const error = await response.json();
        notifications.show({
          title: 'エラー',
          message: error.message || '登録に失敗しました',
          color: 'red',
        });
      }
    } catch (error) {
      console.error('Submit error:', error);
      notifications.show({
        title: 'エラー',
        message: 'ネットワークエラーが発生しました',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadSampleData = () => {
    setFormData({
      pedigreeId: 'JCU0000001',
      title: 'Champion',
      catName: 'Sample Cat',
      catName2: 'Cattery Name',
      breedCode: 92, // Minuet(LH)
      genderCode: 1, // Male
      eyeColor: 'Gold',
      coatColorCode: 190, // Cream Tabby-White
      birthDate: new Date('2019-01-05'),
      registrationDate: new Date('2022-02-22'),
      breederName: 'Hayato Inami',
      ownerName: 'Hayato Inami',
      brotherCount: 2,
      sisterCount: 2,
      notes: '血統書サンプルデータ（設計書準拠）',
      notes2: '',
      otherNo: '',
      // 親の情報
      fatherTitle: 'Grand Champion',
      fatherCatName: 'Father Sample Cat',
      fatherCoatColor: 'Blue Cream',
      fatherEyeColor: 'Gold',
      fatherJCU: 'JCU0000002',
      motherTitle: 'Champion',
      motherCatName: 'Mother Sample Cat',
      motherCoatColor: 'Tortoiseshell',
      motherEyeColor: 'Green',
      motherJCU: 'JCU0000003',
      // 祖父母の情報
      ffTitle: 'International Champion',
      ffCatName: 'Paternal Grandfather',
      ffCatColor: 'Black',
      ffJCU: 'JCU0000004',
      fmTitle: 'Premier',
      fmCatName: 'Paternal Grandmother',
      fmCatColor: 'White',
      fmJCU: 'JCU0000005',
      mfTitle: 'Champion',
      mfCatName: 'Maternal Grandfather',
      mfCatColor: 'Red Tabby',
      mfJCU: 'JCU0000006',
      mmTitle: 'Grand Champion',
      mmCatName: 'Maternal Grandmother',
      mmCatColor: 'Brown Tabby',
      mmJCU: 'JCU0000007',
    });

    notifications.show({
      title: 'サンプルデータ入力',
      message: 'サンプルデータを入力しました',
      color: 'blue',
    });
  };

  if (!mounted) {
    return null;
  }

  return (
    <Container size="xl" py="xl">
      <Group justify="space-between" mb="xl">
        <Group>
          <ActionIcon
            variant="subtle"
            size="lg"
            onClick={() => router.back()}
          >
            <IconArrowLeft size={18} />
          </ActionIcon>
          <Title order={1} size="h2">
            新規血統書登録
          </Title>
        </Group>
        <Group>
          <Button
            variant="filled"
            leftSection={<IconPlus size={16} />}
            onClick={handleNewForm}
          >
            新規
          </Button>
          <Button
            variant="light"
            leftSection={<IconPlus size={16} />}
            onClick={loadSampleData}
          >
            サンプル
          </Button>
        </Group>
      </Group>

      <form onSubmit={handleSubmit}>
        <Stack gap="xl">
          {/* 基本情報 */}
          <Card withBorder shadow="sm" p="lg">
            <Group justify="space-between" mb="md">
              <Text size="lg" fw={600}>
                <IconInfoCircle size={20} style={{ marginRight: 8 }} />
                基本情報
              </Text>
            </Group>

            <Grid>
              <Grid.Col span={6}>
                <TextInput
                  label="血統書ID"
                  placeholder="例: JCU0000001"
                  required
                  value={formData.pedigreeId}
                  onChange={e => updateFormData('pedigreeId', e.target.value)}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="猫名"
                  placeholder="例: Sample Cat"
                  required
                  value={formData.catName}
                  onChange={e => updateFormData('catName', e.target.value)}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <TextInput
                  label="タイトル"
                  placeholder="例: Champion"
                  value={formData.title || ''}
                  onChange={e => updateFormData('title', e.target.value)}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <TextInput
                  label="猫名2（キャッテリー名）"
                  placeholder="例: Cattery Name"
                  value={formData.catName2 || ''}
                  onChange={e => updateFormData('catName2', e.target.value)}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <Select
                  label="性別"
                  placeholder="選択してください"
                  data={[
                    { value: '1', label: 'オス ♂' },
                    { value: '2', label: 'メス ♀' },
                  ]}
                  value={formData.genderCode?.toString() || ''}
                  onChange={value =>
                    updateFormData('genderCode', value ? parseInt(value) : undefined)
                  }
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <NumberInput
                  label="品種コード"
                  placeholder="例: 92"
                  value={formData.breedCode || ''}
                  onChange={value => updateFormData('breedCode', Number(value))}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <NumberInput
                  label="毛色コード"
                  placeholder="例: 190"
                  value={formData.coatColorCode || ''}
                  onChange={value => updateFormData('coatColorCode', Number(value))}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <TextInput
                  label="目の色"
                  placeholder="例: Gold"
                  value={formData.eyeColor || ''}
                  onChange={e => updateFormData('eyeColor', e.target.value)}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <DateInput
                  label="生年月日"
                  placeholder="選択してください"
                  value={formData.birthDate || null}
                  onChange={value => updateFormData('birthDate', value || undefined)}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <DateInput
                  label="登録日"
                  placeholder="選択してください"
                  value={formData.registrationDate || null}
                  onChange={value => updateFormData('registrationDate', value || undefined)}
                />
              </Grid.Col>
            </Grid>
          </Card>

          {/* Call ID検索機能 */}
          <Card withBorder shadow="sm" p="lg">
            <Group justify="space-between" mb="md">
              <Text size="lg" fw={600}>
                <IconSearch size={20} style={{ marginRight: 8 }} />
                Call ID検索
              </Text>
            </Group>

            <Grid>
              <Grid.Col span={6}>
                <TextInput
                  label="本猫ID / 両親ID"
                  placeholder="PedigreeIDを入力"
                  value={callIdData.mainId}
                  onChange={e => setCallIdData(prev => ({ ...prev, mainId: e.target.value }))}
                  rightSection={
                    <Group gap="xs">
                      <Button
                        size="xs"
                        variant="light"
                        onClick={() => searchByCallId(callIdData.mainId, 'main')}
                        disabled={!callIdData.mainId.trim()}
                      >
                        本猫
                      </Button>
                      <Button
                        size="xs"
                        variant="light" 
                        color="violet"
                        onClick={() => searchByCallId(callIdData.mainId, 'parents')}
                        disabled={!callIdData.mainId.trim()}
                      >
                        両親
                      </Button>
                    </Group>
                  }
                  rightSectionWidth={120}
                />
              </Grid.Col>
              <Grid.Col span={3}>
                <TextInput
                  label="父猫ID"
                  placeholder="PedigreeIDを入力"
                  value={callIdData.fatherId}
                  onChange={e => setCallIdData(prev => ({ ...prev, fatherId: e.target.value }))}
                  rightSection={
                    <Button
                      size="xs"
                      variant="light"
                      color="blue"
                      onClick={() => searchByCallId(callIdData.fatherId, 'father')}
                      disabled={!callIdData.fatherId.trim()}
                    >
                      検索
                    </Button>
                  }
                  rightSectionWidth={60}
                />
              </Grid.Col>
              <Grid.Col span={3}>
                <TextInput
                  label="母猫ID"
                  placeholder="PedigreeIDを入力"
                  value={callIdData.motherId}
                  onChange={e => setCallIdData(prev => ({ ...prev, motherId: e.target.value }))}
                  rightSection={
                    <Button
                      size="xs"
                      variant="light"
                      color="pink"
                      onClick={() => searchByCallId(callIdData.motherId, 'mother')}
                      disabled={!callIdData.motherId.trim()}
                    >
                      検索
                    </Button>
                  }
                  rightSectionWidth={60}
                />
              </Grid.Col>
            </Grid>

            <Text size="xs" c="dimmed" mt="sm">
              ・本猫ID：該当レコード全体を表示<br/>
              ・両親ID：G1〜G3の3世代を表示<br/>
              ・父猫ID・母猫ID：検索レコードの本猫情報が父・母セクションに移動し、2世代分を表示
            </Text>
          </Card>

          {/* 血統情報 */}
          <Card withBorder shadow="sm" p="lg">
            <Group justify="space-between" mb="md">
              <Text size="lg" fw={600}>
                <IconDna size={20} style={{ marginRight: 8 }} />
                血統情報
              </Text>
            </Group>

            <Accordion defaultValue="parents">
              <Accordion.Item value="parents">
                <Accordion.Control>
                  <Group>
                    <IconPaw size={16} />
                    <Text fw={500}>両親情報</Text>
                  </Group>
                </Accordion.Control>
                <Accordion.Panel>
                  <Grid>
                    <Grid.Col span={6}>
                      <Paper p="md" withBorder>
                        <Group mb="md">
                          <IconGenderMale size={16} color="blue" />
                          <Text fw={500} c="blue">父親</Text>
                        </Group>
                        <Stack gap="sm">
                          <TextInput
                            label="タイトル"
                            placeholder="例: Grand Champion"
                            value={formData.fatherTitle || ''}
                            onChange={e => updateFormData('fatherTitle', e.target.value)}
                          />
                          <TextInput
                            label="名前"
                            placeholder="例: Father Cat"
                            value={formData.fatherCatName || ''}
                            onChange={e => updateFormData('fatherCatName', e.target.value)}
                          />
                          <TextInput
                            label="毛色"
                            placeholder="例: Blue Cream"
                            value={formData.fatherCoatColor || ''}
                            onChange={e => updateFormData('fatherCoatColor', e.target.value)}
                          />
                          <TextInput
                            label="目の色"
                            placeholder="例: Gold"
                            value={formData.fatherEyeColor || ''}
                            onChange={e => updateFormData('fatherEyeColor', e.target.value)}
                          />
                          <TextInput
                            label="JCU番号"
                            placeholder="例: JCU0000002"
                            value={formData.fatherJCU || ''}
                            onChange={e => updateFormData('fatherJCU', e.target.value)}
                          />
                          <TextInput
                            label="その他コード"
                            placeholder="例: Other Code"
                            value={formData.fatherOtherCode || ''}
                            onChange={e => updateFormData('fatherOtherCode', e.target.value)}
                          />
                        </Stack>
                      </Paper>
                    </Grid.Col>

                    <Grid.Col span={6}>
                      <Paper p="md" withBorder>
                        <Group mb="md">
                          <IconGenderFemale size={16} color="pink" />
                          <Text fw={500} c="pink">母親</Text>
                        </Group>
                        <Stack gap="sm">
                          <TextInput
                            label="タイトル"
                            placeholder="例: Champion"
                            value={formData.motherTitle || ''}
                            onChange={e => updateFormData('motherTitle', e.target.value)}
                          />
                          <TextInput
                            label="名前"
                            placeholder="例: Mother Cat"
                            value={formData.motherCatName || ''}
                            onChange={e => updateFormData('motherCatName', e.target.value)}
                          />
                          <TextInput
                            label="毛色"
                            placeholder="例: Tortoiseshell"
                            value={formData.motherCoatColor || ''}
                            onChange={e => updateFormData('motherCoatColor', e.target.value)}
                          />
                          <TextInput
                            label="目の色"
                            placeholder="例: Green"
                            value={formData.motherEyeColor || ''}
                            onChange={e => updateFormData('motherEyeColor', e.target.value)}
                          />
                          <TextInput
                            label="JCU番号"
                            placeholder="例: JCU0000003"
                            value={formData.motherJCU || ''}
                            onChange={e => updateFormData('motherJCU', e.target.value)}
                          />
                          <TextInput
                            label="その他コード"
                            placeholder="例: Other Code"
                            value={formData.motherOtherCode || ''}
                            onChange={e => updateFormData('motherOtherCode', e.target.value)}
                          />
                        </Stack>
                      </Paper>
                    </Grid.Col>
                  </Grid>
                </Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item value="grandparents">
                <Accordion.Control>
                  <Group>
                    <IconDna size={16} />
                    <Text fw={500}>祖父母情報</Text>
                  </Group>
                </Accordion.Control>
                <Accordion.Panel>
                  <Grid>
                    <Grid.Col span={6}>
                      <Text fw={500} mb="md" c="blue">父方祖父母</Text>
                      <Grid>
                        <Grid.Col span={12}>
                          <Paper p="sm" withBorder mb="md">
                            <Text size="sm" fw={500} mb="xs">父方祖父</Text>
                            <Stack gap="xs">
                              <TextInput
                                size="sm"
                                label="タイトル"
                                value={formData.ffTitle || ''}
                                onChange={e => updateFormData('ffTitle', e.target.value)}
                              />
                              <TextInput
                                size="sm"
                                label="名前"
                                value={formData.ffCatName || ''}
                                onChange={e => updateFormData('ffCatName', e.target.value)}
                              />
                              <TextInput
                                size="sm"
                                label="毛色"
                                value={formData.ffCatColor || ''}
                                onChange={e => updateFormData('ffCatColor', e.target.value)}
                              />
                              <TextInput
                                size="sm"
                                label="JCU番号"
                                value={formData.ffJCU || ''}
                                onChange={e => updateFormData('ffJCU', e.target.value)}
                              />
                            </Stack>
                          </Paper>
                        </Grid.Col>
                        <Grid.Col span={12}>
                          <Paper p="sm" withBorder>
                            <Text size="sm" fw={500} mb="xs">父方祖母</Text>
                            <Stack gap="xs">
                              <TextInput
                                size="sm"
                                label="タイトル"
                                value={formData.fmTitle || ''}
                                onChange={e => updateFormData('fmTitle', e.target.value)}
                              />
                              <TextInput
                                size="sm"
                                label="名前"
                                value={formData.fmCatName || ''}
                                onChange={e => updateFormData('fmCatName', e.target.value)}
                              />
                              <TextInput
                                size="sm"
                                label="毛色"
                                value={formData.fmCatColor || ''}
                                onChange={e => updateFormData('fmCatColor', e.target.value)}
                              />
                              <TextInput
                                size="sm"
                                label="JCU番号"
                                value={formData.fmJCU || ''}
                                onChange={e => updateFormData('fmJCU', e.target.value)}
                              />
                            </Stack>
                          </Paper>
                        </Grid.Col>
                      </Grid>
                    </Grid.Col>

                    <Grid.Col span={6}>
                      <Text fw={500} mb="md" c="pink">母方祖父母</Text>
                      <Grid>
                        <Grid.Col span={12}>
                          <Paper p="sm" withBorder mb="md">
                            <Text size="sm" fw={500} mb="xs">母方祖父</Text>
                            <Stack gap="xs">
                              <TextInput
                                size="sm"
                                label="タイトル"
                                value={formData.mfTitle || ''}
                                onChange={e => updateFormData('mfTitle', e.target.value)}
                              />
                              <TextInput
                                size="sm"
                                label="名前"
                                value={formData.mfCatName || ''}
                                onChange={e => updateFormData('mfCatName', e.target.value)}
                              />
                              <TextInput
                                size="sm"
                                label="毛色"
                                value={formData.mfCatColor || ''}
                                onChange={e => updateFormData('mfCatColor', e.target.value)}
                              />
                              <TextInput
                                size="sm"
                                label="JCU番号"
                                value={formData.mfJCU || ''}
                                onChange={e => updateFormData('mfJCU', e.target.value)}
                              />
                            </Stack>
                          </Paper>
                        </Grid.Col>
                        <Grid.Col span={12}>
                          <Paper p="sm" withBorder>
                            <Text size="sm" fw={500} mb="xs">母方祖母</Text>
                            <Stack gap="xs">
                              <TextInput
                                size="sm"
                                label="タイトル"
                                value={formData.mmTitle || ''}
                                onChange={e => updateFormData('mmTitle', e.target.value)}
                              />
                              <TextInput
                                size="sm"
                                label="名前"
                                value={formData.mmCatName || ''}
                                onChange={e => updateFormData('mmCatName', e.target.value)}
                              />
                              <TextInput
                                size="sm"
                                label="毛色"
                                value={formData.mmCatColor || ''}
                                onChange={e => updateFormData('mmCatColor', e.target.value)}
                              />
                              <TextInput
                                size="sm"
                                label="JCU番号"
                                value={formData.mmJCU || ''}
                                onChange={e => updateFormData('mmJCU', e.target.value)}
                              />
                            </Stack>
                          </Paper>
                        </Grid.Col>
                      </Grid>
                    </Grid.Col>
                  </Grid>
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>
          </Card>

          {/* その他情報 */}
          <Card withBorder shadow="sm" p="lg">
            <Group justify="space-between" mb="md">
              <Text size="lg" fw={600}>
                <IconUser size={20} style={{ marginRight: 8 }} />
                その他情報
              </Text>
            </Group>

            <Grid>
              <Grid.Col span={6}>
                <TextInput
                  label="ブリーダー名"
                  placeholder="例: Hayato Inami"
                  value={formData.breederName || ''}
                  onChange={e => updateFormData('breederName', e.target.value)}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="オーナー名"
                  placeholder="例: Hayato Inami"
                  value={formData.ownerName || ''}
                  onChange={e => updateFormData('ownerName', e.target.value)}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <NumberInput
                  label="兄弟数"
                  placeholder="0"
                  min={0}
                  value={formData.brotherCount || ''}
                  onChange={value => updateFormData('brotherCount', Number(value))}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <NumberInput
                  label="姉妹数"
                  placeholder="0"
                  min={0}
                  value={formData.sisterCount || ''}
                  onChange={value => updateFormData('sisterCount', Number(value))}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="その他番号"
                  placeholder="例: Other Number"
                  value={formData.otherNo || ''}
                  onChange={e => updateFormData('otherNo', e.target.value)}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <Textarea
                  label="備考"
                  placeholder="備考を入力してください"
                  rows={3}
                  value={formData.notes || ''}
                  onChange={e => updateFormData('notes', e.target.value)}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <Textarea
                  label="備考2"
                  placeholder="追加の備考を入力してください"
                  rows={3}
                  value={formData.notes2 || ''}
                  onChange={e => updateFormData('notes2', e.target.value)}
                />
              </Grid.Col>
            </Grid>
          </Card>

          {/* 送信ボタン */}
          <Group justify="flex-end">
            <Button
              variant="outline"
              onClick={() => router.back()}
            >
              キャンセル
            </Button>
            <Button
              type="submit"
              loading={loading}
              leftSection={<IconDeviceFloppy size={16} />}
            >
              登録
            </Button>
          </Group>
        </Stack>
      </form>
    </Container>
  );
}
