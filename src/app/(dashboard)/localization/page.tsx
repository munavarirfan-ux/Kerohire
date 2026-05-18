import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function LocalizationPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2>Localization</h2>
          <p className="text-sm text-text-secondary">Language, timezone, date format, and translation keys.</p>
        </div>
        <Button variant="outline">Export keys</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Localization settings (prototype)</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-text-secondary space-y-2">
          <p>This is a placeholder screen so sidebar navigation never hits 404.</p>
          <p>Next: missing translations, compliance text, and per-workspace locale presets.</p>
        </CardContent>
      </Card>
    </div>
  );
}

