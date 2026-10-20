export const Header = () => {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Plant Library
        </h1>
        <p className="text-muted-foreground mt-1">
          Explore house plants and learn how to care for them
        </p>
      </div>
    </header>
  );
};
