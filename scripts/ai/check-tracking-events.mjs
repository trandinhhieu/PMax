import {
  requiredTrackingEventNames,
  trackingEvents,
  validateTrackingContract,
} from "../../src/config/tracking-contract.mjs";

const eventNames = Object.values(trackingEvents);
const errors = validateTrackingContract();

for (const eventName of requiredTrackingEventNames) {
  console.log(`${eventNames.includes(eventName) ? "OK" : "MISSING"} ${eventName}`);
}

if (errors.length > 0) {
  for (const error of errors) {
    console.error(`ERROR ${error}`);
  }

  console.error(`Tracking contract check failed with ${errors.length} error(s).`);
  process.exit(1);
}

console.log(`Tracking contract passed with ${eventNames.length} unique event(s).`);
