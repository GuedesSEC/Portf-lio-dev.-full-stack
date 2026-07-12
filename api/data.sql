create table ratings (
    id bigint generated always as identity primary key,
    stars int not null check (stars between 1 and 5),
    created_at timestamptz default now()
);