// import { NextResponse } from "next/server";

// export async function GET(){
//   return NextResponse.json({result:true})
// }



import dbConnect from '@/lib/dbConnect';
// import { User } from '@/model/User';
import userModel from '@/model/User';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    await dbConnect();
     console.log("dbconnect")
    const { username, email, password } = await request.json();

    // Basic validation
    if (!username || !email || !password) {
      return new Response(JSON.stringify({ error: 'All fields are required' }), {
        status: 300,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check if user already exists
    const existingUser = await userModel.findOne({ 
      $or: [
        { email },
        { username }
      ]
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return  Response.json({
          error:'User email already taken',
          status:400,
        } 
      )
      }
      if (existingUser.username === username) {
        return new Response(JSON.stringify({ error: 'Username already taken' }), {
          status: 409,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new userModel({
      username,
      email,
      password: hashedPassword
    });

    await newUser.save();

    return Response.json({ 
  success: true, 
  message: 'User created successfully',
  user: {
    id: newUser._id,
    username: newUser.username,
    email: newUser.email
  }
}, {
  status: 201,
  headers: { 'Content-Type': 'application/json' }
});

  } catch (error) {
    console.error('Signup error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}