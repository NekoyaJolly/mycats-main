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

  useEffect(() => {
    setMounted(true);
  }, []);

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
        registrationDate: formData.registrationDate
          ?.toISOString()
          .split('T')[0],
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
    <Container size='xl' py='xl'>
      <Group justify='space-between' mb='xl'>
        <Group>
          <ActionIcon variant='subtle' size='lg' onClick={() => router.back()}>
            <IconArrowLeft size={18} />
          </ActionIcon>
          <Title order={1} size='h2'>
            新規血統書登録
          </Title>
        </Group>
        <Button
          variant='light'
          leftSection={<IconPlus size={16} />}
          onClick={loadSampleData}
        >
          サンプルデータ
        </Button>
      </Group>

      <form onSubmit={handleSubmit}>
        <Stack gap='xl'>
          {/* 基本情報 */}
          <Card withBorder shadow='sm' p='lg'>
            <Group justify='space-between' mb='md'>
              <Text size='lg' fw={600}>
                <IconInfoCircle size={20} style={{ marginRight: 8 }} />
                基本情報
              </Text>
            </Group>

            <Grid>
              <Grid.Col span={6}>
                <TextInput
                  label='血統書ID'
                  placeholder='例: JCU0000001'
                  required
                  value={formData.pedigreeId}
                  onChange={e => updateFormData('pedigreeId', e.target.value)}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label='猫名'
                  placeholder='例: Sample Cat'
                  required
                  value={formData.catName}
                  onChange={e => updateFormData('catName', e.target.value)}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <TextInput
                  label='タイトル'
                  placeholder='例: Champion'
                  value={formData.title || ''}
                  onChange={e => updateFormData('title', e.target.value)}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <TextInput
                  label='猫名2（キャッテリー名）'
                  placeholder='例: Cattery Name'
                  value={formData.catName2 || ''}
                  onChange={e => updateFormData('catName2', e.target.value)}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <Select
                  label='性別'
                  placeholder='選択してください'
                  data={[
                    { value: '1', label: 'オス ♂' },
                    { value: '2', label: 'メス ♀' },
                  ]}
                  value={formData.genderCode?.toString() || ''}
                  onChange={value =>
                    updateFormData(
                      'genderCode',
                      value ? parseInt(value) : undefined,
                    )
                  }
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <NumberInput
                  label='品種コード'
                  placeholder='例: 92'
                  value={formData.breedCode || ''}
                  onChange={value => updateFormData('breedCode', Number(value))}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <NumberInput
                  label='毛色コード'
                  placeholder='例: 190'
                  value={formData.coatColorCode || ''}
                  onChange={value =>
                    updateFormData('coatColorCode', Number(value))
                  }
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <TextInput
                  label='目の色'
                  placeholder='例: Gold'
                  value={formData.eyeColor || ''}
                  onChange={e => updateFormData('eyeColor', e.target.value)}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <DateInput
                  label='生年月日'
                  placeholder='選択してください'
                  value={formData.birthDate || null}
                  onChange={value =>
                    updateFormData('birthDate', value || undefined)
                  }
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <DateInput
                  label='登録日'
                  placeholder='選択してください'
                  value={formData.registrationDate || null}
                  onChange={value =>
                    updateFormData('registrationDate', value || undefined)
                  }
                />
              </Grid.Col>
            </Grid>
          </Card>

          {/* 血統情報 */}
          <Card withBorder shadow='sm' p='lg'>
            <Group justify='space-between' mb='md'>
              <Text size='lg' fw={600}>
                <IconDna size={20} style={{ marginRight: 8 }} />
                血統情報
              </Text>
            </Group>

            <Accordion defaultValue='parents'>
              <Accordion.Item value='parents'>
                <Accordion.Control>
                  <Group>
                    <IconPaw size={16} />
                    <Text fw={500}>両親情報</Text>
                  </Group>
                </Accordion.Control>
                <Accordion.Panel>
                  <Grid>
                    <Grid.Col span={6}>
                      <Paper p='md' withBorder>
                        <Group mb='md'>
                          <IconGenderMale size={16} color='blue' />
                          <Text fw={500} c='blue'>
                            父親
                          </Text>
                        </Group>
                        <Stack gap='sm'>
                          <TextInput
                            label='タイトル'
                            placeholder='例: Grand Champion'
                            value={formData.fatherTitle || ''}
                            onChange={e =>
                              updateFormData('fatherTitle', e.target.value)
                            }
                          />
                          <TextInput
                            label='名前'
                            placeholder='例: Father Cat'
                            value={formData.fatherCatName || ''}
                            onChange={e =>
                              updateFormData('fatherCatName', e.target.value)
                            }
                          />
                          <TextInput
                            label='毛色'
                            placeholder='例: Blue Cream'
                            value={formData.fatherCoatColor || ''}
                            onChange={e =>
                              updateFormData('fatherCoatColor', e.target.value)
                            }
                          />
                          <TextInput
                            label='目の色'
                            placeholder='例: Gold'
                            value={formData.fatherEyeColor || ''}
                            onChange={e =>
                              updateFormData('fatherEyeColor', e.target.value)
                            }
                          />
                          <TextInput
                            label='JCU番号'
                            placeholder='例: JCU0000002'
                            value={formData.fatherJCU || ''}
                            onChange={e =>
                              updateFormData('fatherJCU', e.target.value)
                            }
                          />
                          <TextInput
                            label='その他コード'
                            placeholder='例: Other Code'
                            value={formData.fatherOtherCode || ''}
                            onChange={e =>
                              updateFormData('fatherOtherCode', e.target.value)
                            }
                          />
                        </Stack>
                      </Paper>
                    </Grid.Col>

                    <Grid.Col span={6}>
                      <Paper p='md' withBorder>
                        <Group mb='md'>
                          <IconGenderFemale size={16} color='pink' />
                          <Text fw={500} c='pink'>
                            母親
                          </Text>
                        </Group>
                        <Stack gap='sm'>
                          <TextInput
                            label='タイトル'
                            placeholder='例: Champion'
                            value={formData.motherTitle || ''}
                            onChange={e =>
                              updateFormData('motherTitle', e.target.value)
                            }
                          />
                          <TextInput
                            label='名前'
                            placeholder='例: Mother Cat'
                            value={formData.motherCatName || ''}
                            onChange={e =>
                              updateFormData('motherCatName', e.target.value)
                            }
                          />
                          <TextInput
                            label='毛色'
                            placeholder='例: Tortoiseshell'
                            value={formData.motherCoatColor || ''}
                            onChange={e =>
                              updateFormData('motherCoatColor', e.target.value)
                            }
                          />
                          <TextInput
                            label='目の色'
                            placeholder='例: Green'
                            value={formData.motherEyeColor || ''}
                            onChange={e =>
                              updateFormData('motherEyeColor', e.target.value)
                            }
                          />
                          <TextInput
                            label='JCU番号'
                            placeholder='例: JCU0000003'
                            value={formData.motherJCU || ''}
                            onChange={e =>
                              updateFormData('motherJCU', e.target.value)
                            }
                          />
                          <TextInput
                            label='その他コード'
                            placeholder='例: Other Code'
                            value={formData.motherOtherCode || ''}
                            onChange={e =>
                              updateFormData('motherOtherCode', e.target.value)
                            }
                          />
                        </Stack>
                      </Paper>
                    </Grid.Col>
                  </Grid>
                </Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item value='grandparents'>
                <Accordion.Control>
                  <Group>
                    <IconDna size={16} />
                    <Text fw={500}>祖父母情報</Text>
                  </Group>
                </Accordion.Control>
                <Accordion.Panel>
                  <Grid>
                    <Grid.Col span={6}>
                      <Text fw={500} mb='md' c='blue'>
                        父方祖父母
                      </Text>
                      <Grid>
                        <Grid.Col span={12}>
                          <Paper p='sm' withBorder mb='md'>
                            <Text size='sm' fw={500} mb='xs'>
                              父方祖父
                            </Text>
                            <Stack gap='xs'>
                              <TextInput
                                size='sm'
                                label='タイトル'
                                value={formData.ffTitle || ''}
                                onChange={e =>
                                  updateFormData('ffTitle', e.target.value)
                                }
                              />
                              <TextInput
                                size='sm'
                                label='名前'
                                value={formData.ffCatName || ''}
                                onChange={e =>
                                  updateFormData('ffCatName', e.target.value)
                                }
                              />
                              <TextInput
                                size='sm'
                                label='毛色'
                                value={formData.ffCatColor || ''}
                                onChange={e =>
                                  updateFormData('ffCatColor', e.target.value)
                                }
                              />
                              <TextInput
                                size='sm'
                                label='JCU番号'
                                value={formData.ffJCU || ''}
                                onChange={e =>
                                  updateFormData('ffJCU', e.target.value)
                                }
                              />
                            </Stack>
                          </Paper>
                        </Grid.Col>
                        <Grid.Col span={12}>
                          <Paper p='sm' withBorder>
                            <Text size='sm' fw={500} mb='xs'>
                              父方祖母
                            </Text>
                            <Stack gap='xs'>
                              <TextInput
                                size='sm'
                                label='タイトル'
                                value={formData.fmTitle || ''}
                                onChange={e =>
                                  updateFormData('fmTitle', e.target.value)
                                }
                              />
                              <TextInput
                                size='sm'
                                label='名前'
                                value={formData.fmCatName || ''}
                                onChange={e =>
                                  updateFormData('fmCatName', e.target.value)
                                }
                              />
                              <TextInput
                                size='sm'
                                label='毛色'
                                value={formData.fmCatColor || ''}
                                onChange={e =>
                                  updateFormData('fmCatColor', e.target.value)
                                }
                              />
                              <TextInput
                                size='sm'
                                label='JCU番号'
                                value={formData.fmJCU || ''}
                                onChange={e =>
                                  updateFormData('fmJCU', e.target.value)
                                }
                              />
                            </Stack>
                          </Paper>
                        </Grid.Col>
                      </Grid>
                    </Grid.Col>

                    <Grid.Col span={6}>
                      <Text fw={500} mb='md' c='pink'>
                        母方祖父母
                      </Text>
                      <Grid>
                        <Grid.Col span={12}>
                          <Paper p='sm' withBorder mb='md'>
                            <Text size='sm' fw={500} mb='xs'>
                              母方祖父
                            </Text>
                            <Stack gap='xs'>
                              <TextInput
                                size='sm'
                                label='タイトル'
                                value={formData.mfTitle || ''}
                                onChange={e =>
                                  updateFormData('mfTitle', e.target.value)
                                }
                              />
                              <TextInput
                                size='sm'
                                label='名前'
                                value={formData.mfCatName || ''}
                                onChange={e =>
                                  updateFormData('mfCatName', e.target.value)
                                }
                              />
                              <TextInput
                                size='sm'
                                label='毛色'
                                value={formData.mfCatColor || ''}
                                onChange={e =>
                                  updateFormData('mfCatColor', e.target.value)
                                }
                              />
                              <TextInput
                                size='sm'
                                label='JCU番号'
                                value={formData.mfJCU || ''}
                                onChange={e =>
                                  updateFormData('mfJCU', e.target.value)
                                }
                              />
                            </Stack>
                          </Paper>
                        </Grid.Col>
                        <Grid.Col span={12}>
                          <Paper p='sm' withBorder>
                            <Text size='sm' fw={500} mb='xs'>
                              母方祖母
                            </Text>
                            <Stack gap='xs'>
                              <TextInput
                                size='sm'
                                label='タイトル'
                                value={formData.mmTitle || ''}
                                onChange={e =>
                                  updateFormData('mmTitle', e.target.value)
                                }
                              />
                              <TextInput
                                size='sm'
                                label='名前'
                                value={formData.mmCatName || ''}
                                onChange={e =>
                                  updateFormData('mmCatName', e.target.value)
                                }
                              />
                              <TextInput
                                size='sm'
                                label='毛色'
                                value={formData.mmCatColor || ''}
                                onChange={e =>
                                  updateFormData('mmCatColor', e.target.value)
                                }
                              />
                              <TextInput
                                size='sm'
                                label='JCU番号'
                                value={formData.mmJCU || ''}
                                onChange={e =>
                                  updateFormData('mmJCU', e.target.value)
                                }
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
          <Card withBorder shadow='sm' p='lg'>
            <Group justify='space-between' mb='md'>
              <Text size='lg' fw={600}>
                <IconUser size={20} style={{ marginRight: 8 }} />
                その他情報
              </Text>
            </Group>

            <Grid>
              <Grid.Col span={6}>
                <TextInput
                  label='ブリーダー名'
                  placeholder='例: Hayato Inami'
                  value={formData.breederName || ''}
                  onChange={e => updateFormData('breederName', e.target.value)}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label='オーナー名'
                  placeholder='例: Hayato Inami'
                  value={formData.ownerName || ''}
                  onChange={e => updateFormData('ownerName', e.target.value)}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <NumberInput
                  label='兄弟数'
                  placeholder='0'
                  min={0}
                  value={formData.brotherCount || ''}
                  onChange={value =>
                    updateFormData('brotherCount', Number(value))
                  }
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <NumberInput
                  label='姉妹数'
                  placeholder='0'
                  min={0}
                  value={formData.sisterCount || ''}
                  onChange={value =>
                    updateFormData('sisterCount', Number(value))
                  }
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label='その他番号'
                  placeholder='例: Other Number'
                  value={formData.otherNo || ''}
                  onChange={e => updateFormData('otherNo', e.target.value)}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <Textarea
                  label='備考'
                  placeholder='備考を入力してください'
                  rows={3}
                  value={formData.notes || ''}
                  onChange={e => updateFormData('notes', e.target.value)}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <Textarea
                  label='備考2'
                  placeholder='追加の備考を入力してください'
                  rows={3}
                  value={formData.notes2 || ''}
                  onChange={e => updateFormData('notes2', e.target.value)}
                />
              </Grid.Col>
            </Grid>
          </Card>

          {/* 送信ボタン */}
          <Group justify='flex-end'>
            <Button variant='outline' onClick={() => router.back()}>
              キャンセル
            </Button>
            <Button
              type='submit'
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
