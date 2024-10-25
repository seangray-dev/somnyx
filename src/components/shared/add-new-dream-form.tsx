"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { format } from "date-fns";
import { CalendarIcon, SparklesIcon, XIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { CREDIT_COSTS } from "@/convex/util";
import useUserCredits from "@/features/credits/api/use-user-credits";
import { useGetAllEmotions } from "@/features/store/emotions";
import { useGetAllRoles } from "@/features/store/roles";
import { cn } from "@/lib/utils";

import LoadingButton from "../shared/loading-button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import Loader from "./loader";

const FormSchema = z.object({
  date: z.date({ required_error: "Please select a date" }),
  emotions: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one emotion.",
  }),
  role: z.string(),

  people: z.array(z.string()).optional(),
  places: z.array(z.string()).optional(),
  things: z.array(z.string()).optional(),
  details: z
    .string({ required_error: "Details cannot be empty" })
    .min(50, {
      message: "Details must be at least 50 characters long.",
    })
    .max(1000, {
      message: "Details must not exceed 1000 characters.",
    }),
  withAnalysis: z.boolean(),
});

type AddNewDreamFormProps = {
  className?: string;
  closeDialog: () => void;
};

export function AddNewDreamForm(props: AddNewDreamFormProps) {
  const { className, closeDialog } = props;
  const { emotions, isLoading: emotionsLoading } = useGetAllEmotions();
  const { data: userCredits } = useUserCredits();
  const { roles, isLoading: rolesLoading } = useGetAllRoles();
  const [loading, setLoading] = useState(false);
  const [peopleInputValue, setPeopleInputValue] = useState("");
  const [placesInputValue, setPlacesInputValue] = useState("");
  const [thingsInputValue, setThingsInputValue] = useState("");
  const addNewDream = useMutation(api.mutations.dreams.addNewDream);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      date: new Date(),
      emotions: [],
      people: [],
      places: [],
      things: [],
      withAnalysis: false,
    },
  });

  const canAddDreamWithAnalysis = userCredits! >= CREDIT_COSTS.ANALYSIS;

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const {
        date,
        emotions,
        role,
        people,
        places,
        things,
        details,
        withAnalysis,
      } = data;

      const result = await addNewDream({
        date: date.toISOString(),
        emotions: emotions as Id<"emotions">[],
        role: role as Id<"roles">,
        people: people,
        places: places,
        things: things,
        details: details,
        withAnalysis,
      });

      toast.success("Dream added successfully!");
      closeDialog();
      form.reset();
    } catch (error) {
      toast.error("Oops, something went wrong!", {
        description: "Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(className, "space-y-6 pt-2")}
      >
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>My dream was on</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date > new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="emotions"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel>Emotions</FormLabel>
                <FormDescription>
                  Select the emotions you had while dreaming.
                </FormDescription>
              </div>
              {emotionsLoading ? (
                <div className="flex flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Loader />
                  <div>Loading emotions...</div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {emotions?.map((emotion) => (
                    <FormField
                      key={emotion._id}
                      control={form.control}
                      name="emotions"
                      render={({ field }) => {
                        return (
                          <FormItem key={emotion._id}>
                            <FormLabel>
                              <Badge
                                variant={"outline"}
                                className={`flex items-center gap-2 ${
                                  field.value?.includes(emotion._id)
                                    ? "bg-primary text-primary-foreground"
                                    : ""
                                }`}
                              >
                                <div className="flex items-center gap-1">
                                  <div>{emotion.emoji}</div>
                                  <div>{emotion.name}</div>
                                </div>
                                <FormControl>
                                  <Checkbox
                                    className="sr-only border-none"
                                    checked={field.value?.includes(emotion._id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([
                                            ...field.value,
                                            emotion._id,
                                          ])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== emotion._id
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                              </Badge>
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <div className="mb-4">
                <FormLabel>Role</FormLabel>
                <FormDescription>
                  What role did you play in the dream?
                </FormDescription>
              </div>
              {rolesLoading ? (
                <div className="flex flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Loader />
                  <div>Loading roles...</div>
                </div>
              ) : (
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="space-y-2"
                  >
                    {roles?.map((role) => (
                      <FormItem
                        key={role._id}
                        className="flex items-center space-x-3 space-y-0"
                      >
                        <FormControl>
                          <RadioGroupItem value={role._id} />
                        </FormControl>
                        <FormLabel className="flex flex-col gap-1 font-normal">
                          <span>{role.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {role.description}
                          </span>
                        </FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="people"
          render={({ field }) => {
            return (
              <FormItem>
                <div className="mb-4">
                  <FormLabel>People</FormLabel>
                  <FormDescription>
                    List the people involved in your dream, separated by commas.
                  </FormDescription>
                </div>
                <FormControl>
                  <Input
                    placeholder="Mom, Dad, Friend, etc."
                    value={peopleInputValue}
                    onChange={(e) => {
                      const value = e.target.value;
                      setPeopleInputValue(value);
                      if (value.endsWith(",")) {
                        const newPerson = value.slice(0, -1).trim();
                        if (newPerson) {
                          field.onChange([...field.value!, newPerson]);
                        }
                        setPeopleInputValue("");
                      }
                    }}
                    onBlur={() => {
                      if (
                        peopleInputValue.trim() &&
                        !peopleInputValue.endsWith(",")
                      ) {
                        field.onChange([
                          ...field.value!,
                          peopleInputValue.trim(),
                        ]);
                        setPeopleInputValue("");
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
                <div className="mt-3 flex flex-wrap gap-2">
                  {field.value?.map((person, index) => (
                    <Badge key={index} className="flex items-center text-xs">
                      <span className="cursor-default">{person}</span>
                      <Button
                        size={"icon"}
                        type="button"
                        className="ml-2 h-fit w-fit rounded-full p-1 hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => {
                          field.onChange(
                            field.value?.filter((p) => p !== person)
                          );
                        }}
                      >
                        <XIcon size={12} />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </FormItem>
            );
          }}
        />

        <FormField
          control={form.control}
          name="places"
          render={({ field }) => {
            return (
              <FormItem>
                <div className="mb-4">
                  <FormLabel>Places</FormLabel>
                  <FormDescription>
                    List the places involved in your dream, separated by commas.
                  </FormDescription>
                </div>
                <FormControl>
                  <Input
                    placeholder="Home, School, Work, etc."
                    value={placesInputValue}
                    onChange={(e) => {
                      const value = e.target.value;
                      setPlacesInputValue(value);
                      if (value.endsWith(",")) {
                        const newPlace = value.slice(0, -1).trim();
                        if (newPlace) {
                          field.onChange([...field.value!, newPlace]);
                        }
                        setPlacesInputValue("");
                      }
                    }}
                    onBlur={() => {
                      if (
                        placesInputValue.trim() &&
                        !placesInputValue.endsWith(",")
                      ) {
                        field.onChange([
                          ...field.value!,
                          placesInputValue.trim(),
                        ]);
                        setPlacesInputValue("");
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
                <div className="mt-3 flex flex-wrap gap-2">
                  {field.value?.map((place, index) => (
                    <Badge key={index} className="flex items-center text-xs">
                      <span className="cursor-default">{place}</span>
                      <Button
                        size={"icon"}
                        type="button"
                        className="ml-2 h-fit w-fit rounded-full p-1 hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => {
                          field.onChange(
                            field.value?.filter((p) => p !== place)
                          );
                        }}
                      >
                        <XIcon size={12} />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </FormItem>
            );
          }}
        />

        <FormField
          control={form.control}
          name="things"
          render={({ field }) => {
            return (
              <FormItem>
                <div className="mb-4">
                  <FormLabel>Things</FormLabel>
                  <FormDescription>
                    List any particular things that were involved in your dream,
                    separated by commas.
                  </FormDescription>
                </div>
                <FormControl>
                  <Input
                    placeholder="Book, Movie, Music, etc."
                    value={thingsInputValue}
                    onChange={(e) => {
                      const value = e.target.value;
                      setThingsInputValue(value);
                      if (value.endsWith(",")) {
                        const newThing = value.slice(0, -1).trim();
                        if (newThing) {
                          field.onChange([...field.value!, newThing]);
                        }
                        setThingsInputValue("");
                      }
                    }}
                    onBlur={() => {
                      if (
                        thingsInputValue.trim() &&
                        !thingsInputValue.endsWith(",")
                      ) {
                        field.onChange([
                          ...field.value!,
                          thingsInputValue.trim(),
                        ]);
                        setThingsInputValue("");
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
                <div className="mt-3 flex flex-wrap gap-2">
                  {field.value?.map((thing, index) => (
                    <Badge key={index} className="flex items-center text-xs">
                      <span className="cursor-default">{thing}</span>
                      <Button
                        size={"icon"}
                        type="button"
                        className="ml-2 h-fit w-fit rounded-full p-1 hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => {
                          field.onChange(
                            field.value?.filter((t) => t !== thing)
                          );
                        }}
                      >
                        <XIcon size={12} />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </FormItem>
            );
          }}
        />

        <FormField
          control={form.control}
          name="details"
          render={({ field }) => (
            <FormItem>
              <div className="mb-4">
                <FormLabel>Details</FormLabel>
                <FormDescription>
                  Tell us more about your dream.
                </FormDescription>
              </div>
              <FormControl>
                <Textarea
                  placeholder="In my dream, I...."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col gap-2">
          <LoadingButton
            variant={"secondary"}
            isLoading={loading}
            className="w-full"
            onClick={() => {
              form.setValue("withAnalysis", false);
            }}
          >
            Log Dream (No Analysis)
          </LoadingButton>
          <LoadingButton
            disabled={!canAddDreamWithAnalysis}
            isLoading={loading}
            className="w-full"
            onClick={() => {
              form.setValue("withAnalysis", true);
            }}
          >
            <SparklesIcon size={16} className="mr-2" />
            Analyze Dream ({CREDIT_COSTS.ANALYSIS} Credits)
          </LoadingButton>
        </div>
      </form>
    </Form>
  );
}
