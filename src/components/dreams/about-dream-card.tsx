import Link from "next/link";

import { Preloaded, usePreloadedQuery } from "convex/react";
import { useAtomValue } from "jotai";
import { ExternalLinkIcon, HelpCircleIcon } from "lucide-react";
import { toast } from "sonner";

import { themePageMapAtom } from "@/atoms/theme-pages";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { baseUrl } from "@/config/app";
import { api } from "@/convex/_generated/api";
import ShareButton from "@/features/share/components/share-button";
import { useMediaQuery } from "@/hooks/use-media-query";
import { timeAgo } from "@/utils/date-time";

import DreamCardActions from "../shared/dream-card-actions";
import EmotionsBadge from "../shared/emotions-badge";
import Loader from "../shared/loader";
import { Badge } from "../ui/badge";
import ThemeSymbolTooltip from "./theme-symbol-tooltip";

type AboutDreamCardProps = {
  dream: Preloaded<typeof api.queries.dreams.getDreamById>;
  emotions: Preloaded<typeof api.queries.emotions.getEmotionsByDreamId>;
  role: Preloaded<typeof api.queries.roles.getRoleById>;
};

const ThemeBadge = ({ name }: { name: string }) => {
  const themePageMap = useAtomValue(themePageMapAtom);
  const slug = themePageMap[name.toLowerCase()];

  if (slug) {
    return (
      <Link href={`/dream-dictionary/${slug}`}>
        <Badge
          variant="outline"
          className="px-3 py-2 hover:bg-secondary hover:underline"
        >
          {name} <ExternalLinkIcon className="ml-2 size-3" />
        </Badge>
      </Link>
    );
  }

  return (
    <Badge variant="outline" className="px-3 py-2 hover:cursor-default">
      {name}
    </Badge>
  );
};

export default function AboutDreamCard(props: AboutDreamCardProps) {
  const dream = usePreloadedQuery(props.dream);
  const emotions = usePreloadedQuery(props.emotions);
  const role = usePreloadedQuery(props.role);
  const themes = dream?.themes;
  const isMobile = useMediaQuery("(max-width: 768px)");

  if (!dream) {
    return null;
  }

  const {
    _id,
    isPublic,
    title,
    details,
    date,
    people,
    places,
    things,
    symbols,
    isRecurring,
    isLucid,
  } = dream;

  const shareUrl = `${baseUrl}/dreams/${_id}`;

  return (
    <Card>
      <CardHeader className="flex flex-col">
        <div className="flex flex-row items-baseline justify-between gap-4">
          <CardTitle className="w-fit text-balance text-2xl md:text-3xl">
            {title ? (
              // replace double quotes with empty string
              title.replace(/"/g, "")
            ) : (
              <div className="flex items-center gap-2 text-muted-foreground">
                <span>Untitled</span>
                <Loader />
              </div>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            <ShareButton
              url={shareUrl}
              title={title || "Check out my dream"}
              disabled={!isPublic}
              shrink={isMobile}
              onDisabledClick={() => {
                toast.error("This dream is not public", {
                  description: "Please make it public to share it with others",
                });
              }}
            />
            <DreamCardActions {...{ _id, isPublic }} />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {(isRecurring || isLucid) && (
            <div className="flex flex-wrap gap-2 pt-2">
              {isRecurring && (
                <Badge className="select-none">Recurring Dream</Badge>
              )}
              {isLucid && <Badge className="select-none">Lucid Dream</Badge>}
            </div>
          )}
          <CardDescription className="-mt-2 max-w-[80ch] text-base">
            <div className="pb-2 text-sm">
              {!title && "Your title is being generated"}
            </div>
            {details}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex flex-grow flex-col gap-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-bold">Emotions</h3>
            <div className="flex flex-wrap gap-2">
              {emotions.map((emotion) => (
                <EmotionsBadge key={emotion} emotionId={emotion} />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-baseline gap-2">
              <h3 className="text-lg font-bold">Themes & Symbols</h3>
              <ThemeSymbolTooltip
                content={
                  <>
                    <p className="text-sm">
                      Themes and symbols identified by AI analysis of your
                      dream.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Look for the{" "}
                      <ExternalLinkIcon className="inline size-3" /> icon to
                      read an article about the theme or symbol.
                    </p>
                  </>
                }
              >
                <HelpCircleIcon className="size-5 text-muted-foreground transition-all duration-150 hover:text-foreground" />
              </ThemeSymbolTooltip>
            </div>
            <div className="flex flex-wrap gap-2">
              {themes &&
                themes.map((theme) => <ThemeBadge key={theme} name={theme} />)}
              {symbols &&
                symbols.map((symbol) => (
                  <ThemeBadge key={symbol} name={symbol} />
                ))}
              {themes?.length === 0 && symbols?.length === 0 && (
                <div className="text-sm text-muted-foreground">N/A</div>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-bold">People, Places & Things</h3>
            <div className="flex flex-wrap gap-2">
              {(() => {
                const combinedItems = [
                  ...(people?.map((item) => ({
                    label: item,
                    type: "person",
                  })) ?? []),
                  ...(places?.map((item) => ({ label: item, type: "place" })) ??
                    []),
                  ...(things?.map((item) => ({ label: item, type: "thing" })) ??
                    []),
                ];

                return combinedItems.length > 0 ? (
                  combinedItems.map(({ label }, index) => (
                    <Badge
                      variant="outline"
                      className="px-3 py-2 hover:cursor-default"
                    >
                      {label}
                    </Badge>
                  ))
                ) : (
                  <div className="text-sm text-muted-foreground">N/A</div>
                );
              })()}
            </div>
          </div>
          <div>
            <h2 className="pb-2 text-lg font-bold">Role</h2>
            <div className="text-sm text-muted-foreground">
              <Badge
                variant="outline"
                className="px-3 py-2 hover:cursor-default"
              >
                {role?.name}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground">{timeAgo(date)}</div>
      </CardFooter>
    </Card>
  );
}
