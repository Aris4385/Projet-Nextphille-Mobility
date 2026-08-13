"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import Reveal from "@/components/Reveal";

export default function InscriptionAgence() {
  const router = useRouter();
  const supabase = createClient();

  const [entreprise, setEntreprise] = useState("");
  const [nom, setNom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState("");
  const [chargement, setChargement] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErreur("");
    setChargement(true);

    const { error } = await supabase.auth.signUp({
      email,
      password: motDePasse,
      options: {
        data: {
          full_name: nom,
          phone: telephone,
          company_name: entreprise,
          is_agency: true,
        },
      },
    });

    if (error) {
      setErreur(error.message);
      setChargement(false);
      return;
    }

    router.push("/espace");
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <Reveal>
        <div className="w-full max-w-sm rounded-2xl bg-forestLight p-8">
          <h1 className="text-center font-display text-2xl text-ivory">
            Partenariat agence
          </h1>
          <p className="mt-2 text-center text-sm text-sage">
            Proposez votre flotte sur Nexphille Mobility
          </p>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
            <input
              type="text"
              placeholder="Nom de l'agence"
              value={entreprise}
              onChange={(e) => setEntreprise(e.target.value)}
              required
              className="rounded-lg bg-forest px-4 py-3 text-sm text-ivory placeholder-sage/60 outline-none ring-1 ring-sage/20 focus:ring-gold"
            />
            <input
              type="text"
              placeholder="Nom du contact"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              required
              className="rounded-lg bg-forest px-4 py-3 text-sm text-ivory placeholder-sage/60 outline-none ring-1 ring-sage/20 focus:ring-gold"
            />
            <input
              type="tel"
              placeholder="Telephone"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              required
              className="rounded-lg bg-forest px-4 py-3 text-sm text-ivory placeholder-sage/60 outline-none ring-1 ring-sage/20 focus:ring-gold"
            />
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
              minLength={6}
              className="rounded-lg bg-forest px-4 py-3 text-sm text-ivory placeholder-sage/60 outline-none ring-1 ring-sage/20 focus:ring-gold"
            />

            {erreur && <p className="text-sm text-red-400">{erreur}</p>}

            <button
              type="submit"
              disabled={chargement}
              className="mt-2 rounded-full bg-gold px-6 py-3 font-medium text-forest transition hover:bg-goldSoft disabled:opacity-60"
            >
              {chargement ? "Creation..." : "Creer le compte agence"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-sage">
            Vous etes un particulier ?{" "}
            <a href="/inscription" className="text-gold hover:text-goldSoft">
              Inscription simple
            </a>
          </p>
        </div>
      </Reveal>
    </main>
  );
}
