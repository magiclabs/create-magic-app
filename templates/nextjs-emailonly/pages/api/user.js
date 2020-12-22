import { getSession } from '../../lib/iron';

export default async function user(req, res) {
  try {
    const session = await getSession(req);
    res.status(200).json({ user: session || null });
  } catch (error) {
    res.status(200).json({ user: null });
  }
}
