import { CalendarDays, Leaf, NotebookPen } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Bring your plants together",
    description:
      "Add each plant by name, note where it lives in your home, and keep personal notes about its needs. You can use those notes for details such as how you check the soil. The Plant Library offers species information, including light requirements, watering intervals, and care instructions.",
    icon: Leaf,
    detail: "Your collection · Home location · Notes for each plant",
  },
  {
    number: "02",
    title: "Set a rhythm for plant care",
    description:
      "Create a recurring care task for a particular plant. Choose watering, fertilizing, pruning, or repotting, then set the interval in days. Flora calculates the task’s next due date from that interval, making it easier to see what care is coming up for each plant.",
    icon: CalendarDays,
    detail: "Watering · Fertilizing · Pruning · Repotting",
  },
  {
    number: "03",
    title: "Keep a record for each plant",
    description:
      "Add a CareLog entry to a plant with the date and an optional note about the care you gave it. The entries belong to that plant, giving you a record to look back on as its care continues.",
    icon: NotebookPen,
    detail: "A date · An optional note · Care history by plant",
  },
];

export const AboutUsPage = () => {
  return (
    <section className="mx-auto w-full max-w-6xl space-y-14 px-4 py-10 sm:space-y-20 sm:py-16">
      <header className="relative isolate overflow-hidden rounded-[2rem] border border-border bg-card/80 px-6 py-12 text-center shadow-sm sm:px-12 sm:py-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-12 -top-16 -z-10 size-64 rounded-full bg-secondary/80 blur-3xl sm:size-80"
        />
        <div className="mx-auto mb-5 flex size-12 items-center justify-center rounded-full bg-secondary text-primary">
          <Leaf className="size-6" aria-hidden="true" />
        </div>
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
          A calmer way to care for your indoor garden
        </p>
        <h1 className="mx-auto max-w-3xl font-serif text-4xl font-semibold leading-tight text-foreground sm:text-5xl lg:text-6xl">
          Every plant has a place. Every care moment has a story.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
          Flora brings your houseplants together in one place. Keep track of
          where each one lives, plan recurring care, and save dated notes about
          the care you have given. From a growing collection to the little
          details that make each plant yours, Flora helps you keep it all close.
        </p>
      </header>

      <section className="mx-auto max-w-5xl" aria-labelledby="how-flora-works">
        <div className="mb-8 max-w-2xl space-y-3 sm:mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
            Your plants, one thoughtful routine
          </p>
          <h2
            id="how-flora-works"
            className="font-serif text-3xl font-semibold text-foreground sm:text-4xl"
          >
            A little more care, one step at a time
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            Keep each plant’s details, upcoming tasks, and care notes connected
            to the plant they belong to.
          </p>
        </div>

        <ol className="space-y-4">
          {steps.map(({ number, title, description, icon: Icon, detail }) => (
            <li
              key={number}
              className="grid gap-5 rounded-2xl border border-border bg-card/80 p-5 shadow-sm sm:grid-cols-[4.5rem_1fr] sm:gap-7 sm:p-7"
            >
              <div className="flex items-center gap-3 sm:flex-col sm:items-start">
                <span className="font-serif text-2xl font-semibold text-primary/70">
                  {number}
                </span>
                <span className="flex size-11 items-center justify-center rounded-full bg-secondary text-primary sm:mt-2">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
              </div>
              <div className="space-y-3">
                <h3 className="font-serif text-xl font-semibold text-foreground sm:text-2xl">
                  {title}
                </h3>
                <p className="max-w-3xl leading-relaxed text-muted-foreground">
                  {description}
                </p>
                <p className="text-xs font-medium tracking-wide text-primary sm:text-sm">
                  {detail}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <footer className="mx-auto max-w-5xl rounded-2xl bg-secondary/80 px-6 py-7 text-center sm:px-10 sm:py-9">
        <p className="font-serif text-xl font-semibold text-secondary-foreground sm:text-2xl">
          A little care, remembered.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
          Flora helps make plant care easier to organize, one plant and one
          routine at a time.
        </p>
      </footer>
    </section>
  );
};
