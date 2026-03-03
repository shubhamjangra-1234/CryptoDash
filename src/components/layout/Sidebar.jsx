import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { NAVIGATION_ITEMS } from '@/constants/navigation';
import { Logo, LogoIcon } from '@/components/ui/Logo';
import {
  LayoutDashboard,
  Coins,
  Briefcase,
  Settings,
  ChevronLeft,
  ChevronRight,
  Store,
  Tags,
  ArrowLeftRight
} from 'lucide-react';

const iconMap = {
  Dashboard: LayoutDashboard,
  Markets: Store,
  Categories: Tags,
  Exchanges: ArrowLeftRight,
  Portfolio: Briefcase,
  Settings: Settings,
};

const Sidebar = ({ isCollapsed, onToggle, isMobileOpen, onMobileToggle }) => {
  const location = useLocation();

  return (
    <>
      {/* Mobile/Tablet Sidebar - Overlay */}
      <div className={cn(
        "fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300",
        isMobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      )} onClick={onMobileToggle} />
      
      {/* Sidebar */}
      <div className={cn(
        "fixed lg:relative flex flex-col h-full bg-sidebar border-r border-sidebar-border transition-all duration-300 z-50 lg:z-auto",
        // Mobile/Tablet - Hidden by default, show as overlay when open
        "lg:flex lg:translate-x-0",
        isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        // Desktop sizing
        isCollapsed ? "lg:w-16" : "lg:w-64",
        // Mobile/Tablet sizing - always full width when open
        "w-64"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          {!isCollapsed ? (
            <Logo size="md" />
          ) : (
            <LogoIcon size="sm" />
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onMobileToggle}
            className="lg:hidden text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <Separator className="bg-sidebar-border" />

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {NAVIGATION_ITEMS.map((item) => {
            const Icon = iconMap[item.icon];
            const isActive = location.pathname === item.href;

            return (
              <Tooltip key={item.id} delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button
                    asChild
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
                      isCollapsed && "justify-center"
                    )}
                  >
                    <Link to={item.href} onClick={() => {
                      // Close mobile menu after navigation
                      if (window.innerWidth < 1024) {
                        onMobileToggle();
                      }
                    }}>
                      <Icon className="h-4 w-4 text-zinc-200" />
                      {!isCollapsed && (
                        <>
                          <span className="ml-2 text-zinc-200">{item.label}</span>
                          {item.id === 'coins' && (
                            <Badge variant="secondary" className="ml-auto">
                              New
                            </Badge>
                          )}
                        </>
                      )}
                    </Link>
                  </Button>
                </TooltipTrigger>
                {isCollapsed && (
                  <TooltipContent side="right">
                    <p>{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4">
          <Separator className="bg-sidebar-border mb-4" />
          {!isCollapsed && (
            <div className="text-xs text-zinc-200">
              {new Date().getFullYear()} CryptoDash
            </div>
          )}
        </div>

        {/* Desktop Toggle Button - Inside Sidebar */}
        <div
          onClick={onToggle}
          className={cn(
            "absolute top-6 w-8 h-8 transition-all duration-300 z-10 cursor-pointer flex items-center justify-center",
            "hidden lg:block",
            isCollapsed ? "left-[66px]" : "left-[258px]"
          )}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
