import type { Metadata } from 'next';
import './globals.css';
import { DemoProvider } from './demo-context';
import { SiteShell } from './site-shell';

export const metadata: Metadata = {
  title: '惠农数币订单平台',
  description: '面向农户的订单农业与数字人民币仿真支付研究原型',
};

export const dynamic = 'force-static';

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body><DemoProvider><SiteShell>{children}</SiteShell></DemoProvider></body></html>;
}
