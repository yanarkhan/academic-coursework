import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

function Form({ className, ...props }: React.ComponentProps<"form">) {
  return <form className={cn("space-y-5", className)} {...props} />;
}

function FormField({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("space-y-2", className)} {...props} />;
}

function FormItem({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("space-y-2", className)} {...props} />;
}

function FormLabel({ className, ...props }: React.ComponentProps<typeof Label>) {
  return <Label className={cn("text-sm font-medium", className)} {...props} />;
}

function FormControl({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("space-y-1", className)} {...props} />;
}

function FormMessage({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      className={cn("text-sm font-medium text-destructive", className)}
      {...props}
    />
  );
}

export { Form, FormControl, FormField, FormItem, FormLabel, FormMessage };
