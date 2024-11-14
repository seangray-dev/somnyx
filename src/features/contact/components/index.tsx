import { ContactForm } from "./contact-form";

export default function ContactPage() {
  return (
    <section className="container flex flex-1 flex-col items-center justify-center py-10">
      <div className="mb-6 text-center">
        <h2 className="mb-4 text-xl font-extrabold capitalize leading-none tracking-tight md:text-3xl 2xl:text-4xl">
          Get in touch with us Today!
        </h2>
        <p className="mx-auto max-w-[65ch] text-pretty font-light text-muted-foreground">
          At Somnyx, we&apos;re committed to supporting your communication
          needs. Feel free to reach out through the contact form below, and our
          team will ensure your inquiries are addressed promptly.
        </p>
      </div>
      <ContactForm />
    </section>
  );
}
