import { ReactElement, cloneElement, useState, useEffect } from 'react';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export interface SuggestionTextareaProps {
  children: ReactElement;
  suggestion?: {
    value: string;
    reasoning: string;
  };
  onAccept: (value: string) => void;
  onReject: () => void;
}

export function SuggestionTextarea({
  children,
  suggestion,
  onAccept,
  onReject
}: SuggestionTextareaProps) {
  const [showSuggestion, setShowSuggestion] = useState(false);

  useEffect(() => {
    if (suggestion) {
      setShowSuggestion(true);
    }
  }, [suggestion]);

  const handleAccept = () => {
    if (suggestion) {
      onAccept(suggestion.value);
      setShowSuggestion(false);
    }
  };

  const handleReject = () => {
    onReject();
    setShowSuggestion(false);
  };

  const enhancedChild = cloneElement(children, {
    ...children.props,
    className: cn(
      children.props.className,
      showSuggestion && 'ring-2 ring-green-500 border-green-500 focus:ring-green-500'
    ),
    value: showSuggestion && suggestion ? suggestion.value : children.props.value,
    readOnly: showSuggestion ? true : children.props.readOnly,
    disabled: children.props.disabled,
    style: {
      ...children.props.style,
      cursor: showSuggestion ? 'default' : children.props.style?.cursor
    }
  });

  return (
    <div className="relative">
      {enhancedChild}
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