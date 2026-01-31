import { useOrders } from "@/hooks/use-orders";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/hooks/use-auth";
import { FloatingBlobs } from "@/components/FloatingBlobs";
import { NavigationDock } from "@/components/NavigationDock";
import { motion } from "framer-motion";
import { Loader2, Package, Clock, CheckCircle } from "lucide-react";
import { Redirect } from "wouter";

export default function Dashboard() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { data: orders, isLoading: isOrdersLoading } = useOrders();
  const { language } = useLanguage();

  if (isAuthLoading) return null;
  if (!user) return <Redirect to="/" />;

  return (
    <div className="min-h-screen relative overflow-hidden text-foreground">
      <FloatingBlobs />
      <NavigationDock />

      <main className="container mx-auto px-4 pt-32 pb-20 max-w-4xl relative z-10">
        <header className="mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-3xl md:text-5xl font-black mb-4">
              {language === 'ar' ? 'لوحة التحكم' : 'Dashboard'}
            </h1>
            <p className="text-muted-foreground text-lg">
              {language === 'ar' ? `مرحباً، ${user.username || 'عميلنا العزيز'}` : `Welcome back, ${user.username || 'Valued Customer'}`}
            </p>
          </motion.div>
        </header>

        <section className="space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Package className="text-primary" />
            {language === 'ar' ? 'طلباتي' : 'My Orders'}
          </h2>

          {isOrdersLoading ? (
            <div className="flex justify-center h-32 items-center">
              <Loader2 className="animate-spin text-primary" />
            </div>
          ) : orders && orders.length > 0 ? (
            <div className="grid gap-4">
              {orders.map((order, i) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass rounded-2xl p-6 border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-bold"
                      style={{ backgroundColor: order.product.color }}
                    >
                      {order.product.nameEn.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">
                        {language === 'ar' ? order.product.nameAr : order.product.nameEn}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {language === 'ar' ? order.plan.nameAr : order.plan.nameEn} • {order.plan.price} SAR
                      </p>
                      <div className="text-xs text-muted-foreground mt-1 opacity-60">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span 
                      className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 
                        ${order.status === 'completed' 
                          ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                          : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'}`}
                    >
                      {order.status === 'completed' ? <CheckCircle size={12} /> : <Clock size={12} />}
                      {order.status === 'completed' 
                        ? (language === 'ar' ? 'مكتمل' : 'Completed')
                        : (language === 'ar' ? 'قيد الانتظار' : 'Pending')}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 glass rounded-2xl border border-white/5">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">
                {language === 'ar' ? 'لا توجد طلبات حتى الآن' : 'No orders found yet'}
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}