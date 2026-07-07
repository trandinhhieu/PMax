type TwilioVerificationResponse = {
  sid?: string;
  status?: string;
  to?: string;
  valid?: boolean;
  message?: string;
};

type TwilioErrorResponse = {
  code?: number;
  message?: string;
  more_info?: string;
  status?: number;
};

type TwilioVerifyConfig = {
  accountSid: string;
  authToken: string;
  serviceSid: string;
};

export class OtpConfigurationError extends Error {
  constructor(message = "OTP is not configured.") {
    super(message);
    this.name = "OtpConfigurationError";
  }
}

export class OtpDeliveryError extends Error {
  constructor(message = "OTP could not be sent.") {
    super(message);
    this.name = "OtpDeliveryError";
  }
}

export class OtpVerificationError extends Error {
  constructor(message = "OTP verification failed.") {
    super(message);
    this.name = "OtpVerificationError";
  }
}

function readEnv(name: "TWILIO_ACCOUNT_SID" | "TWILIO_AUTH_TOKEN" | "TWILIO_VERIFY_SERVICE_SID") {
  return process.env[name]?.trim().replace(/^["'](.*)["']$/, "$1").trim() ?? "";
}

function getConfig(): TwilioVerifyConfig {
  const accountSid = readEnv("TWILIO_ACCOUNT_SID");
  const authToken = readEnv("TWILIO_AUTH_TOKEN");
  const serviceSid = readEnv("TWILIO_VERIFY_SERVICE_SID");

  if (!accountSid || !authToken || !serviceSid) {
    throw new OtpConfigurationError("TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_VERIFY_SERVICE_SID must be configured.");
  }

  return { accountSid, authToken, serviceSid };
}

export function normalizePhoneNumber(value: string) {
  const compact = value.trim().replace(/[\s().-]/g, "");

  if (compact.startsWith("+")) return compact;
  if (compact.startsWith("00")) return `+${compact.slice(2)}`;
  if (compact.startsWith("0")) return `+84${compact.slice(1)}`;
  if (compact.startsWith("84")) return `+${compact}`;

  return compact;
}

function isE164Phone(value: string) {
  return /^\+[1-9]\d{7,14}$/.test(value);
}

async function callTwilioVerify(path: string, body: URLSearchParams) {
  const config = getConfig();
  const credentials = Buffer.from(`${config.accountSid}:${config.authToken}`).toString("base64");
  const response = await fetch(`https://verify.twilio.com/v2/Services/${config.serviceSid}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  const payload = (await response.json()) as TwilioVerificationResponse & TwilioErrorResponse;

  if (!response.ok) {
    throw new OtpDeliveryError(payload.message ?? `Twilio Verify returned ${response.status}.`);
  }

  return payload;
}

export async function startSmsOtp(rawPhone: string) {
  const phone = normalizePhoneNumber(rawPhone);

  if (!isE164Phone(phone)) {
    throw new OtpVerificationError("Please enter a valid phone number with country code, for example +84905906842.");
  }

  const body = new URLSearchParams({
    To: phone,
    Channel: "sms",
  });
  const verification = await callTwilioVerify("/Verifications", body);

  return {
    phone,
    status: verification.status ?? "pending",
  };
}

export async function verifySmsOtp(rawPhone: string, code: string) {
  const phone = normalizePhoneNumber(rawPhone);

  if (!isE164Phone(phone)) {
    throw new OtpVerificationError("Please enter a valid phone number with country code, for example +84905906842.");
  }

  const body = new URLSearchParams({
    To: phone,
    Code: code.trim(),
  });
  const verification = await callTwilioVerify("/VerificationCheck", body);

  if (verification.status !== "approved" && verification.valid !== true) {
    throw new OtpVerificationError("The verification code is invalid or expired.");
  }

  return {
    phone,
    status: verification.status ?? "approved",
  };
}
