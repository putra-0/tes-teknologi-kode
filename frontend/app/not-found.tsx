
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Ghost } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <Ghost className="w-16 h-16 text-muted-foreground mb-4" />
      <h1 className="text-5xl font-bold mb-2">Page Not Found</h1>
      <p className="text-lg text-muted-foreground mb-12">
        Sorry, the page you are looking for does not exist or has been moved.
      </p>
      <Button
        asChild
        className="w-full md:w-auto"
      >
        <Link href="/">
            Go Back Home
        </Link>
      </Button>
    </div>
  );
}