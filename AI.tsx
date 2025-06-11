import React, { useState } from 'react';
import { AIAssistant } from '@/components/AIAssistant';
import AdvancedAI from '@/components/AdvancedAI';
import SuperAIAssistant from '@/components/SuperAIAssistant';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Brain, Zap } from 'lucide-react';
import Layout from '@/components/Layout';

export default function AIPage() {
  document.title = 'Yapay Zeka Asistanı - Müzik Asistanım';
  const [activeTab, setActiveTab] = useState('super');
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Yapay Zeka Asistanım</h1>
        <p className="text-muted-foreground">
          Yapay zeka asistanlarımız ile müzik keşfedin, ruh halinize göre kişiselleştirilmiş öneriler alın.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full mb-4">
              <TabsTrigger value="basic" className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                <span>Temel Asistan</span>
              </TabsTrigger>
              <TabsTrigger value="advanced" className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                <span>Gelişmiş Asistan</span>
              </TabsTrigger>
              <TabsTrigger value="super" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                <span>Süper Asistan</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic">
              <AIAssistant className="h-[600px]" />
            </TabsContent>
            
            <TabsContent value="advanced">
              <AdvancedAI className="h-[600px]" />
            </TabsContent>
            
            <TabsContent value="super">
              <SuperAIAssistant className="h-[600px]" />
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Asistanın Yetenekleri</CardTitle>
              <CardDescription>
                {activeTab === 'basic' && 'Temel asistanınız ruh halinize ve müzik tercihlerinize göre öneriler sunar.'}
                {activeTab === 'advanced' && 'Gelişmiş asistanınız düşünce sürecini göstererek daha detaylı analizler yapabilir.'}
                {activeTab === 'super' && 'Süper asistanınız en detaylı bağlam analizi ve duygu tespiti yapabilen üst düzey bir sistemdir.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="bg-primary/20 text-primary p-1 rounded-full mt-0.5">✓</span>
                  <span>Ruh halinize göre kişiselleştirilmiş müzik önerileri</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-primary/20 text-primary p-1 rounded-full mt-0.5">✓</span>
                  <span>Sanatçı veya tür bazlı akıllı aramalar</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-primary/20 text-primary p-1 rounded-full mt-0.5">✓</span>
                  <span>Konuşma bağlamını anlama ve hatırlama</span>
                </li>
                {(activeTab === 'advanced' || activeTab === 'super') && (
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/20 text-primary p-1 rounded-full mt-0.5">✓</span>
                    <span>Düşünce sürecini şeffaf bir şekilde görüntüleme</span>
                  </li>
                )}
                {activeTab === 'super' && (
                  <>
                    <li className="flex items-start gap-2">
                      <span className="bg-primary/20 text-primary p-1 rounded-full mt-0.5">✓</span>
                      <span>Beyin durumu modelleme ve derin anlayış</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-primary/20 text-primary p-1 rounded-full mt-0.5">✓</span>
                      <span>Duygu yoğunluğu ve güveni analizi</span>
                    </li>
                  </>
                )}
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">İpuçları</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <p>• "Bugün kendimi enerjik hissediyorum" gibi ifadelerle ruh halinizi belirtin</p>
                <p>• "Dua Lipa'nın en popüler şarkıları neler?" gibi sorular sorun</p>
                <p>• "Pop müzik öner" diyerek tür bazlı öneriler alın</p>
                <p>• Basit cevaplar yerine, detaylı istekler iletin</p>
                {(activeTab === 'advanced' || activeTab === 'super') && (
                  <p>• Asistanın düşünce sürecini görmek için "Düşünce süreci" bölümünü açın</p>
                )}
                {activeTab === 'super' && (
                  <p>• "Beyin durumu" görünümünü açarak asistanınızın sizi nasıl anladığını izleyin</p>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Teknoloji</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Yapay zeka asistanlarımız, bağlam anlama, konu takibi ve müzik önerileri için tamamen ücretsiz, yerel olarak çalışan gelişmiş algoritmalar kullanır.
              </p>
              
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Doğal Dil İşleme</Badge>
                <Badge variant="outline">Duygu Analizi</Badge>
                <Badge variant="outline">Bağlam Anlama</Badge>
                <Badge variant="outline">Kişiselleştirme</Badge>
                {activeTab === 'super' && (
                  <>
                    <Badge variant="outline">Bilişsel Modelleme</Badge>
                    <Badge variant="outline">Yüksek Doğruluk</Badge>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}