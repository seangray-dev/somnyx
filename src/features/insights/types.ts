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

export type MonthlyInsight = {
  summary: string;
  monthYear: string;
  emotionalInsights: EmotionalInsight;
  personalGrowth: PersonalGrowth;
  dreamThemes: DreamThemes;
  symbolism: DreamSymbol[];
  dreamPatterns: DreamPatterns;
  recommendations: Recommendations;
  temporalPatterns: TemporalPatterns;
};
