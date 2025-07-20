import twilio from 'twilio';

const client = twilio(process.env.TWILIO_SID!, process.env.TWILIO_AUTH!);

export async function sendWhatsAppMessage({ to, body }: { to: string, body: string }) {
  return client.messages.create({
    from: 'whatsapp:+14155238886', // Twilio WhatsApp Sandbox number
    to: `whatsapp:${to}`,
    body
  });
} 