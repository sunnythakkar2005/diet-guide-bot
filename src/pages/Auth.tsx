import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

const Auth = () => {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Login or Sign Up | Diet Guide Bot";
    const existing = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    const meta = existing ?? (document.head.appendChild(document.createElement("meta")), document.head.lastElementChild as HTMLMetaElement);
    meta.setAttribute("name", "description");
    meta.setAttribute("content", "Sign in to Diet Guide Bot to save profiles and generate personalized diet plans.");
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        // Defer DB calls to avoid deadlocks inside the callback
        setTimeout(async () => {
          const { data: existing, error: selErr } = await supabase
            .from("profiles")
            .select("id")
            .eq("id", session.user!.id)
            .maybeSingle();

          if (!selErr && !existing) {
            await supabase.from("profiles").insert({ id: session.user!.id });
          }

          navigate("/", { replace: true });
          toast({ title: "Signed in", description: "Welcome back!" });
        }, 0);
      }
    });

    // Check existing session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) navigate("/", { replace: true });
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const signUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const redirectUrl = `${window.location.origin}/`;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: redirectUrl },
    });
    setLoading(false);
    if (error) {
      toast({ title: "Sign up failed", description: error.message });
    } else {
      toast({ title: "Confirm your email", description: "Check your inbox to complete sign up." });
    }
  };

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) toast({ title: "Login failed", description: error.message });
  };

  const signInWith = async (provider: "google" | "github" | "twitter") => {
    const redirectTo = `${window.location.origin}/`;
    const { error } = await supabase.auth.signInWithOAuth({ provider, options: { redirectTo } });
    if (error) toast({ title: "OAuth error", description: error.message });
  };

  return (
    <main>
      <section className="container mx-auto px-4 py-12 md:py-16">
        <article className="max-w-md mx-auto">
          <header className="mb-6 text-center">
            <h1 className="text-3xl font-bold">Log in or Sign up</h1>
            <p className="text-muted-foreground mt-2">Access your saved preferences and plans.</p>
          </header>

          <Card>
            <CardHeader>
              <CardTitle>{mode === "login" ? "Log in" : "Create your account"}</CardTitle>
              <CardDescription>
                {mode === "login" ? "Welcome back! Use your email and password." : "Sign up with email and password."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={mode === "login" ? signIn : signUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Please wait…" : mode === "login" ? "Log in" : "Sign up"}
                </Button>
              </form>

              <div className="my-6 flex items-center gap-4">
                <span className="h-px flex-1 bg-border" />
                <span className="text-xs text-muted-foreground">OR</span>
                <span className="h-px flex-1 bg-border" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Button variant="secondary" onClick={() => signInWith("google")}>Google</Button>
                <Button variant="secondary" onClick={() => signInWith("github")}>GitHub</Button>
                <Button variant="secondary" onClick={() => signInWith("twitter")}>Twitter</Button>
              </div>
            </CardContent>
            <CardFooter className="justify-between">
              <p className="text-sm text-muted-foreground">
                {mode === "login" ? "Don't have an account?" : "Already have an account?"}
              </p>
              <Button variant="link" onClick={() => setMode(mode === "login" ? "signup" : "login")}>
                {mode === "login" ? "Sign up" : "Log in"}
              </Button>
            </CardFooter>
          </Card>

          <aside className="mt-6 text-sm text-muted-foreground">
            Note: Configure social providers in Supabase before using them.
          </aside>
        </article>
      </section>
    </main>
  );
};

export default Auth;
