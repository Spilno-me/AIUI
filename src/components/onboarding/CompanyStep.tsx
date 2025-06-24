import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SelectItem } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { usePermitApplicationStore } from '@/store/useOnboardingStore';
import { emissionUnitsSchema, type EmissionUnitsStepData } from '@/lib/validationSchemas';
import { SuggestionInput } from '@/components/ui/suggestion-input';
import { SuggestionSelect } from '@/components/ui/suggestion-select';
import { SuggestionTextarea } from '@/components/ui/suggestion-textarea';
import { SuggestionCheckbox } from '@/components/ui/suggestion-checkbox';
import { useAISuggestions } from '@/hooks/useAISuggestions';
import { Plus, Trash2 } from 'lucide-react';

const UNIT_TYPES = [
  { value: 'storage_tank', label: 'Storage Tank' },
  { value: 'combustion_source', label: 'Combustion Source' },
  { value: 'process_vent', label: 'Process Vent' },
  { value: 'fugitive', label: 'Fugitive' },
  { value: 'other', label: 'Other' },
] as const;

interface EmissionUnitsStepProps {
  onNext: () => void;
  onPrevious: () => void;
  suggestions: ReturnType<typeof useAISuggestions>['suggestions'];
  onAcceptSuggestion: (fieldName: string, value: any) => void;
  onRejectSuggestion: (fieldName: string) => void;
}

export function EmissionUnitsStep({ onNext, onPrevious, suggestions, onAcceptSuggestion, onRejectSuggestion }: EmissionUnitsStepProps) {
  const { data, updateEmissionUnits, markStepCompleted } = usePermitApplicationStore();
  
  const form = useForm<EmissionUnitsStepData>({
    resolver: zodResolver(emissionUnitsSchema),
    defaultValues: {
      primaryOperations: data.primaryOperations,
      emissionUnits: data.emissionUnits.length > 0 ? data.emissionUnits : [{ id: '1', unitType: 'other', description: '', pollutants: [''], controlDevice: '' }],
      hasVOCStorage: data.hasVOCStorage,
      hasParticulates: data.hasParticulates,
      hasCombustionSources: data.hasCombustionSources,
      estimatedAnnualEmissions: data.estimatedAnnualEmissions,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "emissionUnits"
  });

  const handleFormSubmit = (formData: EmissionUnitsStepData) => {
    updateEmissionUnits(formData);
    markStepCompleted(2);
    onNext();
  };

  const addEmissionUnit = () => {
    append({
      id: Date.now().toString(),
      unitType: 'other',
      description: '',
      pollutants: [''],
      controlDevice: ''
    });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Emission Units & Operations ⚡</CardTitle>
        <CardDescription>
          Describe your facility's operations and emission units for the permit application.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="primaryOperations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary Operations *</FormLabel>
                  <FormControl>
                    <SuggestionTextarea
                      suggestion={suggestions['primaryOperations']}
                      onAccept={(value) => {
                        field.onChange(value);
                        onAcceptSuggestion('primaryOperations', value);
                      }}
                      onReject={() => onRejectSuggestion('primaryOperations')}
                    >
                      <Textarea
                        placeholder="Describe your facility's primary operations in detail..."
                        className="min-h-[120px]"
                        {...field}
                        data-testid="primaryOperations-textarea"
                      />
                    </SuggestionTextarea>
                  </FormControl>
                  <FormDescription>
                    Provide a detailed description of the facility's manufacturing processes and operations.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Emission Units</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addEmissionUnit}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Unit
                </Button>
              </div>

              {fields.map((field, index) => (
                <Card key={field.id} className="p-4 border-2">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium">Unit {index + 1}</h4>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`emissionUnits.${index}.unitType`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Unit Type *</FormLabel>
                          <FormControl>
                            <SuggestionSelect
                              value={field.value}
                              onValueChange={field.onChange}
                              onAccept={() => {}}
                              onReject={() => {}}
                              placeholder="Select unit type"
                            >
                              {UNIT_TYPES.map((type) => (
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

                    <FormField
                      control={form.control}
                      name={`emissionUnits.${index}.controlDevice`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Control Device</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Optional control device" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name={`emissionUnits.${index}.description`}
                    render={({ field }) => (
                      <FormItem className="mt-4">
                        <FormLabel>Description *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe this emission unit..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`emissionUnits.${index}.pollutants`}
                    render={({ field }) => (
                      <FormItem className="mt-4">
                        <FormLabel>Pollutants *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter pollutants (comma-separated)" 
                            value={field.value?.join(', ') || ''}
                            onChange={(e) => field.onChange(e.target.value.split(',').map(p => p.trim()).filter(Boolean))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="hasVOCStorage"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-lg">
                    <FormControl>
                      <SuggestionCheckbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        onAccept={() => {}}
                        onReject={() => {}}
                        id="hasVOCStorage"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="cursor-pointer">VOC Storage</FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hasParticulates"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-lg">
                    <FormControl>
                      <SuggestionCheckbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        onAccept={() => {}}
                        onReject={() => {}}
                        id="hasParticulates"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="cursor-pointer">Particulates</FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hasCombustionSources"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-lg">
                    <FormControl>
                      <SuggestionCheckbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        onAccept={() => {}}
                        onReject={() => {}}
                        id="hasCombustionSources"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="cursor-pointer">Combustion Sources</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="estimatedAnnualEmissions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estimated Annual Emissions *</FormLabel>
                  <FormControl>
                    <SuggestionInput
                      suggestion={suggestions['estimatedAnnualEmissions']}
                      onAccept={(value) => {
                        field.onChange(value);
                        onAcceptSuggestion('estimatedAnnualEmissions', value);
                      }}
                      onReject={() => onRejectSuggestion('estimatedAnnualEmissions')}
                    >
                      <Input 
                        placeholder="Enter estimated emissions (tons/year)" 
                        {...field} 
                        data-testid="estimatedAnnualEmissions-input"
                      />
                    </SuggestionInput>
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