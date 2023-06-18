/* eslint-disable @typescript-eslint/no-unused-vars */

import ManaCost from "./classes/ManaCost"

declare global {
  interface String {
    toSql(): string;
  }
}

namespace NodeJS {
  interface ProcessEnv {
    FULL_DATABASE: string
    DECK_DATABASE: string
    CARD_DATABASE: string
    FIREBASE_CONF: Record
  }
}

type legalitiesTypes = 'not_legal' | 'legal' | 'restricted'

declare interface legalities {
  standard: legalitiesTypes
  future: legalitiesTypes
  historic: legalitiesTypes
  gladiator: legalitiesTypes
  pioneer: legalitiesTypes
  explorer: legalitiesTypes
  modern: legalitiesTypes
  legacy: legalitiesTypes
  pauper: legalitiesTypes
  vintage: legalitiesTypes
  penny: legalitiesTypes
  commander: legalitiesTypes
  oathbreaker: legalitiesTypes
  brawl: legalitiesTypes
  historicbrawl: legalitiesTypes
  alchemy: legalitiesTypes
  paupercommander: legalitiesTypes
  duel: legalitiesTypes
  oldschool: legalitiesTypes
  premodern: legalitiesTypes
  predh: legalitiesTypes
}

declare interface cardFileObj {
  arena_id?: number
  artist_ids?: string[]
  artist?: string
  attraction_lights?: number[]
  booster?: boolean
  border_color?: string
  card_back_id?: string
  cardmarket_id?: number
  cmc?: number
  collector_number?: string
  color_identity?: string[]
  color_indicator?: string[]
  colors?: string[]
  content_warning?: boolean
  digital?: boolean
  edhrec_rank?: number
  finishes?: string[]
  flavor_name?: string
  flavor_text?: string
  foil?: boolean
  frame_effects?: string[]
  frame?: string
  full_art?: boolean
  games: string[]
  hand_modifier?: string
  highres_image?: boolean
  id?: string
  illustration_id?: string
  image_status?: string
  keywords?: string[]
  lang?: string
  layout?: string
  life_modifier?: string
  loyalty?: string
  mana_cost?: string
  mtgo_foil_id?: number
  mtgo_id?: number
  multiverse_ids?: number[]
  name: string
  nonfoil?: boolean
  object?: string
  oracle_id?: string
  oracle_text?: string
  oversized?: boolean
  penny_rank?: number
  power?: string
  printed_name?: string
  printed_text?: string
  printed_type_line?: string
  prints_search_uri?: string
  produced_mana?: string[]
  promo_types?: string[]
  promo?: boolean
  rarity?: string
  released_at?: string
  reprint?: boolean
  reserved?: boolean
  rulings_uri?: string
  scryfall_set_uri?: string
  scryfall_uri?: string
  security_stamp?: string
  set_id?: string
  set_name?: string
  set_search_uri?: string
  set_type?: string
  set_uri?: string
  set?: string
  story_spotlight?: boolean
  tcgplayer_etched_id?: number
  tcgplayer_id?: number
  textless?: boolean
  toughness?: string
  type_line?: string
  uri?: string
  variation_of?: string
  variation?: boolean
  watermark?: string
  image_uris?: {
    art_crop?: string
    border_crop?: string
    large?: string
    normal?: string
    png?: string
    small?: string
  }
  legalities?: {
    alchemy?: string
    brawl?: string
    commander?: string
    duel?: string
    explorer?: string
    future?: string
    gladiator?: string
    historic?: string
    historicbrawl?: string
    legacy?: string
    modern?: string
    oathbreaker?: string
    oldschool?: string
    pauper?: string
    paupercommander?: string
    penny?: string
    pioneer?: string
    predh?: string
    premodern?: string
    standard?: string
    vintage?: string
  }
  prices?: {
    usd?: string
  }
  related_uris?: {
    edhrec?: string
    tcgplayer_infinite_articles?: string
    tcgplayer_infinite_decks?: string
  }
  all_parts?: {
    component?: string
    id?: string
    name?: string
    object?: string
    type_line?: string
    uri?: string
  }
  preview?: {
    previewed_at?: string
    source_uri?: string
    source?: string
  }
  card_faces?: {
    flavor_name?: string
    mana_cost?: string
    name?: string
    object?: string
    oracle_text?: string
    type_line?: string
    image_uris?: {
      art_crop?: string
      border_crop?: string
      large?: string
      normal?: string
      png?: string
      small?: string
    }
  }
}

interface face {
  name: string
  toughness: number
  power: number
  types: string[]
  manaCost: ManaCost
}