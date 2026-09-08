'use client';

import Image from 'next/image';
import { useState } from 'react';
import { ArrowDown, ArrowRight, Banknote, BookOpenCheck, Check, Clock3, Fingerprint, HandCoins, Landmark, Link2, Network, ShieldCheck, Smartphone, Sprout, WalletCards, WifiOff, Zap } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { withBasePath } from '../base-path';
import { SafeLink } from '../safe-link';

type Scene = 'mountain' | 'settlement' | 'privacy';

const sceneDetails: Record<Scene, { title: string; problem: string; ecny: string; prototype: string }> = {
  mountain: {
    title: '山区老人没有智能手机',
    problem: '普通扫码支付通常需要智能手机、应用和通信网络，老年农户可能不会操作。',
    ecny: '数字人民币公开资料介绍了卡片等硬钱包形态以及离线交易能力，为弥合数字鸿沟提供了新的选择。实际使用仍取决于运营机构、钱包和受理终端是否支持。',
    prototype: '本平台提供“虚拟硬钱包”演示：无网时先生成待核验记录，恢复网络后再模拟同步与防重复检查。',
  },
  settlement: {
    title: '交货后担心货款迟迟不到',
    problem: '小农户在订单农业中较弱势，常担心验收结果说不清、付款义务拖延。',
    ecny: '数字人民币具有“支付即结算”的设计特性。它与移动支付工具的底层货币属性和结算路径不同，但日常扫码体验都可能很快，不能简单理解成每一笔都必然更快。',
    prototype: '本平台冻结订单单价，按验收合格重量计算金额，再由平台规则调用仿真网关，让订单、验收、付款记录一一对应。',
  },
  privacy: {
    title: '农户担心个人信息被过度收集',
    problem: '支付便利不应意味着把与订单无关的个人信息全部暴露给平台或商户。',
    ecny: '数字人民币遵循“小额匿名、大额依法可溯”的可控匿名原则；它并非不受监管的匿名支付。',
    prototype: '本平台只展示办理订单所需的角色、订单和仿真钱包信息，不采集真实身份证、银行卡号或真实钱包凭证。',
  },
};

