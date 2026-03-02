export const ChatItemType = {
  Sent: 0,
  Received: 1,
} as const;

export type ChatItemType = (typeof ChatItemType)[keyof typeof ChatItemType];
