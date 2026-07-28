import { randomUUID } from 'crypto';

export const isVisitor = (request: any) => request?.user?.role === 'visitor';

export const demoEntity = <T extends Record<string, any>>(data: T, existing?: Record<string, any>) => ({
  ...(existing || {}),
  ...data,
  id: existing?.id || data.id || randomUUID(),
  createdAt: existing?.createdAt || new Date(),
  updatedAt: new Date(),
  __demo: true,
});

export const demoDeleted = (id?: string) => ({
  success: true,
  id,
  __demo: true,
  message: 'Visitor demo action accepted. No data was persisted.',
});
