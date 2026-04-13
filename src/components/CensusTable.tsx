import { CensusRecord } from '@/src/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { User, Home, Droplets, Car } from 'lucide-react';

interface CensusTableProps {
  records: CensusRecord[];
}

export function CensusTable({ records }: CensusTableProps) {
  if (records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground bg-muted/20 rounded-xl border-2 border-dashed">
        <Home className="h-12 w-12 mb-4 opacity-20" />
        <p className="text-lg font-medium">No records found</p>
        <p className="text-sm">Start by adding a new census entry.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <ScrollArea className="w-full">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[80px]">Line</TableHead>
              <TableHead className="min-w-[150px]">Head of Household</TableHead>
              <TableHead className="min-w-[100px]">Building</TableHead>
              <TableHead className="min-w-[100px]">House No.</TableHead>
              <TableHead className="min-w-[100px]">Persons</TableHead>
              <TableHead className="min-w-[100px]">Sex</TableHead>
              <TableHead className="min-w-[120px]">Ownership</TableHead>
              <TableHead className="min-w-[150px]">Use</TableHead>
              <TableHead className="min-w-[150px]">Fuel</TableHead>
              <TableHead className="min-w-[200px]">Assets</TableHead>
              <TableHead className="min-w-[150px]">Mobile</TableHead>
              <TableHead className="min-w-[180px]">Last Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((record) => (
              <TableRow key={record.id} className="hover:bg-muted/30 transition-colors">
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {record.lineNumber.toString().slice(-4)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <User className="h-4 w-4" />
                    </div>
                    <span className="font-medium">{record.headName}</span>
                  </div>
                </TableCell>
                <TableCell>{record.buildingNumber}</TableCell>
                <TableCell>{record.censusHouseNumber}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-mono">
                    {record.totalPersons}
                  </Badge>
                </TableCell>
                <TableCell>{record.headSex}</TableCell>
                <TableCell>
                  <Badge variant={record.ownershipStatus === 'Owned' ? 'default' : 'secondary'}>
                    {record.ownershipStatus}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">{record.houseUse}</TableCell>
                <TableCell className="text-sm">{record.cookingFuel}</TableCell>
                <TableCell>
                  <div className="flex gap-1 flex-wrap">
                    {record.hasTelevision && <Badge variant="outline" className="text-[10px] px-1">TV</Badge>}
                    {record.hasLaptop && <Badge variant="outline" className="text-[10px] px-1">PC</Badge>}
                    {record.hasCar && <Badge variant="outline" className="text-[10px] px-1">Car</Badge>}
                    {record.hasScooter && <Badge variant="outline" className="text-[10px] px-1">Bike</Badge>}
                    {record.hasTelephone && <Badge variant="outline" className="text-[10px] px-1">Mob</Badge>}
                  </div>
                </TableCell>
                <TableCell className="font-mono text-sm">{record.mobileNumber}</TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {record.timestamp ? new Date(record.timestamp).toLocaleString() : 'N/A'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
