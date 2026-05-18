import { redirect } from "next/navigation";

export default function NewHiringJobPage() {
  redirect("/hiring/jobs?addJob=1");
}
