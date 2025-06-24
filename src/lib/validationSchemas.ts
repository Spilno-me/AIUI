import { z } from 'zod';

export const emissionUnitSchema = z.object({
  id: z.string(),
  unitType: z.enum(['storage_tank', 'combustion_source', 'process_vent', 'fugitive', 'other']),
  description: z.string().min(10, 'Unit description required').max(200),
  pollutants: z.array(z.string()).min(1, 'At least one pollutant must be specified'),
  controlDevice: z.string().optional(),
});

export const facilityStepSchema = z.object({
  facilityName: z.string().trim().min(3, 'Facility name must be at least 3 characters').max(100),
  operatorName: z.string().trim().min(2, 'Operator name must be at least 2 characters').max(100),
  facilityAddress: z.string().trim().min(10, 'Please provide complete facility address').max(200),
  county: z.string().min(1, 'Please select a county'),
  latitude: z.string().regex(/^-?\d{1,2}\.\d+$/, 'Please enter valid latitude (e.g., 29.738333)'),
  longitude: z.string().regex(/^-?\d{1,3}\.\d+$/, 'Please enter valid longitude (e.g., -95.168056)'),
  regulatedEntityNumber: z.string().regex(/^RN\d{9}$/, 'Format: RN followed by 9 digits'),
  industryType: z.enum(['petrochemical', 'manufacturing', 'power_generation', 'refining', 'chemical', 'other']),
});

export const emissionUnitsSchema = z.object({
  primaryOperations: z.string().trim().min(20, 'Please provide detailed description (minimum 20 characters)').max(500),
  emissionUnits: z.array(emissionUnitSchema).min(1, 'At least one emission unit is required'),
  hasVOCStorage: z.boolean(),
  hasParticulates: z.boolean(),
  hasCombustionSources: z.boolean(),
  estimatedAnnualEmissions: z.string().min(1, 'Please provide emission estimate'),
});

export const complianceSchema = z.object({
  subjectToNSR: z.boolean(),
  hasRiskManagementPlan: z.boolean(),
  monitoringRequirements: z.array(z.string()).min(1, 'Select applicable monitoring requirements'),
  complianceMethod: z.enum(['continuous', 'periodic', 'predictive', 'parametric']),
  stratosphericOzoneCompliance: z.boolean(),
});

export const additionalRequirementsSchema = z.object({
  emissionCreditsUsed: z.boolean(),
  volatileOrganicCompounds: z.boolean(),
  subscribeToUpdates: z.boolean(),
});

export type FacilityStepData = z.infer<typeof facilityStepSchema>;
export type EmissionUnitsStepData = z.infer<typeof emissionUnitsSchema>;
export type ComplianceStepData = z.infer<typeof complianceSchema>;
export type AdditionalRequirementsStepData = z.infer<typeof additionalRequirementsSchema>;
export type EmissionUnitData = z.infer<typeof emissionUnitSchema>; 