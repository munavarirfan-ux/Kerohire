import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zeMock } from "@/features/demo/data/ze.mock";

export default function QuestionPoolPage() {
  const q = zeMock.questionPool.questions[0];
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2>Question Pool</h2>
          <p className="text-sm text-text-secondary">Content-management UX with split view for fast curation.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">Import</Button>
          <Button className="bg-ao-600 hover:bg-ao-700 text-white">Create question</Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-12">
        <Card className="lg:col-span-5">
          <CardHeader>
            <CardTitle>Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input placeholder="Search questions…" />
            <div className="flex flex-wrap gap-2">
              {zeMock.questionPool.types.slice(0, 5).map((t) => (
                <button
                  key={t}
                  className="rounded-full border border-border bg-app-bg px-3 py-1 text-xs font-semibold text-text-secondary hover:text-text hover:bg-surface transition-subtle"
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="space-y-2">
              {zeMock.questionPool.questions.map((x) => (
                <button
                  key={x.title}
                  className="w-full text-left rounded-lg border border-border bg-surface p-3 hover:bg-app-bg transition-subtle"
                >
                  <p className="font-semibold text-text">{x.title}</p>
                  <p className="text-xs text-text-secondary">{x.type} · {x.difficulty} · Usage {x.usage}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-7">
          <CardHeader className="flex-row items-start justify-between">
            <div>
              <CardTitle>Preview</CardTitle>
              <p className="text-sm text-text-secondary mt-1">{q.title}</p>
            </div>
            <Button variant="outline">Edit</Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-lg border border-border bg-app-bg p-3">
                <p className="text-xs font-semibold text-text-secondary">Difficulty</p>
                <p className="mt-1 font-semibold text-text">{q.difficulty}</p>
              </div>
              <div className="rounded-lg border border-border bg-app-bg p-3">
                <p className="text-xs font-semibold text-text-secondary">Type</p>
                <p className="mt-1 font-semibold text-text">{q.type}</p>
              </div>
              <div className="rounded-lg border border-border bg-app-bg p-3">
                <p className="text-xs font-semibold text-text-secondary">Usage count</p>
                <p className="mt-1 font-semibold text-text">{q.usage}</p>
              </div>
              <div className="rounded-lg border border-border bg-app-bg p-3">
                <p className="text-xs font-semibold text-text-secondary">Average score</p>
                <p className="mt-1 font-semibold text-text">{Math.round(q.avgScore * 100)}%</p>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-surface p-4">
              <p className="text-xs font-semibold text-text-secondary">Skills</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {q.skills.map((s) => (
                  <span key={s} className="rounded-full border border-border bg-app-bg px-3 py-1 text-xs font-semibold text-text-secondary">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-border bg-surface p-4">
              <p className="text-xs font-semibold text-text-secondary">Metadata</p>
              <p className="mt-2 text-sm text-text-secondary">
                Curator: <span className="font-semibold text-text">{q.curator}</span> · Last updated:{" "}
                <span className="font-semibold text-text">{q.updated}</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

