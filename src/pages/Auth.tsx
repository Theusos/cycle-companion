import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail, Lock, User, Heart } from "lucide-react";
import { z } from "zod";

const authSchema = z.object({
  email: z.string().email("Email inválido").max(255),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres").max(100),
  name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres").max(100).optional(),
});

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const validation = authSchema.safeParse({ 
        email, 
        password, 
        name: isLogin ? undefined : name 
      });

      if (!validation.success) {
        toast({
          title: "Erro de validação",
          description: validation.error.errors[0].message,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          toast({
            title: "Erro ao entrar",
            description: error.message === "Invalid login credentials" 
              ? "Email ou senha incorretos" 
              : error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Bem-vinda de volta! 💕",
            description: "Login realizado com sucesso",
          });
          navigate("/");
        }
      } else {
        const { error } = await signUp(email, password, name);
        if (error) {
          if (error.message.includes("already registered")) {
            toast({
              title: "Email já cadastrado",
              description: "Este email já possui uma conta. Tente fazer login.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Erro ao criar conta",
              description: error.message,
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Conta criada com sucesso! 🎉",
            description: "Bem-vinda ao Ciclo Feminino!",
          });
          navigate("/");
        }
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Algo deu errado. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full gradient-primary flex items-center justify-center shadow-glow">
            <Heart className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-display font-semibold text-foreground mb-2">
            Ciclo Feminino
          </h1>
          <p className="text-muted-foreground">
            Acompanhe seu ciclo com carinho
          </p>
        </div>

        <div className="glass-card rounded-3xl p-8 animate-slide-up">
          <div className="flex mb-6 bg-muted rounded-2xl p-1">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${
                isLogin
                  ? "bg-card shadow-soft text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Entrar
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${
                !isLogin
                  ? "bg-card shadow-soft text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Criar Conta
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground">
                  Nome
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Seu nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 h-12 rounded-xl border-border bg-background/50 focus:ring-primary"
                    required={!isLogin}
                    maxLength={100}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 rounded-xl border-border bg-background/50 focus:ring-primary"
                  required
                  maxLength={255}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">
                Senha
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-12 rounded-xl border-border bg-background/50 focus:ring-primary"
                  required
                  minLength={6}
                  maxLength={100}
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-xl gradient-primary text-primary-foreground font-medium shadow-glow hover:opacity-90 transition-all duration-300"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : isLogin ? (
                "Entrar"
              ) : (
                "Criar Conta"
              )}
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          {isLogin ? "Ainda não tem conta?" : "Já tem uma conta?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary font-medium hover:underline"
          >
            {isLogin ? "Criar conta" : "Fazer login"}
          </button>
        </p>
      </div>
    </div>
  );
}