export default function DigitalRmbPage() {
  const [scene, setScene] = useState<Scene>('mountain');
  const detail = sceneDetails[scene];

  return (
    <main className="pb-28 lg:pb-14">
      <section className="ecny-hero">
        <div className="mx-auto grid max-w-7xl lg:grid-cols-[1.05fr_.95fr]">
          <div className="flex flex-col justify-center px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-18">
            <Badge className="h-8 w-fit border border-white/20 bg-white/12 px-3 text-sm font-bold text-white"><Landmark className="size-4" /> 数字人民币助农课堂</Badge>
            <h1 className="mt-5 max-w-2xl text-4xl font-black leading-tight sm:text-5xl">不只换一个付款码，<br />而是认识一种新的人民币形态</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-red-50">数字人民币是中国人民银行发行的数字形式法定货币；常用移动支付平台主要是支付工具。对农户来说，两者日常都能方便付款，但底层身份、钱包关系和特殊场景能力并不相同。</p>
            <p className="mt-5 flex max-w-2xl items-start gap-2 rounded-2xl border border-white/15 bg-black/10 p-4 text-sm leading-6 text-red-50"><ShieldCheck className="mt-0.5 size-5 shrink-0 text-amber-200" />本页介绍的是公开能力和平台设计思路。本站未接入真实数字人民币系统，所有付款、余额和硬钱包均为仿真演示。</p>
          </div>
          <div className="relative min-h-[380px] lg:min-h-full"><Image src={withBasePath('/images/mountain-hard-wallet.png')} alt="山区老年农户使用卡片形态硬钱包的情景演示" fill priority sizes="(max-width: 1024px) 100vw, 560px" className="object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-red-950/55 via-transparent to-transparent" /><div className="absolute inset-x-5 bottom-5 rounded-2xl border border-white/25 bg-red-950/80 p-4 text-white backdrop-blur"><p className="text-lg font-black">山区、老人、弱网场景</p><p className="mt-1 text-sm leading-6 text-red-50">硬钱包让数字人民币不只存在于智能手机应用中。</p></div></div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <section className="py-12">
          <div className="max-w-3xl"><p className="section-kicker">先弄懂本质</p><h2 className="text-3xl font-black sm:text-4xl">数字人民币与传统移动支付，主要差在哪里？</h2><p className="mt-4 text-lg leading-8 text-slate-600">这里比较的是底层属性和能力，不是说某一种方式在所有情况下都更方便。数字人民币与现有支付工具是互补关系。</p></div>
          <div className="mt-7 overflow-hidden rounded-[24px] border border-emerald-950/10 bg-white shadow-[0_12px_36px_rgb(23_74_52/7%)]">
            <div className="comparison-row comparison-head"><div>比较内容</div><div><span className="comparison-icon ecny"><Landmark /></span>数字人民币</div><div><span className="comparison-icon mobile"><Smartphone /></span>常用移动支付工具</div></div>
            <ComparisonRow title="它是什么" ecny="数字形式的法定货币，定位于流通中现金（M0）。" mobile="支付渠道和技术服务，付款资金通常来自银行账户或支付账户。" />
            <ComparisonRow title="底层结算" ecny="具有“支付即结算”的设计特性。" mobile="通常涉及支付账户、银行账户和相应清算结算安排。" />
            <ComparisonRow title="账户关系" ecny="钱包与银行账户松耦合，按身份识别强度分级管理。" mobile="通常需要注册平台账户，并关联支付账户或银行卡等资金来源。" />
            <ComparisonRow title="弱网与设备" ecny="可通过符合条件的软硬钱包支持离线交易，硬钱包可采用卡片等形态。" mobile="扫码等常见方式通常依赖智能手机、应用和通信网络。" />
            <ComparisonRow title="隐私原则" ecny="遵循“小额匿名、大额依法可溯”的可控匿名原则。" mobile="按照账户、平台规则与法律要求处理交易和用户信息。" />
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-500">说明：实际数字人民币功能取决于指定运营机构、钱包等级、设备、终端和具体业务规则；传统移动支付产品的具体能力也会因平台而异。</p>
        </section>

        <section id="platform-fit" className="rounded-[30px] bg-[var(--forest)] p-6 text-white sm:p-10 lg:p-12">
          <div className="max-w-3xl"><p className="text-sm font-black tracking-[.15em] text-amber-200">这些差异怎样帮助小农户</p><h2 className="mt-3 text-3xl font-black sm:text-4xl">把数币优势放进真实的农业订单环节</h2><p className="mt-4 text-lg leading-8 text-emerald-50">请选择一个农户最常遇到的问题，下方会展示数字人民币能力与本平台演示之间的对应关系。</p></div>
          <fieldset className="mt-7 grid gap-3 border-0 p-0 md:grid-cols-3" aria-label="选择助农场景">
            <SceneButton active={scene === 'mountain'} onClick={() => setScene('mountain')} icon={WifiOff} title="山区无网收款" />
            <SceneButton active={scene === 'settlement'} onClick={() => setScene('settlement')} icon={Link2} title="验收接付款" />
            <SceneButton active={scene === 'privacy'} onClick={() => setScene('privacy')} icon={Fingerprint} title="少暴露信息" />
          </fieldset>
          <div className="mt-5 grid gap-4 rounded-[24px] bg-white p-5 text-slate-900 sm:p-7 lg:grid-cols-3" aria-live="polite">
            <StoryBlock icon={Banknote} label="农户遇到的问题" title={detail.title} text={detail.problem} />
            <StoryBlock icon={Landmark} label="数字人民币公开能力" title="它能提供什么新选择" text={detail.ecny} />
            <StoryBlock icon={BookOpenCheck} label="本平台的仿真应用" title="我们现在怎样演示" text={detail.prototype} />
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-3xl"><p className="section-kicker">四项助农价值</p><h2 className="text-3xl font-black sm:text-4xl">平台为什么选择数字人民币</h2></div>
          <div className="mt-7 grid gap-4 md:grid-cols-2">
            <BenefitCard number="01" icon={WalletCards} title="让老人也能有数字钱包入口" text="硬钱包可以采用卡片等形态，降低只会使用现金、不熟悉智能手机的农户参与数字支付的门槛。" fit="平台对应：虚拟硬钱包、无网记录、联网后同步核验。" />
            <BenefitCard number="02" icon={Link2} title="让货款与订单履约对应" text="支付即结算是数字人民币的重要设计特性；在农业订单中，可把付款记录与验收结果清楚关联。" fit="平台对应：冻结单价、验收合格量、仿真付款单一一对应。" />
            <BenefitCard number="03" icon={Fingerprint} title="兼顾便利与依法可溯" text="可控匿名是在保护合理隐私需求的同时满足依法监管要求，并非不受监管的匿名支付。" fit="平台对应：只展示办理所需信息，不采集真实身份和钱包凭证。" />
            <BenefitCard number="04" icon={Network} title="为规则化付款留下空间" text="数字人民币可通过加载不影响货币功能的智能合约实现可编程性，为条件化支付提供技术基础。" fit="平台当前只用本地规则模拟；真实接入必须由运营机构提供能力并完成合规流程。" />
          </div>
        </section>

        <section className="mt-10 rounded-[26px] border border-emerald-950/10 bg-white p-6 ring-1 ring-emerald-950/8 sm:p-8">
          <div className="max-w-3xl"><p className="section-kicker">怎么接入</p><h2 className="text-3xl font-black sm:text-4xl">从“验收通过”到“农户钱包到账”，一共四层</h2><p className="mt-4 text-lg leading-8 text-slate-600">真实接入必须通过央行指定运营机构完成。下图展示平台在其中的位置，以及“验收通过”这个事件如何触发数币条件支付、秒级到账。</p></div>
          <div className="mt-7 max-w-3xl space-y-3">
            <ArchLayer number="1" title="农户 · 软钱包 / 硬钱包" detail="接收货款的一端。硬钱包采用卡片形态，无网也能“碰一碰”收款。" />
            <ArchArrow label="支付即结算 · 货款秒级划入" />
            <ArchLayer number="2" title="平台 · 订单 / 验收 / 存证 / 条件支付规则" detail="本平台所在层：冻结单价、记录验收、生成存证；验收通过且农户确认后触发条件支付。" accent />
            <ArchArrow label="调用数币接口 · 提交条件支付" />
            <ArchLayer number="3" title="指定运营机构 · 数币钱包 / 智能合约" detail="受理条件支付请求，执行智能合约，把货款划入农户数币钱包。" />
            <ArchArrow label="登记 · 清算" />
            <ArchLayer number="4" title="中国人民银行 · 发行与登记结算" detail="数字人民币的法定货币地位与最终结算。" />
          </div>
          <p className="mt-5 max-w-3xl text-sm leading-6 text-slate-500">说明：本图为示意结构，本站未接入真实系统；实际以运营机构提供的能力与合规流程为准。</p>
        </section>

        <section className="mt-8 grid gap-4 lg:grid-cols-2">
          <Card className="rounded-[24px] border-0 bg-white ring-1 ring-emerald-950/8">
            <CardHeader><div className="flex items-start justify-between"><span className="grid size-11 place-items-center rounded-2xl bg-red-50 text-red-700"><Clock3 className="size-6" /></span><Badge className="h-8 bg-slate-100 text-slate-600">传统结算</Badge></div><CardTitle className="mt-3 text-xl font-black">为什么过去总是“慢”</CardTitle></CardHeader>
            <CardContent><p className="text-base leading-7 text-slate-600">验收后，采购方内部审批、手工打款，通常 T+1 甚至 T+N 才到账；农户只能等，也催不动。</p></CardContent>
          </Card>
          <Card className="rounded-[24px] border-0 bg-white ring-1 ring-emerald-950/8">
            <CardHeader><div className="flex items-start justify-between"><span className="grid size-11 place-items-center rounded-2xl bg-emerald-100 text-[var(--leaf)]"><Zap className="size-6" /></span><Badge className="h-8 bg-emerald-100 text-emerald-800">数币条件支付</Badge></div><CardTitle className="mt-3 text-xl font-black">为什么现在能“秒到”</CardTitle></CardHeader>
            <CardContent><p className="text-base leading-7 text-slate-600">验收通过 + 农户确认后，合约自动执行，货款秒级划入农户钱包，不取决于采购方何时打款。</p></CardContent>
          </Card>
        </section>

        <section className="mt-8">
          <div className="max-w-3xl"><p className="section-kicker">延伸价值</p><h2 className="text-3xl font-black sm:text-4xl">凭可信数据，还能做两件事</h2></div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <ExtensionCard icon={HandCoins} title="凭订单融资，先有钱种地" text="有了可信订单存证，金融机构能“看单放款”，数币定向支付农资，解决开春缺钱买种子化肥的难题。" />
            <ExtensionCard icon={Sprout} title="补贴直达，中间不截留" text="政府涉农补贴、农机补贴通过数币定向直达农户钱包，专款专用，从源头避免截留挪用。" />
          </div>
        </section>

        <section className="mb-2 grid gap-5 rounded-[26px] border border-red-100 bg-red-50 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div><p className="text-sm font-black tracking-[.12em] text-red-700">接着亲手试一试</p><h2 className="mt-2 text-2xl font-black">去钱包页体验“虚拟硬钱包离线收款”</h2><p className="mt-3 text-base leading-7 text-slate-600">你会看到离线记录为什么不能直接等同于最终到账，以及恢复网络后为什么还要同步核验。</p></div>
          <SafeLink href="/wallet#hard-wallet" className="primary-link bg-red-700 hover:bg-red-600">进入硬钱包演示 <ArrowRight /></SafeLink>
        </section>

        <section className="mt-8 rounded-[22px] bg-white p-6 ring-1 ring-emerald-950/8">
          <h2 className="text-xl font-black">资料来源与演示边界</h2>
          <p className="mt-3 text-base leading-7 text-slate-600">本页核心表述依据《中国数字人民币的研发进展白皮书》及人民银行公开说明整理，查阅日期：2026年9月6日。本站不代表中国人民银行、指定运营机构或任何银行，不提供真实金融服务。</p>
          <a className="mt-4 inline-flex min-h-11 items-center gap-2 font-black text-red-700 underline underline-offset-4" href="https://www.gov.cn/xinwen/2021-07/16/5625569/files/e944faf39ea34d46a256c2095fefeaab.pdf" target="_blank" rel="noreferrer">查看官方白皮书 <ArrowRight className="size-5" /></a>
        </section>
      </div>
    </main>
  );
}

