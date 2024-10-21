export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="prose dark:prose-invert container py-6">
      {children}
    </section>
  );
}
