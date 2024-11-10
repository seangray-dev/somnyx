export type DreamTheme = {
  theme: string;
  frequency: number;
  description: string;
  relatedSymbols: string[];
};

export type DreamSymbol = {
  symbol: string;
  meaning: string;
  frequency: number;
  contexts: string[];
};

export type WeeklyEmotionProgression = {
  week: string;
  primaryEmotions: string[];
  trend: string;
};

export type EmotionalTrigger = {
  trigger: string;
  associatedEmotions: string[];
  frequency: number;
};

export type DominantEmotion = {
  emotion: string;
  frequency: number;
  percentage: number;
  associatedThemes: string[];
};

export type EmotionalTrends = {
  insights: string;
  weeklyProgression: WeeklyEmotionProgression[];
};

export type EmotionalInsight = {
  dominantEmotions: DominantEmotion[];
  emotionalTrends: EmotionalTrends;
  emotionalTriggers: EmotionalTrigger[];
};

export type DreamThemes = {
  primaryThemes: string[];
  themeAnalysis: DreamTheme[];
};

export type DreamPatterns = {
  recurringElements: string[];
  patternInsights: string;
};

export type Recommendations = {
  personalGrowth: string[];
  actionableSteps: string[];
};

export type TemporalPatterns = {
  timeBasedInsights: string;
  frequencyPatterns: string[];
};

export type PersonalGrowth = {
  keyInsights: string[];
  challengesIdentified: {
    challenge: string;
    relatedPatterns: string[];
    suggestedActions: string[];
  }[];
  growthOpportunities: {
    area: string;
    evidence: string[];
    recommendations: string[];
  }[];
  actionableSteps: string[];
};

export type RolePatterns = {
  primaryRoles: {
    role: string;
    frequency: number;
    description: string;
    associatedEmotions: string[];
    significantPatterns: string;
  }[];
  roleInsights: string;
};

export type SettingAnalysis = {
  commonLocations: {
    place: string;
    frequency: number;
    associatedEmotions: string[];
    symbolism: string;
  }[];
  environmentalPatterns: string;
  settingTransitions: string;
};

export type SocialDynamics = {
  recurringCharacters: {
    name: string;
    frequency: number;
    associatedEmotions: string[];
    contextsAppearing: string[];
  }[];
  relationshipPatterns: string;
  socialThemes: string[];
};

export type PatternsInsights = {
  rolePatterns: RolePatterns;
  settingAnalysis: SettingAnalysis;
  socialDynamics: SocialDynamics;
};

export type ThematicAnalysis = {
  majorThemes: {
    theme: string;
    frequency: number;
    relatedSymbols: string[];
    relatedEmotions: string[];
    interpretation: string;
  }[];
  themeProgression: string;
  recurrentPatterns: string[];
};

export type RecurringSymbol = {
  symbol: string;
  frequency: number;
  contexts: string[];
  interpretation: string;
  associatedEmotions: string[];
};

export type Symbolism = {
  recurringSymbols: RecurringSymbol[];
  symbolPatterns: string;
  uniqueSymbols: string[];
};

export type ThemesInsights = {
  symbolism: Symbolism;
  thematicAnalysis: ThematicAnalysis;
};

export type MonthlyInsight = {
  summary: string;
  monthYear: string;
  emotionalInsights: EmotionalInsight;
  personalGrowth: PersonalGrowth;
  patternsInsights: PatternsInsights;
  themesInsights: ThemesInsights;
};
