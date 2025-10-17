'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Save, User, GraduationCap, Users, Heart } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { colleges, getDepartmentsByCollege } from '@/lib/academicData';
import { fellowshipTeams } from '@/lib/fellowshipTeams';
import { SearchableSelect } from '@/components/SearchableSelect';
import type { Member } from '@/types/member';

interface EditMemberDialogProps {
  member: Member | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
}

export function EditMemberDialog({ member, open, onOpenChange, onSave }: EditMemberDialogProps) {
  const [formData, setFormData] = useState<Partial<Member>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (member) {
      setFormData(member);
    }
  }, [member]);

  const availableDepartments = formData.college 
    ? getDepartmentsByCollege(formData.college)
    : [];

  const handleSave = async () => {
    setError('');
    setIsSaving(true);

    try {
      const response = await fetch(`/api/members/${member?._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        onSave();
        onOpenChange(false);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to update member');
      }
    } catch {
      setError('An error occurred while saving');
    } finally {
      setIsSaving(false);
    }
  };

  const updateField = (field: keyof Member, value: string | number) => {
    setFormData(prev => {
      if (field === 'college') {
        return { ...prev, college: value as string, department: '' };
      }
      return { ...prev, [field]: value };
    });
  };

  if (!member) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <User className="w-6 h-6 text-primary" />
            Edit Member: {member.fullName}
          </DialogTitle>
          <DialogDescription>
            Update member information. All changes will be saved immediately.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="personal" className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Personal</span>
            </TabsTrigger>
            <TabsTrigger value="academic" className="flex items-center gap-1">
              <GraduationCap className="w-4 h-4" />
              <span className="hidden sm:inline">Academic</span>
            </TabsTrigger>
            <TabsTrigger value="fellowship" className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Fellowship</span>
            </TabsTrigger>
            <TabsTrigger value="spiritual" className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              <span className="hidden sm:inline">Spiritual</span>
            </TabsTrigger>
          </TabsList>

          {/* Personal Information */}
          <TabsContent value="personal" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Full Name *</Label>
                <Input
                  value={formData.fullName || ''}
                  onChange={(e) => updateField('fullName', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Sex *</Label>
                <Select value={formData.sex} onValueChange={(val) => updateField('sex', val)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Age *</Label>
                <Input
                  type="number"
                  value={formData.age || ''}
                  onChange={(e) => updateField('age', parseInt(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label>Phone Number *</Label>
                <Input
                  value={formData.phoneNumber || ''}
                  onChange={(e) => updateField('phoneNumber', e.target.value)}
                />
              </div>
            </div>
          </TabsContent>

          {/* Academic Details */}
          <TabsContent value="academic" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Student ID *</Label>
                <Input
                  value={formData.studentId || ''}
                  onChange={(e) => updateField('studentId', e.target.value.toUpperCase())}
                  placeholder="WCU/1234/15"
                />
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Must start with <strong>WCU</strong>
                </p>
              </div>
              <div className="space-y-2">
                <Label>Academic Year *</Label>
                <Select value={formData.academicYear} onValueChange={(val) => updateField('academicYear', val)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1st Year">1st Year</SelectItem>
                    <SelectItem value="2nd Year">2nd Year</SelectItem>
                    <SelectItem value="3rd Year">3rd Year</SelectItem>
                    <SelectItem value="4th Year">4th Year</SelectItem>
                    <SelectItem value="5th Year">5th Year</SelectItem>
                    <SelectItem value="6th Year">6th Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>College / Faculty *</Label>
                <Select value={formData.college} onValueChange={(val) => updateField('college', val)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {colleges.map((college) => (
                      <SelectItem key={college} value={college}>
                        {college}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Department *</Label>
                {availableDepartments.length > 0 ? (
                  <SearchableSelect
                    options={availableDepartments}
                    value={formData.department || ''}
                    onValueChange={(val) => updateField('department', val)}
                    placeholder="Select department"
                  />
                ) : (
                  <Input value={formData.department || ''} disabled placeholder="Select college first" />
                )}
              </div>
              <div className="space-y-2">
                <Label>Section *</Label>
                <Input
                  value={formData.section || ''}
                  onChange={(e) => updateField('section', e.target.value)}
                />
              </div>
            </div>
          </TabsContent>

          {/* Fellowship Information */}
          <TabsContent value="fellowship" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Membership Status *</Label>
                <Select value={formData.membershipStatus} onValueChange={(val) => updateField('membershipStatus', val)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="New Member">New Member</SelectItem>
                    <SelectItem value="Existing Member">Existing Member</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Fellowship Team *</Label>
                <Select value={formData.fellowshipTeam} onValueChange={(val) => updateField('fellowshipTeam', val)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fellowshipTeams.map((team) => (
                      <SelectItem key={team} value={team}>
                        {team}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Leadership Role</Label>
                <Input
                  value={formData.leadershipRole || ''}
                  onChange={(e) => updateField('leadershipRole', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Attending Bible Study *</Label>
                <Select value={formData.attendingBibleStudy} onValueChange={(val) => updateField('attendingBibleStudy', val)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Bible Study Role</Label>
                <Select value={formData.bibleStudyRole || ''} onValueChange={(val) => updateField('bibleStudyRole', val)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Coordinator">Coordinator</SelectItem>
                    <SelectItem value="Contact Person">Contact Person</SelectItem>
                    <SelectItem value="Member">Member</SelectItem>
                    <SelectItem value="Not Applicable">Not Applicable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          {/* Spiritual & Personal */}
          <TabsContent value="spiritual" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Born Again *</Label>
                <Select value={formData.bornAgain} onValueChange={(val) => updateField('bornAgain', val)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Church Name *</Label>
                <Input
                  value={formData.churchName || ''}
                  onChange={(e) => updateField('churchName', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Spiritual Gift *</Label>
                <Input
                  value={formData.spiritualGift || ''}
                  onChange={(e) => updateField('spiritualGift', e.target.value)}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Favorite Bible Verse *</Label>
                <Textarea
                  value={formData.favoriteBibleVerse || ''}
                  onChange={(e) => updateField('favoriteBibleVerse', e.target.value)}
                  className="min-h-20"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Prayer Request</Label>
                <Textarea
                  value={formData.prayerRequest || ''}
                  onChange={(e) => updateField('prayerRequest', e.target.value)}
                  className="min-h-24"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex gap-3 justify-end pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="gradient-primary text-white"
          >
            {isSaving ? (
              <>
                <span className="animate-pulse">Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

