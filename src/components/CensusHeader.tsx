import { Landmark } from 'lucide-react';

export function CensusHeader() {
  return (
    <header className="border-b bg-card px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Landmark className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">भारत की जनगणना 2027 (Bharat Census)</h1>
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">
            मकान सूचीकरण एवं मकान गणना (Houselisting and Housing Census)
          </p>
        </div>
      </div>
    </header>
  );
}
