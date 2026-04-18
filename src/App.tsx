import React, { useState, useEffect } from 'react';
import { ROOMS } from './constants';
import { Room } from './types';
import { StatusBar } from './components/StatusBar';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { Toast } from './components/Toast';

// Pages
import { MapPage } from './pages/MapPage';
import { RoomsPage } from './pages/RoomsPage';
import { DetailPage } from './pages/DetailPage';
import { ChatPage } from './pages/ChatPage';
import { MatcherPage } from './pages/MatcherPage';
import { OwnerPage } from './pages/OwnerPage';
import { ProfilePage } from './pages/ProfilePage';
import { ChecklistPage } from './pages/ChecklistPage';
import { ReceiptsPage } from './pages/ReceiptsPage';
import { AgreementPage } from './pages/AgreementPage';
import { RewardsPage } from './pages/RewardsPage';
import { ScamPage } from './pages/ScamPage';
import { NeighbourhoodPage } from './pages/NeighbourhoodPage';
import { PricingPage } from './pages/PricingPage';
import { AdminPanel } from './pages/AdminPanel';
import { AboutUsPage } from './pages/AboutUsPage';
import { ContactUsPage } from './pages/ContactUsPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [page, setPage] = useState("home");
  const [pageData, setPageData] = useState<any>(null);
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set([4]));
  const [toast, setToast] = useState("");
  const [globalSearch, setGlobalSearch] = useState("");
  const [userRole, setUserRole] = useState<'tenant' | 'owner'>(() => (localStorage.getItem('user_role') as any) || 'tenant');
  const [userPlan, setUserPlan] = useState<'free' | 'standard' | 'premium' | 'broker'>(() => (localStorage.getItem('user_plan') as any) || 'free');
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('is_logged_in') === 'true');
  const [rooms, setRooms] = useState<Room[]>(ROOMS);

  useEffect(() => {
    localStorage.setItem('user_role', userRole);
  }, [userRole]);

  useEffect(() => {
    localStorage.setItem('user_plan', userPlan);
  }, [userPlan]);

  useEffect(() => {
    localStorage.setItem('is_logged_in', isLoggedIn.toString());
  }, [isLoggedIn]);
  
  const [maintenanceRequests, setMaintenanceRequests] = useState<any[]>([
    { id: 1, room: "B-402", issue: "Leaking Tap", priority: "Medium", status: "New", date: "12 Apr", tenantName: "Rahul Kapoor" },
    { id: 2, room: "A-105", issue: "AC Not Cooling", priority: "High", status: "In Progress", date: "10 Apr", tenantName: "Amit Sharma" },
    { id: 3, room: "B-402", issue: "Light Bulb Change", priority: "Low", status: "Resolved", date: "05 Apr", tenantName: "Rahul Kapoor" }
  ]);

  const [requirement, setRequirement] = useState<any>(() => {
    const saved = localStorage.getItem('user_requirement');
    if (saved) {
      const parsed = JSON.parse(saved);
      const expiryDate = new Date(parsed.submittedAt);
      expiryDate.setMonth(expiryDate.getMonth() + 1);
      if (new Date() < expiryDate) return parsed;
      localStorage.removeItem('user_requirement');
    }
    return null;
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paymentStatus = params.get("payment");
    const roomId = params.get("roomId");

    if (paymentStatus === "success") {
      showToast("Payment successful! 🎊");
      if (roomId) {
        const room = rooms.find(r => r.id === Number(roomId));
        if (room) {
          onNav("detail", room);
        }
      }
      // Clear URL params
      window.history.replaceState({}, document.title, "/");
    } else if (paymentStatus === "cancel") {
      showToast("Payment cancelled.");
      if (roomId) {
        const room = rooms.find(r => r.id === Number(roomId));
        if (room) {
          onNav("detail", room);
        }
      }
      window.history.replaceState({}, document.title, "/");
    }
  }, [rooms]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2300);
  };

  const onSave = (id: number) => {
    setSavedIds(prev => {
      const n = new Set(prev);
      if (n.has(id)) {
        n.delete(id);
        showToast("Removed from saved");
      } else {
        n.add(id);
        showToast("Saved to favourites ❤️");
      }
      return n;
    });
  };

  const onNav = (p: string, data: any = null) => {
    setPage(p);
    setPageData(data);
    if (["home", "rooms", "saved", "profile"].includes(p)) {
      setActiveTab(p);
    }
  };

  const onBack = () => {
    const backMap: Record<string, string> = {
      detail: "rooms",
      chat: "rooms",
      matcher: "rooms",
      neighbourhood: "home",
      checklist: "profile",
      receipts: "profile",
      agreement: "profile",
      rewards: "profile",
      scam: "profile",
      pricing: "profile",
      about: "profile",
      contact: "profile",
      privacy: "profile",
      terms: "profile",
      owner: "profile",
      admin: "profile"
    };
    const prev = backMap[page] || "home";
    setPage(prev);
    setActiveTab(prev);
  };

  const isSubPage = ["detail", "chat", "matcher", "neighbourhood", "checklist", "receipts", "agreement", "rewards", "scam", "pricing", "about", "contact", "privacy", "terms", "owner", "admin"].includes(page);

  const renderPage = () => {
    const props = { 
      rooms: rooms, 
      saved: savedIds, 
      onSave, 
      onNav, 
      showToast, 
      onBack,
      search: globalSearch,
      setSearch: setGlobalSearch,
      requirement,
      setRequirement,
      userRole,
      setUserRole,
      userPlan,
      setUserPlan,
      isLoggedIn,
      setIsLoggedIn,
      setRooms,
      maintenanceRequests,
      setMaintenanceRequests
    };
    
    switch (page) {
      case "home": return <MapPage {...props} />;
      case "rooms": return <RoomsPage {...props} />;
      case "saved": return <RoomsPage {...props} rooms={rooms.filter(r => savedIds.has(r.id))} />;
      case "owner": return <OwnerPage {...props} />;
      case "profile": return <ProfilePage {...props} onNav={onNav} />;
      case "admin": return <AdminPanel onBack={onBack} rooms={rooms} />;
      case "detail": return <DetailPage {...props} room={pageData} saved={savedIds.has(pageData?.id)} />;
      case "chat": return <ChatPage {...props} room={pageData} onNav={onNav} />;
      case "matcher": return <MatcherPage {...props} userGender="Male" />;
      case "neighbourhood": return <NeighbourhoodPage onBack={onBack} />;
      case "checklist": return <ChecklistPage onBack={onBack} showToast={showToast} />;
      case "receipts": return <ReceiptsPage onBack={onBack} showToast={showToast} />;
      case "agreement": return <AgreementPage onBack={onBack} showToast={showToast} />;
      case "rewards": return <RewardsPage onBack={onBack} showToast={showToast} />;
      case "scam": return <ScamPage onBack={onBack} showToast={showToast} />;
      case "pricing": return <PricingPage {...props} onBack={onBack} showToast={showToast} />;
      case "about": return <AboutUsPage onBack={onBack} />;
      case "contact": return <ContactUsPage onBack={onBack} showToast={showToast} />;
      case "privacy": return <PrivacyPolicyPage onBack={onBack} />;
      case "terms": return <TermsPage onBack={onBack} />;
      default: return <MapPage {...props} />;
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-slate-200">
      <div className="relative flex h-full w-full max-w-[420px] flex-col overflow-hidden bg-white shadow-2xl md:h-[844px] md:rounded-[40px] md:border-[8px] md:border-slate-900">
        <Toast msg={toast} />
        <StatusBar />
        {!isSubPage && <Header onNav={onNav} search={globalSearch} setSearch={setGlobalSearch} />}
        <div className="flex-1 overflow-hidden">
          {renderPage()}
        </div>
        {!isSubPage && (
          <BottomNav 
            activeTab={activeTab} 
            setActiveTab={(t) => { setActiveTab(t); setPage(t); }} 
            savedCount={savedIds.size} 
          />
        )}
      </div>
    </div>
  );
}
