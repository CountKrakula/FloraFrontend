import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type Log = {
    id: number;
    date: string;
    notes?: string | null; // optional, can be missing
    plantId: number;
};

type Props = { logs: Log[] };

export const CareLogCard = ({ logs }: Props) => {
    // Copy the array (so props aren't mutated) and sort newest first
    const sorted = [...logs].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Care Log</CardTitle>
            </CardHeader>
            <CardContent>
                {/* Empty state when there are no logs */}
                {sorted.length === 0 && (
                    <p className="text-sm text-muted-foreground">No care events yet</p>
                )}
                {/* One row per log: date on the left, notes on the right */}
                {sorted.map((log) => (
                    <div key={log.id} className="flex justify-between gap-4 border-t py-2 text-sm">
                        <span className="text-muted-foreground">
                            {new Date(log.date).toLocaleDateString()}
                        </span>
                        {/* Fall back to "No notes" if notes is null, undefined or empty */}
                        <span>{log.notes || "No notes"}</span>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
};