"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export function DeleteSkillAlertDialog({
  open,
  skillTitle,
  onOpenChange,
  onConfirm,
}: {
  open: boolean;
  skillTitle: string;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) {
  const label = skillTitle.trim() || "this skill";

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogTitle>Remove skill evaluation?</AlertDialogTitle>
        <AlertDialogDescription>
          Are you sure you want to remove <span className="font-medium text-[#18181B]">{label}</span>? This
          feedback will be deleted and cannot be undone.
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            type="button"
            onClick={onConfirm}
            className="bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500/30"
          >
            Remove skill
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
