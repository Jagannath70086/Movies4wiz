import * as yup from 'yup';
import { NextResponse } from 'next/server';
import connectDb from '../../../server/database/db';
import { genSalt, hash } from 'bcrypt'
import { sign } from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { Data } from '../../../server/models/Users';

const JWT_SECRET = 'secret'

export async function POST(req) {
    try {
        const validationSchema = yup.object().shape({
            name: yup.string().min(3, 'Enter Valid Name').required(),
            email: yup.string().email('Enter Valid Email').required(),
            password: yup.string().min(8, 'Enter Valid Password').required(),
        });
        const Body = await req.json();
        connectDb();
        if (await validationSchema.isValid(Body)) {
            const actEmail = Body.email.toUpperCase()
            let user = await Data.findOne({ email: actEmail })
            if (user) {
                return NextResponse.json({ errors: 'User already exists' }, { status: 403 })
            }
            else {
                const salt = await genSalt(10)
                const secPass = await hash(Body.password, salt)
                let user = await Data.create({
                    name: Body.name,
                    email: actEmail,
                    password: secPass,
                })
                const data = {
                    user: {
                        id: user.id
                    }
                }
                const expiration = Math.floor(Date.now() / 1000) + 1800; // 30 minutes from now
                const authToken = sign({ data: data, exp: expiration }, JWT_SECRET)
                const cookieOptions = {
                    httpOnly: true,
                };
                const cookieStore = cookies();
                cookieStore.set('authToken', authToken, cookieOptions);
                // get cookie
                // const cookieStore = cookies()
                // const token = cookieStore.get('token')
                // localStorage.setItem('authToken', authToken);

                return NextResponse.json({ message: 'SignUp successful' }, { status: 200 });
            }
        } else {
            return NextResponse.json({ errors: 'Invalid Email or Password' }, { status: 400 });
        }
    } catch (error) {
        console.log(error)
        return NextResponse.json({ errors: 'Internal Server Error' }, { status: 500 });
    }
}
