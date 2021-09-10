export interface ScryfallCardList {
  object: string;
  total_cards: number;
  has_more: boolean;
  data: [ScryfallCard];
}

interface ScryfallCard {
  object: string;
  id?: string;
  oracle_id?: string;
  multiverse_ids?: Array<number>;
  mtgo_id?: number;
  tcgplayer_id?: number;
  cardmarket_id?: number;
  name?: string;
  lang?: string;
  released_at?: string;
  uri?: string;
  scryfall_uri?: string;
  layout?: string;
  highres_image?: boolean;
  image_uris?: {
    small?: string;
    normal?: string;
    large?: string;
    png?: string;
    art_crop?: string;
    border_crop?: string;
  };
  mana_cost?: string;
  cmc?: number;
  type_line?: string;
  oracle_text?: string;
  colors?: Array<string>;
  color_identity?: Array<string>;
  keywords?: Array<string>;
  card_faces: Array<{
    image_uris?: {
      small?: string;
      normal?: string;
      large?: string;
      png?: string;
      art_crop?: string;
      border_crop?: string;
    };
  }>;
  legalities?: {
    standard?: string;
    future?: string;
    historic?: string;
    pioneer?: string;
    modern?: string;
    legacy?: string;
    pauper?: string;
    vintage?: string;
    penny?: string;
    commander?: string;
    brawl?: string;
    duel?: string;
    oldschool?: string;
  };
  games?: Array<string>;
  reserved?: boolean;
  foil?: boolean;
  nonfoil?: boolean;
  oversized?: boolean;
  promo?: boolean;
  reprint?: boolean;
  variation?: boolean;
  set?: string;
  set_name?: string;
  set_type?: string;
  set_uri?: string;
  set_search_uri?: string;
  scryfall_set_uri?: string;
  rulings_uri?: string;
  prints_search_uri?: string;
  collector_number?: string;
  digital?: boolean;
  rarity?: string;
  card_back_id?: string;
  artist?: string;
  artist_ids?: Array<string>;
  illustration_id?: string;
  border_color?: string;
  frame?: string;
  full_art?: boolean;
  textless?: boolean;
  booster?: boolean;
  story_spotlight?: boolean;
  edhrec_rank?: number;
  preview?: {
    source?: string;
    source_uri?: string;
    previewed_at?: string;
  };
  prices?: {
    usd?: string;
    usd_foil?: string;
    eur?: string;
    eur_foil?: string;
    tix?: string;
  };
  related_uris?: {
    gatherer?: string;
    tcgplayer_decks?: string;
    edhrec?: string;
    mtgtop8?: string;
  };
  purchase_uris?: {
    tcgplayer?: string;
    cardmarket?: string;
    cardhoarder?: string;
  };
}
