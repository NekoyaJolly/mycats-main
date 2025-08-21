'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Title,
  Paper,
  Grid,
  Text,
  Badge,
  Group,
  Stack,
  Button,
  Card,
  Divider,
  LoadingOverlay,
  Alert,
  ActionIcon,
} from '@mantine/core';
import {
  IconArrowLeft,
  IconCalendar,
  IconUser,
  IconDna,
  IconFileText,
  IconGenderMale,
  IconGenderFemale,
  IconPaw,
  IconEdit,
} from '@tabler/icons-react';
import { useRouter, useParams } from 'next/navigation';

interface PedigreeDetail {
  id: string;
  pedigreeId: string;
  title?: string;
  catName: string;
  catName2?: string;
  breedCode?: number;
  genderCode?: number;
  eyeColor?: string;
  coatColorCode?: number;
  birthDate?: string;
  registrationDate?: string;
  breederName?: string;
  ownerName?: string;
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
  
  // システム情報
  createdAt?: string;
  updatedAt?: string;
}

export default function PedigreeDetailPage() {
  const router = useRouter();
  const params = useParams();
  const pedigreeId = params.id as string;

  const [pedigree, setPedigree] = useState<PedigreeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPedigree = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:3004/api/v1/pedigrees/${pedigreeId}`,
        );

        if (!response.ok) {
          throw new Error('血統書データの取得に失敗しました');
        }

        const data = await response.json();
        setPedigree(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : '不明なエラーが発生しました',
        );
      } finally {
        setLoading(false);
      }
    };

    if (pedigreeId) {
      fetchPedigree();
    }
  }, [pedigreeId]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '不明';
    try {
      return new Date(dateString).toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const formatGender = (genderCode?: number) => {
    switch (genderCode) {
      case 1:
        return '雄';
      case 2:
        return '雌';
      default:
        return '不明';
    }
  };

  const getGenderIcon = (genderCode?: number) => {
    switch (genderCode) {
      case 1:
        return <IconGenderMale size={16} color="blue" />;
      case 2:
        return <IconGenderFemale size={16} color="pink" />;
      default:
        return null;
    }
  };

  const getGenderColor = (genderCode?: number) => {
    switch (genderCode) {
      case 1:
        return 'blue';
      case 2:
        return 'pink';
      default:
        return 'gray';
    }
  };

  if (loading) {
    return (
      <Container size="xl" py="xl">
        <LoadingOverlay visible />
      </Container>
    );
  }

  if (error || !pedigree) {
    return (
      <Container size="xl" py="xl">
        <Alert color="red" title="エラー">
          {error || '血統書データが見つかりませんでした'}
        </Alert>
      </Container>
    );
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
            血統書詳細
          </Title>
        </Group>
        <Button
          variant="light"
          leftSection={<IconEdit size={16} />}
          onClick={() => router.push(`/pedigrees/${pedigreeId}/edit`)}
        >
          編集
        </Button>
      </Group>

      <Stack gap="xl">
        {/* 基本情報 */}
        <Card withBorder shadow="sm" p="lg">
          <Group justify="space-between" mb="md">
            <Group>
              <IconFileText size={20} />
              <Text size="lg" fw={600}>
                基本情報
              </Text>
            </Group>
            <Badge size="lg" variant="light">
              {pedigree.pedigreeId}
            </Badge>
          </Group>

          <Grid>
            <Grid.Col span={6}>
              <Stack gap="sm">
                <Group>
                  <Text fw={600}>猫名:</Text>
                  <Text size="lg" fw={700}>
                    {pedigree.catName}
                  </Text>
                  {pedigree.catName2 && (
                    <Text size="sm" c="dimmed">
                      ({pedigree.catName2})
                    </Text>
                  )}
                </Group>
                {pedigree.title && (
                  <Group>
                    <Text fw={600}>タイトル:</Text>
                    <Badge color="gold" variant="light">
                      {pedigree.title}
                    </Badge>
                  </Group>
                )}
                <Group>
                  <Text fw={600}>性別:</Text>
                  {getGenderIcon(pedigree.genderCode)}
                  <Badge color={getGenderColor(pedigree.genderCode)} size="sm">
                    {formatGender(pedigree.genderCode)}
                  </Badge>
                </Group>
                {pedigree.eyeColor && (
                  <Group>
                    <Text fw={600}>目の色:</Text>
                    <Text>{pedigree.eyeColor}</Text>
                  </Group>
                )}
              </Stack>
            </Grid.Col>
            <Grid.Col span={6}>
              <Stack gap="sm">
                <Group>
                  <IconCalendar size={16} />
                  <Text fw={600}>生年月日:</Text>
                  <Text>{formatDate(pedigree.birthDate)}</Text>
                </Group>
                <Group>
                  <IconCalendar size={16} />
                  <Text fw={600}>登録日:</Text>
                  <Text>{formatDate(pedigree.registrationDate)}</Text>
                </Group>
                {pedigree.breedCode && (
                  <Group>
                    <Text fw={600}>品種コード:</Text>
                    <Badge variant="outline">{pedigree.breedCode}</Badge>
                  </Group>
                )}
                {pedigree.coatColorCode && (
                  <Group>
                    <Text fw={600}>毛色コード:</Text>
                    <Badge variant="outline">{pedigree.coatColorCode}</Badge>
                  </Group>
                )}
              </Stack>
            </Grid.Col>
          </Grid>
        </Card>

        {/* 血統情報 */}
        <Card withBorder shadow="sm" p="lg">
          <Group mb="md">
            <IconDna size={20} />
            <Text size="lg" fw={600}>
              血統情報
            </Text>
          </Group>

          <Grid>
            {/* 両親情報 */}
            <Grid.Col span={12}>
              <Text size="md" fw={600} mb="md">両親</Text>
              <Grid>
                <Grid.Col span={6}>
                  <Paper p="md" withBorder>
                    <Group mb="sm">
                      <IconGenderMale size={16} color="blue" />
                      <Text fw={500} c="blue">父親</Text>
                    </Group>
                    {pedigree.fatherCatName ? (
                      <Stack gap="xs">
                        <Group>
                          <Text size="sm" fw={600}>名前:</Text>
                          <Text size="sm">{pedigree.fatherCatName}</Text>
                        </Group>
                        {pedigree.fatherTitle && (
                          <Group>
                            <Text size="sm" fw={600}>タイトル:</Text>
                            <Badge size="xs" variant="light">{pedigree.fatherTitle}</Badge>
                          </Group>
                        )}
                        {pedigree.fatherCoatColor && (
                          <Group>
                            <Text size="sm" fw={600}>毛色:</Text>
                            <Text size="sm">{pedigree.fatherCoatColor}</Text>
                          </Group>
                        )}
                        {pedigree.fatherEyeColor && (
                          <Group>
                            <Text size="sm" fw={600}>目の色:</Text>
                            <Text size="sm">{pedigree.fatherEyeColor}</Text>
                          </Group>
                        )}
                        {pedigree.fatherJCU && (
                          <Group>
                            <Text size="sm" fw={600}>JCU:</Text>
                            <Text size="sm">{pedigree.fatherJCU}</Text>
                          </Group>
                        )}
                      </Stack>
                    ) : (
                      <Text size="sm" c="dimmed">情報なし</Text>
                    )}
                  </Paper>
                </Grid.Col>

                <Grid.Col span={6}>
                  <Paper p="md" withBorder>
                    <Group mb="sm">
                      <IconGenderFemale size={16} color="pink" />
                      <Text fw={500} c="pink">母親</Text>
                    </Group>
                    {pedigree.motherCatName ? (
                      <Stack gap="xs">
                        <Group>
                          <Text size="sm" fw={600}>名前:</Text>
                          <Text size="sm">{pedigree.motherCatName}</Text>
                        </Group>
                        {pedigree.motherTitle && (
                          <Group>
                            <Text size="sm" fw={600}>タイトル:</Text>
                            <Badge size="xs" variant="light">{pedigree.motherTitle}</Badge>
                          </Group>
                        )}
                        {pedigree.motherCoatColor && (
                          <Group>
                            <Text size="sm" fw={600}>毛色:</Text>
                            <Text size="sm">{pedigree.motherCoatColor}</Text>
                          </Group>
                        )}
                        {pedigree.motherEyeColor && (
                          <Group>
                            <Text size="sm" fw={600}>目の色:</Text>
                            <Text size="sm">{pedigree.motherEyeColor}</Text>
                          </Group>
                        )}
                        {pedigree.motherJCU && (
                          <Group>
                            <Text size="sm" fw={600}>JCU:</Text>
                            <Text size="sm">{pedigree.motherJCU}</Text>
                          </Group>
                        )}
                      </Stack>
                    ) : (
                      <Text size="sm" c="dimmed">情報なし</Text>
                    )}
                  </Paper>
                </Grid.Col>
              </Grid>
            </Grid.Col>

            {/* 祖父母情報 */}
            <Grid.Col span={12}>
              <Text size="md" fw={600} mb="md">祖父母</Text>
              <Grid>
                <Grid.Col span={6}>
                  <Text fw={500} mb="sm" c="blue">父方祖父母</Text>
                  <Stack gap="sm">
                    <Paper p="sm" withBorder>
                      <Text size="sm" fw={500} mb="xs">父方祖父</Text>
                      {pedigree.ffCatName ? (
                        <Stack gap="xs">
                          <Group gap="xs">
                            <Text size="xs" fw={600}>名前:</Text>
                            <Text size="xs">{pedigree.ffCatName}</Text>
                          </Group>
                          {pedigree.ffTitle && (
                            <Group gap="xs">
                              <Text size="xs" fw={600}>タイトル:</Text>
                              <Badge size="xs" variant="light">{pedigree.ffTitle}</Badge>
                            </Group>
                          )}
                          {pedigree.ffCatColor && (
                            <Group gap="xs">
                              <Text size="xs" fw={600}>毛色:</Text>
                              <Text size="xs">{pedigree.ffCatColor}</Text>
                            </Group>
                          )}
                          {pedigree.ffJCU && (
                            <Group gap="xs">
                              <Text size="xs" fw={600}>JCU:</Text>
                              <Text size="xs">{pedigree.ffJCU}</Text>
                            </Group>
                          )}
                        </Stack>
                      ) : (
                        <Text size="xs" c="dimmed">情報なし</Text>
                      )}
                    </Paper>
                    
                    <Paper p="sm" withBorder>
                      <Text size="sm" fw={500} mb="xs">父方祖母</Text>
                      {pedigree.fmCatName ? (
                        <Stack gap="xs">
                          <Group gap="xs">
                            <Text size="xs" fw={600}>名前:</Text>
                            <Text size="xs">{pedigree.fmCatName}</Text>
                          </Group>
                          {pedigree.fmTitle && (
                            <Group gap="xs">
                              <Text size="xs" fw={600}>タイトル:</Text>
                              <Badge size="xs" variant="light">{pedigree.fmTitle}</Badge>
                            </Group>
                          )}
                          {pedigree.fmCatColor && (
                            <Group gap="xs">
                              <Text size="xs" fw={600}>毛色:</Text>
                              <Text size="xs">{pedigree.fmCatColor}</Text>
                            </Group>
                          )}
                          {pedigree.fmJCU && (
                            <Group gap="xs">
                              <Text size="xs" fw={600}>JCU:</Text>
                              <Text size="xs">{pedigree.fmJCU}</Text>
                            </Group>
                          )}
                        </Stack>
                      ) : (
                        <Text size="xs" c="dimmed">情報なし</Text>
                      )}
                    </Paper>
                  </Stack>
                </Grid.Col>

                <Grid.Col span={6}>
                  <Text fw={500} mb="sm" c="pink">母方祖父母</Text>
                  <Stack gap="sm">
                    <Paper p="sm" withBorder>
                      <Text size="sm" fw={500} mb="xs">母方祖父</Text>
                      {pedigree.mfCatName ? (
                        <Stack gap="xs">
                          <Group gap="xs">
                            <Text size="xs" fw={600}>名前:</Text>
                            <Text size="xs">{pedigree.mfCatName}</Text>
                          </Group>
                          {pedigree.mfTitle && (
                            <Group gap="xs">
                              <Text size="xs" fw={600}>タイトル:</Text>
                              <Badge size="xs" variant="light">{pedigree.mfTitle}</Badge>
                            </Group>
                          )}
                          {pedigree.mfCatColor && (
                            <Group gap="xs">
                              <Text size="xs" fw={600}>毛色:</Text>
                              <Text size="xs">{pedigree.mfCatColor}</Text>
                            </Group>
                          )}
                          {pedigree.mfJCU && (
                            <Group gap="xs">
                              <Text size="xs" fw={600}>JCU:</Text>
                              <Text size="xs">{pedigree.mfJCU}</Text>
                            </Group>
                          )}
                        </Stack>
                      ) : (
                        <Text size="xs" c="dimmed">情報なし</Text>
                      )}
                    </Paper>
                    
                    <Paper p="sm" withBorder>
                      <Text size="sm" fw={500} mb="xs">母方祖母</Text>
                      {pedigree.mmCatName ? (
                        <Stack gap="xs">
                          <Group gap="xs">
                            <Text size="xs" fw={600}>名前:</Text>
                            <Text size="xs">{pedigree.mmCatName}</Text>
                          </Group>
                          {pedigree.mmTitle && (
                            <Group gap="xs">
                              <Text size="xs" fw={600}>タイトル:</Text>
                              <Badge size="xs" variant="light">{pedigree.mmTitle}</Badge>
                            </Group>
                          )}
                          {pedigree.mmCatColor && (
                            <Group gap="xs">
                              <Text size="xs" fw={600}>毛色:</Text>
                              <Text size="xs">{pedigree.mmCatColor}</Text>
                            </Group>
                          )}
                          {pedigree.mmJCU && (
                            <Group gap="xs">
                              <Text size="xs" fw={600}>JCU:</Text>
                              <Text size="xs">{pedigree.mmJCU}</Text>
                            </Group>
                          )}
                        </Stack>
                      ) : (
                        <Text size="xs" c="dimmed">情報なし</Text>
                      )}
                    </Paper>
                  </Stack>
                </Grid.Col>
              </Grid>
            </Grid.Col>
          </Grid>
        </Card>

        {/* その他情報 */}
        <Card withBorder shadow="sm" p="lg">
          <Group mb="md">
            <IconUser size={20} />
            <Text size="lg" fw={600}>
              その他情報
            </Text>
          </Group>

          <Grid>
            <Grid.Col span={6}>
              <Stack gap="sm">
                {pedigree.breederName && (
                  <Group>
                    <Text fw={600}>ブリーダー:</Text>
                    <Text>{pedigree.breederName}</Text>
                  </Group>
                )}
                {pedigree.ownerName && (
                  <Group>
                    <Text fw={600}>オーナー:</Text>
                    <Text>{pedigree.ownerName}</Text>
                  </Group>
                )}
                {(pedigree.brotherCount !== undefined || pedigree.sisterCount !== undefined) && (
                  <Group>
                    <IconPaw size={16} />
                    <Text fw={600}>兄弟姉妹:</Text>
                    <Text>
                      {pedigree.brotherCount || 0}兄弟・{pedigree.sisterCount || 0}姉妹
                    </Text>
                  </Group>
                )}
              </Stack>
            </Grid.Col>
            <Grid.Col span={6}>
              <Stack gap="sm">
                {pedigree.otherNo && (
                  <Group>
                    <Text fw={600}>その他番号:</Text>
                    <Text>{pedigree.otherNo}</Text>
                  </Group>
                )}
              </Stack>
            </Grid.Col>
            {(pedigree.notes || pedigree.notes2) && (
              <Grid.Col span={12}>
                <Divider my="sm" />
                <Stack gap="sm">
                  {pedigree.notes && (
                    <div>
                      <Text fw={600} mb="xs">備考:</Text>
                      <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>
                        {pedigree.notes}
                      </Text>
                    </div>
                  )}
                  {pedigree.notes2 && (
                    <div>
                      <Text fw={600} mb="xs">備考2:</Text>
                      <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>
                        {pedigree.notes2}
                      </Text>
                    </div>
                  )}
                </Stack>
              </Grid.Col>
            )}
          </Grid>
        </Card>
      </Stack>
    </Container>
  );
}
