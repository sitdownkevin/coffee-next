import type { Item } from "../types/item";
import { ItemType } from "../types/item";
import { useState, useEffect, useRef } from "react";
import { ItemCard } from "./ItemList/ItemCard";
import { ItemTypeLabel } from "./ItemList/ItemTypeLabel";

import {
  Navigation,
  type NavItem,
  itemTypeConfig,
} from "./ItemList/Navigation";

export default function ItemList({
  items,
  itemSelected,
  handleSelect,
}: {
  items: Item[];
  itemSelected: Item | null;
  handleSelect: (item: Item) => void;
}) {
  // Group items by their type for easier rendering and management.
  const groupedItems = items.reduce((acc, item) => {
    (acc[item.type] = acc[item.type] || []).push(item);
    return acc;
  }, {} as Record<ItemType, Item[]>);

  // Determine which item types are present in the data, maintaining enum order.
  const availableItemTypes = Object.values(ItemType).filter(
    (type) => groupedItems[type]?.length > 0
  );

  // Generate navigation items dynamically based on available item types.
  const navItems: NavItem[] = availableItemTypes.map((type) => ({
    id: `${type}-section`,
    label: itemTypeConfig[type].label,
    type: type,
  }));

  const [activeSection, setActiveSection] = useState(
    navItems.length > 0 ? navItems[0].id : ""
  );
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (sectionId: string) => {
    const scrollContainer = scrollContainerRef.current;
    const element = document.getElementById(sectionId);

    if (element && scrollContainer) {
      const elementTop = element.offsetTop;

      requestAnimationFrame(() => {
        scrollContainer.scrollTo({
          top: elementTop - 10,
          behavior: "smooth",
        });
      });

      setActiveSection(sectionId);
    }
  };

  // Effect to update the active section based on scroll position.
  useEffect(() => {
    const sections = navItems.map((item) => item.id);
    if (sections.length === 0) return;

    const handleScroll = () => {
      const scrollContainer = scrollContainerRef.current;
      if (!scrollContainer) return;

      const scrollTop = scrollContainer.scrollTop;

      // Find the section currently in view.
      let currentSection = sections[0];

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const elementTop = element.offsetTop;
          if (scrollTop >= elementTop - 100) {
            currentSection = sectionId;
          }
        }
      }

      setActiveSection(currentSection);
    };

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll, {
        passive: true,
      });
      return () => scrollContainer.removeEventListener("scroll", handleScroll);
    }
  }, [navItems]); // Re-run effect if navItems change.

  
  return (
    <div className="h-full bg-white md:border-r border-gray-200 overflow-hidden flex touch-pan-y">
      {/* Left-side navigation menu */}
      <Navigation
        navItems={navItems}
        scrollToSection={scrollToSection}
        activeSection={activeSection}
      />

      {/* Right-side content area with item list */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto bg-white touch-scroll"
      >
        {availableItemTypes.map((type) => (
          <div key={type}>
            <ItemTypeLabel type={type} id={`${type}-section`} />
            <div className="px-2 pb-4">
              {groupedItems[type].map((item) => (
                <ItemCard
                  key={item.name} // Using item name as key, assuming it's unique
                  item={item}
                  itemSelected={itemSelected}
                  handleSelect={handleSelect}
                />
              ))}
            </div>
          </div>
        ))}

        {/* Bottom padding for safe area */}
        <div className="h-20 md:h-4"></div>
      </div>
    </div>
  );
}
