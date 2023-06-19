import select from '@inquirer/select';
import { input } from "@inquirer/prompts";

import DeckScrapper from "./modules/DeckScrapper";
import AlgorithmRunner from "./modules/AlgorithmRunner";
import log from "./modules/logFileStream";
import fireStore from "./modules/FirebaseHandler";
import SQLite from './modules/SqliteManager';

import collectionId from "./constants/collections";

String.prototype.toSql = function () {
  return this.replace(' ', '_').replace(/[^\w\d]/g, '').toLowerCase()
}

const main = async () => {

  console.log(` `)
  console.log(`███╗░░░███╗████████╗░██████╗░  ██████╗░███████╗░█████╗░██╗░░██╗`)
  console.log(`████╗░████║╚══██╔══╝██╔════╝░  ██╔══██╗██╔════╝██╔══██╗██║░██╔╝`)
  console.log(`██╔████╔██║░░░██║░░░██║░░██╗░  ██║░░██║█████╗░░██║░░╚═╝█████═╝░`)
  console.log(`██║╚██╔╝██║░░░██║░░░██║░░╚██╗  ██║░░██║██╔══╝░░██║░░██╗██╔═██╗░`)
  console.log(`██║░╚═╝░██║░░░██║░░░╚██████╔╝  ██████╔╝███████╗╚█████╔╝██║░╚██╗`)
  console.log(`╚═╝░░░░░╚═╝░░░╚═╝░░░░╚═════╝░  ╚═════╝░╚══════╝░╚════╝░╚═╝░░╚═╝\n`)
  console.log(`       ██████╗░██╗░░░██╗██╗██╗░░░░░██████╗░███████╗██████╗░      `)
  console.log(`       ██╔══██╗██║░░░██║██║██║░░░░░██╔══██╗██╔════╝██╔══██╗      `)
  console.log(`       ██████╦╝██║░░░██║██║██║░░░░░██║░░██║█████╗░░██████╔╝      `)
  console.log(`       ██╔══██╗██║░░░██║██║██║░░░░░██║░░██║██╔══╝░░██╔══██╗      `)
  console.log(`       ██████╦╝╚██████╔╝██║███████╗██████╔╝███████╗██║░░██║      `)
  console.log(`       ╚═════╝░░╚═════╝░╚═╝╚══════╝╚═════╝░╚══════╝╚═╝░░╚═╝      \n\n`)


  log('Deck Builder inicializado').info()

  let spin = log('Validando se há novos decks')
  const deckScrap = new DeckScrapper();
  if (await deckScrap.shouldGetDecks()) {
    spin.succeed('Há novos decks')
    await deckScrap.scrapDecksFromEvents();
    await deckScrap.getFormatsFromDecks()
  } else spin.info('Não há novos decks')

  spin = log('Consultando formatos')
  let formats = []
  let descriptions: {
    format: string,
    minSup: number,
    decks: number,
    combinations: number,
  }[] = []
  try {
    const formatsSnap = await fireStore.collection(collectionId.formats).get()
    formats = formatsSnap.docs.map(val => val.get('name'));

    descriptions = await (await SQLite).all('SELECT * FROM apriori_data');

    spin.succeed('Formatos lidos')
  } catch (error) {
    spin.fail('Não foi possível obter os formatos disponíveis.');
  }

  let choosenFormat = ''

  if (formats.length) {
    choosenFormat = await select({
      message: 'Selecione um formato:',
      choices: formats.map(val => (
        {
          name: val,
          value: val,
          description: descriptions.reduce((acc, cur) => {
            if (cur.format === val) acc = `${cur.decks} decks | ${cur.minSup * 100}% suporte | ${cur.combinations} combinações`
            return acc
          }, '')
        }))
    });
  } else {
    choosenFormat = await input({ message: 'Digite um formato:' });
  }

  const minSup = await select({
    message: 'Qual o suporte mínimo:',
    choices: [
      {
        name: `17.5%`,
        value: 0.175
      }, {
        name: `20%`,
        value: 0.20
      }, {
        name: `22.5%`,
        value: 0.225
      }, {
        name: `25%`,
        value: 0.25
      }, {
        name: `27.5%`,
        value: 0.275
      }, {
        name: `30%`,
        value: 0.30
      }
    ]
  });

  log('Inicializando cálculos').info()

  const alg = new AlgorithmRunner()
  await alg.runApriori(choosenFormat, minSup)

  log(`Deck Builder finalizado`).info()

}

main()
