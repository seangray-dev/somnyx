export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="container prose py-20 dark:prose-invert">
      {children}
    </section>
  );
}
