import { useState, useEffect } from 'react';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface SuggestionSelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  suggestion?: {
    value: string;
    reasoning: string;
  };
  onAccept: (value: string) => void;
  onReject: () => void;
  placeholder?: string;
  children: React.ReactNode;
  disabled?: boolean;
}

export function SuggestionSelect({
  value,
  onValueChange,
  suggestion,
  onAccept,
  onReject,
  placeholder,
  children,
  disabled
}: SuggestionSelectProps) {
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    if (suggestion) {
      setShowSuggestion(true);
      setDisplayValue(suggestion.value);
    }
  }, [suggestion]);

  useEffect(() => {
    if (!showSuggestion) {
      setDisplayValue(value);
    }
  }, [value, showSuggestion]);

  const handleAccept = () => {
    if (suggestion) {
      onAccept(suggestion.value);
      onValueChange(suggestion.value);
      setShowSuggestion(false);
    }
  };

  const handleReject = () => {
    onReject();
    setShowSuggestion(false);
    setDisplayValue(value);
  };

  return (
    <div className="relative">
      <Select
        value={displayValue}
        onValueChange={!showSuggestion ? onValueChange : undefined}
        disabled={disabled}
      >
        <SelectTrigger
          className={cn(
            showSuggestion && 'ring-2 ring-green-500 border-green-500 focus:ring-green-500'
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {children}
        </SelectContent>
      </Select>
      {showSuggestion && suggestion && (
        <div className="absolute right-0 top-full mt-1 flex gap-1 z-10">
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