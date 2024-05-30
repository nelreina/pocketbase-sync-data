import "dotenv/config";

import { pbSource, pbTarget } from "./config/pocketbase.js";
import logger from "./config/logger.js";

import { cleanTarget, copyFromSourceToTarget } from "./lib/sync.js";

const POCKETBASE_SOURCE_ADMIN = process.env["POCKETBASE_SOURCE_ADMIN"];
const POCKETBASE_SOURCE_ADMIN_PASSWORD =
  process.env["POCKETBASE_SOURCE_ADMIN_PASSWORD"];
const POCKETBASE_TARGET_ADMIN = process.env["POCKETBASE_TARGET_ADMIN"];
const POCKETBASE_TARGET_ADMIN_PASSWORD =
  process.env["POCKETBASE_TARGET_ADMIN_PASSWORD"];

const COLLECTIONS_CLEAR = process.env["COLLECTIONS_CLEAR"];
const COLLECTIONS_COPY = process.env["COLLECTIONS_COPY"];

const shutdown = async () => {
  try {
    logger.info("Disconnecting from redis...");
    await client.disconnect();
    process.exit(0);
  } catch (error) {
    logger.error(error.message);
    process.exit(1);
  }
};

try {
  logger.info("✅ Successfully connected to redis");
  if (
    POCKETBASE_SOURCE_ADMIN === undefined ||
    POCKETBASE_SOURCE_ADMIN_PASSWORD === undefined ||
    POCKETBASE_TARGET_ADMIN === undefined ||
    POCKETBASE_TARGET_ADMIN_PASSWORD === undefined
  ) {
    // skip authentication
    logger.warn("Pocketbase Source and Target credentials not provided.");
  } else {
    try {
      await pbSource.admins.authWithPassword(
        POCKETBASE_SOURCE_ADMIN,
        POCKETBASE_SOURCE_ADMIN_PASSWORD
      );
      logger.info(
        "✅ PocketBase Source authenticated for admin user: " +
          POCKETBASE_SOURCE_ADMIN
      );
      await pbTarget.admins.authWithPassword(
        POCKETBASE_TARGET_ADMIN,
        POCKETBASE_TARGET_ADMIN_PASSWORD
      );
      logger.info(
        "✅ PocketBase Target authenticated for admin user: " +
          POCKETBASE_TARGET_ADMIN
      );

      try {
        for await (const collection of COLLECTIONS_CLEAR.split(",")) {
          await cleanTarget(collection);
        }
      } catch (error) {
        logger.error("❗️ PocketBase clear Target failed:  " + error.message);
      }
      try {
        for await (const collection of COLLECTIONS_COPY.split(",")) {
          await copyFromSourceToTarget(collection);
        }
      } catch (error) {
        logger.error("❗️ PocketBase copy failed:  " + error.message);
      }
    } catch (error) {
      logger.error(
        "❗️ PocketBase admin authentication failed:  " + error.message
      );
    }
  }

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
} catch (error) {
  logger.error(error.message);
}
