'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const res = await signIn('credentials', {
      redirect: false,
      email,
      password
    })

    if (res?.error) {
      setError('Invalid owner credentials. Access denied.')
      setLoading(false)
    } else {
      router.push('/owner')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg border border-border shadow-sm">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold tracking-tighter text-text">BLACKINK BOOKSTORE.</Link>
          <p className="text-muted mt-2">Owner Portal Authentication</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email Address</label>
            <Input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="owner@blackink.com" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Passphrase</label>
            <Input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          
          {error && <p className="text-error text-sm font-medium">{error}</p>}
          
          <Button type="submit" className="w-full mt-6" disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In \u2192'}
          </Button>
        </form>
      </div>
    </div>
  )
}
