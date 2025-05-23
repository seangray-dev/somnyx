"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import LoadingButton from "@/components/shared/loading-button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "name must be at least 2 characters.",
  }),
  email: z.string().min(2, { message: "must be a valid email." }),
  subject: z.string().min(2, {
    message: "subject must be at least 2 characters.",
  }),
  message: z
    .string()
    .min(10, { message: "must be at least 10 characters." })
    .max(1000, { message: "Message must not be longer than 1000 characters." }),
});

export function ContactForm() {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });
  const messageValue = useWatch({ control: form.control, name: "message" });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://www.formail.dev/submit/j57028j0k5pedc1m5by3v7zatd74jsrw",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: values.name,
            email: values.email,
            subject: values.subject,
            message: values.message,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      form.reset();
      toast.success("Message sent!", {
        description:
          "Thanks for contacting us, someone will be in touch with you soon.",
      });
    } catch (error) {
      toast.error("Your message was not sent", {
        description: "Please try again ",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto flex w-full max-w-md flex-col gap-4 md:max-w-2xl"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Michael Scott" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="michaelscott@dundermifflin.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Subject" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea
                  maxLength={1000}
                  className="resize-none"
                  placeholder="Your message"
                  {...field}
                />
              </FormControl>
              <FormDescription className="text-right">
                {`${messageValue.length}/1000`}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton isLoading={isLoading} type="submit">
          Submit
        </LoadingButton>
      </form>
    </Form>
  );
}
