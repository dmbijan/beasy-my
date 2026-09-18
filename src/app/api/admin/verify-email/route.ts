import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST() {
  try {
    // Update email_confirmed_at in auth.users table
    const { data, error } = await supabase.rpc('update_email_confirmed', {
      user_id: '22faf1fd-30a4-4f6f-8372-4f427cb39cff',
      confirmed_at: new Date().toISOString()
    });

    if (error) {
      console.error('RPC Error:', error);
      // Try direct SQL approach
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .update({ 
          email_verified: new Date().toISOString()
        })
        .eq('id', '22faf1fd-30a4-4f6f-8372-4f427cb39cff')
        .select();

      if (userError) {
        return NextResponse.json(
          { error: userError.message },
          { status: 500 }
        );
      }

      return NextResponse.json({ 
        message: 'Email verified via profiles table',
        data: userData 
      });
    }

    return NextResponse.json({ 
      message: 'Email verified successfully',
      data 
    });
  } catch (error) {
    console.error('Error verifying email:', error);
    return NextResponse.json(
      { error: 'Failed to verify email' },
      { status: 500 }
    );
  }
}
