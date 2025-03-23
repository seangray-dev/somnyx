import { internalMutation } from "../_generated/server";

export const updateThemePageCategories = internalMutation({
  args: {},
  async handler(ctx) {
    console.log("Starting theme page category update...");

    // 1. Get all theme pages
    const themePages = await ctx.db.query("themePages").collect();
    console.log(`Found ${themePages.length} theme pages to process`);

    // 2. Get all common elements for mapping
    const commonElements = await ctx.db.query("commonElements").collect();
    const elementMap = new Map(
      commonElements.map((element) => [element.name.toLowerCase(), element])
    );

    let updated = 0;
    let skipped = 0;
    let errors = 0;

    // 3. Update each theme page
    for (const page of themePages) {
      try {
        // Find matching element
        const element = elementMap.get(page.name.toLowerCase());

        if (!element) {
          console.log(`No matching element found for page: ${page.name}`);
          skipped++;
          continue;
        }

        // Update the page with category and type
        await ctx.db.patch(page._id, {
          category: element.category,
          type: element.type,
        });

        updated++;
      } catch (error) {
        console.error(`Error updating page ${page.name}:`, error);
        errors++;
      }
    }

    console.log(`
      Migration complete:
      - Updated: ${updated}
      - Skipped: ${skipped}
      - Errors: ${errors}
    `);
  },
});
