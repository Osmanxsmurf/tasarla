import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Music, Book, Info, ListMusic } from "lucide-react";
import { motion } from "framer-motion";

// Makam bilgileri (Türk müziği makamları)
const makamData = [
  {
    id: "rast",
    name: "Rast",
    description: "Rast makamı, Türk müziğinin en temel makamlarından biridir. Neşeli, ferahlatıcı ve dinlendirici bir karaktere sahiptir.",
    notes: "Rast, Dügâh, Segâh, Çargâh, Nevâ, Hüseyni, Eviç, Gerdâniye",
    emotions: "Neşe, ferahlık, huzur",
    examples: [
      "Dede Efendi - Rast Kâr-ı Nâtık",
      "Tanburi Cemil Bey - Rast Peşrev",
      "Münir Nurettin Selçuk - Rast Beste"
    ]
  },
  {
    id: "hicaz",
    name: "Hicaz",
    description: "Hicaz makamı, Türk müziğinde sıkça kullanılan, karakteristik sesi ile tanınan bir makamdır. Duygusal ve etkileyici bir yapıya sahiptir.",
    notes: "Dügâh, Segâh, Hicaz, Nevâ, Hüseyni, Acem, Gerdâniye",
    emotions: "Hüzün, özlem, nostalji",
    examples: [
      "Hacı Arif Bey - Hicaz Şarkı: Bir Halet İle Süzdü Yine",
      "Sadettin Kaynak - Hicaz İlahi: Ey Rahmeti Bol Padişah",
      "Tanburi Cemil Bey - Hicaz Taksim"
    ]
  },
  {
    id: "ussak",
    name: "Uşşak",
    description: "Uşşak makamı, Türk müziğinin en eski ve asıl makamlarından biridir. Yumuşak ve lirik bir anlatıma sahiptir.",
    notes: "Dügâh, Segâh, Çargâh, Nevâ, Hüseyni, Acem, Gerdâniye",
    emotions: "Yumuşaklık, içtenlik, samimiyet",
    examples: [
      "Dede Efendi - Uşşak Beste: Nâzır Eyle Beni",
      "Hacı Arif Bey - Uşşak Şarkı: Âşık Oldum Yine Bir Dilbere",
      "İsmail Dede Efendi - Uşşak Mevlevi Âyini"
    ]
  },
  {
    id: "huseyni",
    name: "Hüseyni",
    description: "Hüseyni makamı, Türk halk müziğinde yaygın olarak kullanılan bir makamdır. Zengin ve çeşitli ifade imkanları sunar.",
    notes: "Dügâh, Segâh, Çargâh, Nevâ, Hüseyni, Acem, Gerdâniye",
    emotions: "Kahramanlık, yiğitlik, gurbet",
    examples: [
      "Tanburi Cemil Bey - Hüseyni Saz Semaisi",
      "Neşet Ertaş - Hüseyni Türkü: Zahidem",
      "Münir Nurettin Selçuk - Hüseyni Şarkı: Dağlar Dağımdır Benim"
    ]
  },
  {
    id: "nihavend",
    name: "Nihavend",
    description: "Nihavend makamı, Batı müziğindeki minör tonlara benzeyen bir makamdır. Hüzünlü ve duygusal eserlerin bestelendiği bir makamdır.",
    notes: "Rast, Dügâh, Kürdî, Çargâh, Nevâ, Buselik, Acem, Gerdâniye",
    emotions: "Hüzün, melankoli, duygusallık",
    examples: [
      "Sadettin Kaynak - Nihavend Şarkı: Gel Göklere Yükselelim",
      "Münir Nurettin Selçuk - Nihavend Şarkı: Bir Neş'e Yarat Hasta Gönül",
      "Hacı Arif Bey - Nihavend Ağır Aksak: Seninle Ey Gül-i Gülşen"
    ]
  }
];

