import React, { useState, useEffect } from 'react';
import {
  ShieldCheck, Star, User, Briefcase, Code, CheckCircle,
  Clock, ChevronRight, BarChart3, Users, Target, Search,
  Filter, X, AlertCircle, ArrowRight, Check, CheckCircle2
} from 'lucide-react';

// --- Mock Data & Edge Cases ---
const INITIAL_ENGINEERS = [
  {
    id: 'e1',
    name: 'Sarah Chen',
    title: 'Senior Full Stack Engineer',
    bio: 'Passionate about building scalable web applications. 8+ years of experience with React, Node.js, and cloud infrastructure. Previously tech lead at a major fintech startup.',
    techStack: ['React', 'Node.js', 'AWS', 'TypeScript'],
    experience: 8,
    portfolioUrl: 'https://sarahchen.dev',
    type: 'established',
    rating: 4.9,
    reviewCount: 42,
    avatar: 'https://i.pravatar.cc/150?u=e1'
  },
  {
    id: 'e2',
    name: 'David Rodriguez',
    title: 'Frontend Specialist',
    bio: 'Creating pixel-perfect, accessible user interfaces. I focus on performance and seamless UX. Certified Vetted Talent.',
    techStack: ['Vue', 'React', 'Tailwind', 'Figma'],
    experience: 5,
    portfolioUrl: 'https://davidr.design',
    type: 'vetted',
    rating: null,
    reviewCount: 0,
    avatar: 'https://i.pravatar.cc/150?u=e2'
  },
  {
    id: 'e3',
    name: 'Alexei Ivanov',
    title: 'Backend Developer',
    bio: 'Recent computer science graduate looking for first freelance opportunities. Strong fundamentals in algorithms and data structures.',
    techStack: ['Python', 'Django', 'PostgreSQL'],
    experience: 1,
    portfolioUrl: '',
    type: 'standard',
    rating: null,
    reviewCount: 0,
    avatar: 'https://i.pravatar.cc/150?u=e3'
  },
  // Edge Case 1: Extreme String Lengths & Missing Avatar
  {
    id: 'e4',
    name: 'Wolfeschlegelsteinhausenbergerdorff Junior',
    title: 'Senior Principal Cloud Native Microservices Architecture Transformation Specialist',
    bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. This text just keeps going to test the boundaries of our UI containers and ensure that nothing breaks when users input absolute essays into the bio field.',
    techStack: ['Kubernetes', 'Docker', 'Go', 'Rust', 'gRPC', 'Kafka', 'Terraform'],
    experience: 15,
    portfolioUrl: 'https://verylongurlthattestswhatispossible.com/portfolio/v1',
    type: 'vetted',
    rating: null,
    reviewCount: 0,
    avatar: '' // Missing avatar
  },
  // Edge Case 2: Emojis and unusual characters
  {
    id: 'e5',
    name: 'Emma "The Coder" Watson 🚀',
    title: 'Creative Technologist ✨',
    bio: 'Building the future of the web! 🕸️ 💻 | Open Source contributor | ☕ powered | Let\'s build something awesome together! \n\n (✿◠‿◠)',
    techStack: ['Three.js', 'WebGL', 'React Three Fiber'],
    experience: 4,
    portfolioUrl: 'https://emma.space',
    type: 'established',
    rating: 5.0,
    reviewCount: 12,
    avatar: 'https://i.pravatar.cc/150?u=e5'
  }
];

// --- Shared UI Components ---

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyle = "inline-flex items-center justify-center px-4 py-2 text-sm font-medium transition-colors rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    primary: "bg-slate-900 text-white hover:bg-slate-800 focus:ring-slate-900",
    secondary: "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 focus:ring-slate-500",
    vetted: "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 shadow-sm",
    ghost: "text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:ring-slate-500"
  };
  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: "bg-slate-100 text-slate-800 border-slate-200",
    vetted: "bg-indigo-50 text-indigo-700 border-indigo-200 shadow-sm",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200"
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

