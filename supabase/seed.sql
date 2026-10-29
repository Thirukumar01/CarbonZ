-- CarbonZ Seed Data for Local Testing & Staging
-- All records here are strictly labeled DEMO DATA / Illustrative demonstration models.
-- DO NOT USE IN PRODUCTION AS ACTUAL VERIFICATION CLAIMS.

-- 1. Demo Profiles (Developers, Reviewers, Admins, Users)
-- In a real Supabase instance, these UUIDs would match auth.users records.
INSERT INTO public.profiles (id, display_name, role, organization, avatar_url)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Elena Rostova (Demo Developer)', 'developer', 'Amazonia Flora Conservation Org', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'),
  ('22222222-2222-2222-2222-222222222222', 'Dr. Kwame Mensah (Demo Reviewer)', 'reviewer', 'Global Ecological Audit Bureau', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'),
  ('33333333-3333-3333-3333-333333333333', 'CarbonZ Lead Administrator (Demo)', 'admin', 'CarbonZ Governance Committee', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'),
  ('44444444-4444-4444-4444-444444444444', 'Sarah Chen (Demo Developer)', 'developer', 'Nordic Air Capture Technologies', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150')
ON CONFLICT (id) DO UPDATE SET 
  display_name = EXCLUDED.display_name,
  role = EXCLUDED.role,
  organization = EXCLUDED.organization;

-- 2. Demo Projects
INSERT INTO public.projects (
  id, project_code, name, slug, description, project_type, country, region,
  developer_id, methodology, estimated_reduction, units,
  verification_status, publication_status, submitted_at, verified_at
) VALUES 
(
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'CZ-BRA-2024-001',
  '[DEMO] Amazon Rainforest Corridor Restoration & Biodiversity Buffer',
  'amazon-rainforest-corridor-restoration',
  'Native tree restoration across 14,500 degraded hectares in Para State, establishing an uninterrupted bio-corridor for endangered flora and fauna with continuous satellite canopy monitoring.',
  'reforestation',
  'Brazil',
  'Para Basin',
  '11111111-1111-1111-1111-111111111111',
  'VM0007 / ARR (Afforestation, Reforestation and Revegetation)',
  125000,
  'tCO2e/year',
  'verified',
  'published',
  NOW() - INTERVAL '90 days',
  NOW() - INTERVAL '30 days'
),
(
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'CZ-KEN-2024-002',
  '[DEMO] Lamu Archipelago Mangrove Blue Carbon Initiative',
  'lamu-archipelago-mangrove-blue-carbon',
  'Community-led coastal mangrove conservation and hydrological restoration along 8,200 hectares of tidal wetlands, sequestering high-density sediment organic carbon.',
  'blue_carbon',
  'Kenya',
  'Lamu County Coastline',
  '11111111-1111-1111-1111-111111111111',
  'VM0033 / Tidal Wetland and Seagrass Restoration',
  84000,
  'tCO2e/year',
  'verified',
  'published',
  NOW() - INTERVAL '60 days',
  NOW() - INTERVAL '15 days'
),
(
  'cccccccc-cccc-cccc-cccc-cccccccccccc',
  'CZ-IND-2024-003',
  '[DEMO] Gujarat Rural Dairy Agricultural Methane Recovery',
  'gujarat-rural-dairy-methane-recovery',
  'Cluster deployment of enclosed anaerobic digesters converting manure methane from 42 dairy farming cooperatives into clean domestic biogas and enriched organic bio-fertilizer.',
  'methane_capture',
  'India',
  'Gujarat Western District',
  '11111111-1111-1111-1111-111111111111',
  'AMS-III.D / Methane recovery in animal manure management',
  46000,
  'tCO2e/year',
  'verified',
  'published',
  NOW() - INTERVAL '45 days',
  NOW() - INTERVAL '10 days'
),
(
  'dddddddd-dddd-dddd-dddd-dddddddddddd',
  'CZ-ISL-2024-004',
  '[DEMO] Hellisheidi Geothermal Direct Air Carbon Mineralization',
  'hellisheidi-direct-air-mineralization',
  'Solid sorbent direct atmospheric capture powered by 100% baseload geothermal energy, dissolving CO2 into water and permanently injecting it into basalt formations for in-situ carbon mineralization.',
  'direct_air_capture',
  'Iceland',
  'Hengill Geothermal Field',
  '44444444-4444-4444-4444-444444444444',
  'ISO 14064-2 / Direct Air Capture and Permanent Storage',
  36000,
  'tCO2e/year',
  'under_review',
  'published',
  NOW() - INTERVAL '14 days',
  NULL
),
(
  'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
  'CZ-USA-2024-005',
  '[DEMO] Appalachian Regenerative Soil Organic Carbon Pilot',
  'appalachian-regenerative-soil-carbon-pilot',
  'Multi-paddock adaptive rotational grazing and multi-species cover cropping to rebuild depleted topsoil biology across 22 working family farms in the Appalachian plateau.',
  'soil_carbon',
  'United States',
  'Appalachia / West Virginia',
  '44444444-4444-4444-4444-444444444444',
  'VM0042 / Improved Agricultural Land Management',
  18500,
  'tCO2e/year',
  'changes_requested',
  'draft',
  NOW() - INTERVAL '20 days',
  NULL
)
ON CONFLICT (id) DO NOTHING;

-- 3. Demo Trust Scores
-- Benchmark formula: Score = 0.30D + 0.25V + 0.20E + 0.15H + 0.10T
INSERT INTO public.trust_scores (
  id, project_id, documentation_score, verification_score, evidence_score,
  history_score, transparency_score, calculated_score, formula_version, calculation_status, calculated_by
) VALUES
(
  '10000000-0000-0000-0000-000000000001',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  85.00, 90.00, 80.00, 70.00, 85.00,
  83.00, -- (0.3*85 + 0.25*90 + 0.2*80 + 0.15*70 + 0.1*85) = 25.5 + 22.5 + 16 + 10.5 + 8.5 = 83.00
  'v1.0', 'valid', 'system-engine'
),
(
  '10000000-0000-0000-0000-000000000002',
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  90.00, 95.00, 85.00, 80.00, 90.00,
  88.75, -- (0.3*90 + 0.25*95 + 0.2*85 + 0.15*80 + 0.1*90) = 27 + 23.75 + 17 + 12 + 9 = 88.75
  'v1.0', 'valid', 'system-engine'
),
(
  '10000000-0000-0000-0000-000000000003',
  'cccccccc-cccc-cccc-cccc-cccccccccccc',
  80.00, 90.00, 70.00, 60.00, 75.00,
  77.00, -- Exact Prompt Example: 24 + 22.5 + 14 + 9 + 7.5 = 77.00
  'v1.0', 'valid', 'system-engine'
),
(
  '10000000-0000-0000-0000-000000000004',
  'dddddddd-dddd-dddd-dddd-dddddddddddd',
  95.00, 60.00, 90.00, 50.00, 90.00,
  78.00, -- (28.5 + 15 + 18 + 7.5 + 9) = 78.00
  'v1.0', 'valid', 'system-engine'
)
ON CONFLICT (id) DO NOTHING;

-- 4. Demo Passport Events (Public timeline traceability)
INSERT INTO public.passport_events (
  id, project_id, event_type, public_description, metadata, created_by, created_at
) VALUES
(
  '20000000-0000-0000-0000-000000000001',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'creation',
  'Project registered in draft state by developer Elena Rostova with initial ecological baseline design.',
  '{"actor": "Developer", "scope": "Initial Intake"}'::jsonb,
  '11111111-1111-1111-1111-111111111111',
  NOW() - INTERVAL '100 days'
),
(
  '20000000-0000-0000-0000-000000000002',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'submission',
  'Formal project dossier and baseline telemetry submitted for independent verification review.',
  '{"documents_count": 4, "methodology": "VM0007"}'::jsonb,
  '11111111-1111-1111-1111-111111111111',
  NOW() - INTERVAL '90 days'
),
(
  '20000000-0000-0000-0000-000000000003',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'review_started',
  'Technical review assigned to Dr. Kwame Mensah for methodology compliance and remote canopy cross-referencing.',
  '{"reviewer_org": "Global Ecological Audit Bureau"}'::jsonb,
  '22222222-2222-2222-2222-222222222222',
  NOW() - INTERVAL '80 days'
),
(
  '20000000-0000-0000-0000-000000000004',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'verification',
  'Project successfully verified under CarbonZ Trust Framework v1.0 following multi-spectral satellite confirmation.',
  '{"verification_body": "CarbonZ Verification Panel", "trust_score": 83}'::jsonb,
  '22222222-2222-2222-2222-222222222222',
  NOW() - INTERVAL '30 days'
),
(
  '20000000-0000-0000-0000-000000000005',
  'cccccccc-cccc-cccc-cccc-cccccccccccc',
  'verification',
  'Verification completed and approved. Biogas telemetry meters confirmed active with continuous flow reporting.',
  '{"verification_body": "CarbonZ Verification Panel", "trust_score": 77}'::jsonb,
  '22222222-2222-2222-2222-222222222222',
  NOW() - INTERVAL '10 days'
)
ON CONFLICT (id) DO NOTHING;

-- 5. Demo Project Documents
INSERT INTO public.project_documents (
  id, project_id, uploaded_by, storage_path, original_filename,
  content_type, file_size, evidence_category, visibility, review_status
) VALUES
(
  '30000000-0000-0000-0000-000000000001',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  '11111111-1111-1111-1111-111111111111',
  'projects/amazon-corridor/baseline-canopy-study-2024.pdf',
  'Amazon_Corridor_Ecological_Baseline_2024.pdf',
  'application/pdf',
  4850000,
  'baseline_study',
  'public',
  'accepted'
),
(
  '30000000-0000-0000-0000-000000000002',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  '11111111-1111-1111-1111-111111111111',
  'projects/amazon-corridor/land-tenure-notarized-deed.pdf',
  'Para_State_Land_Title_Registry_Affidavit.pdf',
  'application/pdf',
  2100000,
  'land_tenure',
  'restricted',
  'accepted'
),
(
  '30000000-0000-0000-0000-000000000003',
  'cccccccc-cccc-cccc-cccc-cccccccccccc',
  '11111111-1111-1111-1111-111111111111',
  'projects/gujarat-methane/scada-biogas-flow-audit-q3.pdf',
  'Gujarat_Digester_Telemetry_Log_Q3.pdf',
  'application/pdf',
  1650000,
  'monitoring_report',
  'public',
  'accepted'
)
ON CONFLICT (id) DO NOTHING;

-- 6. Demo Verification Reviews
INSERT INTO public.verification_reviews (
  id, project_id, reviewer_id, decision, review_notes, requested_changes
) VALUES
(
  '40000000-0000-0000-0000-000000000001',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  '22222222-2222-2222-2222-222222222222',
  'approved',
  'High quality submission. Multi-spectral optical and radar imagery corroborates seedling density and canopy stratification. Land tenure title cross-checked with INCRA database.',
  NULL
),
(
  '40000000-0000-0000-0000-000000000002',
  'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
  '22222222-2222-2222-2222-222222222222',
  'changes_requested',
  'Soil organic matter depth sampling is insufficient for parcels 4 and 9. Missing baseline calibration curve.',
  'Provide certified laboratory soil probe analysis for parcels 4 & 9 down to 30cm depth.'
)
ON CONFLICT (id) DO NOTHING;

