'use client';

import Link from 'next/link';
import type { ComponentProps, MouseEvent } from 'react';

type SafeLinkProps = ComponentProps<typeof Link>;

export function SafeLink({ href, onClick, ...props }: SafeLinkProps) {
  function navigateWithReload(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    window.location.assign(event.currentTarget.href);
  }

  return <Link {...props} href={href} prefetch={false} onClick={navigateWithReload} />;
}
