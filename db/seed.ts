import 'dotenv/config'
import { db } from './index'
import { users, schools, badges, challenges, seasons, posts } from './schema'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'
const { hashSync } = bcrypt

const nepaliSchools = [
  { name: 'Adarsh Vidya Mandir Higher Secondary School', code: 'AVM001', city: 'Kathmandu' },
  { name: 'Apex Academy Higher Secondary School', code: 'AA001', city: 'Kathmandu' },
  { name: 'Arniko Higher Secondary School', code: 'AHS001', city: 'Kathmandu' },
  { name: 'Banasthali English School', code: 'BES001', city: 'Kathmandu' },
  { name: 'Balmiki Vidyalaya', code: 'BV001', city: 'Kathmandu' },
  { name: 'Bhanubhakta Memorial Higher Secondary School', code: 'BMH001', city: 'Kathmandu' },
  { name: 'Bhaktapur English School', code: 'BES002', city: 'Bhaktapur' },
  { name: 'Brihaspati Higher Secondary School', code: 'BHS001', city: 'Kathmandu' },
  { name: 'Budhanilkantha School', code: 'BNS001', city: 'Kathmandu' },
  { name: 'Capital Higher Secondary School', code: 'CHS001', city: 'Kathmandu' },
  { name: 'Chelsea International Academy', code: 'CIA001', city: 'Kathmandu' },
  { name: 'Cosmos International College', code: 'CIC001', city: 'Kathmandu' },
  { name: 'D.A.V. Higher Secondary School', code: 'DAV001', city: 'Kathmandu' },
  { name: 'Dhaulagiri Higher Secondary School', code: 'DHS001', city: 'Baglung' },
  { name: 'Don Bosco Higher Secondary School', code: 'DBH001', city: 'Kathmandu' },
  { name: 'Edinburgh International College', code: 'EIC001', city: 'Kathmandu' },
  { name: 'Everest English School', code: 'EES001', city: 'Kathmandu' },
  { name: 'Galaxy Public School', code: 'GPS001', city: 'Kathmandu' },
  { name: 'Gandaki Boarding School', code: 'GBS001', city: 'Pokhara' },
  { name: 'Gauri Shankar Higher Secondary School', code: 'GSH001', city: 'Kathmandu' },
  { name: 'Global College of Management', code: 'GCM001', city: 'Kathmandu' },
  { name: 'GoldenGate International College', code: 'GIC001', city: 'Kathmandu' },
  { name: 'Gorkha Higher Secondary School', code: 'GHS001', city: 'Gorkha' },
  { name: 'Greenland Higher Secondary School', code: 'GHS002', city: 'Kathmandu' },
  { name: 'Happy Home Higher Secondary School', code: 'HHH001', city: 'Kathmandu' },
  { name: 'Himalayan Higher Secondary School', code: 'HHS001', city: 'Kathmandu' },
  { name: 'Holy Garden Higher Secondary School', code: 'HGH001', city: 'Kathmandu' },
  { name: 'Ideal Model School', code: 'IMS001', city: 'Kathmandu' },
  { name: 'Indreni English Boarding School', code: 'IEB001', city: 'Kathmandu' },
  { name: 'Jana Jyoti Higher Secondary School', code: 'JJH001', city: 'Lalitpur' },
  { name: 'Janata Higher Secondary School', code: 'JHS001', city: 'Jhapa' },
  { name: 'Kalika Higher Secondary School', code: 'KHS001', city: 'Chitwan' },
  { name: 'Kantipur Higher Secondary School', code: 'KHS002', city: 'Kathmandu' },
  { name: 'Kathmandu BernHardt Higher Secondary School', code: 'KBH001', city: 'Kathmandu' },
  { name: 'Kathmandu Model College', code: 'KMC001', city: 'Kathmandu' },
  { name: 'Kathmandu University High School', code: 'KUH001', city: 'Lalitpur' },
  { name: 'Khwopa Higher Secondary School', code: 'KHS003', city: 'Bhaktapur' },
  { name: 'Kirtipur Higher Secondary School', code: 'KHS004', city: 'Kathmandu' },
  { name: 'Koshi Higher Secondary School', code: 'KHS005', city: 'Biratnagar' },
  { name: 'Laboratory Higher Secondary School', code: 'LHS001', city: 'Kathmandu' },
  { name: 'Lakeside Higher Secondary School', code: 'LHS002', city: 'Pokhara' },
  { name: 'Lalitpur Higher Secondary School', code: 'LHS003', city: 'Lalitpur' },
  { name: 'Little Angel\'s School', code: 'LAS001', city: 'Kathmandu' },
  { name: 'Little Buddha Academy', code: 'LBA001', city: 'Kathmandu' },
  { name: 'Little Flower Higher Secondary School', code: 'LFH001', city: 'Kathmandu' },
  { name: 'Liverpool International College', code: 'LIC001', city: 'Kathmandu' },
  { name: 'Lumbini Higher Secondary School', code: 'LHS004', city: 'Butwal' },
  { name: 'Mahendra Bhrikuti Higher Secondary School', code: 'MBH001', city: 'Kathmandu' },
  { name: 'Mahendra Higher Secondary School', code: 'MHS001', city: 'Dhangadhi' },
  { name: 'Manakamana Higher Secondary School', code: 'MHS002', city: 'Gorkha' },
  { name: 'Manav Sewa Higher Secondary School', code: 'MSH001', city: 'Kathmandu' },
  { name: 'Marigold Higher Secondary School', code: 'MHS003', city: 'Kathmandu' },
  { name: 'Megamind Academy', code: 'MMA001', city: 'Kathmandu' },
  { name: 'Meridian International School', code: 'MIS001', city: 'Kathmandu' },
  { name: 'Milan Higher Secondary School', code: 'MHS004', city: 'Kaski' },
  { name: 'Model Higher Secondary School', code: 'MHS005', city: 'Kathmandu' },
  { name: 'Modern Indian School', code: 'MIS002', city: 'Kathmandu' },
  { name: 'Mountain Everest School', code: 'MES001', city: 'Kathmandu' },
  { name: 'Mount View Higher Secondary School', code: 'MVH001', city: 'Kathmandu' },
  { name: 'Nabin Higher Secondary School', code: 'NHS001', city: 'Chitwan' },
  { name: 'Nava Jyoti Higher Secondary School', code: 'NJH001', city: 'Kathmandu' },
  { name: 'Nepal Adarsha Higher Secondary School', code: 'NAH001', city: 'Kathmandu' },
  { name: 'Nepal Police School', code: 'NPS001', city: 'Kathmandu' },
  { name: 'Nilkantha Higher Secondary School', code: 'NHS002', city: 'Kathmandu' },
  { name: 'Nobel Academy', code: 'NA001', city: 'Kathmandu' },
  { name: 'Orchid International College', code: 'OIC001', city: 'Kathmandu' },
  { name: 'Padma Kanya Higher Secondary School', code: 'PKH001', city: 'Kathmandu' },
  { name: 'Paragon Public School', code: 'PPS001', city: 'Kathmandu' },
  { name: 'Pascales Higher Secondary School', code: 'PHS001', city: 'Bhaktapur' },
  { name: 'People\'s Higher Secondary School', code: 'PHS002', city: 'Kathmandu' },
  { name: 'Pinnacle College', code: 'PC001', city: 'Kathmandu' },
  { name: 'Pokhara Higher Secondary School', code: 'PHS003', city: 'Pokhara' },
  { name: 'Prabhat Higher Secondary School', code: 'PHS004', city: 'Jhapa' },
  { name: 'Pragati Higher Secondary School', code: 'PHS005', city: 'Lalitpur' },
  { name: 'Pragya Kunja Higher Secondary School', code: 'PKH002', city: 'Kathmandu' },
  { name: 'Prerana Higher Secondary School', code: 'PHS006', city: 'Kathmandu' },
  { name: 'Prime College', code: 'PC002', city: 'Kathmandu' },
  { name: 'Pulchowk Higher Secondary School', code: 'PHS007', city: 'Lalitpur' },
  { name: 'Rastriya Higher Secondary School', code: 'RHS001', city: 'Kathmandu' },
  { name: 'Rato Bangala School', code: 'RBS001', city: 'Kathmandu' },
  { name: 'Reliance International Academy', code: 'RIA001', city: 'Kathmandu' },
  { name: 'S.O.S. Higher Secondary School', code: 'SOS001', city: 'Kathmandu' },
  { name: 'Sainik Awasiya Mahavidyalaya', code: 'SAM001', city: 'Bhakapur' },
  { name: 'Sainik Higher Secondary School', code: 'SHS001', city: 'Kathmandu' },
  { name: 'Saints Higher Secondary School', code: 'SHS002', city: 'Kathmandu' },
  { name: 'Samata Shiksha Niketan', code: 'SSN001', city: 'Lalitpur' },
  { name: 'Sangam Higher Secondary School', code: 'SHS003', city: 'Pokhara' },
  { name: 'Sano Thimi English School', code: 'STE001', city: 'Bhaktapur' },
  { name: 'Saraswati Higher Secondary School', code: 'SHS004', city: 'Kathmandu' },
  { name: 'Shankardev Higher Secondary School', code: 'SHS005', city: 'Kathmandu' },
  { name: 'Shree Higher Secondary School', code: 'SHS006', city: 'Dhangadhi' },
  { name: 'Shuvatara School', code: 'SS001', city: 'Kathmandu' },
  { name: 'Siddhartha Higher Secondary School', code: 'SHS007', city: 'Butwal' },
  { name: 'Siddhartha Vanasthali Institute', code: 'SVI001', city: 'Kathmandu' },
  { name: 'South Point School', code: 'SPS001', city: 'Kathmandu' },
  { name: 'St. Joseph\'s Higher Secondary School', code: 'SJH001', city: 'Kathmandu' },
  { name: 'St. Mary\'s Higher Secondary School', code: 'SMH001', city: 'Kathmandu' },
  { name: 'St. Xavier\'s School', code: 'SXS001', city: 'Kathmandu' },
  { name: 'Sunrise Higher Secondary School', code: 'SHS008', city: 'Biratnagar' },
  { name: 'Sworgadwari Higher Secondary School', code: 'SHS009', city: 'Pyuthan' },
  { name: 'Texas International College', code: 'TIC001', city: 'Kathmandu' },
  { name: 'The Chandbagh School', code: 'TCS001', city: 'Kathmandu' },
  { name: 'The Lawrence School', code: 'TLS001', city: 'Kathmandu' },
  { name: 'The Times International College', code: 'TIC002', city: 'Kathmandu' },
  { name: 'Triyog Higher Secondary School', code: 'THS001', city: 'Kathmandu' },
  { name: 'United Academy', code: 'UA001', city: 'Kathmandu' },
  { name: 'Uttam Higher Secondary School', code: 'UHS001', city: 'Kathmandu' },
  { name: 'Valley View English School', code: 'VVE001', city: 'Kathmandu' },
  { name: 'Viswa Niketan Higher Secondary School', code: 'VNH001', city: 'Kathmandu' },
  { name: 'White House Higher Secondary School', code: 'WHH001', city: 'Kathmandu' },
  { name: 'Wisdom Higher Secondary School', code: 'WHS001', city: 'Kathmandu' },
  { name: 'Xavier International College', code: 'XIC001', city: 'Kathmandu' },
  { name: 'Yugal Kishor Higher Secondary School', code: 'YKH001', city: 'Kathmandu' },
]

