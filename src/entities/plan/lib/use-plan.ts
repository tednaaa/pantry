import type { Ref } from 'vue';
import type { Check, PlanItem } from '@/shared/db';
import { useLiveQuery } from '@/shared/lib';
import { listChecks, listPlan } from './queries';

export function usePlan(): Ref<PlanItem[]> {
  return useLiveQuery<PlanItem[]>(() => listPlan(), []);
}

export function useChecks(): Ref<Check[]> {
  return useLiveQuery<Check[]>(() => listChecks(), []);
}
