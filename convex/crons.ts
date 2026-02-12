import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.interval("delete expired sensitive data", { hours: 1 }, internal.cleanup.deleteExpiredSensitiveData);

export default crons;
