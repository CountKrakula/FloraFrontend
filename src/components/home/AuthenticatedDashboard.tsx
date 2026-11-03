import { useState } from "react";
import { Droplets, Leaf, NotebookPen } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useDashboard } from "@/hooks/useDashboard";
import type { DashboardPanel } from "@/types/dashboard";

export const AuthenticatedDashboard = () => {
  const { plants, careTasks, careLogs, isLoading, error } = useDashboard(true);
  const [activePanel, setActivePanel] = useState<DashboardPanel>(null);

  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);

  const upcomingTasks = careTasks
    .filter((task) => new Date(task.nextDueAt) <= nextWeek)
    .sort(
      (first, second) =>
        new Date(first.nextDueAt).getTime() -
        new Date(second.nextDueAt).getTime(),
    );

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
          value={isLoading ? "—" : upcomingTasks.length}
          icon={<Droplets className="size-8 text-primary" aria-hidden="true" />}
          onClick={() => togglePanel("tasks")}
        />
        <DashboardSummaryCard
          active={activePanel === "logs"}
          expanded={activePanel === "logs"}
          label="Care log · View details"
          value={isLoading ? "—" : careLogs.length}
          icon={<NotebookPen className="size-8 text-primary" aria-hidden="true" />}
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
              {activePanel === "plants" &&
                "Your plants saved to your account."}
              {activePanel === "tasks" &&
                "Overdue tasks and tasks due within the next 7 days."}
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
                      <p className="font-medium text-foreground">{plant.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {plant.location}
                      </p>
                    </li>
                  ))}
                </ul>
              )
            ) : activePanel === "tasks" ? (
              upcomingTasks.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No overdue or upcoming care tasks.
                </p>
              ) : (
                <ul className="space-y-3">
                  {upcomingTasks.map((task) => (
                    <li
                      key={`${task.plantId}-${task.id}`}
                      className="flex items-center justify-between gap-4 rounded-xl bg-secondary p-4"
                    >
                      <div>
                        <p className="font-medium text-foreground">
                          {task.plantName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {task.type} · Every {task.intervalDays} days
                        </p>
                      </div>
                      <time className="shrink-0 text-sm text-muted-foreground">
                        {formatDate(task.nextDueAt)}
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
  icon: React.ReactNode;
  onClick: () => void;
};

const DashboardSummaryCard = ({
  active,
  expanded,
  label,
  value,
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
      <CardContent className="flex items-center gap-4 p-5">
        {icon}
        <div>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </button>
  </Card>
);

const formatDate = (date: string) =>
  new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
    new Date(date),
  );
