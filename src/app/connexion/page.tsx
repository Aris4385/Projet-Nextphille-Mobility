"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import Reveal from "@/components/Reveal";

export default function Connexion() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState("");
  const [chargement, setChargement] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErreur("");
    setChargement(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: motDePasse,
    });

    if (error) {
      setErreur(error.message);
      setChargement(false);
      return;
    }

    router.push("/");
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <Reveal>
        <div className="w-full max-w-sm rounded-2xl bg-forestLight p-8">
          <h1 className="text-center font-display text-2xl text-ivory">
            Se connecter
          </h1>
          <p className="mt-2 text-center text-sm text-sage">
            Content de vous revoir
          </p>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="rounded-lg bg-forest px-4 py-3 text-sm text-ivory placeholder-sage/60 outline-none ring-1 ring-sage/20 focus:ring-gold"
            />
            <input
              type="password"
              placeholder="Mot de passe"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              required
              className="rounded-lg bg-forest px-4 py-3 text-sm text-ivory placeholder-sage/60 outline-none ring-1 ring-sage/20 focus:ring-gold"
            />

            {erreur && <p className="text-sm text-red-400">{erreur}</p>}

            <button
              type="submit"
              disabled={chargement}
              className="mt-2 rounded-full bg-gold px-6 py-3 font-medium text-forest transition hover:bg-goldSoft disabled:opacity-60"
            >
              {chargement ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-sage">
            Pas encore de compte ?{" "}
            <a href="/inscription" className="text-gold hover:text-goldSoft">
              Creer un compte
            </a>
          </p>
        </div>
      </Reveal>
    </main>
  );
}
