import { Title, Text, Button, Container, Group } from "@mantine/core";
import Link from "next/link";

export default function NotFound() {
  return (
    <Container>
      <Title>404 - Page Not Found</Title>
      <Text c="dimmed" size="lg" ta="center">
        Unfortunately, this is only a 404 page. You may have mistyped the
        address, or the page has been moved to another URL.
      </Text>
      <Group justify="center">
        <Button component={Link} href="/" variant="subtle" size="md">
          Take me back to home page
        </Button>
      </Group>
    </Container>
  );
}