function ComparisonRow({ title, ecny, mobile }: { title: string; ecny: string; mobile: string }) {
  return <div className="comparison-row"><div className="font-black text-slate-900">{title}</div><div>{ecny}</div><div>{mobile}</div></div>;
}

function SceneButton({ active, onClick, icon: Icon, title }: { active: boolean; onClick: () => void; icon: typeof WifiOff; title: string }) {
  return <Button type="button" aria-pressed={active} onClick={onClick} className={`h-16 justify-start rounded-2xl px-5 text-base font-black ${active ? 'bg-amber-300 text-emerald-950 hover:bg-amber-200' : 'border border-white/20 bg-white/10 text-white hover:bg-white/18 hover:text-white'}`}><Icon className="size-6" />{title}{active && <Check className="ml-auto size-5" />}</Button>;
}

function StoryBlock({ icon: Icon, label, title, text }: { icon: typeof Banknote; label: string; title: string; text: string }) {
  return <div className="rounded-2xl bg-slate-50 p-5"><span className="grid size-11 place-items-center rounded-2xl bg-emerald-100 text-[var(--leaf)]"><Icon className="size-6" /></span><p className="mt-4 text-sm font-black text-emerald-700">{label}</p><h3 className="mt-2 text-xl font-black">{title}</h3><p className="mt-3 text-base leading-7 text-slate-600">{text}</p></div>;
}

