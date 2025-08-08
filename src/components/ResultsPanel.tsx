interface ResultsPanelProps {
  hasInput: boolean;
}

const ResultsPanel = ({ hasInput }: ResultsPanelProps) => {
  if (!hasInput) {
    return (
      <aside className="card-elevated p-6 md:p-8 text-center">
        <h3 className="text-lg font-semibold mb-2">Your plan will appear here</h3>
        <p className="text-sm text-muted-foreground">
          Upload a report and select preferences to generate a personalized diet plan.
        </p>
      </aside>
    );
  }

  return (
    <article className="card-elevated p-6 md:p-8">
      <h3 className="text-xl font-semibold mb-3">Personalized diet plan (preview)</h3>
      <p className="text-sm text-muted-foreground mb-4">
        This is a preview. Connect Supabase to enable secure processing with your
        preferred LLM provider and store plans to your account.
      </p>
      <ul className="list-disc pl-5 space-y-2 text-sm">
        <li>Balanced macro recommendations based on common biomarkers</li>
        <li>Sample meals aligned with your dietary preferences</li>
        <li>Hydration, fiber, and micronutrient focus areas</li>
      </ul>
    </article>
  );
};

export default ResultsPanel;
