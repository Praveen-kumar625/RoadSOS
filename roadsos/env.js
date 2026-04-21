/**
 * Team Name: Divine coder
 * Team Lead: Praveen kumar
 * Module: Environment Validator
 */
const env = {
  PORT: process.env.PORT || "5000",
  NODE_ENV: process.env.NODE_ENV || "development",
};
if (env.PORT !== "5000") {
  console.error(`[CRITICAL] Environment Mismatch: PORT must be 5000. Received: ${env.PORT}`);
  process.exit(1);
}
export default env;