"use client";

import { useQuery } from "convex/react";

import { Badge } from "@/components/ui/badge";
import { api } from "@/convex/_generated/api";

export default function Page({ params }: { params: { theme: string } }) {
  const data = useQuery(api.queries.themePages.getThemePageByNamePublic, {
    name: params.theme,
  });

  if (!data) {
    return <div>Not found</div>;
  }

  const {
    name,
    summary,
    content,
    commonSymbols,
    psychologicalMeaning,
    culturalContext,
    commonScenarios,
    tips,
  } = data;

  return (
    <article className="container py-12 md:py-20">
      {/* Hero Section */}
      <header className="mx-auto max-w-[80ch] space-y-6 text-center">
        <h1 className="text-4xl font-bold capitalize tracking-tight">
          {name} Dreams
        </h1>
        <p className="text-balance text-lg text-muted-foreground">{summary}</p>
      </header>

      {/* Quick Reference Grid */}
      <section className="mx-auto mt-16 grid max-w-6xl gap-8 rounded-lg bg-muted p-8 md:grid-cols-2">
        <div className="space-y-3">
          <h2 className="text-xl font-semibold">Common Symbols</h2>
          <ul className="flex flex-wrap gap-2">
            {commonSymbols.map((symbol) => (
              <li key={symbol}>
                <Badge>{symbol}</Badge>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-3">
          <h2 className="text-xl font-semibold">Common Scenarios</h2>
          <ul className="flex flex-wrap gap-2">
            {commonScenarios.map((scenario) => (
              <li key={scenario}>
                <Badge>{scenario}</Badge>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Main Content */}
      <div className="mx-auto mt-16 grid max-w-6xl gap-16">
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

        {/* Detailed Analysis */}
        <section className="max-w-[80ch] space-y-4 md:mx-auto">
          <h2 className="text-2xl font-semibold">Detailed Analysis</h2>
          <div className="prose max-w-none text-pretty leading-relaxed dark:prose-invert">
            {content}
          </div>
        </section>

        {/* Tips Section */}
        <section className="mx-auto max-w-[80ch] space-y-4">
          <h2 className="text-2xl font-semibold">Tips & Recommendations</h2>
          <div className="rounded-lg bg-muted p-6">
            <p className="text-pretty leading-relaxed">{tips}</p>
          </div>
        </section>
      </div>
    </article>
  );
}
