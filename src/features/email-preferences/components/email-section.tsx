import EmailPreferences from "./email-preferences";

export default function EmailSection() {
  return (
    <div className="flex flex-col gap-4 rounded border bg-secondary/10 p-4">
      <div className="flex items-center justify-between gap-2">
        <div className="font-medium">Email Preferences:</div>
      </div>
      <EmailPreferences />
    </div>
  );
}
