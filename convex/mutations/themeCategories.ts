import { internalMutation } from "../_generated/server";

type CategoryName =
  | "relationships_social"
  | "emotional_states"
  | "physical_elements"
  | "animals_creatures"
  | "objects_symbols"
  | "settings_places"
  | "actions_events"
  | "personal_growth"
  | "body_health"
  | "nature_environment"
  | "travel_journey"
  | "time_memory"
  | "power_control"
  | "spiritual_mystical";

interface ThemeCategory {
  name: CategoryName;
  displayName: string;
  description: string;
  examples: string[];
}

export const initializeThemeCategories = internalMutation({
  args: {},
  async handler(ctx) {
    const categories: ThemeCategory[] = [
      {
        name: "relationships_social",
        displayName: "Relationships & Social",
        description:
          "Dreams involving social connections, interactions, family dynamics, and romantic relationships",
        examples: [
          "family gatherings",
          "romantic encounters",
          "friendship conflicts",
        ],
      },
      {
        name: "emotional_states",
        displayName: "Emotional States",
        description:
          "Dreams centered on feelings, moods, and psychological experiences",
        examples: ["anxiety", "joy", "fear", "loneliness"],
      },
      {
        name: "physical_elements",
        displayName: "Physical Elements",
        description: "Dreams featuring basic elements and material objects",
        examples: ["water", "fire", "earth", "metal objects"],
      },
      {
        name: "animals_creatures",
        displayName: "Animals & Creatures",
        description:
          "Dreams with animals, mythical creatures, or other non-human beings",
        examples: ["dogs", "dragons", "birds", "mysterious creatures"],
      },
      {
        name: "objects_symbols",
        displayName: "Objects & Symbols",
        description:
          "Dreams containing significant items and their symbolic meanings",
        examples: ["keys", "mirrors", "books", "clocks"],
      },
      {
        name: "settings_places",
        displayName: "Settings & Places",
        description: "Dreams occurring in specific locations and environments",
        examples: ["childhood home", "unknown city", "forest", "ocean"],
      },
      {
        name: "actions_events",
        displayName: "Actions & Events",
        description:
          "Dreams about activities, occurrences, and patterns of events",
        examples: ["falling", "flying", "running", "searching"],
      },
      {
        name: "personal_growth",
        displayName: "Personal Growth",
        description:
          "Dreams related to development, learning, and transformation",
        examples: ["achievement", "learning", "overcoming obstacles"],
      },
      {
        name: "body_health",
        displayName: "Body & Health",
        description:
          "Dreams involving physical sensations and health-related themes",
        examples: ["illness", "healing", "physical changes"],
      },
      {
        name: "nature_environment",
        displayName: "Nature & Environment",
        description: "Dreams featuring the natural world, weather, and seasons",
        examples: ["storms", "mountains", "seasons changing"],
      },
      {
        name: "travel_journey",
        displayName: "Travel & Journey",
        description: "Dreams about movement, paths, and destinations",
        examples: ["road trips", "exploring", "being lost"],
      },
      {
        name: "time_memory",
        displayName: "Time & Memory",
        description: "Dreams involving past, future, memories, and cycles",
        examples: ["childhood memories", "future scenarios", "time loops"],
      },
      {
        name: "power_control",
        displayName: "Power & Control",
        description: "Dreams about authority, influence, and freedom",
        examples: ["leadership", "powerlessness", "control struggles"],
      },
      {
        name: "spiritual_mystical",
        displayName: "Spiritual & Mystical",
        description:
          "Dreams with transcendent experiences and belief-related themes",
        examples: ["divine encounters", "meditation", "supernatural events"],
      },
    ];

    for (const category of categories) {
      await ctx.db.insert("themeCategories", {
        ...category,
        updatedAt: Date.now(),
      });
    }
  },
});
