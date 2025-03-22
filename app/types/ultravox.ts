// Keep only essential types, remove debug-related ones
export interface UltravoxExperimentalMessage {
  type: string;
  message: string;
  data?: any;
}

export type UltravoxExperimentalMessageEvent = UltravoxExperimentalMessage;