// Türk Müziği teorisi hakkında bilgiler
const musicTheory = {
  makam: {
    title: "Makam Nedir?",
    content: "Makam, Türk müziğinde belirli perdeler üzerinde belirli kurallara göre gezinmeyi tanımlayan melodik bir yapıdır. Her makamın kendine has seyir özellikleri, durak ve güçlü perdeleri vardır. Makamlar, dinleyicide belirli duygu ve hisler uyandırabilir."
  },
  usul: {
    title: "Usul Nedir?",
    content: "Usul, Türk müziğinde ritmik yapıyı oluşturan zaman birimidir. Her usûl, belirli vuruşlardan oluşur ve bu vuruşlar kuvvetli, yarı kuvvetli ve zayıf olmak üzere farklı şekillerde icra edilir. Türk müziğinde en kısa usûl 2 zamanlı Nim Sofyan, en uzun usûl ise 124 zamanlı Zencir'dir."
  },
  form: {
    title: "Türk Müziği Formları",
    content: "Türk müziğinde eserler, sözsüz saz eserleri ve sözlü eserler olarak ikiye ayrılır. Saz eserleri arasında peşrev, saz semaisi, taksim; sözlü eserler arasında ise kâr, beste, ağır semai, yürük semai, şarkı, türkü gibi formlar bulunur."
  }
};

export function MakamExplorer({ className }: { className?: string }) {
  const [activeTab, setActiveTab] = useState("makamlar");

  return (
    <Card className={`border-dark-100 bg-dark-200/50 ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Music className="h-5 w-5 text-primary" />
          <span>Türk Müziği Makamları</span>
        </CardTitle>
        <CardDescription>
          Geleneksel Türk müziği makamları ve kültürel mirası keşfedin
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        <Tabs defaultValue="makamlar" onValueChange={setActiveTab} className="w-full">
          <div className="border-b border-dark-100">
            <TabsList className="w-full bg-dark-300/20 p-0 h-12">
              <TabsTrigger 
                value="makamlar" 
                className="flex-1 h-full data-[state=active]:bg-dark-100 rounded-none"
              >
                <ListMusic className="h-4 w-4 mr-2" />
                <span>Makamlar</span>
              </TabsTrigger>
              <TabsTrigger 
                value="teori" 
                className="flex-1 h-full data-[state=active]:bg-dark-100 rounded-none"
              >
                <Book className="h-4 w-4 mr-2" />
                <span>Müzik Teorisi</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="makamlar" className="mt-0">
            <ScrollArea className="h-[400px] p-4">
              <Accordion type="single" collapsible className="w-full">
                {makamData.map((makam, index) => (
                  <motion.div
                    key={makam.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <AccordionItem value={makam.id} className="border-dark-100">
                      <AccordionTrigger className="hover:bg-dark-100/50 px-3">
                        {makam.name} Makamı
                      </AccordionTrigger>
                      <AccordionContent className="px-6 py-3 bg-dark-300/20">
                        <div className="space-y-3">
                          <div>
                            <h4 className="text-sm font-medium text-primary mb-1">Tanım</h4>
                            <p className="text-sm text-gray-300">{makam.description}</p>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-primary mb-1">Perdeler</h4>
                            <p className="text-sm text-gray-300">{makam.notes}</p>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-primary mb-1">Hissettirdikleri</h4>
                            <p className="text-sm text-gray-300">{makam.emotions}</p>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-primary mb-1">Örnek Eserler</h4>
                            <ul className="text-sm text-gray-300 list-disc list-inside">
                              {makam.examples.map((example, i) => (
                                <li key={i}>{example}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>
                ))}
              </Accordion>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="teori" className="mt-0">
            <ScrollArea className="h-[400px] p-4">
              <div className="space-y-6">
                {Object.entries(musicTheory).map(([key, { title, content }], index) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.15 }}
                    className="bg-dark-100/40 rounded-lg p-4"
                  >
                    <h3 className="text-base font-medium text-primary mb-2">{title}</h3>
                    <p className="text-sm text-gray-300">{content}</p>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>

      <CardFooter className="pt-3 pb-4 flex justify-between items-center border-t border-dark-100">
        <p className="text-xs text-gray-400">
          {activeTab === "makamlar" 
            ? "Türk müziğinin kalbi olan makamları keşfedin"
            : "Türk müzik teorisi hakkında bilgi edinin"
          }
        </p>
        <Button variant="ghost" size="sm" className="gap-1 text-xs">
          <Info className="h-3 w-3" />
          <span>Daha Fazla Bilgi</span>
        </Button>
      </CardFooter>
    </Card>
  );
}