import React, { useState, useEffect } from 'react';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { RadioGroup } from '@/components/ui/radio-group';

export interface SuggestionRadioGroupProps {
  value?: string;
  onValueChange: (value: string) => void;
  suggestion?: {
    value: string;
    reasoning: string;
  };
  onAccept: (value: string) => void;
  onReject: () => void;
  children: React.ReactNode;
  className?: string;
  defaultValue?: string;
}

export function SuggestionRadioGroup({
  value,
  onValueChange,
  suggestion,
  onAccept,
  onReject,
  children,
  className,
  defaultValue
}: SuggestionRadioGroupProps) {
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [displayValue, setDisplayValue] = useState(value || defaultValue);

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
      <RadioGroup
        value={displayValue}
        onValueChange={!showSuggestion ? onValueChange : undefined}
        className={cn(
          className,
          showSuggestion && '[&_label]:ring-2 [&_label]:ring-green-500 [&_label]:border-green-500'
        )}
        defaultValue={defaultValue}
      >
        {children}
      </RadioGroup>
      {showSuggestion && suggestion && (
        <div className="absolute right-0 top-0 flex gap-1 z-10">
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