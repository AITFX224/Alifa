import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User as UserIcon, ArrowRight, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from '@supabase/supabase-js';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Redirect authenticated users to home
        if (session?.user) {
          navigate('/');
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        navigate('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignUp = async (email: string, password: string, displayName: string) => {
    setLoading(true);
    try {
      console.log("🔵 Début inscription:", { email, displayName });
      const redirectUrl = `${window.location.origin}/`;
      console.log("🔵 URL de redirection:", redirectUrl);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            display_name: displayName
          }
        }
      });

      console.log("🔵 Réponse Supabase:", { data, error });

      if (error) throw error;

      if (data.user && !data.session) {
        toast({
          title: "Vérifiez votre email",
          description: "Un email de confirmation a été envoyé à votre adresse.",
        });
      } else {
        toast({
          title: "Inscription réussie !",
          description: "Bienvenue sur Zonaya !",
        });
      }
    } catch (error: any) {
      console.error("🔴 Erreur inscription:", error);
      let errorMessage = "Une erreur est survenue lors de l'inscription";
      
      if (error.message.includes("User already registered")) {
        errorMessage = "Un compte avec cet email existe déjà";
      } else if (error.message.includes("Password should be")) {
        errorMessage = "Le mot de passe doit contenir au moins 6 caractères";
      } else if (error.message.includes("Invalid email")) {
        errorMessage = "Adresse email invalide";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Erreur d'inscription",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      console.log("🔵 Début connexion:", { email });
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log("🔵 Réponse connexion:", { error });

      if (error) throw error;

      toast({
        title: "Connexion réussie !",
        description: "Bon retour sur Zonaya !",
      });
    } catch (error: any) {
      console.error("🔴 Erreur connexion:", error);
      let errorMessage = "Email ou mot de passe incorrect";
      
      if (error.message.includes("Email not confirmed")) {
        errorMessage = "Veuillez confirmer votre email avant de vous connecter";
      } else if (error.message.includes("Invalid login credentials")) {
        errorMessage = "Email ou mot de passe incorrect";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Erreur de connexion",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (email: string) => {
    setLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/auth`;
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl
      });

      if (error) throw error;

      toast({
        title: "Email envoyé !",
        description: "Vérifiez votre boîte mail pour réinitialiser votre mot de passe.",
      });
      
      setIsResetPassword(false);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer l'email de réinitialisation",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isResetPassword) {
      if (!email) {
        toast({
          title: "Email requis",
          description: "Veuillez entrer votre adresse email",
          variant: "destructive",
        });
        return;
      }
      await handleResetPassword(email);
      return;
    }
    
    if (!email || !password) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }

    if (!isLogin && !displayName) {
      toast({
        title: "Nom requis",
        description: "Veuillez entrer votre nom d'affichage",
        variant: "destructive",
      });
      return;
    }

    if (isLogin) {
      await handleSignIn(email, password);
    } else {
      await handleSignUp(email, password, displayName);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-info/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }}></div>
      </div>
      
      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="mb-4">
            <div className="w-16 h-16 bg-gradient-brand rounded-2xl mx-auto flex items-center justify-center shadow-glow mb-4">
              <span className="text-2xl font-bold text-white">A</span>
            </div>
          </div>
          <h1 className="text-4xl font-poppins font-bold bg-gradient-brand bg-clip-text text-transparent mb-2">
            Alifa
          </h1>
          <p className="text-muted-foreground text-lg">
            {isResetPassword 
              ? "Réinitialisez votre mot de passe" 
              : isLogin 
                ? "Connectez-vous à votre compte" 
                : "Rejoignez la communauté des artisans"
            }
          </p>
        </div>

        <Card className="glass backdrop-blur-xl border-white/20 shadow-large animate-scale-in">
          <CardHeader className="space-y-1 pb-6 text-center">
            <CardTitle className="text-3xl font-poppins font-bold bg-gradient-brand bg-clip-text text-transparent">
              {isResetPassword ? "Mot de passe oublié" : isLogin ? "Connexion" : "Inscription"}
            </CardTitle>
            <p className="text-muted-foreground/80">
              {isResetPassword 
                ? "Entrez votre email pour recevoir un lien de réinitialisation" 
                : isLogin 
                  ? "Accédez à votre espace artisan" 
                  : "Créez votre profil artisan"
              }
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && !isResetPassword && (
                  <div className="space-y-2 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                  <Label htmlFor="displayName" className="text-sm font-semibold text-foreground">
                    Nom d'affichage
                  </Label>
                  <div className="relative group">
                    <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 group-focus-within:text-primary transition-colors" />
                    <Input
                      id="displayName"
                      type="text"
                      placeholder="Votre nom d'artisan"
                      className="pl-10 h-12 bg-muted/30 border-border/50 focus:bg-card/80 focus:border-primary/50 transition-all duration-300 rounded-xl"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <Label htmlFor="email" className="text-sm font-semibold text-foreground">
                  Adresse email
                </Label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 group-focus-within:text-primary transition-colors" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre@email.com"
                    className="pl-10 h-12 bg-muted/30 border-border/50 focus:bg-card/80 focus:border-primary/50 transition-all duration-300 rounded-xl"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {!isResetPassword && (
                <div className="space-y-2 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <Label htmlFor="password" className="text-sm font-semibold text-foreground">
                  Mot de passe
                </Label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 group-focus-within:text-primary transition-colors" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 pr-12 h-12 bg-muted/30 border-border/50 focus:bg-card/80 focus:border-primary/50 transition-all duration-300 rounded-xl"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-10 w-10 rounded-lg hover:bg-muted/50 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
                    ) : (
                      <Eye className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
                    )}
                  </Button>
                </div>
              </div>
              )}

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-brand text-white font-semibold rounded-xl hover:shadow-glow hover:scale-[1.02] transition-all duration-300 animate-fade-in"
                style={{ animationDelay: '0.4s' }}
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span className="text-lg">
                      {isResetPassword 
                        ? "Envoi en cours..." 
                        : isLogin 
                          ? "Connexion..." 
                          : "Création du compte..."
                      }
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-3">
                    <span className="text-lg">
                      {isResetPassword 
                        ? "Envoyer le lien" 
                        : isLogin 
                          ? "Se connecter" 
                          : "Créer mon compte"
                      }
                    </span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-2">
              {!isResetPassword ? (
                <>
                  <p className="text-sm text-muted-foreground">
                    {isLogin ? "Pas encore de compte ?" : "Déjà un compte ?"}
                  </p>
                  <div className="flex flex-col space-y-1">
                    <Button
                      variant="link"
                      className="p-0 h-auto font-medium text-primary hover:text-primary-glow"
                      onClick={() => setIsLogin(!isLogin)}
                    >
                      {isLogin ? "Créer un compte" : "Se connecter"}
                    </Button>
                    {isLogin && (
                      <Button
                        variant="link"
                        className="p-0 h-auto text-sm text-muted-foreground hover:text-foreground"
                        onClick={() => setIsResetPassword(true)}
                      >
                        Mot de passe oublié ?
                      </Button>
                    )}
                  </div>
                </>
              ) : (
                <Button
                  variant="link"
                  className="p-0 h-auto font-medium text-primary hover:text-primary-glow"
                  onClick={() => {
                    setIsResetPassword(false);
                    setIsLogin(true);
                  }}
                >
                  Retour à la connexion
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="mt-8 space-y-4 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center space-x-4 p-3 rounded-xl bg-success/5 border border-success/20 backdrop-blur-sm">
              <div className="w-8 h-8 bg-success/20 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-success" />
              </div>
              <span className="text-sm font-medium text-foreground">Connectez-vous avec des artisans locaux</span>
            </div>
            <div className="flex items-center space-x-4 p-3 rounded-xl bg-info/5 border border-info/20 backdrop-blur-sm">
              <div className="w-8 h-8 bg-info/20 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-info" />
              </div>
              <span className="text-sm font-medium text-foreground">Partagez vos créations et savoir-faire</span>
            </div>
            <div className="flex items-center space-x-4 p-3 rounded-xl bg-primary/5 border border-primary/20 backdrop-blur-sm">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-primary" />
              </div>
              <span className="text-sm font-medium text-foreground">Développez votre activité artisanale</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;