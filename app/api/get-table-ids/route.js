import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // In a real-world scenario, you might fetch these from a database
    const tableIds = [
      '1',   // Employee Performance Tracker
      '2',   // Sales Pipeline
      '3',   // Customer Feedback
      '4',   // Inventory Management
      '5'    // Project Milestones
    ];

    return NextResponse.json(tableIds);
  } catch (error) {
    console.error('Error fetching table IDs:', error);
    return NextResponse.json(
      { error: 'Unable to fetch table IDs' }, 
      { status: 500 }
    );
  }
}
