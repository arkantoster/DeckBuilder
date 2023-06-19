import { Apriori } from 'node-apriori';

import fireStore from './FirebaseHandler';
import log from './logFileStream';
import SQLite from "./SqliteManager";

import collectionId from '../constants/collections';


class AlgorithmRunner {
  constructor() {
    this.decksCollection = fireStore.collection(collectionId.decks)
  }

  public async runApriori(format: string, minSup: number) {
    const SQLiteLocal = await SQLite;

    let spin = log(`Procurando decks com o formato: ${format}`)
    let snapshot;
    try {
      snapshot = await this.decksCollection.where('format', '==', format).get()
    } catch (error) {
      spin.fail(`Erro: ${error}`)
      return;
    }

    if (snapshot.empty) {
      spin.fail(`Não há decks com formato informado`)
      return;
    };

    spin.succeed(`${snapshot.size} decks encontrados no formato`)

    let transactions: string[][] = snapshot.docs.reduce((acc: string[][], val) => {
      const cur: string[] = val.get('cards').reduce((acc: string[], val: { quantity: number, card: string }) => {
        if (val.card && !['deckId', 'Swamp', 'Plains', 'Island', 'Mountain', 'Forest'].includes(val.card)) acc.push(val.card.replace(/[^\w\d]/g, ''))
        return acc
      }, [])
      if (cur.length > 0) acc.push(cur)
      return acc
    }, [])

    log('Decks normalizados').info()

    const aprioriTableName = `${format.toSql()}_apriori_combinations`
    const aprioriItemsTableName = `${format.toSql()}_apriori_items`
    spin = log(`Ajustando tabelas`)
    try {
      await SQLiteLocal.exec(`DROP TABLE IF EXISTS ${aprioriTableName}`)
      await SQLiteLocal.exec(`CREATE TABLE IF NOT EXISTS ${aprioriTableName}(
        comb_id INTEGER PRIMARY KEY,
        support INTEGER,
        quantity INTEGER
        )`)

      await SQLiteLocal.exec(`DROP TABLE IF EXISTS ${aprioriItemsTableName}`)
      await SQLiteLocal.exec(`CREATE TABLE IF NOT EXISTS ${aprioriItemsTableName}(
        name TEXT,
        comb_id INTEGER NOT NULL,
        FOREIGN KEY (comb_id)
           REFERENCES ${aprioriTableName} (comb_id) 
        )`)
    } catch (error) {
      spin.fail(`Erro: ${error}`)
      return;
    }
    spin.succeed(`Tabelas ajustadas`)


    spin = log('Apriori ródano').start()

    const apriori = new Apriori<string>(minSup);
    const result = await apriori.exec(transactions)
    const frequentItemsets = result.itemsets;

    spin.succeed('Apriori finalizado');
    log(`Tempo de execução: ${result.executionTime} ms`, { indent: 2 }).info()
    log(`Combinações frequentes: ${frequentItemsets.length}`, { indent: 2 }).info()

    log(`Inserindo itens:`).info()
    spin = log(``, { indent: 2 })
    try {
      for (let i = 0; i < frequentItemsets.length; i++) {
        spin.text = `${(i + 1).toLocaleString('pt-br')} de ${frequentItemsets.length.toLocaleString('pt-br')}`

        const { items, support } = frequentItemsets[i]
        const res = await SQLiteLocal.run(`INSERT INTO ${aprioriTableName}(support, quantity) VALUES (${[support, items.length].join()});`)

        if (res.lastID != undefined)
          for (let j = 0; j < items.length; j++)
            await SQLiteLocal.run(`INSERT INTO ${aprioriItemsTableName}(name, comb_id) VALUES (${[`'${items[j]}'`, res.lastID].join()});`)

        debugger;
      }
    } catch (error) {
      spin.fail(`Erro: ${error}`)
      return;
    }
    spin.succeed()

    spin = log('Registrando ocorrência')

    try {
      const aprioriDataTable = 'apriori_data'
      await SQLiteLocal.exec(`CREATE TABLE IF NOT EXISTS ${aprioriDataTable}(
        format TEXT UNIQUE,
        minSup DECIMAL,
        decks INTEGER,
        combinations INTEGER
        )`)

      await SQLiteLocal.run(`INSERT OR REPLACE INTO ${aprioriDataTable}(format, minSup, decks, combinations) VALUES ('${format}', ${minSup}, ${transactions.length}, ${frequentItemsets.length});`)
      spin.succeed('Registrado')
    } catch (error) {
      spin.fail(`Erro: ${error}`)
      return;
    }
  }
  private decksCollection;
}

export default AlgorithmRunner;