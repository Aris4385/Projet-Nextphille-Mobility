create extension if not exists "pgcrypto";
create type user_role as enum ('renter', 'owner', 'admin');
create type kyc_status as enum ('pending', 'approved', 'rejected', 'manual_review');
create type kyc_provider as enum ('didit', 'manual');
create type vehicle_status as enum ('draft', 'pending_review', 'published', 'rejected', 'archived');
create type booking_status as enum ('pending', 'accepted', 'rejected', 'cancelled', 'completed');
create type service_type as enum ('vehicule_seul', 'avec_chauffeur');
create type payment_provider as enum ('flooz', 'mixx', 'card');
create type payment_status as enum ('pending', 'success', 'failed', 'refunded');
create type notification_channel as enum ('sms', 'email');
create type notification_status as enum ('pending', 'sent', 'failed');
create type dispute_status as enum ('open', 'resolved');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role user_role not null default 'renter',
  full_name text not null,
  phone text unique not null,
  email text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.kyc_verifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  provider kyc_provider not null default 'didit',
  status kyc_status not null default 'pending',
  id_document_url text,
  selfie_url text,
  provider_reference text,
  provider_raw_result jsonb,
  reviewed_by uuid references public.profiles (id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);
create index idx_kyc_user on public.kyc_verifications (user_id);
create index idx_kyc_status on public.kyc_verifications (status);

create table public.vehicles (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  brand text not null,
  model text not null,
  vehicle_type text not null,
  gamme text,
  daily_rate numeric(10,2) not null,
  currency text not null default 'XOF',
  location_label text not null,
  location_lat numeric(9,6),
  location_lng numeric(9,6),
  description text,
  status vehicle_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_vehicles_owner on public.vehicles (owner_id);
create index idx_vehicles_status on public.vehicles (status);
create index idx_vehicles_type on public.vehicles (vehicle_type);

create table public.vehicle_photos (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid not null references public.vehicles (id) on delete cascade,
  url text not null,
  position int not null default 0
);
create index idx_vehicle_photos_vehicle on public.vehicle_photos (vehicle_id);

create table public.vehicle_blocked_dates (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid not null references public.vehicles (id) on delete cascade,
  start_date date not null,
  end_date date not null,
  reason text
);
create index idx_blocked_dates_vehicle on public.vehicle_blocked_dates (vehicle_id);

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid not null references public.vehicles (id),
  renter_id uuid not null references public.profiles (id),
  owner_id uuid not null references public.profiles (id),
  start_date date not null,
  end_date date not null,
  service_type service_type not null default 'vehicule_seul',
  status booking_status not null default 'pending',
  gross_amount numeric(10,2) not null,
  commission_amount numeric(10,2) not null,
  net_amount numeric(10,2) not null,
  currency text not null default 'XOF',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint valid_dates check (end_date > start_date)
);
create index idx_bookings_vehicle on public.bookings (vehicle_id);
create index idx_bookings_renter on public.bookings (renter_id);
create index idx_bookings_owner on public.bookings (owner_id);
create index idx_bookings_status on public.bookings (status);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings (id) on delete cascade,
  provider payment_provider not null,
  provider_reference text,
  amount numeric(10,2) not null,
  currency text not null default 'XOF',
  status payment_status not null default 'pending',
  paid_at timestamptz,
  created_at timestamptz not null default now()
);
create index idx_payments_booking on public.payments (booking_id);
create index idx_payments_status on public.payments (status);

create table public.invoices (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings (id) on delete cascade,
  pdf_url text not null,
  generated_at timestamptz not null default now()
);
create index idx_invoices_booking on public.invoices (booking_id);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  channel notification_channel not null,
  event_type text not null,
  content text not null,
  status notification_status not null default 'pending',
  sent_at timestamptz,
  created_at timestamptz not null default now()
);
create index idx_notifications_user on public.notifications (user_id);

create table public.disputes (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings (id) on delete cascade,
  raised_by uuid not null references public.profiles (id),
  description text not null,
  status dispute_status not null default 'open',
  resolved_by uuid references public.profiles (id),
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);
create index idx_disputes_booking on public.disputes (booking_id);
create index idx_disputes_status on public.disputes (status);

alter table public.profiles enable row level security;
alter table public.vehicles enable row level security;
alter table public.bookings enable row level security;
alter table public.kyc_verifications enable row level security;

create policy "profiles_self_access" on public.profiles for all using (auth.uid() = id);
create policy "vehicles_public_read" on public.vehicles for select using (status = 'published' or owner_id = auth.uid());
create policy "vehicles_owner_write" on public.vehicles for insert with check (owner_id = auth.uid());
create policy "vehicles_owner_update" on public.vehicles for update using (owner_id = auth.uid());
