import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 1. Seed Shipping Zones
  const zones = [
    { name: 'Nairobi CBD', provider: '2NK Parcel', fee: 150 },
    { name: 'Nairobi CBD', provider: 'G4S', fee: 250 },
    { name: 'Greater Nairobi', provider: 'Wells Fargo', fee: 350 },
    { name: 'Rest of Kenya', provider: 'G4S', fee: 500 },
    { name: 'East Africa', provider: 'DHL Express', fee: 1500 },
  ]

  console.log('Seeding shipping zones...')
  for (const zone of zones) {
    await prisma.shippingZone.upsert({
      where: { name_provider: { name: zone.name, provider: zone.provider } },
      update: {},
      create: zone,
    })
  }

  // 2. Seed Books (Local Assets)
  const books = [
    {
      title: 'Moby-Dick; or, The Whale',
      author: 'Herman Melville',
      description: 'The epic tale of Captain Ahab\'s obsessive quest for the white whale.',
      price: 1500,
      coverImage: '/images/IMG-20260416-WA0061.jpg',
      isbn: '9780142437247',
      genre: 'Classic Fiction',
      stock: 15,
      featured: true,
    },
    {
      title: 'Pride and Prejudice',
      author: 'Jane Austen',
      description: 'A romantic novel of manners that follows the character development of Elizabeth Bennet.',
      price: 1200,
      coverImage: '/images/IMG-20260416-WA0063.jpg',
      isbn: '9780141439518',
      genre: 'Romance',
      stock: 20,
      featured: true,
    },
    {
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      description: 'A tragedy of the Jazz Age, highlighting the American Dream and its discontents.',
      price: 1350,
      coverImage: '/images/IMG-20260416-WA0064.jpg',
      isbn: '9780743273565',
      genre: 'Classic Fiction',
      stock: 10,
      featured: true,
    },
    {
      title: 'The Adventures of Tom Sawyer',
      author: 'Mark Twain',
      description: 'An 1876 novel about a young boy growing up along the Mississippi River.',
      price: 1100,
      coverImage: '/images/IMG-20260416-WA0065.jpg',
      isbn: '9780143039563',
      genre: 'Fiction',
      stock: 25,
      featured: false,
    }
  ]

  console.log('Seeding books...')
  for (const book of books) {
    await prisma.book.upsert({
      where: { isbn: book.isbn },
      update: {},
      create: book,
    })
  }

  console.log('Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
