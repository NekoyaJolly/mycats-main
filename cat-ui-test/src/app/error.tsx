"use client";

import { useEffect } from "react";
import { Button, Title, Text, Container, Group } from "@mantine/core";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <Container>
      <Title>Something went wrong!</Title>
      <Text>{error.message}</Text>
      <Group justify="center">
        <Button
          onClick={
            // Attempt to recover by trying to re-render the segment
            () => reset()
          }
        >
          Try again
        </Button>
      </Group>
    </Container>
  );
}
