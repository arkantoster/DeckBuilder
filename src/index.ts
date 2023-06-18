import DeckScrapper from "./modules/DeckScrapper";
import AlgorithmRunner from "./modules/AlgorithmRunner";
import log from "./modules/logFileStream";

String.prototype.toSql = function () {
  return this.replace(' ', '_').replace(/[^\w\d]/g, '').toLowerCase()
}

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});

const main = async () => {

  console.log(`\n\n       /$$      /$$ /$$$$$$$$ /$$$$$$        /$$$$$$$                      /$$             /$$$$$$$            /$$ /$$       /$$                    `)
  console.log(`      | $$$    /$$$|__  $$__//$$__  $$      | $$__  $$                    | $$            | $$__  $$          |__/| $$      | $$                    `)
  console.log(`      | $$$$  /$$$$   | $$  | $$  \\__/      | $$  \\ $$  /$$$$$$   /$$$$$$$| $$   /$$      | $$  \\ $$ /$$   /$$ /$$| $$  /$$$$$$$  /$$$$$$   /$$$$$$ `)
  console.log(`      | $$ $$/$$ $$   | $$  | $$ /$$$$      | $$  | $$ /$$__  $$ /$$_____/| $$  /$$/      | $$$$$$$ | $$  | $$| $$| $$ /$$__  $$ /$$__  $$ /$$__  $$`)
  console.log(`      | $$  $$$| $$   | $$  | $$|_  $$      | $$  | $$| $$$$$$$$| $$      | $$$$$$/       | $$__  $$| $$  | $$| $$| $$| $$  | $$| $$$$$$$$| $$  \\__/`)
  console.log(`      | $$\\  $ | $$   | $$  | $$  \\ $$      | $$  | $$| $$_____/| $$      | $$_  $$       | $$  \\ $$| $$  | $$| $$| $$| $$  | $$| $$_____/| $$      `)
  console.log(`      | $$ \\/  | $$   | $$  |  $$$$$$/      | $$$$$$$/|  $$$$$$$|  $$$$$$$| $$ \\  $$      | $$$$$$$/|  $$$$$$/| $$| $$|  $$$$$$$|  $$$$$$$| $$      `)
  console.log(`      |__/     |__/   |__/   \\______/       |_______/  \\_______/ \\_______/|__/  \\__/      |_______/  \\______/ |__/|__/ \\_______/ \\_______/|__/      \n\n`)

  log('Deck Builder inicializado').info()



  readline.question(`What's your name?`, (name: string) => {
    console.log(`Hi ${name}!`);
    readline.close();
  });

  let spin = log('Validando se há novos decks')
  const deckScrap = new DeckScrapper();
  if (await deckScrap.shouldGetDecks()) {
    spin.succeed('Há novos decks')
    await deckScrap.scrapDecksFromEvents();
    await deckScrap.getFormatsFromDecks()
  } else spin.fail('Não há novos decks')

  log('Inicializando cálculos').info()

  const alg = new AlgorithmRunner()
  await alg.runApriori('Pioneer', 0.25)


  // alg.runApriori('Pioneer', 0.175)
  // ℹ Tempo de execução: 38811
  // ℹ combinações frequentes: 69910


  log(`Deck Builder finalizado`).info()

}

main()
