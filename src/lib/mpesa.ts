export async function getMpesaToken() {
  const consumerKey = process.env.MPESA_CONSUMER_KEY
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET
  const isProd = process.env.MPESA_ENV === 'production'
  const baseUrl = isProd ? 'https://api.safaricom.co.ke' : 'https://sandbox.safaricom.co.ke'

  if (!consumerKey || !consumerSecret) throw new Error("Missing M-PESA Consumer Keys in .env")

  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64')

  const response = await fetch(`${baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: { Authorization: `Basic ${auth}` },
    cache: 'no-store'
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`Failed to fetch M-Pesa token: ${err}`)
  }
  const data = await response.json()
  return data.access_token
}

export async function initiateSTKPush(phone: string, amount: number, orderId: string) {
  const token = await getMpesaToken()
  const shortcode = process.env.MPESA_SHORTCODE!
  const passkey = process.env.MPESA_PASSKEY!
  const isProd = process.env.MPESA_ENV === 'production'
  const baseUrl = isProd ? 'https://api.safaricom.co.ke' : 'https://sandbox.safaricom.co.ke'
  
  const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14) 
  const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64')

  const formattedPhone = phone.startsWith('0') ? `254${phone.slice(1)}` : phone.replace('+', '')

  let rawHost = process.env.NEXTAUTH_URL || 'https://blackinkbookstore-swart.vercel.app'
  
  // Guarantee protocol and remove trailing slashes
  if (!rawHost.startsWith('http')) rawHost = `https://${rawHost}`
  const host = rawHost.replace(/\/$/, '') 

  const CallBackURL = `${host}/api/webhooks/mpesa`
  console.log('Final M-Pesa CallBackURL being sent to Daraja:', CallBackURL)

  const payload = {
    BusinessShortCode: shortcode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: "CustomerPayBillOnline", 
    Amount: Math.ceil(amount),
    PartyA: formattedPhone,
    PartyB: shortcode,
    PhoneNumber: formattedPhone,
    CallBackURL: CallBackURL,
    AccountReference: orderId.slice(0, 12),
    TransactionDesc: "Blackink Bookstore Checkout"
  }

  const response = await fetch(`${baseUrl}/mpesa/stkpush/v1/processrequest`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })

  const result = await response.json()
  if (!response.ok || result.errorCode) {
    throw new Error(result.errorMessage || 'STK Push failed')
  }

  return result
}
