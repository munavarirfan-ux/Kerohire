import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MigrationsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h2>Migrations</h2>
        <p className="text-sm text-text-secondary">Executed migrations, environments, and logs (admin/developer view).</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Migration log (prototype)</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-text-secondary space-y-2">
          <p>This is a placeholder screen so sidebar navigation never hits 404.</p>
          <p>Next: executed scripts table, duration, owners, and view logs drawer.</p>
        </CardContent>
      </Card>
    </div>
  );
}

