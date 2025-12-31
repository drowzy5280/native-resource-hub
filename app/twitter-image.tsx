import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Tribal Resource Hub - Connecting Indigenous Communities'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
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
          backgroundColor: '#FDF8F3',
          backgroundImage: 'linear-gradient(135deg, #FDF8F3 0%, #F5E6D3 50%, #E8D5C4 100%)',
        }}
      >
        {/* Decorative pattern */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '8px',
            background: 'linear-gradient(90deg, #2D5A27 0%, #8B4513 25%, #DAA520 50%, #8B4513 75%, #2D5A27 100%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '8px',
            background: 'linear-gradient(90deg, #2D5A27 0%, #8B4513 25%, #DAA520 50%, #8B4513 75%, #2D5A27 100%)',
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
          }}
        >
          {/* Logo/Icon */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '120px',
              height: '120px',
              backgroundColor: '#2D5A27',
              borderRadius: '24px',
              marginBottom: '32px',
              boxShadow: '0 8px 32px rgba(45, 90, 39, 0.3)',
            }}
          >
            <svg
              width="72"
              height="72"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#FDF8F3"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>

          {/* Title */}
          <h1
            style={{
              fontSize: '64px',
              fontWeight: 'bold',
              color: '#2C1810',
              margin: '0 0 16px 0',
              textAlign: 'center',
              lineHeight: 1.1,
            }}
          >
            Tribal Resource Hub
          </h1>

          {/* Tagline */}
          <p
            style={{
              fontSize: '28px',
              color: '#5D4E37',
              margin: '0 0 32px 0',
              textAlign: 'center',
              maxWidth: '800px',
            }}
          >
            Connecting Indigenous Communities with Resources, Benefits & Opportunities
          </p>

          {/* Stats */}
          <div
            style={{
              display: 'flex',
              gap: '48px',
              marginTop: '16px',
            }}
          >
            {[
              { number: '175+', label: 'Resources' },
              { number: '65+', label: 'Nonprofits' },
              { number: '50', label: 'States' },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <span
                  style={{
                    fontSize: '48px',
                    fontWeight: 'bold',
                    color: '#2D5A27',
                  }}
                >
                  {stat.number}
                </span>
                <span
                  style={{
                    fontSize: '20px',
                    color: '#5D4E37',
                  }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* URL */}
        <div
          style={{
            position: 'absolute',
            bottom: '24px',
            fontSize: '18px',
            color: '#8B7355',
          }}
        >
          tribalresourcehub.com
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
