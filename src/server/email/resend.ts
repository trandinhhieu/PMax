import { Resend } from "resend";

type SendEmailInput = {
  from: string;
  to: string[];
  subject: string;
  text: string;
  html: string;
};

type ResendSuccessResponse = {
  id: string;
};

export class EmailDeliveryError extends Error {
  constructor(message = "Email delivery failed.") {
    super(message);
    this.name = "EmailDeliveryError";
  }
}

export class EmailConfigurationError extends Error {
  constructor(message = "Email is not configured.") {
    super(message);
    this.name = "EmailConfigurationError";
  }
}

export async function sendEmail(input: SendEmailInput) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new EmailConfigurationError("RESEND_API_KEY is not configured.");
  }

  const resend = new Resend(apiKey);
  const payload = {
    from: input.from,
    to: input.to,
    subject: input.subject,
    text: input.text,
    html: input.html,
  };
  const { data, error } = await resend.emails.send(payload);

  if (error || !data) {
    throw new EmailDeliveryError(error?.message ?? "Resend did not return an email id.");
  }

  return data as ResendSuccessResponse;
}
