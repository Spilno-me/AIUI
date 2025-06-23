import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SelectItem } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { useOnboardingStore } from '@/store/useOnboardingStore';
import { companyStepSchema, type CompanyStepData } from '@/lib/validationSchemas';
import { SuggestionInput } from '@/components/ui/suggestion-input';
import { SuggestionSelect } from '@/components/ui/suggestion-select';
import { SuggestionTextarea } from '@/components/ui/suggestion-textarea';
import { SuggestionCheckbox } from '@/components/ui/suggestion-checkbox';
import { useAISuggestions } from '@/hooks/useAISuggestions';

const EMPLOYEE_RANGES = [
  '1-10',
  '11-50',
  '51-200',
  '201-500',
  '501-1000',
  '1000+',
] as const;

interface CompanyStepProps {
  onNext: () => void;
  onPrevious: () => void;
  suggestions: ReturnType<typeof useAISuggestions>['suggestions'];
  onAcceptSuggestion: (fieldName: string, value: any) => void;
  onRejectSuggestion: (fieldName: string) => void;
}

export function CompanyStep({ onNext, onPrevious, suggestions, onAcceptSuggestion, onRejectSuggestion }: CompanyStepProps) {
  const { data, updateCompanyDetails, markStepCompleted } = useOnboardingStore();
  
  const form = useForm<CompanyStepData>({
    resolver: zodResolver(companyStepSchema),
    defaultValues: {
      companyName: data.companyName,
      numberOfEmployees: data.numberOfEmployees,
      goals: data.goals,
      subscribeToUpdates: data.subscribeToUpdates,
    },
  });

  const handleFormSubmit = (formData: CompanyStepData) => {
    updateCompanyDetails(formData);
    markStepCompleted(2);
    onNext();
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Tell us about your company 🏢</CardTitle>
        <CardDescription>
          Help us understand your business needs so we can tailor our platform for you.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name *</FormLabel>
                  <FormControl>
                    <SuggestionInput
                      suggestion={suggestions['companyName']}
                      onAccept={(value) => {
                        field.onChange(value);
                        onAcceptSuggestion('companyName', value);
                      }}
                      onReject={() => onRejectSuggestion('companyName')}
                    >
                      <Input 
                        placeholder="Enter your company name" 
                        {...field} 
                        data-testid="companyName-input"
                      />
                    </SuggestionInput>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="numberOfEmployees"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Employees *</FormLabel>
                  <FormControl>
                    <SuggestionSelect
                      value={field.value}
                      onValueChange={field.onChange}
                      suggestion={suggestions['numberOfEmployees']}
                      onAccept={(value) => {
                        field.onChange(value);
                        onAcceptSuggestion('numberOfEmployees', value);
                      }}
                      onReject={() => onRejectSuggestion('numberOfEmployees')}
                      placeholder="Select company size"
                    >
                      {EMPLOYEE_RANGES.map((range) => (
                        <SelectItem key={range} value={range}>
                          {range} employees
                        </SelectItem>
                      ))}
                    </SuggestionSelect>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="goals"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What are your main goals? *</FormLabel>
                  <FormControl>
                    <SuggestionTextarea
                      suggestion={suggestions['goals']}
                      onAccept={(value) => {
                        field.onChange(value);
                        onAcceptSuggestion('goals', value);
                      }}
                      onReject={() => onRejectSuggestion('goals')}
                    >
                      <Textarea
                        placeholder="Tell us about your objectives and what you hope to achieve..."
                        className="min-h-[120px]"
                        {...field}
                        data-testid="goals-textarea"
                      />
                    </SuggestionTextarea>
                  </FormControl>
                  <FormDescription>
                    Share your primary objectives so we can help you achieve them.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subscribeToUpdates"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-lg">
                  <FormControl>
                    <SuggestionCheckbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      suggestion={suggestions['subscribeToUpdates'] ? {
                        value: Boolean(suggestions['subscribeToUpdates'].value),
                        reasoning: suggestions['subscribeToUpdates'].reasoning
                      } : undefined}
                      onAccept={(value) => {
                        field.onChange(value);
                        onAcceptSuggestion('subscribeToUpdates', value);
                      }}
                      onReject={() => onRejectSuggestion('subscribeToUpdates')}
                      id="subscribeToUpdates"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="cursor-pointer">
                      Subscribe to product updates and tips
                    </FormLabel>
                    <FormDescription>
                      Get the latest features, best practices, and success stories delivered to your inbox.
                    </FormDescription>
                  </div>
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