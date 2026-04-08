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

-- CRUD publico sobre la tabla productos (proyecto simple/frontend)
create policy "Escritura publica productos"
on productos
for all
using (true)
with check (true);

-- Bucket de imagenes
insert into storage.buckets (id, name, public)
values ('productos', 'productos', true)
on conflict (id) do nothing;

-- Lectura publica de imagenes del bucket productos
create policy "Public read productos storage"
on storage.objects
for select
using (bucket_id = 'productos');

-- Subida publica al bucket productos
create policy "Public insert productos storage"
on storage.objects
for insert
with check (bucket_id = 'productos');

-- Opcional: update/delete de archivos
create policy "Public update productos storage"
on storage.objects
for update
using (bucket_id = 'productos')
with check (bucket_id = 'productos');

create policy "Public delete productos storage"
on storage.objects
for delete
using (bucket_id = 'productos');
