'use client';

import { useEffect } from 'react';

/**
 * SidebarEnhancer implements non-intrusive scrollbar enhancements:
 * 1. Scroll Position Persistence across refreshes/navigation.
 * 2. Floating Fading Scrollbar Logic (adds classes for CSS to react to).
 */
export function SidebarEnhancer() {
  useEffect(() => {
    const nav = document.querySelector('.admin-sidebar-scroll');
    if (!nav) return;

    // 1. Scroll Position Persistence
    const savedPos = sessionStorage.getItem('vakeel_admin_sidebar_scroll');
    if (savedPos) {
      nav.scrollTop = parseInt(savedPos, 10);
    }

    let timeout: NodeJS.Timeout;
    
    const handleScroll = () => {
      // Save position
      sessionStorage.setItem('vakeel_admin_sidebar_scroll', nav.scrollTop.toString());
      
      // Fading logic state
      nav.classList.add('is-scrolling');
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        nav.classList.remove('is-scrolling');
      }, 1500);
    };

    nav.addEventListener('scroll', handleScroll);
    
    // Show scrollbar on mouse hover
    const handleMouseEnter = () => nav.classList.add('is-hovering');
    const handleMouseLeave = () => nav.classList.remove('is-hovering');
    
    nav.addEventListener('mouseenter', handleMouseEnter);
    nav.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      nav.removeEventListener('scroll', handleScroll);
      nav.removeEventListener('mouseenter', handleMouseEnter);
      nav.removeEventListener('mouseleave', handleMouseLeave);
      clearTimeout(timeout);
    };
  }, []);

  return null;
}
