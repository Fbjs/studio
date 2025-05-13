"use client";

import Image from 'next/image';
import { UserCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UserAvatarProps {
  src?: string;
  alt?: string;
  size?: number;
  className?: string;
}

export function UserAvatar({ src, alt = 'User Avatar', size = 40, className }: UserAvatarProps) {
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        className={cn('rounded-full object-cover', className)}
        data-ai-hint="profile avatar"
      />
    );
  }
  return (
    <div
      className={cn(
        'rounded-full bg-muted flex items-center justify-center text-muted-foreground',
        className
      )}
      style={{ width: size, height: size }}
      aria-label={alt}
    >
      <UserCircle strokeWidth={1.5} style={{ width: size * 0.7, height: size * 0.7 }} />
    </div>
  );
}
