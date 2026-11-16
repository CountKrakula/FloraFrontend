import { BellRing, ArrowRight } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

type DashboardSummaryCardProps = {
  active: boolean;
  expanded: boolean;
  label: string;
  value: number | string;
  attentionCount?: number;
  icon: React.ReactNode;
  onClick: () => void;
  navigateTo?: string;
};

export const DashboardSummaryCard = ({
  active,
  expanded,
  label,
  value,
  attentionCount = 0,
  icon,
  onClick,
  navigateTo,
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
            <p className="text-sm text-muted-foreground">
              {label} · View details
            </p>
          </div>
        </div>
        {navigateTo && (
          <Button
            variant="link"
            nativeButton={false}
            className="w-fit px-3 py-1 text-sm"
            render={<Link to={navigateTo} />}
          >
            Go to {label} <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
        )}
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
