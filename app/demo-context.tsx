'use client';

import { createContext, useContext, useEffect, useState } from 'react';

export type Role = 'farmer' | 'inspector' | 'buyer' | 'admin';
export type FulfillmentState = 'accepted' | 'delivered' | 'inspection_passed' | 'completed';
export type PaymentState = 'not_due' | 'processing' | 'paid' | 'retry_pending';
export type OfflineReceipt = 'none' | 'queued' | 'synced';

type DemoState = {
  role: Role;
  fulfillment: FulfillmentState;
  payment: PaymentState;
  offlineReceipt: OfflineReceipt;
  notice: string;
};

type DemoContextValue = DemoState & {
  paymentFen: number;
  expectedFen: number;
  walletFen: number;
  setRole: (role: Role) => void;
  recordDelivery: () => boolean;
  passInspection: () => boolean;
  retryPayment: () => boolean;
  recordOfflineReceipt: () => boolean;
  syncOfflineReceipt: () => boolean;
  resetOfflineReceipt: () => void;
  resetDemo: () => void;
};

export const PAYMENT_FEN = 1_014_000;
export const EXPECTED_FEN = 1_040_000;
export const WALLET_OPENING_FEN = 2_865_000;

export const roles: Record<Role, string> = {
  farmer: '李建国・农户',
  inspector: '王师傅・验收员',
  buyer: '丰禾公司・采购方',
  admin: '平台管理员',
};

const STORAGE_KEY = 'huinong-demo-v2';
const DEFAULT_STATE: DemoState = {
  role: 'farmer',
  fulfillment: 'accepted',
  payment: 'not_due',
  offlineReceipt: 'none',
  notice: '',
};

const DemoContext = createContext<DemoContextValue | null>(null);

function isRole(value: unknown): value is Role {
  return value === 'farmer' || value === 'inspector' || value === 'buyer' || value === 'admin';
}

function isFulfillment(value: unknown): value is FulfillmentState {
  return value === 'accepted' || value === 'delivered' || value === 'inspection_passed' || value === 'completed';
}

function isPayment(value: unknown): value is PaymentState {
  return value === 'not_due' || value === 'processing' || value === 'paid' || value === 'retry_pending';
}

