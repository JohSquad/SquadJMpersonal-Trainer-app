"use client";

import { Copy, Check } from "lucide-react";
import { useState } from "react";

interface CopyInviteCodeProps {
  codigo: string;
}

export function CopyInviteCode({ codigo }: CopyInviteCodeProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(codigo);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex items-center gap-3">
      <div className="p-2 bg-blue-100 rounded-lg">
        <Copy className="w-5 h-5 text-blue-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500">Código de convite</p>
        <div className="flex items-center gap-2">
          <p className="text-lg font-bold text-gray-900 font-mono tracking-wider">
            {codigo}
          </p>
          <button
            onClick={handleCopy}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            title="Copiar código"
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-600" />
            ) : (
              <Copy className="w-4 h-4 text-gray-400" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
