-- On démarre une transaction afin de s'assurer de la cohérence gloabale de la BDD
BEGIN;

-- D'abord on supprime les table 'si elle existe"
DROP TABLE IF EXISTS "users", "receipts", "ingredients", "tags", "receipts_has_tags", "receipts_has_ingredients"  CASCADE;

-- Ensuite on la (re)crée

CREATE TABLE "users" (
  -- on utilise le nouveau type qui est un standart SQL alors que SERIAL est un pseudo-type de PG
  "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "firstName" TEXT NOT NULL DEFAULT '',
  "secondName" TEXT NOT NULL DEFAULT '',
  "email" TEXT NOT NULL DEFAULT '',
  "password" TEXT NOT NULL DEFAULT '',
  "is_admin" BOOLEAN NOT NULL DEFAULT FALSE,
  "is_confirm" BOOLEAN NOT NULL DEFAULT FALSE, 
  -- pour avoir la date et l'heure on utilise le type "timestamp", et pour être le plus précis possible on utilisera plutôt le type "timestampz" qui contient en plus de la date et de l'heure le fuseau horaire défini dans les locales du serveur
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ
);

CREATE TABLE "receipts" (
    "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" TEXT NOT NULL DEFAULT '',
    "step" TEXT [],
    "user_id" INTEGER NOT NULL REFERENCES users("id") ON DELETE CASCADE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE "ingredients" (
    "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" TEXT NOT NULL DEFAULT '',
    "unity" TEXT NOT NULL DEFAULT '',
    "unity_number" INTEGER NOT NULL DEFAULT 0,
    "is_important" BOOLEAN NOT NULL DEFAULT FALSE,
    "user_id" INTEGER NOT NULL REFERENCES users("id") ON DELETE CASCADE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE "tags" (
    "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" TEXT NOT NULL DEFAULT '',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE "receipts_has_tags" (
    "tag_id" INTEGER NOT NULL REFERENCES tags("id") ON DELETE CASCADE,
    "receipt_id" INTEGER NOT NULL REFERENCES receipts("id") ON DELETE CASCADE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE "receipts_has_ingredients" (
    "ingredient_id" INTEGER NOT NULL REFERENCES ingredients("id") ON DELETE CASCADE,
    "receipt_id" INTEGER NOT NULL REFERENCES receipts("id") ON DELETE CASCADE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);




COMMIT;