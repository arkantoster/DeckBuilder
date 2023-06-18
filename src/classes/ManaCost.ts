export default class ManaCost {
  constructor(cost = '') {

    // Colors
    this.black = 0
    this.blue = 0
    this.green = 0
    this.red = 0
    this.white = 0
    // Colorless
    this.colorless = 0
    this.generic = 0
    this.snow = 0
    this.x = 0
    // 2 colors
    this.blackGreen = 0
    this.blackRed = 0
    this.blueBlack = 0
    this.blueRed = 0
    this.greenBlue = 0
    this.greenWhite = 0
    this.redGreen = 0
    this.redWhite = 0
    this.whiteBlack = 0
    this.whiteBlue = 0
    // Color or 2 Life
    this.blackTwoLife = 0
    this.blueTwoLife = 0
    this.greenTwoLife = 0
    this.redTwoLife = 0
    this.whiteTwoLife = 0
    // 2 Colors or 2 Life
    this.blackGreenTwoLife = 0
    this.blackRedTwoLife = 0
    this.blueBlackTwoLife = 0
    this.blueRedTwoLife = 0
    this.greenBlueTwoLife = 0
    this.greenWhiteTwoLife = 0
    this.redGreenTwoLife = 0
    this.redWhiteTwoLife = 0
    this.whiteBlackTwoLife = 0
    this.whiteBlueTwoLife = 0
    // Un Series
    this.y = 0
    this.z = 0
    this.halfWhite = 0

    const unitList = cost.match(/\{.+?\}/g)

    if (unitList)
      unitList.forEach((v) => this.add(v, this))

  }

  private add = (unit: string, ref: ManaCost) => {
    if (unit === '{B}') ref.black += 1
    else if (unit === '{U}') ref.blue += 1
    else if (unit === '{G}') ref.green += 1
    else if (unit === '{R}') ref.red += 1
    else if (unit === '{W}') ref.white += 1
    else if (unit === '{C}') ref.colorless += 1
    else if (unit === '{S}') ref.snow += 1
    else if (unit === '{X}') ref.x += 1
    else if (unit === '{B/G}') ref.blackGreen += 1
    else if (unit === '{B/R}') ref.blackRed += 1
    else if (unit === '{U/B}') ref.blueBlack += 1
    else if (unit === '{U/R}') ref.blueRed += 1
    else if (unit === '{G/U}') ref.greenBlue += 1
    else if (unit === '{G/W}') ref.greenWhite += 1
    else if (unit === '{R/G}') ref.redGreen += 1
    else if (unit === '{R/W}') ref.redWhite += 1
    else if (unit === '{W/B}') ref.whiteBlack += 1
    else if (unit === '{W/U}') ref.whiteBlue += 1
    else if (unit === '{B/P}') ref.blackTwoLife += 1
    else if (unit === '{U/P}') ref.blueTwoLife += 1
    else if (unit === '{G/P}') ref.greenTwoLife += 1
    else if (unit === '{R/P}') ref.redTwoLife += 1
    else if (unit === '{W/P}') ref.whiteTwoLife += 1
    else if (unit === '{B/G/P}') ref.blackGreenTwoLife += 1
    else if (unit === '{B/R/P}') ref.blackRedTwoLife += 1
    else if (unit === '{U/B/P}') ref.blueBlackTwoLife += 1
    else if (unit === '{U/R/P}') ref.blueRedTwoLife += 1
    else if (unit === '{G/U/P}') ref.greenBlueTwoLife += 1
    else if (unit === '{G/W/P}') ref.greenWhiteTwoLife += 1
    else if (unit === '{R/G/P}') ref.redGreenTwoLife += 1
    else if (unit === '{R/W/P}') ref.redWhiteTwoLife += 1
    else if (unit === '{W/B/P}') ref.whiteBlackTwoLife += 1
    else if (unit === '{W/U/P}') ref.whiteBlueTwoLife += 1
    else if (unit === '{Y}') ref.y += 1
    else if (unit === '{Z}') ref.z += 1
    else if (unit === '{HW}') ref.halfWhite += 0.5
    else {
      const qtd = unit.match(/\d+/g)
      if (qtd) {
        ref.generic += Number(qtd)
      } else {
        throw 'erro #2'
      }
    }
  }

  /**
   * Coverted Mana Cost
   * @returns sum of all the mana costs
   */
  public cmc() {
    return this.black
      + this.blue
      + this.green
      + this.red
      + this.white
      + this.colorless
      + this.generic
      + this.snow
      + this.x
      + this.blackGreen
      + this.blackRed
      + this.blueBlack
      + this.blueRed
      + this.greenBlue
      + this.greenWhite
      + this.redGreen
      + this.redWhite
      + this.whiteBlack
      + this.whiteBlue
      + this.blackTwoLife
      + this.blueTwoLife
      + this.greenTwoLife
      + this.redTwoLife
      + this.whiteTwoLife
      + this.blackGreenTwoLife
      + this.blackRedTwoLife
      + this.blueBlackTwoLife
      + this.blueRedTwoLife
      + this.greenBlueTwoLife
      + this.greenWhiteTwoLife
      + this.redGreenTwoLife
      + this.redWhiteTwoLife
      + this.whiteBlackTwoLife
      + this.whiteBlueTwoLife
      + this.y
      + this.z
      + this.halfWhite
  }

  // Colors
  public black: number;
  public blue: number;
  public green: number;
  public red: number;
  public white: number;
  // Colorless
  public colorless: number;
  public generic: number;
  public snow: number;
  public x: number;
  // 2 colors
  public blackGreen: number;
  public blackRed: number;
  public blueBlack: number;
  public blueRed: number;
  public greenBlue: number;
  public greenWhite: number;
  public redGreen: number;
  public redWhite: number;
  public whiteBlack: number;
  public whiteBlue: number;
  // Color or 2 Life
  public blackTwoLife: number;
  public blueTwoLife: number;
  public greenTwoLife: number;
  public redTwoLife: number;
  public whiteTwoLife: number;
  // 2 Colors or 2 Life
  public blackGreenTwoLife: number;
  public blackRedTwoLife: number;
  public blueBlackTwoLife: number;
  public blueRedTwoLife: number;
  public greenBlueTwoLife: number;
  public greenWhiteTwoLife: number;
  public redGreenTwoLife: number;
  public redWhiteTwoLife: number;
  public whiteBlackTwoLife: number;
  public whiteBlueTwoLife: number;

  // Un Series
  public y: number;
  public z: number;
  public halfWhite: number;
}