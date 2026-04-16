import { BookForm } from '@/components/admin/BookForm'

export default function NewBookPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-text">Publish New Book</h1>
        <p className="text-sm text-muted">Populate the metadata below to release a new title to the storefront.</p>
      </div>
      <BookForm />
    </div>
  )
}
