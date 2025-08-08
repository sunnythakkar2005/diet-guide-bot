import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const Auth = () => {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
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
        // Create profile if it doesn't exist
        createProfileIfNeeded(session.user.id).then(() => {
          navigate("/", { replace: true });
          if (event === 'SIGNED_IN') {
            toast({ title: "Signed in", description: "Welcome back!" });
          }
        });
      }
    });

    // Check existing session on mount
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      setInitialLoading(false);
      if (error) {
        console.error('Error getting session:', error);
        return;
      }
      if (session?.user) {
        navigate("/", { replace: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const createProfileIfNeeded = async (userId: string) => {
    try {
      const { data: existing, error: selectError } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", userId)
        .maybeSingle();

      if (selectError) {
        console.error('Error checking profile:', selectError);
        return;
      }

      if (!existing) {
        const { error: insertError } = await supabase
          .from("profiles")
          .insert({ 
            id: userId,
            diet_preferences: {}
          });

        if (insertError) {
          console.error('Error creating profile:', insertError);
        }
      }
    } catch (error) {
      console.error('Error in createProfileIfNeeded:', error);
    }
  };
  const signUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) {
        toast({ 
          title: "Sign up failed", 
          description: error.message,
          variant: "destructive"
        });
      } else if (data.user && !data.session) {
        toast({ 
          title: "Check your email", 
          description: "We sent you a confirmation link to complete your sign up." 
        });
      } else if (data.session) {
        // User is automatically signed in (email confirmation disabled)
        toast({ 
          title: "Account created", 
          description: "Welcome! Your account has been created successfully." 
        });
      }
    } catch (error) {
      toast({
        title: "Unexpected error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) {
        toast({ 
          title: "Login failed", 
          description: error.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Unexpected error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const signInWith = async (provider: "google" | "github" | "twitter") => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({ 
        provider, 
        options: { 
          redirectTo: `${window.location.origin}/` 
        } 
      });
      
      if (error) {
        toast({ 
          title: "OAuth error", 
          description: error.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "OAuth error",
        description: "Failed to sign in with social provider.",
        variant: "destructive",
      });
    }
  };

  if (initialLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading...</span>
        </div>
      </main>
    );
  }
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
                  <Input 
                    id="email" 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    disabled={loading}
                    placeholder="Enter your email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    minLength={6}
                    disabled={loading}
                    placeholder="Enter your password (min 6 characters)"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Please wait...
                    </>
                  ) : (
                    mode === "login" ? "Log in" : "Sign up"
                  )}
                </Button>
              </form>

              <div className="my-6 flex items-center gap-4">
                <span className="h-px flex-1 bg-border" />
                <span className="text-xs text-muted-foreground">OR</span>
                <span className="h-px flex-1 bg-border" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Button 
                  variant="secondary" 
                  onClick={() => signInWith("google")}
                  disabled={loading}
                >
                  Google
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={() => signInWith("github")}
                  disabled={loading}
                >
                  GitHub
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={() => signInWith("twitter")}
                  disabled={loading}
                >
                  Twitter
                </Button>
              </div>
            </CardContent>
            <CardFooter className="justify-between">
              <p className="text-sm text-muted-foreground">
                {mode === "login" ? "Don't have an account?" : "Already have an account?"}
              </p>
              <Button 
                variant="link" 
                onClick={() => setMode(mode === "login" ? "signup" : "login")}
                disabled={loading}
              >
                {mode === "login" ? "Sign up" : "Log in"}
              </Button>
            </CardFooter>
          </Card>

          <Alert className="mt-6">
            <AlertDescription>
              <strong>Note:</strong> Social sign-in providers need to be configured in your Supabase dashboard before they can be used.
            </AlertDescription>
          </Alert>
        </article>
      </section>
    </main>
  );
};

export default Auth;
