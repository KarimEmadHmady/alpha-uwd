import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    // هنا هتعمل validation للـ email و password
    // وده مثال بسيط - في الواقع هتعمل check من database
    
    if (email === 'admin@example.com' && password === 'admin123') {
      // Generate a simple token (في الواقع استخدم JWT)
      const token = 'mock_auth_token_' + Date.now();
      
      return NextResponse.json({
        success: true,
        token,
        user: {
          email,
          name: 'Admin User'
        }
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}
