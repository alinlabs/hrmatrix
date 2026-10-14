import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function isPresensiRoute(pathname: string, search: string): boolean {
  if (pathname.includes('/my-presensi')) return true;
  const params = new URLSearchParams(search);
  if (pathname.startsWith('/employees') && (params.has('code') || params.has('qr'))) return true;
  if (params.has('code') || params.has('qr')) return true;
  return false;
}

export const PWAManifestManager: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    const isPresensi = isPresensiRoute(location.pathname, location.search);

    const manifestLink = (document.getElementById('link-manifest') ||
      document.querySelector('link[rel="manifest"]')) as HTMLLinkElement | null;
    const appleIconLink = (document.getElementById('link-apple-touch-icon') ||
      document.querySelector('link[rel="apple-touch-icon"]')) as HTMLLinkElement | null;
    const faviconLink = (document.getElementById('link-favicon') ||
      document.querySelector('link[rel="icon"][type*="svg"]')) as HTMLLinkElement | null;
    const faviconPngLink = (document.getElementById('link-favicon-png') ||
      document.querySelector('link[rel="icon"][sizes="192x192"]')) as HTMLLinkElement | null;
    const appleTitleMeta = (document.getElementById('meta-apple-title') ||
      document.querySelector('meta[name="apple-mobile-web-app-title"]')) as HTMLMetaElement | null;
    const appNameMeta = (document.getElementById('meta-app-name') ||
      document.querySelector('meta[name="application-name"]')) as HTMLMetaElement | null;
    const themeColorMeta = (document.getElementById('meta-theme-color') ||
      document.querySelector('meta[name="theme-color"]')) as HTMLMetaElement | null;

    if (isPresensi) {
      // Halaman My Presensi: Menggunakan Logo 3 Orang, Judul "My Presensi", dan link langsung ke halaman aktif
      const activeStartUrl =
        location.pathname.startsWith('/my-presensi') || location.pathname.startsWith('/employees')
          ? `${location.pathname}${location.search}`
          : `/my-presensi${location.search}`;

      const targetManifestHref = `/manifest-presensi.json?start_url=${encodeURIComponent(activeStartUrl)}`;

      if (manifestLink && manifestLink.getAttribute('href') !== targetManifestHref) {
        manifestLink.setAttribute('href', targetManifestHref);
      }
      if (appleIconLink) {
        appleIconLink.setAttribute('href', '/gambar/pwa-presensi-512x512.png');
      }
      if (faviconLink) {
        faviconLink.setAttribute('href', '/icon-3people.svg');
      }
      if (faviconPngLink) {
        faviconPngLink.setAttribute('href', '/gambar/pwa-presensi-512x512.png');
      }
      if (appleTitleMeta) {
        appleTitleMeta.setAttribute('content', 'My Presensi');
      }
      if (appNameMeta) {
        appNameMeta.setAttribute('content', 'My Presensi');
      }
      if (themeColorMeta) {
        themeColorMeta.setAttribute('content', '#1E40AF');
      }
    } else {
      // Halaman selain My Presensi: Menggunakan Logo H, Judul "HRMatrix", dan start_url "/"
      const defaultManifestHref = '/manifest.json';

      if (manifestLink && manifestLink.getAttribute('href') !== defaultManifestHref) {
        manifestLink.setAttribute('href', defaultManifestHref);
      }
      if (appleIconLink) {
        appleIconLink.setAttribute('href', '/gambar/pwa-maskable-512x512.png');
      }
      if (faviconLink) {
        faviconLink.setAttribute('href', '/icon.svg');
      }
      if (faviconPngLink) {
        faviconPngLink.setAttribute('href', '/gambar/pwa-maskable-512x512.png');
      }
      if (appleTitleMeta) {
        appleTitleMeta.setAttribute('content', 'HRMatrix');
      }
      if (appNameMeta) {
        appNameMeta.setAttribute('content', 'HRMatrix');
      }
      if (themeColorMeta) {
        themeColorMeta.setAttribute('content', '#ffffff');
      }
    }
  }, [location.pathname, location.search]);

  return null;
};
