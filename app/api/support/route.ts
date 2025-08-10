import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const supportSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters long'),
});

function getSupabase() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options) {
          // Not setting here in route handlers
        },
        remove(name: string, options) {
          // Not removing here in route handlers
        },
      },
    }
  );
}

export async function POST(request: NextRequest) {
  const supabase = getSupabase();

  try {
    const json = await request.json();
    const body = supportSchema.parse(json);

    const { data, error } = await supabase
      .from('support_requests')
      .insert([
        {
          name: body.name,
          email: body.email,
          phone: body.phone,
          subject: body.subject,
          message: body.message,
          status: 'new',
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error inserting support request:', error);
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    return NextResponse.json(data);

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: 'Invalid form data', errors: error.errors }, { status: 400 });
    }
    console.error('Error processing support request:', error);
    return NextResponse.json({ message: 'An unexpected error occurred.' }, { status: 500 });
  }
}

export async function GET() {
  const supabase = getSupabase();

  // Check if the user is an admin before fetching all requests.
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { data, error } = await supabase
      .from('support_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error fetching support requests:', error);
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error('Error fetching support requests:', error);
    return NextResponse.json({ message: 'An unexpected error occurred.' }, { status: 500 });
  }
}