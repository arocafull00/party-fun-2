// This file is required for Expo/React Native SQLite migrations - https://orm.drizzle.team/quick-sqlite/expo

import journal from "./meta/_journal.json";
import m0001 from "./0001_stiff_deadpool.sql";
import m0002 from "./0002_create_missing_tables.sql";

export default {
  journal,
  migrations: {
    m0001,
    m0002,
  },
};
