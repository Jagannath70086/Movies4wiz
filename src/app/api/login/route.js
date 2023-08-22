import * as yup from 'yup';
import { NextResponse } from 'next/server';
import connectDb from '../../../server/database/db';
import { compare } from 'bcrypt'
import { sign } from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { Data } from '../../../server/models/Users';

const JWT_SECRET = 'secret'

export async function POST(req) {
  try {
    const validationSchema = yup.object().shape({
      email: yup.string().email('Enter Valid Email').required(),
      password: yup.string().min(8, 'Enter Valid Password').required(),
    });
    const Body = await req.json();
    connectDb();
    if (await validationSchema.isValid(Body)) {
      const actEmail = Body.email.toUpperCase()
      let user = await Data.findOne({ email: actEmail })
      if (!user) {
        return NextResponse.json({ errors: 'Login with correct credentials' }, { status: 403 })
      }
      else {
        const passwordCompare = await compare(Body.password, user.password)
        if (!passwordCompare) {
          return NextResponse.json({ error: 'Login with correct credentials' }, { status: 400 })
        }
        const data = {
          user: {
            id: user.id
          }
        }
        const expiration = Math.floor(Date.now() / 1000) + 1800; // 30 minutes from now
        const authToken = sign({ data: data, exp: expiration }, JWT_SECRET)
        const cookieOptions = {
          httpOnly: false, // Only send the cookie over HTTPS in production
        };
        const cookieStore = cookies();
        cookieStore.set('authToken', authToken, cookieOptions);
        // get cookie
        // const cookieStore = cookies()
        // const token = cookieStore.get('token')
        // localStorage.setItem('authToken', authToken);

        return NextResponse.json({ message: 'Login successful' }, { status: 200 });
      }
    } else {
      return NextResponse.json({ errors: 'Invalid Email or Password' }, { status: 400 });
    }
  } catch (error) {
    console.log(error)
    return NextResponse.json({ errors: 'Internal Server Error' }, { status: 500 });
  }
}
