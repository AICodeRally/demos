import { redirect } from 'next/navigation';

const VERCEL_URL = 'https://demo.swic-summit.aicoderally.com';

export default function PrizymSwicRedirect() {
  redirect(VERCEL_URL);
}
