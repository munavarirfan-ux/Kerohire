"use client";

import * as React from "react";
import { Primitive } from "@radix-ui/react-primitive";
import { cn } from "@/lib/utils";

const Card = React.forwardRef<React.ElementRef<typeof Primitive.div>, React.ComponentPropsWithoutRef<typeof Primitive.div>>(
  ({ className, ...props }, ref) => (
    <Primitive.div
      ref={ref}
      className={cn("rounded-lg border border-border bg-surface shadow-sm", className)}
      {...props}
    />
  ),
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  React.ElementRef<typeof Primitive.div>,
  React.ComponentPropsWithoutRef<typeof Primitive.div>
>(({ className, ...props }, ref) => (
  <Primitive.div ref={ref} className={cn("flex flex-col space-y-1.5 p-4 sm:p-6", className)} {...props} />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  React.ElementRef<typeof Primitive.h3>,
  React.ComponentPropsWithoutRef<typeof Primitive.h3>
>(({ className, ...props }, ref) => (
  <Primitive.h3 ref={ref} className={cn("text-lg font-medium text-text sm:text-xl", className)} {...props} />
));
CardTitle.displayName = "CardTitle";

const CardContent = React.forwardRef<
  React.ElementRef<typeof Primitive.div>,
  React.ComponentPropsWithoutRef<typeof Primitive.div>
>(({ className, ...props }, ref) => (
  <Primitive.div ref={ref} className={cn("p-4 pt-0 sm:p-6 sm:pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  React.ElementRef<typeof Primitive.div>,
  React.ComponentPropsWithoutRef<typeof Primitive.div>
>(({ className, ...props }, ref) => (
  <Primitive.div ref={ref} className={cn("flex items-center p-4 pt-0 sm:p-6 sm:pt-0", className)} {...props} />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardTitle, CardContent, CardFooter };
