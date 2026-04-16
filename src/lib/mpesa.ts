export async function getMpesaToken() {
  const consumerKey = process.env.MPESA_CONSUMER_KEY
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET
  if (!consumerKey || !consumerSecret) throw new Error("Missing M-PESA Consumer Keys in .env")

  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64')

  const response = await fetch('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
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
  
  const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14) 
  const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64')

  const formattedPhone = phone.startsWith('0') ? `254${phone.slice(1)}` : phone.replace('+', '')

  // NOTE: You must update NEXTAUTH_URL perfectly in Vercel to allow Safaricom tracking payload to resolve.
  const host = process.env.NEXTAUTH_URL || 'https://blackinkbookstore.vercel.app'

  const payload = {
    BusinessShortCode: shortcode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: "CustomerPayBillOnline", 
    Amount: Math.ceil(amount),
    PartyA: formattedPhone,
    PartyB: shortcode,
    PhoneNumber: formattedPhone,
    CallBackURL: `${host}/api/webhooks/mpesa`,
    AccountReference: orderId,
    TransactionDesc: "Blackink Bookstore Checkout"
  }

  const response = await fetch('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', {
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
