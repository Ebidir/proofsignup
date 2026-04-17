import { useState, FormEvent } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import ProofLogo from "@/components/ProofLogo";

const signupSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: "Enter a valid email" })
    .max(255, { message: "Email too long" }),
  phone: z
    .string()
    .trim()
    .min(7, { message: "Enter a valid phone number" })
    .max(20, { message: "Phone too long" })
    .regex(/^[+\d\s().-]+$/, { message: "Invalid characters in phone" }),
});

const Index = () => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const parsed = signupSchema.safeParse({ email, phone });
    if (!parsed.success) {
      const first = parsed.error.issues[0]?.message ?? "Invalid input";
      toast({ title: "Check your details", description: first, variant: "destructive" });
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("signups").insert({
      email: parsed.data.email,
      phone: parsed.data.phone,
    });
    setLoading(false);

    if (error) {
      toast({
        title: "Something went wrong",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setSubmitted(true);
    setEmail("");
    setPhone("");
    toast({ title: "You're on the list", description: "We'll be in touch shortly." });
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      {/* SEO */}
      <h1 className="sr-only">Proof — Get early access</h1>

      {/* Square gradient backdrops */}
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-60" />
      <div className="pointer-events-none absolute inset-0 bg-spotlight" />
      <div className="pointer-events-none absolute inset-0 bg-corner" />

      {/* Decorative lime square */}
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 border border-lime-brand/30 bg-lime-brand/5 rotate-12" />
      <div className="pointer-events-none absolute -top-16 right-10 h-40 w-40 border border-foreground/10" />

      <header className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12">
        <ProofLogo />
        <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
          Beta · 2026
        </span>
      </header>

      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-96px)] max-w-6xl items-center px-6 md:px-12">
        <div className="grid w-full gap-12 md:grid-cols-2 md:items-center">
          {/* Left: pitch */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 border border-border bg-secondary/60 px-3 py-1">
              <span className="h-2 w-2 bg-lime-brand" />
              <span className="text-xs uppercase tracking-widest text-muted-foreground">
                Now accepting requests
              </span>
            </div>
            <h2 className="text-5xl font-bold leading-[1.05] tracking-tight md:text-6xl">
              Verify anything.
              <br />
              <span className="text-lime-brand">Get proof.</span>
            </h2>
            <p className="max-w-md text-base text-muted-foreground md:text-lg">
              Drop your email and phone. We'll send your access credentials
              and a one-time verification token within 24 hours.
            </p>
            <div className="flex items-center gap-6 pt-2 text-xs uppercase tracking-widest text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="h-px w-6 bg-lime-brand" /> Secure
              </div>
              <div className="flex items-center gap-2">
                <span className="h-px w-6 bg-lime-brand" /> Instant
              </div>
              <div className="flex items-center gap-2">
                <span className="h-px w-6 bg-lime-brand" /> Verifiable
              </div>
            </div>
          </div>

          {/* Right: signup card */}
          <div className="relative">
            <div className="absolute -inset-2 border border-lime-brand/30" aria-hidden />
            <form
              onSubmit={handleSubmit}
              className="relative border border-border bg-card p-8 shadow-lime"
            >
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-semibold tracking-tight">
                  Request access
                </h3>
                <span className="text-xs uppercase tracking-widest text-lime-brand">
                  01 / 01
                </span>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs uppercase tracking-widest text-muted-foreground">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    maxLength={255}
                    className="h-12 rounded-none border-border bg-input text-foreground placeholder:text-muted-foreground focus-visible:ring-lime-brand"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-xs uppercase tracking-widest text-muted-foreground">
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 555 000 0000"
                    maxLength={20}
                    className="h-12 rounded-none border-border bg-input text-foreground placeholder:text-muted-foreground focus-visible:ring-lime-brand"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="group relative h-12 w-full rounded-none bg-lime-brand text-primary-foreground hover:bg-lime-brand/90 disabled:opacity-60"
                >
                  <span className="font-semibold tracking-wide">
                    {loading ? "Sending…" : submitted ? "Submitted ✓" : "Get proof"}
                  </span>
                </Button>

                <p className="text-[11px] leading-relaxed text-muted-foreground">
                  By submitting you agree to receive verification messages.
                  We never share your data.
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Index;
