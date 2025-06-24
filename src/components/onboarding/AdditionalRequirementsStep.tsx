import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription } from '@/components/ui/form';
import { usePermitApplicationStore } from '@/store/useOnboardingStore';
import { additionalRequirementsSchema, type AdditionalRequirementsStepData } from '@/lib/validationSchemas';
import { SuggestionCheckbox } from '@/components/ui/suggestion-checkbox';
import { useAISuggestions } from '@/hooks/useAISuggestions';

interface AdditionalRequirementsStepProps {
  onNext: () => void;
  onPrevious: () => void;
  suggestions: ReturnType<typeof useAISuggestions>['suggestions'];
  onAcceptSuggestion: (fieldName: string, value: any) => void;
  onRejectSuggestion: (fieldName: string) => void;
}

export function AdditionalRequirementsStep({ onNext, onPrevious, suggestions, onAcceptSuggestion, onRejectSuggestion }: AdditionalRequirementsStepProps) {
  const { data, updateAdditionalRequirements, markStepCompleted } = usePermitApplicationStore();
  
  const form = useForm<AdditionalRequirementsStepData>({
    resolver: zodResolver(additionalRequirementsSchema),
    defaultValues: {
      emissionCreditsUsed: data.emissionCreditsUsed,
      volatileOrganicCompounds: data.volatileOrganicCompounds,
      subscribeToUpdates: data.subscribeToUpdates,
    },
  });

  const handleFormSubmit = (formData: AdditionalRequirementsStepData) => {
    updateAdditionalRequirements(formData);
    markStepCompleted(4);
    onNext();
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Additional Requirements ✅</CardTitle>
        <CardDescription>
          Final requirements and preferences for your permit application.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="emissionCreditsUsed"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-lg">
                    <FormControl>
                      <SuggestionCheckbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        onAccept={() => {}}
                        onReject={() => {}}
                        id="emissionCreditsUsed"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="cursor-pointer">Emission Credits Used</FormLabel>
                      <FormDescription>
                        The facility will use emission reduction credits or offsets to meet permit requirements.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="volatileOrganicCompounds"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-lg">
                    <FormControl>
                      <SuggestionCheckbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        onAccept={() => {}}
                        onReject={() => {}}
                        id="volatileOrganicCompounds"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="cursor-pointer">Volatile Organic Compounds</FormLabel>
                      <FormDescription>
                        The facility emits volatile organic compounds subject to additional requirements under state and federal regulations.
                      </FormDescription>
                    </div>
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
                      <FormLabel className="cursor-pointer">Subscribe to Regulatory Updates</FormLabel>
                      <FormDescription>
                        Receive notifications about regulatory changes, permit renewal deadlines, and compliance requirements.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Important Notice</h3>
              <div className="text-sm text-blue-800 space-y-2">
                <p>• This application will be submitted to the Texas Commission on Environmental Quality (TCEQ) for review.</p>
                <p>• Processing time is typically 180-330 days depending on application completeness.</p>
                <p>• Additional information may be requested during the review process.</p>
                <p>• Public notice requirements may apply depending on emission levels and location.</p>
              </div>
            </div>

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
                Review Summary →
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}