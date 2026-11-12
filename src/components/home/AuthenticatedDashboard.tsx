import { useState } from "react";
import { BellRing, Droplets, Leaf, NotebookPen } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useDashboard } from "@/hooks/useDashboard";
import type { DashboardPanel } from "@/types/dashboard";
import { useUserCareTasksContext } from "@/hooks/useUserCareTasksContext";
import { needsCareTaskAttention } from "@/lib/careTasks";

export const AuthenticatedDashboard = () => {
  const { plants, careLogs, isLoading, error } = useDashboard();
  const [activePanel, setActivePanel] = useState<DashboardPanel>(null);
  const {
    userCareTasks,
    loading: tasksLoading,
    error: tasksError,
  } = useUserCareTasksContext();

  const tasksNeedingAttention = userCareTasks.filter((task) =>
    needsCareTaskAttention(task),
  );
  console.log({ userCareTasks, tasksNeedingAttention, tasksError });
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);

  // const upcomingTasks = careTasks
  //   .filter((task) => new Date(task.nextDueAt) <= nextWeek)
  //   .sort(
  //     (first, second) =>
  //       new Date(first.nextDueAt).getTime() -
  //       new Date(second.nextDueAt).getTime(),
  //   );

  const recentCareLogs = [...careLogs]
    .sort(
      (first, second) =>
        new Date(second.date).getTime() - new Date(first.date).getTime(),
    )
    .slice(0, 5);

  const togglePanel = (panel: DashboardPanel) => {
    setActivePanel((current) => (current === panel ? null : panel));
  };

  return (
    <section className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8 sm:py-12">
      <div>
        <p className="font-medium text-primary">Your plant overview</p>
        <h1 className="mt-2 font-serif text-4xl font-semibold italic tracking-wide text-primary sm:text-5xl">
          Welcome back!
        </h1>
        <p className="mt-2 text-muted-foreground">
          Here is what is happening with your plants.
        </p>
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-xl border border-destructive/30 bg-card p-4 text-destructive"
        >
          {error}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <DashboardSummaryCard
          active={activePanel === "plants"}
          expanded={activePanel === "plants"}
          label="My plants · View details"
          value={isLoading ? "—" : plants.length}
          icon={<Leaf className="size-8 text-primary" aria-hidden="true" />}
          onClick={() => togglePanel("plants")}
        />
        <DashboardSummaryCard
          active={activePanel === "tasks"}
          expanded={activePanel === "tasks"}
          label="Care tasks · View details"
          value={tasksLoading || tasksError ? "—" : userCareTasks.length}
          attentionCount={
            tasksLoading || tasksError ? 0 : tasksNeedingAttention.length
          }
          icon={<Droplets className="size-8 text-primary" aria-hidden="true" />}
          onClick={() => togglePanel("tasks")}
        />
        <DashboardSummaryCard
          active={activePanel === "logs"}
          expanded={activePanel === "logs"}
          label="Care log · View details"
          value={isLoading ? "—" : careLogs.length}
          icon={
            <NotebookPen className="size-8 text-primary" aria-hidden="true" />
          }
          onClick={() => togglePanel("logs")}
        />
      </div>

      {activePanel && (
        <Card id="dashboard-details" className="bg-card shadow-sm">
          <CardHeader>
            <CardTitle>
              {activePanel === "plants" && "My plants"}
              {activePanel === "tasks" && "Care tasks needing attention"}
              {activePanel === "logs" && "Recent care log entries"}
            </CardTitle>
            <CardDescription>
              {activePanel === "plants" && "Your plants saved to your account."}
              {activePanel === "logs" &&
                "The latest care notes saved for your plants."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-sm text-muted-foreground">
                Loading your data...
              </p>
            ) : activePanel === "plants" ? (
              plants.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  You have not added any plants yet.
                </p>
              ) : (
                <ul className="space-y-3">
                  {plants.map((plant) => (
                    <li key={plant.id} className="rounded-xl bg-secondary p-4">
                      <p className="font-medium text-foreground">
                        {plant.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {plant.location}
                      </p>
                    </li>
                  ))}
                </ul>
              )
            ) : activePanel === "tasks" ? (
              tasksNeedingAttention.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No overdue or upcoming care tasks.
                </p>
              ) : (
                <ul className="space-y-3">
                  {tasksNeedingAttention.map((task) => (
                    <li
                      key={`${task.plantId}-${task.id}`}
                      className="flex items-center justify-between gap-4 rounded-xl border border-warning-border border-l-4 border-l-warning bg-warning-background p-4"
                    >
                      <div>
                        <p className="font-medium text-foreground">
                          {task.plantName}
                        </p>
                        <div className="flex gap-2 items-center">
                          <BellRing className="size-4" aria-hidden="true" />

                          <p className="text-sm text-muted-foreground">
                            {task.type}
                          </p>
                        </div>
                      </div>
                      <time className="shrink-0 text-sm text-muted-foreground">
                        Due {formatDate(task.nextDueAt)}
                      </time>
                    </li>
                  ))}
                </ul>
              )
            ) : recentCareLogs.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No care log entries yet.
              </p>
            ) : (
              <ul className="space-y-3">
                {recentCareLogs.map((careLog) => (
                  <li
                    key={`${careLog.plantId}-${careLog.id}`}
                    className="rounded-xl bg-secondary p-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <p className="font-medium text-foreground">
                        {careLog.plantName}
                      </p>
                      <time className="shrink-0 text-sm text-muted-foreground">
                        {formatDate(careLog.date)}
                      </time>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {careLog.notes || "Care recorded"}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      )}
    </section>
  );
};

type DashboardSummaryCardProps = {
  active: boolean;
  expanded: boolean;
  label: string;
  value: number | string;
  attentionCount?: number;
  icon: React.ReactNode;
  onClick: () => void;
};

const DashboardSummaryCard = ({
  active,
  expanded,
  label,
  value,
  attentionCount = 0,
  icon,
  onClick,
}: DashboardSummaryCardProps) => (
  <Card
    className={`bg-card shadow-sm transition-shadow hover:shadow-md ${active ? "border-primary" : ""}`}
  >
    <button
      type="button"
      aria-expanded={expanded}
      aria-controls="dashboard-details"
      onClick={onClick}
      className="w-full rounded-xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <CardContent className="flex flex-col gap-3 p-5">
        <div className="flex items-center gap-4">
          {" "}
          {icon}
          <div>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            <p className="text-sm text-muted-foreground">{label}</p>
          </div>
        </div>
        {attentionCount > 0 && (
          <div className="mt-4 flex items-center gap-2 border-t pt-3 text-sm text-warning">
            <BellRing className="size-4" aria-hidden="true" />
            <span>
              {attentionCount}{" "}
              {attentionCount === 1
                ? "task needs attention"
                : "tasks need attention"}
            </span>{" "}
          </div>
        )}
      </CardContent>
    </button>
  </Card>
);

const formatDate = (date: string) =>
  new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
    new Date(date),
  );
