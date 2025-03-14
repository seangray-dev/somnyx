import {
  FacebookIcon,
  FacebookShareButton,
  RedditIcon,
  RedditShareButton,
  TwitterShareButton,
  XIcon,
} from "react-share";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

type ShareOption = {
  name: string;
  icon: React.ComponentType<any>;
  Button: React.ComponentType<any>;
};

type ShareLinksProps = {
  url: string;
};

const SHARE_OPTIONS: ShareOption[] = [
  {
    name: "X",
    icon: XIcon,
    Button: TwitterShareButton,
  },
  {
    name: "Reddit",
    icon: RedditIcon,
    Button: RedditShareButton,
  },
  {
    name: "Facebook",
    icon: FacebookIcon,
    Button: FacebookShareButton,
  },
  // {
  //   name: "Copy Link",
  //   icon: ClipboardCopy,
  //   Button: Button,
  // },
];

export default function ShareLinks({ url }: ShareLinksProps) {
  return (
    <>
      {SHARE_OPTIONS.map((option) => (
        <DropdownMenuItem>
          <option.Button
            key={option.name}
            url={url}
            className="flex w-full items-center gap-2"
          >
            <option.icon size={16} className="rounded" />
            <span>{option.name}</span>
          </option.Button>
        </DropdownMenuItem>
      ))}
    </>
  );
}
