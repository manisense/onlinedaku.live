import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import { Newsletter } from '@/models/Newsletter';

// This would typically connect to a database
// For now, we'll just simulate success
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;
    
    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Please provide a valid email address' },
        { status: 400 }
      );
    }
    
    // Connect to the database
    await dbConnect();
    
    // Check if email already exists
    const existingSubscription = await Newsletter.findOne({ email });
    if (existingSubscription) {
      return NextResponse.json(
        { success: true, message: 'You are already subscribed to our newsletter!' },
        { status: 200 }
      );
    }
    
    // Save the email to the database
    const subscription = await Newsletter.create({ email });
    
    console.log('New newsletter subscription:', subscription);
    
    // Return success response
    return NextResponse.json(
      { success: true, message: 'Thank you for subscribing to our newsletter!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
}