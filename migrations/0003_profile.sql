alter table workspaces add column if not exists owner_name text not null default '';
alter table workspaces add column if not exists avatar text not null default '';
