export * from "./card";

export interface EventOption {
  type: import("./card").EventType;
  title: string;
  hindiTitle?: string;
  subtitle: string;
  description: string;
  tagline: string;
  badge: string;
  features: string[];
}