async function seed() {
  console.log('Seeding database...')

  // Clean up existing posts and students for fresh re-seed
  await db.delete(posts)
  const existingStudents = await db.select({ id: users.id }).from(users).where(eq(users.role, 'STUDENT'))
  if (existingStudents.length > 0) {
    for (const s of existingStudents) {
      await db.delete(users).where(eq(users.id, s.id))
    }
  }

  // Schools (upsert by code)
  for (const s of nepaliSchools) {
    await db.insert(schools).values(s).onDuplicateKeyUpdate({ set: { name: s.name, city: s.city } })
  }
  console.log(`Inserted ${nepaliSchools.length} schools`)

  const allSchools = await db.select().from(schools)
  const schoolMap = new Map(allSchools.map(s => [s.code, s.id]))

  // Super Admin
  const superAdminHash = hashSync('T9f&3!Xp@Lr6^wQz', 10)
  await db.insert(users).values({
    username: 'superadmin',
    email: 'superadmin@digiclub.com',
    passwordHash: superAdminHash,
    fullName: 'Super Admin',
    role: 'SUPER_ADMIN',
    points: 9999,
    rank: 'APEX',
  }).onDuplicateKeyUpdate({ set: { username: 'superadmin' } })

  // Admins (one per first few schools)
  const adminHash = hashSync('admin123', 10)
  const adminSchoolCodes = ['AVM001', 'BES001', 'BV001', 'BNS001', 'DAV001']
  for (const code of adminSchoolCodes) {
    const schoolId = schoolMap.get(code)
    if (!schoolId) continue
    const school = nepaliSchools.find(s => s.code === code)!
    await db.insert(users).values({
      username: `admin_${school.code.toLowerCase()}`,
      email: `admin@${school.code.toLowerCase()}.edu`,
      passwordHash: adminHash,
      fullName: `Admin - ${school.name}`,
      role: 'ADMIN',
      schoolId,
      points: 5000,
      rank: 'APEX',
    }).onDuplicateKeyUpdate({ set: { username: `admin_${school.code.toLowerCase()}` } })
  }

  // Students (spread across different schools)
  const studentHash = hashSync('student123', 10)
  const studentData = [
    { username: 'alex_j', email: 'alex@digiclub.com', fullName: 'Alex Johnson', schoolCode: 'AVM001', points: 650, rank: 'APEX' as const },
    { username: 'maya_p', email: 'maya@digiclub.com', fullName: 'Maya Patel', schoolCode: 'DAV001', points: 520, rank: 'GUARDIAN' as const },
    { username: 'ethan_c', email: 'ethan@digiclub.com', fullName: 'Ethan Chen', schoolCode: 'BES002', points: 430, rank: 'GUARDIAN' as const },
    { username: 'sophia_w', email: 'sophia@digiclub.com', fullName: 'Sophia Williams', schoolCode: 'EES001', points: 310, rank: 'KNIGHT' as const },
    { username: 'liam_b', email: 'liam@digiclub.com', fullName: 'Liam Brown', schoolCode: 'GPS001', points: 200, rank: 'CREATOR' as const },
    { username: 'olivia_d', email: 'olivia@digiclub.com', fullName: 'Olivia Davis', schoolCode: 'GBS001', points: 140, rank: 'CREATOR' as const },
    { username: 'noah_g', email: 'noah@digiclub.com', fullName: 'Noah Garcia', schoolCode: 'GHS001', points: 80, rank: 'INITIATOR' as const },
    { username: 'emma_m', email: 'emma@digiclub.com', fullName: 'Emma Martinez', schoolCode: 'HHS001', points: 45, rank: 'NEWBIE' as const },
    { username: 'arya_k', email: 'arya@digiclub.com', fullName: 'Arya Khadka', schoolCode: 'KHS002', points: 100, rank: 'INITIATOR' as const },
  ]

  const insertedStudents: any[] = []
  for (const s of studentData) {
    const schoolId = schoolMap.get(s.schoolCode)
    await db.insert(users).values({
      ...s,
      passwordHash: studentHash,
      role: 'STUDENT',
      schoolId,
      bio: `Student at ${s.fullName}`,
    }).onDuplicateKeyUpdate({ set: { username: s.username } })
    const user = await db.query.users.findFirst({ where: eq(users.username, s.username) })
    if (user) insertedStudents.push({ ...user, schoolCode: s.schoolCode })
  }

  // Product flyer posts (5-7 per student, all PENDING for admin review)
  const productPosts = [
    // Alex (7 posts)
    { content: '🔥 NEW ARRIVAL! Check out our latest collection of wireless Bluetooth earbuds with 40hr battery life. Only Rs. 1,299! Limited stock available at the school canteen. #TechDeals #Earbuds', type: 'TEXT' as const },
    { content: '✨ SPECIAL OFFER! Get 20% off on all custom T-shirt printing this week! Bring your designs to Room 204. Perfect for club merchandise and birthday gifts. #SchoolCreatives #TshirtPrinting', type: 'TEXT' as const },
    { content: '📢 ATTENTION GAMERS! We are selling pre-owned PS5 and Xbox games starting from Rs. 500. Trade-in your old games for credit! Visit the Gaming Club during lunch. #GameOn #SchoolGamers', type: 'TEXT' as const },
    { content: '🍕 PIZZA FUNDRAISER! Order your favorite pizza at just Rs. 150 per slice. Cheese, Pepperoni, and Veggie options available. Proceeds go to the Science Club trip. Order before Friday! #Fundraiser #Pizza', type: 'TEXT' as const },
    { content: '📚 STUDY MATERIALS SALE! Well-maintained used textbooks for Grade 11-12 at half price. Also selling guide books and reference materials. See Alex in Class 12 Science. #BookSale #StudySmart', type: 'TEXT' as const },
    { content: '🎧 PREMIUM HEADPHONES - Sony WH-1000XM5 at Rs. 8,000 (original price Rs. 25,000). Barely used, comes with case and all accessories. DM to buy. #AudioDeals #PremiumTech', type: 'TEXT' as const },
    { content: '💪 FITNESS GEAR AVAILABLE! Resistance bands, yoga mats, and dumbbells at wholesale prices. Get fit without breaking the bank! Ask for Alex at the Sports Club. #Fitness #SchoolSports', type: 'TEXT' as const },
    // Maya (6 posts)
    { content: '🌟 HANDMADE JEWELRY COLLECTION! Beautiful earrings, bracelets, and necklaces made by our Art Club. Perfect for gifts! Prices starting at Rs. 200. Visit the Art Room after school. #Handmade #Jewelry', type: 'TEXT' as const },
    { content: '🥤 REFRESHING SUMMER DRINKS! Fresh lemonade, iced tea, and fruit smoothies available every Friday at the School Fair. Only Rs. 50 per glass. Come beat the heat! #SummerDrinks #SchoolFair', type: 'TEXT' as const },
    { content: '📸 PHOTOGRAPHY SERVICES! Professional photos for school events, portraits, and group photos. Digital copies included. Special rates for students! Book your slot with Maya. #Photography #SchoolEvents', type: 'TEXT' as const },
    { content: '🎨 CUSTOM PAINTINGS & PORTRAITS! Commission a unique piece of art for your home. Watercolor, acrylic, and pencil sketches available. Starting at Rs. 500. DM for samples. #ArtCommission #Creative', type: 'TEXT' as const },
    { content: '🧁 BAKED GOODS SALE! Fresh cupcakes, brownies, and cookies every Wednesday. Rs. 30-80 each. Order in bulk for parties and events. Baked with love by the Home Science Club! #BakedGoods #Yummy', type: 'TEXT' as const },
    { content: '🌸 PLANT SALE! Small succulents and indoor plants starting at Rs. 100. Perfect for desk decor and room decoration. Growing our green community! #Plants #EcoFriendly', type: 'TEXT' as const },
    // Ethan (6 posts)
    { content: '⌚ SMARTWATCH SALE! Brand new smartwatches with heart rate monitor and sleep tracking. Compatible with Android and iOS. Only Rs. 2,499! Limited units. Contact Ethan from Class 11. #Smartwatch #Tech', type: 'TEXT' as const },
    { content: '🎒 SCHOOL BAG SALE! Durable and stylish backpacks with USB charging port. Multiple compartments for laptops and books. Rs. 1,499 only! Available in 5 colors. #Backpack #SchoolEssentials', type: 'TEXT' as const },
    { content: '⚽ SPORTS EQUIPMENT! Football, basketball, and volleyball available at discounted rates. Also selling shin guards, knee pads, and jerseys. Visit the PE department! #Sports #SchoolAthletics', type: 'TEXT' as const },
    { content: '📱 PHONE ACCESSORIES! Cases, screen protectors, chargers, and power banks at wholesale prices. Type-C and Lightning cables Rs. 150 each. Stock up today! #PhoneAccessories #TechDeals', type: 'TEXT' as const },
    { content: '🎵 MUSIC INSTRUMENTS! Second-hand guitar (Rs. 3,000), keyboard (Rs. 5,000), and drum set (Rs. 8,000) in good condition. Perfect for beginners! Contact Ethan. #Music #Instruments', type: 'TEXT' as const },
    { content: '🖨️ PRINTING SERVICE! Low-cost printing and photocopying available. B/W Rs. 2/page, Color Rs. 5/page. Binding services also available. Bulk orders welcome! #Printing #SchoolServices', type: 'TEXT' as const },
    // Sophia (5 posts)
    { content: '👗 FASHION SALE! Pre-loved dresses, jeans, and tops in excellent condition. Branded items available. Prices from Rs. 300-1,500. Sizes S to XL. Sustainable fashion! DM Sophia. #ThriftShop #SustainableFashion', type: 'TEXT' as const },
    { content: '💅 NAIL ART SERVICES! Get trendy nail designs at student-friendly prices. Gel polish, nail art stickers, and French manicure. Starting Rs. 200. Book your appointment today! #NailArt #Beauty', type: 'TEXT' as const },
    { content: '🎁 GIFT HAMPERS! Customized gift hampers for birthdays and festivals. Chocolates, candles, mugs, and more. Starting at Rs. 500. Order 3 days in advance. #Gifts #Hampers', type: 'TEXT' as const },
    { content: '🕯️ SCENTED CANDLES! Hand-poured soy candles in various fragrances: Vanilla, Lavender, Cinnamon, and Ocean Breeze. Rs. 250 each or 3 for Rs. 600. #Candles #SelfCare', type: 'TEXT' as const },
    { content: '📒 STATIONERY BUNDLE! Premium notebooks, gel pens, highlighters, and sticky notes bundle. Everything you need for school at just Rs. 399. Limited packs! #Stationery #SchoolSupplies', type: 'TEXT' as const },
    // Liam (5 posts)
    { content: '🔧 BIKE REPAIR SERVICE! Flat tire repair, chain adjustment, and brake fixing. I can fix your bicycle at school during lunch break. Rs. 100-300 depending on service. #BikeRepair #Cycling', type: 'TEXT' as const },
    { content: '🎮 RETRO GAMING NIGHT! Entry Rs. 100. Classic Nintendo, Sega, and arcade games. Prizes for winners! This Friday 4-7 PM in the Computer Lab. Snacks included! #RetroGaming #GameNight', type: 'TEXT' as const },
    { content: '☕ COFFEE & TEA STALL! Fresh brewed coffee, milk tea, and green tea available every morning before class. Rs. 30 per cup. Located near the main entrance. #CoffeeLovers #MorningBrew', type: 'TEXT' as const },
    { content: '🔋 POWER BANK RENTAL! Forgot to charge your phone? Rent a 10000mAh power bank for just Rs. 50/day. Available at the library counter. Return before closing! #PowerBank #SchoolHack', type: 'TEXT' as const },
    { content: '🎪 SCHOOL FEST TICKETS! Annual School Fest is here! Tickets Rs. 200 includes access to all events, games, and food stalls. Buy from Liam before they sell out! #SchoolFest #AnnualEvent', type: 'TEXT' as const },
    // Olivia (5 posts)
    { content: '🧶 HAND-KNITTED SCARVES & BEANIES! Winter is coming! Stay warm with our hand-knitted accessories. Various colors and patterns. Scarves Rs. 400, Beanies Rs. 250. #Knitted #WinterWear', type: 'TEXT' as const },
    { content: '🍿 MOVIE NIGHT SNACKS! Popcorn, nachos, and candy available every Friday movie screening. Combo deal: Popcorn + Drink = Rs. 100. Supporting the Film Club fundraiser! #MovieNight #Snacks', type: 'TEXT' as const },
    { content: '🎭 THEATRE CLUB MERCH! T-shirts, caps, and tote bags with cool theatre quotes. Designed by our club members. Rs. 350-600. Wear your love for drama! #Theatre #Merchandise', type: 'TEXT' as const },
    { content: '📿 FRIENDSHIP BANDS! Colorful woven friendship bands and bracelets. Custom names available. Rs. 30-80 each. Perfect for Friendship Day! #FriendshipBands #Crafts', type: 'TEXT' as const },
    { content: '🧴 DIY BATH BOMBS! All-natural, handmade bath bombs in fun shapes and colors. Makes a great gift! Rs. 150 each or pack of 4 for Rs. 500. #BathBombs #DIY', type: 'TEXT' as const },
    // Noah (5 posts)
    { content: '📦 STUDENT DISCOUNT CARD! Get exclusive discounts at 20+ local shops and restaurants. Only Rs. 100 for the whole academic year. Buy from Noah in Class 9. #StudentDiscount #SaveMoney', type: 'TEXT' as const },
    { content: '🎈 PARTY DECORATIONS! Balloon arches, banners, and table decorations for your birthday or event. Affordable prices starting Rs. 500. We set up and take down! #PartyDecor #Celebrations', type: 'TEXT' as const },
    { content: '📖 BOOK EXCHANGE! Bring your old books and exchange with others. Fiction, non-fiction, comics, and textbooks. Every Thursday at the library. Free for all students! #BookExchange #Reading', type: 'TEXT' as const },
    { content: '🧩 PUZZLE & BOARD GAMES! Second-hand puzzles, chess sets, and board games for sale. Perfect for rainy days and game nights. Prices Rs. 100-500. #BoardGames #Puzzles', type: 'TEXT' as const },
    { content: '🔦 GLOW PARTY TICKETS! Neon colors, glow sticks, and great music! Rs. 150 entry includes 3 glow items. This Saturday 5-8 PM. Don\'t miss out! #GlowParty #WeekendFun', type: 'TEXT' as const },
    // Emma (5 posts)
    { content: '🐶 PET ACCESSORIES! Handmade dog collars, leashes, and bandanas. Cute patterns and durable material. Rs. 150-400. Proceeds go to the Animal Welfare Club! #Pets #AnimalWelfare', type: 'TEXT' as const },
    { content: '🍬 CANDY SALE! Imported chocolates, gummy bears, and lollipops. Rs. 10-50 each. Special Halloween and holiday packs available. Visit Emma during break time! #Candy #SweetTooth', type: 'TEXT' as const },
    { content: '🎨 FACE PAINTING! Get your face painted during school events and sports day. Designs: superheroes, animals, flags, and more. Rs. 50-100. Fun for everyone! #FacePainting #SchoolEvents', type: 'TEXT' as const },
    { content: '📸 INSTAX PHOTO BOOTH! Get instant photos with our Polaroid camera. Props included! Rs. 100 per photo. Perfect for capturing school memories. Available at all major events. #Photobooth #InstantPhotos', type: 'TEXT' as const },
    { content: '🔑 KEYCHAIN COLLECTION! Custom acrylic keychains with your name or design. Durable and colorful. Rs. 80 each or 2 for Rs. 150. Great gifts! #Keychains #CustomDesigns', type: 'TEXT' as const },
    // Arya (5 posts)
    { content: '🍜 NOODLE BAR! Hot and spicy instant noodles with extra toppings. Egg, cheese, veggies, and chicken options. Rs. 80-120. Every day after school at the Home Science room. #Noodles #Foodie', type: 'TEXT' as const },
    { content: '🎵 BLUETOOTH SPEAKER SALE! Portable speakers with deep bass and 12hr battery. Waterproof model available. Rs. 1,799. Perfect for parties and outdoor fun! #BluetoothSpeaker #MusicLovers', type: 'TEXT' as const },
    { content: '👟 SNEAKER CLEANING SERVICE! Get your white sneakers looking brand new. Professional cleaning solution. Rs. 150 per pair. Drop off in the morning, pick up after school! #SneakerCare #FreshKicks', type: 'TEXT' as const },
    { content: '🌿 ORGANIC SKINCARE! Handmade soaps, lip balms, and moisturizers using natural ingredients. No chemicals! Soaps Rs. 100, Lip balm Rs. 50. Good for your skin and the planet! #Skincare #Organic', type: 'TEXT' as const },
    { content: '🎫 RAFFLE TICKETS! Win amazing prizes including a smartphone, headphones, and gift vouchers. Only Rs. 50 per ticket. Drawing on last day of month. Support the School Charity Drive! #Raffle #Charity', type: 'TEXT' as const },
  ]

  // Assign posts to students (5-7 each)
  let postIndex = 0
  for (const student of insertedStudents) {
    const postsPerStudent = student.fullName === 'Alex Johnson' ? 7 : student.fullName === 'Emma Martinez' ? 5 : student.fullName === 'Maya Patel' ? 6 : student.fullName === 'Ethan Chen' ? 6 : student.fullName === 'Sophia Williams' ? 5 : student.fullName === 'Liam Brown' ? 5 : student.fullName === 'Olivia Davis' ? 5 : student.fullName === 'Noah Garcia' ? 5 : 5
    for (let i = 0; i < postsPerStudent; i++) {
      if (postIndex >= productPosts.length) break
      const post = productPosts[postIndex]
      await db.insert(posts).values({
        content: post.content,
        type: 'TEXT',
        status: 'PENDING',
        authorId: student.id,
        schoolId: student.schoolId,
      })
      postIndex++
    }
  }

  console.log(`Created ${postIndex} product flyer posts (PENDING) for admin review`)

  // Badges
  const badgeList = [
    { name: 'First Post', description: 'Created your first post', icon: '📝', category: 'MILESTONE' as const, criteria: JSON.stringify({ postCount: 1 }) },
    { name: 'Rising Star', description: 'Earn 100 points', icon: '⭐', category: 'ACHIEVEMENT' as const, pointsRequired: 100 },
    { name: 'Content Creator', description: 'Created 10 posts', icon: '🎨', category: 'ACHIEVEMENT' as const, criteria: JSON.stringify({ postCount: 10 }) },
    { name: 'Popular', description: 'Received 50 likes across all posts', icon: '🔥', category: 'ACHIEVEMENT' as const, criteria: JSON.stringify({ likeCount: 50 }) },
    { name: 'Commentator', description: 'Left 20 comments', icon: '💬', category: 'MILESTONE' as const, criteria: JSON.stringify({ commentCount: 20 }) },
    { name: 'Challenge Master', description: 'Complete 5 challenges', icon: '🏆', category: 'ACHIEVEMENT' as const, criteria: JSON.stringify({ challengeCount: 5 }) },
    { name: 'Knight Rank', description: 'Reach Knight rank', icon: '🛡️', category: 'MILESTONE' as const, criteria: JSON.stringify({ rank: 'KNIGHT' }) },
    { name: 'Guardian Rank', description: 'Reach Guardian rank', icon: '👑', category: 'MILESTONE' as const, criteria: JSON.stringify({ rank: 'GUARDIAN' }) },
    { name: 'Apex Rank', description: 'Reach Apex rank', icon: '🚀', category: 'SPECIAL' as const, criteria: JSON.stringify({ rank: 'APEX' }) },
    { name: 'School Champion', description: 'Top scorer in your school', icon: '🏅', category: 'SCHOOL' as const, criteria: JSON.stringify({ points: 500 }) },
  ]

  for (const b of badgeList) {
    await db.insert(badges).values(b).onDuplicateKeyUpdate({ set: { name: b.name } })
  }

  // Season
  await db.insert(seasons).values({
    name: 'Spring 2026',
    startDate: new Date('2026-01-01'),
    endDate: new Date('2026-03-31'),
    isActive: true,
  }).onDuplicateKeyUpdate({ set: { name: 'Spring 2026' } })

  console.log('Seeding complete!')
  console.log('---')
  console.log('Super Admin: superadmin / T9f&3!Xp@Lr6^wQz')
  console.log('Admins: admin_<schoolcode> / admin123')
  console.log('Students: alex@digiclub.com .. emma@digiclub.com / student123')
  process.exit(0)
}

seed().catch((e) => {
  console.error(e)
  process.exit(1)
})
