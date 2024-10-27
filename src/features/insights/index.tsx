import InsightsForm from "./insights-form";

export default function Insights() {
  return (
    <div className="container flex-1">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold sm:text-2xl">Insights</h2>
        <InsightsForm />
      </div>
    </div>
  );
}