const Avatar = ({ src, name, size = 'md', className = '' }) => {
  const sizes = { sm: 'h-8 w-8', md: 'h-12 w-12', lg: 'h-16 w-16' };
  const initials = name ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : '?';

  if (src) {
    return <img src={src} alt={name} className={`rounded-full object-cover border border-slate-200 ${sizes[size]} ${className}`} />;
  }
  return (
    <div className={`rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-semibold border border-slate-300 ${sizes[size]} ${className}`}>
      {initials}
    </div>
  );
};

// --- Main Application ---

export default function App() {
  const [currentView, setCurrentView] = useState('marketplace'); // marketplace, onboarding, dashboard
  const [engineers, setEngineers] = useState(INITIAL_ENGINEERS);
  const [bookings, setBookings] = useState([]);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleBook = (engineer, projectDetails) => {
    const newBooking = {
      id: `b${Date.now()}`,
      engineerId: engineer.id,
      engineerType: engineer.type,
      projectDetails,
      date: new Date().toISOString()
    };
    setBookings([...bookings, newBooking]);
    showToast(`Conversion Event: booking_confirmed | Type: ${engineer.type}`, 'success');
    console.log(`[Tracking] Event: booking_confirmed`, newBooking);
  };

  const handleOnboardingComplete = (newEngineer) => {
    setEngineers([newEngineer, ...engineers]);
    setCurrentView('marketplace');
    showToast('Profile created and Vetted status granted!', 'success');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => setCurrentView('marketplace')}>
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-2 shadow-sm">
                  <Code className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-xl tracking-tight text-slate-900">Talent<span className="text-indigo-600">Trust</span></span>
              </div>
              <div className="hidden md:flex space-x-4">
                <button
                  onClick={() => setCurrentView('marketplace')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${currentView === 'marketplace' ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                >
                  Find Talent
                </button>
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${currentView === 'dashboard' ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                >
                  Metrics Dashboard
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="hidden sm:inline-flex" onClick={() => setCurrentView('onboarding')}>
                Apply as Talent
              </Button>
              <Avatar name="Client User" size="sm" className="cursor-pointer" />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'marketplace' && <MarketplaceView engineers={engineers} onBook={handleBook} />}
        {currentView === 'onboarding' && <OnboardingView onComplete={handleOnboardingComplete} />}
        {currentView === 'dashboard' && <DashboardView engineers={engineers} bookings={bookings} />}
      </main>

      {/* Global Toast Notification */}
      {toast && (
        <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className={`rounded-lg shadow-lg border p-4 flex items-start space-x-3 max-w-sm ${toast.type === 'success' ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-800 border-slate-700'}`}>
            {toast.type === 'success' ? <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5" /> : <AlertCircle className="h-5 w-5 text-slate-400 mt-0.5" />}
            <div>
              <p className={`text-sm font-medium ${toast.type === 'success' ? 'text-emerald-900' : 'text-white'}`}>Notification</p>
              <p className={`text-sm mt-1 font-mono text-xs break-all ${toast.type === 'success' ? 'text-emerald-700' : 'text-slate-300'}`}>{toast.message}</p>
            </div>
            <button onClick={() => setToast(null)} className="text-slate-400 hover:text-slate-600 ml-auto">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Views ---

function MarketplaceView({ engineers, onBook }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedEngineer, setSelectedEngineer] = useState(null);

  const filteredEngineers = engineers.filter(eng => {
    const matchesSearch = eng.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          eng.techStack.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          eng.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || eng.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
            placeholder="Search by name, role, or skill..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          <Filter className="h-4 w-4 text-slate-400 hidden md:block mr-1" />
          {['all', 'vetted', 'established', 'standard'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filterType === type
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)} {type === 'vetted' && '🛡️'}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filteredEngineers.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
          <AlertCircle className="mx-auto h-12 w-12 text-slate-300" />
          <h3 className="mt-2 text-sm font-medium text-slate-900">No engineers found</h3>
          <p className="mt-1 text-sm text-slate-500">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEngineers.map(engineer => (
            <EngineerCard
              key={engineer.id}
              engineer={engineer}
              onAction={() => setSelectedEngineer(engineer)}
            />
          ))}
        </div>
      )}

      {/* Booking Modal */}
      {selectedEngineer && (
        <BookingModal
          engineer={selectedEngineer}
          onClose={() => setSelectedEngineer(null)}
          onBook={(details) => {
            onBook(selectedEngineer, details);
            setSelectedEngineer(null);
          }}
        />
      )}
    </div>
  );
}

function EngineerCard({ engineer, onAction }) {
  const isVetted = engineer.type === 'vetted';
  const isEstablished = engineer.type === 'established';

  return (
    <div className={`flex flex-col bg-white rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1 ${
      isVetted ? 'border-2 border-indigo-200 shadow-md ring-1 ring-indigo-50' : 'border border-slate-200 shadow-sm'
    }`}>
      {/* Card Header (Avatar & Title) */}
      <div className="p-6 pb-4 flex items-start space-x-4">
        <div className="relative flex-shrink-0">
          <Avatar src={engineer.avatar} name={engineer.name} size="lg" />
          {isVetted && (
             <div className="absolute -bottom-2 -right-2 bg-indigo-600 rounded-full p-1 border-2 border-white text-white shadow-sm" title="Vetted Talent">
               <ShieldCheck className="h-4 w-4" />
             </div>
          )}
        </div>
        <div className="flex-1 min-w-0"> {/* min-w-0 crucial for text truncation to work inside flex */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 truncate" title={engineer.name}>
              {engineer.name}
            </h3>
          </div>
          <p className="text-sm font-medium text-slate-600 truncate" title={engineer.title}>{engineer.title}</p>

          {/* Trust Signals Area */}
          <div className="mt-2 flex items-center h-5">
            {isEstablished ? (
              <div className="flex items-center text-sm font-medium text-amber-600">
                <Star className="h-4 w-4 fill-current mr-1" />
                {engineer.rating} <span className="text-slate-400 font-normal ml-1">({engineer.reviewCount} reviews)</span>
              </div>
            ) : isVetted ? (
              <Badge variant="vetted" className="bg-indigo-100/50">
                <ShieldCheck className="h-3 w-3 mr-1" /> Vetted Talent
              </Badge>
            ) : (
              <span className="text-xs text-slate-400 italic">New to platform</span>
            )}
          </div>
        </div>
      </div>

      {/* Vetted Guarantee Banner */}
      {isVetted && (
        <div className="mx-6 mb-4 px-3 py-2 bg-gradient-to-r from-indigo-50 to-emerald-50 rounded-lg border border-indigo-100/50 flex items-center">
           <div className="bg-white rounded-full p-1 mr-2 shadow-sm">
             <CheckCircle2 className="h-4 w-4 text-emerald-600" />
           </div>
           <div>
             <p className="text-xs font-bold text-slate-800 leading-tight">100% Satisfaction Guarantee</p>
             <p className="text-[10px] text-slate-600 leading-tight">Risk-free. Full refund or rematch.</p>
           </div>
        </div>
      )}

      {/* Card Body (Bio & Skills) */}
      <div className="px-6 flex-1 flex flex-col">
        <p className="text-sm text-slate-600 line-clamp-3 mb-4 flex-1">
          {engineer.bio || <span className="italic opacity-50">No bio provided.</span>}
        </p>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {engineer.techStack.slice(0, 4).map(tech => (
            <span key={tech} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">
              {tech}
            </span>
          ))}
          {engineer.techStack.length > 4 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-50 text-slate-500 border border-slate-200">
              +{engineer.techStack.length - 4}
            </span>
          )}
        </div>
      </div>

      {/* Card Footer */}
      <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
        <div className="text-sm text-slate-500 flex items-center">
          <Clock className="h-4 w-4 mr-1.5" />
          {engineer.experience} yrs exp
        </div>
        <Button variant={isVetted ? 'vetted' : 'primary'} onClick={onAction}>
          View & Book
        </Button>
      </div>
    </div>
  );
}

function BookingModal({ engineer, onClose, onBook }) {
  const [projectDesc, setProjectDesc] = useState('');
  const isVetted = engineer.type === 'vetted';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-slate-900/75 transition-opacity backdrop-blur-sm" aria-hidden="true" onClick={onClose}></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full border border-slate-200">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">

            {/* Header */}
            <div className="flex justify-between items-start mb-5">
              <div className="flex items-center space-x-3">
                <Avatar src={engineer.avatar} name={engineer.name} size="md" />
                <div>
                  <h3 className="text-lg leading-6 font-bold text-slate-900 truncate max-w-[200px]" id="modal-title">
                    Book {engineer.name.split(' ')[0]}
                  </h3>
                  <p className="text-sm text-slate-500 truncate max-w-[200px]">{engineer.title}</p>
                </div>
              </div>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-500 bg-slate-50 rounded-full p-1">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Vetted Trust Accelerator Section */}
            {isVetted && (
              <div className="mb-6 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-0.5">
                    <ShieldCheck className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-bold text-indigo-900">Vetted Talent Guarantee</h4>
                    <p className="mt-1 text-sm text-indigo-700/80">
                      You are booking a certified expert. If you are not completely satisfied within the first 40 hours, we will refund your deposit and rematch you instantly at no cost.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Form */}
            <div>
              <label htmlFor="project" className="block text-sm font-medium text-slate-700 mb-1">
                Brief Project Description
              </label>
              <textarea
                id="project"
                rows="4"
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-slate-300 rounded-lg p-3 border bg-slate-50"
                placeholder="What do you need help building?"
                value={projectDesc}
                onChange={(e) => setProjectDesc(e.target.value)}
              ></textarea>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="bg-slate-50 px-4 py-4 sm:px-6 sm:flex sm:flex-row-reverse border-t border-slate-200">
            <Button
              variant={isVetted ? 'vetted' : 'primary'}
              className="w-full sm:ml-3 sm:w-auto"
              onClick={() => onBook(projectDesc)}
              disabled={!projectDesc.trim()}
            >
              Confirm Booking
            </Button>
            <Button
              variant="secondary"
              className="mt-3 w-full sm:mt-0 sm:ml-3 sm:w-auto"
              onClick={onClose}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function OnboardingView({ onComplete }) {
  const [step, setStep] = useState(1);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationStatus, setSimulationStatus] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '', title: '', experience: '1', techStack: '', bio: '', portfolioUrl: ''
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const runTrustEngineSimulation = async () => {
    setIsSimulating(true);

    const steps = [
      { msg: 'Connecting to Identity Verification API...', ms: 800 },
      { msg: 'Validating GitHub & Portfolio links...', ms: 1200 },
      { msg: 'Analyzing code repositories for quality...', ms: 1500 },
      { msg: 'Cross-referencing technical claims...', ms: 1000 },
      { msg: 'Finalizing Trust Score...', ms: 600 },
      { msg: 'Approved! Issuing Vetted Badge.', ms: 800 }
    ];

    for (const s of steps) {
      setSimulationStatus(s.msg);
      await new Promise(resolve => setTimeout(resolve, s.ms));
    }

    const newEngineer = {
      id: `new_${Date.now()}`,
      name: formData.name,
      title: formData.title,
      bio: formData.bio,
      techStack: formData.techStack.split(',').map(s => s.trim()).filter(Boolean),
      experience: parseInt(formData.experience),
      portfolioUrl: formData.portfolioUrl,
      type: 'vetted', // The core outcome of this flow
      rating: null,
      reviewCount: 0,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=random`
    };

    onComplete(newEngineer);
  };

  if (isSimulating) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="relative w-24 h-24 mb-8">
          <div className="absolute inset-0 rounded-full border-4 border-slate-200"></div>
          <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
             <ShieldCheck className="h-8 w-8 text-indigo-600 animate-pulse" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Trust Engine Active</h2>
        <p className="text-slate-500 mb-8 max-w-md text-center">We are analyzing your profile to grant you immediate visibility on the marketplace.</p>

        <div className="w-full max-w-md bg-white rounded-lg border border-slate-200 p-4 shadow-sm font-mono text-sm text-slate-700">
           <div className="flex items-center space-x-3 mb-2 opacity-50">
             <Check className="h-4 w-4 text-emerald-500" />
             <span>Profile data submitted.</span>
           </div>
           <div className="flex items-center space-x-3 text-indigo-700 font-semibold bg-indigo-50 -mx-4 px-4 py-2 border-y border-indigo-100">
             <div className="h-2 w-2 bg-indigo-600 rounded-full animate-ping"></div>
             <span>{simulationStatus}</span>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Join TalentTrust</h1>
        <p className="mt-2 text-lg text-slate-600">Skip the cold start. Get vetted and get booked instantly.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Progress Bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          {[1, 2, 3].map((num) => (
            <div key={num} className="flex items-center">
              <div className={`flex items-center justify-center h-8 w-8 rounded-full font-bold text-sm ${
                step >= num ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'
              }`}>
                {step > num ? <Check className="h-4 w-4" /> : num}
              </div>
              {num < 3 && <div className={`h-1 w-16 mx-2 rounded ${step > num ? 'bg-indigo-600' : 'bg-slate-200'}`}></div>}
            </div>
          ))}
          <div className="text-sm font-medium text-slate-500">Step {step} of 3</div>
        </div>

        <div className="p-8">
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <h2 className="text-xl font-bold text-slate-900 border-b pb-2">Basic Info</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full rounded-lg border-slate-300 shadow-sm p-2.5 border bg-slate-50 focus:ring-indigo-500 focus:border-indigo-500" placeholder="Jane Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Professional Title</label>
                  <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full rounded-lg border-slate-300 shadow-sm p-2.5 border bg-slate-50 focus:ring-indigo-500 focus:border-indigo-500" placeholder="e.g. Senior Backend Engineer" />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <h2 className="text-xl font-bold text-slate-900 border-b pb-2">Skills & Experience</h2>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tech Stack (comma separated)</label>
                <input type="text" name="techStack" value={formData.techStack} onChange={handleChange} className="w-full rounded-lg border-slate-300 shadow-sm p-2.5 border bg-slate-50 focus:ring-indigo-500 focus:border-indigo-500" placeholder="React, Node.js, PostgreSQL" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Years of Experience</label>
                <select name="experience" value={formData.experience} onChange={handleChange} className="w-full rounded-lg border-slate-300 shadow-sm p-2.5 border bg-slate-50 focus:ring-indigo-500 focus:border-indigo-500">
                  {[1,2,3,4,5,6,7,8,9,10, '10+'].map(y => <option key={y} value={y}>{y} Years</option>)}
                </select>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div className="flex items-center justify-between border-b pb-2">
                 <h2 className="text-xl font-bold text-slate-900">Proof of Work</h2>
                 <Badge variant="vetted"><ShieldCheck className="h-3 w-3 mr-1"/> Trust Engine Target</Badge>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Portfolio or GitHub URL</label>
                <input type="url" name="portfolioUrl" value={formData.portfolioUrl} onChange={handleChange} className="w-full rounded-lg border-slate-300 shadow-sm p-2.5 border bg-slate-50 focus:ring-indigo-500 focus:border-indigo-500" placeholder="https://github.com/yourusername" />
                <p className="text-xs text-slate-500 mt-1">Our engine will analyze public commits to verify experience.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Bio</label>
                <textarea name="bio" rows="4" value={formData.bio} onChange={handleChange} className="w-full rounded-lg border-slate-300 shadow-sm p-2.5 border bg-slate-50 focus:ring-indigo-500 focus:border-indigo-500" placeholder="Tell clients about your approach to building software..."></textarea>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 px-8 py-4 border-t border-slate-200 flex justify-between items-center">
          <Button variant="ghost" onClick={() => setStep(step - 1)} disabled={step === 1}>
            Back
          </Button>
          {step < 3 ? (
             <Button variant="primary" onClick={() => setStep(step + 1)}>
               Next Step <ArrowRight className="h-4 w-4 ml-2" />
             </Button>
          ) : (
             <Button variant="vetted" onClick={runTrustEngineSimulation} disabled={!formData.name || !formData.portfolioUrl}>
               Submit to Trust Engine
             </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function DashboardView({ engineers, bookings }) {
  // --- Derived Data & Simulated Metrics ---
  const vettedCount = engineers.filter(e => e.type === 'vetted').length;
  const standardCount = engineers.filter(e => e.type === 'standard').length;

  // Real data from app state
  const vettedBookings = bookings.filter(b => b.engineerType === 'vetted').length;
  const standardBookings = bookings.filter(b => b.engineerType === 'standard').length;

  // Simulated Conversion Rates (Storytelling metrics for the prototype)
  const simulatedVettedConversion = 14.5 + (vettedBookings * 0.5); // Base + fake lift
  const simulatedStandardConversion = 1.2 + (standardBookings * 0.1);

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Prototype Impact Metrics</h1>
        <p className="text-slate-500">Live data tracking the performance of the "Trust Accelerator" feature.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Vetted Cohort Volume"
          value={vettedCount}
          subtitle={`${standardCount} unvetted baseline`}
          icon={<Users className="h-5 w-5 text-indigo-600" />}
          trend="+12% WoW"
        />
        <StatCard
          title="Gross Bookings (Test)"
          value={bookings.length}
          subtitle="During prototype session"
          icon={<Briefcase className="h-5 w-5 text-emerald-600" />}
        />
        <StatCard
          title="Vetted Conversion Rate"
          value={`${simulatedVettedConversion.toFixed(1)}%`}
          subtitle="Profile view to Booking"
          icon={<Target className="h-5 w-5 text-blue-600" />}
          trend="+3.2% vs avg"
        />
        <StatCard
          title="Unvetted Conversion"
          value={`${simulatedStandardConversion.toFixed(1)}%`}
          subtitle="Baseline comparison"
          icon={<BarChart3 className="h-5 w-5 text-slate-400" />}
        />
      </div>

      {/* Deep Dive Charts (Simulated UI) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">

        {/* Liquidity Velocity Chart */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
           <h3 className="text-lg font-bold text-slate-900 mb-4">Liquidity Velocity (Avg Time to First Booking)</h3>
           <div className="space-y-6 mt-8">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-semibold text-slate-700 flex items-center"><ShieldCheck className="h-4 w-4 text-indigo-600 mr-1"/> Vetted Talent</span>
                  <span className="font-mono text-slate-500">3.2 Days</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3">
                  <div className="bg-indigo-600 h-3 rounded-full" style={{ width: '15%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-semibold text-slate-700">Standard New Profiles</span>
                  <span className="font-mono text-slate-500">21.5 Days</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3">
                  <div className="bg-slate-400 h-3 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
           </div>
           <div className="mt-8 p-4 bg-emerald-50 rounded-lg border border-emerald-100 text-sm text-emerald-800">
             <strong>Conclusion:</strong> The Vetted badge reduces cold-start latency by ~85%, drastically improving marketplace liquidity.
           </div>
        </div>

        {/* Booking Event Log */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
           <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Conversion Events</h3>
           {bookings.length === 0 ? (
             <div className="flex-1 flex flex-col items-center justify-center text-slate-400 italic">
               No bookings recorded in this session yet.<br/>
               Go to the Marketplace and book an engineer.
             </div>
           ) : (
             <div className="overflow-y-auto max-h-64 pr-2 space-y-3">
               {[...bookings].reverse().map(b => (
                 <div key={b.id} className="text-sm p-3 rounded-lg border border-slate-100 bg-slate-50 flex justify-between items-start">
                   <div>
                     <span className="font-mono text-xs text-slate-400">{new Date(b.date).toLocaleTimeString()}</span>
                     <p className="font-medium text-slate-900 mt-0.5">Booking Confirmed</p>
                     <p className="text-slate-600 text-xs mt-1 truncate max-w-[200px]">Project: {b.projectDetails}</p>
                   </div>
                   <Badge variant={b.engineerType === 'vetted' ? 'vetted' : 'default'} className="uppercase text-[10px]">
                     {b.engineerType}
                   </Badge>
                 </div>
               ))}
             </div>
           )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle, icon, trend }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
          {icon}
        </div>
        {trend && (
          <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
            {trend}
          </span>
        )}
      </div>
      <div>
        <h4 className="text-slate-500 text-sm font-medium">{title}</h4>
        <span className="text-3xl font-bold text-slate-900 tracking-tight block mt-1">{value}</span>
        {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}