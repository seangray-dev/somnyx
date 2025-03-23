export default function NoSearchResults() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <h2 className="text-2xl font-bold">No results found</h2>
      <p className="text-muted-foreground">
        Try searching for something else or explore our categories.
      </p>
    </div>
  );
}
