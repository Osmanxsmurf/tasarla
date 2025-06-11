import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Music, AlertCircle, Home } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-dark-300">
      <Card className="w-full max-w-md mx-4 bg-dark-200 border-dark-100 text-light-100">
        <CardContent className="pt-6 pb-6">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Music className="h-10 w-10 text-primary" />
            </div>
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-6 w-6 text-red-500" />
              <h1 className="text-2xl font-bold">Sayfa Bulunamadı</h1>
            </div>
            <p className="text-light-300 mb-6">
              Aradığınız sayfa bulunamadı. Belki başka bir müzik keşfetme zamanı gelmiştir?
            </p>
            
            <Link href="/">
              <Button 
                className="flex items-center gap-2"
              >
                <Home size={18} />
                <span>Ana Sayfaya Dön</span>
              </Button>
            </Link>
          </div>

          <div className="border-t border-dark-100 pt-4 mt-4">
            <h3 className="font-medium mb-3">Şunları Deneyebilirsiniz:</h3>
            <ul className="space-y-2 text-light-300">
              <li className="flex items-center gap-2">
                <span className="text-primary">•</span> 
                <span>Popüler müzik türlerini keşfetmek</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">•</span> 
                <span>Müzik Asistanı ile duygu durumunuza uygun müzik bulmak</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">•</span> 
                <span>En sevdiğiniz sanatçıları aramak</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
