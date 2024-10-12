import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "@/lib/client-auth";

export default function UserAvatar() {
  const { session } = useSession();
  const userImage = session?.user?.imageUrl;
  const fallback = session?.user?.firstName?.[0];

  return (
    <Avatar className="size-8">
      <AvatarImage src={userImage} />
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  );
}
