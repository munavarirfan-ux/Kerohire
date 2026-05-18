"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CustomFieldDef, CustomFieldType } from "@/lib/hiring/types";
import { cn } from "@/lib/utils";
import { jobFormInputClass } from "./JobFormStepContent";

const FIELD_TYPES: { value: CustomFieldType; label: string }[] = [
  { value: "text", label: "Text" },
  { value: "number", label: "Number" },
  { value: "dropdown", label: "Dropdown" },
  { value: "multiselect", label: "Multi-select" },
  { value: "date", label: "Date" },
  { value: "url", label: "URL" },
  { value: "file", label: "File" },
];

function slugifyLabel(label: string) {
  const base = label
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return base || "custom-field";
}

function uniqueFieldId(label: string, existingIds: Set<string>) {
  const base = slugifyLabel(label);
  if (!existingIds.has(base)) return base;
  let n = 2;
  while (existingIds.has(`${base}-${n}`)) n += 1;
  return `${base}-${n}`;
}

export function JobCustomFieldsStep({
  catalog,
  selectedIds,
  onSelectedIdsChange,
  onAddField,
  onRemoveCustomField,
  builtinFieldIds,
}: {
  catalog: CustomFieldDef[];
  selectedIds: string[];
  onSelectedIdsChange: (ids: string[]) => void;
  onAddField: (field: CustomFieldDef) => void;
  onRemoveCustomField: (id: string) => void;
  builtinFieldIds: Set<string>;
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newType, setNewType] = useState<CustomFieldType>("text");
  const [addError, setAddError] = useState<string | undefined>();

  const selectedSet = new Set(selectedIds);
  const allSelected = catalog.length > 0 && catalog.every((f) => selectedSet.has(f.id));

  function toggleField(id: string, checked: boolean) {
    if (checked) {
      onSelectedIdsChange([...selectedIds, id]);
    } else {
      onSelectedIdsChange(selectedIds.filter((x) => x !== id));
    }
  }

  function toggleAll(checked: boolean) {
    onSelectedIdsChange(checked ? catalog.map((f) => f.id) : []);
  }

  function handleAddField() {
    const label = newLabel.trim();
    if (!label) {
      setAddError("Field name is required");
      return;
    }
    const existingIds = new Set(catalog.map((f) => f.id));
    const id = uniqueFieldId(label, existingIds);
    const field: CustomFieldDef = { id, label, type: newType };
    onAddField(field);
    onSelectedIdsChange([...selectedIds, id]);
    setNewLabel("");
    setNewType("text");
    setAddError(undefined);
    setShowAddForm(false);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[13px] leading-relaxed text-text-secondary/70">
          Choose which application fields candidates must complete for this role.
        </p>
        {catalog.length > 0 ? (
          <button
            type="button"
            onClick={() => toggleAll(!allSelected)}
            className="text-[12px] font-medium text-forest hover:text-forest/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest/30 focus-visible:ring-offset-2 rounded"
          >
            {allSelected ? "Clear all" : "Select all"}
          </button>
        ) : null}
      </div>

      {catalog.length === 0 ? (
        <p className="rounded-[12px] border border-dashed border-[rgba(15,23,42,0.12)] bg-[#FAFAFB] px-4 py-6 text-center text-[13px] text-text-secondary/70 dark:border-white/[0.08] dark:bg-muted/10">
          No fields yet. Add a custom field below.
        </p>
      ) : (
        <ul
          className="divide-y divide-[rgba(15,23,42,0.06)] overflow-hidden rounded-[12px] border border-[rgba(15,23,42,0.06)] dark:divide-white/[0.06] dark:border-white/[0.06]"
          role="list"
        >
          {catalog.map((field) => {
            const checked = selectedSet.has(field.id);
            const isUserCreated = !builtinFieldIds.has(field.id);

            return (
              <li
                key={field.id}
                className={cn(
                  "flex items-center gap-3 bg-white px-4 py-3 transition-colors dark:bg-surface",
                  checked && "bg-forest/[0.03] dark:bg-forest/[0.06]",
                )}
              >
                <Checkbox
                  id={`job-field-${field.id}`}
                  checked={checked}
                  onCheckedChange={(v) => toggleField(field.id, v === true)}
                  aria-label={`Include ${field.label}`}
                />
                <Label
                  htmlFor={`job-field-${field.id}`}
                  className="flex min-w-0 flex-1 cursor-pointer flex-col gap-0.5"
                >
                  <span className="text-sm font-medium text-text">{field.label}</span>
                  <span className="text-[11px] uppercase tracking-wide text-muted">{field.type}</span>
                </Label>
                {isUserCreated ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0 text-muted hover:text-destructive"
                    aria-label={`Remove ${field.label}`}
                    onClick={() => onRemoveCustomField(field.id)}
                  >
                    <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                  </Button>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}

      <p className="text-[12px] text-muted">
        {selectedIds.length} of {catalog.length} field{catalog.length === 1 ? "" : "s"} selected
      </p>

      {showAddForm ? (
        <div className="space-y-4 rounded-[12px] border border-[rgba(15,23,42,0.08)] bg-[#FAFAFB] p-4 dark:border-white/[0.08] dark:bg-muted/10">
          <p className="text-sm font-medium text-text">New custom field</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Field name" required error={addError} className="sm:col-span-2">
              <Input
                value={newLabel}
                onChange={(e) => {
                  setNewLabel(e.target.value);
                  if (e.target.value.trim()) setAddError(undefined);
                }}
                placeholder="e.g. LinkedIn profile"
                className={jobFormInputClass}
                autoFocus
              />
            </FormField>
            <FormField label="Field type">
              <Select value={newType} onValueChange={(v) => setNewType(v as CustomFieldType)}>
                <SelectTrigger className={jobFormInputClass}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FIELD_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              className="rounded-[10px] bg-forest text-white hover:bg-forest/90"
              onClick={handleAddField}
            >
              Add field
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-[10px]"
              onClick={() => {
                setShowAddForm(false);
                setNewLabel("");
                setAddError(undefined);
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-1.5 rounded-[10px]"
          onClick={() => setShowAddForm(true)}
        >
          <Plus className="h-4 w-4" strokeWidth={1.5} aria-hidden />
          Add custom field
        </Button>
      )}
    </div>
  );
}
