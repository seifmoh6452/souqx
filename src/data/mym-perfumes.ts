const wa = '+201001234567'

const img = (id: string) => [
  `https://fimgs.net/mdimg/perfume/375x500.${id}.jpg`,
]

const fallback = [
  'https://images.unsplash.com/photo-1541643600914-78b084683702?w=800&q=85&fit=crop',
  'https://images.unsplash.com/photo-1595535873420-a599195b3f4a?w=800&q=85&fit=crop',
  'https://images.unsplash.com/photo-1588514912908-dc7cfc7c81f4?w=800&q=85&fit=crop',
]

type Def = {
  name: string
  price: number
  highCopyPrice?: number
  masterBoxPrice?: number
  description: string
  imgId?: string
  trending?: boolean
  new?: boolean
  gender?: 'him' | 'her'
}

const defs: Def[] = [
  // Featured Men's
  { name: 'Armani Stronger With You Intensely', price: 4800, highCopyPrice: 900, masterBoxPrice: 1200, imgId: '52802', description: 'Vanilla, chestnut, and amber. Intense, warm, and irresistibly addictive.', trending: true, new: true },
  { name: 'Versace Eros', price: 4800, highCopyPrice: 900, masterBoxPrice: 1200, imgId: '16657', description: 'Mint, green apple, and tonka. Fresh, bold, and seductive.', trending: true, new: true },
  { name: 'JPG Le Male Elixir', price: 5200, highCopyPrice: 950, masterBoxPrice: 1200, imgId: '81642', description: 'Lavender, honey, and vanilla. The most intense Le Male ever created.', trending: true, new: true },
  { name: 'JPG Le Male Le Parfum', price: 5200, highCopyPrice: 950, masterBoxPrice: 1200, imgId: '61856', description: 'Lavender, vanilla, and oriental notes. Elegant, powerful, and refined.', trending: true, new: true },
  { name: 'Lattafa Asad', price: 900, imgId: '72821', description: 'Tobacco, oud, and amber. A bold, smoky scent that punches above its price.', trending: true, new: true },

  // Tom Ford
  { name: 'Tom Ford Black Orchid', price: 6200, highCopyPrice: 1200, masterBoxPrice: 1400, imgId: '1018', description: 'Dark, opulent, iconic. Black truffle, ylang ylang, and black orchid.', trending: true },
  { name: 'Tom Ford Noir Extreme', price: 6200, highCopyPrice: 1200, masterBoxPrice: 1400, imgId: '29675', description: 'Cardamom, rose, amber, and vanilla. Rich, sensual, and addictive.' },
  { name: 'Tom Ford Bitter Peach', price: 6200, highCopyPrice: 1200, masterBoxPrice: 1400, imgId: '62707', description: 'Peach, cognac, vanilla, and musk. Playfully sensual with a dark fruity edge.' },
  { name: 'Tom Ford Oud Wood', price: 6200, highCopyPrice: 1200, masterBoxPrice: 1400, imgId: '1826', description: 'Rare oud, sandalwood, and rosewood. A masterclass in modern oud.', trending: true },
  { name: 'Tom Ford Tobacco Vanille', price: 6200, highCopyPrice: 1200, masterBoxPrice: 1400, imgId: '1825', description: 'Warm tobacco, vanilla, and spices. One of the most beloved Private Blends.', trending: true },
  { name: 'Tom Ford Tobacco Oud', price: 6200, highCopyPrice: 1200, masterBoxPrice: 1400, imgId: '21402', description: 'Tobacco, oud, and dark woods. A bold Private Blend that commands respect.', new: true },

  // Dior
  { name: 'Dior Fahrenheit', price: 2800, highCopyPrice: 760, masterBoxPrice: 850, imgId: '228', description: 'Leather, violet, and woods. A cult classic since 1988.' },
  { name: 'Dior Homme Intense', price: 2500, highCopyPrice: 730, masterBoxPrice: 800, imgId: '13016', description: 'Deep iris, lavender, and leather. Sophisticated and dangerously attractive.', trending: true },
  { name: 'Gris Dior', price: 2800, highCopyPrice: 760, masterBoxPrice: 850, imgId: '48387', description: 'Elegant, powdery, and feminine. A timeless Maison Dior signature.' },
  { name: 'Dior Oud Ispahan', price: 2500, highCopyPrice: 730, masterBoxPrice: 800, imgId: '48384', description: 'Rose, oud, and sandalwood. A luxurious Maison Dior oriental masterpiece.', new: true },
  { name: 'Dior Tobacolor', price: 2500, highCopyPrice: 730, masterBoxPrice: 800, imgId: '65551', description: 'Warm tobacco, amber, and wood. A rich, intoxicating creation.', new: true },
  { name: 'Dior Sauvage EDP', price: 3600, highCopyPrice: 850, masterBoxPrice: 1000, imgId: '48100', description: 'Fresh bergamot, Ambroxan, and pepper. Bold, magnetic, unforgettable.', trending: true },
  { name: "Dior Bois d'Argent", price: 2800, highCopyPrice: 760, masterBoxPrice: 850, imgId: '1377', description: 'Iris, patchouli, and oud. A silvery wood that is quietly magnificent.' },

  // Chanel
  { name: 'Bleu de Chanel EDP', price: 3600, highCopyPrice: 850, masterBoxPrice: 1000, imgId: '25967', description: 'Sandalwood, amber, and cedar. Clean, sophisticated, and masculine.', trending: true },

  // YSL
  { name: 'YSL Y Eau de Parfum', price: 3600, highCopyPrice: 850, masterBoxPrice: 1000, imgId: '50757', description: 'Ginger, sage, juniper, and amberwood. Bold, modern, and confident.', trending: true },
  { name: 'YSL Tuxedo', price: 2500, highCopyPrice: 730, masterBoxPrice: 800, imgId: '32269', description: 'Smoky, leathery, and bold. Part of the exceptional La Collection.' },

  // Versace
  { name: 'Versace Eros Flame', price: 2800, highCopyPrice: 760, masterBoxPrice: 850, imgId: '52180', description: 'Black pepper, rosewood, and vanilla. The fiery, intense side of Eros.' },
  { name: 'Versace Eros EDP', price: 3600, highCopyPrice: 850, masterBoxPrice: 1000, imgId: '62762', description: 'Mint, apple, and vanilla. Intense, passionate, impossible to ignore.', trending: true },

  // Emporio Armani
  { name: 'Stronger With You', price: 3600, highCopyPrice: 850, masterBoxPrice: 1000, imgId: '45258', description: 'Sage, cardamom, chestnut, and vanilla. Warm, vibrant, and effortlessly sexy.', trending: true },
  { name: 'Stronger With You Sandalwood', price: 2800, highCopyPrice: 760, masterBoxPrice: 850, imgId: '102519', description: 'Green sandalwood, lavender, and tonka. Fresh yet warm, modern and elegant.' },
  { name: 'Stronger With You Tobacco', price: 2800, highCopyPrice: 760, masterBoxPrice: 850, imgId: '90333', description: 'Tobacco, sage, and vanilla. Sophisticated and bold with a smoky edge.', new: true },
  { name: 'Stronger With You Intensely', price: 3600, highCopyPrice: 850, masterBoxPrice: 1000, imgId: '52802', description: 'Darker, woodier, and even more magnetic than the original.' },
  { name: 'Stronger With You Absolutely', price: 3600, highCopyPrice: 850, masterBoxPrice: 1000, imgId: '64501', description: 'The Parfum concentration. The deepest, most intense Stronger With You.' },

  // Armani
  { name: 'Armani Code Parfum', price: 2800, highCopyPrice: 760, masterBoxPrice: 850, imgId: '75126', description: 'Apple, ambergris, tonka bean. The darkest, most seductive Code to date.' },

  // Givenchy
  { name: 'Givenchy Gentleman', price: 2500, highCopyPrice: 730, masterBoxPrice: 800, imgId: '46040', description: 'Iris, patchouli, and leather. A refined, modern gentleman in a bottle.' },
  { name: 'Givenchy Gentleman Society', price: 2500, highCopyPrice: 730, masterBoxPrice: 800, imgId: '78639', description: 'Cardamom, vetiver, narcissus, and palo santo. Smooth, classy, masculine.', new: true },

  // Carolina Herrera
  { name: '212 VIP Black', price: 2500, highCopyPrice: 730, masterBoxPrice: 800, imgId: '46093', description: 'Bourbon, cacao, and leather. The ultimate VIP night-out fragrance.', trending: true },
  { name: '212 Men', price: 2800, highCopyPrice: 760, masterBoxPrice: 850, imgId: '297', description: 'Metallic woods, juniper, and green tea. The cool, urban scent of NYC.' },
  { name: 'Carolina Herrera Burning Rose', price: 2800, highCopyPrice: 760, masterBoxPrice: 850, imgId: '31053', description: 'Rich rose, saffron, and oud. A bold, dramatic floral statement.', new: true },
  { name: 'Carolina Herrera Sandal Ruby', price: 2800, highCopyPrice: 760, masterBoxPrice: 850, imgId: '54971', description: 'Sandalwood, rose, and ruby-red accords. Warm, sensual, and luxurious.' },

  // Paco Rabanne
  { name: 'Paco Rabanne Invictus', price: 3600, highCopyPrice: 850, masterBoxPrice: 1000, imgId: '18471', description: 'Grapefruit, marine, and guaiac wood. Fresh, sporty, victorious.', trending: true },
  { name: 'Paco Rabanne Invictus Victory EDP', price: 3600, highCopyPrice: 850, masterBoxPrice: 1000, imgId: '65177', description: 'Deeper Invictus with tonka and vetiver. The ultimate trophy.' },

  // Jean Paul Gaultier
  { name: 'JPG Le Male', price: 3600, highCopyPrice: 850, masterBoxPrice: 1000, imgId: '430', description: 'Lavender, mint, and vanilla. Magnetic, warm, and absolutely irresistible.', trending: true },
  { name: 'JPG Le Male Le Parfum', price: 3600, highCopyPrice: 850, masterBoxPrice: 1000, imgId: '61856', description: 'The golden, most powerful Le Male. Lavender, vanilla, and tonka.', new: true },
  { name: 'JPG Le Male Elixir', price: 3600, highCopyPrice: 850, masterBoxPrice: 1000, imgId: '81642', description: 'The most intense Le Male. Deep lavender, vanilla, and amber.' },

  // Creed
  { name: 'Creed Aventus', price: 3600, highCopyPrice: 850, masterBoxPrice: 1000, imgId: '9828', description: 'Pineapple, birch, musk, and oakmoss. The most celebrated men\'s fragrance.', trending: true },
  { name: 'Creed Absolu Aventus', price: 2800, highCopyPrice: 760, masterBoxPrice: 850, imgId: '84112', description: 'A darker, deeper Aventus. More intense, more luxurious, more powerful.', new: true },
  { name: 'Creed Silver Mountain Water', price: 2500, highCopyPrice: 730, masterBoxPrice: 800, imgId: '472', description: 'Green tea, bergamot, mandarin, and musk. Fresh Alpine air in a bottle.' },

  // Parfums de Marly
  { name: 'Parfums de Marly Pegasus', price: 6200, highCopyPrice: 1200, masterBoxPrice: 1400, imgId: '16938', description: 'Heliotrope, sandalwood, and vanilla. Elegant, white, and effortlessly refined.' },
  { name: 'Parfums de Marly Herod', price: 6200, highCopyPrice: 1200, masterBoxPrice: 1400, imgId: '16939', description: 'Tobacco, pepper, vanilla, and patchouli. Rich, authoritative, and masculine.' },
  { name: 'Parfums de Marly Haltane', price: 6200, highCopyPrice: 1200, masterBoxPrice: 1400, imgId: '70776', description: 'Lavender, saffron, praline, and oud. A luxurious modern oud composition.', new: true },
  { name: 'Parfums de Marly Layton', price: 6200, highCopyPrice: 1200, masterBoxPrice: 1400, imgId: '39314', description: 'Apple, lavender, vanilla, and sandalwood. The king of compliments.', trending: true },

  // Nishane
  { name: 'Nishane Hacivat X', price: 2800, highCopyPrice: 760, masterBoxPrice: 850, imgId: '80462', description: 'The darker, more complex evolution of Hacivat. Deeper woods and richer texture.' },
  { name: 'Nishane Hacivat', price: 2500, highCopyPrice: 730, masterBoxPrice: 800, imgId: '44174', description: 'Pineapple, oakmoss, and cedarwood. A prestigious Turkish Extrait.', trending: true },
  { name: 'Nishane Ege', price: 2800, highCopyPrice: 760, masterBoxPrice: 850, imgId: '64092', description: 'Aegean Sea in a bottle. Aquatic, fresh, and luminous.' },

  // Lattafa
  { name: "Lattafa Bade'e Al Oud", price: 900, imgId: '64948', description: 'Rich oud, rose, and sandalwood oriental. Stunning Arabic luxury.', trending: true },
  { name: "Lattafa Bade'e Al Oud for Glory", price: 900, imgId: '64948', description: 'The dark black edition. Deeper oud, leather, and intense amber.' },
  { name: 'Khamrah Dukhan', price: 900, imgId: '104529', description: 'Smoky oud, amber, and chilli. A fiery, mysterious oriental.', trending: true },
  { name: 'Lattafa Asad Bourbon', price: 900, imgId: '101124', description: 'Wood, bourbon, and leather. Bold Arabic craftsmanship meets Western style.' },
  { name: 'Lattafa Ajwad', price: 900, imgId: '75099', description: 'Fruity, floral, and woody. A radiant Arabic fragrance with real presence.' },
  { name: 'Lattafa The Kingdom', price: 900, imgId: '97995', description: 'Apple, lavender, and vanilla. A regal, crowd-pleasing oriental scent.', new: true },
  { name: 'Lattafa Al Nashama', price: 900, imgId: '89762', description: 'Warm spices, oud, and amber. A confident everyday Arabic fragrance.' },
  { name: 'Qullo Musamam', price: 900, imgId: '84720', description: 'Oud, saffron, and warm spices. A sumptuous, royal oriental fragrance.', new: true },
  { name: 'Qullo Musamam White Intense', price: 900, imgId: '85087', description: 'White florals, musk, and soft woods. Clean, intense, and elegant.', new: true },
  { name: 'Lattafa Oud of Dreams', price: 900, imgId: '77086', description: 'Dreamy oud, vanilla, and amber. Smooth, warm, and long-lasting.' },

  // Rasasi
  { name: 'Rasasi Hawas For Him', price: 1900, imgId: '46890', description: 'Black pepper, marine, and sandalwood. Fresh, sophisticated, all-day wear.', trending: true },
  { name: 'Rasasi Hawas Ice', price: 1900, imgId: '89050', description: 'Aquatic and cool with crisp citrus and mint. The icy-fresh Hawas.' },
  { name: 'Rasasi Hawas Black', price: 2100, imgId: '96817', description: 'Dark, intense, and smoky. Rich woods and leather.', new: true },
  { name: 'Rasasi Hawas Fire', price: 2100, imgId: '101665', description: 'Warm, spicy, and intense. Chilli, amber, and oud. A fiery red edition.' },

  // Ibraheem Al Qurashi
  { name: 'Ibraheem Dominican Tobacco', price: 1200, imgId: '85718', description: 'Rich tobacco, spices, and warm woods. Exotic tobacco with impressive longevity.' },
  { name: 'Ibraheem Mexican Tobacco', price: 1200, imgId: '100563', description: 'Smoky tobacco with chilli and earthy wood. Bold and conversation-starting.' },
  { name: 'Ibraheem Cuban Tobacco', price: 1200, imgId: '132201', description: 'Classic Cuban cigar tobacco with cedar and amber. Smooth and timeless.' },
  { name: 'Ibraheem Spanish Tobacco', price: 1200, imgId: '100551', description: 'Aromatic tobacco with citrus and warm spice. A Mediterranean journey.', new: true },

  // Xerjoff
  { name: 'Xerjoff 40 Knots', price: 3600, highCopyPrice: 850, masterBoxPrice: 1000, imgId: '16445', description: 'Sea breeze, salty musk, and driftwood. Nautical luxury from Italy.' },
  { name: 'Xerjoff Torino 21', price: 2800, highCopyPrice: 760, masterBoxPrice: 850, imgId: '70424', description: 'Deep blue oriental with amber, incense, and precious woods.', new: true },
  { name: 'Xerjoff Alexandria II', price: 2800, highCopyPrice: 760, masterBoxPrice: 850, imgId: '17786', description: 'Lavender, rose, cinnamon, and oud. Opulent Italian luxury at its peak.' },

  // Kilian
  { name: "Kilian Angels' Share", price: 3600, highCopyPrice: 850, masterBoxPrice: 1000, imgId: '62615', description: 'Cognac, oak, vanilla, and cinnamon. A warm, luxurious dessert fragrance.', trending: true },

  // Nasomatto
  { name: 'Nasomatto Black Afgano', price: 3600, highCopyPrice: 850, masterBoxPrice: 1000, imgId: '6472', description: 'Dark hash, oud, and smoky woods. Controversial, powerful, and captivating.' },

  // Louis Vuitton
  { name: 'Louis Vuitton Ombre Nomade', price: 7200, highCopyPrice: 1000, masterBoxPrice: 1200, imgId: '49755', description: 'Oud, rose, and labdanum. An extraordinary oriental luxury journey.', new: true },
  { name: 'Louis Vuitton Imagination', price: 7200, highCopyPrice: 1000, masterBoxPrice: 1200, imgId: '67370', description: 'Bergamot, cedarwood, and musk. Bright, clean, and effortlessly luxurious.' },
  { name: 'Louis Vuitton Symphony', price: 7200, highCopyPrice: 1000, masterBoxPrice: 1200, imgId: '68357', description: 'Ginger, grapefruit, and black tea. Vibrant, fresh, and refined.', new: true },

  // Viktor & Rolf
  { name: 'Viktor & Rolf Spicebomb Extreme', price: 3600, highCopyPrice: 850, masterBoxPrice: 1000, imgId: '30499', description: 'Tobacco, vanilla, and intense spices. Warm, rich, dominant.', trending: true },

  // Valentino
  { name: 'Valentino Uomo Born In Roma', price: 3600, highCopyPrice: 850, masterBoxPrice: 1000, imgId: '55963', description: 'Dark, magnetic leather and vanilla. Italian boldness in a pyramid bottle.' },

  // Bvlgari
  { name: 'Bvlgari Man In Black', price: 3600, highCopyPrice: 850, masterBoxPrice: 1000, imgId: '26358', description: 'Tuberose, rum, leather, and tobacco. Dark, powerful, and sophisticated.' },

  // Lacoste
  { name: 'Lacoste L.12.12 Blanc', price: 2800, highCopyPrice: 760, masterBoxPrice: 850, imgId: '11043', description: 'Grapefruit, rosemary, and white musk. Clean, fresh, and effortlessly sporty.', new: true },

  // Armaf
  { name: 'Armaf Club de Nuit Intense Man', price: 2500, highCopyPrice: 730, masterBoxPrice: 800, imgId: '34696', description: 'A bold woody fragrance reminiscent of the greats. Exceptional value.', trending: true },

  // Afnan
  { name: 'Afnan 9pm', price: 2800, highCopyPrice: 760, masterBoxPrice: 850, imgId: '65414', description: 'Dark oriental with fruits, musk, and amber. Great performance, incredible price.', trending: true },
  { name: 'Afnan 9pm Rebel', price: 2800, highCopyPrice: 760, masterBoxPrice: 850, imgId: '99238', description: 'Bolder and spicier. Ruby bottle, chilli pepper, and dark woods.' },
  { name: 'Afnan Wild Colt', price: 2500, highCopyPrice: 730, masterBoxPrice: 800, imgId: '75834', description: 'Leather, spices, and warm amber. Untamed, bold, and masculine.', new: true },

  // Dolce & Gabbana
  { name: 'Dolce & Gabbana The One', price: 2800, highCopyPrice: 760, masterBoxPrice: 850, imgId: '2056', description: 'Tobacco, ginger, and amber. Warm, woody, and seductive.' },

  // Hug Scent
  { name: 'Hug Scent Acacia', price: 2500, highCopyPrice: 730, masterBoxPrice: 800, imgId: '78624', description: 'Soft florals, acacia honey, and warm musk. Gentle, cozy, and inviting.', new: true },

  // Orto Parisi
  { name: 'Orto Parisi Megamare', price: 2500, highCopyPrice: 730, masterBoxPrice: 800, imgId: '53471', description: 'Deep sea, mineral, and skin musk. Raw, powerful, unlike anything else.' },

  // === FOR HER ===

  // Jean Paul Gaultier
  { name: 'JPG Scandal', price: 5200, highCopyPrice: 950, masterBoxPrice: 1200, imgId: '45651', description: 'Honey, gardenia, and orange blossom. Sexy, bold, and unforgettable.', gender: 'her' },
  { name: 'JPG La Belle', price: 5200, highCopyPrice: 950, masterBoxPrice: 1200, imgId: '55786', description: 'Pear, vetiver, and tonka bean. Sensual, glamorous, and captivating.', gender: 'her' },
  { name: 'JPG La Belle Le Parfum', price: 5200, highCopyPrice: 950, masterBoxPrice: 1200, imgId: '65175', description: 'The most intense La Belle. Rich, deep, and powerfully seductive.', gender: 'her' },

  // Carolina Herrera
  { name: 'Carolina Herrera Good Girl', price: 5200, highCopyPrice: 950, masterBoxPrice: 1200, imgId: '39681', description: 'Almond, coffee, jasmine, and tonka. The iconic stiletto bottle.', gender: 'her' },
  { name: 'Carolina Herrera Very Good Girl', price: 4800, highCopyPrice: 900, masterBoxPrice: 1200, imgId: '65560', description: 'Redcurrant, cherry, and vanilla. Bolder, fruitier, and more playful.', gender: 'her' },

  // Emporio Armani
  { name: 'Armani In Love With You', price: 5200, highCopyPrice: 950, masterBoxPrice: 1200, imgId: '52801', description: 'Cherry, raspberry, and white musk. Passionate and deeply romantic.', gender: 'her' },
  { name: 'Armani Because It\'s You', price: 5200, highCopyPrice: 950, masterBoxPrice: 1200, imgId: '45257', description: 'Raspberry, neroli, and vanilla. Fresh, sweet, and irresistibly charming.', gender: 'her' },

  // Valentino
  { name: 'Valentino Donna Born In Roma', price: 5200, highCopyPrice: 950, masterBoxPrice: 1200, imgId: '55805', description: 'Jasmine, bourbon vanilla, and woody notes. Bold Italian femininity.', gender: 'her' },

  // Paco Rabanne
  { name: 'Paco Rabanne Lady Million', price: 4800, highCopyPrice: 900, masterBoxPrice: 1200, imgId: '9045', description: 'Neroli, jasmine, and patchouli. Dazzling, golden, and confident.', gender: 'her' },
  { name: 'Paco Rabanne Fame', price: 4800, highCopyPrice: 900, masterBoxPrice: 1200, imgId: '74962', description: 'Mango, jasmine, and incense. Modern, electric, and unforgettable.', gender: 'her' },

  // YSL
  { name: 'YSL Libre', price: 5200, highCopyPrice: 950, masterBoxPrice: 1200, imgId: '56077', description: 'Lavender, orange blossom, and musk. Free, bold, and elegant.', gender: 'her' },
  { name: 'YSL Black Opium', price: 5200, highCopyPrice: 950, masterBoxPrice: 1200, imgId: '25324', description: 'Coffee, vanilla, and white flowers. Addictive, dark, and magnetic.', gender: 'her' },

  // Victoria's Secret
  { name: 'Victoria\'s Secret Very Sexy', price: 6800, highCopyPrice: 950, masterBoxPrice: 1050, imgId: '1725', description: 'Orchid, vanilla, and sandalwood. Seductive, warm, and intoxicating.', gender: 'her' },

  // Mugler
  { name: 'Thierry Mugler Alien', price: 4700, highCopyPrice: 900, masterBoxPrice: 1050, imgId: '707', description: 'Jasmine sambac, cashmeran, and amber. Mysterious, radiant, and powerful.', gender: 'her' },

  // Elie Saab
  { name: 'Elie Saab Girl of Now', price: 4700, highCopyPrice: 900, masterBoxPrice: 1050, imgId: '45686', description: 'Pistachio, orange blossom, and almond. Warm, nutty, and feminine.', gender: 'her' },

  // Tom Ford
  { name: 'Tom Ford Lost Cherry', price: 6800, highCopyPrice: 950, masterBoxPrice: 1050, imgId: '51411', description: 'Black cherry, tonka, and almond. Rich, dark, and intoxicating.', gender: 'her' },

  // Versace
  { name: 'Versace Crystal Noir', price: 5200, highCopyPrice: 950, masterBoxPrice: 1200, imgId: '631', description: 'Ginger, gardenia, and amber. Dark, mysterious, and seductive.', gender: 'her' },
  { name: 'Versace Bright Crystal', price: 5200, highCopyPrice: 950, masterBoxPrice: 1200, imgId: '632', description: 'Pomegranate, peony, and musk. Fresh, sparkling, and elegant.', gender: 'her' },

  // Burberry
  { name: 'Burberry Her', price: 4800, highCopyPrice: 900, masterBoxPrice: 1200, imgId: '51694', description: 'Strawberry, violet, and musk. Modern British femininity.', gender: 'her' },

  // Giorgio Armani
  { name: 'Armani Sì Passione', price: 4800, highCopyPrice: 900, masterBoxPrice: 1200, imgId: '48002', description: 'Raspberry, rose, and vanilla. Passionate, bold, and feminine.', gender: 'her' },

  // Parfums de Marly
  { name: 'Parfums de Marly Delina', price: 6800, highCopyPrice: 950, masterBoxPrice: 1050, imgId: '43871', description: 'Turkish rose, lychee, and musk. The most coveted feminine niche fragrance.', gender: 'her' },

  // Dior
  { name: 'Dior Joy', price: 5200, highCopyPrice: 950, masterBoxPrice: 1200, imgId: '51285', description: 'Citrus, jasmine, and rose. Radiant, joyful, and effortlessly chic.', gender: 'her' },

  // Kayali
  { name: 'Kayali Lovefest', price: 5200, highCopyPrice: 950, masterBoxPrice: 1200, imgId: '75661', description: 'Burning sage, praline, and amber. Warm, passionate, and addictive.', gender: 'her' },
  { name: 'Kayali Yum Pistachio Gelato 33', price: 4700, highCopyPrice: 900, masterBoxPrice: 1050, imgId: '79846', description: 'Pistachio, vanilla, and caramel. Creamy, sweet, and delicious.', gender: 'her' },
  { name: 'Kayali Yum Boujee Marshmallow 81', price: 4700, highCopyPrice: 900, masterBoxPrice: 1050, imgId: '99254', description: 'Marshmallow, vanilla, and musk. Soft, sweet, and dreamy.', gender: 'her' },

  // Billie Eilish
  { name: 'Billie Eilish No. 1', price: 5200, highCopyPrice: 950, masterBoxPrice: 1200, imgId: '70052', description: 'Vanilla, cocoa, and musk. Warm, cozy, and effortlessly cool.', gender: 'her' },
  { name: 'Billie Eilish No. 2', price: 5200, highCopyPrice: 950, masterBoxPrice: 1200, imgId: '76532', description: 'White peach, lavender, and musk. Fresh, soft, and ethereal.', gender: 'her' },

  // Viktor & Rolf
  { name: 'Viktor & Rolf Bonbon', price: 4800, highCopyPrice: 900, masterBoxPrice: 1200, imgId: '23317', description: 'Peach, orange, and caramel. Sweet, playful, and elegant.', gender: 'her' },

  // Mancera
  { name: 'Mancera Coco Vanille', price: 4800, highCopyPrice: 900, masterBoxPrice: 1200, imgId: '42782', description: 'Coconut, vanilla, and tropical flowers. Creamy, exotic, and long-lasting.', gender: 'her' },

  // Lattafa
  { name: 'Lattafa Yara', price: 900, imgId: '76880', description: 'Tropical fruits, vanilla, and musk. Sweet, playful, and affordable luxury.', gender: 'her' },
]

export const mymPerfumes = defs.map((d, i) => ({
  id: `mym-${String(i + 1).padStart(3, '0')}`,
  brandId: '1',
  brandName: 'MYM',
  brandSlug: 'mym',
  name: d.name,
  price: d.price,
  highCopyPrice: d.highCopyPrice,
  masterBoxPrice: d.masterBoxPrice,
  currency: 'EGP',
  category: 'Perfumes',
  images: d.imgId ? img(d.imgId) : fallback,
  description: d.description,
  inStock: true,
  trending: d.trending,
  new: d.new,
  whatsappNumber: wa,
  gender: d.gender || 'him',
}))

export const getMymPerfumesByGender = (gender: 'him' | 'her') =>
  mymPerfumes.filter(p => p.gender === gender)
