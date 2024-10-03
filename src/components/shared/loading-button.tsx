import { Loader2Icon } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button, ButtonProps } from "../ui/button";

export default function LoadingButton({
  isLoading,
  children,
  className,
  ...props
}: ButtonProps & { isLoading: boolean }) {
  return (
    <Button disabled={isLoading} {...props} className={cn(className)}>
      {isLoading ? <Loader2Icon className="animate-spin" /> : children}
    </Button>
  );
}
