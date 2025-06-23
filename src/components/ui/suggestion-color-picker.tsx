import { useState, useEffect } from 'react';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const PRESET_COLORS = [
  '#3b82f6', // Blue
  '#10b981', // Green
  '#f59e0b', // Yellow
  '#ef4444', // Red
  '#8b5cf6', // Purple
  '#f97316', // Orange
  '#06b6d4', // Cyan
  '#84cc16', // Lime
] as const;

export interface SuggestionColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  suggestion?: {
    value: string;
    reasoning: string;
  };
  onAccept: (value: string) => void;
  onReject: () => void;
}

export function SuggestionColorPicker({
  value,
  onChange,
  suggestion,
  onAccept,
  onReject
}: SuggestionColorPickerProps) {
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
      onChange(suggestion.value);
      setShowSuggestion(false);
    }
  };

  const handleReject = () => {
    onReject();
    setShowSuggestion(false);
    setDisplayValue(value);
  };

  const handleColorSelect = (color: string) => {
    if (!showSuggestion) {
      onChange(color);
    }
  };

  return (
    <div className="relative">
      <div className={cn(
        "space-y-4 p-4 rounded-lg",
        showSuggestion && "ring-2 ring-green-500 border-green-500"
      )}>
        <div className="grid grid-cols-8 gap-2">
          {PRESET_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => handleColorSelect(color)}
              disabled={showSuggestion}
              className={cn(
                "w-8 h-8 rounded-full border-2 transition-all",
                displayValue === color 
                  ? 'border-primary scale-110 shadow-lg' 
                  : 'border-gray-300 hover:scale-105',
                showSuggestion && 'cursor-not-allowed'
              )}
              style={{ backgroundColor: color }}
              data-testid={`color-${color}`}
            />
          ))}
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Custom:</span>
          <Input
            type="color"
            value={displayValue}
            onChange={(e) => handleColorSelect(e.target.value)}
            readOnly={showSuggestion}
            className="w-16 h-8 p-0 border-0"
            data-testid="custom-color-input"
          />
          <span className="text-sm font-mono text-muted-foreground">
            {displayValue}
          </span>
        </div>
      </div>
      {showSuggestion && suggestion && (
        <div className="absolute right-4 top-4 flex gap-1 z-10">
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