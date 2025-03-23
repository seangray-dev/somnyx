"use client";

import { useState } from "react";

import { BellOffIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BellIcon } from "@/components/ui/icons/bell";

import useNotifications from "../hooks/use-notifications";
import { DeviceToggle } from "./device-toggle";

export default function PushNotificationManager() {
  const { isSupported, subscription } = useNotifications();
  const [open, setOpen] = useState(false);

  if (!isSupported) {
    return null;
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          {subscription ? (
            <BellIcon />
          ) : (
            <BellOffIcon className="text-destructive" size={20} />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuGroup>
          <DeviceToggle className="p-2" />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
