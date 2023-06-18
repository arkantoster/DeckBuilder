import sqlite3 from "sqlite3";
import { cardInfo } from '../classes/Deck';
import collectionId from '../constants/collections';
import db from './FirebaseHandler';
import { open } from 'sqlite';
import log from './logFileStream';
import { Apriori } from 'node-apriori';

// interface pragmaColumn {
//   cid: number
//   name: string
//   type: string
//   notnull: number
//   dflt_value: string
//   pk: number
// }

// interface support {
//   elements: string[]
//   ratio: number
// }

class AlgorithmRunner {
  constructor() {
    this.decksCollection = db.collection(collectionId.decks)
    this.SQLManagerLocal = open({
      filename: 'sqlDatabase.db',
      driver: sqlite3.Database
    })
    this.SQLManagerMemory = open({
      filename: ':memory:',
      driver: sqlite3.Database
    })
  }

  public async runApriori(format: string, minSup: number) {
    const SQLiteLocal = await this.SQLManagerLocal;

    let spin = log(`Procurando decks com o formato: ${format}`)
    let snapshot;
    try {
      snapshot = await this.decksCollection.where('format', '==', format).get()
    } catch (error) {
      spin.fail(`Erro: ${error}`)
      return;
    }

    if (snapshot.empty) {
      log(`Não há decks com formato informado`).fail()
      return;
    };
    spin.succeed(`${snapshot.size} decks encontrados no formato`)

    let transactions: string[][] = snapshot.docs.reduce((acc: string[][], val) => {
      const cur: string[] = val.get('cards').reduce((acc: string[], val: cardInfo) => {
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
    log(`Tempo de execução: ${result.executionTime} ms`, { indent: 6 }).info()
    log(`Combinações frequentes: ${frequentItemsets.length}`, { indent: 6 }).info()

    log(`Inserindo itens:`).info()
    spin = log(``, { indent: 6 })
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
  }

  // public async createBinaryTable(format: string) {
  //   const SQLite = await this.SQLManagerMemory;

  //   let spin = log(`Procurando decks com o formato: ${format}`)
  //   let snapshot;
  //   try {
  //     snapshot = await this.decksCollection.where('format', '==', format).get()
  //   } catch (error) {
  //     spin.fail(`Erro: ${error}`)
  //     return;
  //   }

  //   if (snapshot.empty) {
  //     log(`Não há decks com formato informado`).fail()
  //     return;
  //   };
  //   spin.succeed(`${snapshot.size} decks encontrados no formato`)

  //   const tableName = `${format.toSql()}BinaryTable`

  //   spin = log(`Ajustando tabela ${tableName}`)
  //   try {
  //     await SQLite.exec(`DROP TABLE IF EXISTS ${tableName}`)
  //     await SQLite.exec(`CREATE TABLE IF NOT EXISTS ${tableName}(deckId TEXT NOT NULL)`)
  //   } catch (error) {
  //     spin.fail(`Erro: ${error}`)
  //   }
  //   spin.succeed(`Tabela ${tableName} ajustada`)

  //   const cardsFounds: string[] = []
  //   let counters = {
  //     noCards: 0,
  //     sucess: 0,
  //     failures: 0
  //   }
  //   for (const deckSnap of snapshot.docs) {
  //     const deck = deckSnap.data()
  //     log(`Deck: ${deck.name}`).info()

  //     const normCards = deck.cards.reduce((acc: string[], card: cardInfo) => {
  //       if (card.card) {
  //         const colName = SqlManager.toColumnName(card.card)
  //         acc.push(colName)
  //       }
  //       return acc
  //     }, [])

  //     if (normCards.length) {
  //       const commands: string[] = normCards.reduce((acc: string[], cardName: string) => {
  //         if (!cardsFounds.includes(cardName)) {
  //           acc.push(`ALTER TABLE ${tableName} ADD COLUMN ${SqlManager.toColumnName(cardName)} INTEGER DEFAULT 0`)
  //           cardsFounds.push(cardName)
  //         }
  //         return acc
  //       }, [])

  //       log(`${commands.length} novas cartas encontradas`, { indent: 6 }).info()
  //       if (commands.length > 0) {
  //         const alterTableSpin = log('Adicionando novas colunas', { indent: 8 })
  //         for (let i = 0; i < commands.length; i++) {
  //           alterTableSpin.start(`Coluna ${i + 1} de ${commands.length}`)
  //           try {
  //             await SQLite.exec(commands[i])
  //           } catch (error) {
  //             alterTableSpin.fail(`Erro: ${error}`)
  //           }
  //         }
  //         alterTableSpin.succeed('Colunas adicionadas')
  //       }

  //       const insertCmd = `INSERT INTO ${tableName} (deckId,${normCards.join()}) VALUES ('${deckSnap.id}',${Array(normCards.length).fill(1).join()})`
  //       const insertSpin = log(`Cadastrando deck na base`, { indent: 6 })
  //       try {
  //         await SQLite.exec(insertCmd)
  //         insertSpin.succeed(`Deck cadastrado com sucesso`)
  //         counters.sucess++
  //       } catch (error) {
  //         insertSpin.fail(`Erro: ${error}`)
  //         counters.failures++
  //       }
  //     } else {
  //       log('Deck sem cartas cadastradas').fail()
  //       counters.noCards++
  //     }
  //   }

  //   log(`Resultados:`).info()
  //   log(`Sucessos: ${counters.sucess}`, { indent: 6 }).succeed()
  //   log(`Falhas: ${counters.failures}`, { indent: 6 }).fail()
  //   log(`Sem cartas: ${counters.noCards}`, { indent: 6 }).fail()

  //   log(`Tabela ${tableName} pronta`).succeed()

  // }

  // async calcSupport(format: string, minSup: number, maxComb: number = 3, cards?: string[]) {
  //   const SQLiteLocal = await this.SQLManagerLocal;
  //   const SQLiteMemory = await this.SQLManagerMemory;

  //   log('Iniciando cálculos').info()
  //   log(`Informações iniciais:`, { indent: 6 }).info()
  //   log(`Suporte mínimo: ${minSup * 100}`, { indent: 8 }).info()
  //   log(`Formato: ${format}`, { indent: 8 }).info()

  //   let binTable
  //   let PRAGMA

  //   let spin = log(`Buscando informações sobre o formato`)
  //   try {
  //     binTable = await SQLiteMemory.get<{ count: number }>(`SELECT COUNT(*) as count FROM ${format.toSql()}BinaryTable;`)
  //     PRAGMA = await SQLiteMemory.all<pragmaColumn[]>(`PRAGMA table_info(${format.toSql()}BinaryTable);`)
  //   } catch (error) {
  //     spin.fail(`Erro: ${error}`)
  //     return;
  //   } finally {
  //     if (binTable === undefined || binTable.count <= 0 || PRAGMA === undefined) {
  //       log('Não foi possível recuperar os dados').fail()
  //       return;
  //     }
  //   }

  //   const DeckCount = binTable.count

  //   cards = cards ?? PRAGMA.reduce((acc: string[], val: pragmaColumn) => {
  //     if (!['deckId', 'Swamp', 'Plains', 'Island', 'Mountain', 'Forest'].includes(val.name)) acc.push(val.name)
  //     return acc
  //   }, [])
  //   spin.succeed(`Encontrado ${DeckCount} decks, com ${cards.length} cartas diferentes`)


  //   const combTableName = `${format.toSql()}Combinations`
  //   const binTableName = `${format.toSql()}BinaryTable`

  //   spin = log(`Ajustando tabela ${combTableName}`)
  //   try {
  //     await SQLiteLocal.exec(`DROP TABLE IF EXISTS ${combTableName}`)
  //     await SQLiteLocal.exec(`CREATE TABLE IF NOT EXISTS ${combTableName}(
  //       cardComb TEXT NOT NULL,
  //       freqAb INT NOT NULL,
  //       freqPc DECIMAL,
  //       pos TEXT
  //       )`)
  //   } catch (error) {
  //     spin.fail(`Erro: ${error}`)
  //   }
  //   spin.succeed(`Tabela ${combTableName} ajustada`)

  //   const timer = moment()
  //   log(`Inicio das permutações`).info()
  //   for (let i = 1; i <= 3; i++) {

  //     const permutation = new Permutation(cards, i)

  //     log(`Permutações de ${i} iten(s)`, { indent: 6 }).info()

  //     let values = []
  //     let permSpin = log('Início das permutações', { indent: 8 })
  //     for (let j = 0; j < permutation.length; j++) {
  //       // permSpin.text = `${(j + 1).toLocaleString('pt-br')} de ${permutation.length.toLocaleString('pt-br')}`
  //       const combination = permutation.at(j)
  //       if (combination) {
  //         // 1100 ms
  //         // 26.530 ms
  //         // await SQLiteLocal.exec(`INSERT INTO ${combTableName}(cardComb, freqAb, freqPc) SELECT '${combination.join()}' AS cardComb, COUNT(*) AS freqAb, (COUNT(*)/${DeckCount}.0) AS freqPc FROM ${binTableName} WHERE ${combination.map(val => `${val} = 1`).join(' AND ')};`)

  //         // 759 ms
  //         // 18.198ms
  //         // 32.309ms 50 itens
  //         const support = await SQLiteMemory.get<{ cardComb: string, freqAb: number, freqPc: number }>(`SELECT '${combination.join()}' AS cardComb, COUNT(*) AS freqAb, (COUNT(*)/${DeckCount}.0) AS freqPc FROM ${binTableName} WHERE ${combination.map(val => `${val} = 1`).join(' AND ')}`)
  //         if (support?.freqPc && support.freqPc > minSup) values.push([`'${support?.cardComb}'`, support?.freqAb, support?.freqPc, `'${i}/${j}'`])
  //         if (values.length >= 100 || (j + 1).toString() === permutation.length.toString()) {
  //           try {
  //             SQLiteLocal.exec(`INSERT INTO ${combTableName}(cardComb, freqAb, freqPc, pos) VALUES ${values.map(val => `(${val.join()})`).join()};`)
  //             permSpin.text = `${(j + 1).toLocaleString('pt-br')} de ${permutation.length.toLocaleString('pt-br')}`
  //           } catch (error) {
  //             permSpin.fail(`Erro: ${error}`)
  //             return;
  //           }
  //           values = []
  //         }
  //       }
  //     }
  //     permSpin.succeed()
  //     log(`Tempo decorrido: ${(moment().diff(timer, 'seconds', true) * 1000).toFixed()}ms`, { indent: 8 }).info()


  //   }

  //   log('Permutações finalizadas').info()
  // }

  private SQLManagerLocal
  private SQLManagerMemory
  private decksCollection;
}

export default AlgorithmRunner;