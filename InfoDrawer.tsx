import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useLanguage } from "@/hooks/use-language";
import { Menu, Mail, Phone, ExternalLink, ShieldCheck, Clock, Zap, Copy, Check, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export function InfoDrawer() {
  const { language, isRTL } = useLanguage();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const benefits = [
    {
      icon: <Zap className="text-amber-400 icon-glow" size={22} />,
      titleAr: "تفعيل فوري",
      titleEn: "Instant Activation",
      descAr: "احصل على اشتراكك خلال دقائق معدودة",
      descEn: "Get your subscription within minutes",
      color: "from-amber-500/20 to-orange-500/20"
    },
    {
      icon: <ShieldCheck className="text-emerald-400 icon-glow" size={22} />,
      titleAr: "ضمان كامل",
      titleEn: "Full Guarantee",
      descAr: "جميع الاشتراكات رسمية ومضمونة 100%",
      descEn: "All subscriptions are official and 100% guaranteed",
      color: "from-emerald-500/20 to-green-500/20"
    },
    {
      icon: <Clock className="text-blue-400 icon-glow" size={22} />,
      titleAr: "دعم 24/7",
      titleEn: "24/7 Support",
      descAr: "فريق دعم متخصص لخدمتكم على مدار الساعة",
      descEn: "Dedicated support team available around the clock",
      color: "from-blue-500/20 to-cyan-500/20"
    }
  ];

  const copyIBAN = async () => {
    await navigator.clipboard.writeText('SA0315000900133520020007');
    setCopied(true);
    toast({
      title: language === 'ar' ? 'تم النسخ' : 'Copied!',
      description: language === 'ar' ? 'تم نسخ الآيبان بنجاح' : 'IBAN copied to clipboard'
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`fixed top-4 sm:top-6 ${isRTL ? 'right-4 sm:right-6' : 'left-4 sm:left-6'} z-40 w-12 h-12 rounded-2xl glass flex items-center justify-center text-white/70 hover:text-white border border-white/10 hover:border-white/20 transition-all shadow-xl`}
          data-testid="button-menu"
        >
          <Menu size={20} />
        </motion.button>
      </SheetTrigger>
      
      <SheetContent 
        side={isRTL ? 'right' : 'left'} 
        className="w-[340px] sm:w-[380px] bg-background/98 backdrop-blur-2xl border-white/10 p-0 overflow-hidden"
      >
        <div className="relative h-28 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 via-pink-500/20 to-transparent" />
          <motion.div
            animate={{ 
              x: [0, 20, 0],
              y: [0, -10, 0],
            }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-0 left-0 w-40 h-40 rounded-full blur-3xl bg-purple-500/30"
          />
          
          <SheetHeader className="relative z-10 h-full flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2"
            >
              <Sparkles size={20} className="text-purple-400 icon-glow" />
              <SheetTitle className="text-3xl font-black text-gradient-white tracking-tight">
                NIKAI
              </SheetTitle>
              <Sparkles size={20} className="text-pink-400 icon-glow" />
            </motion.div>
          </SheetHeader>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-180px)]">
          <motion.section 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">
              {language === 'ar' ? 'لماذا تختارنا؟' : 'Why Choose Us?'}
            </h3>
            <div className="space-y-3">
              {benefits.map((item, idx) => (
                <motion.div 
                  key={idx}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, x: isRTL ? -5 : 5 }}
                  className={`flex gap-4 p-4 rounded-xl bg-gradient-to-r ${item.color} border border-white/5 hover:border-white/10 transition-all cursor-default`}
                >
                  <div className="mt-0.5 flex-shrink-0">{item.icon}</div>
                  <div>
                    <h4 className="font-bold text-sm mb-1 text-white">
                      {language === 'ar' ? item.titleAr : item.titleEn}
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {language === 'ar' ? item.descAr : item.descEn}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          <motion.section 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">
              {language === 'ar' ? 'تواصل معنا' : 'Contact Us'}
            </h3>
            
            <motion.a 
              href="mailto:iioe@outlook.sa" 
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-3 p-4 rounded-xl glass hover:bg-white/10 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                <Mail size={18} className="text-purple-400" />
              </div>
              <div className="flex-1">
                <span className="text-sm font-semibold block">iioe@outlook.sa</span>
                <span className="text-xs text-muted-foreground">{language === 'ar' ? 'البريد الإلكتروني' : 'Email'}</span>
              </div>
              <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" />
            </motion.a>
            
            <motion.a 
              href="tel:0591388202" 
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-3 p-4 rounded-xl glass hover:bg-white/10 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                <Phone size={18} className="text-green-400" />
              </div>
              <div className="flex-1">
                <span className="text-sm font-semibold block">0591388202</span>
                <span className="text-xs text-muted-foreground">{language === 'ar' ? 'الهاتف' : 'Phone'}</span>
              </div>
              <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" />
            </motion.a>
          </motion.section>

          <motion.section 
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="p-5 rounded-2xl bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-transparent border border-white/10 space-y-4"
          >
            <h3 className="font-bold text-sm flex items-center gap-2">
              <span className="text-purple-400">💳</span>
              {language === 'ar' ? 'الحساب البنكي' : 'Bank Account'}
            </h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">{language === 'ar' ? 'البنك' : 'Bank'}</span>
                <span className="font-semibold">{language === 'ar' ? 'بنك البلاد' : 'Bank Albilad'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">{language === 'ar' ? 'المستفيد' : 'Beneficiary'}</span>
                <span className="font-semibold">{language === 'ar' ? 'سليمان فلاته' : 'Sulaiman Fallatah'}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 mt-3">
              <div className="flex-1 bg-black/30 rounded-xl px-3 py-3 font-mono text-xs tracking-wide text-center overflow-hidden">
                <span className="text-white/80">SA0315000900133520020007</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={copyIBAN}
                className={`p-3 rounded-xl transition-all ${
                  copied 
                    ? 'bg-green-500 text-white' 
                    : 'bg-purple-500 text-white hover:bg-purple-600'
                }`}
                data-testid="button-copy-iban-drawer"
              >
                <AnimatePresence mode="wait">
                  {copied ? (
                    <motion.div
                      key="check"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <Check size={16} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="copy"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <Copy size={16} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </motion.section>
        </div>
        
        <div className="absolute bottom-0 left-0 w-full p-4 border-t border-white/5 bg-background/80 backdrop-blur-sm">
          <p className="text-center text-[10px] text-muted-foreground">
            © 2024 NIKAI Digital Store. {language === 'ar' ? 'جميع الحقوق محفوظة' : 'All rights reserved'}
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}