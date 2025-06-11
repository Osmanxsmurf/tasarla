import React, { useState } from "react";
import { useNavigate } from "wouter";
import { useAuth } from "@/context/auth-context";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Settings, LogOut, User, History, Heart, Music } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Profile() {
  const [_, navigate] = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { toast } = useToast();
  
  // Fetch stats
  const { data: favorites } = useQuery({
    queryKey: ["/api/favorites"],
    enabled: isAuthenticated,
  });
  
  const { data: playHistory } = useQuery({
    queryKey: ["/api/history"],
    enabled: isAuthenticated,
  });
  
  const { data: searches } = useQuery({
    queryKey: ["/api/searches"],
    enabled: isAuthenticated,
  });
  
  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
    } catch (error: any) {
      toast({
        title: "Logout failed",
        description: error.message || "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Stats data
  const stats = [
    {
      title: "Favorites",
      value: favorites?.length || 0,
      icon: <Heart className="h-5 w-5 text-primary" />,
      onClick: () => navigate("/favorites"),
    },
    {
      title: "Tracks Played",
      value: playHistory?.length || 0,
      icon: <Music className="h-5 w-5 text-secondary" />,
      onClick: () => navigate("/recent"),
    },
    {
      title: "Searches",
      value: searches?.length || 0,
      icon: <History className="h-5 w-5 text-destructive" />,
      onClick: () => navigate("/search"),
    },
  ];
  
  if (!isAuthenticated) {
    return (
      <div className="px-4 py-6 md:px-8 md:py-8">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <User className="h-16 w-16 text-light-300 mb-4" />
          <h3 className="text-xl font-medium mb-2">Sign in to view your profile</h3>
          <p className="text-light-300 max-w-md mb-4">
            Create an account or sign in to access your profile, favorites, and listening history.
          </p>
          <Button 
            onClick={() => window.dispatchEvent(new CustomEvent("open-auth-modal"))}
            className="bg-primary hover:bg-primary/90"
          >
            Sign In
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="px-4 py-6 md:px-8 md:py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-heading font-bold mb-2">Your Profile</h1>
        <p className="text-light-300">Manage your account settings and view your music stats.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="md:col-span-1">
          <Card className="bg-dark-200 border-dark-100">
            <CardHeader className="flex flex-row items-start space-x-4 pb-2">
              <Avatar className="h-16 w-16 border-2 border-primary">
                {user?.profilePicture ? (
                  <AvatarImage src={user.profilePicture} alt={user.name || user.username} />
                ) : (
                  <AvatarFallback className="bg-primary text-white text-lg">
                    {user?.name 
                      ? user.name.charAt(0).toUpperCase() 
                      : user?.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="space-y-1">
                <CardTitle>{user?.name || user?.username}</CardTitle>
                <CardDescription>@{user?.username}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mt-2">
                <div>
                  <p className="text-sm text-light-300 mb-1">Email</p>
                  <p className="text-light-100">{user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-light-300 mb-1">Account created</p>
                  <p className="text-light-100">
                    {user?.createdAt 
                      ? new Date(user.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      : "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2 items-stretch">
              <Button 
                variant="outline" 
                className="w-full justify-start bg-dark-100 hover:bg-dark-100/80 border-dark-100"
                onClick={() => navigate("/settings")}
              >
                <Settings className="mr-2 h-4 w-4" />
                Account Settings
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="destructive" 
                    className="w-full justify-start"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log Out
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-dark-200 border-dark-100">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Log out of MusicAI?</AlertDialogTitle>
                    <AlertDialogDescription className="text-light-300">
                      You will need to sign in again to access your account.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-dark-100 border-dark-100 text-light-100 hover:bg-dark-100/80 hover:text-light-100">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleLogout}
                      className="bg-destructive text-white hover:bg-destructive/90"
                    >
                      Log Out
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </Card>
        </div>
        
        {/* Stats and Activity */}
        <div className="md:col-span-2">
          <Tabs defaultValue="stats">
            <TabsList className="grid grid-cols-2 bg-dark-200 rounded-lg mb-6">
              <TabsTrigger value="stats" className="rounded-md data-[state=active]:bg-dark-100">
                Stats
              </TabsTrigger>
              <TabsTrigger value="activity" className="rounded-md data-[state=active]:bg-dark-100">
                Recent Activity
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="stats" className="mt-0">
              <Card className="bg-dark-200 border-dark-100">
                <CardHeader>
                  <CardTitle>Music Statistics</CardTitle>
                  <CardDescription>
                    Your listening habits and music preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {stats.map((stat, index) => (
                      <div 
                        key={index}
                        className="bg-dark-100 p-4 rounded-lg hover:bg-dark-100/80 transition-colors cursor-pointer"
                        onClick={stat.onClick}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-sm font-medium text-light-300">{stat.title}</h3>
                          {stat.icon}
                        </div>
                        <p className="text-2xl font-bold">{stat.value}</p>
                      </div>
                    ))}
                  </div>
                  
                  <Separator className="my-6 bg-dark-100" />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Top Genres</h3>
                    <div className="space-y-3">
                      {/* Sample genres with progress bars - in a real app this would be data-driven */}
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Electronic</span>
                          <span className="text-sm text-light-300">45%</span>
                        </div>
                        <div className="h-2 bg-dark-100 rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: "45%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Rock</span>
                          <span className="text-sm text-light-300">30%</span>
                        </div>
                        <div className="h-2 bg-dark-100 rounded-full overflow-hidden">
                          <div className="h-full bg-secondary" style={{ width: "30%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Hip-Hop</span>
                          <span className="text-sm text-light-300">15%</span>
                        </div>
                        <div className="h-2 bg-dark-100 rounded-full overflow-hidden">
                          <div className="h-full bg-destructive" style={{ width: "15%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Jazz</span>
                          <span className="text-sm text-light-300">10%</span>
                        </div>
                        <div className="h-2 bg-dark-100 rounded-full overflow-hidden">
                          <div className="h-full bg-yellow-500" style={{ width: "10%" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="activity" className="mt-0">
              <Card className="bg-dark-200 border-dark-100">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Your latest interactions with MusicAI
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {playHistory && playHistory.length > 0 ? (
                    <div className="space-y-4">
                      {playHistory.slice(0, 5).map((item: any) => (
                        <div key={item.id} className="flex items-center bg-dark-100 p-3 rounded-lg">
                          <div className="h-10 w-10 rounded overflow-hidden mr-3 flex-shrink-0">
                            {item.albumArt ? (
                              <img 
                                src={item.albumArt} 
                                alt={item.title} 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-dark-200 flex items-center justify-center">
                                <Music className="text-light-300" size={16} />
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-1 overflow-hidden">
                            <p className="font-medium text-sm truncate">{item.title}</p>
                            <p className="text-xs text-light-300 truncate">{item.artist}</p>
                          </div>
                          
                          <div className="text-xs text-light-300 ml-2">
                            {new Date(item.playedAt).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </div>
                        </div>
                      ))}
                      
                      <Button 
                        variant="outline" 
                        className="w-full mt-2 bg-dark-100 hover:bg-dark-100/80 border-dark-100"
                        onClick={() => navigate("/recent")}
                      >
                        View All Activity
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <History className="h-12 w-12 text-light-300 mb-3" />
                      <h3 className="text-lg font-medium mb-1">No activity yet</h3>
                      <p className="text-light-300 text-sm mb-4">
                        Start playing music to see your activity here.
                      </p>
                      <Button 
                        onClick={() => navigate("/search")}
                        className="bg-primary hover:bg-primary/90"
                      >
                        Discover Music
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
