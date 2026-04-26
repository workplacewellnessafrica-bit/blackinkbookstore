import { MapPin, Mail, Phone, Send } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white font-serif">
      {/* Hero Section */}
      <section className="container mx-auto max-w-7xl px-4 py-24 text-center space-y-4">
         <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic">Connect With Us</h1>
         <p className="text-[10px] font-bold text-muted uppercase tracking-[0.4em]">Black Ink Bookstores — Beyond the Written Word</p>
      </section>

      {/* Info Grid */}
      <section className="container mx-auto max-w-7xl px-4 py-20 border-y border-black/5">
        <div className="grid md:grid-cols-3 gap-16">
          <ContactInfo 
            icon={<MapPin className="w-6 h-6" />}
            title="Physical Address"
            content="Lawnbull Arcade, Kimathi Way, Nyeri Town, Kenya."
          />
          <ContactInfo 
            icon={<Mail className="w-6 h-6" />}
            title="Email Address"
            content="info@blackinkbookstore.co.ke"
          />
          <ContactInfo 
            icon={<Phone className="w-6 h-6" />}
            title="Phone Numbers"
            content="+254 795 061474"
          />
        </div>
      </section>

      {/* Message Form */}
      <section className="container mx-auto max-w-3xl px-4 py-32 space-y-12">
        <div className="text-center space-y-4">
           <h2 className="text-3xl font-black uppercase tracking-tighter italic">Send us a message</h2>
           <p className="text-[11px] text-muted leading-relaxed uppercase tracking-wider max-w-lg mx-auto">
             Whether you're searching for a rare edition, seeking a recommendation, or needing assistance—our librarians are at your service.
           </p>
        </div>

        <form className="space-y-8">
           <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted">Full Name</label>
                 <Input className="rounded-none border-black/10 focus-visible:ring-black h-12 uppercase text-[10px] font-bold tracking-widest" placeholder="YOUR NAME" />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted">Email Address</label>
                 <Input type="email" className="rounded-none border-black/10 focus-visible:ring-black h-12 uppercase text-[10px] font-bold tracking-widest" placeholder="EMAIL@DOMAIN.COM" />
              </div>
           </div>
           
           <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted">Your Inquiry</label>
              <textarea 
                rows={6}
                className="flex w-full rounded-none border border-black/10 bg-background px-3 py-4 text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:ring-1 focus:ring-black"
                placeholder="HOW CAN WE ASSIST?"
              />
           </div>

           <Button size="lg" className="w-full rounded-none bg-black text-white hover:bg-black/90 font-black uppercase tracking-[0.4em] py-8 text-xs">
              Transmit Message <Send className="ml-4 w-4 h-4" />
           </Button>
        </form>
      </section>
    </div>
  )
}

function ContactInfo({ icon, title, content }: { icon: React.ReactNode, title: string, content: string }) {
  return (
    <div className="flex flex-col items-center text-center space-y-4 group">
      <div className="p-4 bg-black/5 rounded-full group-hover:bg-black group-hover:text-white transition-all duration-500">
        {icon}
      </div>
      <h3 className="text-sm font-black uppercase tracking-widest">{title}</h3>
      <p className="text-xs text-muted leading-relaxed uppercase tracking-wide max-w-[200px]">
        {content}
      </p>
    </div>
  )
}
