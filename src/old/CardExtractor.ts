import { readFile } from "fs/promises";
// import logger from "./logger";
import Card from "../classes/Card";
import db from "../modules/FirebaseHandler";
import collectionId from "../constants/collections";
import { cardFileObj } from "../global";
import log from "../modules/logFileStream";

class CardExtractor {

  constructor() {
    const { cards } = collectionId
    this.cardsCollection = db.collection(cards)
  }

  deconstruct = (obj: any) => {

    function isArray(value: any) {
      return value && typeof value === 'object' && value.constructor === Array;
    }
    function isObject(value: any) {
      return value && typeof value === 'object' && value.constructor === Object;
    }
    const result: any = {}
    Object.keys(obj).forEach((key) => {
      const type = typeof obj[key]
      switch (type) {
        case 'number':
        case 'string':
        case 'boolean':
          result[key] = type
          break;
        case 'object':
          if (isArray(obj[key])) {
            if (obj[key].length) {

              if (isObject(obj[key][0])) {
                result[key] = obj[key].reduce((acc: any, obj: any) => ({ ...acc, ...this.deconstruct(obj) }), {})
              } else {
                result[key] = [typeof obj[key][0]]
              }
            }
          } else if (isObject(obj[key])) {
            result[key] = this.deconstruct(obj[key])
          }
          break;
        default:
          debugger;
      }
    })
    return result;
  }

  async readDb() {
    try {

      log('Lendo arquivo').info()

      const fileString = (await readFile('dataBase/default-cards-20230529211211.json')).toString()
      const fileObject: cardFileObj[] = JSON.parse(fileString)

      log('Arquivo lido').info()

      for (const card of fileObject) {

        if (card.games.length <= 0) {
          log(card.name).info()
          console.log(card);
          throw 'carta sem jogo cadastrado'
        };

        if (card.games.includes('paper')) {

          log(`Carta: ${card.name}`)
          const snapshot = await this.cardsCollection.where('name', '==', card.name).get()

          const record = new Card(card)
          if (snapshot.empty) await this.cardsCollection.doc().set(record.toFirebase());
        }

      }
    } catch (error) {
      log(error as string)
      throw 'Erro: ' + error
    }
  }

  private cardsCollection;
}

export default CardExtractor
