-- ============================================================
-- Personal Trainer Manager - Database Schema
-- Execute this in Supabase SQL Editor
-- ============================================================

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('personal', 'aluno')),
  telefone TEXT,
  data_nascimento DATE,
  foto_url TEXT,
  personal_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  codigo_convite TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_personal_id ON profiles(personal_id);
CREATE INDEX IF NOT EXISTS idx_profiles_tipo ON profiles(tipo);
CREATE INDEX IF NOT EXISTS idx_profiles_codigo_convite ON profiles(codigo_convite);

-- Metricas table
CREATE TABLE IF NOT EXISTS metricas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  aluno_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  peso DECIMAL(5,2) NOT NULL CHECK (peso > 0),
  altura DECIMAL(5,2) NOT NULL CHECK (altura > 0),
  imc DECIMAL(4,2) NOT NULL,
  percentual_gordura DECIMAL(4,2) CHECK (percentual_gordura >= 0 AND percentual_gordura <= 100),
  data_registro TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_metricas_aluno_id ON metricas(aluno_id);
CREATE INDEX IF NOT EXISTS idx_metricas_data ON metricas(data_registro);

-- Treinos table
CREATE TABLE IF NOT EXISTS treinos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  aluno_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  nome_treino TEXT NOT NULL,
  descricao TEXT,
  dia_semana INTEGER NOT NULL CHECK (dia_semana BETWEEN 0 AND 6),
  criado_em TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_treinos_aluno_id ON treinos(aluno_id);

-- Exercicios table
CREATE TABLE IF NOT EXISTS exercicios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  treino_id UUID NOT NULL REFERENCES treinos(id) ON DELETE CASCADE,
  nome_exercicio TEXT NOT NULL,
  series INTEGER NOT NULL CHECK (series > 0),
  repeticoes TEXT NOT NULL,
  carga TEXT,
  observacoes TEXT,
  ordem INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_exercicios_treino_id ON exercicios(treino_id);

-- Pagamentos table
CREATE TABLE IF NOT EXISTS pagamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  aluno_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  valor DECIMAL(10,2) NOT NULL CHECK (valor > 0),
  status TEXT NOT NULL CHECK (status IN ('pago', 'pendente', 'atrasado')),
  data_vencimento DATE NOT NULL,
  data_pagamento DATE,
  observacoes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pagamentos_aluno_id ON pagamentos(aluno_id);
CREATE INDEX IF NOT EXISTS idx_pagamentos_status ON pagamentos(status);

-- ============================================================
-- Helper functions for RLS
-- ============================================================

CREATE OR REPLACE FUNCTION get_personal_by_invite_code(code TEXT)
RETURNS UUID AS $$
  SELECT id FROM profiles
  WHERE codigo_convite = upper(code) AND tipo = 'personal'
  LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION is_personal_of_aluno(aluno UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = aluno
      AND personal_id = auth.uid()
      AND tipo = 'aluno'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION get_user_tipo()
RETURNS TEXT AS $$
  SELECT tipo FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ============================================================
-- Row Level Security
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE metricas ENABLE ROW LEVEL SECURITY;
ALTER TABLE treinos ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercicios ENABLE ROW LEVEL SECURITY;
ALTER TABLE pagamentos ENABLE ROW LEVEL SECURITY;

-- PROFILES policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Personal can view their students"
  ON profiles FOR SELECT
  USING (
    get_user_tipo() = 'personal'
    AND personal_id = auth.uid()
  );

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Personal can update their students"
  ON profiles FOR UPDATE
  USING (is_personal_of_aluno(id));

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Personal can insert students"
  ON profiles FOR INSERT
  WITH CHECK (
    get_user_tipo() = 'personal'
    AND tipo = 'aluno'
    AND personal_id = auth.uid()
  );

-- METRICAS policies
CREATE POLICY "Aluno can view own metricas"
  ON metricas FOR SELECT
  USING (aluno_id = auth.uid());

CREATE POLICY "Personal can view student metricas"
  ON metricas FOR SELECT
  USING (is_personal_of_aluno(aluno_id));

CREATE POLICY "Personal can insert student metricas"
  ON metricas FOR INSERT
  WITH CHECK (is_personal_of_aluno(aluno_id));

CREATE POLICY "Personal can update student metricas"
  ON metricas FOR UPDATE
  USING (is_personal_of_aluno(aluno_id));

CREATE POLICY "Personal can delete student metricas"
  ON metricas FOR DELETE
  USING (is_personal_of_aluno(aluno_id));

-- TREINOS policies
CREATE POLICY "Aluno can view own treinos"
  ON treinos FOR SELECT
  USING (aluno_id = auth.uid());

CREATE POLICY "Personal can view student treinos"
  ON treinos FOR SELECT
  USING (is_personal_of_aluno(aluno_id));

CREATE POLICY "Personal can manage student treinos"
  ON treinos FOR INSERT
  WITH CHECK (is_personal_of_aluno(aluno_id));

CREATE POLICY "Personal can update student treinos"
  ON treinos FOR UPDATE
  USING (is_personal_of_aluno(aluno_id));

CREATE POLICY "Personal can delete student treinos"
  ON treinos FOR DELETE
  USING (is_personal_of_aluno(aluno_id));

-- EXERCICIOS policies
CREATE POLICY "Aluno can view own exercicios"
  ON exercicios FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM treinos t
      WHERE t.id = exercicios.treino_id
        AND t.aluno_id = auth.uid()
    )
  );

CREATE POLICY "Personal can view student exercicios"
  ON exercicios FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM treinos t
      WHERE t.id = exercicios.treino_id
        AND is_personal_of_aluno(t.aluno_id)
    )
  );

CREATE POLICY "Personal can manage student exercicios"
  ON exercicios FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM treinos t
      WHERE t.id = exercicios.treino_id
        AND is_personal_of_aluno(t.aluno_id)
    )
  );

CREATE POLICY "Personal can update student exercicios"
  ON exercicios FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM treinos t
      WHERE t.id = exercicios.treino_id
        AND is_personal_of_aluno(t.aluno_id)
    )
  );

CREATE POLICY "Personal can delete student exercicios"
  ON exercicios FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM treinos t
      WHERE t.id = exercicios.treino_id
        AND is_personal_of_aluno(t.aluno_id)
    )
  );

-- PAGAMENTOS policies
CREATE POLICY "Aluno can view own pagamentos"
  ON pagamentos FOR SELECT
  USING (aluno_id = auth.uid());

CREATE POLICY "Personal can view student pagamentos"
  ON pagamentos FOR SELECT
  USING (is_personal_of_aluno(aluno_id));

CREATE POLICY "Personal can manage student pagamentos"
  ON pagamentos FOR INSERT
  WITH CHECK (is_personal_of_aluno(aluno_id));

CREATE POLICY "Personal can update student pagamentos"
  ON pagamentos FOR UPDATE
  USING (is_personal_of_aluno(aluno_id));

CREATE POLICY "Personal can delete student pagamentos"
  ON pagamentos FOR DELETE
  USING (is_personal_of_aluno(aluno_id));

-- ============================================================
-- Storage bucket for profile photos
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Anyone can view avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update own avatar"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own avatar"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
