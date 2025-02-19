import { NextApiRequest, NextApiResponse } from 'next';
import Deal from '@/models/Deal';
import dbConnect from '@/utils/dbConnect';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  switch (req.method) {
    case 'GET':
      try {
        const deals = await Deal.find({});
        res.status(200).json({ success: true, data: deals });
      } catch (error) {
        res.status(400).json({ success: false, error });
      }
      break;
    case 'POST':
      try {
        const deal = await Deal.create(req.body);
        res.status(201).json({ success: true, data: deal });
      } catch (error) {
        res.status(400).json({ success: false, error });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}