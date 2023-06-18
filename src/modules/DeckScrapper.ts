import Xray from 'x-ray'
import Deck, { cardInfo } from '../classes/Deck';
import db from './FirebaseHandler';

export default class DeckScrapper {
  constructor() {
    this.x = Xray({
      filters: {
        toNumber: (str: string) => Number(str.trim()),
        onlyNumbers: (str: string) => str.replace(/\D/g, '')
      }
    }).delay('1s', '5s');

    this.decksCollection = db.collection('decks')
  }

  async scrapDecksFromEvents() {

    try {
      // logger.log('pegando eventos', 'info')
      const eventList = await this.x('https://www.ligamagic.com.br/?view=dks/decks', 'div.dks-evento', [
        {
          name: 'div.name-main > p@text',
          format: 'div.format-name > div@text',
          url: 'a@href'
        }])

      for (const event of eventList) {
        // logger.log(`buscando decks do evento: ${event.name}(${event.url})`, 'info')

        const deckList = await this.x(event.url, 'div.deckhome', [{
          id: 'a@href | onlyNumbers | toNumber',
          name: 'div.deckname > a@text',
          url: 'a@href'
        }])

        for (const deck of deckList) {

          // logger.log('procurando deck no db', 'info')
          const snapshot = await this.decksCollection.where('extId', '==', deck.id).get()

          if (snapshot.empty) {
            // logger.log('deck não encontrado', 'info')
            // logger.log(`buscando cartas do deck: ${deck.name}(${deck.url})`, 'info')
            const cardList = await this.x(deck.url, `div#dk-val-1-${deck.id} > div.pdeck-block:nth-child(1) tr`, [{
              quantity: 'td.deck-qty@text | toNumber',
              card: this.x('td.deck-card > a@href', 'p.nome-auxiliar@text'),
            }])

            const deckObj = new Deck(
              deck.name,
              event.format,
              cardList.filter((card: cardInfo) => card.quantity),
              deck.id,
              `Deck Scrapped from ${deck.url}, used in ${event.name}`
            )

            // logger.log('salvando deck', 'info')
            await this.decksCollection.doc().set(deckObj.toFirebase());
            // logger.log('deck incluído', 'info')
          } else {
            // logger.log('deck encontrado', 'warning')
          }
        }
      }
    } catch (error) {
      // logger.log(error as string, 'error')
      throw 'E: ' + error
    } finally {
      // logger.log('deckbuilder done', 'info')
    }
  }

  public async getFormatsFromDecks() {
    try {
      // logger.log('getting decks', 'info')
      const decksSnapshot = await db.collection('decks').get();
      const counter: any = {}
      for (const deckSnap of decksSnapshot.docs) {

        const deck = deckSnap.data()
        // logger.log(`deck: ${deck.name} | format: ${deck.format}`, 'info')

        if (counter[deck.format]) {
          counter[deck.format]++
        } else {
          counter[deck.format] = 1
        }
        // logger.log('procurando formato', 'info')
        const snapshot = await db.collection('deckFormats').where('name', '==', deck.format).get();

        if (snapshot.empty) {
          // logger.log('formato n encontrado', 'info')
          await db.collection('deckFormats').doc().set({ name: deck.format })
        } else {
          // logger.log('formato encontrado', 'warning')
        }
      }
      // logger.log(JSON.stringify(counter), 'info')
      // logger.log('end', 'info')
    } catch (error) {
      // logger.log(`Erro: ${error}`, 'error')
    }
  }

  public async shouldGetDecks() {
    // const pro = new Promise(() => {
    return false
    // })
  }

  public decksCollection;
  public x;
} 