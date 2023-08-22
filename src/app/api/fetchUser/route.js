import { Data } from '../../../server/models/Users';
import { NextResponse } from 'next/server';
import * as jwt from 'jsonwebtoken';
import connectDb from '../../../server/database/db';

const JWT_SECRET = 'secret';
// Export a named function for the POST method
export async function POST(req) {
  try {
    const token = req.headers.get('authToken')
    if (!token) {
      return NextResponse.json({ error: 'You need to be a signed user to access this function.' }, { status: 401 });
    }
    try {
      const data = jwt.verify(token, JWT_SECRET);
      const userId = data.data.user.id;
      connectDb()
      const user = await Data.findOne({ _id: userId }).select('-password');
      return NextResponse.json(user);
    } catch (error) {
      return NextResponse.json({ error: 'Please authenticate using valid details' }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ errors: 'Internal Server Error' }, { status: 500 });
  }
}
