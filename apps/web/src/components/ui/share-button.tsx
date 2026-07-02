'use client';

import { useEffect, useRef, useState } from 'react';
import Button from '@repo/ui/button';

type SharePlatform = {
  name: string;
  href: (url: string, title: string) => string;
};

const PLATFORMS: SharePlatform[] = [
  {
    name: 'Facebook',
    href: (url) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    name: 'Messenger',
    href: (url) => `fb-messenger://share/?link=${encodeURIComponent(url)}`,
  },
  {
    name: 'X',
    href: (url, title) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  },
  {
    name: 'WhatsApp',
    href: (url, title) => `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
  },
  {
    name: 'LinkedIn',
    href: (url) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
];

export default function ShareButton({
  fill = false,
  big,
  small,
  onClickAction = () => alert('Link másolva a vágólapra!'),
}: {
  fill?: boolean;
  onClickAction?: () => void;
  big?: boolean;
  small?: boolean;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    onClickAction();
    setMenuOpen(false);
  };

  const handleClick = async () => {
    const url = window.location.href;
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({ title: document.title, url });
        return;
      } catch {
        // Megosztás megszakítva vagy nem támogatott — marad a menüs fallback.
      }
    }
    setMenuOpen((open) => !open);
  };

  useEffect(() => {
    if (!menuOpen) return;
    const handleOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [menuOpen]);

  const openShare = (platform: SharePlatform) => {
    const url = window.location.href;
    const title = document.title;
    window.open(platform.href(url, title), '_blank', 'noopener,noreferrer');
    setMenuOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className={`relative ${fill ? 'w-full' : ''}`}
    >
      <Button
        styleType='primary'
        styleVariant='outlined'
        fill={fill}
        big={big}
        small={small}
        onClick={handleClick}
      >
        Megosztás
      </Button>
      {menuOpen && (
        <div className='absolute bottom-full left-0 z-10 mb-2 w-full min-w-44 overflow-hidden rounded-2xl bg-white shadow-2xl'>
          <ul className='flex flex-col py-1'>
            {PLATFORMS.map((platform) => (
              <li key={platform.name}>
                <button
                  type='button'
                  onClick={() => openShare(platform)}
                  className='w-full px-4 py-2 text-left text-sm hover:bg-gray-100'
                >
                  {platform.name}
                </button>
              </li>
            ))}
            <li>
              <button
                type='button'
                onClick={copyLink}
                className='w-full border-t border-gray-100 px-4 py-2 text-left text-sm hover:bg-gray-100'
              >
                Link másolása
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