function BenefitCard({ number, icon: Icon, title, text, fit }: { number: string; icon: typeof WalletCards; title: string; text: string; fit: string }) {
  return <Card className="rounded-[24px] border-0 bg-white ring-1 ring-emerald-950/8"><CardHeader><div className="flex items-start justify-between"><span className="grid size-12 place-items-center rounded-2xl bg-red-50 text-red-700"><Icon className="size-6" /></span><span className="text-3xl font-black text-slate-100">{number}</span></div><CardTitle className="mt-4 text-2xl font-black">{title}</CardTitle><CardDescription className="mt-3 text-base leading-7 text-slate-600">{text}</CardDescription></CardHeader><CardContent><p className="rounded-2xl bg-emerald-50 p-4 text-base font-bold leading-7 text-emerald-900">{fit}</p></CardContent></Card>;
}

function ArchLayer({ number, title, detail, accent }: { number: string; title: string; detail: string; accent?: boolean }) {
  return <div className={`flex items-start gap-4 rounded-2xl border p-4 ${accent ? 'border-amber-300 bg-amber-50' : 'border-emerald-950/10 bg-slate-50'}`}><span className={`grid size-9 shrink-0 place-items-center rounded-xl text-base font-black ${accent ? 'bg-amber-300 text-emerald-950' : 'bg-emerald-100 text-[var(--leaf)]'}`}>{number}</span><div><p className="font-black">{title}</p><p className="mt-1 text-base leading-7 text-slate-600">{detail}</p></div></div>;
}

function ArchArrow({ label }: { label: string }) {
  return <div className="flex items-center gap-2 py-0.5 pl-5 text-sm font-bold text-slate-500"><ArrowDown className="size-4 text-emerald-600" />{label}</div>;
}

function ExtensionCard({ icon: Icon, title, text }: { icon: typeof HandCoins; title: string; text: string }) {
  return <Card className="rounded-[24px] border-0 bg-white ring-1 ring-emerald-950/8"><CardHeader><span className="grid size-11 place-items-center rounded-2xl bg-emerald-100 text-[var(--leaf)]"><Icon className="size-6" /></span><CardTitle className="mt-4 text-xl font-black">{title}</CardTitle><CardDescription className="mt-3 text-base leading-7 text-slate-600">{text}</CardDescription></CardHeader></Card>;
}
