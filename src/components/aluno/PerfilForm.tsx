"use client";

import { useActionState, useRef, useState } from "react";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { updateAlunoPerfil } from "@/lib/actions/auth";
import { createClient } from "@/utils/supabase/client";
import type { Profile } from "@/types/database";

interface PerfilFormProps {
  profile: Profile;
}

export function PerfilForm({ profile }: PerfilFormProps) {
  const [fotoUrl, setFotoUrl] = useState(profile.foto_url || "");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string; success?: boolean } | null, formData: FormData) => {
      if (fotoUrl) formData.set("foto_url", fotoUrl);
      return (await updateAlunoPerfil(formData)) ?? null;
    },
    null
  );

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const path = `${profile.id}/avatar.${ext}`;

    const { error } = await supabase.storage.from("avatars").upload(path, file, {
      upsert: true,
    });

    if (!error) {
      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(path);
      setFotoUrl(publicUrl);
    }

    setUploading(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Meus Dados</CardTitle>
      </CardHeader>

      <div className="flex flex-col items-center mb-6">
        <div
          className="relative w-24 h-24 rounded-full bg-teal-100 flex items-center justify-center overflow-hidden cursor-pointer group"
          onClick={() => fileRef.current?.click()}
        >
          {fotoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={fotoUrl} alt="Foto de perfil" className="w-full h-full object-cover" />
          ) : (
            <span className="text-3xl font-bold text-teal-700">
              {profile.nome.charAt(0).toUpperCase()}
            </span>
          )}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="w-6 h-6 text-white" />
          </div>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handlePhotoUpload}
        />
        <p className="text-xs text-gray-500 mt-2">
          {uploading ? "Enviando..." : "Clique para alterar foto"}
        </p>
      </div>

      {state?.success && (
        <div className="bg-emerald-50 text-emerald-700 text-sm p-3 rounded-lg mb-4">
          Perfil atualizado com sucesso!
        </div>
      )}

      <form action={formAction} className="space-y-4">
        <Input label="Nome" value={profile.nome} disabled />
        <Input label="Email" value={profile.email} disabled />
        <Input
          label="Telefone"
          name="telefone"
          type="tel"
          defaultValue={profile.telefone || ""}
          placeholder="(11) 99999-9999"
        />

        {state?.error && (
          <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg">
            {state.error}
          </div>
        )}

        <Button type="submit" loading={pending}>
          Salvar Alterações
        </Button>
      </form>
    </Card>
  );
}
