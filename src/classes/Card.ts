import moment, { Moment } from "moment"
import ManaCost from "./ManaCost"
import { cardFileObj, legalities, face } from "../global"


export default class Card {
  constructor(cardData: cardFileObj) {
    const { released_at, name } = cardData
    this.originalData = cardData
    if (!name) debugger;
    this.name = name ?? ''
    this.released_at = moment(released_at)

  }

  private getFaces(card: cardFileObj) {

    return []
  }

  private translateManaCost(manaCost: string | undefined) {
    if (!manaCost) return [new ManaCost()]
    return manaCost.split('//').map(cost => new ManaCost(cost))
  }

  public toFirebase() {
    return {
      name: this.name,
      released_at: this.released_at,
      originalData: this.originalData,
    }
  }

  public originalData: cardFileObj
  public released_at: Moment
  public name: string
}