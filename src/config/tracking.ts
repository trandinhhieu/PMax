import { trackingEvents } from "./tracking-contract.mjs";

export { trackingEvents };

export type TrackingEventName = (typeof trackingEvents)[keyof typeof trackingEvents];
