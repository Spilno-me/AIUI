import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SelectItem } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { usePermitApplicationStore } from '@/store/useOnboardingStore';
import { facilityStepSchema, type FacilityStepData } from '@/lib/validationSchemas';
import { SuggestionInput } from '@/components/ui/suggestion-input';
import { SuggestionSelect } from '@/components/ui/suggestion-select';
import { useAISuggestions } from '@/hooks/useAISuggestions';

const INDUSTRY_TYPES = [
  { value: 'petrochemical', label: 'Petrochemical' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'power_generation', label: 'Power Generation' },
  { value: 'refining', label: 'Refining' },
  { value: 'chemical', label: 'Chemical' },
  { value: 'other', label: 'Other' },
] as const;

interface FacilityStepProps {
  onNext: () => void;
  suggestions: ReturnType<typeof useAISuggestions>['suggestions'];
  onAcceptSuggestion: (fieldName: string, value: any) => void;
  onRejectSuggestion: (fieldName: string) => void;
}

export function FacilityStep({ onNext, suggestions, onAcceptSuggestion, onRejectSuggestion }: FacilityStepProps) {
  const { data, updateFacilityInfo, markStepCompleted } = usePermitApplicationStore();
  
  const form = useForm<FacilityStepData>({
    resolver: zodResolver(facilityStepSchema),
    defaultValues: {
      facilityName: data.facilityName,
      operatorName: data.operatorName,
      facilityAddress: data.facilityAddress,
      county: data.county,
      latitude: data.latitude,
      longitude: data.longitude,
      regulatedEntityNumber: data.regulatedEntityNumber,
      industryType: data.industryType,
    },
  });

  const handleFormSubmit = (formData: FacilityStepData) => {
    updateFacilityInfo(formData);
    markStepCompleted(1);
    onNext();
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Facility Information 🏭</CardTitle>
        <CardDescription>
          Please provide information about your facility for the Federal Operating Permit application.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="facilityName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Facility Name *</FormLabel>
                  <FormControl>
                    <SuggestionInput
                      suggestion={suggestions['facilityName']}
                      onAccept={(value) => {
                        field.onChange(value);
                        onAcceptSuggestion('facilityName', value);
                      }}
                      onReject={() => onRejectSuggestion('facilityName')}
                    >
                      <Input 
                        placeholder="Enter facility name" 
                        {...field} 
                        data-testid="facilityName-input"
                      />
                    </SuggestionInput>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="operatorName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Operator Name *</FormLabel>
                  <FormControl>
                    <SuggestionInput
                      suggestion={suggestions['operatorName']}
                      onAccept={(value) => {
                        field.onChange(value);
                        onAcceptSuggestion('operatorName', value);
                      }}
                      onReject={() => onRejectSuggestion('operatorName')}
                    >
                      <Input 
                        placeholder="Enter operator name" 
                        {...field} 
                        data-testid="operatorName-input"
                      />
                    </SuggestionInput>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="facilityAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Facility Address *</FormLabel>
                  <FormControl>
                    <SuggestionInput
                      suggestion={suggestions['facilityAddress']}
                      onAccept={(value) => {
                        field.onChange(value);
                        onAcceptSuggestion('facilityAddress', value);
                      }}
                      onReject={() => onRejectSuggestion('facilityAddress')}
                    >
                      <Input 
                        placeholder="Enter complete facility address" 
                        {...field} 
                        data-testid="facilityAddress-input"
                      />
                    </SuggestionInput>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="county"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>County *</FormLabel>
                    <FormControl>
                      <SuggestionInput
                        suggestion={suggestions['county']}
                        onAccept={(value) => {
                          field.onChange(value);
                          onAcceptSuggestion('county', value);
                        }}
                        onReject={() => onRejectSuggestion('county')}
                      >
                        <Input 
                          placeholder="Enter county" 
                          {...field} 
                          data-testid="county-input"
                        />
                      </SuggestionInput>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="regulatedEntityNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Regulated Entity Number *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="RN123456789" 
                        {...field} 
                        data-testid="regulatedEntityNumber-input"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="latitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Latitude *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="29.738333" 
                        {...field} 
                        data-testid="latitude-input"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="longitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Longitude *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="-95.168056" 
                        {...field} 
                        data-testid="longitude-input"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="industryType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Industry Type *</FormLabel>
                  <FormControl>
                    <SuggestionSelect
                      value={field.value}
                      onValueChange={field.onChange}
                      suggestion={suggestions['industryType']}
                      onAccept={(value) => {
                        field.onChange(value);
                        onAcceptSuggestion('industryType', value);
                      }}
                      onReject={() => onRejectSuggestion('industryType')}
                      placeholder="Select industry type"
                    >
                      {INDUSTRY_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
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