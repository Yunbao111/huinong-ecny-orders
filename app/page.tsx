'use client';

import Image from 'next/image';
import { ArrowRight, CircleHelp, Landmark, PackageCheck, ShieldCheck, Sprout, WalletCards, WifiOff } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatMoney, useDemo } from './demo-context';
import { SafeLink } from './safe-link';

const entryCards = [
  { href: '/orders', icon: PackageCheck, title: '办理农业订单', detail: '登记交货、现场验收、查看付款进度', tone: 'green' },
  { href: '/digital-rmb', icon: Landmark, title: '认识数字人民币', detail: '看懂它和传统移动支付的本质区别', tone: 'red' },
  { href: '/wallet', icon: WalletCards, title: '打开数币钱包', detail: '查看仿真余额、流水和硬钱包演示', tone: 'gold' },
];

export default function HomePage() {
  const { fulfillment, payment, walletFen } = useDemo();
  const orderStatus = fulfillment === 'accepted' ? '等待交货' : fulfillment === 'delivered' ? '等待验收' : payment === 'paid' ? '订单已完成' : '正在仿真付款';

  return (
    <main className="mx-auto max-w-7xl px-4 pb-28 pt-4 sm:px-6 sm:pt-6 lg:px-8 lg:pb-12">
      <section className="hero-panel relative min-h-[390px] overflow-hidden rounded-[28px] bg-[var(--forest)] text-white shadow-[0_20px_60px_rgb(8_52_38/18%)] sm:min-h-[430px]">
        <Image src="/images/orchard-ecny-hero.png" alt="果园里的农户正在向验收人员交付苹果" fill priority sizes="(max-width: 768px) 100vw, 1200px" className="object-cover object-[68%_center]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,48,34,.97)_0%,rgba(6,48,34,.9)_38%,rgba(6,48,34,.28)_72%,rgba(6,48,34,.08)_100%)]" />
        <div className="relative flex min-h-[390px] max-w-2xl flex-col justify-center p-6 sm:min-h-[430px] sm:p-10 lg:p-14">
          <Badge className="mb-5 h-8 w-fit border border-amber-200/30 bg-amber-300/18 px-3 text-sm font-bold text-amber-100"><Sprout className="size-4" /> 数字人民币赋能订单农业</Badge>
          <h1 className="max-w-2xl text-4xl font-black leading-[1.16] tracking-tight sm:text-[2.8rem]">让小农户按订单交货，<br />用数币清楚收款</h1>
          <p className="mt-5 max-w-xl text-lg font-medium leading-8 text-emerald-50 sm:text-xl">平台把订单约定、农产品验收和数字人民币仿真付款连在一起，重点解决小农户回款不确定、山区老人收款不方便的问题。</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <SafeLink href="/orders" className="primary-link">去办理订单 <ArrowRight className="size-5" /></SafeLink>
            <SafeLink href="/digital-rmb" className="secondary-link"><Landmark className="size-5" /> 数字人民币有什么不同</SafeLink>
          </div>
          <p className="mt-5 flex max-w-xl items-start gap-2 text-sm leading-6 text-emerald-100"><ShieldCheck className="mt-0.5 size-4 shrink-0" />这是研究原型，只演示数字人民币应用思路，不连接真实钱包、银行或央行系统，不发生真实资金交易。</p>
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-3" aria-label="三个功能页面入口">
        {entryCards.map(({ href, icon: Icon, title, detail, tone }) => (
          <SafeLink key={href} href={href} className={`action-card action-${tone}`}>
            <span className="action-icon"><Icon /></span><span className="min-w-0"><strong>{title}</strong><small>{detail}</small></span><ArrowRight className="ml-auto size-5 shrink-0 opacity-45" />
          </SafeLink>
        ))}
      </section>

      <section className="mt-10 grid gap-5 lg:grid-cols-[1.15fr_.85fr]">
        <Card className="rounded-[24px] border-0 bg-white shadow-[0_12px_36px_rgb(23_74_52/8%)] ring-1 ring-emerald-950/8">
          <CardHeader>
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
              <div><p className="section-kicker">当前进度</p><CardTitle className="text-2xl font-black">红富士苹果订单</CardTitle><CardDescription className="mt-2 text-base">订单号 HN20260906001・丰禾农产品有限公司</CardDescription></div>
              <Badge className="h-9 w-fit bg-emerald-100 px-4 text-base font-black text-emerald-800">{orderStatus}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-3"><HomeFact label="约定数量" value="2,000 千克" /><HomeFact label="约定单价" value="5.20 元/千克" /><HomeFact label="最晚交货" value="9月10日" /></div>
            <SafeLink href="/orders" className="mt-5 inline-flex min-h-12 items-center gap-2 rounded-xl bg-[var(--leaf)] px-6 text-base font-black text-white hover:bg-emerald-700">查看订单详情 <ArrowRight className="size-5" /></SafeLink>
          </CardContent>
        </Card>

        <Card className="rounded-[24px] border-0 bg-[linear-gradient(145deg,#a9161c,#64101a)] text-white ring-0">
          <CardHeader><div className="flex items-start justify-between gap-4"><div><p className="text-sm font-black tracking-[.12em] text-red-100">虚拟数字人民币钱包</p><CardTitle className="mt-3 text-4xl font-black">{formatMoney(walletFen)}</CardTitle></div><span className="grid size-13 place-items-center rounded-2xl bg-white/12"><WalletCards className="size-7" /></span></div></CardHeader>
          <CardContent><p className="text-base leading-7 text-red-50">验收通过后，仿真货款会与订单对应展示，方便农户核对“哪笔订单、多少钱、什么状态”。</p><SafeLink href="/wallet" className="mt-5 inline-flex min-h-12 items-center gap-2 rounded-xl bg-amber-300 px-5 text-base font-black text-red-950 hover:bg-amber-200">查看钱包 <ArrowRight className="size-5" /></SafeLink></CardContent>
        </Card>
      </section>

      <section className="mt-10 overflow-hidden rounded-[28px] bg-white ring-1 ring-emerald-950/8">
        <div className="grid lg:grid-cols-[.9fr_1.1fr]">
          <div className="relative min-h-[310px]"><Image src="/images/mountain-hard-wallet.png" alt="山区老年农户使用卡片形态的虚拟硬钱包演示收款" fill sizes="(max-width: 1024px) 100vw, 520px" className="object-cover" /></div>
          <div className="p-6 sm:p-9 lg:p-11"><p className="section-kicker">山区助农场景</p><h2 className="text-3xl font-black leading-tight">没有智能手机，也能学习硬钱包收款</h2><p className="mt-4 text-lg leading-8 text-slate-600">官方资料介绍了卡片等硬钱包形态和离线交易能力。本平台用虚拟卡片演示山区无网场景：现场先记录，恢复网络后再同步核验。</p><div className="mt-5 flex flex-wrap gap-3"><SafeLink href="/wallet#hard-wallet" className="primary-link"><WifiOff className="size-5" />体验硬钱包演示</SafeLink><SafeLink href="/digital-rmb" className="plain-link"><CircleHelp className="size-5" />先了解原理</SafeLink></div></div>
        </div>
      </section>
    </main>
  );
}

function HomeFact({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl bg-slate-50 p-4"><p className="text-sm font-semibold text-slate-500">{label}</p><p className="mt-1 text-lg font-black text-slate-900">{value}</p></div>;
}
