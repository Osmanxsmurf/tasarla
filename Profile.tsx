import React from 'react';
import Layout from '@/components/Layout';
import { ProfileSection } from '@/components/ProfileSection';

export default function ProfilePage() {
  // Set page title
  document.title = 'Profilim - Müzik Asistanım';
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Profilim</h1>
          <p className="text-muted-foreground">
            Müzik tercihlerinizi ve dinleme alışkanlıklarınızı görüntüleyin
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-8">
          <ProfileSection />
        </div>
      </div>
    </Layout>
  );
}