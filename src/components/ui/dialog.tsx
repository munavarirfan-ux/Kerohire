"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { radixContent, radixOverlay } from "@/lib/radix-motion";

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

/** Radix-style destructive red for modal close icons */
export const dialogCloseButtonClass =
  "text-red-600 transition-colors duration-[180ms] ease-out hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/30 dark:text-red-400 dark:hover:bg-red-500/10 dark:hover:text-red-300";

/** Close icon on dark / hero surfaces */
export const dialogCloseButtonOnDarkClass =
  "text-red-400 transition-colors duration-[180ms] ease-out hover:bg-red-500/15 hover:text-red-300 focus:outline-none focus:ring-2 focus:ring-red-500/30";

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn("fixed inset-0 z-50", radixOverlay, className)}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

type DialogContentProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
  /** Optional z-index / overlay classes when stacking above another dialog */
  overlayClassName?: string;
};

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(({ className, overlayClassName, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay className={overlayClassName} />
    <div
      className={cn(
        "pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4",
        overlayClassName,
      )}
    >
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          "pointer-events-auto relative z-50 w-full max-w-lg",
          "rounded-[16px] border border-[rgba(15,23,42,0.06)] bg-surface p-6 shadow-[0_24px_64px_rgba(15,23,42,0.12)]",
          "focus:outline-none dark:border-white/[0.08]",
          radixContent,
          className,
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close
          className={cn("absolute right-4 top-4 rounded-[8px] p-1", dialogCloseButtonClass)}
          aria-label="Close"
        >
          <X className="h-4 w-4" strokeWidth={1.5} />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </div>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-1.5 pr-8 text-left", className)} {...props} />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)} {...props} />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold tracking-tight text-text", className)}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description ref={ref} className={cn("text-sm text-text-secondary/80", className)} {...props} />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

/** Radix Dialog.Content without default modal chrome — for full-bleed / custom layouts. */
const DialogPanel = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Content
    ref={ref}
    className={cn("focus:outline-none", className)}
    {...props}
  >
    {children}
  </DialogPrimitive.Content>
));
DialogPanel.displayName = "DialogPanel";

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogPanel,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogPrimitive,
};
