
export interface cardInfo {
  quantity: number
  card: string
}

class Deck {
  constructor(name: string, format: string, cards: cardInfo[], extId: number, moreInfo?: string) {
    this.cards = cards;
    this.format = format;
    this.name = name
    this.moreInfo = moreInfo
    this.extId = extId
  }

  public name: string;
  public cards: cardInfo[];
  public size(): number { return this.cards.reduce((acc, card) => acc + card.quantity, 0) }
  public format: string;
  public moreInfo?: string;
  public extId: number
  public toFirebase() {
    return {
      name: this.name ?? 'N/A',
      size: this.size(),
      format: this.format,
      extId: this.extId,
      cards: this.cards
    }
  }
}

export default Deck