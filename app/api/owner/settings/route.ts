import { NextResponse } from 'next/server';

// In-memory store for demo (replace with database later)
let settingsStore = {
  restaurant: {
    name: 'The Tasty Corner',
    address: '123 Main Street, City, State 12345',
    phone: '+1 (555) 123-4567',
    email: 'info@tastycorner.com'
  },
  business: {
    autoAcceptOrders: true,
    estimatedDeliveryTime: 30,
    minimumOrderAmount: 15,
    serviceCharge: 5,
    taxes: 8.5
  },
  notifications: {
    email: true,
    sms: false,
    push: true
  }
};

// GET /api/owner/settings
export async function GET() {
  try {
    return NextResponse.json({ 
      success: true, 
      settings: settingsStore 
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

// POST /api/owner/settings
export async function POST(req: Request) {
  try {
    const updates = await req.json();
    
    // Update the store with new values
    if (updates.restaurant) {
      settingsStore.restaurant = { ...settingsStore.restaurant, ...updates.restaurant };
    }
    if (updates.business) {
      settingsStore.business = { ...settingsStore.business, ...updates.business };
    }
    if (updates.notifications) {
      settingsStore.notifications = { ...settingsStore.notifications, ...updates.notifications };
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Settings updated successfully',
      settings: settingsStore
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
