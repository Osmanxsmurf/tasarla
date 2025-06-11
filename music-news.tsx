import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowUpRight, Music, Headphones } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface MusicNewsItem {
  id: string;
  title: string;
  excerpt: string;
  image?: string;
  date: Date;
  category: string;
  url?: string;
}

interface MusicNewsProps {
  news: MusicNewsItem[];
  className?: string;
}

const turkishMusicNews: MusicNewsItem[] = [
  {
    id: "1",
    title: "2024 Yılı Müzik Trendleri: Türk Rap Yükselişte",
    excerpt: "Bu yıl Türk müzik piyasasında rap müziğin etkili yükselişi devam ediyor. Yeni nesil rap sanatçılarının büyük kitlelere ulaşmasıyla...",
    image: "https://images.unsplash.com/photo-1571151419282-632acb21e681?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
    date: new Date(2024, 4, 10),
    category: "Müzik Trendleri"
  },
  {
    id: "2",
    title: "Türk Halk Müziği Festivali Ankara'da Düzenlenecek",
    excerpt: "Geleneksel Türk halk müziği değerlerini yaşatmak amacıyla düzenlenen festival, bu yıl 15-20 Haziran tarihleri arasında Ankara'da...",
    image: "https://images.unsplash.com/photo-1514533450685-4493e01d1fdc?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
    date: new Date(2024, 5, 5),
    category: "Festival"
  },
  {
    id: "3",
    title: "Makam Üzerine Yeni Bir Dijital Platform: MakamDB",
    excerpt: "Türk müziğinin en önemli yapıtaşlarından olan makamları dijital ortamda arşivleyen ve detaylı bilgiler sunan yeni platform kullanıma açıldı...",
    image: "https://images.unsplash.com/photo-1527261834078-9b37d35a4a32?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
    date: new Date(2024, 3, 28),
    category: "Teknoloji"
  },
  {
    id: "4",
    title: "Türkiye'nin İlk Metaverse Müzik Konseri Düzenlendi",
    excerpt: "Dijital dünyada müzik deneyiminin sınırlarını zorlayan metaverse konser, Türkiye'de bir ilk olarak gerçekleştirildi...",
    image: "https://images.unsplash.com/photo-1584954810806-0afa9169b7c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
    date: new Date(2024, 4, 15),
    category: "Dijital"
  }
];

export function MusicNews({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Headphones className="h-5 w-5 text-primary" />
          <span>Müzik Haberleri</span>
        </h2>
        <Badge variant="outline" className="text-xs px-2 py-0">
          Güncel
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {turkishMusicNews.map((news, index) => (
          <motion.div
            key={news.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="h-full bg-dark-200/50 backdrop-blur-sm border-dark-100 hover:border-dark-50 transition-all overflow-hidden hover:shadow-lg">
              {news.image && (
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-300 via-transparent to-transparent z-10" />
                  <img
                    src={news.image}
                    alt={news.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 z-20">
                    <Badge className="bg-primary/80 hover:bg-primary text-white text-xs">
                      {news.category}
                    </Badge>
                  </div>
                </div>
              )}
              <CardHeader className="pb-2">
                <div className="flex items-center text-muted-foreground text-xs mb-2">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>
                    {formatDistanceToNow(news.date, { addSuffix: true, locale: tr })}
                  </span>
                </div>
                <CardTitle className="text-lg line-clamp-2">{news.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="line-clamp-2 text-gray-400">
                  {news.excerpt}
                </CardDescription>
              </CardContent>
              <CardFooter>
                <a
                  href={news.url || "#"}
                  className="text-xs text-primary flex items-center hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Haberi oku
                  <ArrowUpRight className="h-3 w-3 ml-1" />
                </a>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}