export type Language = 'ar' | 'en';

export const translations = {
  ar: {
    nav: {
      home: 'الرئيسية',
      about: 'من نحن',
      services: 'خدماتنا',
      store: 'المتجر',
      projects: 'أعمالنا',
      whyUs: 'لماذا نحن',
      blog: 'المدونة',
      contact: 'تواصل معنا',
    },
    hero: {
      tagline: 'كهرباء معمولة صح… من أول مرة',
      subtitle: 'تنفيذ هندسي معتمد | بدون تنازلات | ضمان سنة كاملة',
      cta: 'اطلب معاينة هندسية',
      ctaSecondary: 'تواصل معنا',
    },
    about: {
      title: 'من نحن',
      content: `أسس كهربا شركة متخصصة في الأعمال الكهربائية الاحترافية، بخبرة عملية منذ عام 2012 في التأسيس، التشطيب، التيار الخفيف، والأنظمة الذكية.

نحن نؤمن أن الكهرباء علم هندسي وليس اجتهادًا، لذلك نعتمد فقط على حلول مدروسة، خامات معتمدة، وتنفيذ تحت إشراف هندسي مباشر، مع التزام كامل بالكود المصري والمعايير الدولية.

هدفنا هو بناء بنية كهربائية آمنة، مستقرة، وقابلة للاعتماد عليها لسنوات طويلة بدون مشاكل.`,
      experience: 'سنوات الخبرة',
      experienceValue: '+12',
    },
    services: {
      title: 'خدماتنا',
      items: [
        {
          title: 'تأسيس وتشطيب الأعمال الكهربائية',
          description: 'تأسيس وتشطيب الأعمال الكهربائية الكاملة للوحدات السكنية والفيلات',
        },
        {
          title: 'لوحات التوزيع',
          description: 'لوحات توزيع رئيسية وفرعية بأعلى معايير الجودة والأمان',
        },
        {
          title: 'حساب الأحمال والحمايات',
          description: 'فصل الدوائر وحساب الأحمال والحمايات بدقة هندسية',
        },
        {
          title: 'أنظمة التيار الخفيف',
          description: 'تأسيس أنظمة التيار الخفيف (إنترنت – كاميرات – إنتركم – أنظمة صوت)',
        },
        {
          title: 'أنظمة Smart Home',
          description: 'أنظمة السمارت هوم (تأسيس – تركيب – تشغيل)',
        },
        {
          title: 'اختبارات وتقارير',
          description: 'اختبارات ما قبل التسليم وتقارير فنية كاملة',
        },
        {
          title: 'أنظمة التأريض',
          description: 'تأسيس وتركيب أنظمة التأريض للحماية من الصواعق والتسريب الكهربائي',
        },
      ],
    },
    store: {
      title: 'المتجر',
      subtitle: 'منتجات كهربائية معتمدة وأدوات احترافية',
      description: 'اكتشف مجموعتنا من المنتجات الكهربائية المعتمدة والأدوات الاحترافية لجميع احتياجاتك الكهربائية',
      viewAll: 'عرض جميع المنتجات',
      categories: [
        {
          title: 'أدوات كهربائية',
          description: 'أدوات احترافية للعمل الكهربائي',
        },
        {
          title: 'قطع غيار',
          description: 'قطع غيار معتمدة ومطابقة للمواصفات',
        },
        {
          title: 'أجهزة أمان',
          description: 'أجهزة الحماية والأمان الكهربائي',
        },
        {
          title: 'إضاءة',
          description: 'أنظمة إضاءة حديثة وفعالة',
        },
      ],
    },
    projects: {
      title: 'أعمالنا',
      description: 'نفذنا أعمال كهرباء متنوعة لوحدات سكنية، فيلات، بدرومات، ومشروعات خاصة، مع اختلاف متطلبات كل مشروع، ولكن بثابت واحد: تنفيذ هندسي سليم بدون تنازل عن الجودة أو الأمان.',
      viewAll: 'عرض جميع الأعمال',
    },
    whyUs: {
      title: 'لماذا أسس كهربا؟',
      items: [
        'تنفيذ هندسي وليس عمالة عشوائية',
        'خامات معتمدة ومطابقة للمواصفات',
        'فصل كامل للمسارات والدوائر',
        'شفافية كاملة في كل مرحلة',
        'إشراف هندسي مباشر',
        'ضمان سنة كاملة على جميع الأعمال',
      ],
    },
    contact: {
      title: 'تواصل معنا',
      description: 'نحن جاهزون لمناقشة مشروعك وتقديم الحل الهندسي الأنسب له.',
      location: '19 محمد شفيق',
      phone: '01004111999',
      email: 'info@aseskahraba.com',
      cta: 'احجز معاينة',
    },
    footer: {
      rights: 'جميع الحقوق محفوظة',
      company: 'أسس كهربا',
    },
    blog: {
      title: 'المدونة',
      subtitle: 'مقالات ونصائح في مجال الكهرباء',
      readMore: 'اقرأ المزيد',
      backToHome: 'العودة للرئيسية',
      backToBlog: 'العودة للمدونة',
      viewAll: 'عرض جميع المقالات',
      publishedOn: 'نُشر في',
      noArticles: 'لا توجد مقالات حالياً',
    },
    admin: {
      title: 'لوحة إدارة المدونة',
      addNew: 'إضافة مقال جديد',
      editPost: 'تعديل المقال',
      deletePost: 'حذف المقال',
      confirmDelete: 'هل أنت متأكد من حذف هذا المقال؟',
      titleAr: 'العنوان بالعربية',
      titleEn: 'العنوان بالإنجليزية',
      contentAr: 'المحتوى بالعربية',
      contentEn: 'المحتوى بالإنجليزية',
      excerptAr: 'المقتطف بالعربية',
      excerptEn: 'المقتطف بالإنجليزية',
      slug: 'الرابط (slug)',
      imageUrl: 'رابط الصورة',
      published: 'منشور',
      save: 'حفظ',
      cancel: 'إلغاء',
      success: 'تم الحفظ بنجاح',
      error: 'حدث خطأ',
    },
  },
  en: {
    nav: {
      home: 'Home',
      about: 'About Us',
      services: 'Services',
      store: 'Store',
      projects: 'Projects',
      whyUs: 'Why Us',
      blog: 'Blog',
      contact: 'Contact',
    },
    hero: {
      tagline: 'Electrical Work Done Right — From Day One',
      subtitle: 'Certified Engineering | No Compromises | 1-Year Warranty',
      cta: 'Request Engineering Visit',
      ctaSecondary: 'Contact Us',
    },
    about: {
      title: 'About Us',
      content: `Ases Kahraba is a professional electrical services company with hands-on experience since 2012 in electrical infrastructure, low current systems, and smart home solutions.

We believe electrical work is an engineering discipline—not guesswork. Every project is designed and executed using certified materials, proper calculations, and direct engineering supervision, fully compliant with local and international standards.

Our mission is to deliver safe, reliable, and future-ready electrical systems.`,
      experience: 'Years of Experience',
      experienceValue: '12+',
    },
    services: {
      title: 'Our Services',
      items: [
        {
          title: 'Electrical Infrastructure & Finishing',
          description: 'Full electrical infrastructure and finishing works for residential units and villas',
        },
        {
          title: 'Distribution Boards',
          description: 'Main and sub distribution boards with the highest quality and safety standards',
        },
        {
          title: 'Load Calculation & Protection',
          description: 'Load calculation and protection systems with engineering precision',
        },
        {
          title: 'Low Current Systems',
          description: 'Low current systems (LAN, CCTV, Intercom, Audio systems)',
        },
        {
          title: 'Smart Home Systems',
          description: 'Smart home systems (infrastructure, installation, commissioning)',
        },
        {
          title: 'Testing & Reports',
          description: 'Testing, commissioning, and detailed technical handover reports',
        },
        {
          title: 'Earthing Systems',
          description: 'Installation of earthing and grounding systems for lightning and electrical leakage protection',
        },
      ],
    },
    store: {
      title: 'Store',
      subtitle: 'Certified Electrical Products & Professional Tools',
      description: 'Discover our collection of certified electrical products and professional tools for all your electrical needs',
      viewAll: 'View All Products',
      categories: [
        {
          title: 'Electrical Tools',
          description: 'Professional tools for electrical work',
        },
        {
          title: 'Spare Parts',
          description: 'Certified spare parts meeting specifications',
        },
        {
          title: 'Safety Equipment',
          description: 'Electrical protection and safety devices',
        },
        {
          title: 'Lighting',
          description: 'Modern and efficient lighting systems',
        },
      ],
    },
    projects: {
      title: 'Our Projects',
      description: 'We have delivered electrical works for residential units, villas, basements, and private projects—each with unique requirements, yet all executed with the same engineering precision and quality standards.',
      viewAll: 'View All Projects',
    },
    whyUs: {
      title: 'Why Ases Kahraba?',
      items: [
        'Engineering-based execution',
        'Certified materials & standards compliance',
        'Proper circuit and path separation',
        'Full transparency',
        'Direct engineering supervision',
        '1-year warranty on all installations',
      ],
    },
    contact: {
      title: 'Contact Us',
      description: "Let's discuss your project and provide the right engineering solution.",
      location: '19 Mohammed Shafeek',
      phone: '+20 100 411 1999',
      email: 'info@aseskahraba.com',
      cta: 'Book a Visit',
    },
    footer: {
      rights: 'All Rights Reserved',
      company: 'Ases Kahraba',
    },
    blog: {
      title: 'Blog',
      subtitle: 'Articles and tips about electrical work',
      readMore: 'Read More',
      backToHome: 'Back to Home',
      backToBlog: 'Back to Blog',
      viewAll: 'View All Articles',
      publishedOn: 'Published on',
      noArticles: 'No articles available',
    },
    admin: {
      title: 'Blog Admin Panel',
      addNew: 'Add New Article',
      editPost: 'Edit Article',
      deletePost: 'Delete Article',
      confirmDelete: 'Are you sure you want to delete this article?',
      titleAr: 'Title (Arabic)',
      titleEn: 'Title (English)',
      contentAr: 'Content (Arabic)',
      contentEn: 'Content (English)',
      excerptAr: 'Excerpt (Arabic)',
      excerptEn: 'Excerpt (English)',
      slug: 'URL Slug',
      imageUrl: 'Image URL',
      published: 'Published',
      save: 'Save',
      cancel: 'Cancel',
      success: 'Saved successfully',
      error: 'An error occurred',
    },
  },
};

export function getDirection(lang: Language): 'rtl' | 'ltr' {
  return lang === 'ar' ? 'rtl' : 'ltr';
}
