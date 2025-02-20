import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  getBrowserInfo,
  getDeviceType,
  getOSInfo,
  getScreenResolution,
} from "@/utils/device-info";

const feedbackFormSchema = z.object({
  type: z.union([z.literal("feedback"), z.literal("issue")]),
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().min(1, "Description is required").max(1000),
  deviceInfo: z
    .object({
      deviceType: z.string(),
      browser: z.string(),
      os: z.string(),
      screenResolution: z.string(),
    })
    .optional(),
  metadata: z
    .object({
      reportedFromBrowser: z.string(),
      reportedFromOs: z.string(),
      reportedFromScreenResolution: z.string(),
      reportedFromDeviceType: z.string(),
    })
    .optional(),
});

export type FeedbackFormValues = z.infer<typeof feedbackFormSchema>;

export function useFeedbackForm(type: "feedback" | "issue") {
  const screenRes = getScreenResolution();
  const browser = getBrowserInfo();
  const os = getOSInfo();
  const deviceType = getDeviceType();

  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackFormSchema),
    defaultValues: {
      type,
      title: "",
      description: "",
      deviceInfo:
        type === "issue"
          ? {
              deviceType,
              browser,
              os,
              screenResolution: screenRes,
            }
          : undefined,
      metadata:
        type === "issue"
          ? {
              reportedFromBrowser: getBrowserInfo(),
              reportedFromOs: getOSInfo(),
              reportedFromScreenResolution: getScreenResolution(),
              reportedFromDeviceType: getDeviceType(),
            }
          : undefined,
    },
  });

  return form;
}
