export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <article className="prose mx-auto py-12 dark:prose-invert">
      {children}
    </article>
  );
}
