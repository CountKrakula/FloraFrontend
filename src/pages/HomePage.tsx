import { useEffect, useState } from "react";
import { checkAuthentication } from "@/service/AuthService";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CalendarDays, Droplets, Leaf, NotebookPen } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import homeHero from "@/assets/home-hero.jpeg";
import { get } from "@/service/serviceBase";

type PlantDto = {
    id: number;
    name: string;
    location: string;
    notes: string | null;
    createdAt: string;
};

type CareTaskDto = {
    id: number;
    type: string;
    intervalDays: number;
    lastDoneAt: string | null;
    nextDueAt: string;
    plantId: number;
};

type CareLogDto = {
    id: number;
    date: string;
    notes: string | null;
    plantId: number;
};

type DashboardTask = CareTaskDto & { plantName: string };
type DashboardCareLog = CareLogDto & { plantName: string };
type DashboardPanel = "plants" | "tasks" | "logs" | null;

export const HomePage = () => {
    const [authStatus, setAuthStatus] = useState<
        "checking" | "authenticated" | "guest"
    >("checking");
    const [plants, setPlants] = useState<PlantDto[]>([]);
    const [careTasks, setCareTasks] = useState<DashboardTask[]>([]);
    const [careLogs, setCareLogs] = useState<DashboardCareLog[]>([]);
    const [dashboardLoading, setDashboardLoading] = useState(false);
    const [dashboardError, setDashboardError] = useState<string | null>(null);
    const [activePanel, setActivePanel] = useState<DashboardPanel>(null);

    useEffect(() => {
        let isMounted = true;

        checkAuthentication()
            .then((isAuthenticated) => {
                if (isMounted) {
                    setAuthStatus(isAuthenticated ? "authenticated" : "guest");
                }
            })
            .catch(() => {
                if (isMounted) {
                    setAuthStatus("guest");
                }
            });

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        if (authStatus !== "authenticated") return;

        let isMounted = true;

        const loadDashboard = async () => {
            setDashboardLoading(true);
            setDashboardError(null);

            try {
                const userPlants = await get<PlantDto[]>("/api/Plants");
                const plantDetails = await Promise.all(
                    userPlants.map(async (plant) => {
                        const [plantTasks, plantCareLogs] = await Promise.all([
                            get<CareTaskDto[]>(`/api/plants/${plant.id}/caretasks`),
                            get<CareLogDto[]>(`/api/plants/${plant.id}/carelogs`),
                        ]);

                        return {
                            plant,
                            tasks: plantTasks.map((task) => ({
                                ...task,
                                plantName: plant.name,
                            })),
                            careLogs: plantCareLogs.map((careLog) => ({
                                ...careLog,
                                plantName: plant.name,
                            })),
                        };
                    }),
                );

                if (isMounted) {
                    setPlants(userPlants);
                    setCareTasks(plantDetails.flatMap((item) => item.tasks));
                    setCareLogs(plantDetails.flatMap((item) => item.careLogs));
                }
            } catch {
                if (isMounted) {
                    setDashboardError(
                        "We could not load your dashboard. Check that the backend and database are running, then try again.",
                    );
                }
            } finally {
                if (isMounted) setDashboardLoading(false);
            }
        };

        void loadDashboard();

        return () => {
            isMounted = false;
        };
    }, [authStatus]);

    if (authStatus === "checking") {
        return <p className="p-8 text-center">Checking login...</p>;
    }

    if (authStatus === "authenticated") {
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

                {dashboardError && (
                    <p role="alert" className="rounded-xl border border-destructive/30 bg-card p-4 text-destructive">
                        {dashboardError}
                    </p>
                )}

                <div className="grid gap-4 sm:grid-cols-3">
                    <Card className={`bg-card shadow-sm transition-shadow hover:shadow-md ${activePanel === "plants" ? "border-primary" : ""}`}>
                        <button type="button" aria-expanded={activePanel === "plants"} aria-controls="dashboard-details" onClick={() => setActivePanel(activePanel === "plants" ? null : "plants")} className="w-full rounded-xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                            <CardContent className="flex items-center gap-4 p-5">
                                <Leaf className="size-8 text-primary" aria-hidden="true" />
                                <div>
                                    <p className="text-2xl font-bold text-foreground">{dashboardLoading ? "—" : plants.length}</p>
                                    <p className="text-sm text-muted-foreground">My plants · View details</p>
                                </div>
                            </CardContent>
                        </button>
                    </Card>
                    <Card className={`bg-card shadow-sm transition-shadow hover:shadow-md ${activePanel === "tasks" ? "border-primary" : ""}`}>
                        <button type="button" aria-expanded={activePanel === "tasks"} aria-controls="dashboard-details" onClick={() => setActivePanel(activePanel === "tasks" ? null : "tasks")} className="w-full rounded-xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                            <CardContent className="flex items-center gap-4 p-5">
                                <Droplets className="size-8 text-primary" aria-hidden="true" />
                                <div>
                                    <p className="text-2xl font-bold text-foreground">{dashboardLoading ? "—" : upcomingTasks.length}</p>
                                    <p className="text-sm text-muted-foreground">Care tasks · View details</p>
                                </div>
                            </CardContent>
                        </button>
                    </Card>
                    <Card className={`bg-card shadow-sm transition-shadow hover:shadow-md ${activePanel === "logs" ? "border-primary" : ""}`}>
                        <button type="button" aria-expanded={activePanel === "logs"} aria-controls="dashboard-details" onClick={() => setActivePanel(activePanel === "logs" ? null : "logs")} className="w-full rounded-xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                            <CardContent className="flex items-center gap-4 p-5">
                                <NotebookPen className="size-8 text-primary" aria-hidden="true" />
                                <div>
                                    <p className="text-2xl font-bold text-foreground">{dashboardLoading ? "—" : careLogs.length}</p>
                                    <p className="text-sm text-muted-foreground">Care log · View details</p>
                                </div>
                            </CardContent>
                        </button>
                    </Card>
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
                                {activePanel === "tasks" && "Overdue tasks and tasks due within the next 7 days."}
                                {activePanel === "logs" && "The latest care notes saved for your plants."}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {dashboardLoading ? (
                                <p className="text-sm text-muted-foreground">Loading your data...</p>
                            ) : activePanel === "plants" ? (
                                plants.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">You have not added any plants yet.</p>
                                ) : (
                                    <ul className="space-y-3">
                                        {plants.map((plant) => (
                                            <li key={plant.id} className="rounded-xl bg-secondary p-4">
                                                <p className="font-medium text-foreground">{plant.name}</p>
                                                <p className="text-sm text-muted-foreground">{plant.location}</p>
                                            </li>
                                        ))}
                                    </ul>
                                )
                            ) : activePanel === "tasks" ? (
                                upcomingTasks.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">No overdue or upcoming care tasks.</p>
                                ) : (
                                    <ul className="space-y-3">
                                        {upcomingTasks.map((task) => (
                                            <li key={`${task.plantId}-${task.id}`} className="flex items-center justify-between gap-4 rounded-xl bg-secondary p-4">
                                                <div>
                                                    <p className="font-medium text-foreground">{task.plantName}</p>
                                                    <p className="text-sm text-muted-foreground">{task.type} · Every {task.intervalDays} days</p>
                                                </div>
                                                <time className="shrink-0 text-sm text-muted-foreground">
                                                    {new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(task.nextDueAt))}
                                                </time>
                                            </li>
                                        ))}
                                    </ul>
                                )
                            ) : recentCareLogs.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No care log entries yet.</p>
                            ) : (
                                <ul className="space-y-3">
                                    {recentCareLogs.map((careLog) => (
                                        <li key={`${careLog.plantId}-${careLog.id}`} className="rounded-xl bg-secondary p-4">
                                            <div className="flex items-center justify-between gap-4">
                                                <p className="font-medium text-foreground">{careLog.plantName}</p>
                                                <time className="shrink-0 text-sm text-muted-foreground">
                                                    {new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(careLog.date))}
                                                </time>
                                            </div>
                                            <p className="mt-1 text-sm text-muted-foreground">{careLog.notes || "Care recorded"}</p>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </CardContent>
                    </Card>
                )}
            </section>
        );
    }
    return (
        <section className="mx-auto w-full max-w-6xl space-y-12 px-4 py-8 sm:py-12">
            <div className="relative isolate flex min-h-[28rem] items-center overflow-hidden rounded-3xl border border-border bg-background px-6 py-12 shadow-lg sm:min-h-[32rem] sm:px-12">
                <div className="absolute inset-0">
                    <img
                        src={homeHero}
                        alt=""
                        aria-hidden="true"
                        className="h-full w-full object-cover object-[65%_center]"
                    />
                    <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-gradient-to-r from-background/85 via-background/50 to-transparent"
                    />
                </div>

                <div className="relative z-10 max-w-xl text-left">
                    <p className="mb-3 font-medium text-primary">
                        Your home for happy houseplants
                    </p>

                    <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                        Make caring for your plants simple
                    </h1>

                    <p className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
                        Keep your plants organized, learn what they need, and remember when
                        it is time to care for them.
                    </p>

                    <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                        <Button render={<Link to="/login" />}>Log in</Button>

                        <Button variant="outline" render={<Link to="/register" />}>
                            Sign up
                        </Button>
                    </div>
                </div>
            </div>

            <section
                className="space-y-6 py-6"
                aria-labelledby="flora-preview-title"
            >
                <div className="text-center">
                    <div
                        className="mb-2 flex items-center justify-center gap-3 text-primary"
                        aria-hidden="true"
                    >
                        <span className="h-px w-16 bg-border sm:w-24" />
                        <Leaf className="size-5" />
                        <span className="h-px w-16 bg-border sm:w-24" />
                    </div>

                    <h2
                        id="flora-preview-title"
                        className="font-serif text-3xl font-semibold text-foreground sm:text-4xl"
                    >
                        Discover Flora
                    </h2>

                    <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                        See how easy it is to keep track of your plants.
                    </p>
                </div>

                <div className="grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    <Card className="relative overflow-hidden bg-card shadow-lg transition-all duration-300 ease-out hover:z-10 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-xl motion-reduce:transition-none">
                        <CardContent className="space-y-4 p-4">
                            <div className="flex items-center justify-between border-b border-border pb-3">
                                <span className="flex items-center gap-1 font-serif font-semibold text-primary">
                                    <Leaf className="size-4" aria-hidden="true" />
                                    Flora
                                </span>
                                <CalendarDays
                                    className="size-4 text-muted-foreground"
                                    aria-hidden="true"
                                />
                            </div>

                            <div>
                                <p className="font-serif text-lg font-semibold text-foreground">
                                    Welcome back!
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Here is a quick look at your plants.
                                </p>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                <div className="rounded-lg bg-secondary p-3 text-center">
                                    <Leaf
                                        className="mx-auto mb-1 size-4 text-primary"
                                        aria-hidden="true"
                                    />
                                    <p className="font-semibold text-foreground">5</p>
                                    <p className="text-[10px] text-muted-foreground">plants</p>
                                </div>

                                <div className="rounded-lg bg-secondary p-3 text-center">
                                    <Droplets
                                        className="mx-auto mb-1 size-4 text-primary"
                                        aria-hidden="true"
                                    />
                                    <p className="font-semibold text-foreground">2</p>
                                    <p className="text-[10px] text-muted-foreground">to water</p>
                                </div>

                                <div className="rounded-lg bg-secondary p-3 text-center">
                                    <NotebookPen
                                        className="mx-auto mb-1 size-4 text-primary"
                                        aria-hidden="true"
                                    />
                                    <p className="font-semibold text-foreground">3</p>
                                    <p className="text-[10px] text-muted-foreground">care logs</p>
                                </div>
                            </div>

                            <div className="rounded-lg border border-border p-3">
                                <p className="mb-2 text-sm font-semibold text-foreground">
                                    Today’s care
                                </p>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="flex items-center gap-2 text-foreground">
                                        <Droplets
                                            className="size-4 text-primary"
                                            aria-hidden="true"
                                        />
                                        Monstera · Water
                                    </span>
                                    <span className="text-muted-foreground">Today</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden bg-card shadow-lg transition-all duration-300 ease-out hover:z-10 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-xl motion-reduce:transition-none">
                        <CardHeader className="p-4 pb-3">
                            <CardTitle className="flex items-center justify-between text-base">
                                My plants
                                <Leaf className="size-4 text-primary" aria-hidden="true" />
                            </CardTitle>
                            <CardDescription className="text-xs">
                                Your collection in one place.
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-3 p-4 pt-0">
                            <div className="rounded-full border border-border px-3 py-2 text-xs text-muted-foreground">
                                Search your plants...
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="overflow-hidden rounded-lg border border-border">
                                    <img
                                        src={homeHero}
                                        alt=""
                                        aria-hidden="true"
                                        className="h-24 w-full object-cover object-[65%_center]"
                                    />
                                    <div className="p-2">
                                        <p className="text-sm font-semibold text-foreground">
                                            Monstera
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Water today
                                        </p>
                                    </div>
                                </div>

                                <div className="overflow-hidden rounded-lg border border-border">
                                    <img
                                        src={homeHero}
                                        alt=""
                                        aria-hidden="true"
                                        className="h-24 w-full object-cover object-[35%_center]"
                                    />
                                    <div className="p-2">
                                        <p className="text-sm font-semibold text-foreground">
                                            Pilea
                                        </p>
                                        <p className="text-xs text-muted-foreground">Doing well</p>
                                    </div>
                                </div>

                                <div className="overflow-hidden rounded-lg border border-border">
                                    <img
                                        src={homeHero}
                                        alt=""
                                        aria-hidden="true"
                                        className="h-24 w-full object-cover object-[75%_center]"
                                    />
                                    <div className="p-2">
                                        <p className="text-sm font-semibold text-foreground">
                                            Orchid
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Water tomorrow
                                        </p>
                                    </div>
                                </div>

                                <div className="flex min-h-36 flex-col items-center justify-center rounded-lg border border-dashed border-border bg-secondary p-3 text-center">
                                    <Leaf
                                        className="mb-2 size-6 text-primary"
                                        aria-hidden="true"
                                    />
                                    <p className="text-sm font-semibold text-foreground">
                                        Add a plant
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Grow your collection
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden bg-card shadow-lg transition-all duration-300 ease-out hover:z-10 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-xl motion-reduce:transition-none sm:col-span-2 lg:col-span-1">
                        <CardContent className="space-y-4 p-4">
                            <img
                                src={homeHero}
                                alt=""
                                aria-hidden="true"
                                className="h-40 w-full rounded-xl object-cover object-[65%_center]"
                            />

                            <div>
                                <p className="font-serif text-xl font-semibold text-foreground">
                                    Monstera
                                </p>
                                <p className="text-sm text-muted-foreground">Tropical plant</p>
                            </div>

                            <div className="space-y-3 rounded-xl bg-secondary p-4">
                                <div className="flex items-center gap-3">
                                    <Droplets
                                        className="size-4 text-primary"
                                        aria-hidden="true"
                                    />
                                    <div>
                                        <p className="text-sm font-medium text-foreground">
                                            Next watering
                                        </p>
                                        <p className="text-xs text-muted-foreground">Today</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <CalendarDays
                                        className="size-4 text-primary"
                                        aria-hidden="true"
                                    />
                                    <div>
                                        <p className="text-sm font-medium text-foreground">
                                            Care schedule
                                        </p>
                                        <p className="text-xs text-muted-foreground">Every 7 days</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <NotebookPen
                                        className="size-4 text-primary"
                                        aria-hidden="true"
                                    />
                                    <div>
                                        <p className="text-sm font-medium text-foreground">
                                            Care history
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Last watered yesterday
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </section>
    );
};
