import { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

interface VideoProps extends HTMLAttributes<HTMLVideoElement> {
  src: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  controls?: boolean;
}

export function Video({
  src,
  className,
  autoPlay = true,
  loop = true,
  muted = true,
  playsInline = true,
  controls = false,
  ...props
}: VideoProps) {
  return (
    <video
      className={cn("h-auto w-full", className)}
      autoPlay={autoPlay}
      loop={loop}
      muted={muted}
      playsInline={playsInline}
      controls={controls}
      {...props}
    >
      <source src={src} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
}
