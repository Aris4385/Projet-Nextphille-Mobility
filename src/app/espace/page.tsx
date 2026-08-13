"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import Nav from "@/components/Nav";
import Reveal from "@/components/Reveal";

type Profil = {
  full_name: string;
  role: string;
  email: string | null;
};

export default function Espace() {
  const router = useRouter();
  const supabase = createClient();

  const [profil, setProfil] = useState<Profil | null>(null);
  const [chargement, setChargement] = useState(true);
  const [activation, setActivation] = useState(false);
  const [verification, setVerification] = useState(false);

  useEffect(() => {
    async function charger() {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        router.push("/connexion");
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("full_name, role, email")
        .eq("id", session.session.user.id)
        .single();

      setProfil(data);
      setChargement(false);
    }
    charger();
  }, [router, supabase]);

  async function activerModeHote() {
    setActivation(true);
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) return;

    await supabase
      .from("profiles")
      .update({ role: "owner" })
      .eq("id", session.session.user.id);

    setProfil((p) => (p ? { ...p, role: "owner" } : p));
    setActivation(false);
  }

  async function ajouterVehicule() {
    setVerification(true);
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) return;

    const { data } = await supabase
      .from("kyc_verifications")
      .select("status")
      .eq("user_id", session.session.user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    setVerification(false);

    if (data?.status !== "approved") {
      router.push("/kyc");
      return;
    }

    router.push("/vehicules/nouveau");
  }

  if (chargement) {
    return (
      <main>
        <Nav />
        <p className="px-6 py-20 text-center text-sage">Chargement...</p>
      </main>
    );
  }

  return (
    <main>
      <Nav />
      <section className="px-6 py-12 md:px-12">
        <Reveal>
          <div className="mx-auto max-w-lg rounded-2xl bg-forestLight p-8">
            <h1 className="font-display text-2xl text-ivory">
              Bonjour {profil?.full_name || "voyageur"}
            </h1>
            <p className="mt-2 text-sm text-sage">{profil?.email}</p>

            <div className="mt-8 rounded-xl bg-forest p-6">
              {profil?.role === "owner" ? (
                <>
                  <p className="font-display text-lg text-gold">Mode hote actif</p>
                  <p className="mt-2 text-sm text-sage">
                    Ajoutez un vehicule pour commencer a le proposer a la location.
                  </p>
                  <button
                    onClick={ajouterVehicule}
                    disabled={verification}
                    className="mt-4 rounded-full bg-gold px-6 py-2.5 text-sm font-medium text-forest transition hover:bg-goldSoft disabled:opacity-60"
                  >
                    {verification ? "Verification..." : "Ajouter un vehicule"}
                  </button>
                </>
              ) : (
                <>
                  <p className="font-display text-lg text-ivory">
                    Vous avez un vehicule a louer ?
                  </p>
                  <p className="mt-2 text-sm text-sage">
                    Activez le mode hote pour commencer a proposer vos vehicules sur Nexphille.
                  </p>
                  <button
                    onClick={activerModeHote}
                    disabled={activation}
                    className="mt-4 rounded-full bg-gold px-6 py-2.5 text-sm font-medium text-forest transition hover:bg-goldSoft disabled:opacity-60"
                  >
                    {activation ? "Activation..." : "Activer le mode hote"}
                  </button>
                </>
              )}
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
