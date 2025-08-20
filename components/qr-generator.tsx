'use client';

import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface QRGeneratorProps {
  value: string;
  size?: number;
}

export default function QRGenerator({ value, size = 256 }: QRGeneratorProps) {
  const [qrConfig, setQrConfig] = useState({
    level: 'L' as 'L' | 'M' | 'H' | 'Q',
    size: size,
    value: ''
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Reset error state and try to optimize the QR code
    setError(null);
    if (value) {
      // Try to shorten the URL if it's too long
      const shortenedValue = value.replace(process.env.NEXT_PUBLIC_BASE_URL || 'https://aaharic.me', '');
      setQrConfig(prev => ({
        ...prev,
        value: shortenedValue,
        level: 'L', // Start with lowest error correction
        size: size // Maintain the original size
      }));
    }
  }, [value, size]);

  if (!qrConfig.value) return null;

  try {
    return (
      <div className="flex items-center justify-center p-4 bg-white rounded-lg shadow-sm">
        <QRCodeSVG
          value={qrConfig.value}
          size={qrConfig.size}
          level={qrConfig.level}
          includeMargin={true}
          fgColor="#000000"
          bgColor="#ffffff"
          onError={(err) => {
            console.error('QR Code error:', err);
            setError('Unable to generate QR code - data too long');
          }}
        />
        {error && (
          <p className="text-red-500 text-sm mt-2">{error}</p>
        )}
      </div>
    );
  } catch (err) {
    console.error('QR Code generation error:', err);
    return (
      <div className="flex items-center justify-center p-4 bg-white rounded-lg shadow-sm">
        <p className="text-red-500">Error generating QR code. Please try again with shorter data.</p>
      </div>
    );
  }
} 