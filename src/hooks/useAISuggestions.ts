import { useState, useCallback } from 'react';

export interface Suggestion {
  value: string;
  reasoning: string;
}

export interface SuggestionsState {
  [fieldName: string]: Suggestion | undefined;
}

export function useAISuggestions() {
  const [suggestions, setSuggestions] = useState<SuggestionsState>({});

  const addSuggestion = useCallback((fieldName: string, suggestion: Suggestion) => {
    setSuggestions(prev => ({
      ...prev,
      [fieldName]: suggestion
    }));
  }, []);

  const removeSuggestion = useCallback((fieldName: string) => {
    setSuggestions(prev => {
      const next = { ...prev };
      delete next[fieldName];
      return next;
    });
  }, []);

  const getSuggestion = useCallback((fieldName: string) => {
    return suggestions[fieldName];
  }, [suggestions]);

  const handleWebSocketMessage = useCallback((event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data);
      
      // Check if this is a suggestion event
      if (data.event_type && data.event_type.endsWith('_suggestion')) {
        const fieldName = data.field_name;
        const suggestion: Suggestion = {
          value: data.suggestion,
          reasoning: data.reasoning
        };
        addSuggestion(fieldName, suggestion);
      }
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  }, [addSuggestion]);

  return {
    suggestions,
    addSuggestion,
    removeSuggestion,
    getSuggestion,
    handleWebSocketMessage
  };
}