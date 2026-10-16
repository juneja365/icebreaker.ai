export type ToolType = 
  | 'icebreaker' 
  | 'reply_coach' 
  | 'rescue' 
  | 'rewrite' 
  | 'bio_maker' 
  | 'screenshot_scan'
  | 'what_was_meant';

export type SettingType = 'college' | 'instagram' | 'dating' | 'teammate' | 'event' | 'custom';

export type VibeType = 'chill' | 'funny' | 'confident' | 'thoughtful' | 'playful';

export type ThemeMode = 'sunset' | 'cyberpunk' | 'obsidian' | 'emerald';

export interface CustomBranding {
  appName: string;
  tagline: string;
  logoEmoji: string;
}

export interface SafetyReport {
  is_safe: boolean;
  respect_score: number;
  pressure_level: 'low' | 'moderate' | 'high';
  feedback: string;
  flags: string[];
  positive_tags: string[];
}

export interface IcebreakerOption {
  id: string;
  style: string;
  text: string;
  why_it_works: string;
  respect_score: number;
  follow_up_tip: string;
}

export interface IcebreakerResponse {
  setting: string;
  situation_analysis: string;
  options: IcebreakerOption[];
  safety_assessment: SafetyReport;
  provider_used: string;
}

export interface ReplyCoachOption {
  id: string;
  label: string;
  text: string;
  subtext: string;
  momentum_rating: string;
}

export interface ReplyCoachResponse {
  intent_detected: string;
  subtext_analysis: string;
  replies: ReplyCoachOption[];
  safety_assessment: SafetyReport;
  provider_used: string;
}

export interface RescueStrategy {
  id: string;
  approach: string;
  text: string;
  rationale: string;
}

export interface RescueResponse {
  stall_diagnosis: string;
  strategies: RescueStrategy[];
  coach_tip: string;
  safety_assessment: SafetyReport;
  provider_used: string;
}

export interface RewriteResponse {
  original: string;
  rewritten: string;
  explanation: string;
  safety_assessment: SafetyReport;
  provider_used: string;
}

export interface BioOption {
  id: string;
  archetype: string;
  headline_or_prompt: string;
  content: string;
  hook_strategy: string;
}

export interface BioResponse {
  platform: string;
  options: BioOption[];
  profile_tips: string[];
  safety_assessment: SafetyReport;
  provider_used: string;
}

export interface ScreenshotAnalysisResponse {
  detected_elements: string[];
  detected_vibe: string;
  suggested_openers: IcebreakerOption[];
  delivery_tip: string;
  safety_assessment: SafetyReport;
  provider_used: string;
}

export interface DeliveryAdviceResponse {
  timing_recommendation: string;
  delivery_score: number;
  voice_note_suggestion?: string;
  dos_and_donts: string[];
  safety_assessment: SafetyReport;
}

export interface Scenario {
  id: string;
  title: string;
  badge: string;
  setting: SettingType;
  situation: string;
  vibe: VibeType;
  target_details?: string;
  received_message?: string;
  stall_reason?: string;
  recommended_tool: ToolType;
}

export interface RealityInterpretation {
  label: string;
  likelihood: string;
  explanation: string;
  signs: string[];
}

export interface GapBridgeOption {
  id: string;
  style: string;
  text: string;
  why_it_bridges: string;
}

export interface WhatWasMeantResponse {
  ambiguous_phrase: string;
  gap_risk_score: number;
  projection_diagnosis: string;
  possible_realities: RealityInterpretation[];
  gap_bridges: GapBridgeOption[];
  riddle_insight: string;
  safety_assessment: SafetyReport;
  provider_used: string;
}

export interface SavedMessage {
  id: string;
  tool: ToolType;
  text: string;
  tag: string;
  timestamp: number;
}

export interface DatabaseTelemetry {
  engine: string;
  file_path: string;
  file_size_kb: number;
  status: string;
  counts: {
    conversations: number;
    saved_favorites: number;
    riddle_decodes: number;
    telemetry_events: number;
    total_records: number;
  };
  supabase_mirror: boolean;
}

export interface DatabaseConversation {
  id: string;
  tool_type: string;
  channel: string;
  input: any;
  output: any;
  respect_score: number;
  provider_used: string;
  created_at: string;
}


