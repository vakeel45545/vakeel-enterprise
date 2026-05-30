import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function stripHtmlTags(html: string | undefined | null): string {
  if (!html) return '';
  return html.replace(/<[^>]*>?/gm, '');
}
