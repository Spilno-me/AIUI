import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { useOnboardingStore } from '@/store/useOnboardingStore';
import { companyStepSchema, type CompanyStepData } from '@/lib/validationSchemas';

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
}

export function CompanyStep({ onNext, onPrevious }: CompanyStepProps) {
  const { data, updateCompanyDetails } = useOnboardingStore();
  
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
                    <Input 
                      placeholder="Enter your company name" 
                      {...field} 
                      data-testid="companyName-input"
                    />
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="numberOfEmployees-select">
                        <SelectValue placeholder="Select company size" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {EMPLOYEE_RANGES.map((range) => (
                        <SelectItem key={range} value={range}>
                          {range} employees
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                    <Textarea
                      placeholder="Tell us about your objectives and what you hope to achieve..."
                      className="min-h-[120px]"
                      {...field}
                      data-testid="goals-textarea"
                    />
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
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      data-testid="subscribeToUpdates-checkbox"
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