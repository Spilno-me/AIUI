import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { useOnboardingStore } from '@/store/useOnboardingStore';
import { personalizationStepSchema, type PersonalizationStepData } from '@/lib/validationSchemas';

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

interface PersonalizationStepProps {
  onNext: () => void;
  onPrevious: () => void;
}

export function PersonalizationStep({ onNext, onPrevious }: PersonalizationStepProps) {
  const { data, updatePersonalization } = useOnboardingStore();
  
  const form = useForm<PersonalizationStepData>({
    resolver: zodResolver(personalizationStepSchema),
    defaultValues: {
      vibe: data.vibe || undefined,
      favoriteColor: data.favoriteColor,
    },
  });

  const handleFormSubmit = (formData: PersonalizationStepData) => {
    updatePersonalization(formData);
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
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2"
                      data-testid="vibe-radio-group"
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
                    </RadioGroup>
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
                    <div className="space-y-4">
                      <div className="grid grid-cols-8 gap-2">
                        {PRESET_COLORS.map((color) => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => field.onChange(color)}
                            className={`w-8 h-8 rounded-full border-2 transition-all ${
                              field.value === color 
                                ? 'border-primary scale-110 shadow-lg' 
                                : 'border-gray-300 hover:scale-105'
                            }`}
                            style={{ backgroundColor: color }}
                            data-testid={`color-${color}`}
                          />
                        ))}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">Custom:</span>
                        <Input
                          type="color"
                          value={field.value}
                          onChange={(e) => field.onChange(e.target.value)}
                          className="w-16 h-8 p-0 border-0"
                          data-testid="custom-color-input"
                        />
                        <span className="text-sm font-mono text-muted-foreground">
                          {field.value}
                        </span>
                      </div>
                    </div>
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