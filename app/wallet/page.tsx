'use client';

import { ArrowRight, BadgeCheck, Clock3, CreditCard, FileCheck2, HandCoins, Info, RefreshCw, ShieldCheck, WalletCards, Wifi, WifiOff } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatMoney, useDemo } from '../demo-context';
import { SafeLink } from '../safe-link';

export default function WalletPage() {
  const { payment, paymentFen, walletFen, offlineReceipt, recordOfflineReceipt, syncOfflineReceipt, resetOfflineReceipt } = useDemo();

  return (
    <main className="mx-auto max-w-7xl px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-14">
      <section className="page-heading wallet-heading">
        <div><p className="section-kicker text-red-200">数币钱包</p><h1>每一笔仿真货款，都能找到对应订单</h1><p>余额、付款状态和离线记录集中展示，帮助农户看清“钱从哪笔订单来”。</p></div>
        <span className="page-heading-icon bg-white/12 text-white"><WalletCards /></span>
      </section>

      <div className="mt-6 grid gap-5 lg:grid-cols-[.9fr_1.1fr]">
        <section className="wallet-card" aria-label="虚拟数字人民币钱包余额">
          <div className="flex items-start justify-between gap-4"><div><p className="text-base font-bold text-red-100">李建国的虚拟数字人民币钱包</p><p className="mt-6 text-sm text-red-100">可用仿真余额</p><p className="mt-1 text-4xl font-black sm:text-5xl">{formatMoney(walletFen)}</p></div><span className="grid size-14 place-items-center rounded-2xl bg-white/14"><BadgeCheck className="size-8" /></span></div>
          <div className="mt-9 flex flex-wrap items-center justify-between gap-3"><Badge className="h-9 border border-white/20 bg-white/12 px-4 text-sm font-black text-white">仿真演示・非真实钱包</Badge><span className="text-sm text-red-100">**** 6638</span></div>
        </section>

        <Card className="rounded-[26px] border-0 bg-white ring-1 ring-emerald-950/8">
          <CardHeader><div className="flex items-start justify-between gap-4"><div><CardTitle className="text-2xl font-black">收款流水</CardTitle><CardDescription className="mt-2 text-base">这里只显示本研究原型生成的仿真数据</CardDescription></div><span className="grid size-12 place-items-center rounded-2xl bg-emerald-50 text-[var(--leaf)]"><HandCoins /></span></div></CardHeader>
          <CardContent>
            {payment === 'paid' ? (
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start"><div><p className="text-lg font-black">红富士苹果订单收款</p><p className="mt-1 text-sm text-slate-500">订单 HN20260906001・仿真交易 ECNY-DEMO-001</p></div><p className="text-2xl font-black text-emerald-700">+{formatMoney(paymentFen)}</p></div><div className="mt-4 grid gap-3 border-t border-emerald-100 pt-4 sm:grid-cols-3"><WalletFact label="付款状态" value="仿真支付完成" /><WalletFact label="合格重量" value="1,950 千克" /><WalletFact label="结算单价" value="5.20 元/千克" /></div><div className="mt-3 flex items-center gap-2 rounded-xl bg-white/80 p-3 text-sm leading-6 text-slate-600"><FileCheck2 className="size-4 shrink-0 text-emerald-700" />存证哈希 0x19d4f26b · 时间戳 2026-09-07 14:03（仿真示意）</div></div>
            ) : (
              <div className="rounded-2xl border-2 border-dashed border-slate-200 p-6 text-center"><Clock3 className="mx-auto size-9 text-slate-400" /><p className="mt-3 text-lg font-black">苹果订单货款尚未进入钱包</p><p className="mt-2 text-base leading-7 text-slate-500">先由农户登记交货，再由验收员确认合格重量，平台才会触发仿真付款。</p><SafeLink href="/orders" className="mt-4 inline-flex min-h-11 items-center gap-2 font-black text-[var(--leaf)] underline underline-offset-4">去办理订单 <ArrowRight className="size-5" /></SafeLink></div>
            )}
            <div className="mt-4 flex items-center justify-between rounded-2xl bg-slate-50 p-4"><div><p className="font-black">演示期初余额</p><p className="mt-1 text-sm text-slate-500">本机初始化的虚拟余额</p></div><p className="text-lg font-black">{formatMoney(2_865_000)}</p></div>
          </CardContent>
        </Card>
      </div>

      <section id="hard-wallet" className="mt-10 scroll-mt-36 overflow-hidden rounded-[30px] border border-amber-200 bg-white shadow-[0_16px_48px_rgb(95_65_10/9%)]">
        <div className="grid lg:grid-cols-[.9fr_1.1fr]">
          <div className="bg-[linear-gradient(145deg,#7d1118,#400d14)] p-6 text-white sm:p-9 lg:p-11">
            <Badge className="h-8 border border-white/20 bg-white/12 px-3 text-sm font-black text-white"><WifiOff />山区离线交易机制演示</Badge>
            <h2 className="mt-5 text-3xl font-black leading-tight">虚拟硬钱包“碰一碰”收款</h2>
            <p className="mt-4 text-lg leading-8 text-red-50">模拟农户没有智能手机、收购点没有网络时，使用卡片形态的虚拟硬钱包记录一笔待核验收款。</p>
            <div className="mx-auto mt-8 max-w-sm rounded-[28px] border border-white/25 bg-[linear-gradient(145deg,#c9262c,#750e18)] p-6 shadow-2xl">
              <div className="flex items-start justify-between"><CreditCard className="size-9 text-amber-200" /><span className="text-sm font-black text-red-100">虚拟硬钱包</span></div><p className="mt-12 text-sm text-red-100">农户：李建国</p><p className="mt-1 text-2xl font-black tracking-widest">**** 6638</p>
            </div>
          </div>

          <div className="p-6 sm:p-9 lg:p-11">
            <div className="flex items-start gap-3 rounded-2xl bg-blue-50 p-4 text-blue-950"><Info className="mt-0.5 size-6 shrink-0" /><p className="text-base leading-7"><strong>请注意：</strong>离线记录只是暂存凭据，不表示资金已经最终结算。恢复网络后仍需完成签名、金额、钱包状态、防重复等核验。</p></div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3" aria-label="离线演示步骤"><OfflineStep number="1" active={offlineReceipt === 'none'} done={offlineReceipt !== 'none'} icon={WifiOff} title="现场碰一碰" /><OfflineStep number="2" active={offlineReceipt === 'queued'} done={offlineReceipt === 'synced'} icon={FileCheck2} title="本机待核验" /><OfflineStep number="3" active={offlineReceipt === 'synced'} done={offlineReceipt === 'synced'} icon={Wifi} title="联网后同步" /></div>

            {offlineReceipt === 'none' && <div className="mt-6 rounded-2xl border border-slate-200 p-5"><p className="text-xl font-black">准备记录仿真收款</p><p className="mt-2 text-base leading-7 text-slate-600">订单 HN20260906001・金额 10,140.00 元</p><Button type="button" onClick={recordOfflineReceipt} className="mt-5 h-14 w-full rounded-xl bg-red-700 text-lg font-black hover:bg-red-600"><CreditCard />模拟碰一碰收款</Button></div>}

            {offlineReceipt === 'queued' && <div className="mt-6 rounded-2xl border-2 border-amber-300 bg-amber-50 p-5"><p className="flex items-center gap-2 text-xl font-black text-amber-950"><Clock3 />本机已记录，等待联网核验</p><p className="mt-2 text-base leading-7 text-slate-700">现在不能显示为最终付款。请模拟恢复网络，完成一次同步核验。</p><Button type="button" onClick={syncOfflineReceipt} className="mt-5 h-14 w-full rounded-xl text-lg font-black"><Wifi />模拟恢复网络并同步</Button></div>}

            {offlineReceipt === 'synced' && <div className="mt-6 rounded-2xl border-2 border-emerald-300 bg-emerald-50 p-5"><p className="flex items-center gap-2 text-xl font-black text-emerald-950"><BadgeCheck />仿真同步核验成功</p><p className="mt-2 text-base leading-7 text-slate-700">同一离线记录不会再次生成第二笔结果。这仍是虚拟记录，不代表真实数字人民币资金入账。</p><Button type="button" variant="outline" onClick={resetOfflineReceipt} className="mt-5 h-12 w-full rounded-xl text-base font-black"><RefreshCw />重新体验硬钱包演示</Button></div>}
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        <WalletNote icon={ShieldCheck} title="不是平台积分" text="未来若通过运营机构真实接入，农户接收的是数字人民币；当前页面仅使用虚拟金额演示。" />
        <WalletNote icon={WifiOff} title="离线不等于不用核验" text="离线场景需要额度、设备和风控条件，记录恢复联网后还要同步与对账。" />
        <WalletNote icon={FileCheck2} title="流水对应具体订单" text="本平台把订单号、合格重量和付款金额放在同一条仿真流水中，便于农户核对。" />
      </section>
    </main>
  );
}

