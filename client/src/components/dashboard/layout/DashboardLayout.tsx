import type { ReactNode } from "react";

import DashboardHeader from "./DashboardHeader";
import DashboardSidebar, {
  type DashboardNavItem,
} from "./DashboardSidebar";

type DashboardLayoutProps = {
  children: ReactNode;
  navigation: DashboardNavItem[];
  activeSection: string;
  title: string;
  onOpenMobileMenu: () => void;
};

export default function DashboardLayout({
  children,
  navigation,
  activeSection,
  title,
  onOpenMobileMenu,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-[#f7f8f5] text-[#111713]">
      <div className="hidden lg:block">
        <DashboardSidebar
          navigation={navigation}
          activeSection={activeSection}
        />
      </div>

      <div className="lg:pl-[238px]">
        <DashboardHeader
          section={activeSection}
          title={title}
          onOpenMobileMenu={onOpenMobileMenu}
        />

        <main className="min-h-[calc(100vh-68px)] p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}