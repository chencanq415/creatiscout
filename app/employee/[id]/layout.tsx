import { notFound } from "next/navigation";
import { FloatingAsk } from "@/components/floating-ask";
import { NewTaskDrawer } from "@/components/new-task-drawer";
import { EmployeeSidebar } from "@/components/sidebar/employee-sidebar";
import { Topbar } from "@/components/topbar";
import { employees, getEmployee } from "@/lib/mock/employees";

export const dynamicParams = false;

export function generateStaticParams() {
  return employees.map((employee) => ({ id: employee.id }));
}

export default async function EmployeeLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const employee = getEmployee(id);
  if (!employee) return notFound();

  return (
    <div className="flex h-screen overflow-hidden bg-page">
      <EmployeeSidebar employee={employee} />
      <div className="flex min-w-0 flex-1 gap-2 py-2 pr-2">
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-panel bg-surface shadow-panel">
          <Topbar />
          <main className="min-h-0 flex-1 overflow-y-auto bg-surface">{children}</main>
        </div>
        <NewTaskDrawer />
      </div>
      <FloatingAsk />
    </div>
  );
}
