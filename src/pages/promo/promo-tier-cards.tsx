import React, { useState } from 'react';
import { BillingMode, CompanySizeTier } from './types';
import { PRICING_DATA } from './utils-helper';
import { CardTierItem } from './card-tier-item';
import { PromoTierDetailModal } from './promo-tier-detail-modal';

interface PromoTierCardsProps {
  billingMode: BillingMode;
  selectedTier: CompanySizeTier;
  onSelectTier: (tier: CompanySizeTier) => void;
  onClaimPromo: (tier: CompanySizeTier) => void;
}

export function PromoTierCards({
  billingMode,
  selectedTier,
  onSelectTier,
  onClaimPromo
}: PromoTierCardsProps) {
  const [detailModalTier, setDetailModalTier] = useState<CompanySizeTier | null>(null);
  const tiers: CompanySizeTier[] = ['startup', 'growth', 'enterprise'];

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
        {tiers.map((tierKey) => (
          <CardTierItem
            key={tierKey}
            tierKey={tierKey}
            tierData={PRICING_DATA[tierKey]}
            isSelected={selectedTier === tierKey}
            billingMode={billingMode}
            onSelectTier={() => onSelectTier(tierKey)}
            onClaimPromo={() => {
              onSelectTier(tierKey);
              setDetailModalTier(tierKey);
            }}
            onOpenDetails={() => setDetailModalTier(tierKey)}
          />
        ))}
      </div>

      {/* Modal Dialog Detail Paket: Fasilitas hingga Layanan & Bantuan */}
      <PromoTierDetailModal
        isOpen={detailModalTier !== null}
        onClose={() => setDetailModalTier(null)}
        tierKey={detailModalTier}
        billingMode={billingMode}
        onClaimPromo={onClaimPromo}
      />
    </>
  );
}

export default PromoTierCards;
