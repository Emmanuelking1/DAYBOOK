create table if not exists workspaces (
  id text primary key,
  user_id text not null unique,
  name text not null default 'Saviour Books',
  service_description text not null,
  spend_limit_cents integer not null default 2500,
  pilot_loaded boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists search_runs (
  id text primary key,
  user_id text not null,
  industry text not null,
  country text not null,
  region text not null default '',
  city text not null default '',
  target_count integer not null,
  contact_roles jsonb not null default '[]'::jsonb,
  email_types jsonb not null default '[]'::jsonb,
  prefer_multiple boolean not null default false,
  require_website boolean not null default true,
  exclusions text not null default '',
  max_spend_cents integer not null,
  simulate_failure boolean not null default false,
  verify_attempts integer not null default 0,
  is_pilot boolean not null default false,
  status text not null,
  failed_stage text,
  discovered_count integer not null default 0,
  examined_count integer not null default 0,
  matched_count integer not null default 0,
  eligible_count integer not null default 0,
  completed_count integer not null default 0,
  duplicate_count integer not null default 0,
  spent_cents integer not null default 0,
  note text not null default '',
  error text,
  summary text,
  progress jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  started_at timestamptz,
  finished_at timestamptz
);

create index if not exists search_runs_user_idx on search_runs (user_id, created_at desc);
create unique index if not exists search_runs_one_pilot_idx on search_runs (user_id) where is_pilot;

create table if not exists businesses (
  id text primary key,
  user_id text not null,
  search_id text not null references search_runs (id) on delete cascade,
  catalog_key text not null,
  name text not null,
  normalized_name text not null,
  domain text,
  category text not null,
  address text not null,
  city text not null,
  region text not null,
  country text not null,
  website text,
  location_count integer,
  employee_band text,
  review_status text not null default 'not_reviewed',
  tags jsonb not null default '[]'::jsonb,
  notes text not null default '',
  duplicate_of text,
  conflict_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists businesses_user_idx on businesses (user_id, updated_at desc);
create index if not exists businesses_domain_idx on businesses (user_id, domain);
create index if not exists businesses_search_idx on businesses (search_id);

create table if not exists contacts (
  id text primary key,
  user_id text not null,
  business_id text not null references businesses (id) on delete cascade,
  name text not null,
  first_name text not null default '',
  title text not null,
  contact_type text not null,
  role_label text not null,
  created_at timestamptz not null default now()
);

create index if not exists contacts_business_idx on contacts (business_id);

create table if not exists email_addresses (
  id text primary key,
  user_id text not null,
  contact_id text not null references contacts (id) on delete cascade,
  business_id text not null references businesses (id) on delete cascade,
  email text not null,
  email_type text not null,
  source text not null,
  documented boolean not null default true,
  predicted boolean not null default false,
  verification_status text not null,
  verification_provider text,
  verification_detail text,
  verified_at timestamptz,
  suppressed boolean not null default false
);

create index if not exists emails_user_email_idx on email_addresses (user_id, email);
create index if not exists emails_status_idx on email_addresses (user_id, verification_status);

create table if not exists evidence (
  id text primary key,
  user_id text not null,
  business_id text not null references businesses (id) on delete cascade,
  source_label text not null,
  source_ref text not null,
  provider text not null,
  claim text not null,
  value text not null,
  confidence text not null,
  retrieved_at timestamptz not null default now()
);

create index if not exists evidence_business_idx on evidence (business_id);

create table if not exists lead_scores (
  id text primary key,
  user_id text not null,
  business_id text not null unique references businesses (id) on delete cascade,
  industry_fit integer not null,
  operational_complexity integer not null,
  growth_signals integer not null,
  decision_maker integer not null,
  business_completeness integer not null,
  contact_quality integer not null,
  total integer not null,
  confidence text not null,
  explanation text not null,
  reasons jsonb not null default '[]'::jsonb,
  missing_information jsonb not null default '[]'::jsonb,
  model_version text not null,
  scored_at timestamptz not null default now()
);

create index if not exists lead_scores_total_idx on lead_scores (user_id, total desc);

create table if not exists outreach_drafts (
  id text primary key,
  user_id text not null,
  business_id text not null references businesses (id) on delete cascade,
  contact_id text,
  subject text not null,
  body text not null,
  tone text not null,
  status text not null default 'draft',
  origin text not null,
  warnings jsonb not null default '[]'::jsonb,
  evidence_refs jsonb not null default '[]'::jsonb,
  edited boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists drafts_user_idx on outreach_drafts (user_id, updated_at desc);

create table if not exists activity_events (
  id text primary key,
  user_id text not null,
  business_id text,
  search_id text,
  kind text not null,
  detail text not null,
  created_at timestamptz not null default now()
);

create index if not exists activity_business_idx on activity_events (business_id, created_at desc);

create table if not exists suppression_list (
  id text primary key,
  user_id text not null,
  contact_key text not null,
  reason text not null,
  created_at timestamptz not null default now(),
  unique (user_id, contact_key)
);

create table if not exists usage_events (
  id text primary key,
  user_id text not null,
  search_id text,
  provider text not null,
  operation text not null,
  units integer not null,
  estimated_cents integer not null,
  created_at timestamptz not null default now()
);

create index if not exists usage_user_idx on usage_events (user_id, created_at desc);
