import { cn } from "@/lib/utils";

import { Button, ButtonProps } from "../ui/button";
import Loader from "./loader";

export default function LoadingButton({
  isLoading,
  children,
  className,
  ...props
}: ButtonProps & { isLoading: boolean }) {
  return (
    <Button disabled={isLoading} {...props} className={cn(className)}>
      {isLoading ? <Loader /> : children}
    </Button>
  );
}
