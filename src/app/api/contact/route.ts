import { createContactHandler, MemoryRateLimiter } from "@/lib/contact";
import { createResendDelivery, isResendConfigured } from "@/lib/resend";

const resendConfig = {
  apiKey: process.env.RESEND_API_KEY ?? "",
  from: process.env.CONTACT_FROM_EMAIL ?? "",
  to: process.env.CONTACT_TO_EMAIL ?? "",
};

const limiter = new MemoryRateLimiter(3, 60_000);
const deliver = createResendDelivery(resendConfig);

export const POST = createContactHandler({
  limiter,
  isDeliveryConfigured: () => isResendConfigured(resendConfig),
  deliver,
});
