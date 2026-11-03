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

const PreviewStat = ({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof Leaf;
  value: string;
  label: string;
}) => (
  <div className="rounded-lg bg-secondary p-3 text-center">
    <Icon className="mx-auto mb-1 size-4 text-primary" aria-hidden="true" />
    <p className="font-semibold text-foreground">{value}</p>
    <p className="text-[10px] text-muted-foreground">{label}</p>
  </div>
);

const PreviewPlant = ({
  name,
  status,
  imagePosition,
}: {
  name: string;
  status: string;
  imagePosition: string;
}) => (
  <div className="overflow-hidden rounded-lg border border-border">
    <img
      src={homeHero}
      alt=""
      aria-hidden="true"
      className={`h-24 w-full object-cover ${imagePosition}`}
    />
    <div className="p-2">
      <p className="text-sm font-semibold text-foreground">{name}</p>
      <p className="text-xs text-muted-foreground">{status}</p>
    </div>
  </div>
);

const PreviewDetail = ({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Leaf;
  title: string;
  description: string;
}) => (
  <div className="flex items-center gap-3">
    <Icon className="size-4 text-primary" aria-hidden="true" />
    <div>
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  </div>
);

export const VisitorHome = () => (
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

    <section className="space-y-6 py-6" aria-labelledby="flora-preview-title">
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
              <PreviewStat icon={Leaf} value="5" label="plants" />
              <PreviewStat icon={Droplets} value="2" label="to water" />
              <PreviewStat icon={NotebookPen} value="3" label="care logs" />
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
              <PreviewPlant
                name="Monstera"
                status="Water today"
                imagePosition="object-[65%_center]"
              />
              <PreviewPlant
                name="Pilea"
                status="Doing well"
                imagePosition="object-[35%_center]"
              />
              <PreviewPlant
                name="Orchid"
                status="Water tomorrow"
                imagePosition="object-[75%_center]"
              />
              <div className="flex min-h-36 flex-col items-center justify-center rounded-lg border border-dashed border-border bg-secondary p-3 text-center">
                <Leaf className="mb-2 size-6 text-primary" aria-hidden="true" />
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
              <PreviewDetail
                icon={Droplets}
                title="Next watering"
                description="Today"
              />
              <PreviewDetail
                icon={CalendarDays}
                title="Care schedule"
                description="Every 7 days"
              />
              <PreviewDetail
                icon={NotebookPen}
                title="Care history"
                description="Last watered yesterday"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  </section>
);
