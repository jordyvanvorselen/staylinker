import { NextRequest, NextResponse } from 'next/server';

interface DistanceResponse {
  duration: string;
  distance: string;
  durationInSeconds: number;
  routeFound: boolean;
  error?: string;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const origin = searchParams.get('origin');
  const destination = searchParams.get('destination');

  if (!origin || !destination) {
    return NextResponse.json(
      { error: 'Origin and destination parameters are required' },
      { status: 400 },
    );
  }

  // API key should be stored in environment variables for security
  const apiKey = process.env['GOOGLE_MAPS_API_KEY'];

  if (!apiKey) {
    console.error('Google Maps API key not found');
    return NextResponse.json({ error: 'Google Maps API key is not configured' }, { status: 500 });
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`,
      { method: 'GET' },
    );

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();

    if (data.status !== 'OK') {
      throw new Error(`Distance Matrix API responded with status: ${data.status}`);
    }

    const result = data.rows[0].elements[0];

    // Handle ZERO_RESULTS and other non-OK statuses gracefully
    if (result.status !== 'OK') {
      console.log(`No route found between locations: ${result.status}`);
      return NextResponse.json({
        distance: 'Unknown distance',
        duration: 'Unable to calculate',
        durationInSeconds: 0,
        routeFound: false,
        error: `No direct route available (${result.status})`,
      });
    }

    const distanceResponse: DistanceResponse = {
      duration: result.duration.text,
      distance: result.distance.text,
      durationInSeconds: result.duration.value,
      routeFound: true,
    };

    return NextResponse.json(distanceResponse);
  } catch (error) {
    console.error('Error calculating distance:', error);
    return NextResponse.json(
      {
        error: 'Failed to calculate distance',
        distance: 'Error',
        duration: 'Error',
        durationInSeconds: 0,
        routeFound: false,
      },
      { status: 500 },
    );
  }
}
