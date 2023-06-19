import { open } from "sqlite";
import sqlite3 from "sqlite3";

const SQLite = open({
  filename: 'dataBase/sqlDatabase.db',
  driver: sqlite3.Database
})

export default SQLite