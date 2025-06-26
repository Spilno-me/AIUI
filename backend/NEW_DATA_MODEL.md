# Federal Operating Permit Application Wizard Data Model

This document describes the frontend data model used by the Federal Operating Permit Application Wizard React TypeScript components.

## Overview

The permit application wizard implements a 4-step progressive form system that collects facility information, emission unit details, compliance requirements, and displays a summary. The data model ensures type safety and validation consistency across the React TypeScript frontend for environmental permit applications.

## Frontend Data Models (TypeScript)

### State Management (Zustand Store)

```typescript
interface PermitApplicationData {
  // Step 1: Facility Information
  facilityName: string;
  operatorName: string;
  facilityAddress: string;
  county: string;
  latitude: string;
  longitude: string;
  regulatedEntityNumber: string;
  industryType: 'petrochemical' | 'manufacturing' | 'power_generation' | 'refining' | 'chemical' | 'other';
  
  // Step 2: Emission Units & Operations
  primaryOperations: string;
  emissionUnits: EmissionUnit[];
  hasVOCStorage: boolean;
  hasParticulates: boolean;
  hasCombustionSources: boolean;
  estimatedAnnualEmissions: string;
  
  // Step 3: Compliance & Monitoring
  subjectToNSR: boolean;
  hasRiskManagementPlan: boolean;
  monitoringRequirements: string[];
  complianceMethod: 'continuous' | 'periodic' | 'predictive' | 'parametric';
  stratosphericOzoneCompliance: boolean;
  
  // Step 4: Additional Requirements
  emissionCreditsUsed: boolean;
  volatileOrganicCompounds: boolean;
  subscribeToUpdates: boolean;
}

interface EmissionUnit {
  id: string;
  unitType: 'storage_tank' | 'combustion_source' | 'process_vent' | 'fugitive' | 'other';
  description: string;
  pollutants: string[];
  controlDevice?: string;
}
```

### Validation Schemas (Zod)

The frontend uses Zod schemas that mirror environmental regulatory validation:

#### Facility Information Schema
```typescript
const facilitySchema = z.object({
  facilityName: z.string().min(3, "Facility name must be at least 3 characters").max(100),
  operatorName: z.string().min(2, "Operator name must be at least 2 characters").max(100),
  facilityAddress: z.string().min(10, "Please provide complete facility address").max(200),
  county: z.string().min(1, "Please select a county"),
  latitude: z.string().regex(/^-?\d{1,2}\.\d+$/, "Please enter valid latitude (e.g., 29.738333)"),
  longitude: z.string().regex(/^-?\d{1,3}\.\d+$/, "Please enter valid longitude (e.g., -95.168056)"),
  regulatedEntityNumber: z.string().regex(/^RN\d{9}$/, "Format: RN followed by 9 digits"),
  industryType: z.enum(['petrochemical', 'manufacturing', 'power_generation', 'refining', 'chemical', 'other'])
});
```

#### Emission Units Schema
```typescript
const emissionUnitsSchema = z.object({
  primaryOperations: z.string().min(20, "Please provide detailed description (minimum 20 characters)").max(500),
  emissionUnits: z.array(z.object({
    id: z.string(),
    unitType: z.enum(['storage_tank', 'combustion_source', 'process_vent', 'fugitive', 'other']),
    description: z.string().min(10, "Unit description required").max(200),
    pollutants: z.array(z.string()).min(1, "At least one pollutant must be specified"),
    controlDevice: z.string().optional()
  })).min(1, "At least one emission unit is required"),
  hasVOCStorage: z.boolean(),
  hasParticulates: z.boolean(),
  hasCombustionSources: z.boolean(),
  estimatedAnnualEmissions: z.string().min(1, "Please provide emission estimate")
});
```

#### Compliance Requirements Schema
```typescript
const complianceSchema = z.object({
  subjectToNSR: z.boolean(),
  hasRiskManagementPlan: z.boolean(),
  monitoringRequirements: z.array(z.string()).min(1, "Select applicable monitoring requirements"),
  complianceMethod: z.enum(['continuous', 'periodic', 'predictive', 'parametric']),
  stratosphericOzoneCompliance: z.boolean()
});
```

#### Additional Requirements Schema
```typescript
const additionalRequirementsSchema = z.object({
  emissionCreditsUsed: z.boolean(),
  volatileOrganicCompounds: z.boolean(),
  subscribeToUpdates: z.boolean()
});
```

## Data Flow Architecture

### Step Progression Logic
1. **Sequential Validation**: Each step must be completed and validated before proceeding
2. **Regulatory Compliance**: Form validates against Texas Clean Air Act requirements
3. **State Persistence**: Application data persists across navigation using Zustand store
4. **Bidirectional Navigation**: Users can return to previous steps to modify information

## Environmental Compliance Features

### Regulatory References
- **Texas Clean Air Act (TCAA)**: Chapter 382 compliance validation
- **30 TAC Chapter 122**: Federal Operating Permits requirements
- **40 CFR Parts 60, 61, 68**: Federal regulatory compliance checks
- **New Source Review**: Automatic flagging for NSR requirements

### Monitoring Requirements
The system supports various monitoring types:
- **Continuous Emission Monitoring Systems (CEMS)**
- **Compliance Assurance Monitoring (CAM)**
- **Periodic Monitoring**: Quarterly/annual inspection schedules
- **Parametric Monitoring**: Control device parameters

## WebSocket Communication

The system uses WebSocket for real-time regulatory updates:

- **Regulation Updates**: Real-time notifications of regulatory changes
- **Permit Status**: Live updates on application review status
- **Compliance Alerts**: Immediate notification of compliance issues

## Validation Strategy

Frontend validation ensures regulatory compliance:

- **Coordinate Validation**: GPS coordinates within Texas boundaries
- **Entity Number Format**: RN + 9-digit validation for TCEQ system
- **Emission Thresholds**: Automatic major source determination
- **Control Device Requirements**: Validates required control technology

## Security Considerations

- **Environmental Data Protection**: Sensitive facility information encryption
- **Regulatory Compliance**: Audit trail for all data modifications
- **Access Control**: Role-based permissions for different user types
- **Data Retention**: 5-year record retention per 30 TAC § 122.144

## Permit Types Supported

- **Federal Operating Permits**: Title V permits under Clean Air Act
- **New Source Review**: Prevention of Significant Deterioration (PSD)
- **Minor Source Permits**: State-only operating permits
- **Permit Modifications**: Significant and minor modifications

## Integration Points

- **TCEQ Database**: Direct integration with Texas environmental database
- **EPA Systems**: Federal reporting and compliance tracking
- **Local Agencies**: Harris County and other local air quality districts
- **Industry Standards**: API, ASTM, and other technical standards