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
    
    if (!GAS_WEB_APP_URL || GAS_WEB_APP_URL.includes("YOUR_GAS_DEPLOY_URL")) {
      toast.error("गूगल ऐप्स स्क्रिप्ट URL कॉन्फ़िगर नहीं है।");
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
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'saveRecord',
          record: record
        }),
      });

      toast.success(isUpdate ? 'रिकॉर्ड सफलतापूर्वक अपडेट किया गया' : 'रिकॉर्ड सफलतापूर्वक सहेजा गया', {
        description: `${record.headName} के लिए जनगणना प्रविष्टि गूगल शीट में ${isUpdate ? 'अपडेट' : 'सुरक्षित'} कर दी गई है।`,
      });
      
      onAddRecord(record);
      setOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error saving record:", error);
      toast.error("गूगल शीट में रिकॉर्ड सहेजने में विफल");
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
      <DialogTrigger
        render={
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> नई प्रविष्टि जोड़ें (Add New Record)
          </Button>
        }
      />
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>नई जनगणना प्रविष्टि (New Census Entry)</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          {isUpdate && (
            <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-amber-800">मौजूदा रिकॉर्ड मिला (Existing Record Found)</h4>
                <p className="text-xs text-amber-700">
                  भवन <strong>{formData.buildingNumber}</strong>, मकान <strong>{formData.censusHouseNumber}</strong> के लिए रिकॉर्ड पहले से मौजूद है। 
                  आप अब <strong>अपडेट मोड</strong> में हैं।
                </p>
              </div>
            </div>
          )}
          <Tabs defaultValue="location" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="location">स्थान और मकान</TabsTrigger>
              <TabsTrigger value="household">परिवार</TabsTrigger>
              <TabsTrigger value="amenities">सुविधाएं</TabsTrigger>
              <TabsTrigger value="assets">संपत्ति और आय</TabsTrigger>
            </TabsList>

            <ScrollArea className="h-[60vh] mt-4 pr-4">
              <TabsContent value="location" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>भवन नंबर (Building Number) - Col 2</Label>
                    <Input required value={formData.buildingNumber || ''} onChange={e => updateField('buildingNumber', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>जनगणना मकान नंबर (Census House No.) - Col 3</Label>
                    <Input required value={formData.censusHouseNumber || ''} onChange={e => updateField('censusHouseNumber', e.target.value)} />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>फर्श की सामग्री (Floor) - Col 4</Label>
                    <Select onValueChange={v => updateField('floorMaterial', v)}>
                      <SelectTrigger><SelectValue placeholder="चुनें" /></SelectTrigger>
                      <SelectContent>{MATERIAL_OPTIONS.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>दीवार की सामग्री (Wall) - Col 5</Label>
                    <Select onValueChange={v => updateField('wallMaterial', v)}>
                      <SelectTrigger><SelectValue placeholder="चुनें" /></SelectTrigger>
                      <SelectContent>{MATERIAL_OPTIONS.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>छत की सामग्री (Roof) - Col 6</Label>
                    <Select onValueChange={v => updateField('roofMaterial', v)}>
                      <SelectTrigger><SelectValue placeholder="चुनें" /></SelectTrigger>
                      <SelectContent>{MATERIAL_OPTIONS.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>मकान का उपयोग (House Use) - Col 7</Label>
                    <Select onValueChange={v => updateField('houseUse', v)}>
                      <SelectTrigger><SelectValue placeholder="चुनें" /></SelectTrigger>
                      <SelectContent>{HOUSE_USE_OPTIONS.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>मकान की स्थिति (Condition) - Col 8</Label>
                    <Select onValueChange={v => updateField('houseCondition', v)}>
                      <SelectTrigger><SelectValue placeholder="चुनें" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Good">अच्छी (Good)</SelectItem>
                        <SelectItem value="Livable">रहने योग्य (Livable)</SelectItem>
                        <SelectItem value="Dilapidated">जर्जर (Dilapidated)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="household" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>परिवार नंबर (Household Number) - Col 9</Label>
                    <Input required value={formData.householdNumber || ''} onChange={e => updateField('householdNumber', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>कुल व्यक्ति (Total Persons) - Col 10</Label>
                    <Input type="number" value={formData.totalPersons || 1} onChange={e => updateField('totalPersons', parseInt(e.target.value))} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>परिवार के मुखिया का नाम (Head Name) - Col 11</Label>
                  <Input required value={formData.headName || ''} onChange={e => updateField('headName', e.target.value)} />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>लिंग (Sex) - Col 12</Label>
                    <Select value={formData.headSex} onValueChange={v => updateField('headSex', v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">पुरुष (Male)</SelectItem>
                        <SelectItem value="Female">महिला (Female)</SelectItem>
                        <SelectItem value="Other">अन्य (Other)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>SC/ST स्थिति - Col 13</Label>
                    <Select value={formData.scStStatus} onValueChange={v => updateField('scStStatus', v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SC">SC</SelectItem>
                        <SelectItem value="ST">ST</SelectItem>
                        <SelectItem value="None">कोई नहीं (None)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>स्वामित्व (Ownership) - Col 14</Label>
                    <Select value={formData.ownershipStatus} onValueChange={v => updateField('ownershipStatus', v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Owned">निजी (Owned)</SelectItem>
                        <SelectItem value="Rented">किराया (Rented)</SelectItem>
                        <SelectItem value="Other">अन्य (Other)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>रहने के कमरे (Rooms) - Col 15</Label>
                    <Input type="number" value={formData.dwellingRooms || 1} onChange={e => updateField('dwellingRooms', parseInt(e.target.value))} />
                  </div>
                  <div className="space-y-2">
                    <Label>विवाहित जोड़े (Couples) - Col 16</Label>
                    <Input type="number" value={formData.marriedCouples || 0} onChange={e => updateField('marriedCouples', parseInt(e.target.value))} />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="amenities" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>पेयजल का स्रोत (Water Source) - Col 17</Label>
                    <Input value={formData.drinkingWaterSource || ''} onChange={e => updateField('drinkingWaterSource', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>जल की उपलब्धता (Availability) - Col 18</Label>
                    <Input value={formData.drinkingWaterAvailability || ''} onChange={e => updateField('drinkingWaterAvailability', e.target.value)} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>प्रकाश का स्रोत (Lighting) - Col 19</Label>
                    <Input value={formData.lightingSource || ''} onChange={e => updateField('lightingSource', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>शौचालय की उपलब्धता (Latrine) - Col 20</Label>
                    <Input value={formData.latrineAvailability || ''} onChange={e => updateField('latrineAvailability', e.target.value)} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>शौचालय का प्रकार (Type) - Col 21</Label>
                    <Input value={formData.latrineType || ''} onChange={e => updateField('latrineType', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>गंदे पानी की निकासी (Outlet) - Col 22</Label>
                    <Input value={formData.wasteWaterOutlet || ''} onChange={e => updateField('wasteWaterOutlet', e.target.value)} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>स्नान की सुविधा (Bathing) - Col 23</Label>
                    <Input value={formData.bathingFacility || ''} onChange={e => updateField('bathingFacility', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>रसोई की सुविधा (Kitchen) - Col 24</Label>
                    <Input value={formData.kitchenFacility || ''} onChange={e => updateField('kitchenFacility', e.target.value)} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>खाना पकाने का ईंधन (Fuel) - Col 25</Label>
                  <Select onValueChange={v => updateField('cookingFuel', v)}>
                    <SelectTrigger><SelectValue placeholder="चुनें" /></SelectTrigger>
                    <SelectContent>{FUEL_OPTIONS.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </TabsContent>

              <TabsContent value="assets" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <Label className="block mb-2">संपत्ति (Assets) - Col 26-32</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" checked={formData.hasRadio} onChange={e => updateField('hasRadio', e.target.checked)} />
                        <Label>रेडियो (Radio)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" checked={formData.hasTelevision} onChange={e => updateField('hasTelevision', e.target.checked)} />
                        <Label>टीवी (TV)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" checked={formData.hasLaptop} onChange={e => updateField('hasLaptop', e.target.checked)} />
                        <Label>लैपटॉप (Laptop)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" checked={formData.hasTelephone} onChange={e => updateField('hasTelephone', e.target.checked)} />
                        <Label>मोबाइल (Mobile)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" checked={formData.hasBicycle} onChange={e => updateField('hasBicycle', e.target.checked)} />
                        <Label>साइकिल (Bicycle)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" checked={formData.hasScooter} onChange={e => updateField('hasScooter', e.target.checked)} />
                        <Label>स्कूटर (Scooter)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" checked={formData.hasCar} onChange={e => updateField('hasCar', e.target.checked)} />
                        <Label>कार (Car)</Label>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>आय का मुख्य स्रोत (Income) - Col 33</Label>
                      <Input value={formData.incomeSource || ''} onChange={e => updateField('incomeSource', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>मोबाइल नंबर (Mobile No.) - Col 34</Label>
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
                  मौजूदा रिकॉर्ड मिला। अपडेट हो रहा है...
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>रद्द करें (Cancel)</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                {isUpdate ? 'रिकॉर्ड अपडेट करें (Update)' : 'रिकॉर्ड सहेजें (Save)'}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
