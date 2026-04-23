import { type NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const webhookUrl = process.env.MAKE_TIER_NOTIFICATION_WEBHOOK_URL
  if (!webhookUrl) {
    return NextResponse.json({ ok: true, skipped: true })
  }

  try {
    const payload = await req.json()
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    return NextResponse.json({ ok: res.ok })
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
