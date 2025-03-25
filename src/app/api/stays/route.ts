import { NextResponse } from 'next/server';
import mockStays from '../../../data/mockStays';

export async function GET() {
  // Simulate a real API by adding a small delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  return NextResponse.json(mockStays);
}
