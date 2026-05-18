import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AnalyticsPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2>Analytics</h2>
          <p className="text-sm text-text-secondary">Operational and intelligence analytics across hiring funnels.</p>
        </div>
        <Button variant="outline">Export</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Analytics (prototype)</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-text-secondary space-y-2">
          <p>This is a placeholder screen so sidebar navigation never hits 404.</p>
          <p>Next: date range filters, saved views, and dashboards per persona (Recruiter / HM / Admin).</p>
        </CardContent>
      </Card>
    </div>
  );
}

