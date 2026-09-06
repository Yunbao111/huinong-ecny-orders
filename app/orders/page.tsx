'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { ArrowRight, BadgeCheck, ClipboardCheck, Clock3, RefreshCw, ShieldCheck, UserRound, WalletCards } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { withBasePath } from '../base-path';
import { formatMoney, roles, useDemo } from '../demo-context';
import { SafeLink } from '../safe-link';

type Panel = 'delivery' | 'inspection' | null;

export default function OrdersPage() {
  const { role, fulfillment, payment, expectedFen, paymentFen, recordDelivery, passInspection, retryPayment, resetDemo } = useDemo();
  const [panel, setPanel] = useState<Panel>(null);
  const [acceptedWeight, setAcceptedWeight] = useState('1950');
  const amountFen = Math.max(0, Math.round(Number(acceptedWeight || 0) * 520));
  const exactDemoAmount = amountFen === paymentFen;

  const currentIndex = fulfillment === 'accepted' ? 1 : fulfillment === 'delivered' ? 2 : fulfillment === 'inspection_passed' ? 3 : 4;
  const progressSteps = useMemo(() => [
    { label: '订单已确认', detail: '条款已留存' },
    { label: fulfillment === 'accepted' ? '等待交货' : '已交货', detail: fulfillment === 'accepted' ? '9月10日前' : '1,980 千克' },
    { label: '现场验收', detail: currentIndex >= 3 ? '合格 1,950 千克' : '验收员确认' },
    { label: '仿真付款', detail: payment === 'paid' ? '已完成' : payment === 'processing' ? '正在处理' : payment === 'retry_pending' ? '等待重试' : '验收后触发' },
  ].map((step, index) => ({ ...step, state: index < currentIndex ? 'done' : index === currentIndex ? 'current' : 'next' })), [currentIndex, fulfillment, payment]);

  const status = fulfillment === 'accepted' ? '已接单' : fulfillment === 'delivered' ? '待验收' : payment === 'paid' ? '已完成' : payment === 'retry_pending' ? '付款待重试' : '仿真付款中';

  function confirmDelivery() {
    if (recordDelivery()) setPanel(null);
  }

  function confirmInspection() {
    if (!exactDemoAmount) return;
    if (passInspection()) setPanel(null);
  }

  return (
    <main className="mx-auto max-w-7xl px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-14">
      <section className="page-heading">
        <div><p className="section-kicker">我的订单</p><h1>把交货、验收和数币付款连在一起</h1><p>当前演示身份：<strong>{roles[role]}</strong>。每种身份只能办理自己负责的步骤。</p></div>
        <span className="page-heading-icon"><ClipboardCheck /></span>
      </section>

      <div className="mt-6 grid gap-5 xl:grid-cols-[1fr_310px]">
        <div>
          <Card className="order-card gap-0 overflow-hidden rounded-[26px] border-0 py-0 shadow-[0_12px_36px_rgb(23_74_52/10%)] ring-1 ring-emerald-950/8">
            <div className="grid lg:grid-cols-[290px_1fr]">
              <div className="relative min-h-[250px] overflow-hidden lg:min-h-full">
                <Image src={withBasePath('/images/fuji-apples.png')} alt="装在绿色筐中的新鲜红富士苹果" fill priority sizes="(max-width: 1024px) 100vw, 290px" className="object-cover" />
                <Badge className="absolute left-4 top-4 h-9 bg-white px-4 text-base font-black text-[var(--leaf)] shadow-md">{status}</Badge>
              </div>
              <div className="p-5 sm:p-7">
                <CardHeader className="px-0 pb-5"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div><CardTitle className="text-2xl font-black">一级红富士苹果</CardTitle><CardDescription className="mt-2 text-base text-slate-600">订单号 HN20260906001<br />采购方：丰禾农产品有限公司</CardDescription></div><div className="rounded-2xl bg-emerald-50 px-5 py-3 text-left sm:text-right"><p className="text-sm font-semibold text-slate-600">{payment === 'paid' ? '仿真实付货款' : '预计货款'}</p><p className="mt-1 text-2xl font-black text-[var(--leaf)]">{formatMoney(payment === 'paid' ? paymentFen : expectedFen)}</p></div></div></CardHeader>
                <CardContent className="px-0">
                  <div className="grid grid-cols-2 gap-3 rounded-2xl bg-slate-50 p-4 sm:grid-cols-4"><OrderFact label="订单数量" value="2,000 千克" /><OrderFact label="约定单价" value="5.20 元/千克" /><OrderFact label="交货地点" value="丰禾收购站" /><OrderFact label="最晚交货" value="9月10日" /></div>
                  <div className="mt-7 grid grid-cols-4 gap-1" aria-label="订单进度">
                    {progressSteps.map((step, index) => <div className="progress-step" data-state={step.state} key={step.label}><div className="progress-row"><span className="progress-dot">{step.state === 'done' ? <BadgeCheck /> : index + 1}</span>{index < progressSteps.length - 1 && <span className="progress-line" />}</div><strong>{step.label}</strong><small>{step.detail}</small></div>)}
                  </div>
                  <OrderAction role={role} fulfillment={fulfillment} payment={payment} onDelivery={() => setPanel('delivery')} onInspection={() => setPanel('inspection')} onRetry={retryPayment} />
                </CardContent>
              </div>
            </div>
          </Card>

          {panel === 'delivery' && <ActionPanel title="确认本次交货" description="核对无误后，订单会进入待验收状态。" onClose={() => setPanel(null)}><div className="grid gap-3 rounded-2xl bg-slate-50 p-4 sm:grid-cols-3"><OrderFact label="农产品" value="红富士苹果" /><OrderFact label="本次交货" value="1,980 千克" /><OrderFact label="交货地点" value="丰禾收购站" /></div><Button type="button" onClick={confirmDelivery} className="mt-5 h-13 w-full rounded-xl text-lg font-black" disabled={role !== 'farmer' || fulfillment !== 'accepted'}>信息无误，确认交货</Button></ActionPanel>}

          {panel === 'inspection' && <ActionPanel title="苹果现场验收" description="系统按照合格重量和冻结的订单单价计算仿真付款金额。" onClose={() => setPanel(null)}><div className="grid gap-4 sm:grid-cols-2"><div><Label className="mb-2 text-base font-bold" htmlFor="delivered">实际送达（千克）</Label><Input id="delivered" className="h-12 text-lg" value="1980" disabled /></div><div><Label className="mb-2 text-base font-bold" htmlFor="accepted">验收合格（千克）</Label><Input id="accepted" className="h-12 text-lg" inputMode="numeric" value={acceptedWeight} onChange={(event) => setAcceptedWeight(event.target.value)} /></div></div><div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4"><p className="text-sm font-bold text-amber-800">系统计算的仿真付款金额</p><p className="mt-1 text-3xl font-black text-emerald-800">{formatMoney(amountFen)}</p><p className="mt-2 text-sm text-slate-600">合格重量 × 5.20 元/千克；金额按“分”精确计算。</p></div><Button type="button" onClick={confirmInspection} className="mt-5 h-13 w-full rounded-xl text-lg font-black" disabled={role !== 'inspector' || fulfillment !== 'delivered' || !exactDemoAmount}>验收通过并触发仿真付款</Button>{!exactDemoAmount && <p role="alert" className="mt-3 text-sm font-bold text-red-700">本次演示合格重量应为 1,950 千克，请核对后再提交。</p>}</ActionPanel>}
        </div>

        <aside className="space-y-5">
          <Card className="rounded-[22px] border-0 bg-[var(--forest)] text-white ring-0"><CardHeader><CardDescription className="text-base text-emerald-100">为什么验收后才付款？</CardDescription><CardTitle className="mt-2 text-xl font-black">先确认农货，再触发数币仿真付款</CardTitle></CardHeader><CardContent><p className="text-base leading-7 text-emerald-50">平台规则把付款义务与合格重量对应起来，避免未验收就付款，也让农户看清计算依据。</p><SafeLink href="/digital-rmb#platform-fit" className="mt-4 inline-flex items-center gap-2 font-black text-amber-200 underline underline-offset-4">了解数币如何赋能 <ArrowRight className="size-5" /></SafeLink></CardContent></Card>
          <Card className="rounded-[22px] border-0 bg-white ring-1 ring-emerald-950/8"><CardHeader><CardTitle className="flex items-center gap-2 text-xl font-black"><Clock3 className="size-6 text-[var(--leaf)]" />办理记录</CardTitle></CardHeader><CardContent className="space-y-4"><AuditRow done title="农户接受订单" detail="2026年8月20日・条款冻结" /><AuditRow done={fulfillment !== 'accepted'} title="农户登记交货" detail={fulfillment === 'accepted' ? '尚未办理' : '1,980 千克'} /><AuditRow done={currentIndex >= 3} title="验收员确认合格量" detail={currentIndex >= 3 ? '合格 1,950 千克' : '尚未办理'} /><AuditRow done={payment === 'paid'} title="仿真付款记录" detail={payment === 'paid' ? '10,140.00 元' : payment === 'processing' ? '正在处理' : payment === 'retry_pending' ? '等待管理员重试' : '尚未触发'} /></CardContent></Card>
          {role === 'admin' && <Button type="button" variant="outline" onClick={resetDemo} className="h-12 w-full rounded-xl text-base font-black"><RefreshCw />重置完整演示</Button>}
        </aside>
      </div>
    </main>
  );
}

function OrderAction({ role, fulfillment, payment, onDelivery, onInspection, onRetry }: { role: string; fulfillment: string; payment: string; onDelivery: () => void; onInspection: () => void; onRetry: () => boolean }) {
  return <div className="mt-7 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between"><p className="flex items-center gap-2 text-base font-semibold text-slate-600"><ShieldCheck className="size-5 text-[var(--leaf)]" />系统只允许当前负责身份办理下一步</p><div>{fulfillment === 'accepted' && role === 'farmer' && <Button type="button" onClick={onDelivery} className="h-12 rounded-xl px-6 text-base font-extrabold">登记交货 <ArrowRight /></Button>}{fulfillment === 'accepted' && role !== 'farmer' && <Button disabled className="h-12 rounded-xl px-6 text-base font-extrabold" variant="secondary">等待农户登记交货</Button>}{fulfillment === 'delivered' && role === 'inspector' && <Button type="button" onClick={onInspection} className="h-12 rounded-xl bg-amber-400 px-6 text-base font-extrabold text-emerald-950 hover:bg-amber-300">开始现场验收 <ArrowRight /></Button>}{fulfillment === 'delivered' && role !== 'inspector' && <Button disabled className="h-12 rounded-xl px-6 text-base font-extrabold" variant="secondary">等待验收员操作</Button>}{payment === 'processing' && <Button disabled className="h-12 rounded-xl px-6 text-base font-extrabold"><RefreshCw className="animate-spin" />仿真付款处理中</Button>}{payment === 'retry_pending' && role === 'admin' && <Button type="button" onClick={onRetry} className="h-12 rounded-xl px-6 text-base font-extrabold"><RefreshCw />按原付款单重试</Button>}{payment === 'retry_pending' && role !== 'admin' && <Button disabled className="h-12 rounded-xl px-6 text-base font-extrabold" variant="secondary">等待管理员重试</Button>}{payment === 'paid' && <SafeLink href="/wallet" className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-[var(--leaf)] px-6 text-base font-black text-white">查看仿真收款 <WalletCards className="size-5" /></SafeLink>}</div></div>;
}

function OrderFact({ label, value }: { label: string; value: string }) {
  return <div><p className="text-sm font-semibold text-slate-500">{label}</p><p className="mt-1 text-base font-extrabold text-slate-900">{value}</p></div>;
}

function ActionPanel({ title, description, onClose, children }: { title: string; description: string; onClose: () => void; children: React.ReactNode }) {
  return <Card className="mt-5 rounded-[22px] border-2 border-emerald-200 bg-white ring-0"><CardHeader><div className="flex items-start justify-between gap-4"><div><CardTitle className="text-2xl font-black">{title}</CardTitle><CardDescription className="mt-2 text-base leading-7">{description}</CardDescription></div><Button type="button" variant="ghost" onClick={onClose} className="h-10 px-4 text-base font-bold">关闭</Button></div></CardHeader><CardContent>{children}</CardContent></Card>;
}

function AuditRow({ done, title, detail }: { done: boolean; title: string; detail: string }) {
  return <div className="flex gap-3"><span className={`mt-1 grid size-7 shrink-0 place-items-center rounded-full ${done ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>{done ? <BadgeCheck className="size-4" /> : <UserRound className="size-4" />}</span><div><p className="font-black">{title}</p><p className="mt-1 text-sm text-slate-500">{detail}</p></div></div>;
}
