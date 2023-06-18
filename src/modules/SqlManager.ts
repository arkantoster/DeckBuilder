import sqlite3 from "sqlite3";
import { open } from 'sqlite'

class SqlManager {
  // constructor() {
  //   // logger.log('sql manager init', 'info')
  // }

  // public async openDb() {
  //   this.db = await open({
  //     filename: 'sqlDatabase.db',
  //     driver: sqlite3.Database
  //   })
  //   // logger.log('db conectado', 'info')
  // }

  // async prepareTable(nameprefix: string) {
  //   // logger.log('criando tbla', 'info')

  //   const tableName = SqlManager.toTableName(nameprefix)
  //   await this.db.exec(`DROP TABLE IF EXISTS ${tableName}`)
  //   await this.db.exec(`CREATE TABLE IF NOT EXISTS ${tableName}(deckId TEXT NOT NULL)`)
  //   // logger.log('tbla criada', 'info')

  //   return { name: tableName }
  // }

  static toColumnName(str: string) {
    return str.replace(/[^\w\d]/g, '');
  }

  static toTableName(str: string, sufix: string = '') {
    return `${str.replace(/\W/g, '').toLocaleLowerCase()}${sufix}`
  }

  // public db: any;
}

export default SqlManager;