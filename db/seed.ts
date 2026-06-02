import 'dotenv/config'
import { db } from './index'
import { users, schools, badges, challenges, seasons } from './schema'
import { hashSync } from 'bcryptjs'

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

  // Students
  const studentHash = hashSync('student123', 10)
  const studentData = [
    { username: 'alex_j', email: 'alex@digiclub.com', fullName: 'Alex Johnson', schoolCode: 'AVM001', points: 650, rank: 'APEX' as const },
    { username: 'maya_p', email: 'maya@digiclub.com', fullName: 'Maya Patel', schoolCode: 'AVM001', points: 520, rank: 'GUARDIAN' as const },
    { username: 'ethan_c', email: 'ethan@digiclub.com', fullName: 'Ethan Chen', schoolCode: 'BES001', points: 430, rank: 'GUARDIAN' as const },
    { username: 'sophia_w', email: 'sophia@digiclub.com', fullName: 'Sophia Williams', schoolCode: 'BES001', points: 310, rank: 'KNIGHT' as const },
    { username: 'liam_b', email: 'liam@digiclub.com', fullName: 'Liam Brown', schoolCode: 'BV001', points: 200, rank: 'CREATOR' as const },
    { username: 'olivia_d', email: 'olivia@digiclub.com', fullName: 'Olivia Davis', schoolCode: 'BV001', points: 140, rank: 'CREATOR' as const },
    { username: 'noah_g', email: 'noah@digiclub.com', fullName: 'Noah Garcia', schoolCode: 'BNS001', points: 80, rank: 'INITIATOR' as const },
    { username: 'emma_m', email: 'emma@digiclub.com', fullName: 'Emma Martinez', schoolCode: 'BNS001', points: 45, rank: 'NEWBIE' as const },
  ]

  for (const s of studentData) {
    const schoolId = schoolMap.get(s.schoolCode)
    await db.insert(users).values({
      ...s,
      passwordHash: studentHash,
      role: 'STUDENT',
      schoolId,
      bio: `Student at ${s.fullName}`,
    }).onDuplicateKeyUpdate({ set: { username: s.username } })
  }

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
