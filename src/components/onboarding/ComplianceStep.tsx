import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SelectItem } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { usePermitApplicationStore } from '@/store/useOnboardingStore';
import { complianceSchema, type ComplianceStepData } from '@/lib/validationSchemas';
import { SuggestionSelect } from '@/components/ui/suggestion-select';
import { SuggestionCheckbox } from '@/components/ui/suggestion-checkbox';
import { useAISuggestions } from '@/hooks/useAISuggestions';

const COMPLIANCE_METHODS = [
  { value: 'continuous', label: 'Continuous Emission Monitoring Systems (CEMS)' },
  { value: 'periodic', label: 'Periodic Monitoring' },
  { value: 'predictive', label: 'Predictive Emission Monitoring' },
  { value: 'parametric', label: 'Parametric Monitoring' },
] as const;

const MONITORING_OPTIONS = [
  'Continuous Emission Monitoring Systems (CEMS)',
  'Compliance Assurance Monitoring (CAM)',
  'Periodic Stack Testing',
  'Parametric Monitoring',
  'Visible Emission Observations',
  'Enhanced Monitoring and Reporting',
] as const;

interface ComplianceStepProps {
  onNext: () => void;
  onPrevious: () => void;
  suggestions: ReturnType<typeof useAISuggestions>['suggestions'];
  onAcceptSuggestion: (fieldName: string, value: any) => void;
  onRejectSuggestion: (fieldName: string) => void;
}

export function ComplianceStep({ onNext, onPrevious, suggestions, onAcceptSuggestion, onRejectSuggestion }: ComplianceStepProps) {
  const { data, updateCompliance, markStepCompleted } = usePermitApplicationStore();
  
  const form = useForm<ComplianceStepData>({
    resolver: zodResolver(complianceSchema),
    defaultValues: {
      subjectToNSR: data.subjectToNSR,
      hasRiskManagementPlan: data.hasRiskManagementPlan,
      monitoringRequirements: data.monitoringRequirements,
      complianceMethod: data.complianceMethod,
      stratosphericOzoneCompliance: data.stratosphericOzoneCompliance,
    },
  });

  const handleFormSubmit = (formData: ComplianceStepData) => {
    updateCompliance(formData);
    markStepCompleted(3);
    onNext();
  };

  const handleMonitoringChange = (value: string, checked: boolean) => {
    const current = form.getValues('monitoringRequirements');
    const updated = checked 
      ? [...current, value]
      : current.filter(item => item !== value);
    form.setValue('monitoringRequirements', updated);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Compliance & Monitoring 📋</CardTitle>
        <CardDescription>
          Specify compliance requirements and monitoring methods for your facility.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="subjectToNSR"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-lg">
                    <FormControl>
                      <SuggestionCheckbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        onAccept={() => {}}
                        onReject={() => {}}
                        id="subjectToNSR"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="cursor-pointer">Subject to New Source Review</FormLabel>
                      <FormDescription>
                        Facility is subject to NSR requirements
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hasRiskManagementPlan"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-lg">
                    <FormControl>
                      <SuggestionCheckbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        onAccept={() => {}}
                        onReject={() => {}}
                        id="hasRiskManagementPlan"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="cursor-pointer">Risk Management Plan</FormLabel>
                      <FormDescription>
                        Facility has an RMP under 40 CFR Part 68
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stratosphericOzoneCompliance"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-lg">
                    <FormControl>
                      <SuggestionCheckbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        onAccept={() => {}}
                        onReject={() => {}}
                        id="stratosphericOzoneCompliance"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="cursor-pointer">Stratospheric Ozone Compliance</FormLabel>
                      <FormDescription>
                        Subject to 40 CFR Part 82 requirements
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="complianceMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary Compliance Method *</FormLabel>
                  <FormControl>
                    <SuggestionSelect
                      value={field.value}
                      onValueChange={field.onChange}
                      suggestion={suggestions['complianceMethod']}
                      onAccept={(value) => {
                        field.onChange(value);
                        onAcceptSuggestion('complianceMethod', value);
                      }}
                      onReject={() => onRejectSuggestion('complianceMethod')}
                      placeholder="Select compliance method"
                    >
                      {COMPLIANCE_METHODS.map((method) => (
                        <SelectItem key={method.value} value={method.value}>
                          {method.label}
                        </SelectItem>
                      ))}
                    </SuggestionSelect>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel>Monitoring Requirements *</FormLabel>
              <FormDescription className="mb-4">
                Select all applicable monitoring requirements for your facility.
              </FormDescription>
              <div className="grid grid-cols-1 gap-3">
                {MONITORING_OPTIONS.map((option) => (
                  <FormItem 
                    key={option}
                    className="flex flex-row items-start space-x-3 space-y-0 p-3 border rounded-lg"
                  >
                    <FormControl>
                      <SuggestionCheckbox
                        checked={form.watch('monitoringRequirements').includes(option)}
                        onCheckedChange={(checked) => handleMonitoringChange(option, checked)}
                        onAccept={() => {}}
                        onReject={() => {}}
                        id={`monitoring-${option}`}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="cursor-pointer text-sm">
                        {option}
                      </FormLabel>
                    </div>
                  </FormItem>
                ))}
              </div>
              <FormMessage />
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
                Next Step →
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}