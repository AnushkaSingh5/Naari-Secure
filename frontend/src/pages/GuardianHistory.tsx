import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { History as ActivityHistory, MapPin, Volume2, ArrowLeft, Clock, Calendar, ShieldAlert, Navigation } from 'lucide-react';

const GuardianHistory = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const { t } = useLanguage();
  const [ward, setWard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'sos' | 'travel'>('sos');

  useEffect(() => {
    const fetchWardData = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/guardian/sos-status`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          const foundWard = data.find((w: any) => w._id === id);
          setWard(foundWard);
        }
      } catch (error) {
        console.error("Failed to fetch ward history", error);
      } finally {
        setLoading(false);
      }
    };

    if (token && id) {
      fetchWardData();
    }
  }, [token, id]);

  if (loading) {
    return (
      <Layout>
        <div className="container px-4 py-24 flex flex-col items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground font-medium">Loading ward history...</p>
        </div>
      </Layout>
    );
  }

  if (!ward) {
    return (
      <Layout>
        <div className="container px-4 py-24 text-center max-w-md mx-auto">
          <ShieldAlert className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Ward Not Found</h2>
          <p className="text-muted-foreground mb-6">We couldn't retrieve the history for this safety contact. It may have been unlinked.</p>
          <Link to="/">
            <Button className="w-full flex items-center justify-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container px-4 py-8 md:py-16 max-w-4xl mx-auto">
        
        {/* Back Link */}
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        {/* Profile Card Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-muted/20 border p-6 rounded-3xl mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-2xl shadow-sm">
              {ward.name[0]}
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">{ward.name}</h1>
              <p className="text-sm font-medium text-muted-foreground">{ward.email} • {ward.phone}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full border border-emerald-200">
              Verified Contact
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border mb-6">
          <button
            onClick={() => setActiveTab('sos')}
            className={`pb-3 px-4 text-sm font-black uppercase tracking-wider border-b-2 transition-all ${
              activeTab === 'sos'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            SOS Alerts ({ward.sosHistory?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('travel')}
            className={`pb-3 px-4 text-sm font-black uppercase tracking-wider border-b-2 transition-all ${
              activeTab === 'travel'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Travel Logs ({ward.travelHistory?.length || 0})
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'sos' ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ActivityHistory className="w-5 h-5 text-primary" />
                Complete SOS History
              </CardTitle>
              <CardDescription>
                Full list of all emergency warnings triggered by {ward.name}.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {ward.sosHistory?.length > 0 ? (
                <div className="space-y-4">
                  {ward.sosHistory.slice().reverse().map((history: any, index: number) => (
                    <div key={index} className="p-5 border rounded-2xl bg-muted/20 hover:border-primary/20 transition-all hover:bg-white hover:shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-600 text-[9px] font-black uppercase tracking-wider">
                            SOS Alert
                          </span>
                          <span className="text-xs text-muted-foreground font-semibold flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> Duration: {history.duration}
                          </span>
                        </div>
                        <h3 className="font-bold text-gray-900 flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          {new Date(history.startTime).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </h3>
                        <p className="text-xs text-muted-foreground font-medium pl-5">
                          {new Date(history.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          {" → "}
                          {new Date(history.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 pt-2 md:pt-0 border-t border-border/50 md:border-none">
                        {history.startLocation && (
                          <a
                            href={`https://www.google.com/maps?q=${history.startLocation.lat},${history.startLocation.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary font-black uppercase tracking-wider hover:underline flex items-center gap-1.5 bg-primary/5 px-3 py-2 rounded-xl border border-primary/10"
                          >
                            <MapPin className="w-4 h-4" /> {t('viewStartLocation')}
                          </a>
                        )}
                        {history.audioFile && (
                          <button
                            onClick={() => {
                              const audio = new Audio(`${import.meta.env.VITE_API_BASE_URL}/uploads/audio/${history.audioFile}`);
                              audio.play().catch(e => console.error("History audio play failed", e));
                            }}
                            className="p-2 px-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors flex items-center gap-1.5 text-xs font-black uppercase shadow-sm"
                            title="Play Recording"
                          >
                            <Volume2 className="w-4 h-4" /> {t('audio')}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 text-muted-foreground bg-gray-50/30 rounded-2xl border border-dashed">
                  <Clock className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p className="text-lg font-medium">No SOS Incidents</p>
                  <p className="text-sm opacity-70">{ward.name} has not triggered any emergency warnings.</p>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Navigation className="w-5 h-5 text-primary animate-pulse" />
                Complete Travel History
              </CardTitle>
              <CardDescription>
                Full list of all travel mode journeys completed by {ward.name}.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {ward.travelHistory?.length > 0 ? (
                <div className="space-y-4">
                  {ward.travelHistory.slice().reverse().map((trip: any, index: number) => (
                    <div key={index} className="p-5 border rounded-2xl bg-muted/20 hover:border-primary/20 transition-all hover:bg-white hover:shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                            trip.status === 'completed' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {trip.status === 'completed' ? 'Arrived Safely' : 'SOS Alert Triggered'}
                          </span>
                          {trip.delayed && (
                            <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-700 text-[9px] font-black uppercase">
                              Delayed
                            </span>
                          )}
                        </div>
                        <h3 className="font-bold text-gray-900">
                          Destination: <span className="text-primary">{trip.destination}</span>
                        </h3>
                        <p className="text-xs text-muted-foreground font-medium">
                          <Calendar className="w-3.5 h-3.5 inline mr-1" />
                          {new Date(trip.startTime).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                          {"  •  "}
                          <Clock className="w-3.5 h-3.5 inline mr-1 ml-2" />
                          {new Date(trip.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          {" → "}
                          {new Date(trip.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>

                      {trip.audioFile && (
                        <div className="flex items-center gap-2 pt-2 md:pt-0 border-t border-border/50 md:border-none">
                          <button
                            onClick={() => {
                              const audio = new Audio(`${import.meta.env.VITE_API_BASE_URL}/uploads/audio/${trip.audioFile}`);
                              audio.play().catch(e => console.error("Trip audio play failed", e));
                            }}
                            className="p-2 px-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors flex items-center gap-1.5 text-xs font-black uppercase shadow-sm"
                            title="Play Recording"
                          >
                            <Volume2 className="w-4 h-4" /> {t('audio')}
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 text-muted-foreground bg-gray-50/30 rounded-2xl border border-dashed">
                  <Navigation className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p className="text-lg font-medium">No Travel History</p>
                  <p className="text-sm opacity-70">{ward.name} has not recorded any travel routes yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default GuardianHistory;
