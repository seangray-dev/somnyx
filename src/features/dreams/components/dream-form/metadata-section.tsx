import { useState } from "react";

import { XIcon } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { DreamFormData } from "../../types";

interface MetadataSectionProps {
  form: UseFormReturn<DreamFormData>;
  editMode?: boolean;
}

export function MetadataSection({ form, editMode }: MetadataSectionProps) {
  const [peopleInputValue, setPeopleInputValue] = useState("");
  const [placesInputValue, setPlacesInputValue] = useState("");
  const [thingsInputValue, setThingsInputValue] = useState("");

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="people"
        render={({ field }) => (
          <FormItem>
            <div className="mb-4">
              <FormLabel>Who appeared in your dream?</FormLabel>
              <FormDescription className="text-pretty">
                List the people you remember - they often represent important
                relationships or aspects of yourself.
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
                    field.onChange([...field.value!, peopleInputValue.trim()]);
                    setPeopleInputValue("");
                  }
                }}
                disabled={editMode}
                readOnly={editMode}
              />
            </FormControl>
            <FormMessage />
            <div className="mt-3 flex flex-wrap gap-2">
              {field.value?.map((person, index) => (
                <Badge key={index} className="flex items-center text-xs">
                  <span className="cursor-default">{person}</span>
                  {!editMode && (
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
                  )}
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
                Locations in dreams can symbolize different areas of your life
                or states of mind.
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
                    field.onChange([...field.value!, placesInputValue.trim()]);
                    setPlacesInputValue("");
                  }
                }}
                disabled={editMode}
                readOnly={editMode}
              />
            </FormControl>
            <FormMessage />
            <div className="mt-3 flex flex-wrap gap-2">
              {field.value?.map((place, index) => (
                <Badge key={index} className="flex items-center text-xs">
                  <span className="cursor-default">{place}</span>
                  {!editMode && (
                    <Button
                      size={"icon"}
                      type="button"
                      className="ml-2 h-fit w-fit rounded-full p-1 hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => {
                        field.onChange(field.value?.filter((p) => p !== place));
                      }}
                    >
                      <XIcon size={12} />
                    </Button>
                  )}
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
                Objects in dreams often carry deeper meaning and can be keys to
                understanding your subconscious.
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
                    field.onChange([...field.value!, thingsInputValue.trim()]);
                    setThingsInputValue("");
                  }
                }}
                disabled={editMode}
                readOnly={editMode}
              />
            </FormControl>
            <FormMessage />
            <div className="mt-3 flex flex-wrap gap-2">
              {field.value?.map((thing, index) => (
                <Badge key={index} className="flex items-center text-xs">
                  <span className="cursor-default">{thing}</span>
                  {!editMode && (
                    <Button
                      size={"icon"}
                      type="button"
                      className="ml-2 h-fit w-fit rounded-full p-1 hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => {
                        field.onChange(field.value?.filter((t) => t !== thing));
                      }}
                    >
                      <XIcon size={12} />
                    </Button>
                  )}
                </Badge>
              ))}
            </div>
          </FormItem>
        )}
      />
    </div>
  );
}
