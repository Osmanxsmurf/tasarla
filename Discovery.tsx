import React from 'react';
import Layout from '@/components/Layout';
import { DailyDiscovery } from '@/components/DailyDiscovery';
import { Sparkles } from 'lucide-react';

export default function DiscoveryPage() {
  // Set page title
  document.title = 'Günlük Keşif - Müzik Asistanım';
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Müzik Keşifleri</h1>
          <p className="text-muted-foreground">
            Her gün size özel seçilen şarkıları keşfedin ve müzik zevkinizi genişletin
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <DailyDiscovery />
          </div>
          
          <div className="space-y-6">
            <div className="bg-card rounded-lg border p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Nasıl Çalışır?
              </h3>
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/20 text-primary p-1 rounded-full mt-0.5">1</div>
                    <div>
                      <p className="font-medium">Günlük Şarkı</p>
                      <p className="text-sm text-muted-foreground">Her gün size özel seçilen yeni bir şarkı keşfedin.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/20 text-primary p-1 rounded-full mt-0.5">2</div>
                    <div>
                      <p className="font-medium">Tepkinizi Verin</p>
                      <p className="text-sm text-muted-foreground">Şarkıyı dinledikten sonra beğenip beğenmediğinizi belirtin.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/20 text-primary p-1 rounded-full mt-0.5">3</div>
                    <div>
                      <p className="font-medium">Kişiselleştirilmiş Keşifler</p>
                      <p className="text-sm text-muted-foreground">Zamanla tercihlerinizi öğrenir ve daha iyi öneriler sunar.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-card rounded-lg border p-6">
              <h3 className="text-xl font-semibold mb-3">Faydaları</h3>
              <ul className="space-y-2 list-disc pl-5">
                <li className="text-sm">
                  <span className="font-medium">Yeni Müzik Keşfi:</span> Farklı tarzlarda şarkılarla müzik zevkinizi genişletin
                </li>
                <li className="text-sm">
                  <span className="font-medium">Günlük Alışkanlık:</span> Her gün yeni bir şarkı keşfederek müzik rutini oluşturun
                </li>
                <li className="text-sm">
                  <span className="font-medium">Kişiselleştirilmiş:</span> Seçimlerinize göre zamanla daha iyi öneriler alın
                </li>
                <li className="text-sm">
                  <span className="font-medium">Sürpriz Faktörü:</span> Farklı türlerde beklenmedik keşifler yapın
                </li>
              </ul>
            </div>
            
            <div className="bg-card rounded-lg border p-6">
              <h3 className="text-xl font-semibold mb-3">Hatırlatıcı</h3>
              <p className="text-sm text-muted-foreground">
                Her 24 saatte bir yeni şarkı eklenir. Bugünün şarkısını dinlemeyi ve tepkinizi vermeyi unutmayın!
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}