export interface GuideTableData {
  headers: string[];
  rows: {
    col1: string;
    col2: string;
    col3: string;
    col4: string;
    col5?: string;
  }[];
}

export interface GuideAlertData {
  title: string;
  text: string;
  variant?: 'amber' | 'blue' | 'rose' | 'emerald';
}

export interface GuideCardData {
  title: string;
  desc?: string;
  items?: string[];
  variant?: 'slate' | 'blue' | 'emerald' | 'amber' | 'purple' | 'cyan';
}

export interface GuideStepData {
  step: string;
  title: string;
  desc: string;
}

export interface GuideFaqData {
  q: string;
  a: string;
}

export interface PortalGuideData {
  portalId: string;
  section1: {
    title: string;
    icon?: 'shield' | 'heart' | 'receipt' | 'scale' | 'hardhat' | 'globe' | 'briefcase' | 'leaf' | 'trash' | 'building' | 'coins';
    paragraphs: string[];
    bulletPoints?: string[];
    alert?: GuideAlertData;
    table?: GuideTableData;
    subCards?: {
      title: string;
      desc: string;
      variant?: 'blue' | 'emerald' | 'rose';
    }[];
  };
  section2: {
    title: string;
    icon?: 'checklist' | 'clock' | 'activity' | 'globe' | 'search' | 'file' | 'shield';
    cards?: GuideCardData[];
    noticeCards?: {
      title: string;
      desc?: string;
      list?: string[];
      variant?: 'blue' | 'slate' | 'rose' | 'amber';
    }[];
    columns?: 2 | 3;
  };
  section3: {
    title: string;
    icon?: 'clock' | 'spreadsheet' | 'users' | 'truck';
    steps: GuideStepData[];
  };
  section4: {
    title: string;
    icon?: 'help';
    faqs: GuideFaqData[];
  };
  extraSection?: {
    title: string;
    icon?: 'coins';
    cards: GuideCardData[];
  };
}
