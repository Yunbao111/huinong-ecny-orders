'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { BadgeCheck, Home, Landmark, ReceiptText, UserRound, WalletCards, Wheat, X } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Role, roles, useDemo } from './demo-context';
import { SafeLink } from './safe-link';

const navigation = [
  { href: '/', label: '首页', icon: Home },
  { href: '/orders', label: '订单', icon: ReceiptText },
  { href: '/digital-rmb', label: '数币', icon: Landmark },
  { href: '/wallet', label: '钱包', icon: WalletCards },
];

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { role, setRole, notice } = useDemo();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!roleMenuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setRoleMenuOpen(false);
    };
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setRoleMenuOpen(false);
    };
    document.addEventListener('keydown', closeOnEscape);
    document.addEventListener('pointerdown', closeOnOutsideClick);
    return () => {
      document.removeEventListener('keydown', closeOnEscape);
      document.removeEventListener('pointerdown', closeOnOutsideClick);
    };
  }, [roleMenuOpen]);

  function chooseRole(nextRole: Role) {
    setRole(nextRole);
    setRoleMenuOpen(false);
  }

  return (
    <div className="min-h-screen bg-[var(--page-bg)] text-[var(--ink)]">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[var(--forest)] text-white shadow-sm">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <SafeLink href="/" className="flex min-w-0 items-center gap-3 rounded-xl focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-amber-300">
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[var(--harvest)] text-[var(--forest)] shadow-[inset_0_0_0_1px_rgb(255_255_255/35%)]"><Wheat className="size-6" strokeWidth={2.4} /></span>
            <span className="min-w-0"><strong className="block truncate text-lg font-extrabold tracking-wide sm:text-xl">惠农数币订单平台</strong><small className="hidden text-sm text-emerald-100 sm:block">订单稳稳当当，数币明明白白</small></span>
          </SafeLink>

          <div ref={menuRef} className="relative flex items-center gap-2">
            <Badge className="hidden h-8 border border-red-200/30 bg-red-500/20 px-3 text-sm text-red-50 md:inline-flex">数字人民币仿真演示</Badge>
            <button
              type="button"
              className="role-button"
              aria-expanded={roleMenuOpen}
              aria-haspopup="menu"
              onClick={() => setRoleMenuOpen((open) => !open)}
            >
              <UserRound className="size-5" />
              <span className="hidden sm:inline">{roles[role]}</span>
              <span className="sm:hidden">身份</span>
            </button>

            {roleMenuOpen && (
              <div className="role-menu" role="menu" aria-label="切换演示身份">
                <div className="flex items-center justify-between border-b px-4 py-3">
                  <div><p className="text-base font-black text-slate-900">切换演示身份</p><p className="mt-1 text-sm text-slate-500">不同身份可办理不同步骤</p></div>
                  <Button type="button" variant="ghost" size="icon" aria-label="关闭身份菜单" onClick={() => setRoleMenuOpen(false)}><X /></Button>
                </div>
                <div className="grid gap-2 p-3">
                  {(Object.keys(roles) as Role[]).map((key) => (
                    <button key={key} type="button" role="menuitemradio" aria-checked={role === key} className="role-option" onClick={() => chooseRole(key)}>
                      <span className="grid size-10 place-items-center rounded-full bg-emerald-50 text-[var(--leaf)]"><UserRound className="size-5" /></span>
                      <span className="text-left"><strong>{roles[key]}</strong><small>{key === 'farmer' ? '登记交货、确认验收、查看收款' : key === 'inspector' ? '现场验收、确认合格量' : key === 'buyer' ? '查看订单履约进度' : '重试付款、重置演示'}</small></span>
                      {role === key && <BadgeCheck className="ml-auto size-5 text-[var(--leaf)]" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <nav className="hidden border-b border-emerald-950/8 bg-white lg:block" aria-label="主导航">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-9 px-8 text-base font-semibold">
          {navigation.map(({ href, label, icon: Icon }) => <SafeLink key={href} onClick={() => setRoleMenuOpen(false)} className={`nav-link ${pathname === href ? 'nav-link-active' : ''}`} href={href}><Icon />{label === '订单' ? '我的订单' : label === '数币' ? '认识数币' : label === '钱包' ? '数币钱包' : label}</SafeLink>)}
        </div>
      </nav>

      {notice && <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8"><output className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-base font-bold text-emerald-900"><BadgeCheck className="mt-0.5 size-5 shrink-0" />{notice}</output></div>}

      {children}

      <nav className="mobile-nav lg:hidden" aria-label="手机主导航">
        {navigation.map(({ href, label, icon: Icon }) => <SafeLink key={href} onClick={() => setRoleMenuOpen(false)} className={pathname === href ? 'active' : ''} href={href}><Icon />{label}</SafeLink>)}
      </nav>
    </div>
  );
}
