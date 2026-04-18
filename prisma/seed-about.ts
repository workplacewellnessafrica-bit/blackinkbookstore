import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const content = [
    {
      key: 'about-story',
      title: 'Our Story',
      content: 'At Black Ink Bookstores, we view books as enduring vessels of knowledge, culture, and delight. We value literature as a cornerstone of learning and a meaningful legacy to carry forward from one generation to the next.\n\nBased in the heart of Nyeri, Kenya, our purpose has always extended beyond creating a bookstore. We strive to provide a dependable, refined space where curiosity is encouraged and readers can access a carefully curated selection of books that genuinely elevate their reading experience.'
    },
    {
      key: 'about-belief',
      title: 'Our Belief',
      content: 'We believe books are essential tools for knowledge, growth, and informed thinking. They provide the clarity, perspective, and grounding that every reader deserves.\n\nOur principles guide every decision we make: Integrity, Quality, and Community.'
    },
    {
      key: 'about-offer',
      title: 'What We Offer',
      content: 'We carefully stock a diverse range of genres including: Children\'s Books, Young Readers, Biographies, Philosophy, Fantasy, Science Fiction, Classics, Poetry, and dark romance / contemporary thrillers.'
    },
    {
      key: 'about-community',
      title: 'Meet our Community',
      content: 'More than a bookstore, Black Ink is a growing community of curious minds. Whether you are a casual browser, a passionate collector, or a parent building a home library—we are here for you.'
    }
  ]

  for (const item of content) {
    await prisma.siteContent.upsert({
      where: { key: item.key },
      update: item,
      create: item,
    })
  }

  console.log('Seed completed.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
