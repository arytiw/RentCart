"use client";

import { useRouter } from "next/navigation";
import { FiInbox } from "react-icons/fi";

import Button from "./Button";
import Heading from "./Heading";

interface EmptyStateProps {
  title?: string;
  subtitle?: string;
  showReset?: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No exact matches",
  subtitle = "Try changing or removing some of your filters.",
  showReset,
}) => {
  const router = useRouter();

  return (
    <div
      className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6"
      data-testid="empty-state"
    >
      <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-cream-200 border border-ink-100 text-ink-400">
        <FiInbox size={28} />
      </div>
      <Heading center title={title} subtitle={subtitle} size="sm" />
      {showReset && (
        <div className="w-56 mt-8">
          <Button
            outline
            label="Remove all filters"
            onClick={() => router.push("/")}
          />
        </div>
      )}
    </div>
  );
};

export default EmptyState;
