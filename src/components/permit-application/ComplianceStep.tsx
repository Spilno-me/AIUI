import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { SelectItem } from '@/components/ui/select';
import { usePermitApplicationStore } from '@/store/usePermitApplicationStore';
import { complianceStepSchema, type ComplianceStepData } from '@/lib/validationSchemas';
import { SuggestionSelect } from '@/components/ui/suggestion-select';
import { useAISuggestions } from '@/hooks/useAISuggestions';
import { ClipboardCheck, Shield } from 'lucide-react';

const MONITORING_REQUIREMENTS = [
  { value: 'cems', label: 'Continuous Emission Monitoring Systems (CEMS)' },
  { value: 'cam', label: 'Compliance Assurance Monitoring (CAM)' },
  { value: 'periodic', label: 'Periodic Monitoring' },
  { value: 'parametric', label: 'Parametric Monitoring' },
  { value: 'stack_testing', label: 'Stack Testing' },
  { value: 'recordkeeping', label: 'Recordkeeping Only' },
] as const;

const COMPLIANCE_METHODS = [
  { value: 'continuous', label: 'Continuous Monitoring' },
  { value: 'periodic', label: 'Periodic Testing' },
  { value: 'predictive', label: 'Predictive Monitoring' },
  { value: 'parametric', label: 'Parametric Monitoring' },
] as const;

interface ComplianceStepProps {
  onNext: () => void;
  onPrevious: () => void;
  suggestions: ReturnType<typeof useAISuggestions>['suggestions'];
  onAcceptSuggestion: (fieldName: string, value: any) => void;
  onRejectSuggestion: (fieldName: string) => void;
}

export function ComplianceStep({ onNext, onPrevious, suggestions, onAcceptSuggestion, onRejectSuggestion }: ComplianceStepProps) {
  const { data, updateComplianceInfo, markStepCompleted } = usePermitApplicationStore();
  
  const form = useForm<ComplianceStepData>({
    resolver: zodResolver(complianceStepSchema),
    defaultValues: {
      subjectToNSR: data.subjectToNSR,
      hasRiskManagementPlan: data.hasRiskManagementPlan,
      monitoringRequirements: data.monitoringRequirements,
      complianceMethod: data.complianceMethod || undefined,
      stratosphericOzoneCompliance: data.stratosphericOzoneCompliance,
    },
  });

  const handleFormSubmit = (formData: ComplianceStepData) => {
    updateComplianceInfo(formData);
    markStepCompleted(3);
    onNext();
  };

  const toggleMonitoringRequirement = (requirement: string) => {
    const current = form.getValues('monitoringRequirements');
    if (current.includes(requirement)) {
      form.setValue('monitoringRequirements', current.filter(r => r !== requirement));
    } else {
      form.setValue('monitoringRequirements', [...current, requirement]);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <Shield className="h-12 w-12 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold">Compliance & Monitoring</CardTitle>
        <CardDescription>
          Specify regulatory compliance requirements and monitoring methods
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            
            {/* Regulatory Requirements */}
            <div className="space-y-4 border rounded-lg p-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <ClipboardCheck className="h-5 w-5" />
                Regulatory Requirements
              </h3>
              
              <FormField
                control={form.control}
                name="subjectToNSR"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Subject to New Source Review (NSR)
                      </FormLabel>
                      <FormDescription>
                        Facility triggers Prevention of Significant Deterioration (PSD) or Nonattainment NSR
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hasRiskManagementPlan"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Risk Management Plan (RMP) Required
                      </FormLabel>
                      <FormDescription>
                        Facility stores regulated substances above threshold quantities (40 CFR Part 68)
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stratosphericOzoneCompliance"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Stratospheric Ozone Protection Compliance
                      </FormLabel>
                      <FormDescription>
                        Facility uses ozone-depleting substances (40 CFR Part 82)
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            {/* Monitoring Requirements */}
            <FormField
              control={form.control}
              name="monitoringRequirements"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monitoring Requirements *</FormLabel>
                  <FormDescription>
                    Select all applicable monitoring requirements for your facility
                  </FormDescription>
                  <div className="space-y-2 mt-2">
                    {MONITORING_REQUIREMENTS.map((req) => (
                      <label
                        key={req.value}
                        className="flex items-start space-x-3 cursor-pointer hover:bg-muted/50 rounded-md p-2"
                      >
                        <Checkbox
                          checked={field.value.includes(req.value)}
                          onCheckedChange={() => toggleMonitoringRequirement(req.value)}
                        />
                        <span className="text-sm leading-normal">{req.label}</span>
                      </label>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Compliance Method */}
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
                  <FormDescription>
                    Select the primary method for demonstrating compliance
                  </FormDescription>
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