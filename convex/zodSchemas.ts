import { z } from "zod";

export const ThemePage = z.object({
  name: z.string(),
  seo_title: z.string(),
  seo_description: z.string(),
  content: z.string(),
  summary: z.string(),
  commonSymbols: z.array(z.string()),
  psychologicalMeaning: z.string(),
  culturalContext: z.string(),
  commonScenarios: z.array(z.string()),
  tips: z.string(),
  updatedAt: z.number(),
});
