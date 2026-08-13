"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import Nav from "@/components/Nav";
import Reveal from "@/components/Reveal";
import SelfieCapture from "@/components/SelfieCapture";

export default function Kyc() {
  const router = useRouter();
  const supabase = createClient();

  const [userId, setUserId] = useState<string | null>(null);
  const [piece, setPiece] = useState<File | null>(null);
  const [selfie, setSelfie] = useState<File | null>(null);
  const [statutExistant, setStatutExistant] = useState<string | null>(null);
  const [chargement, setChargement] = useState(true);
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    async function init() {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        router.push("/connexion");
        return;
      }
      setUserId(session.session.user.id);

      const { data } = await supabase
        .from("kyc_verifications")
        .select("status")
        .eq("user_id", session.session.user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      setStatutExistant(data?.status ?? null);
      setChargement(false);
    }
    init();
  }, [router, supabase]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!userId || !piece || !selfie) return;

    setEnvoi(true);
    setErreur("");

    const pieceExt = piece.name.split(".").pop();
    const piecePath = `${userId}/piece.${pieceExt}`;
    const selfiePath = `${userId}/selfie.jpg`;

    const { error: err1 } = await supabase.storage
      .from("kyc-documents")
      .upload(piecePath, piece, { upsert: true });

    if (err1) {
      setErreur(err1.message);
      setEnvoi(false);
      return;
    }

    const { error: err2 } = await supabase.storage
      .from("kyc-documents")
      .upload(selfiePath, selfie, { upsert: true });

    if (err2) {
      setErreur(err2.message);
      setEnvoi(false);
      return;
    }

    const { error: err3 } = await supabase.from("kyc_verifications").insert({
      user_id: userId,
      provider: "manual",
      status: "pending",
      id_document_url: piecePath,
      selfie_url: selfiePath,
    });

    if (err3) {
      setErreur(err3.message);
      setEnvoi(false);
      return;
    }

    setStatutExistant("pending");
    setEnvoi(false);
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
          <div className="mx-auto max-w-md rounded-2xl bg-forestLight p-8">
            <h1 className="font-display text-2xl text-ivory">
              Verification d&apos;identite
            </h1>
            <p className="mt-2 text-sm text-sage">
              Necessaire avant toute reservation ou ajout de vehicule.
            </p>

            {statutExistant === "pending" && (
              <div className="mt-8 rounded-xl bg-forest p-6 text-center">
                <p className="font-display text-lg text-gold">En attente</p>
                <p className="mt-2 text-sm text-sage">
                  Vos documents sont en cours de verification par notre equipe.
                </p>
              </div>
            )}

            {statutExistant === "approved" && (
              <div className="mt-8 rounded-xl bg-forest p-6 text-center">
                <p className="font-display text-lg text-gold">Verifie</p>
                <p className="mt-2 text-sm text-sage">
                  Votre identite est confirmee.
                </p>
              </div>
            )}

            {(statutExistant === null || statutExistant === "rejected") && (
              <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
                {statutExistant === "rejected" && (
                  <p className="text-sm text-red-400">
                    Votre precedente demande a ete rejetee. Merci de reessayer.
                  </p>
                )}

                <div>
                  <label className="text-sm text-sage">Piece d&apos;identite (CNI)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setPiece(e.target.files?.[0] ?? null)}
                    required
                    className="mt-2 w-full text-sm text-ivory file:mr-4 file:rounded-full file:border-0 file:bg-gold file:px-4 file:py-2 file:text-forest"
                  />
                </div>

                <div>
                  <label className="text-sm text-sage">Selfie (photo en direct uniquement)</label>
                  <div className="mt-2">
                    <SelfieCapture onCapture={setSelfie} />
                  </div>
                </div>

                {erreur && <p className="text-sm text-red-400">{erreur}</p>}

                <button
                  type="submit"
                  disabled={envoi || !piece || !selfie}
                  className="mt-2 rounded-full bg-gold px-6 py-3 font-medium text-forest transition hover:bg-goldSoft disabled:opacity-60"
                >
                  {envoi ? "Envoi..." : "Envoyer pour verification"}
                </button>
              </form>
            )}
          </div>
        </Reveal>
      </section>
    </main>
  );
}
