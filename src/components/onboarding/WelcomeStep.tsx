import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SelectItem } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useOnboardingStore } from '@/store/useOnboardingStore';
import { welcomeStepSchema, type WelcomeStepData } from '@/lib/validationSchemas';
import { SuggestionInput } from '@/components/ui/suggestion-input';
import { SuggestionSelect } from '@/components/ui/suggestion-select';
import { useAISuggestions } from '@/hooks/useAISuggestions';

const INDUSTRIES = [
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Manufacturing',
  'Retail',
  'Consulting',
  'Marketing',
  'Real Estate',
  'Other',
] as const;

interface WelcomeStepProps {
  onNext: () => void;
  suggestions: ReturnType<typeof useAISuggestions>['suggestions'];
  onAcceptSuggestion: (fieldName: string, value: any) => void;
  onRejectSuggestion: (fieldName: string) => void;
}

export function WelcomeStep({ onNext, suggestions, onAcceptSuggestion, onRejectSuggestion }: WelcomeStepProps) {
  const { data, updateUserInfo, markStepCompleted } = useOnboardingStore();
  
  const form = useForm<WelcomeStepData>({
    resolver: zodResolver(welcomeStepSchema),
    defaultValues: {
      fullName: data.fullName,
      email: data.email,
      password: data.password,
      industry: data.industry,
    },
  });

  const handleFormSubmit = (formData: WelcomeStepData) => {
    updateUserInfo(formData);
    markStepCompleted(1);
    onNext();
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Let's get to know you! 👋</CardTitle>
        <CardDescription>
          Welcome to our platform! We'd love to learn more about you to personalize your experience.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name *</FormLabel>
                  <FormControl>
                    <SuggestionInput
                      suggestion={suggestions['fullName']}
                      onAccept={(value) => {
                        field.onChange(value);
                        onAcceptSuggestion('fullName', value);
                      }}
                      onReject={() => onRejectSuggestion('fullName')}
                    >
                      <Input 
                        placeholder="Enter your full name" 
                        {...field} 
                        data-testid="fullName-input"
                      />
                    </SuggestionInput>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address *</FormLabel>
                  <FormControl>
                    <SuggestionInput
                      suggestion={suggestions['email']}
                      onAccept={(value) => {
                        field.onChange(value);
                        onAcceptSuggestion('email', value);
                      }}
                      onReject={() => onRejectSuggestion('email')}
                    >
                      <Input 
                        type="email" 
                        placeholder="Enter your email address" 
                        {...field} 
                        data-testid="email-input"
                      />
                    </SuggestionInput>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password *</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="Create a secure password" 
                      {...field} 
                      data-testid="password-input"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="industry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Industry *</FormLabel>
                  <FormControl>
                    <SuggestionSelect
                      value={field.value}
                      onValueChange={field.onChange}
                      suggestion={suggestions['industry']}
                      onAccept={(value) => {
                        field.onChange(value);
                        onAcceptSuggestion('industry', value);
                      }}
                      onReject={() => onRejectSuggestion('industry')}
                      placeholder="Select your industry"
                    >
                      {INDUSTRIES.map((industry) => (
                        <SelectItem key={industry} value={industry}>
                          {industry}
                        </SelectItem>
                      ))}
                    </SuggestionSelect>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end pt-4">
              <Button type="submit" size="lg" data-testid="next-button">
                Next Step →
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
} 