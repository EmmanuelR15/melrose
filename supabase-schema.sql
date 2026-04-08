create table productos (
  id uuid default gen_random_uuid() primary key,
  nombre text not null,
  descripcion text,
  precio numeric not null,
  categoria text,
  talles text[],
  imagen_url text,
  destacado boolean default false,
  stock int default 0,
  created_at timestamp default now()
);
alter table productos enable row level security;
create policy "Lectura pública" on productos for select using (true);
