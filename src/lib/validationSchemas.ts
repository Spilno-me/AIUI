import { z } from 'zod';

// Step 1: Facility Information
export const facilityStepSchema = z.object({
  facilityName: z.string().trim().min(1, 'Facility name is required').min(3, 'Facility name must be at least 3 characters').max(100, 'Facility name must be less than 100 characters'),
  operatorName: z.string().trim().min(1, 'Operator name is required').min(2, 'Operator name must be at least 2 characters').max(100, 'Operator name must be less than 100 characters'),
  facilityAddress: z.string().trim().min(1, 'Facility address is required').min(10, 'Please provide complete facility address').max(200, 'Address must be less than 200 characters'),
  county: z.string().min(1, 'Please select a county'),
  latitude: z.string().trim().min(1, 'Latitude is required').regex(/^-?\d{1,2}\.\d+$/, 'Please enter valid latitude (e.g., 29.738333)'),
  longitude: z.string().trim().min(1, 'Longitude is required').regex(/^-?\d{1,3}\.\d+$/, 'Please enter valid longitude (e.g., -95.168056)'),
  regulatedEntityNumber: z.string().trim().min(1, 'Regulated Entity Number is required').regex(/^RN\d{9}$/, 'Format: RN followed by 9 digits (e.g., RN123456789)'),
  industryType: z.enum(['petrochemical', 'manufacturing', 'power_generation', 'refining', 'chemical', 'other'], {
    errorMap: () => ({ message: 'Please select an industry type' })
  }),
});

// Step 2: Emission Units & Operations
const emissionUnitSchema = z.object({
  id: z.string(),
  unitType: z.enum(['storage_tank', 'combustion_source', 'process_vent', 'fugitive', 'other']),
  description: z.string().trim().min(10, 'Unit description must be at least 10 characters').max(200, 'Description must be less than 200 characters'),
  pollutants: z.array(z.string()).min(1, 'At least one pollutant must be specified'),
  controlDevice: z.string().optional(),
});

export const emissionUnitsStepSchema = z.object({
  primaryOperations: z.string().trim().min(1, 'Primary operations description is required').min(20, 'Please provide detailed description (minimum 20 characters)').max(500, 'Description must be less than 500 characters'),
  emissionUnits: z.array(emissionUnitSchema).min(1, 'At least one emission unit is required'),
  hasVOCStorage: z.boolean(),
  hasParticulates: z.boolean(),
  hasCombustionSources: z.boolean(),
  estimatedAnnualEmissions: z.string().trim().min(1, 'Please provide emission estimate'),
});

// Step 3: Compliance & Monitoring
export const complianceStepSchema = z.object({
  subjectToNSR: z.boolean(),
  hasRiskManagementPlan: z.boolean(),
  monitoringRequirements: z.array(z.string()).min(1, 'Select at least one monitoring requirement'),
  complianceMethod: z.enum(['continuous', 'periodic', 'predictive', 'parametric'], {
    errorMap: () => ({ message: 'Please select a compliance method' })
  }),
  stratosphericOzoneCompliance: z.boolean(),
});

// Step 4: Additional Requirements (optional fields)
export const additionalRequirementsStepSchema = z.object({
  emissionCreditsUsed: z.boolean(),
  volatileOrganicCompounds: z.boolean(),
  subscribeToUpdates: z.boolean(),
});

// Type exports
export type FacilityStepData = z.infer<typeof facilityStepSchema>;
export type EmissionUnitsStepData = z.infer<typeof emissionUnitsStepSchema>;
export type ComplianceStepData = z.infer<typeof complianceStepSchema>;
export type AdditionalRequirementsStepData = z.infer<typeof additionalRequirementsStepSchema>;
export type EmissionUnit = z.infer<typeof emissionUnitSchema>;