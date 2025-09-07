import CartTab from "@/components/CartTab";

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <CartTab />
      {children}
    </main>
  );
}
