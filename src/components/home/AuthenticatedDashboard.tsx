import { useState } from "react";
import { Link } from "react-router-dom";
import { BellRing, Droplets, Leaf, NotebookPen, Plus } from "lucide-react";
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
import { isCareTaskUpcoming, needsCareTaskAttention } from "@/lib/careTasks";
import { DashboardSummaryCard } from "./DashboardSummaryCard";
import { formatDate } from "@/lib/date";
import { Button } from "../ui/button";
import { AddPlantDialog } from "../plants/AddPlantDialog";

export const AuthenticatedDashboard = () => {
  const { plants, careLogs, isLoading, error, addPlant } = useDashboard();
  const [activePanel, setActivePanel] = useState<DashboardPanel>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const {
    userCareTasks,
    loading: tasksLoading,
    error: tasksError,
  } = useUserCareTasksContext();

  const tasksNeedingAttention = userCareTasks.filter((task) =>
    needsCareTaskAttention(task),
  );
  const tasksUpcoming = userCareTasks.filter((task) =>
    isCareTaskUpcoming(task),
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
          label="My plants"
          value={isLoading ? "—" : plants.length}
          icon={<Leaf className="size-8 text-primary" aria-hidden="true" />}
          onClick={() => togglePanel("plants")}
          navigateTo="/my-plants"
        />
        <DashboardSummaryCard
          active={activePanel === "tasks"}
          expanded={activePanel === "tasks"}
          label="Care tasks"
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
          label="Care los"
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
            <div className="flex items-center justify-between gap-4">
              <CardTitle>
                {activePanel === "plants" && "My plants"}
                {activePanel === "tasks" && "Care tasks needing attention"}
                {activePanel === "logs" && "Recent care log entries"}
              </CardTitle>
              {activePanel === "plants" && (
                <Button onClick={() => setIsAddModalOpen(true)}>
                  <Plus />
                  Add plant
                </Button>
              )}
            </div>
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
                  You haven’t added any plants yet.
                </p>
              ) : (
                <ul className="space-y-3">
                  {plants.map((plant) => (
                    <li key={plant.id}>
                      <Link
                        to={`/plant-details/${plant.id}`}
                        className="block rounded-xl bg-secondary p-4 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <p className="font-medium text-foreground">
                          {plant.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {plant.location}
                        </p>
                      </Link>
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
                <div>
                  <ul className="space-y-3">
                    {tasksNeedingAttention.map((task) => (
                      <li key={`${task.plantId}-${task.id}`}>
                        <Link
                          to={`/plant-details/${task.plantId}`}
                          className="flex items-center justify-between gap-4 rounded-xl border border-warning-border border-l-4 border-l-warning bg-warning-background p-4 transition-colors hover:border-warning focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
                        </Link>
                      </li>
                    ))}
                  </ul>
                  {tasksUpcoming.length > 0 ? (
                    <div className="mt-6">
                      <p className="mb-2 text-sm font-medium text-foreground">
                        Upcoming care tasks
                      </p>
                      <p className="text-sm text-muted-foreground">
                        These tasks are due in the next three days.
                      </p>
                    </div>
                  ) : (
                    <p className="mt-6 text-sm text-muted-foreground">
                      No care tasks due in the next three days.
                    </p>
                  )}
                  <ul className="space-y-3">
                    {tasksUpcoming.map((task) => (
                      <li key={`${task.plantId}-${task.id}`}>
                        <Link
                          to={`/plant-details/${task.plantId}`}
                          className="flex items-center justify-between gap-4 rounded-xl bg-secondary p-4 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
                            Due {formatDate(task.nextDueAt)}
                          </time>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            ) : recentCareLogs.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No care log entries yet.
              </p>
            ) : (
              <ul className="space-y-3">
                {recentCareLogs.map((careLog) => (
                  <li key={`${careLog.plantId}-${careLog.id}`}>
                    <Link
                      to={`/plant-details/${careLog.plantId}`}
                      className="block rounded-xl bg-secondary p-4 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      )}
      <AddPlantDialog
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddPlant={(plant) => addPlant(plant)}
      ></AddPlantDialog>
    </section>
  );
};
