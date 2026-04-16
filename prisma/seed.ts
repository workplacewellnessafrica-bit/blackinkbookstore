import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 1. Seed Shipping Zones
  const zones = [
    { name: 'Nairobi CBD', fee: 200 },
    { name: 'Greater Nairobi', fee: 300 },
    { name: 'Rest of Kenya', fee: 450 },
    { name: 'East Africa', fee: 1200 },
    { name: 'International', fee: 2500 },
  ]

  console.log('Seeding shipping zones...')
  for (const zone of zones) {
    await prisma.shippingZone.upsert({
      where: { name: zone.name },
      update: {},
      create: zone,
    })
  }

  // 2. Seed Books (Internet Archive Covers)
  const books = [
    {
      title: 'Moby-Dick; or, The Whale',
      author: 'Herman Melville',
      description: 'The epic tale of Captain Ahab\'s obsessive quest for the white whale.',
      price: 1500,
      coverImage: 'https://archive.org/services/img/mobydickorwhale01melv',
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
      coverImage: 'https://archive.org/services/img/prideprejudice00aust_3',
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
      coverImage: 'https://archive.org/services/img/greatgatsby0000fitz_k8q1',
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
      coverImage: 'https://archive.org/services/img/adventuresoftoms0000twai_u3n1',
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
