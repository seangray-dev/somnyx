import DeleteAccountDialog from "./delete-account-dialog";
import DeleteDreamsDialog from "./delete-dreams-dialog";

export default function DeleteActions() {
  return (
    <section className="space-y-4">
      <div className="font-semibold">Danger Zone:</div>
      <div className="w-full rounded border border-destructive bg-destructive/10 text-destructive dark:text-destructive-foreground">
        <div className="flex items-center justify-between border-b border-destructive/50 p-4">
          <div className="font-medium">Delete dreams</div>
          <DeleteDreamsDialog />
        </div>
        <div className="flex items-center justify-between p-4">
          <div className="font-medium">Delete account</div>
          <DeleteAccountDialog />
        </div>
      </div>
    </section>
  );
}
