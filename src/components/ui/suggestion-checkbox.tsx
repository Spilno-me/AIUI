import { useState, useEffect } from 'react';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

export interface SuggestionCheckboxProps {
  checked?: boolean;
  onCheckedChange: (checked: boolean) => void;
  suggestion?: {
    value: boolean;
    reasoning: string;
  };
  onAccept: (value: boolean) => void;
  onReject: () => void;
  id?: string;
  disabled?: boolean;
  className?: string;
}

export function SuggestionCheckbox({
  checked,
  onCheckedChange,
  suggestion,
  onAccept,
  onReject,
  id,
  disabled,
  className
}: SuggestionCheckboxProps) {
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [displayChecked, setDisplayChecked] = useState(checked);

  useEffect(() => {
    if (suggestion !== undefined) {
      setShowSuggestion(true);
      setDisplayChecked(suggestion.value);
    }
  }, [suggestion]);

  useEffect(() => {
    if (!showSuggestion) {
      setDisplayChecked(checked);
    }
  }, [checked, showSuggestion]);

  const handleAccept = () => {
    if (suggestion !== undefined) {
      onAccept(suggestion.value);
      onCheckedChange(suggestion.value);
      setShowSuggestion(false);
    }
  };

  const handleReject = () => {
    onReject();
    setShowSuggestion(false);
    setDisplayChecked(checked);
  };

  return (
    <div className="relative inline-block">
      <Checkbox
        id={id}
        checked={displayChecked}
        onCheckedChange={!showSuggestion ? onCheckedChange : undefined}
        disabled={disabled}
        className={cn(
          className,
          showSuggestion && 'ring-2 ring-green-500 border-green-500 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600 pointer-events-none'
        )}
      />
      {showSuggestion && suggestion !== undefined && (
        <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 flex gap-1 z-10">
          <Button
            type="button"
            size="sm"
            variant="default"
            className="h-7 px-2 bg-green-600 hover:bg-green-700 text-white"
            onClick={handleAccept}
            title={`Accept suggestion: ${suggestion.reasoning}`}
          >
            <Check className="h-3 w-3 mr-1" />
            Accept
          </Button>
          <Button
            type="button"
            size="sm"
            variant="default"
            className="h-7 px-2 bg-red-600 hover:bg-red-700 text-white"
            onClick={handleReject}
            title="Reject suggestion"
          >
            <X className="h-3 w-3 mr-1" />
            Reject
          </Button>
        </div>
      )}
    </div>
  );
}