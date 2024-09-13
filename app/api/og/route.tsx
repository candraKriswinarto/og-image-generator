import { deploymentURL } from '@/constant/env';
import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get('title');
    const description = searchParams.get('description');
    const logoUrl = searchParams.get('logoUrl');

    const decodedLogoUrl = logoUrl
      ? decodeURIComponent(logoUrl)
      : `${deploymentURL}/images/logo.png`;

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            padding: '40px',
            background: 'linear-gradient(135deg, #FF6FD8 10%, #3813C2 100%)',
          }}
        >
          {decodedLogoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={decodedLogoUrl}
              alt='logo'
              width='200'
              height='200'
              style={{
                objectFit: 'contain',
              }}
            />
          )}
          <h1 tw='mt-8 text-6xl font-bold text-white'>{title}</h1>
          <p tw='text-4xl text-white'>{description}</p>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error: unknown) {
    console.error('Error generating OG image:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    return new Response(`Failed to generate image: ${errorMessage}`, {
      status: 500,
    });
  }
}
