"use client";

import { useEffect, useState } from "react";

import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";

export default function useMessagesQuery() {
  const [conversationId, setConversationId] = useState<string>("");

  useEffect(() => {
    const storedId = localStorage.getItem("dreamConversationId");
    const newId = storedId || crypto.randomUUID();
    if (!storedId) {
      localStorage.setItem("dreamConversationId", newId);
    }
    setConversationId(newId);
  }, []);

  const data =
    useQuery(api.queries.message.list, {
      conversationId: conversationId,
    }) ?? [];

  const isLoading = data === undefined;
  const noMessages = data !== undefined && !data;

  return { isLoading, noMessages, data, conversationId };
}
