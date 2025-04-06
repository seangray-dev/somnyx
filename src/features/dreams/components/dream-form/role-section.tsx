import {
  ArrowRightLeftIcon,
  InfoIcon,
  User,
  UserCircle2,
  UserX,
} from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import Loader from "@/components/shared/loader";
import AccessibleTooltip from "@/components/ui/accessible-tooltip";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useGetAllRoles } from "@/features/store/roles";

import { DreamFormData } from "../../types";

const roleIconMap: Record<string, any> = {
  "I Was Myself in the Dream": User,
  "Part of Me Was Present in the Dream": UserCircle2,
  "I Wasn’t in the Dream": UserX,
  "I Was Someone Else in the Dream": ArrowRightLeftIcon,
};

interface RoleSectionProps {
  form: UseFormReturn<DreamFormData>;
  editMode?: boolean;
}

export function RoleSection({ form, editMode }: RoleSectionProps) {
  const { roles, isLoading: rolesLoading } = useGetAllRoles();

  return (
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
                className="grid-cols-2"
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={editMode}
              >
                {roles?.map((role) => {
                  const Icon = roleIconMap[role.name] || User;
                  return (
                    <div
                      key={role._id}
                      className="relative flex flex-col gap-4 rounded-lg border border-input p-4 shadow-sm shadow-black/5 has-[[data-state=checked]]:border-ring"
                    >
                      <div className="flex justify-between gap-2">
                        <RadioGroupItem
                          value={role._id}
                          className="order-1 after:absolute after:inset-0 after:z-10"
                        />
                        <Icon
                          className="opacity-60"
                          size={16}
                          strokeWidth={2}
                          aria-hidden="true"
                        />
                      </div>
                      <div className="relative z-20 flex items-center gap-2">
                        <Label htmlFor={role._id}>{role.name}</Label>
                        <AccessibleTooltip content={role.description}>
                          <InfoIcon className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                        </AccessibleTooltip>
                      </div>
                    </div>
                  );
                })}
              </RadioGroup>
            </FormControl>
          )}
        </FormItem>
      )}
    />
  );
}
