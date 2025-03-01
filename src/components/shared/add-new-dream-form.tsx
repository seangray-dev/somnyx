"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { format, isBefore } from "date-fns";
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
  date: z
    .date({ required_error: "Please select a date" })
    .refine((date) => !isBefore(date, new Date(2024, 7, 1)), {
      message: "Dreams can only be logged from August 2024 onwards.",
    }),
  isRecurring: z.boolean().default(false),
  isLucid: z.boolean().default(false),
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
    .max(2000, {
      message: "Details must not exceed 2000 characters.",
    }),
  withAnalysis: z.boolean(),
});

type AddNewDreamFormProps = {
  className?: string;
  closeDialog: () => void;
  minDate: Date;
};

export function AddNewDreamForm(props: AddNewDreamFormProps) {
  const { className, closeDialog, minDate } = props;
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
      isRecurring: false,
      isLucid: false,
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
        isRecurring,
        isLucid,
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
        isRecurring,
        isLucid,
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
          name="details"
          render={({ field }) => (
            <FormItem>
              <div className="mb-4">
                <FormLabel>What happened in your dream?</FormLabel>
                <FormDescription className="text-pretty">
                  Share your dream story - every detail matters, no matter how
                  small or strange it might seem.
                </FormDescription>
              </div>
              <FormControl>
                <Textarea
                  placeholder="Start with 'In my dream...' and let the story flow naturally. What did you see, feel, or experience?"
                  className="resize-none"
                  rows={8}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>When did you have this dream?</FormLabel>
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
                        <span>Select date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent
                  className="pointer-events-auto relative w-auto p-0"
                  align="start"
                  sideOffset={5}
                >
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(date) => {
                      if (date && isBefore(date, minDate)) {
                        toast.error("Invalid date", {
                          description:
                            "Dreams can only be logged from August 2024 onwards.",
                        });
                        return;
                      }
                      field.onChange(date);
                    }}
                    disabled={(date) =>
                      date > new Date() || isBefore(date, minDate)
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="isRecurring"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Recurring Dream</FormLabel>
                  <FormDescription className="text-pretty">
                    I&apos;ve had this dream (or very similar) before
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isLucid"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Lucid Dream</FormLabel>
                  <FormDescription className="text-pretty">
                    I was aware I was dreaming during the experience
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="emotions"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel>How did the dream make you feel?</FormLabel>
                <FormDescription className="text-pretty">
                  Select all emotions you experienced - this helps create more
                  accurate interpretations.
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
                                className={`flex items-center px-3 py-2 ${
                                  field.value?.includes(emotion._id)
                                    ? "bg-primary text-primary-foreground"
                                    : ""
                                }`}
                              >
                                <div className="flex items-center gap-2">
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
                <FormLabel>What was your perspective?</FormLabel>
                <FormDescription className="text-pretty">
                  Understanding your role helps reveal how you see yourself in
                  different situations.
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
                          <span className="text-pretty text-sm text-muted-foreground">
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

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="people"
            render={({ field }) => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel>Who appeared in your dream?</FormLabel>
                  <FormDescription className="text-pretty">
                    List the people you remember - they often represent
                    important relationships or aspects of yourself.
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
            )}
          />

          <FormField
            control={form.control}
            name="places"
            render={({ field }) => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel>Where did your dream take place?</FormLabel>
                  <FormDescription className="text-pretty">
                    Locations in dreams can symbolize different areas of your
                    life or states of mind.
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
            )}
          />

          <FormField
            control={form.control}
            name="things"
            render={({ field }) => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel>
                    What significant objects or symbols stood out?
                  </FormLabel>
                  <FormDescription className="text-pretty">
                    Objects in dreams often carry deeper meaning and can be keys
                    to understanding your subconscious.
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
            )}
          />
        </div>

        <div className="flex flex-col gap-2 pt-4">
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
          <p className="text-center text-xs text-muted-foreground">
            AI-powered analysis helps you understand the deeper meaning of your
            dreams
          </p>
          {!canAddDreamWithAnalysis && (
            <p className="text-center text-sm text-muted-foreground">
              Save your dream now and unlock AI analysis later when you have
              enough credits
            </p>
          )}
          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                or
              </span>
            </div>
          </div>
          <LoadingButton
            variant={"secondary"}
            isLoading={loading}
            className="w-full"
            onClick={() => {
              form.setValue("withAnalysis", false);
            }}
          >
            Save Dream
          </LoadingButton>
          <p className="text-center text-xs text-muted-foreground">
            Your dream will be safely stored and ready for analysis whenever you
            choose
          </p>
        </div>
      </form>
    </Form>
  );
}
