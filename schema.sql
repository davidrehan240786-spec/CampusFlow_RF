-- Database Schema for CampusFlow

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Users Table (Synchronized with auth.users)
create table public.users (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  full_name text,
  role text default 'student' check (role in ('student', 'staff')),
  status text default 'Active',
  trust_score int default 100,
  major text,
  department text,
  last_active timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS for users
alter table public.users enable row level security;

-- Policies for users
create policy "Users are viewable by everyone" on public.users 
  for select using (true);
create policy "Users can update own profile" on public.users 
  for update using (auth.uid() = id);

-- Trigger to sync auth.users to public.users
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', coalesce(new.raw_user_meta_data->>'name', 'Unknown User'))
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 2. Listings Table
create table public.listings (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  price numeric(10, 2),
  seller_id uuid references public.users(id) on delete cascade not null,
  category text,
  condition text,
  image_url text,
  location text,
  type text not null check (type in ('Sale', 'Lost', 'Found', 'Service')),
  views int default 0,
  status text default 'Active' check (status in ('Active', 'Sold', 'Resolved', 'Flagged')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS for listings
alter table public.listings enable row level security;

create policy "Listings are viewable by everyone" on public.listings 
  for select using (true);
create policy "Authenticated users can create listings" on public.listings 
  for insert with check (auth.role() = 'authenticated');
create policy "Users can update own listings" on public.listings 
  for update using (auth.uid() = seller_id);
create policy "Users can delete own listings" on public.listings
  for delete using (auth.uid() = seller_id);


-- 3. Meetups Table
create table public.meetups (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  title text not null,
  meetup_date date not null,
  meetup_time text not null,
  location text,
  with_user_id uuid references public.users(id) on delete set null,
  type text default 'Exchange',
  status text default 'Scheduled' check (status in ('Scheduled', 'Completed', 'Cancelled')),
  created_at timestamptz default now()
);

-- RLS for meetups
alter table public.meetups enable row level security;
create policy "Users can view own meetups" on public.meetups
  for select using (auth.uid() = user_id or auth.uid() = with_user_id);
create policy "Users can create meetups" on public.meetups
  for insert with check (auth.role() = 'authenticated');
create policy "Users can update own meetups" on public.meetups
  for update using (auth.uid() = user_id);

-- 4. Set up an RPC function to promote to staff (Helper)
create or replace function public.make_staff(user_email text)
returns void as $$
begin
  update public.users set role = 'staff' where email = user_email;
end;
$$ language plpgsql security definer;
