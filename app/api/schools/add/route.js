import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';


export async function POST(request) {
  try {
    const body = await request.json();
    
    const { name, address, city, state, contact, email_id, image } = body;

    
    if (!name || !address || !city || !state || !contact || !email_id || !image) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Save to database after uploaded in cloudinary 
    const school = await prisma.school.create({
      data: {
        name,
        address,
        city,
        state,
        contact,
        email_id,
        image, // image contains the cloudinary URL from the widget
      }
    });

    return NextResponse.json(
      { message: 'School registered successfully!', school },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creating school:', error);
    return NextResponse.json(
      { message: 'Failed to register school' },
      { status: 500 }
    );
  }
}
