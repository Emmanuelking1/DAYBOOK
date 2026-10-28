alter table businesses add column if not exists site_scan text not null default 'pending';
