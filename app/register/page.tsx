'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { 
  User, GraduationCap, Users, Heart, 
  ChevronRight, ChevronLeft, Check, 
  Sparkles, AlertCircle 
} from 'lucide-react';
import { colleges, getDepartmentsByCollege } from '@/lib/academicData';
import { SearchableSelect } from '@/components/SearchableSelect';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface FormData {
  // Personal Information
  fullName: string;
  sex: string;
  age: string;
  phoneNumber: string;
  
  // Academic Details
  studentId: string;
  college: string;
  department: string;
  section: string;
  academicYear: string;
  
  // Fellowship Information
  membershipStatus: string;
  fellowshipTeam: string;
  leadershipRole: string;
  attendingBibleStudy: string;
  bibleStudyRole: string;
  
  // Spiritual / Personal Section
  bornAgain: string;
  churchName: string;
  spiritualGift: string;
  favoriteBibleVerse: string;
  prayerRequest: string;
}

const steps = [
  { id: 1, title: 'Personal Information', icon: User, description: 'Tell us about yourself' },
  { id: 2, title: 'Academic Details', icon: GraduationCap, description: 'Your academic information' },
  { id: 3, title: 'Fellowship Information', icon: Users, description: 'Your fellowship journey' },
  { id: 4, title: 'Spiritual & Personal', icon: Heart, description: 'Your faith walk' },
  { id: 5, title: 'Review & Submit', icon: Check, description: 'Confirm your information' }
];

