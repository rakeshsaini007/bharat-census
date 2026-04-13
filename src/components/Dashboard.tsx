import { useState, useEffect } from 'react';
import { CensusRecord } from '@/src/types';
import { CensusHeader } from './CensusHeader';
import { CensusTable } from './CensusTable';
import { CensusEntryForm } from './CensusEntryForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Home, CheckCircle2, FileText, Loader2 } from 'lucide-react';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { GAS_WEB_APP_URL } from '@/src/config';

export function Dashboard() {
  const [records, setRecords] = useState<CensusRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecords = async () => {
    if (GAS_WEB_APP_URL === "YOUR_GAS_DEPLOY_URL_HERE") {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(`${GAS_WEB_APP_URL}?action=getRecords`);
      const data = await response.json();
      if (data.success) {
        setRecords(data.records);
      }
    } catch (error) {
      console.error("Error fetching records:", error);
      toast.error("Failed to fetch records from Google Sheets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleAddRecord = (record: CensusRecord) => {
    // This will be called after successful GAS save/update
    fetchRecords();
  };

  const stats = {
    totalHouseholds: records.length,
    totalPopulation: records.reduce((acc, r) => acc + (r.totalPersons || 0), 0),
    ownedHouses: records.filter(r => r.ownershipStatus === 'Owned').length,
    completedEntries: records.length,
  };

  return (
    <div className="min-h-screen bg-muted/30 pb-12">
      <CensusHeader />
      <Toaster position="top-right" />
      
      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white/50 backdrop-blur-sm border-primary/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Households</CardTitle>
              <Home className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalHouseholds}</div>
              <p className="text-xs text-muted-foreground mt-1">Registered in current session</p>
            </CardContent>
          </Card>
          <Card className="bg-white/50 backdrop-blur-sm border-primary/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Population</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPopulation}</div>
              <p className="text-xs text-muted-foreground mt-1">Sum of all household members</p>
            </CardContent>
          </Card>
          <Card className="bg-white/50 backdrop-blur-sm border-primary/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">Owned Houses</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.ownedHouses}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.totalHouseholds > 0 
                  ? `${Math.round((stats.ownedHouses / stats.totalHouseholds) * 100)}% of total` 
                  : '0% of total'}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white/50 backdrop-blur-sm border-primary/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">Completed Forms</CardTitle>
              <FileText className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedEntries}</div>
              <p className="text-xs text-muted-foreground mt-1">Validated and saved entries</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Census Records</h2>
              <p className="text-muted-foreground">Manage and review collected census data.</p>
            </div>
            <CensusEntryForm onAddRecord={handleAddRecord} existingRecords={records} />
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <Loader2 className="h-12 w-12 mb-4 animate-spin opacity-20" />
              <p>Loading records from Google Sheets...</p>
            </div>
          ) : (
            <CensusTable records={records} />
          )}
        </div>
      </main>
    </div>
  );
}
