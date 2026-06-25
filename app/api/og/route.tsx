import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';



export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title') || 'Vaakil.com — Legal & Compliance Experts';
    const category = searchParams.get('category') || 'Blog';
    const brandColor = searchParams.get('color') || '#2C2C2A'; // Charcoal default

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#FAFAF8', // Ivory background
            backgroundImage: 'radial-gradient(circle at 25px 25px, #D3D3D3 2%, transparent 0%), radial-gradient(circle at 75px 75px, #D3D3D3 2%, transparent 0%)',
            backgroundSize: '100px 100px',
            fontFamily: 'sans-serif',
            padding: '40px 80px',
            textAlign: 'center',
            borderBottom: `20px solid ${brandColor}`,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '40px',
            }}
          >
            {/* Fake Logo Placeholder */}
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: '#4A7C59', // Sage green
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
                fontWeight: 'bold',
                marginRight: '20px',
              }}
            >
              V
            </div>
            <span style={{ fontSize: '32px', fontWeight: 'bold', color: '#2C2C2A' }}>Vaakil.com</span>
          </div>

          <div
            style={{
              fontSize: '24px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: '#4A7C59',
              fontWeight: 'bold',
              marginBottom: '20px',
            }}
          >
            {category}
          </div>

          <div
            style={{
              fontSize: title.length > 60 ? '48px' : '64px',
              fontWeight: 'bold',
              color: '#2C2C2A',
              lineHeight: 1.2,
              maxWidth: '900px',
            }}
          >
            {title}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    return new Response(`Failed to generate OG image`, { status: 500 });
  }
}