export default function RegisterPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [registrationOpen, setRegistrationOpen] = useState(true);
  
  const [formData, setFormData] = useState<FormData>({
    fullName: '', sex: '', age: '', phoneNumber: '',
    studentId: '', college: '', department: '', section: '', academicYear: '',
    membershipStatus: '', fellowshipTeam: '', leadershipRole: '', attendingBibleStudy: '', bibleStudyRole: '',
    bornAgain: '', churchName: '', spiritualGift: '', favoriteBibleVerse: '', prayerRequest: ''
  });

  useEffect(() => {
    // Check if registration is open
    fetch('/api/registration-status')
      .then(res => res.json())
      .then(data => setRegistrationOpen(data.isOpen))
      .catch(console.error);
  }, []);

  const validateStep = (step: number): boolean => {
    setError('');
    
    switch(step) {
      case 1:
        if (!formData.fullName || !formData.sex || !formData.age || !formData.phoneNumber) {
          setError('Please fill all required fields in Personal Information');
          return false;
        }
        if (parseInt(formData.age) < 15 || parseInt(formData.age) > 100) {
          setError('Please enter a valid age');
          return false;
        }
        if (!/^[\d\s+()-]+$/.test(formData.phoneNumber)) {
          setError('Please enter a valid phone number');
          return false;
        }
        break;
        case 2:
        if (!formData.studentId || !formData.college || !formData.department || 
            !formData.section || !formData.academicYear) {
          setError('Please fill all required fields in Academic Details');
          return false;
        }
        if (!formData.studentId.toUpperCase().startsWith('WCU')) {
          setError('Student ID must start with WCU (e.g., WCU/1234/15)');
          return false;
        }
        break;
      case 3:
        if (!formData.membershipStatus || !formData.fellowshipTeam || !formData.attendingBibleStudy) {
          setError('Please fill all required fields in Fellowship Information');
          return false;
        }
        break;
      case 4:
        if (!formData.bornAgain || !formData.churchName || !formData.spiritualGift || 
            !formData.favoriteBibleVerse) {
          setError('Please fill all required fields in Spiritual & Personal Section');
          return false;
        }
        break;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
    }
  };

  const handlePrev = () => {
    setError('');
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const response = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSuccess(true);
        setTimeout(() => router.push('/'), 3000);
      } else {
        setError(data.error || 'Registration failed. Please try again.');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => {
      // If college changes, reset department
      if (field === 'college') {
        return { ...prev, [field]: value, department: '' };
      }
      return { ...prev, [field]: value };
    });
  };

  // Get available departments based on selected college
  const availableDepartments = formData.college 
    ? getDepartmentsByCollege(formData.college)
    : [];

  const progress = (currentStep / 5) * 100;

  if (!registrationOpen) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 gradient-spiritual">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-secondary" />
            <CardTitle>Registration Closed</CardTitle>
            <CardDescription>
              Registration is currently closed. Please check back later or contact the administrators.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/')} className="w-full gradient-primary text-white">
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 gradient-spiritual">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <Card className="max-w-md w-full">
            <CardHeader className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: 360 }}
                transition={{ duration: 0.8 }}
                className="w-24 h-24 mx-auto mb-4 rounded-full gradient-primary flex items-center justify-center"
              >
                <Check className="w-12 h-12 text-white" />
              </motion.div>
              <CardTitle className="text-2xl">Registration Successful!</CardTitle>
              <CardDescription>
                Welcome to the Wachamo Fellowship family! May God bless your journey with us.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground italic">
                &ldquo;I can do all things through Christ who strengthens me.&rdquo; - Philippians 4:13
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-orange-50 to-blue-50 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <img 
              src="/logo.png" 
              alt="Wachamo Fellowship Logo" 
              className="w-12 h-12 object-contain"
            />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Fellowship Registration
            </h1>
          </div>
          <p className="text-muted-foreground">Join the Wachamo University Fellowship BSC Team</p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-8"
        >
          <Progress value={progress} className="h-3 mb-4" />
          <div className="grid grid-cols-5 gap-2">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`flex flex-col items-center ${
                  currentStep >= step.id ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all ${
                  currentStep >= step.id 
                    ? 'bg-gradient-to-r from-primary to-secondary text-white scale-110' 
                    : 'bg-gray-200'
                }`}>
                  {currentStep > step.id ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                <span className="text-xs font-medium text-center hidden md:block">{step.title}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Form Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="shadow-2xl border-2 border-primary/20">
              <CardHeader className="gradient-spiritual text-white">
                <div className="flex items-center gap-3">
                  {steps[currentStep - 1] && (
                    <>
                      <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        {(() => {
                          const StepIcon = steps[currentStep - 1].icon;
                          return <StepIcon className="w-6 h-6" />;
                        })()}
                      </div>
                      <div>
                        <CardTitle className="text-2xl">{steps[currentStep - 1].title}</CardTitle>
                        <CardDescription className="text-white/80">
                          {steps[currentStep - 1].description}
                        </CardDescription>
                      </div>
                    </>
                  )}
                </div>
              </CardHeader>

              <CardContent className="pt-6 space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Step 1: Personal Information */}
                {currentStep === 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <div className="space-y-3">
                      <Label htmlFor="fullName" className="text-base font-bold flex items-center gap-2 text-gray-800">
                        <User className="w-5 h-5 text-primary" /> Full Name *
                      </Label>
                      <Input
                        id="fullName"
                        placeholder="e.g., Dagmawi Lencho"
                        value={formData.fullName}
                        onChange={(e) => updateFormData('fullName', e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label htmlFor="sex" className="text-base font-bold text-gray-800">Sex *</Label>
                        <Select value={formData.sex} onValueChange={(val) => updateFormData('sex', val)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select sex" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="age" className="text-base font-bold text-gray-800">Age *</Label>
                        <Input
                          id="age"
                          type="number"
                          placeholder="Your age"
                          value={formData.age}
                          onChange={(e) => updateFormData('age', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="phoneNumber" className="text-base font-bold text-gray-800">Phone Number *</Label>
                      <Input
                        id="phoneNumber"
                        placeholder="e.g., 0909090909"
                        value={formData.phoneNumber}
                        onChange={(e) => updateFormData('phoneNumber', e.target.value)}
                      />
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Academic Details */}
                {currentStep === 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <div className="space-y-3">
                      <Label htmlFor="studentId" className="text-base font-bold flex items-center gap-2 text-gray-800">
                        <GraduationCap className="w-5 h-5 text-primary" /> Student ID *
                      </Label>
                      <Input
                        id="studentId"
                        placeholder="e.g., WCU174538"
                        value={formData.studentId}
                        onChange={(e) => updateFormData('studentId', e.target.value.toUpperCase())}
                        className={!formData.studentId.startsWith('WCU') && formData.studentId ? 'border-orange-500/50' : ''}
                      />
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Student ID must start with <strong className="text-primary">WCU</strong>
                      </p>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="college" className="text-base font-bold text-gray-800">College / Faculty *</Label>
                      <Select 
                        value={formData.college} 
                        onValueChange={(val) => updateFormData('college', val)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select your college" />
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

                    <div className="space-y-3">
                      <Label htmlFor="department" className="text-base font-bold text-gray-800">Department / Program *</Label>
                      {!formData.college ? (
                        <div className="h-14 rounded-2xl border border-white/40 bg-gray-50/70 backdrop-blur-xl px-5 py-4 flex items-center text-sm text-gray-400 font-light">
                          Please select a college first
                        </div>
                      ) : (
                        <SearchableSelect
                          options={availableDepartments}
                          value={formData.department}
                          onValueChange={(val) => updateFormData('department', val)}
                          placeholder="Select your department"
                          searchPlaceholder="Search departments..."
                          emptyMessage="No departments found"
                        />
                      )}
                      {formData.college && availableDepartments.length > 0 && (
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          {availableDepartments.length} programs available in {formData.college}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label htmlFor="section" className="text-base font-bold text-gray-800">Section *</Label>
                        <Input
                          id="section"
                          placeholder="e.g., A, B, C"
                          value={formData.section}
                          onChange={(e) => updateFormData('section', e.target.value)}
                        />
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="academicYear" className="text-base font-bold text-gray-800">Academic Year *</Label>
                        <Select 
                          value={formData.academicYear} 
                          onValueChange={(val) => updateFormData('academicYear', val)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select year" />
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
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Fellowship Information */}
                {currentStep === 3 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <div className="space-y-3">
                      <Label className="text-base font-bold text-gray-800 flex items-center gap-2">
                        <Users className="w-5 h-5 text-primary" /> Membership Status *
                      </Label>
                      <Select 
                        value={formData.membershipStatus} 
                        onValueChange={(val) => updateFormData('membershipStatus', val)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select membership status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="New Member">New Member</SelectItem>
                          <SelectItem value="Existing Member">Existing Member</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="fellowshipTeam" className="text-base font-bold text-gray-800">Fellowship Team *</Label>
                      <Input
                        id="fellowshipTeam"
                        placeholder="e.g., Worship Team, Evangelism Team"
                        value={formData.fellowshipTeam}
                        onChange={(e) => updateFormData('fellowshipTeam', e.target.value)}
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="leadershipRole" className="text-base font-bold text-gray-800">
                        Leadership Role <span className="text-muted-foreground">(if any)</span>
                      </Label>
                      <Input
                        id="leadershipRole"
                        placeholder="e.g., Team Leader, Assistant"
                        value={formData.leadershipRole}
                        onChange={(e) => updateFormData('leadershipRole', e.target.value)}
                      />
                    </div>

                    <div className="space-y-3">
                      <Label className="text-base font-bold text-gray-800">Are you attending a class Bible Study? *</Label>
                      <Select 
                        value={formData.attendingBibleStudy} 
                        onValueChange={(val) => updateFormData('attendingBibleStudy', val)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Yes">Yes</SelectItem>
                          <SelectItem value="No">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="bibleStudyRole" className="text-base font-bold text-gray-800">
                        Your Bible Study Role
                      </Label>
                      <Select 
                        value={formData.bibleStudyRole} 
                        onValueChange={(val) => updateFormData('bibleStudyRole', val)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Coordinator">Coordinator</SelectItem>
                          <SelectItem value="Contact Person">Contact Person</SelectItem>
                          <SelectItem value="Member">Member</SelectItem>
                          <SelectItem value="Not Applicable">Not Applicable</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Spiritual & Personal */}
                {currentStep === 4 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <div className="space-y-3">
                      <Label className="text-base font-bold text-gray-800 flex items-center gap-2">
                        <Heart className="w-5 h-5 text-primary" /> Born Again *
                      </Label>
                      <Select 
                        value={formData.bornAgain} 
                        onValueChange={(val) => updateFormData('bornAgain', val)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Yes">Yes</SelectItem>
                          <SelectItem value="No">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="churchName" className="text-base font-bold text-gray-800">Church Name *</Label>
                      <Input
                        id="churchName"
                        placeholder="Enter your church name"
                        value={formData.churchName}
                        onChange={(e) => updateFormData('churchName', e.target.value)}
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="spiritualGift" className="text-base font-bold text-gray-800">Spiritual Gift / Talent *</Label>
                      <Input
                        id="spiritualGift"
                        placeholder="e.g., Teaching, Singing, Leadership"
                        value={formData.spiritualGift}
                        onChange={(e) => updateFormData('spiritualGift', e.target.value)}
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="favoriteBibleVerse" className="text-base font-bold text-gray-800">Favorite Bible Verse *</Label>
                      <Textarea
                        id="favoriteBibleVerse"
                        placeholder="e.g., John 3:16 - For God so loved the world..."
                        value={formData.favoriteBibleVerse}
                        onChange={(e) => updateFormData('favoriteBibleVerse', e.target.value)}
                        className="border-2 focus:border-primary min-h-20"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="prayerRequest" className="text-base font-bold text-gray-800">
                        Prayer Request <span className="text-muted-foreground">(Optional)</span>
                      </Label>
                      <Textarea
                        id="prayerRequest"
                        placeholder="Share your prayer requests with us..."
                        value={formData.prayerRequest}
                        onChange={(e) => updateFormData('prayerRequest', e.target.value)}
                        className="min-h-24"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Step 5: Review & Submit */}
                {currentStep === 5 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    {/* Personal Information Summary */}
                    <div className="bg-gradient-to-r from-primary/10 to-secondary/10 backdrop-blur-xl rounded-2xl p-6 border border-primary/20">
                      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <User className="w-5 h-5 text-primary" />
                        Personal Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Full Name</p>
                          <p className="font-semibold text-gray-900">{formData.fullName}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Sex</p>
                          <p className="font-semibold text-gray-900">{formData.sex}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Age</p>
                          <p className="font-semibold text-gray-900">{formData.age} years</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Phone Number</p>
                          <p className="font-semibold text-gray-900">{formData.phoneNumber}</p>
                        </div>
                      </div>
                    </div>

                    {/* Academic Details Summary */}
                    <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-xl rounded-2xl p-6 border border-blue-200/40">
                      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-primary" />
                        Academic Details
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Student ID</p>
                          <p className="font-semibold text-primary">{formData.studentId}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Academic Year</p>
                          <p className="font-semibold text-gray-900">{formData.academicYear}</p>
                        </div>
                        <div className="md:col-span-2">
                          <p className="text-xs text-gray-500 uppercase tracking-wide">College / Faculty</p>
                          <p className="font-semibold text-gray-900">{formData.college}</p>
                        </div>
                        <div className="md:col-span-2">
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Department</p>
                          <p className="font-semibold text-gray-900">{formData.department}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Section</p>
                          <p className="font-semibold text-gray-900">{formData.section}</p>
                        </div>
                      </div>
                    </div>

                    {/* Fellowship Information Summary */}
                    <div className="bg-gradient-to-r from-orange-50/80 to-yellow-50/80 backdrop-blur-xl rounded-2xl p-6 border border-orange-200/40">
                      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Users className="w-5 h-5 text-secondary" />
                        Fellowship Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Membership Status</p>
                          <Badge className="gradient-secondary text-white mt-1">{formData.membershipStatus}</Badge>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Fellowship Team</p>
                          <p className="font-semibold text-gray-900">{formData.fellowshipTeam}</p>
                        </div>
                        {formData.leadershipRole && (
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide">Leadership Role</p>
                            <p className="font-semibold text-gray-900">{formData.leadershipRole}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Bible Study</p>
                          <p className="font-semibold text-gray-900">{formData.attendingBibleStudy}</p>
                        </div>
                        {formData.bibleStudyRole && (
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide">Bible Study Role</p>
                            <p className="font-semibold text-gray-900">{formData.bibleStudyRole}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Spiritual & Personal Summary */}
                    <div className="bg-gradient-to-r from-purple-50/80 to-pink-50/80 backdrop-blur-xl rounded-2xl p-6 border border-purple-200/40">
                      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Heart className="w-5 h-5 text-purple-600" />
                        Spiritual & Personal
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Born Again</p>
                          <p className="font-semibold text-gray-900">{formData.bornAgain}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Church Name</p>
                          <p className="font-semibold text-gray-900">{formData.churchName}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Spiritual Gift</p>
                          <p className="font-semibold text-gray-900">{formData.spiritualGift}</p>
                        </div>
                        <div className="md:col-span-2">
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Favorite Bible Verse</p>
                          <p className="font-medium text-gray-900 italic bg-white/50 p-3 rounded-lg border border-primary/10">
                            &ldquo;{formData.favoriteBibleVerse}&rdquo;
                          </p>
                        </div>
                        {formData.prayerRequest && (
                          <div className="md:col-span-2">
                            <p className="text-xs text-gray-500 uppercase tracking-wide">Prayer Request</p>
                            <p className="font-medium text-gray-900 bg-white/50 p-3 rounded-lg border border-primary/10">
                              {formData.prayerRequest}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Confirmation Message */}
                    <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-primary/20 text-center">
                      <Sparkles className="w-12 h-12 mx-auto mb-3 text-primary" />
                      <h4 className="text-lg font-bold text-gray-800 mb-2">
                        Ready to Submit?
                      </h4>
                      <p className="text-sm text-gray-600">
                        Please review all your information above. Once submitted, you&apos;ll be part of the Wachamo Fellowship family!
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Navigation Buttons */}
                <div className="flex gap-4 pt-6 border-t">
                  {currentStep > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handlePrev}
                      className="flex-1 border-2"
                    >
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      Previous
                    </Button>
                  )}
                  
                  {currentStep < 5 ? (
                    <Button
                      type="button"
                      onClick={handleNext}
                      className="flex-1 gradient-primary text-white"
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="flex-1 gradient-secondary text-white font-bold text-lg h-14"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="animate-pulse">Submitting...</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-5 h-5 mr-2" />
                          Confirm & Submit Registration
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Back to Home */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8"
        >
          <Button
            variant="ghost"
            onClick={() => router.push('/')}
            className="text-muted-foreground hover:text-primary"
          >
            ← Back to Home
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