function isOfflineReceipt(value: unknown): value is OfflineReceipt {
  return value === 'none' || value === 'queued' || value === 'synced';
}

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<DemoState>(DEFAULT_STATE);
  const [restored, setRestored] = useState(false);

  useEffect(() => {
    let nextState = DEFAULT_STATE;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as Partial<DemoState>;
        const payment = saved.payment === 'processing' ? 'retry_pending' : saved.payment;
        nextState = {
          role: isRole(saved.role) ? saved.role : DEFAULT_STATE.role,
          fulfillment: isFulfillment(saved.fulfillment) ? saved.fulfillment : DEFAULT_STATE.fulfillment,
          payment: isPayment(payment) ? payment : DEFAULT_STATE.payment,
          offlineReceipt: isOfflineReceipt(saved.offlineReceipt) ? saved.offlineReceipt : DEFAULT_STATE.offlineReceipt,
          notice: '',
        };
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    window.setTimeout(() => {
      setState(nextState);
      setRestored(true);
    }, 0);
  }, []);

  useEffect(() => {
    if (!restored) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, notice: '' }));
  }, [restored, state]);

  function setRole(role: Role) {
    setState((current) => ({ ...current, role, notice: `已切换为：${roles[role]}` }));
  }

  function recordDelivery() {
    if (state.role !== 'farmer' || state.fulfillment !== 'accepted') return false;
    setState((current) => ({ ...current, fulfillment: 'delivered', notice: '交货登记成功，订单正在等待验收员验收。' }));
    return true;
  }

  function finishSimulatedPayment() {
    window.setTimeout(() => {
      setState((current) => current.payment === 'processing'
        ? { ...current, fulfillment: 'completed', payment: 'paid', notice: '仿真付款完成：10,140.00 元已记入农户虚拟钱包。' }
        : current);
    }, 900);
  }

  function passInspection() {
    if (state.role !== 'inspector' || state.fulfillment !== 'delivered' || state.payment !== 'not_due') return false;
    setState((current) => ({ ...current, fulfillment: 'inspection_passed', payment: 'processing', notice: '验收通过，平台正在调用数字人民币仿真支付网关。' }));
    finishSimulatedPayment();
    return true;
  }

  function retryPayment() {
    if (state.role !== 'admin' || state.fulfillment !== 'inspection_passed' || state.payment !== 'retry_pending') return false;
    setState((current) => ({ ...current, payment: 'processing', notice: '正在按原付款义务重试，不会新建第二笔付款。' }));
    finishSimulatedPayment();
    return true;
  }

  function recordOfflineReceipt() {
    if (state.offlineReceipt !== 'none') return false;
    setState((current) => ({ ...current, offlineReceipt: 'queued', notice: '离线记录已保存在本机，尚未完成到账核验。' }));
    return true;
  }

  function syncOfflineReceipt() {
    if (state.offlineReceipt !== 'queued') return false;
    setState((current) => ({ ...current, offlineReceipt: 'synced', notice: '离线记录已完成仿真同步核验。' }));
    return true;
  }

  function resetOfflineReceipt() {
    setState((current) => ({ ...current, offlineReceipt: 'none', notice: '硬钱包演示已重置。' }));
  }

  function resetDemo() {
    setState((current) => ({ ...DEFAULT_STATE, role: current.role, notice: '订单和钱包演示数据已重置。' }));
  }

  useEffect(() => {
    const context = (document as Document & {
      modelContext?: {
        registerTool: (tool: Record<string, unknown>, options?: { signal?: AbortSignal }) => void | Promise<void>;
      };
    }).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    const register = (tool: Record<string, unknown>) => Promise.resolve(context.registerTool(tool, { signal: lifecycle.signal })).catch(() => undefined);

    void register({
      name: 'read_demo_order_status',
      title: '查看演示订单状态',
      description: '读取红富士苹果演示订单的履约与数字人民币仿真付款状态。',
      inputSchema: { type: 'object', properties: {}, additionalProperties: false },
      annotations: { readOnlyHint: true, untrustedContentHint: false },
      execute: () => ({ orderId: 'HN20260906001', fulfillment: state.fulfillment, simulatedPayment: state.payment }),
    });
    void register({
      name: 'record_demo_delivery',
      title: '登记演示订单交货',
      description: '以农户身份登记本机演示订单交货；不涉及真实订单或资金。',
      inputSchema: { type: 'object', properties: {}, additionalProperties: false },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute: () => {
        if (state.role !== 'farmer' || state.fulfillment !== 'accepted') throw new Error('当前身份或订单状态不能登记交货');
        setState((current) => ({ ...current, fulfillment: 'delivered', notice: '交货登记成功，订单正在等待验收员验收。' }));
        return { orderId: 'HN20260906001', fulfillment: 'delivered' };
      },
    });
    return () => lifecycle.abort();
  }, [state.fulfillment, state.payment, state.role]);

  const value: DemoContextValue = {
    ...state,
    paymentFen: PAYMENT_FEN,
    expectedFen: EXPECTED_FEN,
    walletFen: WALLET_OPENING_FEN + (state.payment === 'paid' ? PAYMENT_FEN : 0),
    setRole,
    recordDelivery,
    passInspection,
    retryPayment,
    recordOfflineReceipt,
    syncOfflineReceipt,
    resetOfflineReceipt,
    resetDemo,
  };

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const context = useContext(DemoContext);
  if (!context) throw new Error('useDemo must be used within DemoProvider');
  return context;
}

export function formatMoney(fen: number) {
  return new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY' }).format(fen / 100);
}
