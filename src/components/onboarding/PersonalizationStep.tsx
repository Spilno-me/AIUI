import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroupItem } from '@/components/ui/radio-group';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { useOnboardingStore } from '@/store/useOnboardingStore';
import { personalizationStepSchema, type PersonalizationStepData } from '@/lib/validationSchemas';
import { SuggestionRadioGroup } from '@/components/ui/suggestion-radio-group';
import { SuggestionColorPicker } from '@/components/ui/suggestion-color-picker';
import { useAISuggestions } from '@/hooks/useAISuggestions';

const VIBE_OPTIONS = [
  {
    value: 'builder' as const,
    label: 'Builder',
    description: 'I love creating and building things from scratch',
    emoji: '🔨',
  },
  {
    value: 'dreamer' as const,
    label: 'Dreamer',
    description: 'I think big and imagine possibilities',
    emoji: '💭',
  },
  {
    value: 'hacker' as const,
    label: 'Hacker',
    description: 'I enjoy solving problems and finding solutions',
    emoji: '⚡',
  },
  {
    value: 'visionary' as const,
    label: 'Visionary',
    description: 'I see the future and help others get there',
    emoji: '🔮',
  },
] as const;


interface PersonalizationStepProps {
  onNext: () => void;
  onPrevious: () => void;
  suggestions: ReturnType<typeof useAISuggestions>['suggestions'];
  onAcceptSuggestion: (fieldName: string, value: any) => void;
  onRejectSuggestion: (fieldName: string) => void;
}

export function PersonalizationStep({ onNext, onPrevious, suggestions, onAcceptSuggestion, onRejectSuggestion }: PersonalizationStepProps) {
  const { data, updatePersonalization, markStepCompleted } = useOnboardingStore();
  
  const form = useForm<PersonalizationStepData>({
    resolver: zodResolver(personalizationStepSchema),
    defaultValues: {
      vibe: data.vibe || undefined,
      favoriteColor: data.favoriteColor,
    },
  });

  const handleFormSubmit = (formData: PersonalizationStepData) => {
    updatePersonalization(formData);
    markStepCompleted(3);
    onNext();
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Let's personalize your experience ✨</CardTitle>
        <CardDescription>
          Help us customize the platform to match your personality and preferences.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="vibe"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">What's your vibe? *</FormLabel>
                  <FormDescription>
                    Choose the personality that best describes you.
                  </FormDescription>
                  <FormControl>
                    <SuggestionRadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      suggestion={suggestions['vibe']}
                      onAccept={(value) => {
                        field.onChange(value);
                        onAcceptSuggestion('vibe', value);
                      }}
                      onReject={() => onRejectSuggestion('vibe')}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2"
                      defaultValue={field.value}
                    >
                      {VIBE_OPTIONS.map((option) => (
                        <FormItem key={option.value} className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value={option.value} />
                          </FormControl>
                          <div className="flex-1 p-4 border rounded-lg hover:bg-accent cursor-pointer transition-colors">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-lg">{option.emoji}</span>
                              <FormLabel className="font-medium cursor-pointer">
                                {option.label}
                              </FormLabel>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {option.description}
                            </p>
                          </div>
                        </FormItem>
                      ))}
                    </SuggestionRadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="favoriteColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">Favorite Color *</FormLabel>
                  <FormDescription>
                    Pick a color that represents you - we'll use it to personalize your interface.
                  </FormDescription>
                  <FormControl>
                    <SuggestionColorPicker
                      value={field.value}
                      onChange={field.onChange}
                      suggestion={suggestions['favoriteColor']}
                      onAccept={(value) => {
                        field.onChange(value);
                        onAcceptSuggestion('favoriteColor', value);
                      }}
                      onReject={() => onRejectSuggestion('favoriteColor')}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between pt-4">
              <Button 
                type="button" 
                variant="outline" 
                size="lg" 
                onClick={onPrevious}
                data-testid="previous-button"
              >
                ← Previous
              </Button>
              <Button type="submit" size="lg" data-testid="complete-button">
                Complete Setup 🎉
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
} 