"use client";

import { useQuotations } from "@/lib/quotations-store";
import { RequestListView } from "@/components/easy-lift/quotations/request-list-view";
import { WorkflowView } from "@/components/easy-lift/quotations/workflow-view";

export function QuotationsPage() {
  const selectedId = useQuotations((s) => s.selectedId);

  if (selectedId) {
    return <WorkflowView id={selectedId} />;
  }
  return <RequestListView />;
}
