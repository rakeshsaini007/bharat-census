import React, { useState, useEffect } from 'react';
import { CensusRecord, MATERIAL_OPTIONS, HOUSE_USE_OPTIONS, FUEL_OPTIONS } from '@/src/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Loader2, AlertCircle } from 'lucide-react';
import { GAS_WEB_APP_URL } from '@/src/config';
import { toast } from 'sonner';

interface CensusEntryFormProps {
  onAddRecord: (record: CensusRecord) => void;
  existingRecords: CensusRecord[];
}

export function CensusEntryForm({ onAddRecord, existingRecords }: CensusEntryFormProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [formData, setFormData] = useState<Partial<CensusRecord>>({
    headSex: 'Male',
    scStStatus: 'None',
    ownershipStatus: 'Owned',
    totalPersons: 1,
    dwellingRooms: 1,
    marriedCouples: 0,
    hasRadio: false,
    hasTelevision: false,
    hasLaptop: false,
    hasTelephone: false,
    hasBicycle: false,
    hasScooter: false,
    hasCar: false,
  });

  // Check if record already exists based on building and house number
  useEffect(() => {
    if (formData.buildingNumber && formData.censusHouseNumber) {
      const existing = existingRecords.find(
        r => r.buildingNumber === formData.buildingNumber && r.censusHouseNumber === formData.censusHouseNumber
      );
      if (existing) {
        setFormData(existing);
        setIsUpdate(true);
      } else {
        setIsUpdate(false);
      }
    }
  }, [formData.buildingNumber, formData.censusHouseNumber, existingRecords]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (GAS_WEB_APP_URL === "YOUR_GAS_DEPLOY_URL_HERE") {
      toast.error("Google Apps Script URL not configured. Please see code.js for instructions.");
      return;
    }

    setIsSubmitting(true);
    try {
      const record: CensusRecord = {
        ...formData as CensusRecord,
        id: formData.id || Math.random().toString(36).substr(2, 9),
        lineNumber: formData.lineNumber || Date.now(),
        timestamp: new Date().toISOString(),
      };

      const response = await fetch(GAS_WEB_APP_URL, {
        method: 'POST',
        mode: 'no-cors', // GAS requires no-cors for simple POST or it fails preflight
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'saveRecord',
          record: record
        }),
      });

      // Since mode is 'no-cors', we can't read the response body.
      // We assume success if no error is thrown.
      // For a better experience, GAS should return a redirect or we use a proxy.
      // But per user request "use the deploy url manually", we'll stick to direct fetch.
      
      toast.success(isUpdate ? 'Record updated successfully' : 'Record saved successfully', {
        description: `Census entry for ${record.headName} has been ${isUpdate ? 'updated' : 'saved'} in Google Sheets.`,
      });
      
      onAddRecord(record);
      setOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error saving record:", error);
      toast.error("Failed to save record to Google Sheets");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      headSex: 'Male',
      scStStatus: 'None',
      ownershipStatus: 'Owned',
      totalPersons: 1,
      dwellingRooms: 1,
      marriedCouples: 0,
    });
    setIsUpdate(false);
  };

  const updateField = (field: keyof CensusRecord, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Add New Record
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>New Census Entry | नई प्रविष्टि</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          {isUpdate && (
            <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-amber-800">Existing Record Found</h4>
                <p className="text-xs text-amber-700">
                  A record for Building <strong>{formData.buildingNumber}</strong>, House <strong>{formData.censusHouseNumber}</strong> already exists. 
                  You are now in <strong>Update Mode</strong>. Changes will overwrite the existing entry.
                </p>
              </div>
            </div>
          )}
          <Tabs defaultValue="location" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="location">Location & House</TabsTrigger>
              <TabsTrigger value="household">Household</TabsTrigger>
              <TabsTrigger value="amenities">Amenities</TabsTrigger>
              <TabsTrigger value="assets">Assets & Income</TabsTrigger>
            </TabsList>

            <ScrollArea className="h-[60vh] mt-4 pr-4">
              <TabsContent value="location" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Building Number (Col 2)</Label>
                    <Input required value={formData.buildingNumber || ''} onChange={e => updateField('buildingNumber', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Census House Number (Col 3)</Label>
                    <Input required value={formData.censusHouseNumber || ''} onChange={e => updateField('censusHouseNumber', e.target.value)} />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Floor Material (Col 4)</Label>
                    <Select onValueChange={v => updateField('floorMaterial', v)}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>{MATERIAL_OPTIONS.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Wall Material (Col 5)</Label>
                    <Select onValueChange={v => updateField('wallMaterial', v)}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>{MATERIAL_OPTIONS.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Roof Material (Col 6)</Label>
                    <Select onValueChange={v => updateField('roofMaterial', v)}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>{MATERIAL_OPTIONS.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>House Use (Col 7)</Label>
                    <Select onValueChange={v => updateField('houseUse', v)}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>{HOUSE_USE_OPTIONS.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Condition (Col 8)</Label>
                    <Select onValueChange={v => updateField('houseCondition', v)}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Good">Good</SelectItem>
                        <SelectItem value="Livable">Livable</SelectItem>
                        <SelectItem value="Dilapidated">Dilapidated</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="household" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Household Number (Col 9)</Label>
                    <Input required value={formData.householdNumber || ''} onChange={e => updateField('householdNumber', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Total Persons (Col 10)</Label>
                    <Input type="number" value={formData.totalPersons || 1} onChange={e => updateField('totalPersons', parseInt(e.target.value))} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Name of Head of Household (Col 11)</Label>
                  <Input required value={formData.headName || ''} onChange={e => updateField('headName', e.target.value)} />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Sex (Col 12)</Label>
                    <Select value={formData.headSex} onValueChange={v => updateField('headSex', v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>SC/ST Status (Col 13)</Label>
                    <Select value={formData.scStStatus} onValueChange={v => updateField('scStStatus', v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SC">SC</SelectItem>
                        <SelectItem value="ST">ST</SelectItem>
                        <SelectItem value="None">None</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Ownership (Col 14)</Label>
                    <Select value={formData.ownershipStatus} onValueChange={v => updateField('ownershipStatus', v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Owned">Owned</SelectItem>
                        <SelectItem value="Rented">Rented</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Dwelling Rooms (Col 15)</Label>
                    <Input type="number" value={formData.dwellingRooms || 1} onChange={e => updateField('dwellingRooms', parseInt(e.target.value))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Married Couples (Col 16)</Label>
                    <Input type="number" value={formData.marriedCouples || 0} onChange={e => updateField('marriedCouples', parseInt(e.target.value))} />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="amenities" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Drinking Water Source (Col 17)</Label>
                    <Input value={formData.drinkingWaterSource || ''} onChange={e => updateField('drinkingWaterSource', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Water Availability (Col 18)</Label>
                    <Input value={formData.drinkingWaterAvailability || ''} onChange={e => updateField('drinkingWaterAvailability', e.target.value)} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Lighting Source (Col 19)</Label>
                    <Input value={formData.lightingSource || ''} onChange={e => updateField('lightingSource', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Latrine Availability (Col 20)</Label>
                    <Input value={formData.latrineAvailability || ''} onChange={e => updateField('latrineAvailability', e.target.value)} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Type of Latrine (Col 21)</Label>
                    <Input value={formData.latrineType || ''} onChange={e => updateField('latrineType', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Waste Water Outlet (Col 22)</Label>
                    <Input value={formData.wasteWaterOutlet || ''} onChange={e => updateField('wasteWaterOutlet', e.target.value)} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Bathing Facility (Col 23)</Label>
                    <Input value={formData.bathingFacility || ''} onChange={e => updateField('bathingFacility', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Kitchen Facility (Col 24)</Label>
                    <Input value={formData.kitchenFacility || ''} onChange={e => updateField('kitchenFacility', e.target.value)} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Cooking Fuel (Col 25)</Label>
                  <Select onValueChange={v => updateField('cookingFuel', v)}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>{FUEL_OPTIONS.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </TabsContent>

              <TabsContent value="assets" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <Label className="block mb-2">Assets (Col 26-32)</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" checked={formData.hasRadio} onChange={e => updateField('hasRadio', e.target.checked)} />
                        <Label>Radio</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" checked={formData.hasTelevision} onChange={e => updateField('hasTelevision', e.target.checked)} />
                        <Label>TV</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" checked={formData.hasLaptop} onChange={e => updateField('hasLaptop', e.target.checked)} />
                        <Label>Laptop</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" checked={formData.hasTelephone} onChange={e => updateField('hasTelephone', e.target.checked)} />
                        <Label>Mobile</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" checked={formData.hasBicycle} onChange={e => updateField('hasBicycle', e.target.checked)} />
                        <Label>Bicycle</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" checked={formData.hasScooter} onChange={e => updateField('hasScooter', e.target.checked)} />
                        <Label>Scooter</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" checked={formData.hasCar} onChange={e => updateField('hasCar', e.target.checked)} />
                        <Label>Car</Label>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Income Source (Col 33)</Label>
                      <Input value={formData.incomeSource || ''} onChange={e => updateField('incomeSource', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Mobile Number (Col 34)</Label>
                      <Input value={formData.mobileNumber || ''} onChange={e => updateField('mobileNumber', e.target.value)} />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </ScrollArea>
          </Tabs>

          <div className="flex justify-between items-center mt-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {isUpdate && (
                <div className="flex items-center gap-1 text-amber-600 font-medium">
                  <AlertCircle className="h-4 w-4" />
                  Existing record found. Updating...
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                {isUpdate ? 'Update Record' : 'Save Record'}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
