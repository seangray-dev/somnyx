"use client";

import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { baseUrl } from "@/config/app";
import { Doc } from "@/convex/_generated/dataModel";
import ShareButton from "@/features/share/components/share-button";
import { useGetThemePageImageUrl } from "@/hooks/use-convex-image";

interface ThemeContentProps {
  themePage: Doc<"themePages">;
}

export default function ThemeContent({ themePage }: ThemeContentProps) {
  const imageUrl = useGetThemePageImageUrl(themePage.storageId);

  const {
    name,
    summary,
    content,
    commonSymbols,
    psychologicalMeaning,
    culturalContext,
    commonScenarios,
    tips,
  } = themePage;

  const {
    description,
    types_variations,
    dailyLifeSignificance,
    emotional_experience_relationship,
    research_studies,
    expert_perspectives,
  } = content;

  return (
    <div>
      <article className="container py-12 md:py-20">
        {/* Hero Section */}
        <header className="grid items-center gap-8 md:grid-cols-2">
          <div className="space-y-6 text-center md:text-left">
            <div className="flex items-center justify-center gap-4 md:justify-start">
              <h1 className="text-center text-4xl font-bold capitalize tracking-tight md:text-left">
                {name} Dreams
              </h1>
            </div>
            <p className="text-balance text-lg text-muted-foreground">
              {summary}
            </p>
            <div className="flex justify-center md:justify-start">
              <ShareButton
                url={`${baseUrl}/dream-dictionary/${themePage.seo_slug}`}
              />
            </div>
          </div>
          {imageUrl ? (
            <div>
              <Image
                src={imageUrl || ""}
                alt={`Artistic interpretation of ${name} dreams`}
                width={512}
                height={512}
                className="mx-auto size-[512px] rounded-lg object-cover md:mx-0 md:place-self-end"
                priority
              />
            </div>
          ) : (
            <div className="mx-auto size-[512px] animate-pulse rounded-lg bg-muted md:mx-0 md:place-self-end"></div>
          )}
        </header>

        {/* Quick Reference Grid */}
        <section className="mx-auto mt-16 grid gap-8 rounded-lg bg-muted p-8 md:grid-cols-2">
          <div className="space-y-3">
            <h2 className="text-xl font-semibold">Common Symbols</h2>
            <ul className="flex flex-wrap gap-2">
              {commonSymbols.map((symbol: string) => (
                <li key={symbol}>
                  <Badge>{symbol}</Badge>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-3">
            <h2 className="text-xl font-semibold">Common Scenarios</h2>
            <ul className="flex flex-wrap gap-2">
              {commonScenarios.map((scenario: string) => (
                <li key={scenario}>
                  <Badge>{scenario}</Badge>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Main Content */}
        <div className="mx-auto mt-16 grid gap-16">
          {/* Interpretation Section */}
          <section className="grid gap-8 md:grid-cols-2">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Psychological Meaning</h2>
              <p className="text-pretty leading-relaxed">
                {psychologicalMeaning}
              </p>
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Cultural Context</h2>
              <p className="text-pretty leading-relaxed">{culturalContext}</p>
            </div>
          </section>

          {/* Article Content */}
          <section className="grid gap-8 md:grid-cols-2">
            {/* Understanding Section */}
            <div>
              <h3 className="text-2xl font-semibold">
                Understanding {name} Dreams
              </h3>
              <div className="mt-6 space-y-6">
                <p className="text-pretty leading-relaxed">{description}</p>
                <p className="text-pretty leading-relaxed">
                  {types_variations}
                </p>
                <p className="text-pretty leading-relaxed">
                  {dailyLifeSignificance}
                </p>
              </div>
            </div>

            {/* Impact & Research Section */}
            <div>
              <h3 className="text-2xl font-semibold">Impact & Research</h3>
              <div className="mt-6 space-y-6">
                <p className="text-pretty leading-relaxed">
                  {emotional_experience_relationship}
                </p>
                <p className="text-pretty leading-relaxed">
                  {research_studies}
                </p>
                <p className="text-pretty leading-relaxed">
                  {expert_perspectives}
                </p>
              </div>
            </div>
          </section>

          {/* Tips Section */}
          <section className="mx-auto max-w-3xl">
            <Card className="bg-secondary text-secondary-foreground">
              <CardHeader>
                <CardTitle>Tips & Recommendations</CardTitle>
                <CardDescription>
                  Practical guidance for understanding and working with these
                  dreams
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-pretty">{tips}</p>
              </CardContent>
            </Card>
          </section>
        </div>
      </article>
    </div>
  );
}
