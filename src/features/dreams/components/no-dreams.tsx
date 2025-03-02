import Image from "next/image";

import AddDreamButton from "./dream-form/add-dream-button";

export function NoDreams() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center text-muted-foreground">
      <div className="container flex flex-col items-center justify-center gap-6">
        <Image src={"/images/sleeping.svg"} width={125} height={125} alt="" />
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="text-pretty">
            <p>You haven&apos;t created any dreams yet.</p>
            <p>Add one to get started!</p>
          </div>
          <AddDreamButton />
        </div>
      </div>
    </div>
  );
}
