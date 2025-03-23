import { UseFormReturn } from "react-hook-form";

import Loader from "@/components/shared/loader";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useGetAllRoles } from "@/features/store/roles";

import { DreamFormData } from "../../types";

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
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="space-y-2"
                disabled={editMode}
              >
                {roles?.map((role) => (
                  <FormItem
                    key={role._id}
                    className="flex items-center space-x-3 space-y-0"
                  >
                    <FormControl>
                      <RadioGroupItem value={role._id} disabled={editMode} />
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
        </FormItem>
      )}
    />
  );
}
