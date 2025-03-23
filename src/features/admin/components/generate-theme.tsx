"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useAction, useQuery } from "convex/react";
import { Loader2Icon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/convex/_generated/api";

const formSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .transform((str) => {
      return str
        .split(" ")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" ");
    }),
  type: z.enum(["theme", "symbol"], {
    required_error: "Type is required",
  }),
  category: z.string().min(1, "Category is required"),
});

type FormValues = z.infer<typeof formSchema>;

export default function AdminGenerateTheme() {
  const [isGenerating, setIsGenerating] = useState(false);
  const categories = useQuery(
    // @ts-ignore
    api.queries.themeCategories.getAllThemeCategories
  );
  const generatePage = useAction(
    // @ts-ignore
    api.mutations.openai.generateThemeOrSymbolPageWithElement
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "theme",
      category: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setIsGenerating(true);

      // Find the category ID from the name
      const categoryId = categories?.find(
        (category) => category.name === values.category
      )?._id;
      if (!categoryId) {
        toast.error("Invalid category selected");
        return;
      }

      const result = await generatePage({
        ...values,
        category: categoryId,
      });

      if (result.success) {
        toast.success("Theme page generated successfully!");
        form.reset();
      } else {
        toast.error(result.reason || "Failed to generate theme page");
      }
    } catch (error) {
      console.error("Generate theme error:", error);
      toast.error("Failed to generate theme page");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate Dream Dictionary Page</CardTitle>
        <CardDescription>
          Create a new theme or symbol page with AI-generated content
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Flying, Water, Snake"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col gap-4 pb-4 md:grid md:grid-cols-2">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="theme">Theme</SelectItem>
                        <SelectItem value="symbol">Symbol</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories?.map((category) => (
                          <SelectItem key={category._id} value={category.name}>
                            {category.displayName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Page"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