function WalletFact({ label, value }: { label: string; value: string }) {
  return <div><p className="text-sm text-slate-500">{label}</p><p className="mt-1 font-black">{value}</p></div>;
}

function OfflineStep({ number, active, done, icon: Icon, title }: { number: string; active: boolean; done: boolean; icon: typeof WifiOff; title: string }) {
  return <div className={`rounded-2xl border p-4 ${active ? 'border-amber-300 bg-amber-50' : done ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 bg-slate-50'}`}><div className="flex items-center justify-between"><span className="text-sm font-black text-slate-500">第{number}步</span><Icon className={`size-5 ${active ? 'text-amber-700' : done ? 'text-emerald-700' : 'text-slate-400'}`} /></div><p className="mt-3 font-black">{title}</p></div>;
}

function WalletNote({ icon: Icon, title, text }: { icon: typeof ShieldCheck; title: string; text: string }) {
  return <Card className="rounded-[22px] border-0 bg-white ring-1 ring-emerald-950/8"><CardHeader><span className="grid size-11 place-items-center rounded-2xl bg-red-50 text-red-700"><Icon /></span><CardTitle className="mt-3 text-xl font-black">{title}</CardTitle><CardDescription className="mt-2 text-base leading-7 text-slate-600">{text}</CardDescription></CardHeader><CardContent /></Card>;
}
