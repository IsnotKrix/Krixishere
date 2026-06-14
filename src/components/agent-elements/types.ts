export type ChatStatus = "ready" | "loading" | "streaming" | "error";

export interface MessagePart {
  type: "text";
  text: string;
}

export interface UIMessage {
  id: string;
  role: "user" | "assistant";
  parts: MessagePart[];
  createdAt?: Date;
}

export interface SuggestionItem {
  id: string;
  label: string;
  value: string;
}

export interface AttachedImage {
  id: string;
  filename: string;
  url: string;
  size?: number;
}

export interface AttachedFile {
  id: string;
  filename: string;
  size?: number;
}

export interface QuestionOption {
  id: string;
  label: string;
}

export interface QuestionConfig {
  kind: "single" | "multiple";
  title: string;
  options: QuestionOption[];
  allowCustom?: boolean;
}

export type QuestionAnswer =
  | { optionId: string; custom?: string }
  | { optionIds: string[]; custom?: string };

export interface CustomToolRendererProps {
  toolName: string;
  args: unknown;
  result?: unknown;
}
