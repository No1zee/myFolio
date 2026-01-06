import { ImageResponse } from 'next/og';

// export const runtime = 'edge'; // Removed to silence SSG warning

export const alt = 'Edward Magejo - Technical Consultant & Systems Specialist';
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    background: '#030712',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'sans-serif',
                    position: 'relative',
                }}
            >
                {/* Abstract Background Elements */}
                <div
                    style={{
                        position: 'absolute',
                        top: '-20%',
                        left: '-10%',
                        width: '600px',
                        height: '600px',
                        background: 'radial-gradient(circle, rgba(6,182,212,0.15) 0%, rgba(3,7,18,0) 70%)',
                        filter: 'blur(40px)',
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        bottom: '-20%',
                        right: '-10%',
                        width: '600px',
                        height: '600px',
                        background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(3,7,18,0) 70%)',
                        filter: 'blur(40px)',
                    }}
                />

                {/* Content Container */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10,
                        padding: '40px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '20px',
                        background: 'rgba(3,7,18,0.5)',
                        boxShadow: '0 0 50px rgba(0,0,0,0.5)',
                    }}
                >
                    <div
                        style={{
                            fontSize: 64,
                            fontWeight: 800,
                            color: 'white',
                            marginBottom: 20,
                            letterSpacing: '-0.02em',
                            textShadow: '0 0 20px rgba(6,182,212,0.5)',
                        }}
                    >
                        Edward Magejo
                    </div>
                    <div
                        style={{
                            fontSize: 32,
                            fontWeight: 500,
                            color: '#94a3b8',
                            letterSpacing: '0.05em',
                            textTransform: 'uppercase',
                        }}
                    >
                        Technical Consultant
                    </div>
                    <div
                        style={{
                            width: '100px',
                            height: '4px',
                            background: 'linear-gradient(90deg, #06b6d4, #3b82f6)',
                            marginTop: 30,
                            borderRadius: '2px',
                        }}
                    />
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
