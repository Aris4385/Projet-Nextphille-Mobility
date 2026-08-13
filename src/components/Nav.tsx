"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase-browser";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [connecte, setConnecte] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setConnecte(!!data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setConnecte(!!session);
    });

    return () => listener.subscription.unsubscribe();
  }, [supabase]);

  async function seDeconnecter() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  const liens = [{ label: "Vehicules", href: "#" }];

  return (
    <nav className="relative px-6 py-6 md:px-12">
      <div className="flex items-center justify-between">
        <a href="/" className="flex items-center gap-3">
          <Image src="/logo.jpg" alt="Nexphille" width={40} height={40} className="rounded-full" />
          <div className="leading-none">
            <p className="font-display text-base tracking-wide text-ivory">
              NEXPHILLE
            </p>
            <p className="text-[10px] tracking-[0.3em] text-sage">
              MOBILITY
            </p>
          </div>
        </a>

        <div className="hidden items-center gap-8 text-sm text-sage md:flex">
          {liens.map((l) => (
            <a key={l.label} href={l.href} className="transition hover:text-gold">
              {l.label}
            </a>
          ))}
          <a href="/agence" className="text-xs text-sage/70 transition hover:text-gold">
            Devenir partenaire
          </a>
          {connecte ? (
            <>
              <a href="/espace" className="transition hover:text-gold">
                Mon espace
              </a>
              <button onClick={seDeconnecter} className="transition hover:text-gold">
                Se deconnecter
              </button>
            </>
          ) : (
            <a href="/connexion" className="transition hover:text-gold">
              Connexion
            </a>
          )}
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="flex flex-col gap-1.5 md:hidden"
          aria-label="Menu"
        >
          <span className={`h-0.5 w-6 bg-ivory transition ${open ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`h-0.5 w-6 bg-ivory transition ${open ? "opacity-0" : ""}`} />
          <span className={`h-0.5 w-6 bg-ivory transition ${open ? "-translate-y-2 -rotate-45" : ""}`} />
        </button>
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 md:hidden ${
          open ? "mt-6 max-h-60 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col gap-4 rounded-2xl bg-forestLight p-6 text-sm text-sage">
          {liens.map((l) => (
            <a key={l.label} href={l.href} className="transition hover:text-gold">
              {l.label}
            </a>
          ))}
          <a href="/agence" className="transition hover:text-gold">
            Devenir partenaire
          </a>
          {connecte ? (
            <>
              <a href="/espace" className="transition hover:text-gold">
                Mon espace
              </a>
              <button onClick={seDeconnecter} className="text-left transition hover:text-gold">
                Se deconnecter
              </button>
            </>
          ) : (
            <a href="/connexion" className="transition hover:text-gold">
              Connexion
            </a>
          )}
        </div>
      </div>
    </nav>
  );
}
