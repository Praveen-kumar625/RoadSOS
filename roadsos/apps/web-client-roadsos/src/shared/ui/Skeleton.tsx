import React from 'react';
import { cn } from './Input';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn('animate-pulse rounded-2xl bg-white/10', className)}
      {...props}
    />
  );
}
