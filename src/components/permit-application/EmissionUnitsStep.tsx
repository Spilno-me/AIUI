import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SelectItem } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { usePermitApplicationStore, type EmissionUnit } from '@/store/usePermitApplicationStore';
import { emissionUnitsStepSchema, type EmissionUnitsStepData } from '@/lib/validationSchemas';
import { SuggestionInput } from '@/components/ui/suggestion-input';
import { SuggestionTextarea } from '@/components/ui/suggestion-textarea';
import { useAISuggestions } from '@/hooks/useAISuggestions';
import { Plus, Trash2, Factory2 } from 'lucide-react';
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select';

const UNIT_TYPES = [
  { value: 'storage_tank', label: 'Storage Tank' },
  { value: 'combustion_source', label: 'Combustion Source' },
  { value: 'process_vent', label: 'Process Vent' },
  { value: 'fugitive', label: 'Fugitive Emissions' },
  { value: 'other', label: 'Other' },
] as const;

const COMMON_POLLUTANTS = [
  'VOCs (Volatile Organic Compounds)',
  'NOx (Nitrogen Oxides)',
  'SO2 (Sulfur Dioxide)',
  'PM (Particulate Matter)',
  'CO (Carbon Monoxide)',
  'HAPs (Hazardous Air Pollutants)',
  'CO2 (Carbon Dioxide)',
  'CH4 (Methane)',
];

interface EmissionUnitsStepProps {
  onNext: () => void;
  onPrevious: () => void;
  suggestions: ReturnType<typeof useAISuggestions>['suggestions'];
  onAcceptSuggestion: (fieldName: string, value: any) => void;
  onRejectSuggestion: (fieldName: string) => void;
}

export function EmissionUnitsStep({ onNext, onPrevious, suggestions, onAcceptSuggestion, onRejectSuggestion }: EmissionUnitsStepProps) {
  const { data, updateEmissionUnits, addEmissionUnit, removeEmissionUnit, updateEmissionUnit, markStepCompleted } = usePermitApplicationStore();
  const [showAddUnit, setShowAddUnit] = useState(false);
  const [newUnit, setNewUnit] = useState<Partial<EmissionUnit>>({
    unitType: undefined,
    description: '',
    pollutants: [],
    controlDevice: '',
  });
  
  const form = useForm<EmissionUnitsStepData>({
    resolver: zodResolver(emissionUnitsStepSchema),
    defaultValues: {
      primaryOperations: data.primaryOperations,
      emissionUnits: data.emissionUnits,
      hasVOCStorage: data.hasVOCStorage,
      hasParticulates: data.hasParticulates,
      hasCombustionSources: data.hasCombustionSources,
      estimatedAnnualEmissions: data.estimatedAnnualEmissions,
    },
  });

  const handleFormSubmit = (formData: EmissionUnitsStepData) => {
    updateEmissionUnits(formData);
    markStepCompleted(2);
    onNext();
  };

  const handleAddUnit = () => {
    if (newUnit.unitType && newUnit.description && newUnit.pollutants && newUnit.pollutants.length > 0) {
      const unit: EmissionUnit = {
        id: Date.now().toString(),
        unitType: newUnit.unitType as EmissionUnit['unitType'],
        description: newUnit.description,
        pollutants: newUnit.pollutants,
        controlDevice: newUnit.controlDevice,
      };
      addEmissionUnit(unit);
      form.setValue('emissionUnits', [...form.getValues('emissionUnits'), unit]);
      setNewUnit({ unitType: undefined, description: '', pollutants: [], controlDevice: '' });
      setShowAddUnit(false);
    }
  };

  const handleRemoveUnit = (id: string) => {
    removeEmissionUnit(id);
    form.setValue('emissionUnits', form.getValues('emissionUnits').filter(u => u.id !== id));
  };

  const togglePollutant = (pollutant: string) => {
    const current = newUnit.pollutants || [];
    if (current.includes(pollutant)) {
      setNewUnit({ ...newUnit, pollutants: current.filter(p => p !== pollutant) });
    } else {
      setNewUnit({ ...newUnit, pollutants: [...current, pollutant] });
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <Factory2 className="h-12 w-12 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold">Emission Units & Operations</CardTitle>
        <CardDescription>
          Describe your facility's operations and emission sources
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="primaryOperations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary Operations Description *</FormLabel>
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
                        placeholder="Describe your facility's primary operations, processes, and activities..."
                        className="min-h-[120px]"
                        {...field}
                        data-testid="primaryOperations-textarea"
                      />
                    </SuggestionTextarea>
                  </FormControl>
                  <FormDescription>
                    Provide a detailed description of all major operations at your facility
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Emission Units Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Emission Units *</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddUnit(!showAddUnit)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Unit
                </Button>
              </div>

              {form.watch('emissionUnits').length === 0 && !showAddUnit && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No emission units added yet. Click "Add Unit" to start.
                </p>
              )}

              {/* Existing Units */}
              {form.watch('emissionUnits').map((unit) => (
                <div key={unit.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="font-medium">{UNIT_TYPES.find(t => t.value === unit.unitType)?.label}</p>
                      <p className="text-sm text-muted-foreground">{unit.description}</p>
                      <p className="text-sm"><span className="font-medium">Pollutants:</span> {unit.pollutants.join(', ')}</p>
                      {unit.controlDevice && (
                        <p className="text-sm"><span className="font-medium">Control Device:</span> {unit.controlDevice}</p>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveUnit(unit.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}

              {/* Add New Unit Form */}
              {showAddUnit && (
                <div className="border rounded-lg p-4 space-y-4 bg-muted/30">
                  <Select
                    value={newUnit.unitType}
                    onValueChange={(value) => setNewUnit({ ...newUnit, unitType: value as EmissionUnit['unitType'] })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit type" />
                    </SelectTrigger>
                    <SelectContent>
                      {UNIT_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Input
                    placeholder="Unit description"
                    value={newUnit.description}
                    onChange={(e) => setNewUnit({ ...newUnit, description: e.target.value })}
                  />

                  <div>
                    <p className="text-sm font-medium mb-2">Select Pollutants:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {COMMON_POLLUTANTS.map((pollutant) => (
                        <label key={pollutant} className="flex items-center space-x-2 text-sm">
                          <Checkbox
                            checked={newUnit.pollutants?.includes(pollutant)}
                            onCheckedChange={() => togglePollutant(pollutant)}
                          />
                          <span>{pollutant}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <Input
                    placeholder="Control device (optional)"
                    value={newUnit.controlDevice}
                    onChange={(e) => setNewUnit({ ...newUnit, controlDevice: e.target.value })}
                  />

                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowAddUnit(false);
                        setNewUnit({ unitType: undefined, description: '', pollutants: [], controlDevice: '' });
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleAddUnit}
                      disabled={!newUnit.unitType || !newUnit.description || !newUnit.pollutants?.length}
                    >
                      Add Unit
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Checkboxes */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="hasVOCStorage"
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
                        Facility has VOC storage tanks
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hasParticulates"
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
                        Facility generates particulate matter
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hasCombustionSources"
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
                        Facility has combustion sources
                      </FormLabel>
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
                  <FormLabel>Estimated Annual Emissions (tons/year) *</FormLabel>
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
                        placeholder="e.g., 250"
                        {...field}
                        data-testid="estimatedAnnualEmissions-input"
                      />
                    </SuggestionInput>
                  </FormControl>
                  <FormDescription>
                    Total estimated emissions from all sources
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